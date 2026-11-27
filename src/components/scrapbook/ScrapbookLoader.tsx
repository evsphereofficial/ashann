'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assets } from '@/content/assets';
import { memories } from '@/content/memories';
import { ScrollTrigger } from '@/lib/gsap';

/** Gather every unique image URL used across all eight chapters. */
function collectAssetUrls(): string[] {
  const urls = new Set<string>();
  for (const bg of assets.backgrounds) urls.add(bg);
  for (const el of assets.elements) urls.add(el);
  for (const list of Object.values(assets.characters)) {
    for (const item of list) urls.add(item.src);
  }
  for (const memory of memories) {
    if (memory.image) urls.add(memory.image);
  }
  return Array.from(urls);
}

/** Pre-warm all lazy scene chunks + Three.js star so scrolling never stalls. */
function preloadSceneChunks(): Promise<unknown[]> {
  return Promise.allSettled([
    import('@/scenes/CoverScene'),
    import('@/scenes/OpeningScene'),
    import('@/scenes/TimelineScene'),
    import('@/scenes/MemoriesScene'),
    import('@/scenes/JoJoScene'),
    import('@/scenes/KeepsakesScene'),
    import('@/scenes/LetterScene'),
    import('@/scenes/FinaleScene'),
    import('@/components/scrapbook/KeepsakeStar'),
  ]);
}

function loadAndDecodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = 'async';
    const done = () => {
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {}).finally(resolve);
      } else {
        resolve();
      }
    };
    img.onload = done;
    img.onerror = () => resolve();
    img.src = src;
    if (img.complete) done();
  });
}

/**
 * Full-pack preloader & page cache warmer.
 *
 * Downloads and decodes every background, element, character frame, and memory
 * print while pre-fetching all eight chapter JS chunks so the entire scroll
 * experience stays silky smooth with zero mid-scroll asset pop-in.
 */
export function ScrapbookLoader({ onReady }: { onReady: () => void }) {
  const urls = useMemo(() => collectAssetUrls(), []);
  const totalCount = urls.length + 1; // +1 for JS chunks bundle

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    let cancelled = false;
    document.body.style.overflow = 'hidden';

    const skipTimer = window.setTimeout(() => {
      if (!cancelled) setShowSkip(true);
    }, 4500);

    // Safety cap so a flaky connection never traps the reader forever
    const safetyTimer = window.setTimeout(() => {
      if (!cancelled) finish();
    }, 14000);

    let completed = 0;
    const tick = () => {
      if (cancelled) return;
      completed += 1;
      setLoadedCount(completed);
      setProgress(Math.min(100, Math.round((completed / totalCount) * 100)));
    };

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      window.clearTimeout(skipTimer);
      window.clearTimeout(safetyTimer);
      setProgress(100);
      document.body.style.overflow = '';
      window.setTimeout(() => {
        setVisible(false);
        onReady();
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 220);
    };

    const run = async () => {
      const chunksPromise = preloadSceneChunks().finally(tick);
      const fontsPromise =
        typeof document !== 'undefined' && 'fonts' in document
          ? document.fonts.ready.catch(() => {})
          : Promise.resolve();

      // Parallel worker pool (concurrency 8) for fast, non-blocking image caching
      const CONCURRENCY = 8;
      let cursor = 0;
      const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
        while (cursor < urls.length && !cancelled) {
          const url = urls[cursor];
          cursor += 1;
          await loadAndDecodeImage(url);
          tick();
        }
      });

      await Promise.all([chunksPromise, fontsPromise, ...workers]);
      finish();
    };

    void run();

    return () => {
      cancelled = true;
      window.clearTimeout(skipTimer);
      window.clearTimeout(safetyTimer);
      document.body.style.overflow = '';
    };
  }, [onReady, totalCount, urls]);

  const handleSkip = () => {
    document.body.style.overflow = '';
    setVisible(false);
    onReady();
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Preparing the scrapbook"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 0.68, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f3e7d5] px-6"
        >
          <div aria-hidden="true" className="material-paper absolute inset-0 opacity-60" />

          <div className="relative w-full max-w-sm rounded-[12px] border border-[#d8c9a9] bg-[#fffaf0] p-7 text-center shadow-[var(--shadow-lifted)]">
            {/* Washi tape strip */}
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 bg-[#f2c9d2]/85 shadow-sm"
            />

            <p className="type-label text-[10px] tracking-[0.22em] text-[var(--color-valentine)]">
              SIX MONTHS, LIFETIME WORTH OF MEMORIES
            </p>
            <h2 className="type-hand mt-2 text-3xl text-[var(--color-ink)]">
              Loading your memories…
            </h2>

            {/* Stitched progress ribbon */}
            <div className="mt-5 h-3 w-full overflow-hidden rounded-full border border-[#c9b79c] bg-[#efe4d6] p-0.5">
              <div
                className="h-full rounded-full bg-[var(--color-valentine)] transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[var(--color-ink-soft)]">
              <span>{progress}%</span>
              <span>
                {loadedCount} / {totalCount || '…'}
              </span>
            </div>

            {showSkip && (
              <button
                type="button"
                onClick={handleSkip}
                className="mt-5 rounded-full border border-[#c9b79c] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-[#fff6e4]"
              >
                Open now
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
