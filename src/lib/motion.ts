import type { Transition, Variants } from "framer-motion";

/**
 * Shared Framer Motion vocabulary.
 *
 * Ownership rule (AGENTS.md "Do not let multiple animation systems control
 * the same property on the same element"): Framer Motion owns enter/exit,
 * hover/tap feedback, layout, overlays and state-driven interaction motion.
 * GSAP owns multi-step assembly timelines. The two never touch the same
 * element's transform at the same time — see `docs/scene-interaction-map.md`.
 */

/** Paper has weight: it arrives, decelerates, and settles. Never floaty. */
export const paperSettle: Transition = {
  type: "spring",
  stiffness: 165,
  damping: 20,
  mass: 0.9,
};

/** A quicker, slightly bouncier settle for small tactile objects. */
export const objectSettle: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 17,
  mass: 0.7,
};

/** Stickers peel and pop — deliberately over-damped once, then rest. */
export const stickerPop: Transition = {
  type: "spring",
  stiffness: 460,
  damping: 13,
  mass: 0.6,
};

/** Scene-level transitions are slower and use an easing curve, not a spring. */
export const sceneSwap: Transition = {
  duration: 0.5,
  ease: [0.22, 0.68, 0.24, 1],
};

/**
 * Scene enter/exit variants (Framer Motion owns scene-level transitions).
 * The wrapper starts transparent so a scene's own assembly timeline can arm
 * itself without a visible flash.
 */
export const sceneVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.68, 0.24, 1] },
  },
  exit: {
    opacity: 0,
    y: -18,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

/** Overlay motion — quick in, slightly slower out. */
export const overlayIn: Transition = { duration: 0.28, ease: [0.16, 1, 0.3, 1] };

/**
 * Standard entrance used by scene props: arrives from a direction, rotates a
 * few degrees off its resting angle, and settles at `rest`.
 *
 * `rest` is the resting rotation so the composition stays asymmetric once
 * everything has landed.
 */
export function dropIn(
  from: { x?: number; y?: number; rotate?: number },
  rest: number,
  transition: Transition = paperSettle,
): Variants {
  return {
    hidden: {
      opacity: 0,
      x: from.x ?? 0,
      y: from.y ?? 40,
      rotate: from.rotate ?? rest - 14,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: rest,
      scale: 1,
      transition,
    },
    exit: {
      opacity: 0,
      y: -24,
      rotate: rest + 8,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
    },
  };
}

/** Stagger helper that keeps sequencing readable rather than simultaneous. */
export function stagger(total: number, step = 0.07, start = 0) {
  return { delay: start, staggerChildren: step, delayChildren: start, count: total };
}

/** Container variants for "objects assemble into a composition" sequences. */
export const assembleContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

export const assembleItem: Variants = {
  hidden: { opacity: 0, y: 46, rotate: -12, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: paperSettle,
  },
  exit: { opacity: 0, y: -30, transition: { duration: 0.25 } },
};
