"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  /** When present the polaroid can be turned over to read the back. */
  back?: string;
  rotate?: number;
  className?: string;
  imageClassName?: string;
  /** Resting aspect of the photo window. */
  aspect?: string;
  onClick?: () => void;
  /** Show the explicit "turn over" affordance (always paired with a button). */
  showFlipControl?: boolean;
  flipped?: boolean;
  onFlip?: () => void;
  priority?: boolean;
}

/**
 * A instant-film print with a wide chin for the handwritten caption.
 *
 * The flip is a genuine 3D rotation on a single element owned by Framer
 * Motion. A visible `Turn over` button (not just the drag) satisfies the
 * "every drag needs a click alternative" rule.
 */
export function Polaroid({
  src,
  alt,
  caption,
  back,
  rotate = 0,
  className,
  imageClassName,
  aspect = "4 / 5",
  onClick,
  showFlipControl = false,
  flipped = false,
  onFlip,
  priority = false,
}: PolaroidProps) {
  const interactive = Boolean(onClick);
  const Tag = interactive ? "button" : "div";

  return (
    <div className={cn("relative", className)} style={{ perspective: 1200 }}>
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d", rotate: `${rotate}deg` }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        {/* FRONT */}
        <Tag
          {...(interactive
            ? { type: "button" as const, onClick, "aria-label": caption ?? alt }
            : {})}
          className={cn(
            "block w-full bg-white p-1.5 pb-1 text-left shadow-lifted sm:p-2.5 sm:pb-1",
            interactive && "object-interactive border-0",
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span
            className="relative block overflow-hidden bg-paper-deep"
            style={{ aspectRatio: aspect }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
              className={cn("object-cover", imageClassName)}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 20% 8%, rgb(255 255 255 / 0.28), transparent 55%)",
                mixBlendMode: "soft-light",
              }}
            />
          </span>
          {caption ? (
            <span className="type-hand mt-1.5 block px-1 pb-1 text-center text-sm leading-snug text-ink sm:mt-2 sm:text-[1.05rem]">
              {caption}
            </span>
          ) : (
            <span className="mt-2 block" />
          )}
        </Tag>

        {/* BACK */}
        {back ? (
          <div
            aria-hidden={!flipped}
            className="absolute inset-0 flex flex-col justify-center bg-[#FBF7F1] p-5 shadow-lifted"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0 25px, rgb(110 147 184 / 0.35) 25px 26px)",
            }}
          >
            <p className="type-hand text-[1.15rem] leading-[26px] text-ink">{back}</p>
          </div>
        ) : null}
      </motion.div>

      {showFlipControl && back && onFlip ? (
        <button
          type="button"
          onClick={onFlip}
          aria-pressed={flipped}
          className={cn(
            "mt-3 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-4 py-2",
            "text-[0.7rem] font-bold tracking-[0.16em] uppercase transition-transform hover:-translate-y-0.5",
          )}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path d="M18.5 2.5v4h-4M5.5 21.5v-4h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {flipped ? "See the front" : "Turn over"}
        </button>
      ) : null}
    </div>
  );
}
