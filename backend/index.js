require("dotenv").config();

const PORT = Number(process.env.PORT || 8000);
const uri = process.env.MONGODB_URL;
const JWT_ISSUER = process.env.JWT_ISSUER || "finovate-api";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "finovate-dashboard";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const AUTH_HANDOFF_TTL_SECONDS = Math.min(
  Math.max(Number(process.env.AUTH_HANDOFF_TTL_SECONDS || 60), 30),
  300
);
const BCRYPT_SALT_ROUNDS = 12;
const allowedOrigins = (process.env.CORS_ORIGINS ||
  "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!uri) {
  throw new Error("MONGODB_URL is required. Add it to backend/.env before starting the API.");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Add a unique local secret to backend/.env.");
}

const JWT_SECRET = process.env.JWT_SECRET;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

// Lightweight fetch polyfill for environments where global fetch is unavailable (e.g., Node < 18)
// This is used by the Gemini AI fallback path below.
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");
const UserData = require("./models/UserModel");
const { WatchlistModel } = require("./models/WatchlistModel");
const { AuthHandoffModel } = require("./models/AuthHandoffModel");
const { authenticateToken } = require("./middleware/auth");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed"));
    },
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86_400,
  })
);
app.use(express.json({ limit: "100kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many sign-in attempts. Please try again later." },
});

const handoffLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many dashboard handoff attempts. Please sign in again." },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "AI request limit reached. Please try again later." },
});

app.use(apiLimiter);

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const normalizeSymbol = (value) =>
  typeof value === "string" ? value.trim().toUpperCase() : "";

const isValidSymbol = (symbol) => /^[A-Z0-9][A-Z0-9.&-]{0,19}$/.test(symbol);

const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 10 || password.length > 128) {
    return "Password must be between 10 and 128 characters.";
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Password must include uppercase, lowercase, and number characters.";
  }
  return null;
};

const hashHandoffCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const toPublicUser = (user) => ({
  id: String(user._id),
  email: user.email,
});

const issueAccessToken = (user) =>
  jwt.sign(
    {
      id: String(user._id),
      email: user.email,
      tokenType: "access",
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );

const createHandoffCode = async (user) => {
  const code = crypto.randomBytes(32).toString("base64url");
  await AuthHandoffModel.create({
    codeHash: hashHandoffCode(code),
    userId: user._id,
    expiresAt: new Date(Date.now() + AUTH_HANDOFF_TTL_SECONDS * 1000),
  });
  return code;
};

// Watchlist routes
app.get("/watchlist", authenticateToken, async (req, res) => {
  try {
    const watchlist = await WatchlistModel.find({ userId: req.user.id }).sort({ addedAt: -1 });
    res.json(watchlist.map(item => item.symbol));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
});

app.post("/watchlist", authenticateToken, async (req, res) => {
  try {
    const symbol = normalizeSymbol(req.body?.symbol);

    if (!isValidSymbol(symbol)) {
      return res.status(400).json({ message: "Enter a valid stock symbol." });
    }

    // Check if already in watchlist
    const existing = await WatchlistModel.findOne({ 
      userId: req.user.id, 
      symbol,
    });

    if (existing) {
      return res.status(400).json({ message: "Stock already in watchlist" });
    }

    const watchlistItem = new WatchlistModel({
      userId: req.user.id,
      symbol,
    });

    await watchlistItem.save();
    res.status(201).json({ message: "Stock added to watchlist", symbol });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Stock is already in your watchlist." });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to add stock to watchlist" });
  }
});

app.delete("/watchlist/:symbol", authenticateToken, async (req, res) => {
  try {
    const symbol = normalizeSymbol(req.params.symbol);

    if (!isValidSymbol(symbol)) {
      return res.status(400).json({ message: "Enter a valid stock symbol." });
    }
    
    const result = await WatchlistModel.findOneAndDelete({
      userId: req.user.id,
      symbol,
    });

    if (!result) {
      return res.status(404).json({ message: "Stock not found in watchlist" });
    }

    res.json({ message: "Stock removed from watchlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove stock from watchlist" });
  }
});

