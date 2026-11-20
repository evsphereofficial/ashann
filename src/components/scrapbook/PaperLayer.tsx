"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { paperSettle } from "@/lib/motion";

export type PaperMaterial =
  | "paper"
  | "kraft"
  | "cream"
  | "lined"
  | "grid"
  | "halftone"
  | "newsprint"
  | "blush"
  | "powder"
  | "mint"
  | "burgundy";

const MATERIAL_CLASS: Record<PaperMaterial, string> = {
  paper: "material-paper",
  kraft: "material-kraft",
  cream: "bg-[#FBF7F1]",
  lined: "material-lined bg-[#FBF7F1]",
  grid: "material-grid bg-[#FBF7F1]",
  halftone: "material-halftone bg-[#FBF7F1] text-ink/45",
  newsprint: "material-newsprint",
  blush: "bg-[#F9E3E8]",
  powder: "bg-[#E7EFF7]",
  mint: "bg-[#EAF3EE]",
  burgundy: "bg-[#7A2128]",
};

export interface PaperLayerProps {
  children?: ReactNode;
  material?: PaperMaterial;
  /** Resting rotation — the collage is deliberately asymmetric. */
  rotate?: number;
  /** Torn edges are CSS masks, so they cost nothing to animate. */
  torn?: "none" | "top" | "bottom" | "both";
  lifted?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Framer Motion entrance; pass `false` for statically positioned props. */
  animate?:
    | false
    | {
        from?: { x?: number; y?: number; rotate?: number };
        delay?: number;
      };
}

/**
 * A sheet of stock sitting on the page. The single most-used material in the
 * scrapbook — every scene composes from several of these at different scales
 * and rotations rather than from repeated cards.
 */
export function PaperLayer({
  children,
  material = "paper",
  rotate = 0,
  torn = "none",
  lifted = false,
  className,
  style,
  animate = false,
}: PaperLayerProps) {
  const tornClass =
    torn === "both"
      ? "edge-torn-top edge-torn-bottom"
      : torn === "top"
        ? "edge-torn-top"
        : torn === "bottom"
          ? "edge-torn-bottom"
          : "";

  const body = (
    <div
      className={cn(
        "relative",
        MATERIAL_CLASS[material],
        tornClass,
        lifted && "shadow-lifted",
        className,
      )}
      style={{ rotate: `${rotate}deg`, ...style }}
    >
      {children}
    </div>
  );

  if (!animate) return body;

  const { from = {}, delay = 0 } = animate;
  return (
    <motion.div
      initial={{ opacity: 0, x: from.x ?? 0, y: from.y ?? 48, rotate: (from.rotate ?? rotate) - 16 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...paperSettle, delay }}
      className="will-change-transform"
    >
      {body}
    </motion.div>
  );
}
