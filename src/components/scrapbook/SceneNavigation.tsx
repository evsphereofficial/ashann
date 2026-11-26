'use client';

import { useEffect, useState } from 'react';
import { SCENE_ORDER, useScrapbook } from './ScrapbookContext';
import { SCENE_META } from '@/scenes/registry';

export function SceneNavigation() {
  const { scene, sceneIndex, goToScene, nextScene, prevScene, overlay, openOverlay, progress } =
    useScrapbook();
  const [railVisible, setRailVisible] = useState(false);

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

  /* The rail only appears once the reader has actually started scrolling. */
  useEffect(() => {
    const onScroll = () => setRailVisible(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeMeta = SCENE_META[sceneIndex];

  return (
    <>
      {/* ── Progress rail ─────────────────────────────────────────────────── */}
      <div
        data-arrow-scope="scenes"
        className={[
          'pointer-events-none fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 lg:block',
          railVisible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <nav aria-label="Chapter progress" className="pointer-events-auto relative pl-3">
          {/* Track + fill: reads as a bookmark ribbon down the page. */}
          <div
            aria-hidden="true"
            className="absolute left-[5px] top-1 h-[calc(100%-0.5rem)] w-[2px] overflow-hidden rounded-full bg-[#c9b799]/60"
          >
            <div
              className="w-full bg-[var(--color-valentine)] transition-[height] duration-150 ease-out"
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <ol className="flex flex-col items-start gap-2.5">
            {SCENE_ORDER.map((id, index) => {
              const active = id === scene;
              const meta = SCENE_META[index];
              return (
                <li key={id} className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => goToScene(id)}
                    aria-current={active ? 'true' : undefined}
                    aria-label={`Chapter ${meta.chapter}: ${meta.label}`}
                    title={meta.blurb}
                    className="group relative grid h-6 w-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
                  >
                    {/* Length carries state, not colour alone. */}
                    <span
                      aria-hidden="true"
                      className={[
                        'block h-[3px] rounded-full transition-all duration-300',
                        active
                          ? 'w-6 bg-[var(--color-valentine)]'
                          : 'w-3 bg-[#8a7a5f] group-hover:w-5 group-hover:bg-[#5f5138]',
                      ].join(' ')}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-7 whitespace-nowrap rounded-[6px] border border-[#c9b79c] bg-[#fffaf0] px-2 py-1 text-[10px] font-semibold tracking-[0.1em] text-[var(--color-ink)] uppercase opacity-0 shadow-[var(--shadow-paper)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      {meta.chapter} · {meta.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* ── Compact bottom bar: current chapter pill (opens contents) ───────── */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4">
        <div
          data-arrow-scope="scenes"
          className="pointer-events-auto flex max-w-[calc(100vw-1rem)] items-center rounded-full border border-[#c9b79c] bg-[#f6ecd8]/95 p-1.5 shadow-[0_-8px_24px_rgba(26,16,7,0.28)] backdrop-blur-sm"
        >
          {/* Contents: names the current chapter, opens the full index. */}
          <button
            type="button"
            onClick={() => openOverlay({ type: 'index' })}
            aria-haspopup="dialog"
            className="flex min-h-[40px] min-w-0 items-center gap-2 rounded-full border border-[#c2a97f] bg-[#fffaf0] px-4 py-1.5 text-left transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            <span className="font-[family-name:var(--font-anton)] text-[11px] tracking-[0.14em] text-[var(--color-valentine)]">
              {activeMeta.chapter}
            </span>
            <span className="truncate text-xs font-semibold tracking-wide text-[var(--color-ink)]">
              {activeMeta.label}
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-[10px] font-bold tracking-[0.14em] text-[#8a7a5f] uppercase"
            >
              ▸ contents
            </span>
          </button>
        </div>
      </div>

      {/* Thin reading-progress line along the very top of the viewport. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px]">
        <div
          className="h-full origin-left bg-[var(--color-valentine)] transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Reading position, mirrored for screen readers. */}
      <p aria-live="polite" className="sr-only">
        Now reading chapter {activeMeta.chapter}, {activeMeta.label}.
      </p>
    </>
  );
}
