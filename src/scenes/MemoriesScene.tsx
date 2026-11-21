'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assembleContainer, dropIn } from '@/lib/motion';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { memories } from '@/content/memories';
import type { Memory } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { Polaroid } from '@/components/scrapbook/Polaroid';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { HalftoneStar } from '@/components/scrapbook/Deco';

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
  editorial: 'sm:col-span-2',
};

/**
 * Scene 4 — the photographs.
 *
 * Each print is a real button (click, tap, Enter all work) that opens a
 * focus-trapped lightbox with its own prev/next. "Read all six captions"
 * gives the same information as a plain list for anyone who would rather not
 * open six dialogs.
 */
export default function MemoriesScene() {
  const { goToScene, openOverlay, reducedMotion } = useScrapbook();
  const [showList, setShowList] = useState(false);

  return (
    <section aria-labelledby="memories-title" className="scene-stage px-4 py-14 sm:px-6">
      <div className="relative mx-auto w-full max-w-6xl">
        <header className="relative mb-10 max-w-2xl">
          <WashiTape variant="blush" className="absolute -top-6 left-8" rotate={4} />
          <p className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 03 · PHOTOGRAPHS</p>
          <h2 id="memories-title" className="type-masthead mt-2 text-[clamp(2rem,6vw,3.8rem)] leading-[0.95]">
            Six prints, six backs
          </h2>
          <p className="mt-3 text-[var(--color-ink-soft)]">
            Open any print to read the caption and the note on the back. Use the arrows inside the
            viewer to move between them, and Escape to come back here.
          </p>
        </header>

        <motion.div
          variants={assembleContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6"
        >
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              variants={dropIn({ y: 74, rotate: memory.rotation - 20 }, memory.rotation)}
              className={[SPAN[memory.layout], 'relative'].join(' ')}
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
              <p className="type-label mt-2 text-center text-[10px] text-[var(--color-cream)]/85">
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
            {showList ? 'Hide the caption list' : 'Read all six captions'}
          </button>
          <button
            type="button"
            onClick={() => goToScene('jojo')}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
          >
            Next: the cast →
          </button>
          <button
            type="button"
            onClick={() => goToScene('timeline')}
            className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            ← Back
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
                  <HalftoneStar size={44} />
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
    </section>
  );
}
