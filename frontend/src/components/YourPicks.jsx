import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useApp } from "@/store/AppStore";
import { getProduct } from "@/data/products";

export default function YourPicks() {
  const { favorites, openProduct } = useApp();
  const items = favorites.map(getProduct).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section id="picks" data-testid="picks-section" className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12 md:pb-40">
      <p className="mb-6 text-[11px] font-medium tracking-[0.4em] text-[#66734A]/60">SAVED BY YOU</p>
      <Reveal>
        <h2 className="font-serif-display text-4xl font-medium tracking-tight text-[#66734A] md:text-6xl">
          YOUR BROS PICKS<span className="italic">.</span>
        </h2>
      </Reveal>
      <div className="mt-10 flex flex-wrap gap-4">
        <AnimatePresence>
          {items.map((p, i) => (
            <motion.button
              key={p.id}
              data-testid={`pick-${p.id}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => openProduct(p.id)}
              data-cursor="view"
              className="group flex items-center gap-4 rounded-2xl bg-white p-3 pr-6 text-left shadow-[0_12px_28px_rgba(102,115,74,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(102,115,74,0.14)]"
            >
              <img src={p.images[0]} alt={p.name} className="h-16 w-16 rounded-xl object-cover" />
              <div>
                <p className="font-serif-display text-lg font-medium text-[#66734A]">{p.name}</p>
                <p className="text-xs text-[#66734A]/60">{p.price}</p>
              </div>
              <Heart size={14} className="ml-2 text-[#66734A]" fill="#66734A" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
