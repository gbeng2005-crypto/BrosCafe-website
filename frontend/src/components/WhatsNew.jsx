import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { IMAGES, VIDEOS } from "@/config";

const POSTS = [
  {
    tag: "NEW DRINK",
    title: "Espresso tonic, but make it Bros.",
    text: "Double shot over tonic and ice. Sounds wrong, tastes right.",
    img: IMAGES.americano,
    large: true,
  },
  {
    tag: "SEASONAL",
    title: "The winter menu is here.",
    text: "Spiced honey latte and a cardamom cappuccino. Until spring.",
    img: IMAGES.cappuccino,
  },
  {
    tag: "EVENT",
    title: "Cupping night — first Thursday.",
    text: "Taste this month's beans with us. Free, as always.",
    img: IMAGES.about,
  },
  {
    tag: "NOTE",
    title: "We now open at seven.",
    text: "Early birds, your table is waiting.",
    img: VIDEOS.moment.poster,
  },
];

function PostCard({ post, index }) {
  return (
    <Reveal delay={index * 0.07} className={post.large ? "md:col-span-2" : ""}>
      <motion.article
        data-testid={`news-card-${index}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-[0_20px_40px_rgba(102,115,74,0.07)]"
      >
        <div className={`overflow-hidden ${post.large ? "h-64 md:h-80" : "h-56"}`}>
          <img
            src={post.img}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </div>
        <div className="p-7">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-[#66734A]/55">{post.tag}</p>
          <h3 className="font-serif-display mt-3 text-2xl font-medium leading-snug text-[#66734A] md:text-[1.7rem]">
            {post.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#66734A]/70">{post.text}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#66734A]">
            READ
            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function WhatsNew() {
  return (
    <section id="news" data-testid="news-section" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel number="05" title="WHAT'S NEW" />
          <Reveal>
            <h2 className="font-serif-display text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
              FROM THE BROS<span className="italic">.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-[#66734A]/70">
            New drinks, small events, things we're trying. Posted when there's
            actually something to say.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p, i) => (
          <PostCard key={p.title} post={p} index={i} />
        ))}
      </div>
    </section>
  );
}
