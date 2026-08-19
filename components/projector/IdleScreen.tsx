"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function IdleScreen() {
  const [registerUrl, setRegisterUrl] = useState("");

  useEffect(() => {
    setRegisterUrl(`${window.location.origin}/register`);
  }, []);

  const qrSrc = registerUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=000000&color=c9c4d4&data=${encodeURIComponent(registerUrl)}`
    : "";

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-magenta/5 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-neon-yellow/3 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative text-center px-8"
      >
        <motion.h1
          animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-none tracking-[0.08em] text-glow-magenta"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Last Dance
        </motion.h1>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="mt-4 text-[clamp(1rem,3vw,2rem)] tracking-[0.3em] uppercase text-neon-yellow text-glow-yellow font-light"
        >
          Karaoke Party
        </motion.p>

        {qrSrc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt="QR înscriere karaoke"
              width={140}
              height={140}
              className="rounded-lg border border-zinc-800 opacity-80"
            />
            <p className="text-xs text-zinc-600 tracking-widest uppercase">
              Scanează pentru a te înscrie
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
