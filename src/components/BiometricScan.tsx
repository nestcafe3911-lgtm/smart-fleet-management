import React, { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Fingerprint, Scan, User, Sparkles, Loader2, KeyRound } from "lucide-react";

interface Props {
  onUnlockCompleted: (userEmail: string) => void;
  brandColor: string;
}

export default function BiometricScan({ onUnlockCompleted, brandColor }: Props) {
  const [authStage, setAuthStage] = useState<"IDLE" | "SCANNING" | "VERIFYING" | "SUCCESS" | "FAILED">("IDLE");
  const [selectedMethod, setSelectedMethod] = useState<"fingerprint" | "faceId">("fingerprint");
  const [emailText, setEmailText] = useState("nestcafe3911@gmail.com");

  // Multi-step realistic WebAuthn unlock animation
  const handleStartScan = () => {
    if (!emailText.trim()) return;
    setAuthStage("SCANNING");
  };

  useEffect(() => {
    if (authStage === "SCANNING") {
      const timer = setTimeout(() => {
        setAuthStage("VERIFYING");
      }, 1800);
      return () => clearTimeout(timer);
    }

    if (authStage === "VERIFYING") {
      const timer = setTimeout(() => {
        // Authenticate mock credentials
        setAuthStage("SUCCESS");
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (authStage === "SUCCESS") {
      const timer = setTimeout(() => {
        // Complete sign in
        localStorage.setItem("smart_car_user", emailText);
        onUnlockCompleted(emailText);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [authStage]);

  return (
    <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative flex flex-col items-center shadow-3xl text-center overflow-hidden">
      {/* Laser line effect during SCANNING */}
      {authStage === "SCANNING" && (
        <div className="absolute left-0 right-0 h-1 bg-amber-500 shadow-[0_0_15px_#f59e0b] animate-bounce z-10" />
      )}

      {/* Decorative Brand Spot */}
      <div 
        className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-[100px] opacity-15 transition-all duration-700" 
        style={{ backgroundColor: brandColor }}
      />

      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <KeyRound className="text-amber-400" size={18} />
          <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            WebAuthn Passwordless Auth
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">
          Secure Fleet Access
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Cryptographically signed passkey credential. No passcodes or servers compromises possible.
        </p>
      </div>

      {/* Email select/input */}
      {authStage === "IDLE" && (
        <div className="w-full mb-6 text-left">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">
            Enterprise Fleet ID / Email
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="email" 
              value={emailText} 
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="name@company.com" 
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Main scanner container */}
      <div className="relative w-44 h-44 bg-slate-950/90 rounded-full flex items-center justify-center border-2 border-slate-800/80 mb-6 shadow-inner">
        {/* Scanning ripple circles */}
        {authStage === "SCANNING" && (
          <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-ping" />
        )}
        {authStage === "VERIFYING" && (
          <div className="absolute inset-2 border-2 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
        )}

        <div className="z-10 flex flex-col items-center">
          {authStage === "IDLE" && (
            <button 
              onClick={handleStartScan}
              className="group flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform duration-150"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${brandColor}1a`, border: `1.5px solid ${brandColor}40` }}
              >
                <Fingerprint size={32} style={{ color: brandColor }} className="animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 font-semibold tracking-wider group-hover:text-slate-200">
                TAP TO AUTHENTICATE
              </span>
            </button>
          )}

          {authStage === "SCANNING" && (
            <div className="flex flex-col items-center text-amber-400 animate-pulse">
              <Scan size={36} />
              <span className="text-[10px] font-mono mt-3 text-amber-500 font-semibold tracking-wider">
                SCANNING BIOMETRICS...
              </span>
            </div>
          )}

          {authStage === "VERIFYING" && (
            <div className="flex flex-col items-center text-emerald-400">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
              <span className="text-[10px] font-mono mt-3 text-emerald-400 font-semibold tracking-wider">
                VERIFYING SECURE TOKEN...
              </span>
            </div>
          )}

          {authStage === "SUCCESS" && (
            <div className="flex flex-col items-center text-emerald-500 scale-110 transition-transform">
              <ShieldCheck size={40} className="animate-bounce" />
              <span className="text-[11px] font-mono mt-2 text-emerald-500 uppercase tracking-widest font-black">
                ACCESS GRANTED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Switch auth method labels */}
      {authStage === "IDLE" && (
        <div className="flex items-center gap-4 bg-slate-950/60 p-1 rounded-xl border border-slate-800 mb-6">
          <button 
            onClick={() => setSelectedMethod("fingerprint")} 
            className={`px-4 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase active:scale-95 transition-transform duration-150 ${selectedMethod === "fingerprint" ? "bg-slate-800 text-slate-100 shadow" : "text-slate-500 hover:text-slate-300"}`}
          >
            Passkey ID
          </button>
          <button 
            onClick={() => setSelectedMethod("faceId")} 
            className={`px-4 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase active:scale-95 transition-transform duration-150 ${selectedMethod === "faceId" ? "bg-slate-800 text-slate-100 shadow" : "text-slate-500 hover:text-slate-300"}`}
          >
            WebAuthn Face
          </button>
        </div>
      )}

      {/* Bottom informational footings */}
      <div className="text-[10px] font-mono text-slate-500 leading-relaxed border-t border-slate-800/60 pt-4 w-full">
        {authStage === "IDLE" && "Biometric details remain encrypted on your secure enclave chip."}
        {authStage === "SCANNING" && `Reading: SHA-256 secure hash generated on standard FIDO2.0`}
        {authStage === "VERIFYING" && "Decrypting handshake challenge against credential public key..."}
        {authStage === "SUCCESS" && `Welcome Back, ${emailText}! Launching Dashboard...`}
      </div>
    </div>
  );
}
