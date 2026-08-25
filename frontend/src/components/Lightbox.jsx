import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/store/AppStore";

export default function Lightbox() {
  const { lightbox, closeLightbox } = useApp();
  const [, force] = useState(0);

  if (!lightbox) return null;
  const { images } = lightbox;
  const index = lightbox.index;

  const go = (dir) => {
    lightbox.index = (index + dir + images.length) % images.length;
    force((n) => n + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-[#66734A]/80 backdrop-blur-xl"
        onClick={closeLightbox}
      >
        <button
          data-testid="lightbox-close"
          aria-label="Close viewer"
          onClick={closeLightbox}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F0E6]/15 text-[#F5F0E6] transition-colors duration-300 hover:bg-[#F5F0E6]/30"
        >
          <X size={20} />
        </button>

        {images.length > 1 && (
          <>
            <button
              data-testid="lightbox-prev"
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#F5F0E6]/15 text-[#F5F0E6] transition-colors duration-300 hover:bg-[#F5F0E6]/30"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              data-testid="lightbox-next"
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#F5F0E6]/15 text-[#F5F0E6] transition-colors duration-300 hover:bg-[#F5F0E6]/30"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <motion.img
          key={index}
          src={images[index]}
          alt="Bros Cafe moment"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-[92vw] cursor-grab rounded-2xl object-contain shadow-2xl active:cursor-grabbing"
        />

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-[#F5F0E6]/70">
          {index + 1} / {images.length}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
