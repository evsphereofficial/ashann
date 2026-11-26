'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { gsap, type GsapTimeline } from '@/lib/gsap';
import { stickerPop } from '@/lib/motion';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { anniversary } from '@/content/anniversary';
import { memories } from '@/content/memories';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { HandwrittenNote } from '@/components/scrapbook/HandwrittenNote';
import { Polaroid } from '@/components/scrapbook/Polaroid';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element, frame } from '@/lib/art';

/**
 * Chapter 01 — "what is this scrapbook", assembled in front of you.
 *
 * Composition: a torn newsprint ground, a blue collage sheet slid in behind
 * the main page, a Wamuu cut-out breaking out from behind the paper, and the
 * sticker box dropped at an angle. Nothing lines up on a grid — the page is
 * built from overlap.
 *
 * GSAP owns the assembly timeline (paper → photo → sticker box → footer) and
 * the parallax drift. Framer Motion owns each sticker once it is on the page:
 * pop in, drag, tap/keyboard feedback. The two never write to the same element.
 *
 * Drag is always optional: every sticker can be placed with a button and
 * moved with the arrow keys, so nothing on this page needs a pointer.
 */

const STICKER_SLOTS = [
  { left: '3%', top: '72%' },
  { left: '38%', top: '84%' },
  { left: '70%', top: '64%' },
] as const;

const STICKER_LABELS = ['SIX MONTHS', 'TAP EVERYTHING', 'DRAG ME'] as const;

const NUDGE: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

