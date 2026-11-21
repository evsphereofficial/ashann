'use client';

import { MemoryLightbox } from './MemoryLightbox';
import { DetailSheet } from './DetailSheet';
import { SceneIndexOverlay } from './SceneIndexOverlay';

/**
 * One host for every overlay. Scene and scroll position are untouched while an
 * overlay is open — closing lands you exactly where you were.
 */
export function OverlayHost() {
  return (
    <>
      <MemoryLightbox />
      <DetailSheet />
      <SceneIndexOverlay />
    </>
  );
}
