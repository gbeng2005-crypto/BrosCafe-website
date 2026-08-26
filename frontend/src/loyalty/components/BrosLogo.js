import React from "react";
import markOlive from "@/loyalty/assets/mark-olive.png";
import markCream from "@/loyalty/assets/mark-cream.png";

export const BrosLogo = ({ light = false, className = "" }) => (
  <div className={`flex items-center gap-2.5 ${className}`} data-testid="bros-logo">
    <img src={light ? markCream : markOlive} alt="BrosCafé logo" className="h-9 w-auto" />
    <span
      className="font-display text-xl tracking-tight leading-none"
      style={{ color: light ? "#F5F0E6" : "#2C3322" }}
    >
      BrosCafé
    </span>
  </div>
);

export default BrosLogo;
