import { PAPER, background } from "@/lib/art";
import { ph, type Memory } from "./types";

/**
 * Photographs and captions.
 *
 * No personal photographs were supplied, so each print shows a real supplied
 * paper scan from `RefrenceImages/` (the same pack the rest of the scrapbook
 * is built from) instead of a generated illustration. That keeps every pixel
 * on the page part of the user's own material while leaving the *slot* honest:
 * every caption, note and title is still an explicit `[PLACEHOLDER …]`, and
 * the photographs chapter carries a visible "to fill in" banner.
 *
 * To go live, point `image` at your own file — layout, animation and the
 * lightbox never need to change.
 */
export const memories: Memory[] = [
  {
    id: "memory-polaroid",
    title: ph("title of the first memory"),
    date: ph("date of the first memory"),
    caption: ph("short caption for the polaroid"),
    note: ph("the note written on the back of this polaroid"),
    image: background(PAPER.grungeRed),
    alt: "Placeholder print: a supplied red grunge collage scan standing in for the first photograph.",
    layout: "polaroid",
    rotation: -4.5,
  },
  {
    id: "memory-filmstrip",
    title: ph("title of the film-strip memory"),
    date: ph("date of the film-strip memory"),
    caption: ph("caption for the film strip frames"),
    note: ph("what these frames were taken of"),
    image: background(PAPER.redMangaPanels),
    alt: "Placeholder print: a supplied red manga-panel scan standing in for the film-strip photograph.",
    layout: "filmstrip",
    rotation: 3,
  },
  {
    id: "memory-postcard",
    title: ph("title of the postcard memory"),
    date: ph("date of the postcard memory"),
    caption: ph("message written across the postcard"),
    note: ph("where this postcard was sent from"),
    image: background(PAPER.printmakingGrid),
    alt: "Placeholder print: a supplied printmaking-grid scan standing in for the postcard photograph.",
    layout: "postcard",
    rotation: -2,
  },
  {
    id: "memory-editorial",
    title: ph("title of the editorial memory"),
    date: ph("date of the editorial memory"),
    caption: ph("editorial caption for the large photograph"),
    note: ph("longer note beside the large photograph"),
    image: background(PAPER.blueShatteredStars),
    alt: "Placeholder print: a supplied blue shattered-star collage standing in for the large photograph.",
    layout: "editorial",
    rotation: 1.8,
  },
  {
    id: "memory-ticket",
    title: ph("title behind the ticket stub"),
    date: ph("date of the ticket stub"),
    caption: ph("what the ticket was for"),
    note: ph("one line about the ticket stub"),
    image: background(PAPER.starredNotebook),
    alt: "Placeholder print: a supplied starred notebook scan standing in for the ticket-stub photograph.",
    layout: "postcard",
    rotation: 5,
  },
  {
    id: "memory-small",
    title: ph("title of the small photograph"),
    date: ph("date of the small photograph"),
    caption: ph("caption for the small photograph"),
    note: ph("note for the small photograph"),
    image: background(PAPER.ginghamNoteCard),
    alt: "Placeholder print: a supplied gingham note-card scan standing in for the small photograph.",
    layout: "polaroid",
    rotation: -6,
  },
];
