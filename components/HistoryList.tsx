"use client";

import { formatHistoryTime, getParticipantName, type HistoryEntry } from "@/lib/types";

interface HistoryListProps {
  history: HistoryEntry[];
}

export default function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-center">
        <p className="text-zinc-600 text-sm">Nimeni nu a cântat încă.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
      {history.map((entry) => (
        <li
          key={`${entry.id}-${entry.performedAt}`}
          className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-3 py-2 flex items-center justify-between gap-2"
        >
          <div className="min-w-0">
            <p className="text-sm text-zinc-300 truncate">
              {getParticipantName(entry)}
            </p>
            <p className="text-xs text-zinc-600 truncate">{entry.songName}</p>
          </div>
          <span className="text-[10px] text-zinc-600 shrink-0 tabular-nums">
            {formatHistoryTime(entry.performedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
