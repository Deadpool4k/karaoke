"use client";

import { motion } from "framer-motion";

export default function IdleScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
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
          animate={{
            opacity: [0.85, 1, 0.85],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-none tracking-[0.08em] text-glow-magenta"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Last Dance
        </motion.h1>

        <motion.p
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="mt-4 text-[clamp(1rem,3vw,2rem)] tracking-[0.3em] uppercase text-neon-yellow text-glow-yellow font-light"
        >
          Karaoke Party
        </motion.p>

        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12 flex justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-magenta/60"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
