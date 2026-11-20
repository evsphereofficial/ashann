"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Single source of truth for reduced motion.
 *
 * Framer Motion's `useReducedMotion` already tracks the media query, but GSAP
 * timelines need the same flag outside React's render cycle — so this hook
 * exposes it as a plain boolean plus a live subscription.
 *
 * Reduced motion removes *movement*, never *outcome*: every interaction still
 * resolves to the same revealed content, it just arrives without travelling.
 */
export function usePrefersReducedMotion(): boolean {
  const framerReduced = useReducedMotion();
  const [mediaReduced, setMediaReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setMediaReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setMediaReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return Boolean(framerReduced) || mediaReduced;
}

/**
 * Runs a GSAP timeline immediately when motion is reduced, otherwise plays it.
 * Every scene entrance goes through this so reduced-motion is a first-class
 * path rather than an afterthought.
 */
export function useGsapPlayback() {
  const reduced = usePrefersReducedMotion();

  return {
    reduced,
    /**
     * `build` receives `reduced`; when true it should produce the finished
     * composition with zero-duration tweens. The returned timeline is either
     * played or fast-forwarded to its end state.
     */
    play(build: (reduced: boolean) => gsap.core.Timeline, deps: unknown[] = []) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => {
        const timeline = build(reduced);
        if (reduced) {
          timeline.progress(1, false);
          return () => {
            timeline.kill();
          };
        }
        return () => {
          timeline.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [reduced, ...deps]);
    },
  };
}
