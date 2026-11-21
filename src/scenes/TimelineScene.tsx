'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { timeline } from '@/content/timeline';
import { readable } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';

const RING_RADIUS = 40;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ProgressRing({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90">
      <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#e3d5c4" strokeWidth="7" />
      <motion.circle
        cx="50"
        cy="50"
        r={RING_RADIUS}
        fill="none"
        stroke="var(--color-valentine)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        initial={false}
        animate={{ strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress) }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 20 }}
      />
    </svg>
  );
}

/**
 * Scene 3 — six months, six keepsake tokens threaded on a ribbon.
 *
 * Selection is explicit: a token is a real button, "Show all six" reveals the
 * whole set without touching anything, and the progress ring is decoration on
 * top of state that is always readable as text.
 */
export default function TimelineScene() {
  const { goToScene, reducedMotion } = useScrapbook();
  const [selected, setSelected] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const expanded = showAll ? timeline.map((_, index) => index) : selected === null ? [] : [selected];

  const toggle = (index: number) => {
    setShowAll(false);
    setSelected((current) => (current === index ? null : index));
  };

  return (
    <section aria-labelledby="timeline-title" className="scene-stage px-4 py-14 sm:px-6">
      <div className="relative mx-auto w-full max-w-6xl">
        <header className="relative mb-10 max-w-2xl">
          <WashiTape variant="mint" className="absolute -top-6 left-6" rotate={-5} />
          <p className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 02 · SIX MONTHS</p>
          <h2 id="timeline-title" className="type-masthead mt-2 text-[clamp(2rem,6vw,3.8rem)] leading-[0.95]">
            One token a month
          </h2>
          <p className="mt-3 text-[var(--color-ink-soft)]">
            Pick a token to read what happened. Nothing here moves on its own — you choose.
          </p>
        </header>

        <div className="relative">
          {/* the ribbon the tokens are threaded on */}
          <div
            aria-hidden="true"
            className="absolute left-6 right-6 top-[54px] hidden border-t-[3px] border-dashed border-[#c9b79c] lg:block"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[54px] top-6 hidden border-l-[3px] border-dashed border-[#c9b79c] lg:hidden sm:block"
          />

          <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {timeline.map((entry, index) => {
              const isExpanded = expanded.includes(index);
              const tokenProgress = showAll || index <= (selected ?? -1) ? 1 : 0;
              return (
                <li key={entry.id} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isExpanded}
                    aria-controls={`month-panel-${entry.id}`}
                    className="object-interactive relative grid h-[108px] w-[108px] place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-valentine)]"
                  >
                    <ProgressRing progress={tokenProgress} reducedMotion={reducedMotion} />
                    <span
                      className={[
                        'grid h-[86px] w-[86px] place-items-center rounded-full border-2 transition',
                        isExpanded
                          ? 'border-[var(--color-valentine)] bg-[#fff3e3]'
                          : 'border-[#c9b79c] bg-[var(--color-cream)] hover:bg-white',
                      ].join(' ')}
                    >
                      <span className="text-center leading-none">
                        <span className="type-masthead block text-[26px] text-[var(--color-ink)]">
                          {String(entry.month).padStart(2, '0')}
                        </span>
                        <span className="type-label mt-1 block text-[9px] text-[var(--color-ink-faint)]">
                          MONTH
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 grid h-6 w-6 place-items-center rounded-full border border-[#c9b79c] bg-white text-[11px] text-[var(--color-ink-soft)]"
                    >
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>
                  <p className="type-label mt-3 text-[10px] text-[var(--color-ink-soft)]">
                    {readable(entry.date)}
                  </p>
                  <p className="sr-only">
                    {isExpanded ? 'Expanded' : 'Collapsed'}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── detail panels ──────────────────────────────────────────────── */}
        <div className="mt-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {expanded.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[10px] border border-dashed border-[#c9b79c] bg-[var(--color-cream)]/80 px-5 py-6 text-center text-sm text-[var(--color-ink-soft)]"
              >
                Tap a token above to open its month — or press{' '}
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="font-semibold text-[var(--color-valentine)] underline underline-offset-4"
                >
                  show all six
                </button>
                .
              </motion.p>
            ) : (
              <motion.div
                key="panels"
                layout
                className={[
                  'grid gap-4',
                  expanded.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'max-w-2xl',
                ].join(' ')}
              >
                {expanded.map((index) => {
                  const entry = timeline[index];
                  return (
                    <motion.article
                      key={entry.id}
                      id={`month-panel-${entry.id}`}
                      layout
                      initial={{ opacity: 0, y: 22, rotate: -2 }}
                      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -0.8 : 0.9 }}
                      exit={{ opacity: 0, y: -14, transition: { duration: 0.2 } }}
                      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 24 }}
                      className="relative"
                    >
                      <PaperLayer
                        material={index % 3 === 0 ? 'cream' : index % 3 === 1 ? 'grid' : 'lined'}
                        className="h-full px-5 py-5 shadow-lifted"
                      >
                        <p className="type-label text-[10px] text-[var(--color-valentine)]">
                          MONTH {String(entry.month).padStart(2, '0')}
                        </p>
                        <h3 className="type-serif mt-1 text-xl leading-snug">
                          <FilledOrPlaceholder value={entry.title} />
                        </h3>
                        <p className="type-label mt-1 text-[10px] text-[var(--color-ink-faint)]">
                          {readable(entry.date)}
                        </p>
                        <FilledOrPlaceholder
                          as="p"
                          value={entry.note}
                          className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]"
                        />
                        {!showAll && (
                          <button
                            type="button"
                            onClick={() => setSelected(null)}
                            className="mt-4 rounded-full border border-[#c9b79c] bg-white px-3 py-1.5 text-[11px] font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
                          >
                            Close this month
                          </button>
                        )}
                      </PaperLayer>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            aria-pressed={showAll}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-3 text-sm font-bold tracking-[0.1em] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            {showAll ? 'Collapse the six months' : 'Show all six months'}
          </button>
          <button
            type="button"
            onClick={() => goToScene('memories')}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
          >
            Next: the photographs →
          </button>
          <button
            type="button"
            onClick={() => goToScene('opening')}
            className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
}
