import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
