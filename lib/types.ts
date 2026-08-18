export type ParticipantMode = "standard" | "special_guest" | "surpriza_speciala";

export interface QueueItem {
  id: string;
  firstName: string;
  lastName: string;
  songName: string;
  youtubeLink: string;
  mode: ParticipantMode;
  lyricsMode: boolean;
  /** Lyrics slides parsed from textarea (one empty line separates slides) */
  lyricsSlides: string[];
}

export interface AppState {
  queue: QueueItem[];
  activeId: string | null;
  lyricsSlideIndex: number;
  /** Whether the reveal animation is playing on projector */
  isRevealing: boolean;
  /** After reveal completes, show lyrics or singer info */
  showContent: boolean;
  /** Admin triggered — projector shows full-screen YouTube iframe */
  showYoutube: boolean;
}

export const initialState: AppState = {
  queue: [],
  activeId: null,
  lyricsSlideIndex: 0,
  isRevealing: false,
  showContent: false,
  showYoutube: false,
};

/** Split slides on a single empty line between stanzas */
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

export function getParticipantName(item: QueueItem): string {
  return `${item.firstName} ${item.lastName}`.trim();
}

export function getQueueDisplayName(item: QueueItem): string {
  const special = getSpecialModeLabel(item.mode);
  if (special) return special;
  return getParticipantName(item) || "—";
}
