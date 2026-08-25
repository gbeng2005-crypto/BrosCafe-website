import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLenis } from "@/hooks/useLenis";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Coffee from "@/components/Coffee";
import BrosMoment from "@/components/BrosMoment";
import About from "@/components/About";
import MenuPreview from "@/components/MenuPreview";
import LoyaltyCTA from "@/components/LoyaltyCTA";
import WhatsNew from "@/components/WhatsNew";
import Community from "@/components/Community";
import Footer from "@/components/Footer";

function HomePage() {
  useLenis();
  return (
    <div className="bg-[#F5F0E6] text-[#66734A]">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Coffee />
        <BrosMoment />
        <About />
        <MenuPreview />
        <LoyaltyCTA />
        <WhatsNew />
        <Community />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
