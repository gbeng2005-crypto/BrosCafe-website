import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee } from "lucide-react";

export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          data-testid="loader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-[#F5F0E6]"
        >
          <div className="relative">
            <div className="steam mb-1 flex justify-center gap-1.5" aria-hidden="true">
              <span /><span /><span />
            </div>
            <Coffee size={34} strokeWidth={1.4} className="text-[#66734A]" />
          </div>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.45em" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mt-5 font-serif-display text-sm font-semibold text-[#66734A]"
          >
            BROS CAFE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
