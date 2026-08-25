import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useApp } from "@/store/AppStore";

export default function ProductCard({ product, index = 0, hidden = false }) {
  const { openProduct, favorites, toggleFavorite, activeProductId, closingId } = useApp();
  const [hover, setHover] = useState(false);
  const videoRef = useRef(null);
  const fav = favorites.includes(product.id);
  const concealed = hidden || activeProductId === product.id || closingId === product.id;

  const onEnter = () => {
    setHover(true);
    if (product.video && videoRef.current) videoRef.current.play().catch(() => {});
  };
  const onLeave = () => {
    setHover(false);
    if (product.video && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.article
      layout
      data-testid={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
      onClick={() => openProduct(product.id)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-cursor="view"
    >
      <div className="relative h-[300px] overflow-hidden rounded-3xl bg-white md:h-[340px]">
        <motion.img
          layoutId={`pm-${product.id}`}
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          style={{ opacity: concealed ? 0 : 1 }}
          className={`h-full w-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.05] ${
            product.video && hover ? "opacity-0" : ""
          }`}
        />
        {product.video && (
          <video
            ref={videoRef}
            src={product.video}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover ? "opacity-100" : "opacity-0"}`}
          />
        )}

        <button
          data-testid={`fav-${product.id}`}
          aria-label={fav ? `Remove ${product.name} from favorites` : `Save ${product.name} as favorite`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E6]/90 text-[#66734A] shadow-sm transition-transform duration-300 hover:scale-110"
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-[#F5F0E6]/95 px-5 py-2 text-[10px] font-semibold tracking-[0.25em] text-[#66734A] shadow-lg">
            QUICK VIEW
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between px-1">
        <h3 className="font-serif-display text-xl font-medium text-[#66734A]">{product.name}</h3>
        <span className="text-sm font-medium text-[#66734A]/70">{product.price}</span>
      </div>
    </motion.article>
  );
}
