const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const issuer = process.env.JWT_ISSUER || "finovate-api";
const audience = process.env.JWT_AUDIENCE || "finovate-dashboard";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    secret,
    {
      algorithms: ["HS256"],
      issuer,
      audience,
    },
    (err, user) => {
      if (err || user.tokenType !== "access") {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = user;
      next();
    }
  );
};

module.exports = { authenticateToken };
