"use client";

import { createContext, useContext } from "react";
import type { SceneId } from "@/content/types";

export type OverlayState =
  | { kind: "none" }
  | { kind: "lightbox"; memoryId: string }
  | { kind: "index" };

export interface ScrapbookApi {
  scene: SceneId;
  sceneIndex: number;
  /** True once the cover has been opened — gates the navigation chrome. */
  opened: boolean;
  overlay: OverlayState;
  /** True while a scene transition is in flight, to block double navigation. */
  transitioning: boolean;
  goTo: (scene: SceneId) => void;
  next: () => void;
  back: () => void;
  openOverlay: (overlay: OverlayState) => void;
  closeOverlay: () => void;
  /** Restarts the current scene's assembly timeline. */
  replayScene: () => void;
  /** Bumped whenever a scene should re-run its choreography. */
  replayToken: number;
}

export const ScrapbookContext = createContext<ScrapbookApi | null>(null);

export function useScrapbook(): ScrapbookApi {
  const value = useContext(ScrapbookContext);
  if (!value) {
    throw new Error("useScrapbook must be used inside <ScrapbookProvider>");
  }
  return value;
}
