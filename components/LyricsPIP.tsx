"use client";

import { motion } from "framer-motion";
import {
  getActiveItem,
  getParticipantName,
  isLyricsIntroPhase,
  type AppState,
} from "@/lib/types";

interface LyricsPIPProps {
  state: AppState;
  onNext: () => void;
  onPrev: () => void;
}

export default function LyricsPIP({ state, onNext, onPrev }: LyricsPIPProps) {
  const active = getActiveItem(state);

  if (
    !active?.lyricsMode ||
    !state.showContent ||
    state.showYoutube ||
    active.lyricsSlides.length === 0
  ) {
    return null;
  }

  const isIntro = isLyricsIntroPhase(state, active);
  const slide = isIntro ? "" : (active.lyricsSlides[state.lyricsSlideIndex] ?? "");
  const total = active.lyricsSlides.length;
  const current = isIntro ? 0 : state.lyricsSlideIndex + 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 w-[min(340px,calc(100vw-2rem))] rounded-xl border border-neon-magenta/40 bg-black/95 backdrop-blur-md border-glow-magenta overflow-hidden shadow-2xl"
    >
      <div className="px-3 py-2 border-b border-neon-magenta/20 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-neon-magenta font-semibold">
          Lyrics Monitor
        </span>
        <span className="text-xs text-zinc-500">
          {isIntro ? "Intro" : `${current} / ${total}`}
        </span>
      </div>

      <div className="p-4 min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
        {isIntro ? (
          <p className="text-sm text-zinc-500 italic">
            Așteaptă → pe proiector pentru lyrics
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-line">
            {slide}
          </p>
        )}
      </div>

      <div className="px-3 py-2 border-t border-neon-magenta/20 flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={isIntro || state.lyricsSlideIndex <= 0}
          className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-zinc-900 border border-zinc-700 hover:border-neon-magenta/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={!isIntro && state.lyricsSlideIndex >= total - 1}
          className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-neon-magenta/20 border border-neon-magenta/50 text-neon-magenta hover:bg-neon-magenta/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>

      <div className="px-3 pb-2">
        <p className="text-[10px] text-zinc-600 truncate">
          {getParticipantName(active) || "Surpriză specială"}
          {active.songName ? ` — ${active.songName}` : ""}
        </p>
      </div>
    </motion.div>
  );
}
