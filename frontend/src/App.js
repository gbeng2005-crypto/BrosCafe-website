import "@/App.css";
import "@/loyalty/loyalty.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Coffee as CoffeeIcon } from "lucide-react";
import { AppProvider } from "@/store/AppStore";
import { useLenis } from "@/hooks/useLenis";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
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
import { LanguageProvider } from "@/loyalty/i18n";
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
      <ProductModal />
      <Lightbox />
      <DayList />
    </div>
  );
}

function LoyaltyShell() {
  return (
    <LanguageProvider>
      <CustomerAuthProvider>
        <AuthProvider>
          <div className="loyalty-app min-h-screen">
            <Outlet />
          </div>
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </CustomerAuthProvider>
    </LanguageProvider>
  );
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

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<LoyaltyShell />}>
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/whats-new" element={<WhatsNewPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
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
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
