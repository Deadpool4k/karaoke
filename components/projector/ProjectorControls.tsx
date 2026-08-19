"use client";

import { motion } from "framer-motion";
import { emitEvent } from "@/lib/socket";

interface ProjectorControlsProps {
  hasActive: boolean;
}

export default function ProjectorControls({ hasActive }: ProjectorControlsProps) {
  if (!hasActive) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={(e) => {
        e.stopPropagation();
        emitEvent("active:idle");
      }}
      className="fixed bottom-6 left-6 z-[300] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-900/90 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 backdrop-blur-sm transition-all"
    >
      ← Terminat
    </motion.button>
  );
}
