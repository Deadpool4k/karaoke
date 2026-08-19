export type ParticipantMode = "standard" | "special_guest" | "surpriza_speciala";

export interface QueueItem {
  id: string;
  firstName: string;
  lastName: string;
  songName: string;
  youtubeLink: string;
  mode: ParticipantMode;
  lyricsMode: boolean;
  lyricsSlides: string[];
  /** Skip reveal animation — go straight to content/lyrics */
  skipReveal: boolean;
}

export interface GuestRequest {
  id: string;
  firstName: string;
  lastName: string;
  songName: string;
  youtubeLink: string;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  firstName: string;
  lastName: string;
  songName: string;
  performedAt: number;
}

export interface AppState {
  queue: QueueItem[];
  pendingRequests: GuestRequest[];
  history: HistoryEntry[];
  activeId: string | null;
  lyricsSlideIndex: number;
  isRevealing: boolean;
  showContent: boolean;
  showYoutube: boolean;
}

export const initialState: AppState = {
  queue: [],
  pendingRequests: [],
  history: [],
  activeId: null,
  lyricsSlideIndex: 0,
  isRevealing: false,
  showContent: false,
  showYoutube: false,
};

export function parseLyrics(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/\n\s*\n/)
    .map((slide) => slide.trim())
    .filter(Boolean);
}

export function slidesToRaw(slides: string[]): string {
  return slides.join("\n\n");
}

export function hideNameFields(mode: ParticipantMode): boolean {
  return mode === "special_guest" || mode === "surpriza_speciala";
}

export function hideSongField(mode: ParticipantMode): boolean {
  return mode === "special_guest";
}

export function isSurprizaWithLyrics(item: QueueItem): boolean {
  return (
    item.mode === "surpriza_speciala" &&
    item.lyricsMode &&
    item.lyricsSlides.length > 0
  );
}

export function isLyricsIntroPhase(state: AppState, item: QueueItem): boolean {
  return (
    isSurprizaWithLyrics(item) &&
    state.lyricsSlideIndex < 0 &&
    state.showContent &&
    !state.isRevealing
  );
}

export function isSpecialMode(mode: ParticipantMode): boolean {
  return mode === "special_guest" || mode === "surpriza_speciala";
}

export function getSpecialModeLabel(mode: ParticipantMode): string | null {
  if (mode === "special_guest") return "SPECIAL GUEST";
  if (mode === "surpriza_speciala") return "SURPRIZĂ SPECIALĂ";
  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url.trim()) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return null;
}

export function getActiveItem(state: AppState): QueueItem | null {
  if (!state.activeId) return null;
  return state.queue.find((item) => item.id === state.activeId) ?? null;
}

export function getParticipantName(item: {
  firstName: string;
  lastName: string;
}): string {
  return `${item.firstName} ${item.lastName}`.trim();
}

export function getQueueDisplayName(item: QueueItem): string {
  const special = getSpecialModeLabel(item.mode);
  if (special) return special;
  return getParticipantName(item) || "—";
}

export function personKey(firstName: string, lastName: string): string {
  return `${firstName.trim().toLowerCase()}|${lastName.trim().toLowerCase()}`;
}

export function isDuplicateInQueue(
  firstName: string,
  lastName: string,
  queue: QueueItem[]
): boolean {
  const key = personKey(firstName, lastName);
  if (!firstName.trim()) return false;
  return queue.some((q) => personKey(q.firstName, q.lastName) === key);
}

export function formatHistoryTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
