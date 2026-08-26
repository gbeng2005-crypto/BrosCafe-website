import { Instagram, ArrowUpRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { LOYALTY_URL } from "@/config";
import { scrollToSection } from "@/hooks/useLenis";
import { useApp } from "@/store/AppStore";
import { STR } from "@/i18n";
import { EXTRA } from "@/i18n-extra";

const LINK_KEYS = [
  { key: "home", id: "home" },
  { key: "menu", to: "/menu" },
  { key: "about", id: "about" },
  { key: "news", id: "news" },
  { key: "opening", to: "/opening" },
  { key: "loyalty", to: "/loyalty" },
  { key: "shop", to: "/shop" },
];

export default function Footer() {
  const { lang } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const t = STR[lang].footer;
  const navT = { ...STR[lang].nav, ...EXTRA[lang].nav };

  const go = (l) => {
    if (l.to) {
      navigate(l.to);
      return;
    }
    if (pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(l.id), 650);
      return;
    }
    scrollToSection(l.id);
  };

  return (
    <footer data-testid="footer" className="bg-[#66734A] text-[#F5F0E6]">
      <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-20 md:px-12 md:pt-28">
        <div className="flex flex-col justify-between gap-12 border-b border-[#F5F0E6]/15 pb-16 md:flex-row md:items-end">
          <div>
            <p className="font-serif-display text-4xl font-semibold tracking-[0.1em] md:text-6xl">
              BROS CAFE
            </p>
            <p className="font-serif-display mt-3 text-xl italic text-[#F5F0E6]/75">
              {t.tagline}
            </p>
          </div>
          <a
            data-testid="footer-loyalty-cta"
            href={LOYALTY_URL}
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#F5F0E6]/50 px-8 py-4 text-[11px] font-semibold tracking-[0.2em] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F5F0E6] hover:text-[#66734A]"
          >
            {t.cta}
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="flex flex-col justify-between gap-10 py-12 md:flex-row">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {LINK_KEYS.map((l) => (
                <li key={l.key}>
                  <button
                    data-testid={`footer-link-${l.key}`}
                    onClick={() => go(l)}
                    className="link-underline text-xs font-medium tracking-[0.18em] text-[#F5F0E6]/85"
                  >
                    {navT[l.key]}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-6">
            <a
              data-testid="footer-contact-link"
              href="mailto:hello@broscafe.com"
              className="link-underline text-xs font-medium tracking-[0.18em] text-[#F5F0E6]/85"
            >
              {t.contact}
            </a>
            <a
              data-testid="footer-instagram-link"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bros Cafe on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F5F0E6]/40 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F5F0E6] hover:text-[#66734A]"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-[#F5F0E6]/15 pt-8 text-[10px] tracking-[0.25em] text-[#F5F0E6]/50 md:flex-row">
          <p>{t.copy}</p>
          <p>{EXTRA[lang].footer.opening}</p>
          <p>{t.made}</p>
        </div>
      </div>
    </footer>
  );
}
