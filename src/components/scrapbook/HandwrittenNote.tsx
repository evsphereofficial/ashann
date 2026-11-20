import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface HandwrittenNoteProps {
  children: ReactNode;
  rotate?: number;
  /** Small paper the note is written on. */
  stock?: "sticky" | "note" | "card" | "scrap";
  className?: string;
  style?: CSSProperties;
  /** Adds a strip of tape along the top edge. */
  taped?: boolean;
}

const STOCK: Record<string, { background: string; color: string; border: string }> = {
  sticky: { background: "#FBEFA6", color: "#3a3320", border: "none" },
  note: { background: "#FBF7F1", color: "#242326", border: "1px solid rgb(36 35 38 / 0.12)" },
  card: { background: "#F9E3E8", color: "#5c2b3a", border: "1px solid rgb(184 94 117 / 0.35)" },
  scrap: {
    background: "#EFE4D6",
    color: "#4a4750",
    border: "1px dashed rgb(36 35 38 / 0.3)",
  },
};

/** Text written by hand onto a scrap of paper. */
export function HandwrittenNote({
  children,
  rotate = 0,
  stock = "note",
  className,
  style,
  taped = false,
}: HandwrittenNoteProps) {
  return (
    <div
      className={cn("relative px-4 py-3 shadow-paper", className)}
      style={{
        rotate: `${rotate}deg`,
        ...STOCK[stock],
        ...style,
      }}
    >
      {taped ? (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2"
          style={{
            background: "rgb(242 201 210 / 0.85)",
            clipPath:
              "polygon(0% 10%, 5% 0%, 95% 5%, 100% 0%, 98% 50%, 100% 100%, 94% 95%, 6% 100%, 0% 90%)",
          }}
        />
      ) : null}
      <div className="type-hand text-[1.15rem] leading-snug">{children}</div>
    </div>
  );
}
