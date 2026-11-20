import { ph, type Keepsake, type LetterContent } from "./types";

/** Scene 5 — six objects, six different interaction types. */
export const keepsakes: Keepsake[] = [
  {
    id: "drawer",
    title: "The ribbon drawer",
    hint: "Pull the ribbon tab to slide the drawer open",
    affordance: "Pull",
    reveal: ph("what is hidden in the drawer"),
  },
  {
    id: "sleeve",
    title: "Paper sleeve",
    hint: "Slide the card out of its sleeve",
    affordance: "Slide",
    reveal: ph("message hidden inside the sleeve"),
  },
  {
    id: "polaroid",
    title: "A turnable polaroid",
    hint: "Turn the photograph over",
    affordance: "Turn over",
    reveal: ph("note written on the back of the polaroid"),
  },
  {
    id: "filmstrip",
    title: "Film strip",
    hint: "Move through the frames",
    affordance: "Next frame",
    reveal: ph("caption for the selected frame"),
  },
  {
    id: "giftbox",
    title: "Small gift box",
    hint: "Open the lid",
    affordance: "Open",
    reveal: ph("surprise inside the gift box"),
  },
  {
    id: "hidden",
    title: "A star that is not only decoration",
    hint: "There is something behind the star sticker",
    affordance: "Peel",
    reveal: ph("secret note hidden behind the star sticker"),
  },
];

/** Scene 6 — the letter. Creator-supplied text only. */
export const letter: LetterContent = {
  greeting: ph("how the letter opens, e.g. “Hey,”"),
  paragraphs: [
    ph("first paragraph of the anniversary letter"),
    ph("second paragraph of the anniversary letter"),
    ph("third paragraph of the anniversary letter"),
  ],
  signature: ph("how you sign off"),
};
