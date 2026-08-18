"use client";

import { useCallback } from "react";

interface ProjectorShellProps {
  children: React.ReactNode;
}

export default function ProjectorShell({ children }: ProjectorShellProps) {
  const handleClick = useCallback(async () => {
    if (document.fullscreenElement) return;
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Browser blocked fullscreen
    }
  }, []);

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
