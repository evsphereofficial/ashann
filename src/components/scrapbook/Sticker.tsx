"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { stickerPop } from "@/lib/motion";

export interface StickerProps {
  children: ReactNode;
  /** Rendered when the sticker is not itself a control (pure decoration). */
  decorative?: boolean;
  label?: string;
  onClick?: () => void;
  pressed?: boolean;
  rotate?: number;
  scale?: number;
  className?: string;
  /** A die-cut sticker always has a white border, like a real cut-out. */
  dieCut?: boolean;
  tone?: "white" | "cream" | "tint";
  tint?: string;
  /** Small callout that appears on hover/focus for discoverability. */
  hint?: string;
}

/**
 * A peelable die-cut sticker.
 *
 * Interactions use a real `<button>` so keyboard and touch work identically;
 * `decorative` downgrades it to a non-focusable element for pure ornament.
 * The pop is Framer Motion (state-driven), so it never fights a GSAP timeline.
 */
export function Sticker({
  children,
  decorative = false,
  label,
  onClick,
  pressed,
  rotate = 0,
  scale = 1,
  className,
  dieCut = true,
  tone = "white",
  tint,
  hint,
}: StickerProps) {
  const surface =
    tone === "tint"
      ? { background: tint ?? "#F9E3E8" }
      : tone === "cream"
        ? { background: "#FBF7F1" }
        : { background: "#FFFFFF" };

  const content = (
    <motion.span
      className={cn(
        "relative inline-block",
        dieCut && "border-[3px] border-white",
        className,
      )}
      style={{
        ...surface,
        rotate: `${rotate}deg`,
        boxShadow: "0 8px 16px -10px rgb(36 35 38 / 0.7)",
        borderRadius: 10,
      }}
      whileHover={decorative ? undefined : { scale: scale * 1.07, rotate: rotate + 3 }}
      whileTap={decorative ? undefined : { scale: scale * 0.95, rotate: rotate - 2 }}
      transition={stickerPop}
      initial={false}
    >
      {children}
      {hint && !decorative ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] whitespace-nowrap text-cream opacity-0 transition-opacity group-hover:opacity-100"
        >
          {hint}
        </span>
      ) : null}
    </motion.span>
  );

  if (decorative || !onClick || !label) {
    return <span aria-hidden={decorative ? "true" : undefined}>{content}</span>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="group object-interactive inline-block border-0 bg-transparent p-0"
    >
      {content}
    </button>
  );
}
