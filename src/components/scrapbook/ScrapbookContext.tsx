'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SCENE_ORDER, type SceneId } from '@/scenes/registry';

export { SCENE_ORDER, type SceneId };

export type OverlayRequest =
  | { type: 'memory'; id: string }
  | { type: 'keepsake'; id: string }
  | { type: 'character'; id: string }
  | { type: 'index' }
  | null;

type ScrapbookValue = {
  scene: SceneId;
  sceneIndex: number;
  goToScene: (scene: SceneId) => void;
  nextScene: () => void;
  prevScene: () => void;
  overlay: OverlayRequest;
  openOverlay: (request: Exclude<OverlayRequest, null>) => void;
  closeOverlay: () => void;
  reducedMotion: boolean;
};

const ScrapbookContext = createContext<ScrapbookValue | null>(null);

export function ScrapbookProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [scene, setScene] = useState<SceneId>('cover');
  const [overlay, setOverlay] = useState<OverlayRequest>(null);

  const goToScene = useCallback((next: SceneId) => {
    setOverlay(null);
    setScene(next);
  }, []);

  const sceneIndex = SCENE_ORDER.indexOf(scene);

  const nextScene = useCallback(() => {
    setOverlay(null);
    setScene((current) => {
      const index = SCENE_ORDER.indexOf(current);
      return SCENE_ORDER[Math.min(index + 1, SCENE_ORDER.length - 1)];
    });
  }, []);

  const prevScene = useCallback(() => {
    setOverlay(null);
    setScene((current) => {
      const index = SCENE_ORDER.indexOf(current);
      return SCENE_ORDER[Math.max(index - 1, 0)];
    });
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
    }),
    [scene, sceneIndex, goToScene, nextScene, prevScene, overlay, openOverlay, closeOverlay, reducedMotion],
  );

  return <ScrapbookContext.Provider value={value}>{children}</ScrapbookContext.Provider>;
}

export function useScrapbook() {
  const value = useContext(ScrapbookContext);
  if (!value) throw new Error('useScrapbook must be used inside <ScrapbookProvider>');
  return value;
}

/** Scene changes reset the reading position without hijacking the scroll itself. */
export function useSceneScrollReset(scene: SceneId) {
  const { reducedMotion } = useScrapbook();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [scene, reducedMotion]);
}
