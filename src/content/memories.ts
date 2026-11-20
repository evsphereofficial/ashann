import { ph, type Memory } from "./types";

/**
 * Photographs and captions.
 *
 * No personal photographs were supplied, so each entry points at a locally
 * generated placeholder asset in `public/assets/photos/`. To go live, drop a
 * real image into that folder and update `image` + `alt` — layout, animation
 * and lightbox code never need to change.
 *
 * The four `layout` variants deliberately produce four different compositions
 * so the spread never reads as a repeated card grid.
 */
export const memories: Memory[] = [
  {
    id: "memory-polaroid",
    title: ph("title of the first memory"),
    date: ph("date of the first memory"),
    caption: ph("short caption for the polaroid"),
    note: ph("the note written on the back of this polaroid"),
    image: "/assets/photos/memory-1.svg",
    alt: "Placeholder photograph: abstract paper collage standing in for the first memory.",
    layout: "polaroid",
    rotation: -4.5,
  },
  {
    id: "memory-filmstrip",
    title: ph("title of the film-strip memory"),
    date: ph("date of the film-strip memory"),
    caption: ph("caption for the film strip frames"),
    note: ph("what these frames were taken of"),
    image: "/assets/photos/memory-2.svg",
    alt: "Placeholder photograph: abstract film-strip frame standing in for the second memory.",
    layout: "filmstrip",
    rotation: 3,
  },
  {
    id: "memory-postcard",
    title: ph("title of the postcard memory"),
    date: ph("date of the postcard memory"),
    caption: ph("message written across the postcard"),
    note: ph("where this postcard was sent from"),
    image: "/assets/photos/memory-3.svg",
    alt: "Placeholder photograph: abstract postcard standing in for the third memory.",
    layout: "postcard",
    rotation: -2,
  },
  {
    id: "memory-editorial",
    title: ph("title of the editorial memory"),
    date: ph("date of the editorial memory"),
    caption: ph("editorial caption for the large photograph"),
    note: ph("longer note beside the large photograph"),
    image: "/assets/photos/memory-4.svg",
    alt: "Placeholder photograph: abstract editorial image standing in for the fourth memory.",
    layout: "editorial",
    rotation: 1.8,
  },
  {
    id: "memory-ticket",
    title: ph("title behind the ticket stub"),
    date: ph("date of the ticket stub"),
    caption: ph("what the ticket was for"),
    note: ph("one line about the ticket stub"),
    image: "/assets/photos/memory-5.svg",
    alt: "Placeholder photograph: abstract ticket-stub image standing in for the fifth memory.",
    layout: "postcard",
    rotation: 5,
  },
  {
    id: "memory-small",
    title: ph("title of the small photograph"),
    date: ph("date of the small photograph"),
    caption: ph("caption for the small photograph"),
    note: ph("note for the small photograph"),
    image: "/assets/photos/memory-6.svg",
    alt: "Placeholder photograph: abstract small snapshot standing in for the sixth memory.",
    layout: "polaroid",
    rotation: -6,
  },
];
