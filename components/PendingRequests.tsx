"use client";

import { motion } from "framer-motion";
import { getParticipantName, type GuestRequest } from "@/lib/types";

interface PendingRequestsProps {
  requests: GuestRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendingRequests({
  requests,
  onApprove,
  onReject,
}: PendingRequestsProps) {
  if (requests.length === 0) return null;

  return (
    <section className="rounded-xl border border-neon-yellow/30 bg-neon-yellow/5 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neon-yellow mb-3 flex items-center gap-2">
        Cereri noi
        <span className="px-2 py-0.5 rounded-full bg-neon-yellow/20 text-xs">
          {requests.length}
        </span>
      </h2>
      <ul className="space-y-2">
        {requests.map((req) => (
          <motion.li
            key={req.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg border border-zinc-800 bg-black/60 p-3 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {getParticipantName(req)}
              </p>
              <p className="text-sm text-zinc-400 truncate">{req.songName}</p>
              {req.youtubeLink && (
                <p className="text-[10px] text-zinc-600 truncate mt-0.5">
                  {req.youtubeLink}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onApprove(req.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-all"
              >
                Acceptă
              </button>
              <button
                onClick={() => onReject(req.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-400/40 transition-all"
              >
                Respinge
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
