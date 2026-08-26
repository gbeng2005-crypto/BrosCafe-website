import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BrosLogo } from "@/loyalty/components/BrosLogo";
import { LangToggle } from "@/loyalty/components/LangToggle";
import { useLang } from "@/loyalty/i18n";
import { House, ForkKnife, Coffee, Confetti, User } from "@phosphor-icons/react";

export const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();

  const items = [
    { key: "home", label: t("nav_home"), icon: House, path: "/" },
    { key: "menu", label: t("nav_menu"), icon: ForkKnife, path: "/menu" },
    { key: "loyalty", label: t("nav_loyalty"), icon: Coffee, path: "/loyalty" },
    { key: "opening", label: t("nav_opening"), icon: Confetti, path: "/opening" },
    { key: "account", label: t("nav_account"), icon: User, path: "/account" },
  ];

  return (
    <div className="min-h-screen bg-bros-cream pb-24">
      <div className="mx-auto max-w-md px-6">
        <header className="flex items-center justify-between py-6">
          <button onClick={() => navigate("/")} aria-label="Home" data-testid="header-logo">
            <BrosLogo />
          </button>
          <LangToggle />
        </header>
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-bros-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
          {items.map((it) => {
            const Icon = it.icon;
            const active = it.path === "/" ? location.pathname === "/" : location.pathname.startsWith(it.path);
            return (
              <button
                key={it.key}
                onClick={() => navigate(it.path)}
                data-testid={`nav-${it.key}`}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors ${
                  active ? "text-bros-olive" : "text-bros-muted"
                }`}
              >
                <Icon size={22} weight={active ? "fill" : "regular"} />
                {it.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CustomerLayout;
