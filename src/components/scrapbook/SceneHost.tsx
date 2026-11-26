'use client';

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChapterSection } from './ChapterSection';
import { ScrollTrigger } from '@/lib/gsap';
import { SCENE_ORDER, SCENE_META, type SceneId } from '@/scenes/registry';
import { chapterPalettes } from '@/content/palettes';

/**
 * Chapters land in the document lazily, which changes its height after the
 * first measurement. Every scroll trigger therefore needs re-measuring once a
 * chunk arrives — one refresh per mount, rAF-delayed so the browser has
 * painted the new content first.
 */
function useRefreshScrollTriggers() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, []);
}

/**
 * Scenes are split out of the shell so the heavy ones (Three.js finale) only
 * load when they are actually needed.
 *
 * `lazy` alone would load all eight the moment the document mounts, because
 * all eight are rendered at once. `NearViewport` defers each chapter's chunk
 * until the reader is within a screen and a half of it, so the first paint
 * only pays for the cover.
 */
const CoverScene = lazy(() => import('@/scenes/CoverScene'));
const OpeningScene = lazy(() => import('@/scenes/OpeningScene'));
const TimelineScene = lazy(() => import('@/scenes/TimelineScene'));
const MemoriesScene = lazy(() => import('@/scenes/MemoriesScene'));
const JoJoScene = lazy(() => import('@/scenes/JoJoScene'));
const KeepsakesScene = lazy(() => import('@/scenes/KeepsakesScene'));
const LetterScene = lazy(() => import('@/scenes/LetterScene'));
const FinaleScene = lazy(() => import('@/scenes/FinaleScene'));

const SCENE_COMPONENTS = {
  cover: CoverScene,
  opening: OpeningScene,
  timeline: TimelineScene,
  memories: MemoriesScene,
  jojo: JoJoScene,
  keepsakes: KeepsakesScene,
  letter: LetterScene,
  finale: FinaleScene,
} as const;

/** Heading id each chapter labels — single source of truth for anchors. */
const SCENE_TITLE_ID: Record<SceneId, string> = {
  cover: 'cover-title',
  opening: 'opening-title',
  timeline: 'timeline-title',
  memories: 'memories-title',
  jojo: 'jojo-title',
  keepsakes: 'keepsakes-title',
  letter: 'letter-title',
  finale: 'finale-title',
};

function ChapterFallback() {
  return (
    <div className="grid min-h-[60svh] place-items-center px-6">
      <p className="type-hand text-xl text-[var(--pal-ink,#4a4750)] opacity-70">turning the page…</p>
    </div>
  );
}

/**
 * Mount `children` once the placeholder comes within `rootMargin` of the
 * viewport. The placeholder reserves real height (via `minHeight`), so
 * mounting late never shifts what the reader is already looking at.
 */
function NearViewport({ children, minHeight }: { children: ReactNode; minHeight: number }) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const node = holderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setMounted(true);
      },
      // One and a half screens of lead time: the chunk is fetched long
      // before the reader arrives, and nothing jumps when it lands.
      { rootMargin: '150% 0px 150% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted]);

  /* The chapter just changed the document's height — re-measure the triggers. */
  useEffect(() => {
    if (!mounted) return;
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [mounted]);

  if (mounted) return <>{children}</>;

  return (
    <div
      ref={holderRef}
      aria-hidden="true"
      style={{ minHeight }}
      className="grid place-items-center"
    >
      <span className="type-hand text-lg text-[var(--pal-ink,#4a4750)] opacity-40">…</span>
    </div>
  );
}

/**
 * The scrapbook as one continuous document.
 *
 * Eight chapters stacked in reading order inside a single `<main>`; the
 * reader scrolls through them and the shell's scroll spy reports which one
 * owns the viewport. There is no scene swap, no exit animation and no
 * scroll reset — scrolling is the only transition.
 */
export function SceneHost() {
  useRefreshScrollTriggers();

  return (
    <main id="main" className="relative z-10" tabIndex={-1}>
      {SCENE_ORDER.map((id, index) => {
        const Scene = SCENE_COMPONENTS[id];
        return (
          <ChapterSection
            key={id}
            id={id}
            titleId={SCENE_TITLE_ID[id]}
            palette={chapterPalettes[id]}
            torn={index > 0}
          >
            <Suspense fallback={<ChapterFallback />}>
              <NearViewport minHeight={index === 0 ? 0 : 720}>
                <Scene />
              </NearViewport>
            </Suspense>
          </ChapterSection>
        );
      })}
      <ChapterFootnote />
    </main>
  );
}

/** Quiet end-mark: proves the document terminated without another panel. */
function ChapterFootnote() {
  const meta = SCENE_META[SCENE_META.length - 1];
  return (
    <p className="sr-only">
      End of the scrapbook — {SCENE_ORDER.length} chapters, last one {meta.label}.
    </p>
  );
}
