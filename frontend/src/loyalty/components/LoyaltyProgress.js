import React from "react";
import { Coffee } from "@phosphor-icons/react";

// Renders the 4-step (or N-step) loyalty progress as coffee cups.
export const LoyaltyProgress = ({ stamps, required = 4, animateLast = false, size = 34 }) => {
  return (
    <div className="flex items-center justify-center gap-3" data-testid="loyalty-progress">
      {Array.from({ length: required }).map((_, i) => {
        const filled = i < stamps;
        const isNew = animateLast && i === stamps - 1;
        return (
          <div
            key={i}
            className={`flex items-center justify-center rounded-full transition-colors ${
              isNew ? "animate-stamp-pop" : ""
            }`}
            style={{
              width: size + 12,
              height: size + 12,
              backgroundColor: filled ? "#66734A" : "transparent",
              border: filled ? "none" : "1.5px solid rgba(102,115,74,0.35)",
            }}
            data-testid={`stamp-${i}-${filled ? "filled" : "empty"}`}
          >
            <Coffee
              size={size}
              weight={filled ? "fill" : "light"}
              color={filled ? "#F5F0E6" : "rgba(102,115,74,0.45)"}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LoyaltyProgress;
