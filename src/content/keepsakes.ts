import type { Keepsake, LetterContent } from "./types";

/** Chapter 05 — six themed keepsake pages. */
export const keepsakes: Keepsake[] = [
  {
    id: "drawer",
    title: "The ribbon drawer",
    hint: "Pull the ribbon tab to slide the drawer open",
    affordance: "Pull",
    reveal: "\"I'll find you in every lifetime♡\" (P.S. Thats a threat)",
  },
  {
    id: "sleeve",
    title: "Pressed between pages",
    hint: "Slide the card out of its pocket",
    affordance: "Slide",
    reveal: "You're the closest I've ever gotten to someone. Please baby, take care of yourself.",
  },
  {
    id: "polaroid",
    title: "Under the star",
    hint: "Peel back the star to read what is beneath",
    affordance: "Peel",
    reveal: "22nd June 2:27 PM — HAPPIEST I've ever been in 15 years.",
  },
  {
    id: "filmstrip",
    title: "Still frames",
    hint: "Step through the negatives on the lightbox",
    affordance: "Next frame",
    reveal: "Every stupid inside joke, every late-night reel, and every single day with you.",
  },
  {
    id: "giftbox",
    title: "Unwrap this",
    hint: "Untie the bow and lift the lid",
    affordance: "Open",
    reveal: "My Kirk for National Kirks Day ♡",
  },
  {
    id: "hidden",
    title: "Above the clouds",
    hint: "Part the clouds to see what is waiting underneath",
    affordance: "Part",
    reveal: "EVERY single day has been nothing but pure bliss (ﾉ_・、)",
  },
];

/** Chapter 06 — the letter, built from the client's own words. */
export const letter: LetterContent = {
  greeting: "Hey idiot ♡,",
  paragraphs: [
    "You're the closest I've ever gotten to someone, or someone got close to me. Never EVER felt safer with anyone like that.",
    "From \"Are you a father\" on 22nd June to Krikentines day, 26th October, and every late-night joke since — EVERY single day has been nothing but pure bliss (ﾉ_・、).",
    "Please baby, take care of yourself. I could go on and on about how much I love you, but it would never be enough. I'll find you in every lifetime♡ (P.S. Thats a threat).",
  ],
  signature: "— Always yours, Ash",
};