// AI Insights proxy (Gemini)
app.post('/ai/insights', authenticateToken, aiLimiter, async (req, res) => {
  // Helper to always produce HTML from markdown, even if 'marked' fails
  const mdToHtml = async (md = '') => {
    try {
      const { marked } = await import('marked');
      return marked.parse(md || '');
    } catch {
      // Minimal fallback: paragraphs + bold
      const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const p = esc(md).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<div>${p.split(/\n\n+/).map(x=>`<p>${x.replace(/\n/g,'<br>')}</p>`).join('')}</div>`;
    }
  };

  try {
    const { symbol: rawSymbol, history = [], extraContext = '' } = req.body || {};
    const symbol = normalizeSymbol(rawSymbol);
    if (!isValidSymbol(symbol)) {
      return res.status(400).json({ message: "Enter a valid stock symbol." });
    }
    if (!Array.isArray(history) || history.length > 1500) {
      return res.status(400).json({ message: "Price history must contain at most 1500 records." });
    }
    const GEMINI_KEY = (
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || ""
    ).trim();
    if (!GEMINI_KEY) {
      const html = await mdToHtml('Gemini API key not configured on server');
      return res.status(500).json({ message: 'Gemini API key not configured on server', html, text: 'Gemini API key not configured on server' });
    }

    // Prepare history and simple stats
    const hist = (history || []).map(p => ({ date: new Date(p.date), close: Number(p.close) }))
      .filter(p => !Number.isNaN(p.close))
      .sort((a,b) => a.date - b.date);
    const first = hist[0]?.close ?? 0;
    const last = hist[hist.length-1]?.close ?? 0;
    const cagr = (first>0 && last>0) ? Math.pow(last/first, 1/5)-1 : 0;
    let peak = first || 0; let maxDrawdown=0;
    for (const p of hist) { peak = Math.max(peak, p.close); const dd = (p.close-peak)/peak; if (dd<maxDrawdown) maxDrawdown=dd; }

    const prompt = `Create a professional research brief (~500–700 words) for the stock below with clear section headings in markdown. Sections to include:\n1) Overview (business, listing exchange)\n2) 5-year performance (CAGR, annualized volatility, max drawdown)\n3) Trend & key levels (recent momentum, support/resistance, notable inflection dates)\n4) Risks & what to watch\n5) Catalysts (near-term and medium-term)\n6) Outlook scenarios (bull / base / bear) with important levels\n7) Concise closing summary with actionable watchpoints.\n\nCRITICAL FORMAT & LOCALE RULES:\n- Assume Indian markets (NSE/BSE) and use Indian Rupee only.\n- Currency must be INR with the rupee symbol (₹) everywhere.\n- Do NOT use the $ symbol or USD unless explicitly stated; convert to ₹ if any figures are mentioned.\n- Indian numbering (lakh/crore) is acceptable when it improves readability.\n- If data is unknown, state it explicitly; do not fabricate.\n\nSymbol: ${symbol}\nCAGR: ${(cagr*100).toFixed(2)}%  MaxDD: ${(maxDrawdown*100).toFixed(2)}%\nHistory (date, close):\n${hist.slice(-750).map(p=>`${p.date.toISOString().slice(0,10)}, ${p.close}`).join('\n')}\n${extraContext ? `\nExtra context: ${extraContext}` : ''}`;

    // Call Gemini via REST using a single fast model to keep latency low.
    try {
      const MODEL = 'gemini-2.5-flash';
      const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`;
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const raw = await r.text().catch(() => '');
      if (!r.ok) {
        let providerMessage = raw || "Gemini error";
        try {
          providerMessage = JSON.parse(raw)?.error?.message || providerMessage;
        } catch {
          // Use the provider response as a fallback when it is not JSON.
        }

        const message =
          r.status === 400 && /API key not valid|API_KEY_INVALID/i.test(providerMessage)
            ? "Gemini rejected the configured API key. Create or select a valid Gemini API key, update GEMINI_API_KEY in backend/.env, and restart the backend."
            : "Gemini request failed (" + r.status + "): " + providerMessage;
        const html = await mdToHtml(message);
        return res.status(r.status).json({
          message,
          html,
          text: message,
        });
      }

      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        // If parsing fails, just return the raw text as the response body.
        const html = await mdToHtml(raw || 'Gemini response parse error');
        return res.json({ text: raw || 'Gemini response parse error', html });
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const html = await mdToHtml(text || '');
      return res.json({ text, html });
    } catch (sdkErr) {
      console.error('Gemini REST call failed:', sdkErr);
      const html = await mdToHtml('Gemini API call failed.');
      return res
        .status(500)
        .json({ message: 'Gemini API call failed.', html, text: 'Gemini API call failed.' });
    }
  } catch (e) {
    console.error('AI insights proxy failed:', e);
    res.status(500).json({ message: 'AI insights failed', html: '<p>AI insights failed.</p>', text: 'AI insights failed.' });
  }
});

