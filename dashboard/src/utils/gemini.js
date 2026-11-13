// Gemini client backed by the dashboard API proxy.
import api from "./axios";

export async function generateStockInsights({ symbol, history, extraContext }) {
  try {
    const all = history || [];
    const step = Math.max(1, Math.ceil(all.length / 300));
    const sampled = all.filter((_, i) => i % step === 0 || i === all.length - 1);

    const payload = {
      symbol,
      history: sampled.map((p) => ({ date: p.date.toISOString(), close: p.close })),
      extraContext,
    };
  } catch (proxyErr) {
    // Surface backend error directly in the UI instead of falling back to browser fetch,
    // which often results in an unhelpful "Failed to fetch".
    const backendMessage =
      proxyErr?.response?.data?.message ||
      proxyErr?.response?.data?.error ||
      proxyErr?.message;

    throw new Error(backendMessage || "AI insights backend error");
  }
}
