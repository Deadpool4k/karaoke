"use client";

import { motion, AnimatePresence } from "framer-motion";
import LyricsBackground from "@/components/projector/LyricsBackground";

interface LyricsDisplayProps {
  slides: string[];
  currentIndex: number;
  songName: string;
  participantName: string;
}

export default function LyricsDisplay({
  slides,
  currentIndex,
  songName,
  participantName,
}: LyricsDisplayProps) {
  const slide = slides[currentIndex] ?? "";

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden select-none">
      <LyricsBackground />

      <div className="absolute top-6 left-0 right-0 text-center opacity-25 z-10">
        <p className="text-xs tracking-[0.25em] uppercase text-zinc-600">
          {participantName ? `${participantName} — ` : ""}
          {songName}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 px-[clamp(2rem,8vw,6rem)] max-w-[90vw] text-center"
        >
          <p
            className="text-[clamp(1.8rem,5vw,4.5rem)] leading-[1.5] font-medium text-lyrics-premium whitespace-pre-line"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            {slide}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5 z-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-neon-magenta/50" : "w-2 bg-zinc-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
