"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import EditParticipantModal from "@/components/EditParticipantModal";
import {
  getQueueDisplayName,
  hideSongField,
  type QueueItem,
} from "@/lib/types";

interface QueueListProps {
  queue: QueueItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

function DragHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onClick={(e) => e.stopPropagation()}
      className="flex-shrink-0 p-2 rounded-lg text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing touch-none"
      aria-label="Drag to reorder"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </button>
  );
}

function QueueRow({
  item,
  index,
  total,
  isActive,
  onSelect,
  onRemove,
  onMove,
  onEdit,
}: {
  item: QueueItem;
  index: number;
  total: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onEdit: (item: QueueItem) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className={`rounded-xl border p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer group list-none ${
        isActive
          ? "border-neon-magenta/60 bg-neon-magenta/10 border-glow-magenta"
          : "border-zinc-800 bg-zinc-950/50 hover:border-neon-magenta/30"
      }`}
      onClick={() => onSelect(item.id)}
    >
      <DragHandle
        onPointerDown={(e) => {
          e.stopPropagation();
          dragControls.start(e);
        }}
      />

      <span
        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
          isActive
            ? "bg-neon-magenta/30 text-neon-magenta"
            : "bg-zinc-800 text-zinc-400"
        }`}
      >
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white truncate text-sm sm:text-base">
            {getQueueDisplayName(item)}
          </p>
          {item.mode === "special_guest" && (
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30">
              Special Guest
            </span>
          )}
          {item.mode === "surpriza_speciala" && (
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/30">
              Surpriză
            </span>
          )}
          {item.lyricsMode && (
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/30">
              Lyrics
            </span>
          )}
        </div>
        {!hideSongField(item.mode) && item.songName && (
          <p className="text-xs sm:text-sm text-zinc-400 truncate mt-0.5">{item.songName}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMove(item.id, "up");
          }}
          disabled={index === 0}
          className="p-1.5 rounded-lg text-zinc-600 hover:text-neon-yellow disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          aria-label="Move up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMove(item.id, "down");
          }}
          disabled={index === total - 1}
          className="p-1.5 rounded-lg text-zinc-600 hover:text-neon-yellow disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          aria-label="Move down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="p-1.5 sm:p-2 rounded-lg text-zinc-600 hover:text-neon-yellow hover:bg-neon-yellow/10 transition-all"
          aria-label="Edit queue item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="p-1.5 sm:p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
          aria-label="Remove from queue"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </Reorder.Item>
  );
}

export default function QueueList({
  queue,
  activeId,
  onSelect,
  onRemove,
  onReorder,
  onMove,
}: QueueListProps) {
  const [editingItem, setEditingItem] = useState<QueueItem | null>(null);

  if (queue.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-8 text-center">
        <p className="text-zinc-500 text-sm">Queue is empty. Add a singer above.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-[11px] text-zinc-600 mb-2 uppercase tracking-wider">
        Trage ⋮⋮ sau folosește săgețile pentru ordine
      </p>

      <Reorder.Group
        axis="y"
        values={queue}
        onReorder={(newOrder) => onReorder(newOrder.map((item) => item.id))}
        className="space-y-2"
      >
        {queue.map((item, index) => (
          <QueueRow
            key={item.id}
            item={item}
            index={index}
            total={queue.length}
            isActive={item.id === activeId}
            onSelect={onSelect}
            onRemove={onRemove}
            onMove={onMove}
            onEdit={setEditingItem}
          />
        ))}
      </Reorder.Group>

      {editingItem && (
        <EditParticipantModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}
