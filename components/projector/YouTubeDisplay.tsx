"use client";

import { motion } from "framer-motion";
import { getYouTubeEmbedUrl } from "@/lib/types";

interface YouTubeDisplayProps {
  url: string;
}

export default function YouTubeDisplay({ url }: YouTubeDisplayProps) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p className="text-red-400 text-xl">Invalid YouTube link</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black"
    >
      <iframe
        src={embedUrl}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </motion.div>
  );
}
