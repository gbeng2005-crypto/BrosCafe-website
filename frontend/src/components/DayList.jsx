import { AnimatePresence, motion } from "framer-motion";
import { Coffee, X, Trash2 } from "lucide-react";
import { useApp } from "@/store/AppStore";
import { getProduct } from "@/data/products";
import { lp } from "@/data/products.hu";
import { STR } from "@/i18n";

export default function DayList() {
  const { day, dayOpen, setDayOpen, removeFromDay, clearDay, lang } = useApp();
  const t = STR[lang].day;
  const items = day.map(getProduct).filter(Boolean);

  return (
    <>
      <AnimatePresence>
        {day.length > 0 && !dayOpen && (
          <motion.button
            data-testid="day-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => setDayOpen(true)}
            aria-label="Open your Bros day list"
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#66734A] text-[#F5F0E6] shadow-[0_14px_36px_rgba(102,115,74,0.45)] transition-transform duration-300 hover:-translate-y-1"
          >
            <Coffee size={20} strokeWidth={1.6} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F0E6] text-[10px] font-bold text-[#66734A]">
              {day.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dayOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[75] bg-[#66734A]/40 backdrop-blur-sm"
              onClick={() => setDayOpen(false)}
            />
            <motion.aside
              data-testid="day-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[76] flex h-full w-full max-w-sm flex-col bg-[#F5F0E6] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#66734A]/12 px-7 py-6">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.35em] text-[#66734A]/55">{t.title}</p>
                  <p className="font-serif-display mt-1 text-2xl font-medium text-[#66734A]">{t.sub}</p>
                </div>
                <button
                  data-testid="day-close"
                  aria-label="Close your day list"
                  onClick={() => setDayOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#66734A]/25 text-[#66734A] transition-colors duration-300 hover:bg-[#66734A] hover:text-[#F5F0E6]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-7 py-6">
                {items.length === 0 ? (
                  <p className="text-sm text-[#66734A]/60">{t.empty}</p>
                ) : (
                  <ul className="space-y-4">
                    <AnimatePresence>
                      {items.map((p) => (
                        <motion.li
                          key={p.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-[0_10px_24px_rgba(102,115,74,0.08)]"
                        >
                          <img src={p.images[0]} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-serif-display text-lg font-medium text-[#66734A]">{lp(p, lang).name}</p>
                            <p className="text-xs text-[#66734A]/60">{p.price}</p>
                          </div>
                          <button
                            data-testid={`day-remove-${p.id}`}
                            aria-label={`Remove ${p.name} from your day`}
                            onClick={() => removeFromDay(p.id)}
                            className="text-[#66734A]/40 transition-colors duration-300 hover:text-[#66734A]"
                          >
                            <Trash2 size={15} />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-[#66734A]/12 px-7 py-5">
                  <button
                    data-testid="day-clear"
                    onClick={clearDay}
                    className="text-[11px] font-semibold tracking-[0.25em] text-[#66734A]/60 transition-colors duration-300 hover:text-[#66734A]"
                  >
                    {t.clear}
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
