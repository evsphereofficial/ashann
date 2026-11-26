'use client';

import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { memories } from '@/content/memories';
import { readable } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useFocusTrap } from './FocusTrap';

/**
 * Full-screen photo viewer: focus-trapped, Esc closes (scene and scroll are
 * preserved), arrow keys and explicit buttons move between photographs.
 */
export function MemoryLightbox() {
  const { overlay, closeOverlay, openOverlay, reducedMotion } = useScrapbook();
  const open = overlay?.type === 'memory';
  /** Derived from the overlay itself — no state to synchronise on open. */
  const index = open ? Math.max(0, memories.findIndex((m) => m.id === overlay.id)) : 0;
  const containerRef = useFocusTrap(open);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const memory = memories[index];
  const step = useCallback(
    (delta: number) => {
      const next = (index + delta + memories.length) % memories.length;
      openOverlay({ type: 'memory', id: memories[next].id });
    },
    [index, openOverlay],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeOverlay();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, closeOverlay, step]);

  return (
    <AnimatePresence>
      {open && memory && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.24 }}
          data-arrow-scope="lightbox"
        >
          <button
            type="button"
            aria-label="Close photograph"
            onClick={closeOverlay}
            className="absolute inset-0 cursor-default bg-[#160d06]/80 backdrop-blur-[3px]"
          />
          <motion.figure
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Photograph ${index + 1} of ${memories.length}: ${readable(memory.title)}`}
            initial={{ y: reducedMotion ? 0 : 26, rotate: reducedMotion ? 0 : -1.2, opacity: 0 }}
            animate={{ y: 0, rotate: -0.6, opacity: 1 }}
            exit={{ y: reducedMotion ? 0 : 20, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[6px] border border-[#d8c9a9] bg-[var(--color-cream)] shadow-[var(--shadow-lifted)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-dashed border-[#cbb99b] px-4 py-3">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-anton)] text-[11px] tracking-[0.2em] text-[var(--color-valentine)]">
                  PHOTO {String(index + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
                </p>
                <FilledOrPlaceholder
                  as="p"
                  value={memory.date}
                  className="font-[family-name:var(--font-anton)] text-[11px] tracking-[0.14em] text-[var(--color-ink-soft)]"
                />
                <h2 className="type-serif truncate text-xl text-[var(--color-ink)] sm:text-2xl">
                  {readable(memory.title)}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                data-autofocus
                onClick={closeOverlay}
                className="min-h-[42px] shrink-0 rounded-full border border-[#c2a97f] bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)] sm:min-h-0 sm:px-3"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="mx-auto w-full max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memory.image}
                  alt={memory.alt}
                  decoding="async"
                  className="w-full rounded-[3px] border border-[#c9b79c] bg-white"
                />
              </div>
              <dl className="mx-auto mt-4 max-w-xl space-y-3">
                <div>
                  <dt className="type-label text-[11px] text-[var(--color-ink-soft)]">Caption</dt>
                  <dd>
                    <FilledOrPlaceholder
                      as="p"
                      value={memory.caption}
                      className="type-hand text-lg leading-snug text-[var(--color-ink)]"
                    />
                  </dd>
                </div>
                <div>
                  <dt className="type-label text-[11px] text-[var(--color-ink-soft)]">Notes</dt>
                  <dd>
                    <FilledOrPlaceholder
                      as="p"
                      value={memory.note}
                      className="text-sm leading-relaxed text-[var(--color-ink-soft)]"
                    />
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-dashed border-[#cbb99b] px-4 py-3">
              <button
                type="button"
                onClick={() => step(-1)}
                className="rounded-full border border-[#c2a97f] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
              >
                ← Previous
              </button>
              <p className="type-label text-[11px] text-[var(--color-ink-soft)]" aria-live="polite">
                {index + 1} of {memories.length}
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                className="rounded-full border border-[#c2a97f] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
              >
                Next →
              </button>
            </div>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
