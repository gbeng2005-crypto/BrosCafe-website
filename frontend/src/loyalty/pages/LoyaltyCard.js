import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatError, track } from "@/loyalty/lib/api";
import Nav from "@/components/Nav";
import { LoyaltyCardVisual } from "@/loyalty/components/LoyaltyCardVisual";
import { OpeningCountdown } from "@/loyalty/components/OpeningCountdown";
import { useLang } from "@/loyalty/i18n";
import { Coffee, DeviceMobile, ArrowClockwise, Confetti } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function LoyaltyCard() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");
  const [prevReward, setPrevReward] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const [cafe, setCafe] = useState({ apple_wallet_configured: false });

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/members/${code}`);
      setMember((old) => {
        if (data.reward_ready && old && !old.reward_ready) setCelebrate(true);
        return data;
      });
      setPrevReward(data.reward_ready);
    } catch (err) {
      setError(formatError(err.response?.data?.detail));
    }
  }, [code]);

  useEffect(() => {
    api.get("/cafe").then(({ data }) => setCafe(data)).catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => { load().catch(() => {}); }, 5000); // live-refresh; never let a blip throw
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (celebrate) {
      const t = setTimeout(() => setCelebrate(false), 3500);
      return () => clearTimeout(t);
    }
  }, [celebrate]);

  const addToWallet = async () => {
    track("wallet_added", { code });
    if (cafe.apple_wallet_configured) {
      window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/members/${code}/wallet/apple?lang=${lang}`;
      return;
    }
    toast(t("wallet_toast"), {
      description: t("wallet_toast_desc"),
    });
  };

  if (error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bros-cream px-6 text-center">
        <Coffee size={40} weight="fill" color="#66734A" />
        <p className="mt-4 font-display text-2xl text-bros-ink">{t("not_found_title")}</p>
        <p className="mt-1 text-sm text-bros-muted">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 h-12 rounded-xl border border-bros-olive bg-white px-6 font-semibold text-bros-olive"
        >
          {t("get_new_card")}
        </button>
      </div>
    );

  if (!member)
    return (
      <div className="flex min-h-screen items-center justify-center bg-bros-cream">
        <Coffee size={40} weight="fill" color="#66734A" className="animate-pulse" />
      </div>
    );

  return (
    <div className="min-h-screen bg-bros-cream">
      <Nav solid />
      <div className="mx-auto max-w-md px-6 pb-16 pt-24">
        <div className="flex items-center justify-end py-2">
          <button onClick={load} data-testid="refresh-card-btn" className="text-bros-muted hover:text-bros-olive" aria-label="Refresh card">
            <ArrowClockwise size={20} weight="light" />
          </button>
        </div>

        {member.reward_ready && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-bros-olive/30 bg-white px-5 py-4 animate-fade-up" data-testid="reward-banner">
            <Confetti size={26} weight="fill" color="#66734A" />
            <div>
              <p className="font-display text-lg text-bros-ink">{t("banner_earned_title")}</p>
              <p className="text-sm text-bros-muted">{t("banner_earned_sub")}</p>
            </div>
          </div>
        )}

        <div className="animate-fade-up">
          <LoyaltyCardVisual member={member} animateLast />
        </div>

        <button
          onClick={addToWallet}
          data-testid="add-to-wallet-btn"
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive text-base font-semibold text-white transition-colors hover:bg-bros-olive-dark active:scale-[0.99]"
        >
          <DeviceMobile size={20} weight="fill" /> {t("add_to_wallet")}
        </button>
        <p className="mt-3 text-center text-xs text-bros-muted">
          {t("wallet_hint")}
        </p>
        <button
          onClick={() => toast(t("google_soon"))}
          data-testid="add-google-wallet-btn"
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-bros-olive bg-white text-sm font-semibold text-bros-olive transition-colors hover:bg-bros-cream"
        >
          <DeviceMobile size={18} /> {t("add_google")}
        </button>

        {member.opening_status !== "redeemed" && (
          <div className="mt-8 rounded-[1.75rem] border border-bros-olive/40 bg-white p-6 text-center" data-testid="opening-pass">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">🎟️ {t("opening_pass_title")}</p>
            <p className="mt-2 font-display text-2xl text-bros-ink">September 16, 2026 · 8:00 AM</p>
            <p className="mt-1 text-sm font-semibold text-bros-olive">{t("opening_badge")}</p>
            <div className="mt-4" data-testid="card-countdown">
              <OpeningCountdown variant="compact" showHeader={false} />
            </div>
            <p className="mt-4 text-sm text-bros-ink">{t("opening_reserved_for_you")}</p>
            <p className="mt-1 text-sm text-bros-muted">{t("opening_mystery")}</p>
            <p className="mt-3 text-xs text-bros-muted">{t("opening_bring")}</p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-bros-border bg-white p-5 text-center">
            <p className="font-display text-3xl text-bros-olive">{member.total_coffees}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-bros-muted">{t("stat_coffees_bought")}</p>
          </div>
          <div className="rounded-2xl border border-bros-border bg-white p-5 text-center">
            <p className="font-display text-3xl text-bros-olive">{member.rewards_redeemed}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-bros-muted">{t("stat_free_coffees")}</p>
          </div>
        </div>
      </div>

      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bros-cream/70 backdrop-blur-sm">
          <div className="rounded-[2rem] bg-white px-10 py-12 text-center shadow-[0_20px_60px_rgba(102,115,74,0.25)] animate-fade-up">
            <Confetti size={52} weight="fill" color="#66734A" className="mx-auto" />
            <h2 className="mt-4 font-display text-3xl text-bros-ink">{t("celebrate_title")}</h2>
            <p className="mt-2 text-sm text-bros-muted">{t("celebrate_sub")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
