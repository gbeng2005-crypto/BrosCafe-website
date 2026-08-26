import React, { useState } from "react";
import { useLang } from "@/loyalty/i18n";
import { Coffee, X, ArrowClockwise } from "@phosphor-icons/react";

const MOMENTS = {
  hu: [
    "Lassíts. A jó kávét nem sietik el. ☕",
    "A legjobb beszélgetések egy csésze mellett születnek.",
    "Ma is megérdemelsz egy nyugodt percet.",
    "Egy korty, egy mély levegő — máris jobb a reggel.",
    "A kávé közös nyelv. Örülünk, hogy beszéled. 🤎",
    "Kevesebb rohanás, több íz.",
  ],
  en: [
    "Slow down. Good coffee is never rushed. ☕",
    "The best conversations happen over a cup.",
    "You deserve one calm minute today.",
    "One sip, one deep breath — mornings just got better.",
    "Coffee is a shared language. Glad you speak it. 🤎",
    "Less rushing, more flavour.",
  ],
};

export function BrosMoment({ open, onClose }) {
  const { t, lang } = useLang();
  const pool = MOMENTS[lang] || MOMENTS.en;
  const [i, setI] = useState(() => Math.floor(Math.random() * pool.length));
  if (!open) return null;

  const next = () => setI((p) => (p + 1) % pool.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bros-ink/40 px-6 backdrop-blur-sm"
      onClick={onClose}
      data-testid="bros-moment-overlay"
    >
      <div
        className="relative w-full max-w-sm rounded-[2rem] bg-white px-8 py-10 text-center shadow-[0_24px_70px_rgba(102,115,74,0.30)] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} data-testid="bros-moment-close" className="absolute right-5 top-5 text-bros-muted hover:text-bros-ink">
          <X size={20} />
        </button>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(102,115,74,0.12)]">
          <Coffee size={28} weight="fill" color="#66734A" />
        </span>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-bros-olive">{t("bros_moment_title")}</p>
        <p className="mt-3 font-display text-2xl leading-snug text-bros-ink" data-testid="bros-moment-text">{pool[i]}</p>
        <button
          onClick={next}
          data-testid="bros-moment-another"
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-bros-olive px-5 py-2.5 text-sm font-semibold text-bros-olive transition-colors hover:bg-bros-cream"
        >
          <ArrowClockwise size={16} /> {t("bros_moment_another")}
        </button>
      </div>
    </div>
  );
}
