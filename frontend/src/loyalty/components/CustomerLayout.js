import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bros-cream">
      <Nav solid />
      <div className="mx-auto max-w-md px-6 pb-20 pt-24 md:max-w-2xl">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
