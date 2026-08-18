"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  hideNameFields,
  hideSongField,
  parseLyrics,
  type ParticipantMode,
} from "@/lib/types";
import { emitEvent } from "@/lib/socket";

const MODES: { value: ParticipantMode; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "special_guest", label: "Special Guest" },
  { value: "surpriza_speciala", label: "Surpriză specială" },
];

export default function AddParticipantForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [songName, setSongName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [mode, setMode] = useState<ParticipantMode>("standard");
  const [lyricsMode, setLyricsMode] = useState(false);
  const [lyricsRaw, setLyricsRaw] = useState("");

  const hideNames = hideNameFields(mode);
  const hideSong = hideSongField(mode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "standard" && (!firstName.trim() || !songName.trim())) return;

    emitEvent("queue:add", {
      firstName: hideNames ? "" : firstName.trim(),
      lastName: hideNames ? "" : lastName.trim(),
      songName: hideSong ? "" : songName.trim(),
      youtubeLink: youtubeLink.trim(),
      mode,
      lyricsMode,
      lyricsSlides: lyricsMode ? parseLyrics(lyricsRaw) : [],
    });

    setFirstName("");
    setLastName("");
    setSongName("");
    setYoutubeLink("");
    setMode("standard");
    setLyricsMode(false);
    setLyricsRaw("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4"
    >
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <span className="w-1 h-5 bg-neon-magenta rounded-full" />
        Add to Queue
      </h2>

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
              className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none focus:ring-1 focus:ring-neon-magenta/30 text-white placeholder-zinc-600 transition-all"
              placeholder="Maria"
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
              className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none focus:ring-1 focus:ring-neon-magenta/30 text-white placeholder-zinc-600 transition-all"
              placeholder="Garcia"
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
            className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none focus:ring-1 focus:ring-neon-magenta/30 text-white placeholder-zinc-600 transition-all"
            placeholder="Bohemian Rhapsody"
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
          className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none focus:ring-1 focus:ring-neon-magenta/30 text-white placeholder-zinc-600 transition-all"
          placeholder="https://youtube.com/..."
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={lyricsMode}
            onChange={(e) => setLyricsMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 rounded-full bg-zinc-800 border border-zinc-700 peer-checked:bg-neon-magenta/20 peer-checked:border-neon-magenta/50 transition-all" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-zinc-600 peer-checked:translate-x-5 peer-checked:bg-neon-magenta transition-all" />
        </div>
        <span className="text-sm text-zinc-300 group-hover:text-neon-magenta transition-colors">
          Lyrics Mode
        </span>
      </label>

      {lyricsMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
            Lyrics (separate slides with one empty line)
          </label>
          <textarea
            value={lyricsRaw}
            onChange={(e) => setLyricsRaw(e.target.value)}
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg bg-black border border-neon-magenta/30 focus:border-neon-magenta/60 focus:outline-none focus:ring-1 focus:ring-neon-magenta/30 text-white placeholder-zinc-600 transition-all font-mono text-sm leading-relaxed"
            placeholder={"Verse 1 line one\nVerse 1 line two\n\nChorus line one\nChorus line two\n\nBridge..."}
          />
          <p className="text-[11px] text-zinc-600 mt-1">
            Lasă o linie goală între strofe pentru slide nou.
          </p>
        </motion.div>
      )}

      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold uppercase tracking-wider bg-neon-magenta/20 border border-neon-magenta/60 text-neon-magenta hover:bg-neon-magenta/30 transition-all border-glow-magenta active:scale-[0.98]"
      >
        Add to Queue
      </button>
    </motion.form>
  );
}
