import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bros_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Display both currencies. HUF uses an approximate rate for placeholder pricing.
const HUF_PER_EUR = 400;
export function priceLabel(eur) {
  if (eur == null) return "";
  const huf = Math.round(eur * HUF_PER_EUR);
  return `€${eur.toFixed(2)} · ${huf.toLocaleString("hu-HU")} Ft`;
}

export function formatError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export function getSessionId() {
  let s = localStorage.getItem("bros_session");
  if (!s) {
    s = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("bros_session", s);
  }
  return s;
}

export function track(type, extra = {}) {
  // Fire-and-forget analytics. Must NEVER surface as an unhandled rejection.
  try {
    api.post("/track", { type, session_id: getSessionId(), ...extra }).catch(() => {});
  } catch (e) {
    /* ignore */
  }
}

export default api;
