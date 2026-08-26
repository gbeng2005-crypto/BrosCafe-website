import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { IMAGES, VIDEOS } from "@/config";
import { useApp } from "@/store/AppStore";
import { STR } from "@/i18n";

const POST_IMGS = [IMAGES.americano, IMAGES.cappuccino, IMAGES.about, VIDEOS.moment.poster];
const POST_SIZES = [true, false, false, false];

function PostCard({ post, index, readLabel, onOpen }) {
  return (
    <Reveal delay={index * 0.07} className={post.large ? "md:col-span-2" : ""}>
      <motion.article
        data-testid={`news-card-${index}`}
        onClick={onOpen}
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
            {readLabel}
            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function WhatsNew() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const t = STR[lang].news;
  const posts = t.posts.map((p, i) => ({ ...p, img: POST_IMGS[i], large: POST_SIZES[i] }));

  return (
    <section id="news" data-testid="news-section" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel number="08" title={t.label} />
          <Reveal>
            <h2 className="font-serif-display text-5xl font-medium leading-[1.02] tracking-tight text-[#66734A] md:text-7xl">
              {t.title}<span className="italic">{t.punct}</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-[#66734A]/70">
            {t.body}
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p.title} post={p} index={i} readLabel={t.read} onOpen={() => navigate("/whats-new")} />
        ))}
      </div>
    </section>
  );
}
