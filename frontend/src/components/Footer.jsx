import { Instagram, ArrowUpRight } from "lucide-react";
import { LOYALTY_URL } from "@/config";
import { scrollToSection } from "@/hooks/useLenis";

const LINKS = [
  { label: "Home", id: "home" },
  { label: "Menu", id: "menu" },
  { label: "About", id: "about" },
  { label: "What's New", id: "news" },
  { label: "Loyalty", id: "loyalty" },
];

export default function Footer() {
  return (
    <footer data-testid="footer" className="bg-[#66734A] text-[#F5F0E6]">
      <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-20 md:px-12 md:pt-28">
        <div className="flex flex-col justify-between gap-12 border-b border-[#F5F0E6]/15 pb-16 md:flex-row md:items-end">
          <div>
            <p className="font-serif-display text-4xl font-semibold tracking-[0.1em] md:text-6xl">
              BROS CAFE
            </p>
            <p className="font-serif-display mt-3 text-xl italic text-[#F5F0E6]/75">
              Good coffee. Good people.
            </p>
          </div>
          <a
            data-testid="footer-loyalty-cta"
            href={LOYALTY_URL}
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#F5F0E6]/50 px-8 py-4 text-[11px] font-semibold tracking-[0.2em] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F5F0E6] hover:text-[#66734A]"
          >
            GET LOYALTY CARD
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="flex flex-col justify-between gap-10 py-12 md:flex-row">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    data-testid={`footer-link-${l.id}`}
                    onClick={() => scrollToSection(l.id)}
                    className="link-underline text-xs font-medium tracking-[0.18em] text-[#F5F0E6]/85"
                  >
                    {l.label.toUpperCase()}
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
              CONTACT
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
          <p>© 2026 BROS CAFE</p>
          <p>MADE WITH GOOD COFFEE</p>
        </div>
      </div>
    </footer>
  );
}
