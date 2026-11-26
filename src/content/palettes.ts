import type { SceneId } from "./types";

/**
 * Colour systems for the scroll journey.
 *
 * Two layers, both data (never hard-coded in a component):
 *
 *  1. **Chapter palettes** — the paper stock each of the eight chapters is
 *     printed on. The scroll backdrop cross-fades between them so the page
 *     never flips abruptly: the reader arrives at a new colour the way they
 *     arrive at a new page.
 *  2. **Character palettes** — inside the JoJo magazine each of the six
 *     characters owns a wash. Scrolling their spread tints the whole
 *     viewport in their colours, with a torn-paper edge and a gingham band
 *     marking the hand-over.
 *
 * Every value here is art direction, not canon: the palettes come from the
 * supplied character folders (`docs/asset-inventory.md` §1) and the Pinterest
 * research (`docs/pinterest-research.md`).
 */

export interface Palette {
  /** Page wash — the colour the whole viewport fades to. */
  bg: string;
  /** Deeper edge / vignette tone. */
  bgDeep: string;
  /** Stock the paper cards are cut from. */
  paper: string;
  /** Primary accent (rules, tabs, active states). */
  accent: string;
  /** Softer accent for washes and tape. */
  accentSoft: string;
  /** Ink for body copy on this stock — kept AA against `bg`. */
  ink: string;
  /** Gingham check colour (used by the transition band). */
  gingham: string;
}

/* ── Chapter palettes ─────────────────────────────────────────────────────── */

export const chapterPalettes: Record<SceneId, Palette> = {
  cover: {
    bg: "#f3e7d5",
    bgDeep: "#d9c3a2",
    paper: "#fbf7f1",
    accent: "#c0392b",
    accentSoft: "#f2c9d2",
    ink: "#2b2118",
    gingham: "#c0392b",
  },
  opening: {
    bg: "#eef2f7",
    bgDeep: "#c9d8e8",
    paper: "#fbf7f1",
    accent: "#3f6489",
    accentSoft: "#c7d9e8",
    ink: "#1f2733",
    gingham: "#6e93b8",
  },
  timeline: {
    bg: "#f6ecd8",
    bgDeep: "#dcc79f",
    paper: "#fffaf0",
    accent: "#b85e75",
    accentSoft: "#f9e3e8",
    ink: "#2f231a",
    gingham: "#b85e75",
  },
  memories: {
    bg: "#eaf3f1",
    bgDeep: "#c2ddd6",
    paper: "#fbf7f1",
    accent: "#8e3e56",
    accentSoft: "#f2c9d2",
    ink: "#22282a",
    gingham: "#7fb3a6",
  },
  jojo: {
    bg: "#f4ece0",
    bgDeep: "#d8c6a8",
    paper: "#fbf7f1",
    accent: "#c0392b",
    accentSoft: "#f2c9d2",
    ink: "#241f1a",
    gingham: "#c0392b",
  },
  keepsakes: {
    bg: "#efe4d6",
    bgDeep: "#cbb392",
    paper: "#fffaf0",
    accent: "#a83a5a",
    accentSoft: "#f9e3e8",
    ink: "#2b2118",
    gingham: "#a83a5a",
  },
  letter: {
    bg: "#fdf6ec",
    bgDeep: "#e8d5bb",
    paper: "#fffdf7",
    accent: "#8e3e56",
    accentSoft: "#f9e3e8",
    ink: "#2b2118",
    gingham: "#c98a9b",
  },
  finale: {
    bg: "#241a2e",
    bgDeep: "#120c18",
    paper: "#f7efe2",
    accent: "#e8b64c",
    accentSoft: "#4a3560",
    ink: "#f7efe2",
    gingham: "#8e5a9e",
  },
};

/* ── Character palettes (the magazine washes) ─────────────────────────────── */

export interface CharacterPalette extends Palette {
  /** Short label printed on the torn edge that hands over to this colour. */
  label: string;
}

export const characterPalettes: Record<string, CharacterPalette> = {
  speedwagon: {
    label: "Sepia & burgundy",
    bg: "#efe0c8",
    bgDeep: "#c9a87c",
    paper: "#f7efe0",
    accent: "#7a2128",
    accentSoft: "#e0c9a4",
    ink: "#2e2115",
    gingham: "#8b4a3a",
  },
  wamuu: {
    label: "Icy blue & turquoise",
    bg: "#dff0f4",
    bgDeep: "#9fd0dd",
    paper: "#f4fbfd",
    accent: "#1f7f96",
    accentSoft: "#bfe6ee",
    ink: "#123038",
    gingham: "#4fa3d1",
  },
  polnareff: {
    label: "Cobalt, silver & lavender",
    bg: "#e6e7f7",
    bgDeep: "#a9ade0",
    paper: "#f6f6fd",
    accent: "#3941a8",
    accentSoft: "#c9cbef",
    ink: "#1b1d46",
    gingham: "#6f76cf",
  },
  okuyasu: {
    label: "Deep blue & violet",
    bg: "#e2ddf5",
    bgDeep: "#9c91dd",
    paper: "#f5f3fd",
    accent: "#4b2fa0",
    accentSoft: "#cdc2f0",
    ink: "#201641",
    gingham: "#7b5ea7",
  },
  doppio: {
    label: "Blush & crimson",
    bg: "#fbe4e9",
    bgDeep: "#f0b6c4",
    paper: "#fff7f9",
    accent: "#b3273f",
    accentSoft: "#f9d3dc",
    ink: "#3d1620",
    gingham: "#e0799b",
  },
  pucci: {
    label: "Green, ivory & lilac",
    bg: "#e4f1e6",
    bgDeep: "#aed4b8",
    paper: "#f8fcf8",
    accent: "#2f7a58",
    accentSoft: "#d9ecdd",
    ink: "#15301f",
    gingham: "#8fbfa0",
  },
};

/**
 * Order the character washes are scrolled through inside the magazine.
 * Matches `characters.ts` so the spread, the palette and the bio dialog can
 * never drift apart.
 */
export const CHARACTER_ORDER: string[] = [
  "speedwagon",
  "wamuu",
  "polnareff",
  "okuyasu",
  "doppio",
  "pucci",
];

export const characterPalette = (id: string): CharacterPalette =>
  characterPalettes[id] ?? characterPalettes.speedwagon;

/**
 * Turn a palette into the CSS custom properties the backdrop reads.
 * Kept here so the property names live in exactly one place.
 */
export function paletteVars(palette: Palette): Record<string, string> {
  return {
    "--pal-bg": palette.bg,
    "--pal-bg-deep": palette.bgDeep,
    "--pal-paper": palette.paper,
    "--pal-accent": palette.accent,
    "--pal-accent-soft": palette.accentSoft,
    "--pal-ink": palette.ink,
    "--pal-gingham": palette.gingham,
  };
}
