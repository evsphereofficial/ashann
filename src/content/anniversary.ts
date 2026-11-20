import { ph, type SceneMeta } from "./types";

/** Cover + global copy. Every personal value is an explicit placeholder. */
export const anniversary = {
  conceptTitle: "Six Months, One Little Universe",
  eyebrow: "A scrapbook for",
  /** Both names are unset — never invent them. */
  recipientName: ph("boyfriend's first name"),
  senderName: ph("your first name"),
  dateLine: ph("anniversary date, e.g. 14 February 2026"),
  subtitle: ph("one sentence about what six months has felt like"),
  coverHint: "Everything on these pages can be touched.",
  openingNote:
    "Objects here move on their own — and they answer when you tap them.",
  finaleMessage: ph("closing line for the two of you"),
  /** No audio ships by default; the control only exists if audio is added. */
  hasAudio: false,
} as const;

export const scenes: SceneMeta[] = [
  {
    id: "cover",
    label: "Cover",
    blurb: "The invitation — open the scrapbook.",
    chapter: "00",
  },
  {
    id: "opening",
    label: "Comes Alive",
    blurb: "Loose pieces fly in and assemble themselves.",
    chapter: "01",
  },
  {
    id: "timeline",
    label: "Six Months",
    blurb: "Six keepsake tokens threaded on a ribbon.",
    chapter: "02",
  },
  {
    id: "memories",
    label: "Photographs",
    blurb: "Polaroids, film strips, postcards and a lightbox.",
    chapter: "03",
  },
  {
    id: "jojo",
    label: "The Magazine",
    blurb: "A JoJo fan-zine folded into the back of the book.",
    chapter: "04",
  },
  {
    id: "keepsakes",
    label: "Keepsakes",
    blurb: "Drawers, sleeves, seals and one hidden sticker.",
    chapter: "05",
  },
  {
    id: "letter",
    label: "The Letter",
    blurb: "Break the wax seal and unfold it.",
    chapter: "06",
  },
  {
    id: "finale",
    label: "Keepsake",
    blurb: "The closing message, and a way back to the start.",
    chapter: "07",
  },
];
