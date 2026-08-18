"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  getParticipantName,
  getSpecialModeLabel,
  isSpecialMode,
  type QueueItem,
} from "@/lib/types";

interface SingerRevealProps {
  item: QueueItem;
  isRevealing: boolean;
  showContent: boolean;
}

export default function SingerReveal({
  item,
  isRevealing,
  showContent,
}: SingerRevealProps) {
  const specialLabel = getSpecialModeLabel(item.mode);
  const isSpecial = isSpecialMode(item.mode);

  return (
    <>
      <AnimatePresence mode="wait">
        {isRevealing && (
          <motion.div
            key="reveal-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isRevealing || showContent) && (
          <motion.div
            key="reveal-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-neon-magenta/8 blur-[150px]" />
            </div>

            {isSpecial && specialLabel ? (
              <>
                <motion.h1
                  initial={{ opacity: 0, scale: 3, y: 100 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 12,
                    delay: 0.4,
                  }}
                  className={`font-display text-[clamp(2.5rem,10vw,8rem)] leading-tight tracking-wider text-center px-8 ${
                    item.mode === "special_guest"
                      ? "text-neon-yellow text-glow-yellow"
                      : "text-neon-magenta text-glow-magenta"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {specialLabel}
                </motion.h1>

                {item.mode === "surpriza_speciala" && item.songName && (
                  <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.9,
                    }}
                    className="mt-8 text-[clamp(1.2rem,4vw,3rem)] text-zinc-400 text-center px-8 font-light italic"
                  >
                    &ldquo;{item.songName}&rdquo;
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <motion.p
                  initial={{ opacity: 0, y: -80, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.3,
                  }}
                  className="text-[clamp(1rem,3vw,2rem)] tracking-[0.4em] uppercase font-semibold mb-6 text-neon-magenta text-glow-magenta"
                >
                  NEXT ON STAGE
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, scale: 3, y: 100 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 12,
                    delay: 0.6,
                  }}
                  className="font-display text-[clamp(3rem,12vw,10rem)] leading-none tracking-wider text-white text-glow-white text-center px-8"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {getParticipantName(item)}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 1.0,
                  }}
                  className="mt-8 text-[clamp(1.2rem,4vw,3rem)] text-neon-magenta text-glow-magenta text-center px-8 font-light italic"
                >
                  &ldquo;{item.songName}&rdquo;
                </motion.p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
