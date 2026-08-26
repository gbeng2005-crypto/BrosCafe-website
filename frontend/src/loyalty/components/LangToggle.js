import React from "react";
import { useLang } from "@/loyalty/i18n";

// Compact HU / EN switch for the customer-facing pages.
export const LangToggle = ({ light = false }) => {
  const { lang, setLang } = useLang();
  const base = "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors";
  const activeCls = light ? "bg-bros-cream text-bros-ink" : "bg-bros-olive text-white";
  const idleCls = light ? "text-bros-cream/70" : "text-bros-muted";
  const wrap = light ? "border-white/20" : "border-bros-border bg-white";
  return (
    <div className={`flex items-center gap-0.5 rounded-full border p-0.5 ${wrap}`} data-testid="lang-toggle">
      {["hu", "en"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          data-testid={`lang-${l}`}
          className={`${base} ${lang === l ? activeCls : idleCls}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LangToggle;