function PlacedSticker({
  label,
  index,
  slot,
  boardRef,
  onRemove,
}: {
  label: string;
  index: number;
  slot: { left: string; top: string };
  boardRef: RefObject<HTMLDivElement | null>;
  onRemove: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const draggedRef = useRef(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = NUDGE[event.key];
    if (!direction) return;
    event.preventDefault();
    event.stopPropagation();

    const board = boardRef.current;
    const element = event.currentTarget;
    if (!board) return;

    const step = event.shiftKey ? 18 : 6;
    const bounds = board.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    const relativeLeft = box.left - bounds.left;
    const relativeTop = box.top - bounds.top;
    const nextLeft = Math.min(
      Math.max(0, relativeLeft + direction[0] * step),
      Math.max(0, bounds.width - box.width),
    );
    const nextTop = Math.min(
      Math.max(0, relativeTop + direction[1] * step),
      Math.max(0, bounds.height - box.height),
    );

    x.set(x.get() + (nextLeft - relativeLeft));
    y.set(y.get() + (nextTop - relativeTop));
  };

  return (
    <motion.div
      className="pointer-events-auto absolute"
      style={{ left: slot.left, top: slot.top, x, y }}
      drag
      dragConstraints={boardRef}
      dragMomentum={false}
      dragElastic={0.06}
      onDragStart={() => {
        draggedRef.current = true;
      }}
      onDragEnd={() => {
        window.setTimeout(() => {
          draggedRef.current = false;
        }, 0);
      }}
      initial={{ opacity: 0, scale: 0.35, rotate: -22 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={stickerPop}
      data-arrow-scope="sticker"
    >
      <button
        type="button"
        onClick={() => {
          if (draggedRef.current) return;
          onRemove();
        }}
        onKeyDown={handleKeyDown}
        aria-label={`Sticker reading ${label}. Drag it with a pointer, move it with the arrow keys, or activate to peel it off again.`}
        className="group relative block cursor-grab rounded-[10px] border-[3px] border-white bg-[#fffdf7] px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-[var(--color-ink)] uppercase shadow-[0_10px_18px_-12px_rgb(36_35_38/0.9)] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
        style={{ rotate: `${index % 2 === 0 ? -3 : 4}deg` }}
      >
        {label}
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--color-valentine)] text-[11px] leading-none text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          ×
        </span>
      </button>
    </motion.div>
  );
}

export default function OpeningScene() {
  const { goToScene, openOverlay, reducedMotion } = useScrapbook();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<GsapTimeline | null>(null);
  const [placed, setPlaced] = useState<number[]>([]);
  const [status, setStatus] = useState('');

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  /* Assembly: the spread builds itself in one continuous GSAP pass. */
  useEffect(() => {
    if (reducedMotion || !boardRef.current) return;

    const items = Array.from(boardRef.current.querySelectorAll<HTMLElement>('[data-assemble]'));
    if (items.length === 0) return;

    const timeline = gsap.timeline({ delay: 0.1 });
    timeline.from(items, {
      y: 64,
      opacity: 0,
      rotate: -7,
      duration: 0.75,
      stagger: 0.13,
      ease: 'power3.out',
    });

    timelineRef.current = timeline;
    return () => {
      timeline.kill();
      gsap.set(items, { clearProps: 'opacity,transform' });
      timelineRef.current = null;
    };
  }, [reducedMotion]);

  const place = (index: number) => {
    setPlaced((current) => (current.includes(index) ? current : [...current, index]));
    setStatus(`Sticker ${STICKER_LABELS[index]} placed on the page. Use the arrow keys to move it.`);
  };

  const remove = (index: number) => {
    setPlaced((current) => current.filter((item) => item !== index));
    setStatus(`Sticker ${STICKER_LABELS[index]} peeled off.`);
  };

  return (
    <div ref={scopeRef} className="scene-stage relative px-4 py-16 sm:px-6">
      {/* ── Ground: blue collage paper, torn edge, scattered supplied art ── */}
      <ArtImg
        src={background(PAPER.blueShatteredStars)}
        decorative
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply"
      />
      <ArtImg
        src={background(PAPER.printmakingGrid)}
        decorative
        data-parallax="0.2"
        className="pointer-events-none absolute -right-16 top-10 w-72 rotate-[9deg] opacity-60"
      />
      <ArtImg
        src={element(ART.tornLinedCorner)}
        decorative
        data-parallax="0.34"
        className="pointer-events-none absolute -left-8 bottom-16 w-44 -rotate-[6deg] opacity-90"
      />
      <ArtImg
        src={element(ART.books)}
        decorative
        data-parallax="0.4"
        className="pointer-events-none absolute bottom-6 right-6 hidden w-40 opacity-95 lift-soft lg:block"
      />
      <ArtImg
        src={element(ART.cornerFlourish)}
        decorative
        data-parallax="0.16"
        className="pointer-events-none absolute right-10 top-4 w-36 opacity-70"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <ArtImg
          src={element(ART.tornNewsCaption)}
          decorative
          data-parallax="0.2"
          className="pointer-events-none absolute -top-10 right-4 w-52 rotate-[5deg] opacity-90"
        />

        <div ref={boardRef} className="relative">
          {/* Wamuu, cut out and slid in behind the page */}
          <ArtImg
            src={frame('wamuu', 4)}
            alt="Wamuu in blue armour — supplied cut-out tucked behind the opening page."
            data-parallax="0.26"
            className="pointer-events-none absolute -top-10 right-0 z-0 hidden h-[118%] w-[42%] object-contain object-right-top opacity-95 drop-shadow-[0_18px_22px_rgb(18_48_56/0.35)] lg:block"
          />

          <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
            {/* ── main sheet ─────────────────────────────────────────────── */}
            <div data-assemble className="relative z-10">
              <PaperLayer
                material="cream"
                rotate={-1.1}
                className="relative px-6 py-8 shadow-lifted sm:px-10 sm:py-12"
              >
                <WashiTape variant="stripe" className="absolute -top-3 left-10" rotate={-4} width="120px" />
                <ArtImg
                  src={element(ART.redStar)}
                  decorative
                  className="pointer-events-none absolute -right-4 -top-5 w-11"
                />
                <ArtImg
                  src={element(ART.ginghamNote)}
                  decorative
                  data-parallax="0.14"
                  className="pointer-events-none absolute -bottom-8 -left-6 hidden w-32 rotate-[-9deg] opacity-95 lift-soft sm:block"
                />

                <p className="type-label text-[11px] text-[var(--color-valentine)]">
                  CHAPTER 01 · WHAT THIS IS
                </p>
                <h2
                  id="opening-title"
                  className="type-masthead mt-2 text-[clamp(2.1rem,6.5vw,4.2rem)] leading-[0.92]"
                >
                  {anniversary.conceptTitle}
                </h2>
                <FilledOrPlaceholder
                  as="p"
                  value={anniversary.subtitle}
                  className="type-hand mt-4 text-[clamp(1.25rem,3vw,1.9rem)] leading-tight text-[var(--color-steel)]"
                />

                <HandwrittenNote stock="sticky" rotate={-1.6} className="mt-6 max-w-lg">
                  {anniversary.openingNote}
                </HandwrittenNote>

                <ul className="mt-7 grid gap-3 border-t border-dashed border-[#c9b79c] pt-5 sm:grid-cols-3">
                  <li className="rounded-[8px] border border-[#e0d2b8] bg-white/70 p-3">
                    <span className="type-label block text-[10px] text-[var(--color-valentine)]">TAP</span>
                    <span className="text-sm text-[var(--color-ink-soft)]">
                      Every object answers when you tap it.
                    </span>
                  </li>
                  <li className="rounded-[8px] border border-[#e0d2b8] bg-white/70 p-3">
                    <span className="type-label block text-[10px] text-[var(--color-valentine)]">DRAG</span>
                    <span className="text-sm text-[var(--color-ink-soft)]">
                      Or move things with the arrow keys.
                    </span>
                  </li>
                  <li className="rounded-[8px] border border-[#e0d2b8] bg-white/70 p-3">
                    <span className="type-label block text-[10px] text-[var(--color-valentine)]">ESCAPE</span>
                    <span className="text-sm text-[var(--color-ink-soft)]">
                      Closes anything you have opened.
                    </span>
                  </li>
                </ul>
              </PaperLayer>
            </div>

            {/* ── photo + sticker box ────────────────────────────────────── */}
            <div className="relative z-10 space-y-6 lg:pt-10">
              <div data-assemble className="relative">
                <ArtImg
                  src={element(ART.pocketWatch)}
                  decorative
                  data-parallax="0.3"
                  className="pointer-events-none absolute -right-6 -top-10 z-20 hidden w-24 rotate-[12deg] lift-soft sm:block"
                />
                <Polaroid
                  src={memories[0].image}
                  alt={memories[0].alt}
                  caption={memories[0].caption}
                  rotate={2.6}
                  onClick={() => openOverlay({ type: 'memory', id: memories[0].id })}
                />
                <p className="type-label mt-3 text-center text-[10px] text-[var(--color-ink-faint)]">
                  TAP THE PHOTOGRAPH TO READ THE BACK
                </p>
              </div>

              <div data-assemble className="relative">
                <PaperLayer material="kraft" rotate={1.4} className="relative px-5 py-5 shadow-lifted">
                  <p className="type-label text-[11px] text-[#3c2a17]">THE STICKER BOX</p>
                  <p className="mt-1 text-sm text-[#4a3a24]">
                    Peel one and it drops onto the page.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {STICKER_LABELS.map((label, index) => {
                      const isPlaced = placed.includes(index);
                      return (
                        <button
                          key={label}
                          type="button"
                          disabled={isPlaced}
                          onClick={() => place(index)}
                          className="rounded-full border-2 border-[#3c2a17] bg-[#fbf7f1] px-3.5 py-2 text-[10px] font-bold tracking-[0.14em] text-[#3c2a17] uppercase transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:text-[#7a6444] disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c2a17]"
                        >
                          {isPlaced ? `✓ ${label}` : `Peel “${label}”`}
                        </button>
                      );
                    })}
                  </div>
                  <span aria-hidden="true" className="absolute -bottom-5 -right-4">
                    <ArtImg
                      src={element(ART.doubleHeart)}
                      decorative
                      className="w-11 drop-shadow-[0_4px_6px_rgb(0_0_0/0.25)]"
                    />
                  </span>
                </PaperLayer>
              </div>
            </div>
          </div>

          {/* ── placed stickers live above the spread ─────────────────── */}
          <div className="pointer-events-none absolute inset-0" aria-label="Placed stickers">
            {placed.map((index) => (
              <PlacedSticker
                key={index}
                label={STICKER_LABELS[index]}
                index={index}
                slot={STICKER_SLOTS[index]}
                boardRef={boardRef}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {status}
        </p>

        <div data-assemble className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goToScene('timeline')}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
          >
            Next: the six months →
          </button>
          <button
            type="button"
            onClick={() => goToScene('cover')}
            className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            ← Back to the cover
          </button>
        </div>
      </div>

      {/* Star scatter, kept for the sticker-box accent */}
      <ArtImg
        src={element(ART.redStar)}
        decorative
        data-parallax="0.3"
        className="pointer-events-none absolute left-6 top-24 hidden w-11 -rotate-[10deg] sm:block"
      />
    </div>
  );
}
