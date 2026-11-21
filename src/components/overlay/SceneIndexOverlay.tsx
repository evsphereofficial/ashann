'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { SCENE_META, SCENE_ORDER } from '@/scenes/registry';
import { useFocusTrap } from './FocusTrap';

/** The contents page: jump to any chapter from anywhere. */
export function SceneIndexOverlay() {
  const { overlay, closeOverlay, goToScene, scene, reducedMotion } = useScrapbook();
  const open = overlay?.type === 'index';
  const containerRef = useFocusTrap(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeOverlay();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, closeOverlay]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <button
            type="button"
            aria-label="Close index"
            onClick={closeOverlay}
            className="absolute inset-0 cursor-default bg-[#160d06]/80 backdrop-blur-[3px]"
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="scene-index-title"
            initial={{ y: reducedMotion ? 0 : 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reducedMotion ? 0 : 18, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
            className="relative z-10 max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-[8px] border border-[#d8c9a9] bg-[var(--color-cream)] p-5 shadow-[var(--shadow-lifted)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="type-label text-[11px] text-[var(--color-valentine)]">CONTENTS</p>
                <h2 id="scene-index-title" className="type-serif text-2xl">
                  The whole scrapbook
                </h2>
              </div>
              <button
                type="button"
                data-autofocus
                onClick={closeOverlay}
                className="shrink-0 rounded-full border border-[#c2a97f] bg-white px-3 py-1.5 text-sm font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
              >
                Close
              </button>
            </div>

            <ol className="mt-4 space-y-2">
              {SCENE_META.map((meta) => {
                const active = meta.id === scene;
                return (
                  <li key={meta.id}>
                    <button
                      type="button"
                      onClick={() => goToScene(meta.id)}
                      aria-current={active ? 'true' : undefined}
                      className={[
                        'flex w-full items-baseline gap-3 rounded-[8px] border px-3 py-2.5 text-left transition',
                        active
                          ? 'border-[var(--color-valentine)] bg-[#fff3e3]'
                          : 'border-dashed border-[#c9b79c] bg-white/70 hover:bg-white',
                      ].join(' ')}
                    >
                      <span className="font-[family-name:var(--font-anton)] text-sm text-[var(--color-valentine)]">
                        {meta.chapter}
                      </span>
                      <span className="min-w-0">
                        <span className="type-serif block text-base">{meta.label}</span>
                        <span className="block text-xs text-[var(--color-ink-soft)]">{meta.blurb}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <p className="mt-4 text-xs text-[var(--color-ink-soft)]">
              {SCENE_ORDER.length} chapters · use ← → to step through them, Esc to close this page.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
