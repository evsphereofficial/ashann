import { assets } from "./assets";
import { type CharacterAsset, type CharacterArt } from "./types";

/**
 * The six characters the user asked for, listed part by part exactly as
 * supplied in `User Requirement.md` §3.
 *
 * ── Asset policy ────────────────────────────────────────────────────────────
 * Every image here is real supplied artwork from `RefrenceImages/`, optimised
 * to WebP by `scripts/build-assets.mjs` (450 MB of PNG → 8 MB of WebP) and
 * recorded in the generated manifest `src/content/assets.ts`.
 *
 * `hero` is the image the spread leads with — always a genuine cut-out with
 * transparency, so it can sit on paper, overlap a torn edge or break a frame.
 * `gallery` carries all five images per character with a note on what each
 * one is, so a spread can show a portrait, a full body and a manga panel
 * without ever repeating a frame.
 *
 * The manifest is the source of truth for paths and dimensions; if
 * `RefrenceImages/` changes, re-run the script and the paths follow.
 *
 * ── Quote policy ────────────────────────────────────────────────────────────
 * `quote` is `null` on every entry. The brief forbids inventing canon quotes
 * or attributing invented lines to characters, so the UI renders an explicit
 * "[PLACEHOLDER: add a quote]" slot until the creator fills it in.
 */

/** Pull a character's images out of the generated manifest. */
function galleryFor(id: string): CharacterArt[] {
  const entries = assets.characters[id] ?? [];
  return entries.map((entry, index) => ({
    src: entry.src,
    width: entry.width,
    height: entry.height,
    cutout: entry.cutout,
    source: entry.source,
    note: ART_NOTES[id]?.[index] ?? "Supplied artwork.",
  }));
}

/**
 * What each frame actually shows, read off the contact sheets
 * (`docs/asset-inventory.md` §1). Kept beside the paths so a spread never
 * has to guess which frame is the portrait and which is the panel.
 */
const ART_NOTES: Record<string, string[]> = {
  speedwagon: [
    "Portrait in a checkered top hat — the hero cut-out.",
    "Full body in a purple suit, standing.",
    "Surprised portrait, hand raised.",
    "Dark, moody fedora portrait for a torn-paper reveal.",
    "Small full body, made for scattering.",
  ],
  wamuu: [
    "Headdress portrait, gold and turquoise.",
    "Chibi variant, drawn small and round.",
    "Manga action panel, halftoned.",
    "Second manga action panel.",
    "Blue-armoured pose — the editorial hero.",
  ],
  polnareff: [
    "Muscular pose, mid-stride.",
    "Second muscular pose, arms wide.",
    "Close-up with rings on every finger.",
    "Colour action panel, full bleed.",
    "Full body, silver hair — the hero cut-out.",
  ],
  okuyasu: [
    "Chibi variant.",
    "Full body in the school uniform.",
    "Shocked close-up — a reaction frame.",
    "Second shocked close-up.",
    "Angry portrait with his Stand behind him.",
  ],
  doppio: [
    "Phone manga panel, halftoned.",
    "Chibi variant.",
    "Full body in purple.",
    "Harness art, three-quarter view.",
    "Tearful portrait — the hero cut-out.",
  ],
  pucci: [
    "Dagger portrait, green collar.",
    "Priest portrait, cassock and collar.",
    "Dynamic pose, sleeves out.",
    "Full body in black and gold.",
    "Full body in purple and gold.",
  ],
};

/** Index of the frame the spread leads with (always a real cut-out). */
const HERO_INDEX: Record<string, number> = {
  speedwagon: 0,
  wamuu: 4,
  polnareff: 4,
  okuyasu: 1,
  doppio: 4,
  pucci: 3,
};

/** Accent sampled from each folder's dominant colour (inventory §1). */
const ACCENT: Record<string, string> = {
  speedwagon: "#8b4a3a",
  wamuu: "#2f93ad",
  polnareff: "#4a53b8",
  okuyasu: "#6a4fb0",
  doppio: "#c9455f",
  pucci: "#3f8f6a",
};

const META: Array<{ id: string; name: string; part: string; scale: number; rotation: number; role: CharacterAsset["role"] }> = [
  { id: "speedwagon", name: "Speedwagon", part: "Part 1", scale: 1, rotation: -5, role: "cutout" },
  { id: "wamuu", name: "Wamuu", part: "Part 2", scale: 0.94, rotation: 4, role: "cutout" },
  { id: "polnareff", name: "Jean Pierre Polnareff", part: "Part 3", scale: 1.06, rotation: -3, role: "cutout" },
  { id: "okuyasu", name: "Okuyasu Nijimura", part: "Part 4", scale: 0.98, rotation: 6, role: "sticker" },
  { id: "doppio", name: "Vinegar Doppio", part: "Part 5", scale: 0.9, rotation: -6, role: "sticker" },
  { id: "pucci", name: "Enrico Pucci", part: "Part 6", scale: 1.02, rotation: 3, role: "panel" },
];

export const characters: CharacterAsset[] = META.map((meta) => {
  const gallery = galleryFor(meta.id);
  const heroIndex = HERO_INDEX[meta.id] ?? 0;
  const hero = gallery[heroIndex] ?? gallery[0];

  return {
    id: meta.id,
    name: meta.name,
    part: meta.part,
    image: hero?.src ?? "",
    alt: hero
      ? `${meta.name}, ${hero.note.toLowerCase()} Supplied JoJo artwork.`
      : `Artwork for ${meta.name}.`,
    role: meta.role,
    accent: ACCENT[meta.id] ?? "#8b4a3a",
    quote: null,
    scale: meta.scale,
    rotation: meta.rotation,
    gallery,
    heroIndex,
  };
});

/**
 * Art-direction note for the blue sub-spread.
 *
 * This is a *drawing* decision, not a canon claim: it only says which
 * cut-outs sit on the blue-inked page behind the loud one. Confirm or change
 * it — the scene reads this list and nothing else.
 */
export const blueSubspreadIds: string[] = ["wamuu", "polnareff"];
