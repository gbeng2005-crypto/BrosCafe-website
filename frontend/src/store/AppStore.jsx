import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AppCtx = createContext(null);

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => read("bros-favs"));
  const [day, setDay] = useState(() => read("bros-day"));
  const [lang, setLang] = useState(() => localStorage.getItem("bros-lang") || "en");
  const [activeProductId, setActiveProductId] = useState(null);
  const [closingId, setClosingId] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { images: [], index: 0 }
  const [dayOpen, setDayOpen] = useState(false);

  useEffect(() => localStorage.setItem("bros-favs", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("bros-day", JSON.stringify(day)), [day]);
  useEffect(() => localStorage.setItem("bros-lang", lang), [lang]);

  const overlayOpen = !!activeProductId || !!lightbox || dayOpen;
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  const addToDay = useCallback((id) => {
    setDay((d) => (d.includes(id) ? d : [...d, id]));
  }, []);

  const removeFromDay = useCallback((id) => setDay((d) => d.filter((x) => x !== id)), []);
  const clearDay = useCallback(() => setDay([]), []);

  const openProduct = useCallback((id) => { setClosingId(null); setActiveProductId(id); }, []);
  const closeProduct = useCallback(() => {
    setActiveProductId((id) => {
      setClosingId(id);
      setTimeout(() => setClosingId(null), 500);
      return null;
    });
  }, []);
  const openLightbox = useCallback((images, index = 0) => setLightbox({ images, index }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <AppCtx.Provider
      value={{
        favorites, toggleFavorite,
        day, addToDay, removeFromDay, clearDay, dayOpen, setDayOpen,
        lang, setLang,
        activeProductId, closingId, openProduct, closeProduct,
        lightbox, openLightbox, closeLightbox,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
