'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { letter } from '@/content/keepsakes';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { LaceTrim } from '@/components/scrapbook/LaceTrim';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element } from '@/lib/art';

/**
 * Chapter 06 — a sealed letter inside a folded parchment envelope.
 *
 * Pressing the wax seal cracks it away and unfolds the full letter sheet.
 * The unfold animation runs in a `useEffect` after `open` flips to `true`,
 * guaranteeing `sheetRef` and all letter lines are mounted in the DOM.
 */
export default function LetterScene() {
  const { reducedMotion } = useScrapbook();
  const [open, setOpen] = useState(false);

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  /* Unfold the letter sheet once React has mounted it. */
  useEffect(() => {
    if (!open || !sheetRef.current) return;
    if (reducedMotion) {
      panelRef.current?.focus();
      return;
    }

    const lines = Array.from(sheetRef.current.querySelectorAll<HTMLElement>('[data-letter-line]'));
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => panelRef.current?.focus() });
      tl.fromTo(
        sheetRef.current,
        { opacity: 0, y: 32, scale: 0.94, rotateX: 18 },
        { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.75, ease: 'power3.out' },
      );
      if (lines.length > 0) {
        tl.from(
          lines,
          { y: 14, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' },
          '-=0.35',
        );
      }
    }, sheetRef);

    return () => ctx.revert();
  }, [open, reducedMotion]);

  const breakSeal = () => {
    if (open) return;
    if (reducedMotion || !sealRef.current) {
      setOpen(true);
      return;
    }

    gsap.timeline({
      onComplete: () => setOpen(true),
    })
      .to(sealRef.current, { scale: 1.16, rotate: -12, duration: 0.14, ease: 'power2.out' })
      .to(sealRef.current, { scale: 0.25, opacity: 0, rotate: 42, y: 20, duration: 0.26, ease: 'power3.in' });
  };

  const foldAgain = () => {
    setOpen(false);
    window.requestAnimationFrame(() => sealRef.current?.focus());
  };

  return (
    <div ref={scopeRef} className="scene-stage relative px-4 pb-24 pt-16 sm:px-6 sm:pb-24">
      {/* ── Ground: stationery, stamps, dried flowers, garland ─────────── */}
      <ArtImg
        src={background(PAPER.scriptOnBlack)}
        decorative
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.09] mix-blend-multiply"
      />
      <ArtImg
        src={element(ART.starGarland)}
        decorative
        data-parallax="0.16"
        className="pointer-events-none absolute left-1/2 top-2 w-60 -translate-x-1/2 opacity-80 sm:w-80"
      />
      <ArtImg
        src={element(ART.pinkLetterPaper)}
        decorative
        data-parallax="0.3"
        className="pointer-events-none absolute -left-14 top-24 hidden w-48 -rotate-[8deg] opacity-85 sm:block sm:w-56"
      />
      <ArtImg
        src={element(ART.driedRoses)}
        decorative
        data-parallax="0.4"
        className="pointer-events-none absolute -right-4 bottom-16 w-24 rotate-[10deg] opacity-90 lift-soft sm:right-6 sm:top-24 sm:bottom-auto sm:w-32"
      />
      <ArtImg
        src={element(ART.redGingham)}
        decorative
        data-parallax="0.22"
        className="pointer-events-none absolute bottom-14 right-8 hidden w-44 rotate-[6deg] opacity-80 sm:block"
      />
      <ArtImg
        src={element(ART.doubleHeart)}
        decorative
        data-parallax="0.34"
        className="pointer-events-none absolute bottom-12 left-6 w-20 -rotate-[6deg] opacity-90 sm:left-10 sm:w-24"
      />

      <div className="relative mx-auto w-full max-w-3xl">
        <header className="relative mb-10 pt-4 text-center">
          <p data-reveal="write" className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 06 · THE LETTER</p>
          <h2 id="letter-title" data-reveal="pop" className="type-masthead mt-2 text-[clamp(2.1rem,6vw,3.6rem)] leading-[0.95]">
            Something sealed
          </h2>
          <p data-reveal="write" data-reveal-delay="0.1" className="mx-auto mt-3 max-w-xl text-[var(--color-ink-soft)]">
            Press the wax seal to open the envelope.
          </p>
        </header>

        <div data-reveal="unfold" className="relative" style={{ perspective: 1400 }}>
          {!open ? (
            /* ── Sealed Envelope State ───────────────────────────────────── */
            <div className="relative mx-auto max-w-xl overflow-visible rounded-[12px] border-2 border-[#cbb48f] bg-[#f4e8d3] shadow-[var(--shadow-lifted)]">
              <div aria-hidden="true" className="material-paper absolute inset-0 rounded-[10px] opacity-65" />
              <LaceTrim className="absolute inset-x-0 bottom-0 opacity-65" />
              <WashiTape variant="blush" className="absolute -top-3 left-6 z-20" rotate={-8} width="96px" />
              <WashiTape variant="mint" className="absolute -bottom-3 right-8 z-20" rotate={5} width="84px" />

              {/* Decorative stamp in top-right */}
              <div
                aria-hidden="true"
                className="absolute right-4 top-4 z-10 flex h-14 w-12 rotate-[4deg] flex-col items-center justify-center border-2 border-dashed border-[#a83a5a]/60 bg-[#fffaf0] p-1 shadow-sm"
              >
                <ArtImg src={element(ART.redLily)} decorative className="h-8 w-8 object-contain" />
                <span className="type-label text-[7px] text-[#8e3e56]">06 MOS</span>
              </div>

              {/* Envelope top triangular flap */}
              <div
                aria-hidden="true"
                className="relative z-10 h-32 w-full sm:h-40"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: 'linear-gradient(180deg, #e9d7ba 0%, #f7eee0 100%)',
                  boxShadow: 'inset 0 -8px 18px rgb(80 50 20 / 0.14)',
                }}
              />

              {/* Envelope body */}
              <div className="relative z-10 px-6 pb-10 pt-8 text-center sm:px-10 sm:pb-12">
                <p className="type-hand text-xl text-[var(--color-ink-soft)] sm:text-2xl">
                  For you — open when ready
                </p>
                <p className="type-label mt-1 text-[10px] text-[var(--color-ink-faint)]">
                  TAP THE WAX SEAL TO UNSEAL
                </p>
              </div>

              {/* Embossed SVG Wax Seal sitting over the flap tip */}
              <button
                ref={sealRef}
                type="button"
                onClick={breakSeal}
                aria-label="Break the wax seal and open the letter"
                className="group absolute left-1/2 top-[116px] z-30 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-ink)] sm:top-[146px]"
              >
                <span className="relative grid h-24 w-24 place-items-center transition-transform duration-200 group-hover:scale-105 group-active:scale-95 sm:h-28 sm:w-28">
                  <svg
                    viewBox="0 0 120 120"
                    aria-hidden="true"
                    className="h-full w-full drop-shadow-[0_12px_16px_rgba(40,10,12,0.45)]"
                  >
                    <defs>
                      <radialGradient id="wax-grad" cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#d9483b" />
                        <stop offset="55%" stopColor="#9c2229" />
                        <stop offset="100%" stopColor="#5e1318" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M60 4 C71 4 79 11 89 14 C99 17 109 26 112 37 C115 47 117 57 114 68 C111 79 107 90 98 99 C89 108 77 112 66 114 C55 116 44 114 33 109 C22 104 13 95 9 84 C5 73 4 61 7 50 C10 39 14 27 23 19 C32 11 47 4 60 4 Z"
                      fill="url(#wax-grad)"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="39"
                      fill="none"
                      stroke="#e89a95"
                      strokeOpacity="0.4"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="34"
                      fill="none"
                      stroke="#3e0b0f"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M60 77 C60 77 41 64 41 51 C41 44 46 39 52 39 C56 39 59 42 60 45 C61 42 64 39 68 39 C74 39 79 44 79 51 C79 64 60 77 60 77 Z"
                      fill="#7a181e"
                      stroke="#f2b8b5"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="sr-only">Break wax seal</span>
                </span>
              </button>
            </div>
          ) : (
            /* ── Unfolded Letter State ───────────────────────────────────── */
            <div ref={sheetRef} className="relative" style={{ transformOrigin: 'top center' }}>
              <PaperLayer material="cream" rotate={-0.6} className="relative px-6 py-8 shadow-lifted sm:px-12 sm:py-12">
                <WashiTape variant="blush" className="absolute -top-3 left-1/2 -translate-x-1/2" rotate={-3} width="130px" />
                <span aria-hidden="true" className="absolute right-5 top-5">
                  <ArtImg
                    src={element(ART.doubleHeart)}
                    decorative
                    className="w-9 drop-shadow-[0_4px_6px_rgb(0_0_0/0.25)]"
                  />
                </span>

                <div ref={panelRef} tabIndex={-1} className="focus:outline-none">
                  <p data-letter-line className="type-hand text-[clamp(1.4rem,3.5vw,2rem)] leading-tight text-[var(--color-ink)]">
                    <FilledOrPlaceholder value={letter.greeting} />
                  </p>

                  <div className="mt-5 space-y-4 border-l-2 border-dashed border-[#c9b79c] pl-4 sm:pl-6">
                    {letter.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        data-letter-line
                        className="type-serif text-[clamp(1rem,2.2vw,1.2rem)] leading-relaxed text-[var(--color-ink-soft)]"
                      >
                        <FilledOrPlaceholder value={paragraph} />
                      </p>
                    ))}
                  </div>

                  <p
                    data-letter-line
                    className="type-hand mt-8 text-right text-[clamp(1.3rem,3vw,1.9rem)] text-[var(--color-ink)]"
                  >
                    <FilledOrPlaceholder value={letter.signature} />
                  </p>
                </div>
              </PaperLayer>
            </div>
          )}
        </div>

        {open && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={foldAgain}
              className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-2.5 text-xs font-bold tracking-[0.12em] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
            >
              Fold it back up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
