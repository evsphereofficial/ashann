'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SCENE_ORDER, type SceneId } from '@/scenes/registry';

export { SCENE_ORDER, type SceneId };

/** DOM id of a chapter's `<section>` in the continuous scroll document. */
export const sectionId = (scene: SceneId): string => `chapter-${scene}`;

export type OverlayRequest =
  | { type: 'memory'; id: string }
  | { type: 'keepsake'; id: string }
  | { type: 'character'; id: string }
  | { type: 'index' }
  | null;

type ScrapbookValue = {
  /** Chapter whose section currently owns the viewport. Derived from scroll. */
  scene: SceneId;
  sceneIndex: number;
  /** Smooth-scroll to a chapter. Works from any control, anywhere on the page. */
  goToScene: (scene: SceneId) => void;
  nextScene: () => void;
  prevScene: () => void;
  overlay: OverlayRequest;
  openOverlay: (request: Exclude<OverlayRequest, null>) => void;
  closeOverlay: () => void;
  reducedMotion: boolean;
  /** 0→1 progress through the whole document, for the scroll rail. */
  progress: number;
};

const ScrapbookContext = createContext<ScrapbookValue | null>(null);

export function ScrapbookProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [scene, setScene] = useState<SceneId>('cover');
  const [overlay, setOverlay] = useState<OverlayRequest>(null);
  const [progress, setProgress] = useState(0);

  /** Guards against a smooth scroll racing its own scroll events. */
  const scrollingRef = useRef(false);

  const scrollToScene = useCallback(
    (next: SceneId) => {
      if (typeof document === 'undefined') return;
      const target = document.getElementById(sectionId(next));
      if (!target) return;
      scrollingRef.current = true;
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      // Smooth scrolling emits events for a while; release the guard after it
      // settles so manual scrolling takes over again immediately.
      window.setTimeout(() => {
        scrollingRef.current = false;
      }, reducedMotion ? 60 : 900);
    },
    [reducedMotion],
  );

  const goToScene = useCallback(
    (next: SceneId) => {
      setOverlay(null);
      scrollToScene(next);
    },
    [scrollToScene],
  );

  const sceneIndex = SCENE_ORDER.indexOf(scene);

  /**
   * `scene` is derived from scroll, so stepping chapters is just scrolling —
   * the spy updates `scene` on its own once the new section arrives.
   * A ref mirrors the latest value so the callbacks stay stable.
   */
  const sceneRef = useRef(scene);
  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  const step = useCallback(
    (delta: number) => {
      setOverlay(null);
      const index = SCENE_ORDER.indexOf(sceneRef.current);
      const target = SCENE_ORDER[
        Math.min(Math.max(index + delta, 0), SCENE_ORDER.length - 1)
      ];
      scrollToScene(target);
    },
    [scrollToScene],
  );

  const nextScene = useCallback(() => step(1), [step]);
  const prevScene = useCallback(() => step(-1), [step]);

  /* ── Scroll spy: which chapter owns the viewport ────────────────────────── */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const sections = SCENE_ORDER.map((id) => document.getElementById(sectionId(id))).filter(
      (node): node is HTMLElement => node !== null,
    );
    if (sections.length === 0) return;

    // A chapter is "current" once its top has crossed the upper third of the
    // viewport — reads naturally while scrolling in either direction.
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingRef.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id.replace(/^chapter-/, '') as SceneId;
          setScene((current) => (current === id ? current : id));
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* ── Document progress for the scroll rail ──────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const openOverlay = useCallback((request: Exclude<OverlayRequest, null>) => {
    setOverlay(request);
  }, []);

  const closeOverlay = useCallback(() => setOverlay(null), []);

  const value = useMemo<ScrapbookValue>(
    () => ({
      scene,
      sceneIndex,
      goToScene,
      nextScene,
      prevScene,
      overlay,
      openOverlay,
      closeOverlay,
      reducedMotion,
      progress,
    }),
    [scene, sceneIndex, goToScene, nextScene, prevScene, overlay, openOverlay, closeOverlay, reducedMotion, progress],
  );

  return <ScrapbookContext.Provider value={value}>{children}</ScrapbookContext.Provider>;
}

export function useScrapbook() {
  const value = useContext(ScrapbookContext);
  if (!value) throw new Error('useScrapbook must be used inside <ScrapbookProvider>');
  return value;
}
