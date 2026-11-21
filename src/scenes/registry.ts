import { scenes } from "@/content/anniversary";
import type { SceneId, SceneMeta } from "@/content/types";

/**
 * Chapter order and labels.
 *
 * The labels themselves live in `content/anniversary.ts` so the creator only
 * has to edit one place — this module just pins the playback order and gives
 * the shell a stable index.
 */
export const SCENE_ORDER: SceneId[] = [
  "cover",
  "opening",
  "timeline",
  "memories",
  "jojo",
  "keepsakes",
  "letter",
  "finale",
];

export type { SceneId, SceneMeta };

export const SCENE_META: SceneMeta[] = SCENE_ORDER.map(
  (id) => scenes.find((scene) => scene.id === id) ?? scenes[0],
);

export const sceneMeta = (id: SceneId): SceneMeta =>
  SCENE_META.find((meta) => meta.id === id) ?? SCENE_META[0];
