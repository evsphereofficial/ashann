'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { characters } from '@/content/characters';
import { keepsakes } from '@/content/keepsakes';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { FilledOrPlaceholder, PlaceholderTag } from '@/components/scrapbook/PlaceholderTag';
import { useFocusTrap } from './FocusTrap';

/**
 * Shared reading sheet for keepsake details and character bios.
 * Esc closes, focus is trapped, and the scene underneath keeps its scroll.
 */
export function DetailSheet() {
  const { overlay, closeOverlay, reducedMotion } = useScrapbook();
  const open = overlay !== null && (overlay.type === 'keepsake' || overlay.type === 'character');
  const containerRef = useFocusTrap(open);
  const [selectedFrame, setSelectedFrame] = useState<{ charId: string; index: number } | null>(null);

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

  const keepsake =
    overlay?.type === 'keepsake' ? keepsakes.find((k) => k.id === overlay.id) : undefined;
  const character =
    overlay?.type === 'character' ? characters.find((c) => c.id === overlay.id) : undefined;
  const isCharacter = Boolean(character);
  const title = character?.name ?? keepsake?.title ?? '';
  const kind = isCharacter ? 'Cast member' : 'Keepsake';
  const gallery = character?.gallery ?? [];
  const activeFrame =
    character && selectedFrame?.charId === character.id
      ? selectedFrame.index
      : (character?.heroIndex ?? 0);
  const selectedArt = gallery[activeFrame] ?? gallery[character?.heroIndex ?? 0];

  return (
    <AnimatePresence>
      {open && (character || keepsake) && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
        >
          <button
            type="button"
            aria-label="Close details"
            onClick={closeOverlay}
            className="absolute inset-0 cursor-default bg-[#160d06]/80 backdrop-blur-[3px]"
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-sheet-title"
            initial={{ y: reducedMotion ? 0 : 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reducedMotion ? 0 : 24, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 250, damping: 25 }}
            className="relative z-10 max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto rounded-[8px] border border-[#d8c9a9] bg-[var(--color-cream)] p-5 shadow-[var(--shadow-lifted)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="type-label text-[11px] text-[var(--color-valentine)]">{kind}</p>
                <h2 id="detail-sheet-title" className="type-serif text-2xl">
                  {title}
                </h2>
                {character ? (
                  <p className="type-label mt-1 text-[11px] text-[var(--color-ink-soft)]">
                    {character.part} · rendered as a {character.role}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                data-autofocus
                onClick={closeOverlay}
                className="min-h-[42px] shrink-0 rounded-full border border-[#c2a97f] bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)] sm:min-h-0 sm:px-3"
              >
                Close
              </button>
            </div>

            {character ? (
              <div className="mt-4 space-y-3">
                <div
                  className="relative overflow-hidden rounded-[6px] border-[3px] border-white p-2 shadow-lifted"
                  style={{ background: character.accent }}
                >
                  <div aria-hidden="true" className="material-halftone absolute inset-0 opacity-15 text-white" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedArt?.src ?? character.image}
                    alt={selectedArt ? `${character.name} — ${selectedArt.note}` : character.alt}
                    decoding="async"
                    className="relative z-10 mx-auto h-52 w-full object-contain sm:h-60"
                  />
                </div>
                {gallery.length > 1 ? (
                  <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Character frames">
                    {gallery.map((art, i) => {
                      const active = i === activeFrame;
                      return (
                        <button
                          key={art.src}
                          type="button"
                          onClick={() => character && setSelectedFrame({ charId: character.id, index: i })}
                          aria-pressed={active}
                          aria-label={`View frame ${i + 1}: ${art.note}`}
                          className={[
                            'h-12 w-12 overflow-hidden rounded-[4px] border-2 bg-white p-0.5 transition',
                            active
                              ? 'border-[var(--color-valentine)] scale-105 shadow-sm'
                              : 'border-[#c9b79c] opacity-75 hover:opacity-100',
                          ].join(' ')}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={art.src}
                            alt=""
                            decoding="async"
                            className="h-full w-full object-cover object-top"
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}

            {keepsake ? (
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">{keepsake.hint}</p>
            ) : null}

            {keepsake ? (
              <div className="mt-4 rounded-[6px] border border-dashed border-[#c2a97f] bg-[#fffaf0] p-4">
                <p className="type-label mb-2 text-[11px] text-[var(--color-valentine)]">
                  WHAT IS INSIDE · {keepsake.affordance.toUpperCase()}
                </p>
                <FilledOrPlaceholder as="p" value={keepsake.reveal} className="type-hand text-lg leading-snug" />
              </div>
            ) : null}

            {character ? (
              <blockquote className="mt-4 border-l-4 border-[var(--color-blush)] pl-3">
                {character.quote ? (
                  <p className="type-serif italic">“{character.quote}”</p>
                ) : (
                  <PlaceholderTag value="[PLACEHOLDER: add a quote]" />
                )}
                <footer className="mt-2 text-xs text-[var(--color-ink-soft)]">
                  No canon line is quoted here — only add text you can attribute.
                </footer>
              </blockquote>
            ) : null}

            {character && character.image.endsWith('.svg') ? (
              <p className="mt-4 rounded-[6px] border border-dashed border-[#c2a97f] bg-[#fffaf0] p-3 text-sm text-[var(--color-ink-soft)]">
                <span className="type-label mr-2 text-[11px] text-[var(--color-valentine)]">ARTWORK</span>
                Placeholder cut-out. Drop artwork you hold rights to at{' '}
                <code className="text-[var(--color-ink)]">{character.image}</code> to replace it.
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
