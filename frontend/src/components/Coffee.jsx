import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { IMAGES } from "@/config";

const DRINKS = [
  { name: "ESPRESSO", note: "Short, dark, honest.", img: IMAGES.espresso, tall: true },
  { name: "CAPPUCCINO", note: "Foam like a cloud.", img: IMAGES.cappuccino, tall: false },
  { name: "LATTE", note: "Milk, done properly.", img: IMAGES.latte, tall: false },
  { name: "AMERICANO", note: "Clean and slow.", img: IMAGES.americano, tall: true },
];

function DrinkCard({ drink, index }) {
  return (
    <Reveal delay={index * 0.08} className={drink.tall ? "md:mt-16" : ""}>
      <motion.article
        data-testid={`drink-card-${drink.name.toLowerCase()}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group cursor-pointer"
      >
        <div className="relative h-[380px] overflow-hidden rounded-3xl md:h-[440px]">
          <img
            src={drink.img}
            alt={`${drink.name} at Bros Cafe`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-[#66734A]/0 transition-colors duration-500 group-hover:bg-[#66734A]/15" />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4 px-1">
          <div>
            <h3 className="font-serif-display text-3xl font-medium text-[#66734A]">
              {drink.name}
            </h3>
            <p className="mt-1 text-sm text-[#66734A]/70">{drink.note}</p>
          </div>
          <span className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#66734A]/30 text-[#66734A] transition-all duration-300 group-hover:bg-[#66734A] group-hover:text-[#F5F0E6]">
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Coffee() {
  return (
    <section id="coffee" data-testid="coffee-section" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
      <SectionLabel number="01" title="THE COFFEE" />
      <Reveal>
        <h2 className="font-serif-display max-w-3xl text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
          COFFEE, THE WAY
          <br />
          WE LIKE IT<span className="italic">.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-md text-base leading-relaxed text-[#66734A]/75">
          A short menu, done properly. No syrups with seventeen ingredients — just
          good beans, good milk, and people who care.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 md:mt-20 md:gap-8">
        {DRINKS.map((d, i) => (
          <DrinkCard key={d.name} drink={d} index={i} />
        ))}
      </div>
    </section>
  );
}
