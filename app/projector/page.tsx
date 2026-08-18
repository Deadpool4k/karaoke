"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket, emitEvent } from "@/lib/socket";
import {
  getActiveItem,
  getParticipantName,
  isLyricsIntroPhase,
  type AppState,
} from "@/lib/types";
import ProjectorShell from "@/components/projector/ProjectorShell";
import IdleScreen from "@/components/projector/IdleScreen";
import SingerReveal from "@/components/projector/SingerReveal";
import LyricsDisplay from "@/components/projector/LyricsDisplay";
import YouTubeDisplay from "@/components/projector/YouTubeDisplay";

export default function ProjectorPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const socket = getSocket();

    const handleState = (s: AppState) => setState(s);

    socket.on("state:update", handleState);
    socket.on("connect", () => socket.emit("state:request"));

    if (socket.connected) socket.emit("state:request");

    return () => {
      socket.off("state:update", handleState);
    };
  }, []);

  const active = state ? getActiveItem(state) : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state?.showYoutube) return;
      if (!active?.lyricsMode || !state?.showContent) return;
      if (active.lyricsSlides.length === 0) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          emitEvent("lyrics:next");
          break;
        case "ArrowLeft":
          e.preventDefault();
          emitEvent("lyrics:prev");
          break;
      }
    },
    [active, state?.showContent, state?.showYoutube]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  let content: React.ReactNode = <IdleScreen />;

  if (state && active) {
    if (state.showYoutube && active.youtubeLink) {
      content = <YouTubeDisplay url={active.youtubeLink} />;
    } else if (isLyricsIntroPhase(state, active)) {
      content = (
        <SingerReveal
          item={active}
          isRevealing={false}
          showContent={true}
        />
      );
    } else if (
      active.lyricsMode &&
      active.lyricsSlides.length > 0 &&
      state.showContent &&
      !state.isRevealing &&
      state.lyricsSlideIndex >= 0
    ) {
      content = (
        <LyricsDisplay
          slides={active.lyricsSlides}
          currentIndex={state.lyricsSlideIndex}
          songName={active.songName}
          participantName={getParticipantName(active)}
        />
      );
    } else if (state.isRevealing || state.showContent) {
      content = (
        <SingerReveal
          item={active}
          isRevealing={state.isRevealing}
          showContent={state.showContent}
        />
      );
    }
  }

  return <ProjectorShell>{content}</ProjectorShell>;
}
