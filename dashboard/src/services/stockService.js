// Demo-only market data. Do not add third-party API keys to this browser bundle.
// A production market-data provider belongs behind an authenticated backend proxy
// with licensing, source attribution, freshness metadata, and server-side secrets.

const priceCache = new Map();
const CACHE_DURATION_MS = 60 * 1000;

const finitePositive = (value, fallback = 100) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const hashSymbol = (symbol) =>
  String(symbol || "DEMO")
    .split("")
    .reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);

const round = (value) => Math.round(value * 100) / 100;

const createDemoPrice = (symbol, basePrice) => {
  const normalizedSymbol = String(symbol || "DEMO").trim().toUpperCase();
  const price = finitePositive(basePrice, 80 + (hashSymbol(normalizedSymbol) % 2200));
  const changePercent = round(Math.random() * 4 - 2);
  const change = round((price * changePercent) / 100);

  return {
    symbol: normalizedSymbol,
    price: round(price + change),
    change,
    changePercent: changePercent.toFixed(2) + "%",
    isSimulated: true,
    timestamp: new Date(),
  };
};

export const getStockPrice = async (symbol, fallbackPrice) => {
  const normalizedSymbol = String(symbol || "").trim().toUpperCase();
  if (!normalizedSymbol) {
    throw new Error("A stock symbol is required.");
  }

  const cached = priceCache.get(normalizedSymbol);
  if (cached && Date.now() - cached.cachedAt < CACHE_DURATION_MS) {
    return cached.data;
  }

  const data = createDemoPrice(normalizedSymbol, fallbackPrice);
  priceCache.set(normalizedSymbol, { data, cachedAt: Date.now() });
  return data;
};

export const getBatchStockPrices = async (symbols = [], fallbackPrices = {}) =>
  Promise.all(
    symbols.map((symbol) => {
      const normalizedSymbol = String(symbol || "").trim().toUpperCase();
      return getStockPrice(normalizedSymbol, fallbackPrices[normalizedSymbol]);
    })
  );

export const clearPriceCache = () => priceCache.clear();

export const getHistoricalDaily = async (symbol, years = 1) => {
  const normalizedSymbol = String(symbol || "").trim().toUpperCase();
  if (!normalizedSymbol) {
    throw new Error("A stock symbol is required.");
  }

  const safeYears = [0.5, 1, 2, 5].includes(Number(years)) ? Number(years) : 1;
  const points = Math.round(safeYears * 252);
  const seed = hashSymbol(normalizedSymbol);
  let price = 80 + (seed % 2200);
  const start = new Date();
  start.setDate(start.getDate() - Math.ceil(safeYears * 365));
  const history = [];

  for (let index = 0; index < points; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const day = date.getDay();
    if (day === 0 || day === 6) continue;

    const wave = Math.sin((index + seed) / 13) * 0.012;
    const noise = Math.sin((index + seed * 3) * 1.618) * 0.009;
    price = Math.max(1, price * (1 + wave + noise));
    history.push({ date, close: round(price), isSimulated: true });
  }

  return history;
};

export const calculateProfitLoss = (averagePrice, currentPrice) => {
  const average = finitePositive(averagePrice, 0);
  const current = finitePositive(currentPrice, 0);
  if (!average || !current) {
    return { amount: 0, percent: 0, isProfit: false };
  }
  const amount = round(current - average);
  const percent = round((amount / average) * 100);
  return { value: amount, percent: percent.toFixed(2), isProfit: amount >= 0 };
};

export const formatPrice = (price) => "₹" + finitePositive(price, 0).toFixed(2);

export const formatChangePercent = (percent, isProfit = Number(percent) >= 0) => {
  const value = Number(percent) || 0;
  return (isProfit ? "+" : "") + value.toFixed(2) + "%";
};
