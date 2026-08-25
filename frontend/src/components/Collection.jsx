import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const SYNONYMS = {
  sweet: ["sweet"], pastry: ["sweet"], pastries: ["sweet"], dessert: ["sweet"], cake: ["sweet"],
  gift: ["merch"], merch: ["merch"], shirt: ["merch"], hoodie: ["merch"], mug: ["merch"], beans: ["merch"],
  coffee: ["coffee"], espresso: ["coffee"], hot: ["coffee"],
  cold: ["cold"], iced: ["cold"], tonic: ["cold"],
  food: ["food"], sandwich: ["food"], lunch: ["food"], waffle: ["food"], waffles: ["food"],
};

export default function Collection() {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
    const q = query.trim().toLowerCase();
    if (q) {
      const cats = SYNONYMS[q] || [];
      list = list.filter(
        (p) =>
          cats.includes(p.cat) ||
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          (p.tip && p.tip.toLowerCase().includes(q))
      );
    }
    return list;
  }, [cat, query]);

  return (
    <section id="collection" data-testid="collection-section" className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12 md:pb-40">
      <SectionLabel number="02" title="THE COLLECTION" />

      <div className="flex flex-wrap items-end justify-between gap-10">
        <Reveal>
          <h2 className="font-serif-display max-w-xl text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-6xl">
            WHAT ARE YOU
            <br />
            CRAVING<span className="italic">?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="w-full max-w-sm">
          <div className="flex items-center gap-3 border-b border-[#66734A]/30 pb-3 transition-colors duration-300 focus-within:border-[#66734A]">
            <Search size={18} className="shrink-0 text-[#66734A]/50" />
            <input
              data-testid="collection-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="coffee, sweet, gift…"
              aria-label="Search the Bros Cafe collection"
              className="w-full bg-transparent font-serif-display text-2xl italic text-[#66734A] placeholder:text-[#66734A]/35 focus:outline-none"
            />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div data-testid="category-filters" className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              data-testid={`filter-${c.id}`}
              onClick={() => setCat(c.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] transition-colors duration-300 ${
                cat === c.id ? "text-[#F5F0E6]" : "text-[#66734A]/70 hover:text-[#66734A]"
              }`}
            >
              {cat === c.id && (
                <motion.span
                  layoutId="cat-pill"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 rounded-full bg-[#66734A]"
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="mt-12 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p data-testid="collection-empty" className="mt-16 text-center font-serif-display text-2xl italic text-[#66734A]/60">
          Nothing like that yet — but tell us, and we'll think about it.
        </p>
      )}
    </section>
  );
}
