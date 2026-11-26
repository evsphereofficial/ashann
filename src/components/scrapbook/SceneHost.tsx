'use client';

import { Suspense, lazy, useEffect } from 'react';
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
 * The scrapbook as one continuous document.
 *
 * Eight chapters stacked in reading order inside a single `<main>`. All chunks
 * and assets are pre-warmed by `ScrapbookLoader`, so every chapter mounts
 * cleanly without mid-scroll layout shifts.
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
              <Scene />
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
