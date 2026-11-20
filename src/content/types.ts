/**
 * Content contract for the whole scrapbook.
 *
 * Rule from AGENTS.md / master brief §4.4: personal content must never be
 * invented, and must live in data — not in JSX or animation timelines.
 *
 * Placeholder convention
 * ----------------------
 * Every value the creator still needs to supply is a string wrapped in
 * `[PLACEHOLDER: … ]`. `isPlaceholder()` lets the UI flag those visibly, so a
 * half-edited scrapbook never silently reads as finished.
 */

/** True when a value is still a creator-supplied placeholder. */
export function isPlaceholder(value: unknown): boolean {
  return typeof value === "string" && value.trim().startsWith("[PLACEHOLDER");
}

/** Build a placeholder string so every call site reads the same way. */
export function ph(description: string): string {
  return `[PLACEHOLDER: ${description}]`;
}

/** Strip the wrapper for screen readers that should not read the brackets. */
export function readable(value: string): string {
  if (!isPlaceholder(value)) return value;
  return value.replace(/^\[PLACEHOLDER:\s*/i, "").replace(/\]$/, "");
}

export type SceneId =
  | "cover"
  | "opening"
  | "timeline"
  | "memories"
  | "jojo"
  | "keepsakes"
  | "letter"
  | "finale";

export interface SceneMeta {
  id: SceneId;
  /** Short label shown on the paper ribbon index. */
  label: string;
  /** One-line description used by the index and the skip links. */
  blurb: string;
  /** Chapter number printed on the ribbon tab. */
  chapter: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  note: string;
  /** Local asset path under /public. */
  image: string;
  alt: string;
  layout: "polaroid" | "filmstrip" | "postcard" | "editorial";
  /** Rotation in degrees at rest — keeps the spread asymmetric. */
  rotation: number;
}

export interface TimelineEntry {
  id: string;
  month: number;
  date: string;
  title: string;
  note: string;
}

export interface CharacterAsset {
  id: string;
  name: string;
  /** Part label exactly as the user listed it. */
  part: string;
  image: string;
  alt: string;
  role: "sticker" | "cutout" | "panel";
  /** Accent colour sampled for this character's frame and reaction. */
  accent: string;
  /**
   * Creator-supplied caption revealed when the sticker is tapped.
   * Intentionally null: the brief forbids inventing canon quotes.
   */
  quote: string | null;
  /** Resting scale — characters are never all the same size. */
  scale: number;
  rotation: number;
}

export interface Keepsake {
  id: string;
  title: string;
  hint: string;
  /** How the object is operated — shown as a visible affordance label. */
  affordance: string;
  reveal: string;
}

export interface LetterContent {
  greeting: string;
  paragraphs: string[];
  signature: string;
}
