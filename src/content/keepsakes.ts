import type { Keepsake, LetterContent } from "./types";

/** Chapter 05 — six themed keepsake pages. */
export const keepsakes: Keepsake[] = [
  {
    id: "drawer",
    title: "The ribbon drawer",
    hint: "Pull the ribbon tab to slide the drawer open",
    affordance: "Pull",
    reveal: "Everything comes at a cost. In exchange for your AMAZING wife — this one stays EMPTY",
  },
  {
    id: "sleeve",
    title: "Pressed between pages",
    hint: "Slide the card out of its pocket",
    affordance: "Slide",
    reveal: "Its like you're the only person I know. Take care of yourself and dont ever stop being the amazing boyfriend you always end up being",
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
    reveal: "I could've never imagined in a million years that",
  },
  {
    id: "giftbox",
    title: "Unwrap this",
    hint: "Untie the bow and lift the lid",
    affordance: "Open",
    reveal: "Pretend this is a makeshift $10 wendy's giftcard",
  },
  {
    id: "hidden",
    title: "Above the clouds",
    hint: "Part the clouds to see what is waiting underneath",
    affordance: "Part",
    reveal: "Nothing in this entire universe could possibly ever express my love for you man. Happy anniversary",
  },
];

export const FILM_FRAME_LINES = [
  "I could've never imagined in a million years that",
  "someone like me could experience something like this",
  "..with someone as amazing as you.",
  "I love you man",
] as const;

/** Chapter 06 — the letter, exact text from Natalie. */
export const letter: LetterContent = {
  greeting: "Hey baby,",
  paragraphs: [
    "I still remember how October went. It was eating my literal heart out, knowing that I love you so much and yet I couldn't possibly imagine you getting together with someone like ME and yet here we are ( 〃▽〃)",
    "I truly dont think that you'll ever understand your true worth baby. You're worth more than anything that anyone could ever amount to, you're nowhere even CLOSE to being replaceable, there's nobody like you. Nothing and nobody could make me replicate the way I feel when Im talking to you, you mean more than what words could possibly describe. It litreally would be insulting if I used petty words to describe my love for you (/´△`＼)",
    "Im so lucky to be your girlfriend, don't let anything make you think otherwise. Somedays, I may not be the BEST but I really try to make you understand how loved you are that even days without you feel like decades. I genuinely wonder whether I'm enough for you. What did I do for you?",
  ],
  signature: "-Natalie",
};
