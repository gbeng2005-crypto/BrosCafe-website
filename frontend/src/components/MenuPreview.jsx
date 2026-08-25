import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";

const MENU = [
  {
    category: "COFFEE",
    items: [
      { name: "Espresso", price: "3.5" },
      { name: "Americano", price: "4.0" },
      { name: "Cappuccino", price: "4.5" },
      { name: "Latte", price: "4.5" },
    ],
  },
  {
    category: "COLD DRINKS",
    items: [
      { name: "Cold Brew", price: "4.5" },
      { name: "Iced Latte", price: "5.0" },
      { name: "Espresso Tonic", price: "5.5" },
    ],
  },
  {
    category: "PASTRIES",
    items: [
      { name: "Butter Croissant", price: "3.0" },
      { name: "Banana Bread", price: "3.5" },
      { name: "Cinnamon Roll", price: "4.0" },
    ],
  },
  {
    category: "SPECIALS",
    items: [
      { name: "Bros Filter of the Week", price: "4.0" },
      { name: "Seasonal Special — ask at the bar", price: "—" },
    ],
  },
];

export default function MenuPreview() {
  return (
    <section id="menu" data-testid="menu-section" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel number="04" title="MENU PREVIEW" />
          <Reveal>
            <h2 className="font-serif-display text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
              SOMETHING
              <br />
              SWEET<span className="italic">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-[#66734A]/75">
              Because coffee deserves company. The full menu changes with the
              seasons — this is the short version.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <a
              data-testid="view-menu-button"
              href="#menu-full"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#66734A] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#F5F0E6] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(102,115,74,0.3)]"
            >
              VIEW MENU
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="space-y-12">
          {MENU.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.05}>
              <div data-testid={`menu-group-${group.category.toLowerCase().replace(/\s/g, "-")}`}>
                <h3 className="mb-4 text-[11px] font-semibold tracking-[0.35em] text-[#66734A]/60">
                  {group.category}
                </h3>
                <ul className="divide-y divide-[#66734A]/12 border-y border-[#66734A]/12">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="group flex items-baseline justify-between gap-4 py-4 transition-all duration-300 hover:pl-3"
                    >
                      <span className="font-serif-display text-2xl font-medium text-[#66734A] transition-colors duration-300">
                        {item.name}
                      </span>
                      <span className="mx-2 flex-1 border-b border-dotted border-[#66734A]/25" />
                      <span className="text-sm font-medium text-[#66734A]/70">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
