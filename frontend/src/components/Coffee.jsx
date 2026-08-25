import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useApp } from "@/store/AppStore";
import { getProduct } from "@/data/products";
import { lp } from "@/data/products.hu";
import { STR } from "@/i18n";

const DRINKS = [
  { id: "espresso", tall: true },
  { id: "cappuccino", tall: false },
  { id: "latte", tall: false },
  { id: "americano", tall: true },
];

function DrinkCard({ id, index, tall, lang }) {
  const { openProduct, favorites, toggleFavorite } = useApp();
  const drink = lp(getProduct(id), lang);
  const fav = favorites.includes(id);

  return (
    <Reveal delay={index * 0.08} className={tall ? "md:mt-16" : ""}>
      <motion.article
        data-testid={`drink-card-${id}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group cursor-pointer"
        onClick={() => openProduct(id)}
        data-cursor="view"
      >
        <div className="relative h-[380px] overflow-hidden rounded-3xl md:h-[440px]">
          <img
            src={drink.images[0]}
            alt={`${drink.name} at Bros Cafe`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-[#66734A]/0 transition-colors duration-500 group-hover:bg-[#66734A]/15" />
          <button
            data-testid={`coffee-fav-${id}`}
            aria-label={fav ? `Remove ${drink.name} from favorites` : `Save ${drink.name} as favorite`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(id);
            }}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E6]/90 text-[#66734A] opacity-0 shadow-sm transition-all duration-300 hover:scale-110 group-hover:opacity-100"
          >
            <motion.span
              key={fav ? "on" : "off"}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="flex"
            >
              <Heart size={16} strokeWidth={1.8} fill={fav ? "#66734A" : "none"} />
            </motion.span>
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-[#F5F0E6]/95 px-5 py-2 text-[10px] font-semibold tracking-[0.25em] text-[#66734A] shadow-lg">
              QUICK VIEW
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4 px-1">
          <div>
            <h3 className="font-serif-display text-3xl font-medium text-[#66734A]">{drink.name}</h3>
            <p className="mt-1 text-sm text-[#66734A]/70">{drink.desc.split(".")[0]}.</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="text-sm font-medium text-[#66734A]/70">{drink.price}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#66734A]/30 text-[#66734A] transition-all duration-300 group-hover:bg-[#66734A] group-hover:text-[#F5F0E6]">
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Coffee() {
  const { lang } = useApp();
  const t = STR[lang].coffee;
  return (
    <section id="coffee" data-testid="coffee-section" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
      <SectionLabel number="01" title={t.label} />
      <Reveal>
        <h2 className="font-serif-display max-w-3xl text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
          {t.title1}
          <br />
          {t.title2}<span className="italic">{t.punct}</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-md text-base leading-relaxed text-[#66734A]/75">
          {t.body}
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 md:mt-20 md:gap-8">
        {DRINKS.map((d, i) => (
          <DrinkCard key={d.id} id={d.id} index={i} tall={d.tall} lang={lang} />
        ))}
      </div>
    </section>
  );
}
