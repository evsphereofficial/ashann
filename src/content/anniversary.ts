import type { SceneMeta } from "./types";

/** Cover + global copy — populated from the client's screenshots & chats. */
export const anniversary = {
  conceptTitle: "Six Months, One Little Universe",
  eyebrow: "A scrapbook for",
  recipientName: "My favourite idiot ♡",
  senderName: "Ash",
  dateLine: "22nd June · Six Months Together",
  subtitle: "\"I'll find you in every lifetime♡\" (P.S. Thats a threat)",
  coverHint: "Everything on these pages can be touched.",
  openingNote:
    "Objects here move on their own — and they answer when you tap them.",
  finaleMessage: "EVERY single day has been nothing but pure bliss (ﾉ_・、)",
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
    blurb: "Six months pinned along the ribbon.",
    chapter: "02",
  },
  {
    id: "memories",
    label: "Photographs",
    blurb: "Six screenshots, six memories.",
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
    blurb: "Drawers, clouds, gift box, and hidden notes.",
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
