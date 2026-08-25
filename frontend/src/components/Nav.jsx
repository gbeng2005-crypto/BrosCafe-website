import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight, Coffee } from "lucide-react";
import { LOYALTY_URL } from "@/config";
import { scrollToSection } from "@/hooks/useLenis";
import { useApp } from "@/store/AppStore";
import { STR } from "@/i18n";

const LINK_IDS = [
  { key: "home", id: "home" },
  { key: "menu", id: "menu" },
  { key: "about", id: "about" },
  { key: "news", id: "news" },
  { key: "loyalty", id: "loyalty" },
];

function LangToggle({ light = false }) {
  const { lang, setLang } = useApp();
  return (
    <div data-testid="lang-toggle" className="flex items-center gap-1 rounded-full border border-current/20 p-0.5" style={{ borderColor: light ? "rgba(245,240,230,0.35)" : "rgba(102,115,74,0.3)" }}>
      {["en", "hu"].map((l) => (
        <button
          key={l}
          data-testid={`lang-${l}`}
          onClick={() => setLang(l)}
          aria-label={l === "en" ? "Switch to English" : "Váltás magyarra"}
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] transition-all duration-300 ${
            lang === l
              ? light
                ? "bg-[#F5F0E6] text-[#66734A]"
                : "bg-[#66734A] text-[#F5F0E6]"
              : light
                ? "text-[#F5F0E6]/70 hover:text-[#F5F0E6]"
                : "text-[#66734A]/60 hover:text-[#66734A]"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function LogoBurst() {
  return (
    <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -34 - i * 6, x: (i - 2) * 12, scale: 1 }}
          transition={{ duration: 0.9, delay: i * 0.05, ease: "easeOut" }}
          className="absolute text-[#66734A]"
        >
          <Coffee size={13} strokeWidth={1.6} />
        </motion.span>
      ))}
    </span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState(0);
  const clicks = useRef(0);
  const { scrollY } = useScroll();
  const { lang } = useApp();
  const t = STR[lang].nav;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  const logoClick = () => {
    clicks.current += 1;
    if (clicks.current % 5 === 0) setBurst((b) => b + 1);
    go("home");
  };

  return (
    <>
      <motion.header
        data-testid="main-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
          scrolled
            ? "bg-[#F5F0E6]/75 backdrop-blur-xl shadow-[0_1px_0_rgba(102,115,74,0.12)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
          <button
            data-testid="nav-logo"
            onClick={logoClick}
            className={`relative font-serif-display text-xl font-semibold tracking-[0.18em] transition-colors duration-500 ${
              scrolled ? "text-[#66734A]" : "text-[#F5F0E6]"
            }`}
            aria-label="Bros Cafe — back to top"
          >
            BROS CAFE
            {burst > 0 && <LogoBurst key={burst} />}
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINK_IDS.map((l) => (
              <li key={l.id}>
                <button
                  data-testid={`nav-link-${l.id}`}
                  onClick={() => go(l.id)}
                  className={`link-underline text-[11px] font-medium tracking-[0.22em] transition-colors duration-500 ${
                    scrolled ? "text-[#66734A]" : "text-[#F5F0E6]"
                  }`}
                >
                  {t[l.key]}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LangToggle light={!scrolled} />
            <a
              data-testid="nav-loyalty-cta"
              href={LOYALTY_URL}
              className={`group hidden items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-semibold tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(102,115,74,0.25)] sm:inline-flex ${
                scrolled
                  ? "bg-[#66734A] text-[#F5F0E6]"
                  : "bg-[#F5F0E6] text-[#66734A]"
              }`}
            >
              {t.cta}
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              data-testid="mobile-menu-button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`transition-colors duration-500 lg:hidden ${
                scrolled ? "text-[#66734A]" : "text-[#F5F0E6]"
              }`}
            >
              <Menu size={26} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-[#F5F0E6]"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-serif-display text-xl font-semibold tracking-[0.18em] text-[#66734A]">
                BROS CAFE
              </span>
              <button
                data-testid="mobile-menu-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-[#66734A]"
              >
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
              {LINK_IDS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    data-testid={`mobile-nav-link-${l.id}`}
                    onClick={() => go(l.id)}
                    className="font-serif-display text-5xl font-medium text-[#66734A] transition-opacity duration-300 hover:opacity-60"
                  >
                    {t[l.key]}
                  </button>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <a
                  data-testid="mobile-nav-loyalty-cta"
                  href={LOYALTY_URL}
                  className="inline-flex items-center gap-2 rounded-full bg-[#66734A] px-8 py-4 text-xs font-semibold tracking-[0.18em] text-[#F5F0E6]"
                >
                  {t.cta}
                  <ArrowUpRight size={14} />
                </a>
                <LangToggle />
              </motion.li>
            </ul>
            <p className="px-8 pb-8 text-[11px] tracking-[0.22em] text-[#66734A]/60">
              {t.tagline}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
