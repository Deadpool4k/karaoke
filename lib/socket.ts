"use client";

import { io, Socket } from "socket.io-client";
import type { AppState } from "./types";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    socket = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

type QueueAddPayload = Omit<import("./types").QueueItem, "id">;

export function emitEvent(
  event: "queue:add",
  item: QueueAddPayload
): void;
export function emitEvent(
  event: "queue:update",
  item: QueueAddPayload & { id: string }
): void;
export function emitEvent(event: "queue:remove", id: string): void;
export function emitEvent(event: "queue:reorder", orderedIds: string[]): void;
export function emitEvent(
  event: "queue:move",
  payload: { id: string; direction: "up" | "down" }
): void;
export function emitEvent(event: "active:set", id: string): void;
export function emitEvent(event: "active:next"): void;
export function emitEvent(event: "active:clear"): void;
export function emitEvent(event: "youtube:open"): void;
export function emitEvent(event: "lyrics:slide", index: number): void;
export function emitEvent(event: "lyrics:next"): void;
export function emitEvent(event: "lyrics:prev"): void;
export function emitEvent(event: "reveal:complete"): void;
export function emitEvent(event: string, ...args: unknown[]): void {
  getSocket().emit(event, ...args);
}

export type { AppState };
