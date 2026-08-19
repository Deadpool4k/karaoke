"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SESSION_KEY = "karaoke_admin_auth";

interface AdminPinGateProps {
  children: React.ReactNode;
}

export default function AdminPinGate({ children }: AdminPinGateProps) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setError("PIN incorect");
      setPin("");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Se încarcă...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4"
        >
          <div className="text-center">
            <h1
              className="text-2xl font-display tracking-wider text-glow-magenta"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ADMIN
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Introdu PIN-ul pentru acces</p>
          </div>

          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white text-center text-lg tracking-[0.3em]"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold uppercase tracking-wider bg-neon-magenta/20 border border-neon-magenta/60 text-neon-magenta hover:bg-neon-magenta/30 transition-all"
          >
            Intră
          </button>
        </motion.form>
      </div>
    );
  }

  return <>{children}</>;
}
