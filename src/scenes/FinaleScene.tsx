'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { assembleContainer, dropIn } from '@/lib/motion';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { anniversary } from '@/content/anniversary';
import { FilledOrPlaceholder, PlaceholderTag } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { HeartSticker, FlowerSticker } from '@/components/scrapbook/Deco';

/** Three.js never reaches the server — the star is client-only and lazy. */
const KeepsakeStar = dynamic(
  () => import('@/components/scrapbook/KeepsakeStar').then((module) => module.KeepsakeStar),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center">
        <p className="type-hand text-lg text-[var(--color-ink-soft)]">polishing the star…</p>
      </div>
    ),
  },
);

/**
 * Scene 8 — the closing spread.
 *
 * The star is the one Three.js moment in the scrapbook: a single object, one
 * burst, then it settles into a slow idle. Replay and the contents page both
 * live here, so the book never ends in a dead end.
 */
export default function FinaleScene() {
  const { goToScene, openOverlay, reducedMotion, sceneIndex } = useScrapbook();

  return (
    <section aria-labelledby="finale-title" className="scene-stage px-4 py-14 sm:px-6">
      <div className="relative mx-auto w-full max-w-5xl">
        <motion.div
          variants={assembleContainer}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]"
        >
          {/* ── the star ───────────────────────────────────────────────── */}
          <motion.div variants={dropIn({ y: 60, rotate: -8 }, -1.5)} className="order-2 lg:order-1">
            <div className="relative mx-auto h-[260px] w-full max-w-[420px] sm:h-[330px]">
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-full opacity-70"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgb(242 201 210 / 0.55), rgb(201 162 39 / 0.18) 45%, transparent 70%)',
                }}
              />
              <KeepsakeStar className="relative h-full w-full" reduced={reducedMotion} />
            </div>
            <p className="type-label mt-2 text-center text-[10px] text-[var(--color-cream)]/85">
              KEEPSAKE STAR · DRAG-FREE, BUTTON-DRIVEN
            </p>
          </motion.div>

          {/* ── the closing spread ─────────────────────────────────────── */}
          <motion.div variants={dropIn({ y: 70, rotate: 6 }, 1)} className="order-1 lg:order-2">
            <PaperLayer material="cream" rotate={0.9} className="relative px-6 py-8 shadow-lifted sm:px-9 sm:py-10">
              <WashiTape variant="stripe" className="absolute -top-3 left-10" rotate={-5} />
              <span aria-hidden="true" className="absolute -right-4 bottom-6">
                <FlowerSticker size={48} />
              </span>
              <span aria-hidden="true" className="absolute right-6 top-6">
                <HeartSticker size={32} />
              </span>

              <p className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 08 · FINALE</p>
              <h2 id="finale-title" className="type-masthead mt-2 text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[0.95]">
                That is the whole book
              </h2>

              <div className="mt-5 border-l-2 border-dashed border-[#c9b79c] pl-4">
                <FilledOrPlaceholder
                  as="p"
                  value={anniversary.finaleMessage}
                  className="type-hand text-[clamp(1.3rem,3.4vw,2rem)] leading-tight text-[var(--color-ink)]"
                />
                <p className="type-serif mt-3 text-base italic text-[var(--color-ink-soft)]">
                  — <FilledOrPlaceholder value={anniversary.senderName} />
                </p>
              </div>

              <div className="mt-5">
                <PlaceholderTag value="[PLACEHOLDER: closing line for the two of you]" />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => goToScene('cover')}
                  className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
                >
                  ↺ Replay the scrapbook
                </button>
                <button
                  type="button"
                  onClick={() => openOverlay({ type: 'index' })}
                  className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-6 py-3 text-sm font-bold tracking-[0.12em] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
                >
                  Open the contents
                </button>
                <button
                  type="button"
                  onClick={() => goToScene('letter')}
                  className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
                >
                  ← Back to the letter
                </button>
              </div>

              <p className="mt-5 text-xs text-[var(--color-ink-soft)]">
                Chapter {sceneIndex + 1} of 8 · no audio ships with this page, and nothing plays
                unless you ask it to.
              </p>
            </PaperLayer>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