app.get("/allHoldings", authenticateToken, async (req, res) => {
  try {
    // Get holdings for the authenticated user
    let allHoldings = await HoldingsModel.find({ userId: req.user.id });
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", authenticateToken, async (req, res) => {
  try {
    // Get positions for the authenticated user
    let allPositions = await PositionsModel.find({ userId: req.user.id });
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch positions" });
  }
});

app.post("/newOrder", authenticateToken, async (req, res) => {
  const name = normalizeSymbol(req.body?.name);
  const qty = Number(req.body?.qty);
  const price = Number(req.body?.price);
  const mode = typeof req.body?.mode === "string" ? req.body.mode.toUpperCase() : "";
  const userId = req.user.id;

  try {
    if (!isValidSymbol(name)) {
      return res.status(400).json({ message: "Enter a valid stock symbol." });
    }
    if (!Number.isSafeInteger(qty) || qty < 1 || qty > 100000) {
      return res.status(400).json({ message: "Quantity must be a whole number between 1 and 100,000." });
    }
    if (!Number.isFinite(price) || price <= 0 || price > 10000000) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }
    if (!["BUY", "SELL"].includes(mode)) {
      return res.status(400).json({ message: "Order mode must be BUY or SELL." });
    }

    // Update holdings based on buy/sell
    if (mode === "BUY") {
      // Check if user already has this stock
      let existingHolding = await HoldingsModel.findOne({ userId, name });

      if (existingHolding) {
        // Update existing holding - calculate new average price
        const totalQty = existingHolding.qty + qty;
        const totalCost = existingHolding.avg * existingHolding.qty + price * qty;
        const newAvg = totalCost / totalQty;

        existingHolding.qty = totalQty;
        existingHolding.avg = newAvg;
        existingHolding.price = price;
        await existingHolding.save();
      } else {
        // Create new holding
        const newHolding = new HoldingsModel({
          userId,
          name,
          qty,
          avg: price,
          price: price,
          net: "0.00%",
          day: "0.00%",
        });
        await newHolding.save();
      }
    } else if (mode === "SELL") {
      // Find existing holding
      let existingHolding = await HoldingsModel.findOne({ userId, name });

      if (existingHolding) {
        if (existingHolding.qty >= qty) {
          // Reduce quantity
          existingHolding.qty -= qty;

          if (existingHolding.qty === 0) {
            // Remove holding if quantity becomes 0
            await HoldingsModel.deleteOne({ _id: existingHolding._id });
          } else {
            // Update price
            existingHolding.price = price;
            await existingHolding.save();
          }
        } else {
          return res.status(400).json({ message: "Insufficient quantity to sell" });
        }
      } else {
        return res.status(400).json({ message: "You don't own this stock" });
      }
    }

    const newOrder = new OrdersModel({
      userId,
      name,
      qty,
      price,
      mode,
      date: new Date(),
    });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

app.get("/orders", authenticateToken, async (req, res) => {
  try {
    // Get orders for the authenticated user
    const orders = await OrdersModel.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get("/holdings/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  if (String(req.user.id) !== String(userId)) {
    return res.status(403).json({ message: "You can only access your own holdings." });
  }

  try {
    const userHoldings = await HoldingsModel.find({ userId });
    res.json(userHoldings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.post("/auth/handoff/exchange", handoffLimiter, async (req, res) => {
  const code = typeof req.body?.code === "string" ? req.body.code : "";
  if (!/^[A-Za-z0-9_-]{40,128}$/.test(code)) {
    return res.status(400).json({ message: "The sign-in handoff is invalid or has expired. Please sign in again." });
  }

  try {
    const handoff = await AuthHandoffModel.findOneAndDelete({
      codeHash: hashHandoffCode(code),
      expiresAt: { $gt: new Date() },
    });

    if (!handoff) {
      return res.status(400).json({ message: "The sign-in handoff is invalid or has expired. Please sign in again." });
    }

    const user = await UserData.findById(handoff.userId);
    if (!user) {
      return res.status(400).json({ message: "The sign-in handoff is invalid or has expired. Please sign in again." });
    }

    return res.json({
      token: issueAccessToken(user),
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("Handoff exchange error:", err);
    return res.status(500).json({ message: "Unable to complete sign-in. Please try again." });
  }
});

app.post("/signup", authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const newUser = new UserData({
      email,
      password: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS),
    });

    await newUser.save();
    const handoffCode = await createHandoffCode(newUser);

    return res.status(201).json({
      message: "Account created.",
      handoffCode,
      user: toPublicUser(newUser),
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "An account already exists for this email." });
    }
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserData.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const handoffCode = await createHandoffCode(user);

    return res.status(200).json({
      message: "Signed in.",
      handoffCode,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Verify token endpoint
app.get("/verify", authenticateToken, (req, res) => {
  // If authenticateToken middleware passes, token is valid
  res.json({
    valid: true,
    user: { id: req.user.id, email: req.user.email },
  });
});

// Add sample positions for testing (DEVELOPMENT ONLY)
app.post("/addSamplePositions", authenticateToken, async (req, res) => {
  if (process.env.ENABLE_SAMPLE_DATA !== "true") {
    return res.status(404).json({ message: "Sample data is disabled." });
  }

  try {
    const userId = req.user.id;

    // Clear existing positions
    await PositionsModel.deleteMany({ userId });

    // Sample positions
    const samplePositions = [
      {
        userId,
        product: "MIS", // Intraday
        name: "EVEREADY",
        qty: 2,
        avg: 316.27,
        price: 312.35,
        net: "-1.24%",
        day: "-1.24%",
        isLoss: true,
      },
      {
        userId,
        product: "CNC", // Delivery
        name: "JUBLFOOD",
        qty: 1,
        avg: 3124.75,
        price: 3082.65,
        net: "-1.35%",
        day: "-1.35%",
        isLoss: true,
      },
    ];

    await PositionsModel.insertMany(samplePositions);

    res.status(201).json({ 
      message: "Sample positions added successfully",
      count: samplePositions.length 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add sample positions" });
  }
});

app.use((err, req, res, next) => {
  if (err?.message === "Origin is not allowed") {
    return res.status(403).json({ message: "This origin is not allowed to access the API." });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }

  console.error("Unhandled API error:", err);
  return res.status(500).json({ message: "Internal server error." });
});

const startServer = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("App started on port " + PORT);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
