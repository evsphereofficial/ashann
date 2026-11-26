'use client';

import { useEffect } from 'react';
import { ChapterSection } from './ChapterSection';
import { ScrollTrigger } from '@/lib/gsap';
import { SCENE_ORDER, SCENE_META } from '@/scenes/registry';
import { chapterPalettes } from '@/content/palettes';
import CoverScene from '@/scenes/CoverScene';
import OpeningScene from '@/scenes/OpeningScene';
import TimelineScene from '@/scenes/TimelineScene';
import MemoriesScene from '@/scenes/MemoriesScene';
import JoJoScene from '@/scenes/JoJoScene';
import KeepsakesScene from '@/scenes/KeepsakesScene';
import LetterScene from '@/scenes/LetterScene';
import FinaleScene from '@/scenes/FinaleScene';

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

const SCENE_TITLE_ID = {
  cover: 'cover-title',
  opening: 'opening-title',
  timeline: 'timeline-title',
  memories: 'memories-title',
  jojo: 'jojo-title',
  keepsakes: 'keepsakes-title',
  letter: 'letter-title',
  finale: 'finale-title',
} as const;

/**
 * The scrapbook as one continuous document.
 *
 * All eight chapters are imported directly so there is never a mid-scroll
 * "turning the page…" loading fallback.
 */
export function SceneHost() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
            <Scene />
          </ChapterSection>
        );
      })}
      <ChapterFootnote />
    </main>
  );
}

function ChapterFootnote() {
  const meta = SCENE_META[SCENE_META.length - 1];
  return (
    <p className="sr-only">
      End of the scrapbook — {SCENE_ORDER.length} chapters, last one {meta.label}.
    </p>
  );
}
