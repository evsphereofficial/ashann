"use client";

/**
 * GSAP entry point.
 *
 * GSAP is used only for multi-step choreography (assembly timelines, cover
 * opening, panel reveals, letter unfolding). Framer Motion handles everything
 * component-shaped. Registering plugins here keeps them out of the SSR path —
 * this module is imported exclusively from client components.
 */
import gsap from "gsap";

if (typeof window !== "undefined") {
  // No ScrollTrigger: scene progression is explicit (buttons / keys), never
  // scroll-hijacked, per the functional requirements.
  gsap.defaults({ ease: "power3.out", overwrite: "auto" });
}

export { gsap };
export type GsapTimeline = gsap.core.Timeline;
