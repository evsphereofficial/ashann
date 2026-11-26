"use client";

/**
 * GSAP entry point.
 *
 * Two jobs, deliberately split:
 *
 *  - **ScrollTrigger** owns everything scroll-shaped: which chapter is on
 *    screen, pinned spreads, parallax layers, scrubbed reveals and the
 *    palette washes that carry the reader from one character's colours to the
 *    next. It is registered once, here, so the plugin never reaches the SSR
 *    path (this module is imported only from client components).
 *  - **gsap timelines** own multi-step choreography inside a chapter —
 *    the cover opening, the letter unfolding, collages assembling.
 *
 * Framer Motion keeps component-shaped motion (enter/exit, hover/tap,
 * overlays, drag, flip). The two systems never write to the same property on
 * the same element: scroll work is scoped to wrapper/parallax layers, and
 * component work stays on the component itself.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", overwrite: "auto" });
}

export { gsap, ScrollTrigger };
export type GsapTimeline = gsap.core.Timeline;
