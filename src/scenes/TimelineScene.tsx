'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { timeline } from '@/content/timeline';
import { readable } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element } from '@/lib/art';

const MONTH_ACCENTS = [
  ART.redButton,
  ART.bowDoodle,
  ART.redStar,
  ART.pocketWatch,
  ART.crownDoodle,
  ART.doubleHeart,
] as const;

const TAPE_VARIANTS = ['blush', 'mint', 'butter', 'stripe', 'grid', 'plain'] as const;

/**
 * Chapter 02 — six months, threaded along a stitched scrapbook ribbon.
 *
 * No "show all six" box, no rigid grid: each month is its own taped scrap of
 * paper that unfolds its memory when tapped, with scroll-triggered stagger as
 * you read down the ribbon.
 */
export default function TimelineScene() {
  const { reducedMotion } = useScrapbook();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const [openMonths, setOpenMonths] = useState<number[]>([0]);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  /* Scroll-triggered alternating slide-in for each month card. */
  useEffect(() => {
    const node = scopeRef.current;
    if (!node || reducedMotion) return;

    const cards = Array.from(node.querySelectorAll<HTMLElement>('[data-month-card]'));
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 28,
          x: i % 2 === 0 ? -18 : 18,
          opacity: 0.4,
          rotate: i % 2 === 0 ? -3 : 3,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true,
          },
        });
      });
    }, node);

    return () => ctx.revert();
  }, [reducedMotion]);

  const toggle = (index: number) => {
    setOpenMonths((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    );
  };

  return (
    <div ref={scopeRef} className="scene-stage relative px-4 pb-24 pt-16 sm:px-6 sm:pb-24">
      {/* ── Ground: newsprint strip, gingham & florals in outer margins ──── */}
      <ArtImg
        src={background(PAPER.oldNewspaper)}
        decorative
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14] mix-blend-multiply"
      />
      <ArtImg
        src={element(ART.tornLinedNote)}
        decorative
        data-parallax="0.18"
        className="pointer-events-none absolute -left-8 top-16 w-36 -rotate-[10deg] opacity-80 sm:w-44"
      />
      <ArtImg
        src={element(ART.tornNewsEdge)}
        decorative
        data-parallax="0.14"
        className="pointer-events-none absolute bottom-0 right-0 w-56 opacity-75 sm:w-80"
      />
      <ArtImg
        src={element(ART.redGingham)}
        decorative
        data-parallax="0.28"
        className="pointer-events-none absolute -right-14 top-12 w-44 rotate-[12deg] opacity-75 sm:w-56"
      />
      <ArtImg
        src={element(ART.ribbonDoodle)}
        decorative
        data-parallax="0.32"
        className="pointer-events-none absolute -left-8 top-44 hidden w-36 -rotate-[14deg] opacity-85 sm:block"
      />
      <ArtImg
        src={element(ART.driedRoses)}
        decorative
        data-parallax="0.25"
        className="pointer-events-none absolute right-4 bottom-24 hidden w-32 rotate-[8deg] opacity-90 lift-soft md:block"
      />
      <ArtImg
        src={element(ART.books)}
        decorative
        data-parallax="0.2"
        className="pointer-events-none absolute -left-6 bottom-14 w-28 -rotate-[8deg] opacity-85 lift-soft sm:w-36"
      />
      <ArtImg
        src={element(ART.starCluster)}
        decorative
        data-parallax="0.2"
        className="pointer-events-none absolute bottom-10 right-6 w-24 opacity-85 sm:w-32"
      />

      <div className="relative mx-auto w-full max-w-4xl">
        <header className="relative mb-12 max-w-xl">
          <WashiTape variant="mint" className="mb-3" rotate={-3} width="96px" />
          <p data-reveal="write" className="type-label text-[11px] text-[var(--pal-accent,var(--color-valentine))]">
            CHAPTER 02 · SIX MONTHS
          </p>
          <h2 id="timeline-title" data-reveal="left" className="type-masthead mt-2 text-[clamp(2.1rem,6vw,3.8rem)] leading-[0.94]">
            Six months together
          </h2>
          <p data-reveal="write" data-reveal-delay="0.1" className="mt-3 text-[var(--color-ink-soft)]">
            Each month pinned along the ribbon — tap any token to unfold what we kept from it.
          </p>
        </header>

        {/* ── Stitched ribbon timeline ────────────────────────────────────── */}
        <div className="relative">
          {/* Vertical stitched ribbon spine */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-[3px] border-l-[3px] border-dashed border-[#c9969e] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="relative space-y-8 sm:space-y-10">
            {timeline.map((entry, index) => {
              const isOpen = openMonths.includes(index);
              const even = index % 2 === 0;
              return (
                <li
                  key={entry.id}
                  data-month-card
                  className={[
                    'relative pl-14 md:w-[calc(50%-1.5rem)] md:pl-0',
                    even ? 'md:mr-auto md:pr-2' : 'md:ml-auto md:pl-2',
                  ].join(' ')}
                >
                  {/* Month token badge pinned on the ribbon */}
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`month-panel-${entry.id}`}
                    className={[
                      'object-interactive absolute left-0 top-3 z-20 grid h-12 w-12 place-items-center rounded-full border-2 shadow-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]',
                      even ? 'md:left-auto md:-right-12' : 'md:-left-12',
                      isOpen
                        ? 'border-[var(--color-ink)] bg-[var(--color-valentine)] text-[var(--color-cream)]'
                        : 'border-[#c9b79c] bg-[#fffaf0] text-[var(--color-ink)]',
                    ].join(' ')}
                  >
                    <span className="font-[family-name:var(--font-anton)] text-base leading-none">
                      {String(entry.month).padStart(2, '0')}
                    </span>
                  </button>

                  {/* Scrapbook paper note for the month */}
                  <PaperLayer
                    material={index % 2 === 0 ? 'cream' : 'lined'}
                    rotate={even ? -1.1 : 1.1}
                    className="relative p-5 shadow-lifted transition-shadow hover:shadow-xl sm:p-6"
                  >
                    <WashiTape
                      variant={TAPE_VARIANTS[index % TAPE_VARIANTS.length]}
                      className="absolute -top-3 left-6"
                      rotate={even ? -5 : 4}
                      width="88px"
                    />
                    <ArtImg
                      src={element(MONTH_ACCENTS[index % MONTH_ACCENTS.length])}
                      decorative
                      className="pointer-events-none absolute -right-3 -top-4 w-11 opacity-95 drop-shadow-sm"
                    />

                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      aria-controls={`month-panel-${entry.id}`}
                      className="flex w-full items-start justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
                    >
                      <div>
                        <p className="type-label text-[10px] text-[var(--pal-accent,var(--color-valentine))]">
                          MONTH {String(entry.month).padStart(2, '0')} · {readable(entry.date)}
                        </p>
                        <h3 className="type-serif mt-1 text-xl leading-snug text-[var(--color-ink)] sm:text-2xl">
                          <FilledOrPlaceholder value={entry.title} />
                        </h3>
                      </div>
                      <span
                        aria-hidden="true"
                        className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#c9b79c] bg-white text-sm font-bold text-[var(--color-ink-soft)]"
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`month-panel-${entry.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { duration: 0.32, ease: [0.22, 0.68, 0.24, 1] }
                          }
                          className="overflow-hidden"
                        >
                          <div className="mt-4 border-t border-dashed border-[#c9b79c] pt-3">
                            <FilledOrPlaceholder
                              as="p"
                              value={entry.note}
                              className="type-hand text-xl leading-snug text-[var(--color-ink-soft)]"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </PaperLayer>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
