'use client';

import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ScrapbookProvider, useScrapbook } from './ScrapbookContext';
import { SceneHost } from './SceneHost';
import { SceneNavigation } from './SceneNavigation';
import { ScrapbookLoader } from './ScrapbookLoader';
import { OverlayHost } from '@/components/overlay/OverlayHost';
import { chapterPalettes } from '@/content/palettes';

/**
 * The page behind the pages.
 *
 * A single fixed wash that carries the *current chapter's* palette, so the
 * colour the reader is scrolling through is also the colour in the margins,
 * behind the torn edges and in any overscroll. It cross-fades rather than
 * switching, which is what makes the hand-overs read as one continuous
 * object instead of eight stacked panels.
 *
 * Everything on top of it is real material: paper grain, a soft vignette and
 * a slow warm light — no repeated dot pattern, no grey patterned footer.
 */
function Backdrop() {
  const { scene, reducedMotion } = useScrapbook();
  const palette = chapterPalettes[scene];

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden transform-gpu">
      {/* Chapter wash — cross-fades as the scroll spy changes. */}
      <div
        className="absolute inset-0 transition-[background-color] duration-[900ms] ease-in-out"
        style={{ backgroundColor: palette.bg }}
      />
      <div
        className="absolute inset-0 transition-[background-color] duration-[900ms] ease-in-out"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, transparent 30%, ${palette.bgDeep}66 100%)`,
        }}
      />

      {/* Paper grain over everything, so margins read as stock not flat colour. */}
      <div className="material-paper absolute inset-0 opacity-25 sm:opacity-35" />

      {/* Warm desk light, drifting just enough to feel alive. */}
      {!reducedMotion && (
        <div className="absolute inset-0 animate-[idle-sway_18s_ease-in-out_infinite] bg-[radial-gradient(60%_45%_at_18%_8%,rgb(255_244_220/0.35),transparent_60%)]" />
      )}

      {/* Vignette keeps the eye centred on the collage. */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_35%,transparent_38%,rgb(28_18_10/0.34)_100%)]" />
    </div>
  );
}

function Shell() {
  const [, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div className="relative min-h-dvh text-[var(--color-ink)]">
      <ScrapbookLoader onReady={handleReady} />
      <a href="#main" className="skip-link">
        Skip to the scrapbook
      </a>
      <Backdrop />
      <SceneHost />
      <SceneNavigation />
      <OverlayHost />
    </div>
  );
}

export function ScrapbookShell() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrapbookProvider>
        <Shell />
      </ScrapbookProvider>
    </MotionConfig>
  );
}
