"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { emitEvent, getSocket } from "@/lib/socket";
import { isDuplicateInQueue } from "@/lib/types";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [songName, setSongName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [queue, setQueue] = useState<
    import("@/lib/types").QueueItem[]
  >([]);
  const [pending, setPending] = useState<
    import("@/lib/types").GuestRequest[]
  >([]);

  useEffect(() => {
    const socket = getSocket();
    const handleState = (s: import("@/lib/types").AppState) => {
      setQueue(s.queue);
      setPending(s.pendingRequests);
    };
    socket.on("state:update", handleState);
    socket.emit("state:request");
    return () => {
      socket.off("state:update", handleState);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !songName.trim()) return;

    if (isDuplicateInQueue(firstName, lastName, queue)) {
      setDuplicateWarning(
        "Ești deja în coadă! Așteaptă rândul tău sau contactează organizatorul."
      );
      return;
    }

    const key = `${firstName.trim().toLowerCase()}|${lastName.trim().toLowerCase()}`;
    if (
      pending.some(
        (r) =>
          `${r.firstName.trim().toLowerCase()}|${r.lastName.trim().toLowerCase()}` ===
          key
      )
    ) {
      setDuplicateWarning("Ai trimis deja o cerere. Așteaptă aprobarea.");
      return;
    }

    emitEvent("request:submit", {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      songName: songName.trim(),
      youtubeLink: youtubeLink.trim(),
    });

    setSubmitted(true);
    setDuplicateWarning("");
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-neon-magenta/20 border border-neon-magenta/40 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-neon-magenta">✓</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">
            Cerere trimisă!
          </h1>
          <p className="text-zinc-400 text-sm">
            Organizatorul va aproba cererea ta. Stai aproape — te anunțăm când
            e rândul tău!
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFirstName("");
              setLastName("");
              setSongName("");
              setYoutubeLink("");
            }}
            className="mt-6 text-sm text-neon-magenta hover:underline"
          >
            Trimite altă cerere
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-display tracking-wider text-glow-magenta"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Last Dance
          </h1>
          <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">
            Înscrie-te la karaoke
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                Prenume *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setDuplicateWarning("");
                }}
                required
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
                placeholder="Maria"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                Nume
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setDuplicateWarning("");
                }}
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
                placeholder="Popescu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Ce cânți? *
            </label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
              placeholder="Numele piesei"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Link YouTube (karaoke)
            </label>
            <input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-neon-magenta/60 focus:outline-none text-white"
              placeholder="https://youtube.com/..."
            />
          </div>

          {duplicateWarning && (
            <p className="text-amber-400 text-sm bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-2">
              {duplicateWarning}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold uppercase tracking-wider bg-neon-magenta/20 border border-neon-magenta/60 text-neon-magenta hover:bg-neon-magenta/30 transition-all"
          >
            Trimite cererea
          </button>

          <p className="text-[11px] text-zinc-600 text-center">
            Cererea ajunge la organizator. Vei fi adăugat în coadă după aprobare.
          </p>
        </motion.form>
      </div>
    </main>
  );
}
