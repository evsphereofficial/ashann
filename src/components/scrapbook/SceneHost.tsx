'use client';

import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sceneVariants } from '@/lib/motion';
import { useSceneScrollReset, useScrapbook } from './ScrapbookContext';

/**
 * Scenes are split out of the shell so the heavy ones (Three.js finale) only
 * load when they are actually needed.
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

function SceneFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="type-hand text-xl text-[var(--color-ink-soft)]">turning the page…</p>
    </div>
  );
}

export function SceneHost() {
  const { scene } = useScrapbook();
  const ActiveScene = SCENE_COMPONENTS[scene];
  useSceneScrollReset(scene);

  return (
    <main id="main" className="relative z-10" tabIndex={-1}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={scene}
          variants={sceneVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative"
        >
          <Suspense fallback={<SceneFallback />}>
            <ActiveScene />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
