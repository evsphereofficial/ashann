'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SCENE_ORDER, useScrapbook } from './ScrapbookContext';
import { SCENE_META } from '@/scenes/registry';

const CHEVRON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Ribbon index + prev/next + arrow-key navigation.
 * Scene progression is always explicit — nothing here is scroll-driven.
 */
export function SceneNavigation() {
  const { scene, sceneIndex, goToScene, nextScene, prevScene, overlay, reducedMotion } = useScrapbook();
  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === SCENE_ORDER.length - 1;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (overlay) return; // an open overlay owns the keyboard
      const target = event.target as HTMLElement | null;
      // Widgets with their own arrow handling opt out via data-arrow-scope.
      if (target?.closest('[data-arrow-scope]')) return;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextScene();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevScene();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlay, nextScene, prevScene]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-3 sm:pb-4">
      <div
        className="pointer-events-auto flex max-w-[min(100vw-1rem,64rem)] items-end gap-1.5 rounded-t-[14px] border-x border-t border-[#c9b79c] bg-[#f6ecd8]/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(26,16,7,0.28)] backdrop-blur-sm sm:gap-2 sm:px-3"
        data-arrow-scope="scenes"
      >
        <button
          type="button"
          onClick={prevScene}
          disabled={isFirst}
          className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b9a587] bg-white text-[var(--color-ink)] transition hover:bg-[#fff6e4] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)] [&>svg]:rotate-180"
          aria-label="Previous chapter"
        >
          {CHEVRON}
        </button>

        <ul className="flex items-end gap-1 overflow-x-auto sm:gap-1.5">
          {SCENE_ORDER.map((id, index) => {
            const active = id === scene;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => goToScene(id)}
                  aria-current={active ? 'true' : undefined}
                  title={SCENE_META[index].blurb}
                  className={[
                    'relative block shrink-0 rounded-t-[10px] border border-b-0 px-2.5 pb-1.5 pt-1.5 text-center transition sm:px-3.5',
                    active
                      ? 'z-10 border-[#c2a97f] bg-[#fffaf0] text-[var(--color-ink)] shadow-[0_-6px_14px_rgba(26,16,7,0.2)]'
                      : 'border-[#cbb99b] bg-[#e8d9bd] text-[#6b5b41] hover:bg-[#f2e6cf]',
                  ].join(' ')}
                >
                  <span className="block font-[family-name:var(--font-anton)] text-[10px] tracking-[0.16em] text-[var(--color-valentine)]">
                    {SCENE_META[index].chapter}
                  </span>
                  <span className="block text-[11px] font-semibold tracking-wide sm:text-xs">
                    {SCENE_META[index].label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="scene-tab-marker"
                      className="absolute inset-x-1.5 -bottom-px h-[3px] rounded-full bg-[var(--color-valentine)]"
                      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={nextScene}
          disabled={isLast}
          className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b9a587] bg-white text-[var(--color-ink)] transition hover:bg-[#fff6e4] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          aria-label="Next chapter"
        >
          {CHEVRON}
        </button>
      </div>
    </div>
  );
}
