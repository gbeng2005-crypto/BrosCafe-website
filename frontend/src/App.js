import "@/App.css";
import "@/loyalty/loyalty.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Coffee as CoffeeIcon } from "lucide-react";
import { AppProvider, useApp } from "@/store/AppStore";
import { useLenis } from "@/hooks/useLenis";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import OpeningTeaser from "@/components/OpeningTeaser";
import Coffee from "@/components/Coffee";
import Collection from "@/components/Collection";
import YourPicks from "@/components/YourPicks";
import BrosMoment from "@/components/BrosMoment";
import About from "@/components/About";
import MenuPreview from "@/components/MenuPreview";
import DiscoverBros from "@/components/DiscoverBros";
import MerchLookbook from "@/components/MerchLookbook";
import LoyaltyCTA from "@/components/LoyaltyCTA";
import WhatsNew from "@/components/WhatsNew";
import Community from "@/components/Community";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import Lightbox from "@/components/Lightbox";
import DayList from "@/components/DayList";
import { LanguageProvider, useLang } from "@/loyalty/i18n";
import { CustomerAuthProvider, useCustomer } from "@/loyalty/context/CustomerAuthContext";
import { AuthProvider } from "@/loyalty/context/AuthContext";
import { ProtectedRoute } from "@/loyalty/components/ProtectedRoute";
import LoyaltyPage from "@/loyalty/pages/customer/Loyalty";
import MenuPage from "@/loyalty/pages/customer/Menu";
import WhatsNewPage from "@/loyalty/pages/customer/WhatsNew";
import ShopPage from "@/loyalty/pages/customer/Shop";
import ProductDetailPage from "@/loyalty/pages/customer/ProductDetail";
import ContactPage from "@/loyalty/pages/customer/Contact";
import OpeningPage from "@/loyalty/pages/customer/Opening";
import VerifyMagic from "@/loyalty/pages/customer/VerifyMagic";
import AccountPage from "@/loyalty/pages/customer/Account";
import LoyaltyCard from "@/loyalty/pages/LoyaltyCard";
import LoginPage from "@/loyalty/pages/Login";
import StaffScanner from "@/loyalty/pages/StaffScanner";
import AdminDashboard from "@/loyalty/pages/AdminDashboard";

function HomePage() {
  useLenis();
  return (
    <div className="bg-[#F5F0E6] text-[#66734A]">
      <Loader />
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <OpeningTeaser />
        <Coffee />
        <Collection />
        <YourPicks />
        <BrosMoment />
        <About />
        <MenuPreview />
        <DiscoverBros />
        <MerchLookbook />
        <LoyaltyCTA />
        <WhatsNew />
        <Community />
      </main>
      <Footer />
      <DayList />
    </div>
  );
}

function LoyaltyShell() {
  return (
    <div className="loyalty-app min-h-screen">
      <Outlet />
    </div>
  );
}

// /product/:id deep-links open the SAME product modal, over the collection page.
function ProductDeepLink() {
  const { id } = useParams();
  const { openProduct } = useApp();
  useEffect(() => {
    openProduct(id);
  }, [id, openProduct]);
  return <ShopPage />;
}

function CustomerRoute({ children }) {
  const { member, loading } = useCustomer();
  if (loading || member === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bros-cream">
        <CoffeeIcon size={40} color="#66734A" className="animate-pulse" />
      </div>
    );
  }
  if (!member) return <Navigate to="/loyalty" replace />;
  return children;
}

// Keeps the site language and the loyalty language in lockstep (shared "bros-lang" key).
// Last writer wins — whichever side changed most recently pushes to the other.
function LangSync() {
  const { lang: loyalLang, setLang: setLoyalLang } = useLang();
  const { lang: siteLang, setLang: setSiteLang } = useApp();
  const prev = useRef(null);

  useEffect(() => {
    if (prev.current === null) {
      // First mount: if stored defaults differ, loyalty's stored value wins and we settle once.
      prev.current = { a: loyalLang, b: siteLang };
      if (loyalLang !== siteLang) setSiteLang(loyalLang);
      return;
    }
    const p = prev.current;
    if (loyalLang !== siteLang) {
      if (loyalLang !== p.a) setSiteLang(loyalLang);
      else if (siteLang !== p.b) setLoyalLang(siteLang);
    }
    prev.current = { a: loyalLang, b: siteLang };
  }, [loyalLang, siteLang, setLoyalLang, setSiteLang]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Enter-only transition: no exit hang, no stuck screens on redirects (magic links).
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route element={<LoyaltyShell />}>
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/whats-new" element={<WhatsNewPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDeepLink />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/opening" element={<OpeningPage />} />
            <Route path="/auth/verify" element={<VerifyMagic />} />
            <Route path="/card/:code" element={<LoyaltyCard />} />
            <Route path="/account" element={<CustomerRoute><AccountPage /></CustomerRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/staff" element={<ProtectedRoute><StaffScanner /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Route>
        </Routes>
      </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <CustomerAuthProvider>
          <AuthProvider>
            <AppProvider>
              <LangSync />
              <AnimatedRoutes />
              <ProductModal />
              <Lightbox />
              <Toaster position="top-center" richColors />
            </AppProvider>
          </AuthProvider>
        </CustomerAuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
