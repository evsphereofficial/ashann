"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Pointer-drag progress (0 → 1) along one axis.
 *
 * Drag is always an *enhancement*: every consumer also exposes a button that
 * calls `setProgress`, so the same outcome is reachable by click, tap and
 * keyboard. See AGENTS.md — "every drag needs a click/tap/keyboard alternative".
 */
export function useDragProgress(horizontal = true) {
  const [progress, setProgressState] = useState(0);
  const progressRef = useRef(0);
  const session = useRef<{ pointerId: number; origin: number; start: number } | null>(null);

  const setProgress = (value: number) => {
    const next = clamp01(value);
    progressRef.current = next;
    setProgressState(next);
  };

  const handlers = {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      session.current = {
        pointerId: event.pointerId,
        origin: horizontal ? event.clientX : event.clientY,
        start: progressRef.current,
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
      const active = session.current;
      if (!active || active.pointerId !== event.pointerId) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const extent = horizontal ? rect.width : rect.height;
      if (!extent) return;
      const current = horizontal ? event.clientX : event.clientY;
      setProgress(active.start + (current - active.origin) / extent);
    },
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
      if (session.current?.pointerId !== event.pointerId) return;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      session.current = null;
      // Snap to a settled state so a half-drag never leaves a dead object.
      setProgress(progressRef.current > 0.45 ? 1 : 0);
    },
    onPointerCancel: () => {
      session.current = null;
    },
  };

  return { progress, setProgress, handlers };
}
