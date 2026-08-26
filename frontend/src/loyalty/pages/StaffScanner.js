import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { api, formatError } from "@/loyalty/lib/api";
import { useAuth } from "@/loyalty/context/AuthContext";
import { BrosLogo } from "@/loyalty/components/BrosLogo";
import { LoyaltyProgress } from "@/loyalty/components/LoyaltyProgress";
import { Coffee, Plus, Gift, ArrowLeft, Camera, SignOut, Keyboard } from "@phosphor-icons/react";
import { toast } from "sonner";

const READER_ID = "bros-qr-reader";

export default function StaffScanner() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [member, setMember] = useState(null);
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState("");
  const [opening, setOpening] = useState(null);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const lookup = async (code) => {
    try {
      const { data } = await api.get(`/scan/${code.trim()}`);
      setMember(data);
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    }
  };

  const startScanner = async () => {
    setMember(null);
    setScanning(true);
    // wait for the reader div to mount
    setTimeout(async () => {
      try {
        const html5 = new Html5Qrcode(READER_ID);
        scannerRef.current = html5;
        await html5.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 230, height: 230 } },
          async (decodedText) => {
            await stopScanner();
            lookup(decodedText);
          },
          () => {}
        );
      } catch (err) {
        toast.error("Could not access the camera. Use manual entry instead.");
        setScanning(false);
      }
    }, 150);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCoffee = async () => {
    setBusy(true);
    try {
      const { data } = await api.post(`/scan/${member.code}/add-coffee`);
      setMember(data);
      if (data.reward_ready) toast.success("Reward unlocked — free coffee ready!");
      else toast.success("Coffee added");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const revealOpening = async () => {
    setBusy(true);
    try {
      const { data } = await api.post(`/scan/${member.code}/opening/reveal`);
      setOpening(data.offer);
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const redeemOpening = async () => {
    setBusy(true);
    try {
      const { data } = await api.post(`/scan/${member.code}/opening/redeem`);
      setMember({ ...member, opening_status: "redeemed" });
      setOpening(data.offer);
      toast.success("Opening offer redeemed 🎉");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const redeem = async () => {
    setBusy(true);
    try {
      const { data } = await api.post(`/scan/${member.code}/redeem`);
      setMember(data);
      toast.success("Free coffee redeemed 🎉");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const adjust = async () => {
    setBusy(true);
    try {
      const { data } = await api.post(`/scan/${member.code}/adjust`, { delta: -1 });
      setMember(data);
      toast.success("Corrected (−1 coffee)");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-bros-ink">
      <div className="mx-auto max-w-md px-6 pb-16">
        <header className="flex items-center justify-between py-6">
          <BrosLogo light />
          <div className="flex items-center gap-4">
            {user?.role === "admin" && (
              <button onClick={() => navigate("/admin")} className="text-xs text-bros-cream/70 hover:text-bros-cream">
                Admin
              </button>
            )}
            <button onClick={logout} data-testid="staff-logout-btn" className="text-bros-cream/70 hover:text-bros-cream">
              <SignOut size={20} weight="light" />
            </button>
          </div>
        </header>

        <h1 className="font-display text-3xl text-bros-cream">Scan Customer</h1>
        <p className="mt-1 text-sm text-bros-cream/60">Point the camera at the customer's QR code.</p>

        {!member && (
          <div className="mt-6">
            <div
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black"
              style={{ aspectRatio: "1 / 1" }}
            >
              {scanning ? (
                <div id={READER_ID} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-bros-cream/50">
                  <Camera size={54} weight="light" />
                  <p className="mt-3 text-sm">Camera off</p>
                </div>
              )}
              {scanning && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-56 w-56 rounded-2xl border-2 border-bros-olive/80" />
                </div>
              )}
            </div>

            {!scanning ? (
              <button
                onClick={startScanner}
                data-testid="start-scan-btn"
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive font-semibold text-white transition-colors hover:bg-bros-olive-dark"
              >
                <Camera size={20} weight="fill" /> Start Scanning
              </button>
            ) : (
              <button
                onClick={stopScanner}
                data-testid="stop-scan-btn"
                className="mt-6 h-14 w-full rounded-2xl border border-white/20 font-semibold text-bros-cream"
              >
                Stop
              </button>
            )}

            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/5 p-2">
              <Keyboard size={20} className="ml-2 text-bros-cream/50" />
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Enter card code manually"
                data-testid="manual-code-input"
                className="h-11 flex-1 bg-transparent px-2 text-bros-cream placeholder:text-bros-cream/40 outline-none"
              />
              <button
                onClick={() => manual.trim() && lookup(manual)}
                data-testid="manual-lookup-btn"
                className="h-11 rounded-xl bg-bros-olive px-4 text-sm font-semibold text-white"
              >
                Find
              </button>
            </div>
          </div>
        )}

        {member && (
          <div className="mt-6 animate-fade-up">
            <div className="rounded-[2rem] bg-white p-7 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-muted">
                Customer
              </p>
              <h2 className="mt-1 font-display text-3xl text-bros-ink" data-testid="scanned-member-name">
                {member.name}
              </h2>
              <p className="mt-1 text-sm text-bros-muted" data-testid="scanned-member-progress">
                {member.stamps} / {member.stamps_required} coffees
              </p>
              <div className="mt-6">
                <LoyaltyProgress stamps={member.stamps} required={member.stamps_required} size={26} />
              </div>

              {member.reward_ready ? (
                <>
                  <div className="mt-6 rounded-2xl bg-[rgba(102,115,74,0.10)] px-4 py-3">
                    <p className="flex items-center justify-center gap-2 font-semibold text-bros-olive">
                      <Gift size={18} weight="fill" /> Free coffee ready
                    </p>
                  </div>
                  <button
                    onClick={redeem}
                    disabled={busy}
                    data-testid="redeem-btn"
                    className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive font-semibold text-white transition-colors hover:bg-bros-olive-dark disabled:opacity-60"
                  >
                    <Gift size={20} weight="fill" /> Redeem Free Coffee
                  </button>
                </>
              ) : (
                <button
                  onClick={addCoffee}
                  disabled={busy}
                  data-testid="add-coffee-btn"
                  className="mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive text-lg font-semibold text-white transition-colors hover:bg-bros-olive-dark active:scale-[0.99] disabled:opacity-60"
                >
                  <Plus size={24} weight="bold" /> Add Coffee
                </button>
              )}

              {member.stamps > 0 && !member.reward_ready && (
                <button
                  onClick={adjust}
                  disabled={busy}
                  data-testid="adjust-btn"
                  className="mt-3 text-xs font-medium text-bros-muted underline-offset-2 hover:text-bros-olive hover:underline disabled:opacity-60"
                >
                  Correct a mistake (−1 coffee)
                </button>
              )}
            </div>

            <div className="mt-4 rounded-[2rem] bg-white p-6 text-center" data-testid="opening-panel">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bros-olive">🎁 Grand Opening Offer</p>
              {member.opening_status === "redeemed" && !opening ? (
                <p className="mt-3 font-semibold text-bros-olive">✓ Already redeemed</p>
              ) : !opening ? (
                <button onClick={revealOpening} disabled={busy} data-testid="reveal-opening-btn"
                  className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive font-semibold text-white hover:bg-bros-olive-dark disabled:opacity-60">
                  Reveal Opening Offer 🎉
                </button>
              ) : (
                <>
                  <p className="mt-2 font-display text-2xl text-bros-ink">🎉 You unlocked it!</p>
                  <ul className="mt-3 space-y-1 text-bros-ink">
                    {opening.map((o) => (<li key={o} className="text-lg">{o}</li>))}
                  </ul>
                  {member.opening_status === "redeemed" ? (
                    <p className="mt-4 font-semibold text-bros-olive">✓ Offer redeemed — thanks for being here for day one ☕</p>
                  ) : (
                    <button onClick={redeemOpening} disabled={busy} data-testid="redeem-opening-btn"
                      className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-bros-olive font-semibold text-white hover:bg-bros-olive-dark disabled:opacity-60">
                      Redeem Offer
                    </button>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => {
                setMember(null);
                setOpening(null);
              }}
              data-testid="scan-next-btn"
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/20 font-semibold text-bros-cream"
            >
              <ArrowLeft size={18} /> Scan Next Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
