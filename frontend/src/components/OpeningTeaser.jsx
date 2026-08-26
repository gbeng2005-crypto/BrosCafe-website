import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useApp } from "@/store/AppStore";
import { useCustomer } from "@/loyalty/context/CustomerAuthContext";
import { EXTRA } from "@/i18n-extra";

const FALLBACK = new Date("2026-09-16T08:00:00+02:00").getTime();

export default function OpeningTeaser() {
  const { lang } = useApp();
  const { member } = useCustomer();
  const t = EXTRA[lang].openingTeaser;
  const [target, setTarget] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/opening/status`)
      .then((r) => r.json())
      .then((d) => setTarget(new Date(d.opening_time).getTime()))
      .catch(() => setTarget(FALLBACK));
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(i);
  }, []);

  const joined = !!member && member.opening_status && member.opening_status !== "none";
  const diff = Math.max(0, (target || FALLBACK) - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);

  return (
    <section data-testid="opening-teaser" className="border-b border-[#66734A]/15 bg-[#F5F0E6]">
      <Reveal>
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-6 py-10 md:px-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.4em] text-[#66734A]/60">{t.label}</p>
            <p className="font-serif-display mt-2 text-4xl font-medium tracking-tight text-[#66734A] md:text-5xl">
              {days} <span className="text-xl italic text-[#66734A]/60">{t.days}</span>
              {" · "}{String(hours).padStart(2, "0")} <span className="text-xl italic text-[#66734A]/60">{t.hours}</span>
              {" · "}{String(mins).padStart(2, "0")} <span className="text-xl italic text-[#66734A]/60">{t.mins}</span>
            </p>
            <p className="mt-2 text-sm text-[#66734A]/70">
              {t.date}{joined && <span className="font-semibold text-[#66734A]">{" — "}{t.member}</span>}
            </p>
          </div>
          <Link
            data-testid="opening-teaser-cta"
            to="/opening"
            className="group inline-flex items-center gap-3 rounded-full border border-[#66734A]/40 px-7 py-3.5 text-[11px] font-semibold tracking-[0.25em] text-[#66734A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#66734A] hover:text-[#F5F0E6]"
          >
            {t.cta}
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
