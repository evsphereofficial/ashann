import { cn } from "@/lib/cn";

export interface LaceTrimProps {
  /** CSS length. Horizontal strips use width, vertical strips use height. */
  length?: string;
  thickness?: string;
  orientation?: "horizontal" | "vertical";
  color?: string;
  className?: string;
}

/**
 * Crocheted lace edging, drawn with layered radial gradients so it scales
 * cleanly at any length and ships with zero image weight.
 */
export function LaceTrim({
  length = "100%",
  thickness = "34px",
  orientation = "horizontal",
  color = "rgb(255 255 255 / 0.95)",
  className,
}: LaceTrimProps) {
  const horizontal = orientation === "horizontal";

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none block", className)}
      style={{
        width: horizontal ? length : thickness,
        height: horizontal ? thickness : length,
        backgroundColor: color,
        // Scalloped edge + eyelet holes.
        WebkitMaskImage: horizontal
          ? "radial-gradient(circle at 13px 100%, transparent 0 9px, #000 9.5px)"
          : "radial-gradient(circle at 100% 13px, transparent 0 9px, #000 9.5px)",
        maskImage: horizontal
          ? "radial-gradient(circle at 13px 100%, transparent 0 9px, #000 9.5px)"
          : "radial-gradient(circle at 100% 13px, transparent 0 9px, #000 9.5px)",
        WebkitMaskSize: horizontal ? "26px 100%" : "100% 26px",
        maskSize: horizontal ? "26px 100%" : "100% 26px",
        WebkitMaskRepeat: horizontal ? "repeat-x" : "repeat-y",
        maskRepeat: horizontal ? "repeat-x" : "repeat-y",
        backgroundImage: horizontal
          ? "radial-gradient(circle at 13px 7px, transparent 0 3.5px, rgba(0,0,0,0.10) 3.5px 4.5px, transparent 5px)"
          : "radial-gradient(circle at 7px 13px, transparent 0 3.5px, rgba(0,0,0,0.10) 3.5px 4.5px, transparent 5px)",
        backgroundSize: horizontal ? "26px 100%" : "100% 26px",
        backgroundRepeat: horizontal ? "repeat-x" : "repeat-y",
        boxShadow: "0 2px 6px -3px rgb(36 35 38 / 0.4)",
      }}
    />
  );
}
