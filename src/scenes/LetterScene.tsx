'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, type GsapTimeline } from '@/lib/gsap';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { letter } from '@/content/keepsakes';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element } from '@/lib/art';

const FOLDED = { rotateX: 74, scale: 0.94, opacity: 0.78, y: 10 };

/**
 * Scene 7 — a sealed letter.
 *
 * GSAP owns the unfold: the wax seal cracks away, the folded sheet rotates
 * flat, and the lines arrive one after another. The text itself is only
 * revealed (and only readable by assistive tech) once the seal is broken, so
 * nothing here is animation-only content.
 */
export default function LetterScene() {
  const { goToScene, reducedMotion } = useScrapbook();
  const [open, setOpen] = useState(false);

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<GsapTimeline | null>(null);

  const lineRefs = useRef<HTMLElement[]>([]);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const breakSeal = () => {
    if (open) return;
    setOpen(true);

    const lines = lineRefs.current.filter(Boolean);

    if (reducedMotion) {
      gsap.set(sheetRef.current, { rotateX: 0, scale: 1, opacity: 1, y: 0 });
      gsap.set(sealRef.current, { opacity: 0, scale: 0.4 });
      window.requestAnimationFrame(() => panelRef.current?.focus());
      return;
    }

    const timeline = gsap.timeline({ onComplete: () => panelRef.current?.focus() });
    timeline
      .to(sealRef.current, { scale: 0.35, opacity: 0, rotate: 38, duration: 0.34, ease: 'power2.in' }, 0)
      .to(sheetRef.current, { rotateX: 0, scale: 1, opacity: 1, y: 0, duration: 0.95, ease: 'power3.out' }, 0.12);
    if (lines.length > 0) {
      timeline.from(lines, { y: 20, opacity: 0, stagger: 0.09, duration: 0.5, ease: 'power2.out' }, 0.5);
    }

    timelineRef.current = timeline;
  };

  const foldAgain = () => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    setOpen(false);
    gsap.set(sheetRef.current, { ...FOLDED });
    gsap.set(sealRef.current, { clearProps: 'opacity,transform' });
    gsap.set(lineRefs.current.filter(Boolean), { clearProps: 'opacity,transform' });
    window.requestAnimationFrame(() => sealRef.current?.focus());
  };

  const pushLine = (node: HTMLElement | null) => {
    if (node && !lineRefs.current.includes(node)) lineRefs.current.push(node);
  };

  return (
    <div ref={scopeRef} className="scene-stage relative px-4 py-16 sm:px-6">
      {/* ── Ground: stationery, stamps, dried flowers ────────────────────── */}
      <ArtImg
        src={background(PAPER.scriptOnBlack)}
        decorative
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.10] mix-blend-multiply"
      />
      <ArtImg
        src={element(ART.pinkLetterPaper)}
        decorative
        data-parallax="0.3"
        className="pointer-events-none absolute -left-10 top-16 w-56 -rotate-[8deg] opacity-90"
      />
      <ArtImg
        src={element(ART.driedRoses)}
        decorative
        data-parallax="0.4"
        className="pointer-events-none absolute right-6 top-12 w-32 rotate-[9deg] opacity-95 lift-soft"
      />
      <ArtImg
        src={element(ART.redGingham)}
        decorative
        data-parallax="0.22"
        className="pointer-events-none absolute bottom-16 right-10 w-44 rotate-[6deg] opacity-80"
      />
      <ArtImg
        src={element(ART.doubleHeart)}
        decorative
        data-parallax="0.34"
        className="pointer-events-none absolute bottom-10 left-10 w-24 -rotate-[6deg] opacity-90"
      />
      <ArtImg
        src={element(ART.starGarland)}
        decorative
        data-parallax="0.16"
        className="pointer-events-none absolute left-1/2 top-6 hidden w-72 -translate-x-1/2 opacity-80 lg:block"
      />

      <div className="relative mx-auto w-full max-w-3xl">
        <header data-reveal className="relative mb-8 text-center">
          <p className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 06 · THE LETTER</p>
          <h2 id="letter-title" className="type-masthead mt-2 text-[clamp(2rem,6vw,3.6rem)] leading-[0.95]">
            Something sealed
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--color-ink-soft)]">
            Break the wax seal to unfold it. Nothing is hidden from you — it is just folded.
          </p>
        </header>

        <div className="relative" style={{ perspective: 1500 }}>
          {/* ── the sheet ─────────────────────────────────────────────── */}
          <div
            ref={sheetRef}
            className="relative"
            style={{
              transformOrigin: 'center center',
              transform: `rotateX(${FOLDED.rotateX}deg) scale(${FOLDED.scale})`,
              opacity: FOLDED.opacity,
            }}
          >
            <PaperLayer material="cream" rotate={-0.7} className="relative px-6 py-8 shadow-lifted sm:px-12 sm:py-12">
              <WashiTape variant="blush" className="absolute -top-3 left-1/2 -translate-x-1/2" rotate={-3} width="130px" />
              <span aria-hidden="true" className="absolute right-5 top-5">
                <ArtImg
                  src={element(ART.doubleHeart)}
                  decorative
                  className="w-9 drop-shadow-[0_4px_6px_rgb(0_0_0/0.25)]"
                />
              </span>

              <div
                ref={panelRef}
                tabIndex={-1}
                aria-hidden={!open}
                className="focus:outline-none"
                style={{ visibility: open ? 'visible' : 'hidden' }}
              >
                <p ref={pushLine} className="type-hand text-[clamp(1.4rem,3.5vw,2rem)] leading-tight text-[var(--color-ink)]">
                  <FilledOrPlaceholder value={letter.greeting} />
                </p>

                <div className="mt-5 space-y-4 border-l-2 border-dashed border-[#c9b79c] pl-4 sm:pl-6">
                  {letter.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      ref={(node) => {
                        if (node) pushLine(node);
                      }}
                      className="type-serif text-[clamp(1rem,2.2vw,1.2rem)] leading-relaxed text-[var(--color-ink-soft)]"
                    >
                      <FilledOrPlaceholder value={paragraph} />
                    </p>
                  ))}
                </div>

                <p
                  ref={(node) => {
                    if (node) pushLine(node);
                  }}
                  className="type-hand mt-8 text-right text-[clamp(1.3rem,3vw,1.9rem)] text-[var(--color-ink)]"
                >
                  <FilledOrPlaceholder value={letter.signature} />
                </p>
              </div>
            </PaperLayer>
          </div>

          {/* ── the wax seal ──────────────────────────────────────────── */}
          <button
            ref={sealRef}
            type="button"
            onClick={breakSeal}
            disabled={open}
            aria-hidden={open}
            className="group absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-ink)]"
          >
            <span
              className="grid h-24 w-24 place-items-center rounded-full border-[5px] border-[#7a2128] text-[#fbf7f1] shadow-[0_14px_26px_-14px_rgb(0_0_0/0.9)] transition group-hover:scale-105 group-active:scale-95 sm:h-28 sm:w-28"
              style={{
                background:
                  'radial-gradient(120% 120% at 30% 25%, #c0392b, #7a2128 65%, #5b161c)',
              }}
            >
              <span className="text-center leading-none">
                <span className="block text-[10px] font-bold tracking-[0.16em] uppercase">Wax seal</span>
                <span className="type-hand mt-1 block text-lg">press</span>
              </span>
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]" aria-live="polite">
          {open ? 'The seal is broken and the letter is open.' : 'The letter is still sealed.'}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {open ? (
            <button
              type="button"
              onClick={foldAgain}
              className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-3 text-sm font-bold tracking-[0.1em] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
            >
              Fold it back up
            </button>
          ) : (
            <button
              type="button"
              onClick={breakSeal}
              className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
            >
              Break the seal
            </button>
          )}
          <button
            type="button"
            onClick={() => goToScene('finale')}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-6 py-3 text-sm font-bold tracking-[0.12em] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            Next: the finale →
          </button>
          <button
            type="button"
            onClick={() => goToScene('keepsakes')}
            className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
