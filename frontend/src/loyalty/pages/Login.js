import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/loyalty/context/AuthContext";
import { formatError } from "@/loyalty/lib/api";
import { Coffee } from "@phosphor-icons/react";
import logoFull from "@/loyalty/assets/logo-full-olive.png";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/staff", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login(email, password);
      navigate(u.role === "admin" ? "/admin" : "/staff", { replace: true });
    } catch (err) {
      setError(formatError(err.response?.data?.detail) || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bros-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <img src={logoFull} alt="BrosCafé" className="h-32 w-auto" />
        </div>
        <div className="rounded-[2rem] border border-bros-border bg-white p-8 shadow-[0_10px_40px_rgba(102,115,74,0.08)]">
          <h1 className="font-display text-2xl text-bros-ink">Staff Login</h1>
          <p className="mt-1 text-sm text-bros-muted">For Bros Cafe staff &amp; admins only — sign in to scan cards and manage rewards.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              data-testid="login-email-input"
              className="h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              data-testid="login-password-input"
              className="h-12 w-full rounded-xl border border-bros-border bg-white px-4 text-bros-ink outline-none focus:border-bros-olive focus:ring-2 focus:ring-bros-olive/30"
              required
            />
            {error && (
              <p className="text-sm text-red-600" data-testid="login-error">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              data-testid="login-submit-btn"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive font-semibold text-white transition-colors hover:bg-bros-olive-dark disabled:opacity-60"
            >
              <Coffee size={18} weight="fill" /> {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full text-center text-xs text-bros-muted hover:text-bros-olive"
        >
          ← Back to Bros Cafe
        </button>
        <p className="mt-4 rounded-xl border border-bros-border bg-white px-4 py-3 text-center text-xs leading-relaxed text-bros-muted">
          Are you a customer? You don't need a password — head to the{" "}
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer font-semibold text-bros-olive hover:underline"
          >
            home page
          </span>{" "}
          to get or find your loyalty card.
        </p>
      </div>
    </div>
  );
}
