"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AddParticipantForm from "@/components/AddParticipantForm";
import QueueList from "@/components/QueueList";
import LyricsPIP from "@/components/LyricsPIP";
import { emitEvent, getSocket } from "@/lib/socket";
import type { AppState } from "@/lib/types";
import { getActiveItem } from "@/lib/types";

export default function AdminPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const handleState = (s: AppState) => setState(s);
    const handleConnect = () => {
      setConnected(true);
      socket.emit("state:request");
    };
    const handleDisconnect = () => setConnected(false);

    socket.on("state:update", handleState);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setConnected(true);
      socket.emit("state:request");
    }

    return () => {
      socket.off("state:update", handleState);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-display tracking-wider text-glow-magenta"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ADMIN
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">The Last Dance Karaoke</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 text-xs ${
                connected ? "text-green-400" : "text-red-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              />
              {connected ? "Live" : "Offline"}
            </span>
            <Link
              href="/projector"
              target="_blank"
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-neon-yellow hover:border-neon-yellow/40 transition-all"
            >
              Projector ↗
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <AddParticipantForm />

        {/* Active participant controls */}
        {state?.activeId && (() => {
          const active = getActiveItem(state);
          if (!active) return null;
          return (
            <section className="rounded-xl border border-neon-yellow/30 bg-neon-yellow/5 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neon-yellow mb-3">
                Now On Stage
              </h2>
              <div className="flex flex-wrap gap-2">
                {active.youtubeLink && !state.showYoutube && (
                  <button
                    onClick={() => emitEvent("youtube:open")}
                    className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 transition-all"
                  >
                    Open Link
                  </button>
                )}
                {state.showYoutube && (
                  <span className="px-3 py-2 rounded-lg text-xs text-green-400 border border-green-400/30 bg-green-400/10">
                    YouTube playing on projector
                  </span>
                )}
              </div>
            </section>
          );
        })()}

        {/* Queue Controls */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-neon-yellow rounded-full" />
              Queue
              {state && (
                <span className="text-sm font-normal text-zinc-500">
                  ({state.queue.length})
                </span>
              )}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => emitEvent("active:next")}
                disabled={!state?.queue.length}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-neon-yellow/20 border border-neon-yellow/50 text-neon-yellow hover:bg-neon-yellow/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next in Queue
              </button>
              <button
                onClick={() => emitEvent("active:clear")}
                disabled={!state?.activeId}
                className="px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {state ? (
            <QueueList
              queue={state.queue}
              activeId={state.activeId}
              onSelect={(id) => emitEvent("active:set", id)}
              onRemove={(id) => emitEvent("queue:remove", id)}
              onReorder={(orderedIds) => emitEvent("queue:reorder", orderedIds)}
              onMove={(id, direction) => emitEvent("queue:move", { id, direction })}
            />
          ) : (
            <div className="rounded-xl border border-zinc-800 p-8 text-center">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-zinc-500 text-sm"
              >
                Connecting...
              </motion.div>
            </div>
          )}
        </section>
      </div>

      {/* Lyrics PIP */}
      {state && (
        <LyricsPIP
          state={state}
          onNext={() => emitEvent("lyrics:next")}
          onPrev={() => emitEvent("lyrics:prev")}
        />
      )}
    </main>
  );
}
