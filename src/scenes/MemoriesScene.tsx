'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assembleContainer, dropIn } from '@/lib/motion';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { memories } from '@/content/memories';
import type { Memory } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { Polaroid } from '@/components/scrapbook/Polaroid';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element } from '@/lib/art';

const ASPECT: Record<Memory['layout'], string> = {
  polaroid: '4 / 5',
  filmstrip: '3 / 4',
  postcard: '3 / 2',
  editorial: '16 / 10',
};

const SPAN: Record<Memory['layout'], string> = {
  polaroid: '',
  filmstrip: '',
  postcard: 'sm:col-span-1',
  editorial: 'col-span-2',
};

/**
 * Vertical stagger that breaks the grid on tablet/desktop: every print sits at
 * a different height so the row reads as a pile of photographs rather than a
 * table. Disabled on `< sm` so 2-column mobile spreads stay tidy.
 */
const COLLAGE_OFFSET_CLASS = [
  '',
  'sm:mt-8',
  'sm:-mt-2.5',
  'sm:mt-6',
  'sm:mt-12',
  'sm:mt-1.5',
] as const;

/**
 * Scene 4 — the photographs.
 *
 * Each print is a real button (click, tap, Enter all work) that opens a
 * focus-trapped lightbox with its own prev/next. "Read all six captions"
 * gives the same information as a plain list for anyone who would rather not
 * open six dialogs.
 */
export default function MemoriesScene() {
  const { openOverlay, reducedMotion } = useScrapbook();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const [showList, setShowList] = useState(false);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  return (
    <div ref={scopeRef} className="scene-stage relative px-4 pb-28 pt-16 sm:px-6 sm:pb-24">
      {/* ── Ground: notebook stock, torn corners, stamps and scatter ─────── */}
      <ArtImg
        src={background(PAPER.starredNotebook)}
        decorative
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-multiply"
      />
      <ArtImg
        src={background(PAPER.grungeRed)}
        decorative
        className="pointer-events-none absolute -right-12 bottom-20 w-56 rotate-[12deg] opacity-40 mix-blend-multiply sm:w-72"
      />
      <ArtImg
        src={element(ART.tornNewsCaption)}
        decorative
        data-parallax="0.22"
        className="pointer-events-none absolute right-2 bottom-10 w-40 -rotate-[6deg] opacity-85 sm:right-10 sm:w-52"
      />
      <ArtImg
        src={element(ART.tornLinedCorner)}
        decorative
        data-parallax="0.3"
        className="pointer-events-none absolute -left-10 top-12 w-48 -rotate-[8deg] opacity-90"
      />
      <ArtImg
        src={element(ART.redLily)}
        decorative
        data-parallax="0.38"
        className="pointer-events-none absolute right-6 top-10 w-24 rotate-[12deg] opacity-90 lift-soft"
      />
      <ArtImg
        src={element(ART.sparkles)}
        decorative
        data-parallax="0.18"
        className="pointer-events-none absolute bottom-20 left-8 w-28 opacity-90"
      />
      <ArtImg
        src={element(ART.driedRoses)}
        decorative
        data-parallax="0.44"
        className="pointer-events-none absolute bottom-6 right-4 w-24 opacity-90 lift-soft sm:right-12 sm:w-36"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="relative mb-6 max-w-2xl">
          <WashiTape variant="blush" className="absolute -top-6 left-8" rotate={4} />
          <p data-reveal="write" className="type-label text-[11px] text-[var(--pal-accent,var(--color-valentine))]">CHAPTER 03 · PHOTOGRAPHS</p>
          <h2 id="memories-title" data-reveal="left" className="type-masthead mt-2 text-[clamp(2rem,6vw,3.8rem)] leading-[0.95]">
            Six prints, six backs
          </h2>
          <p data-reveal="write" data-reveal-delay="0.1" className="mt-3 text-[var(--color-ink-soft)]">
            Open any print to read the caption and the note on the back.
          </p>
        </header>

        <motion.div
          variants={assembleContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
        >
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              variants={dropIn({ y: 74, rotate: memory.rotation - 20 }, memory.rotation)}
              className={[SPAN[memory.layout], COLLAGE_OFFSET_CLASS[index % COLLAGE_OFFSET_CLASS.length], 'relative'].join(' ')}
            >
              <WashiTape
                variant={memory.layout === 'filmstrip' ? 'stripe' : 'grid'}
                className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
                rotate={memory.rotation > 0 ? -6 : 5}
                width="76px"
              />
              <Polaroid
                src={memory.image}
                alt={memory.alt}
                caption={memory.caption}
                rotate={memory.rotation}
                aspect={ASPECT[memory.layout]}
                imageClassName={memory.layout === 'filmstrip' ? 'object-center' : undefined}
                onClick={() => openOverlay({ type: 'memory', id: memory.id })}
              />
              <p className="type-label mt-2 text-center text-[10px] text-[var(--color-ink-faint)]">
                {memory.layout.toUpperCase()}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowList((current) => !current)}
            aria-expanded={showList}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-3 text-sm font-bold tracking-[0.1em] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            {showList ? 'Hide captions' : 'Read all six captions'}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showList && (
            <motion.div
              key="caption-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 0.68, 0.24, 1] }}
              className="overflow-hidden"
            >
              <div className="relative mt-8 rounded-[10px] border border-dashed border-[#c9b79c] bg-[var(--color-cream)]/90 p-5">
                <span aria-hidden="true" className="absolute -right-3 -top-4">
                  <ArtImg
                    src={element(ART.redStar)}
                    decorative
                    className="w-11 drop-shadow-[0_4px_6px_rgb(0_0_0/0.25)]"
                  />
                </span>
                <h3 className="type-label text-[11px] text-[var(--color-valentine)]">
                  ALL SIX CAPTIONS · TEXT ALTERNATIVE
                </h3>
                <ol className="mt-4 grid gap-4 sm:grid-cols-2">
                  {memories.map((memory, index) => (
                    <li key={memory.id} className="border-l-2 border-[#c9b79c] pl-3">
                      <p className="type-label text-[10px] text-[var(--color-ink-faint)]">
                        PRINT {String(index + 1).padStart(2, '0')} · {memory.layout.toUpperCase()}
                      </p>
                      <p className="type-serif text-base">{memory.title}</p>
                      <FilledOrPlaceholder as="p" value={memory.caption} className="type-hand text-lg" />
                      <FilledOrPlaceholder
                        as="p"
                        value={memory.note}
                        className="mt-1 text-sm text-[var(--color-ink-soft)]"
                      />
                      <button
                        type="button"
                        onClick={() => openOverlay({ type: 'memory', id: memory.id })}
                        className="mt-2 rounded-full border border-[#c9b79c] bg-white px-3 py-1 text-[11px] font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
                      >
                        Open this print →
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
