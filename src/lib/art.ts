import { assets } from "@/content/assets";

/**
 * Thin, typed access to the generated asset manifest.
 *
 * `src/content/assets.ts` is written by `scripts/build-assets.mjs` and is the
 * only place a path to supplied artwork is allowed to live — components ask
 * for an *index*, never a filename, so re-running the pipeline can never
 * leave a scene pointing at a file that no longer exists.
 *
 * Indices follow `docs/asset-inventory.md`:
 *  - `element(i)`     → the 28 transparent decorations, 0–27
 *  - `background(i)`  → the 13 paper / texture scans, 0–12
 *  - `frames(id)`     → the five supplied frames of one character, 0–4
 */

/** One of the 28 cut-out decorations (books, buttons, bows, torn edges…). */
export function element(index: number): string {
  const list = assets.elements;
  return list[((index % list.length) + list.length) % list.length];
}

/** One of the 13 paper / texture scans (gingham, newsprint, wallpaper…). */
export function background(index: number): string {
  const list = assets.backgrounds;
  return list[((index % list.length) + list.length) % list.length];
}

/** All supplied frames for a character id, in pack order. */
export function frames(id: string): Array<{ src: string; width: number; height: number; cutout: boolean }> {
  return (assets.characters[id] ?? []).map(({ src, width, height, cutout }) => ({
    src,
    width,
    height,
    cutout,
  }));
}

/** A single character frame, falling back to the first one that exists. */
export function frame(id: string, index: number): string {
  const list = assets.characters[id] ?? [];
  if (list.length === 0) return "";
  const entry = list[Math.min(Math.max(index, 0), list.length - 1)];
  return entry.src;
}

/**
 * Well-known element indices, named so a scene reads as art direction
 * rather than as a list of magic numbers.
 */
export const ART = {
  cornerFlourish: 0,
  books: 1,
  redButton: 2,
  driedRoses: 3,
  pocketWatch: 4,
  tornNewsCaption: 5,
  streetLamp: 6,
  minaret: 7,
  tornLinedCorner: 8,
  redGingham: 9,
  blankNotepaper: 10,
  ginghamNote: 11,
  moon: 12,
  bowDoodle: 13,
  ribbonDoodle: 14,
  starCluster: 15,
  crownDoodle: 16,
  angelWings: 17,
  pinkLetterPaper: 18,
  tornNewsEdge: 19,
  sfxBang: 20,
  redLily: 21,
  redStar: 22,
  starGarland: 23,
  sparkles: 24,
  bowRibbon: 25,
  tornLinedNote: 26,
  doubleHeart: 27,
} as const;

/** Well-known background indices. */
export const PAPER = {
  starWallpaper: 0,
  redGinghamSwatch: 1,
  ginghamNoteCard: 2,
  blackGingham: 3,
  starredNotebook: 4,
  notepadCollage: 5,
  scriptOnBlack: 6,
  oldNewspaper: 7,
  crumpledFoil: 8,
  grungeRed: 9,
  blueShatteredStars: 10,
  redMangaPanels: 11,
  printmakingGrid: 12,
} as const;
