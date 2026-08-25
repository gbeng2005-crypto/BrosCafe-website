import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import MaskedImage from "@/components/MaskedImage";
import { useApp } from "@/store/AppStore";
import { getProduct } from "@/data/products";

const LOOKS = [
  { id: "bros-hoodie", cls: "col-span-2 row-span-2", variant: "left" },
  { id: "bros-tee", cls: "col-span-1 row-span-1", variant: "up" },
  { id: "bros-mug", cls: "col-span-1 row-span-1", variant: "right" },
  { id: "bros-beans", cls: "col-span-2 row-span-1", variant: "up" },
];

export default function MerchLookbook() {
  const { openProduct } = useApp();

  return (
    <section id="merch" data-testid="merch-section" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel number="06" title="MERCH" />
          <Reveal>
            <h2 className="font-serif-display text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
              TAKE A LITTLE
              <br />
              BROS HOME<span className="italic">.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-[#66734A]/70">
            Small drops, made properly. The same things the team actually wears
            and drinks from.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4 md:gap-6">
        {LOOKS.map((look, i) => {
          const p = getProduct(look.id);
          return (
            <motion.div
              key={look.id}
              data-testid={`lookbook-${look.id}`}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative cursor-pointer ${look.cls}`}
              onClick={() => openProduct(look.id)}
              data-cursor="view"
            >
              <MaskedImage
                src={p.images[0]}
                alt={p.name}
                variant={look.variant}
                delay={i * 0.1}
                className="h-full w-full rounded-3xl"
                imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between rounded-b-3xl bg-gradient-to-t from-[#66734A]/70 to-transparent p-5 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                <div>
                  <p className="font-serif-display text-lg font-medium text-[#F5F0E6]">{p.name}</p>
                  <p className="text-xs text-[#F5F0E6]/80">{p.price}</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F0E6] text-[#66734A]">
                  <ArrowUpRight size={13} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
