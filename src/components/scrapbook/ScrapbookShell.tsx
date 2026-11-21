'use client';

import { MotionConfig } from 'framer-motion';
import { ScrapbookProvider, useScrapbook } from './ScrapbookContext';
import { SceneHost } from './SceneHost';
import { SceneNavigation } from './SceneNavigation';
import { OverlayHost } from '@/components/overlay/OverlayHost';

function Backdrop() {
  const { reducedMotion } = useScrapbook();
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      {/* desk */}
      <div className="absolute inset-0 bg-[#8a6238]" />
      <div className="absolute inset-0 material-kraft opacity-95" />
      {/* corkboard */}
      <div className="absolute inset-x-0 top-0 h-[68%] material-cork border-b-[10px] border-[#6d4a26]" />
      {/* lace edge under the board */}
      <div className="absolute inset-x-0 top-[68%] h-10 bg-white/85 [mask-image:radial-gradient(circle_at_6px_0,#000_5px,transparent_6px)] [mask-size:12px_100%] [mask-repeat:repeat-x]" />
      {/* vintage wallpaper strip */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] material-lace opacity-70" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_20%,transparent_35%,rgba(24,14,6,0.55)_100%)]" />
      {!reducedMotion && (
        <div className="absolute inset-0 animate-[idle-sway_14s_ease-in-out_infinite] bg-[radial-gradient(60%_40%_at_20%_10%,rgba(255,240,210,0.18),transparent_60%)]" />
      )}
    </div>
  );
}

function Shell() {
  return (
    <div className="relative min-h-dvh text-[var(--color-ink)]">
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
