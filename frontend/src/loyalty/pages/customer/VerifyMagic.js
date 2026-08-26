import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomer } from "@/loyalty/context/CustomerAuthContext";
import { useLang } from "@/loyalty/i18n";
import { Coffee } from "@phosphor-icons/react";

export default function VerifyMagic() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { verify } = useCustomer();
  const { t } = useLang();
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const token = params.get("token");
    if (!token) {
      setError(t("verify_failed"));
      return;
    }
    verify(token)
      .then(() => navigate("/loyalty?welcome=1", { replace: true }))
      .catch(() => setError(t("verify_failed")));
  }, [params, verify, navigate, t]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bros-cream px-8 text-center">
      {!error ? (
        <>
          <Coffee size={40} weight="fill" color="#66734A" className="animate-pulse" />
          <p className="mt-4 font-display text-2xl text-bros-ink">{t("verifying")}</p>
        </>
      ) : (
        <>
          <p className="font-display text-2xl text-bros-ink">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 h-12 rounded-xl border border-bros-olive bg-white px-6 font-semibold text-bros-olive"
          >
            {t("back_to_register")}
          </button>
        </>
      )}
    </div>
  );
}
