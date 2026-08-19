"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  hideNameFields,
  hideSongField,
  parseLyrics,
  slidesToRaw,
  type ParticipantMode,
  type QueueItem,
} from "@/lib/types";
import { emitEvent } from "@/lib/socket";

const MODES: { value: ParticipantMode; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "special_guest", label: "Special Guest" },
  { value: "surpriza_speciala", label: "Surpriză specială" },
];

interface EditParticipantModalProps {
  item: QueueItem;
  onClose: () => void;
}

export default function EditParticipantModal({
  item,
  onClose,
}: EditParticipantModalProps) {
  const [firstName, setFirstName] = useState(item.firstName);
  const [lastName, setLastName] = useState(item.lastName);
  const [songName, setSongName] = useState(item.songName);
  const [youtubeLink, setYoutubeLink] = useState(item.youtubeLink);
  const [mode, setMode] = useState<ParticipantMode>(item.mode);
  const [lyricsMode, setLyricsMode] = useState(item.lyricsMode);
  const [skipReveal, setSkipReveal] = useState(item.skipReveal ?? false);
  const [lyricsRaw, setLyricsRaw] = useState(slidesToRaw(item.lyricsSlides));

  const hideNames = hideNameFields(mode);
  const hideSong = hideSongField(mode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "standard" && (!firstName.trim() || !songName.trim())) return;

    emitEvent("queue:update", {
      id: item.id,
      firstName: hideNames ? "" : firstName.trim(),
      lastName: hideNames ? "" : lastName.trim(),
      songName: hideSong ? "" : songName.trim(),
      youtubeLink: youtubeLink.trim(),
      mode,
      lyricsMode,
      lyricsSlides: lyricsMode ? parseLyrics(lyricsRaw) : [],
      skipReveal,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Edit Queue Item</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                    mode === m.value
                      ? "border-neon-magenta/60 bg-neon-magenta/20 text-neon-magenta"
                      : "border-zinc-700 bg-black text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {!hideNames && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
                />
              </div>
            </div>
          )}

          {!hideSong && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                Song Name{mode === "standard" ? " *" : ""}
              </label>
              <input
                type="text"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                required={mode === "standard"}
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              YouTube Link
            </label>
            <input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lyricsMode}
              onChange={(e) => setLyricsMode(e.target.checked)}
              className="w-4 h-4 accent-neon-magenta"
            />
            <span className="text-sm text-zinc-300">Lyrics Mode</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={skipReveal}
              onChange={(e) => setSkipReveal(e.target.checked)}
              className="w-4 h-4 accent-neon-yellow"
            />
            <span className="text-sm text-zinc-300">Skip Reveal</span>
          </label>

          {lyricsMode && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                Lyrics (separate slides with one empty line)
              </label>
              <textarea
                value={lyricsRaw}
                onChange={(e) => setLyricsRaw(e.target.value)}
                rows={8}
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-neon-magenta/30 focus:border-neon-magenta/60 focus:outline-none text-white font-mono text-sm leading-relaxed"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold uppercase tracking-wider bg-neon-magenta/20 border border-neon-magenta/60 text-neon-magenta hover:bg-neon-magenta/30 transition-all"
          >
            Save Changes
          </button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
