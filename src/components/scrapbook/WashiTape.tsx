"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type TapeVariant = "blush" | "mint" | "butter" | "stripe" | "grid" | "plain";

const TAPE: Record<TapeVariant, { background: string; border?: string }> = {
  blush: { background: "rgb(242 201 210 / 0.82)" },
  mint: { background: "rgb(201 228 217 / 0.85)" },
  butter: { background: "rgb(245 228 170 / 0.85)" },
  stripe: {
    background:
      "repeating-linear-gradient(45deg, rgb(192 57 43 / 0.75) 0 8px, rgb(251 247 241 / 0.85) 8px 16px)",
  },
  grid: {
    background:
      "linear-gradient(to right, rgb(184 94 117 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(184 94 117 / 0.35) 1px, transparent 1px), rgb(251 247 241 / 0.9)",
    backgroundSize: "9px 9px, 9px 9px, 100% 100%",
  },
  plain: { background: "rgb(251 247 241 / 0.86)" },
};

export interface WashiTapeProps {
  variant?: TapeVariant;
  /** Length in CSS units — tape is always a short strip, never a bar. */
  width?: string;
  height?: string;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  /** Frayed ends read as torn-by-hand rather than cut. */
  tornEnds?: boolean;
}

/** A strip of washi/masking tape pinning something to the page. */
export function WashiTape({
  variant = "blush",
  width = "104px",
  height = "26px",
  rotate = -6,
  className,
  style,
  tornEnds = true,
}: WashiTapeProps) {
  const mask = tornEnds
    ? "polygon(0% 8%, 4% 0%, 96% 4%, 100% 0%, 98% 50%, 100% 100%, 95% 96%, 5% 100%, 0% 92%)"
    : undefined;

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none block shadow-sm", className)}
      style={{
        width,
        height,
        rotate: `${rotate}deg`,
        clipPath: mask,
        opacity: 0.94,
        ...TAPE[variant],
        ...style,
      }}
    />
  );
}
