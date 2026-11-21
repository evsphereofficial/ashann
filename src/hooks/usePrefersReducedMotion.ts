"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Single source of truth for reduced motion.
 *
 * `useSyncExternalStore` keeps server and first client render identical (the
 * server snapshot is `false`), so there is no hydration mismatch — the real
 * preference lands immediately after.
 *
 * Reduced motion removes *movement*, never *outcome*: every interaction still
 * resolves to the same revealed content, it just arrives without travelling.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
