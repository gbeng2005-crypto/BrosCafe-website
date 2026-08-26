import React, { useEffect, useRef, useState } from "react";
import { api } from "@/loyalty/lib/api";
import { useLang } from "@/loyalty/i18n";

// Live, server-time-synced countdown to the Bros Cafe Grand Opening.
// variant: "hero" (large) | "compact" (inline). onOpenChange notifies parent when open.
export function OpeningCountdown({ variant = "hero", showHeader = true, onOpenChange }) {
  const { t } = useLang();
  const [openingTime, setOpeningTime] = useState(null); // ms
  const [offset, setOffset] = useState(0); // serverNow - clientNow (ms)
  const [remaining, setRemaining] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const notified = useRef(false);

  useEffect(() => {
    let mounted = true;
    api.get("/opening/status").then(({ data }) => {
      if (!mounted) return;
      const server = new Date(data.server_time).getTime();
      setOffset(server - Date.now());
      setOpeningTime(new Date(data.opening_time).getTime());
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!openingTime) return;
    const tick = () => {
      const now = Date.now() + offset;
      const diff = openingTime - now;
      if (diff <= 0) {
        setIsOpen(true);
        setRemaining({ d: 0, h: 0, m: 0, s: 0 });
        if (!notified.current) { notified.current = true; onOpenChange && onOpenChange(true); }
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [openingTime, offset, onOpenChange]);

  if (isOpen) {
    return (
      <div className="text-center animate-fade-up" data-testid="opening-live">
        <p className="font-display text-4xl leading-tight text-bros-olive sm:text-5xl">{t("opening_were_open_title")}</p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-bros-muted">{t("opening_were_open_sub")}</p>
      </div>
    );
  }

  if (!remaining) {
    return <div className="h-24 w-full animate-pulse rounded-2xl bg-white/40" />;
  }

  const compact = variant === "compact";
  const units = [
    { v: remaining.d, l: t("opening_days"), key: "days" },
    { v: remaining.h, l: t("opening_hours"), key: "hours" },
    { v: remaining.m, l: t("opening_minutes"), key: "minutes" },
    { v: remaining.s, l: t("opening_seconds"), key: "seconds" },
  ];

  return (
    <div className="w-full" data-testid="opening-countdown">
      {showHeader && (
        <div className="mb-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-bros-olive">{t("opening_grand_title")}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-bros-muted">{t("opening_date_line")}</p>
        </div>
      )}
      <div className={compact ? "grid grid-cols-4 gap-2" : "grid grid-cols-4 gap-3"}>
        {units.map((u) => (
          <div
            key={u.l}
            className={
              "flex flex-col items-center justify-center rounded-2xl border border-bros-olive/15 bg-white shadow-[0_8px_28px_rgba(102,115,74,0.08)] " +
              (compact ? "py-3" : "py-5")
            }
          >
            <span
              className={
                "font-display tabular-nums leading-none text-bros-ink " +
                (compact ? "text-2xl" : "text-4xl sm:text-5xl")
              }
              data-testid={`countdown-${u.key}`}
            >
              {String(u.v).padStart(2, "0")}
            </span>
            <span className={"mt-1.5 font-semibold uppercase tracking-[0.12em] text-bros-muted " + (compact ? "text-[9px]" : "text-[10px]")}>
              {u.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
