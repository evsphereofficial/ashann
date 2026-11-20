#!/usr/bin/env node
/**
 * Generates the placeholder asset set for the scrapbook.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * Why placeholders exist
 * ----------------------
 * No personal photographs and no licensed JoJo artwork were supplied with
 * this project, and AGENTS.md forbids inventing either. So the repo ships
 * ORIGINAL abstract art that is unmistakably a placeholder but still composed
 * well enough to be judged as a layout.
 *
 * Replacing an asset is a drop-in operation:
 *   1. Put your file at the same path listed in src/content/*.
 *   2. Update `alt` (and `image` if the extension changes).
 * Nothing in the scene or animation code reads these files directly.
 *
 * Zero dependencies: plain Node, writes SVG.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const write = (relativePath, contents) => {
  const target = join(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents, "utf8");
  return relativePath;
};

/* -------------------------------------------------------------------------- */
/* Shared SVG helpers                                                          */
/* -------------------------------------------------------------------------- */

const svg = (w, h, body, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>${body}</svg>`;

const GRAIN = (id, freq = 0.9, opacity = 0.3) =>
  `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
     <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" stitchTiles="stitch"/>
     <feColorMatrix type="saturate" values="0"/>
     <feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer>
     <feComposite operator="in" in2="SourceGraphic"/>
   </filter>`;

const PLACEHOLDER_STAMP = (x, y, rotate = -8, text = "PLACEHOLDER") => `
  <g transform="translate(${x} ${y}) rotate(${rotate})" opacity="0.85">
    <rect x="0" y="0" width="176" height="30" rx="4" fill="none" stroke="#B85E75" stroke-width="3"/>
    <text x="88" y="21" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="14" font-weight="700" letter-spacing="3" fill="#B85E75">${text}</text>
  </g>`;

/* -------------------------------------------------------------------------- */
/* Photograph placeholders                                                     */
/* -------------------------------------------------------------------------- */

/** Each photo gets its own palette + composition so the spread never repeats. */
const PHOTO_SPECS = [
  {
    file: "memory-1.svg",
    w: 900,
    h: 1200,
    bg: ["#F9E3E8", "#EFC7D2"],
    ink: "#B85E75",
    shapes: "arc",
    caption: "POLAROID",
  },
  {
    file: "memory-2.svg",
    w: 1200,
    h: 900,
    bg: ["#E7EFF7", "#C7D9E8"],
    ink: "#3F6489",
    shapes: "stripes",
    caption: "FILM FRAME",
  },
  {
    file: "memory-3.svg",
    w: 1200,
    h: 860,
    bg: ["#FBF3E6", "#EFE0C9"],
    ink: "#A9855A",
    shapes: "hills",
    caption: "POSTCARD",
  },
  {
    file: "memory-4.svg",
    w: 980,
    h: 1240,
    bg: ["#EAF3EE", "#C9E4D9"],
    ink: "#4E9E7E",
    shapes: "circles",
    caption: "EDITORIAL",
  },
  {
    file: "memory-5.svg",
    w: 1100,
    h: 700,
    bg: ["#FDECEA", "#F7CFC8"],
    ink: "#C0392B",
    shapes: "ticket",
    caption: "TICKET STUB",
  },
  {
    file: "memory-6.svg",
    w: 900,
    h: 900,
    bg: ["#F4EDFB", "#DED0F2"],
    ink: "#7B5EA7",
    shapes: "stars",
    caption: "SNAPSHOT",
  },
];

function photoShapes(kind, w, h, ink) {
  const cx = w / 2;
  const cy = h / 2;
  switch (kind) {
    case "arc":
      return `
        <path d="M ${w * 0.1} ${h * 0.72} Q ${cx} ${h * 0.3} ${w * 0.9} ${h * 0.72}"
              fill="none" stroke="${ink}" stroke-width="6" opacity="0.55"/>
        <circle cx="${cx}" cy="${h * 0.42}" r="${w * 0.19}" fill="${ink}" opacity="0.22"/>
        <path d="M ${w * 0.16} ${h * 0.82} h ${w * 0.68}" stroke="${ink}" stroke-width="4"
              stroke-dasharray="14 12" opacity="0.6"/>`;
    case "stripes":
      return Array.from({ length: 7 }, (_, i) => {
        const y = h * 0.18 + i * (h * 0.09);
        return `<rect x="${w * 0.1}" y="${y}" width="${w * (0.8 - i * 0.07)}" height="${
          h * 0.035
        }" fill="${ink}" opacity="${0.5 - i * 0.05}"/>`;
      }).join("");
    case "hills":
      return `
        <path d="M0 ${h * 0.7} Q ${w * 0.3} ${h * 0.5} ${w * 0.58} ${h * 0.68} T ${w} ${h * 0.62} V ${h} H0 Z"
              fill="${ink}" opacity="0.28"/>
        <path d="M0 ${h * 0.84} Q ${w * 0.4} ${h * 0.68} ${w} ${h * 0.86} V ${h} H0 Z"
              fill="${ink}" opacity="0.42"/>
        <circle cx="${w * 0.76}" cy="${h * 0.24}" r="${w * 0.08}" fill="${ink}" opacity="0.35"/>`;
    case "circles":
      return `
        <circle cx="${cx}" cy="${cy - h * 0.06}" r="${Math.min(w, h) * 0.24}"
                fill="none" stroke="${ink}" stroke-width="7" opacity="0.6"/>
        <circle cx="${cx}" cy="${cy - h * 0.06}" r="${Math.min(w, h) * 0.13}" fill="${ink}" opacity="0.3"/>
        <rect x="${w * 0.14}" y="${h * 0.74}" width="${w * 0.72}" height="8" fill="${ink}" opacity="0.5"/>
        <rect x="${w * 0.14}" y="${h * 0.79}" width="${w * 0.48}" height="8" fill="${ink}" opacity="0.35"/>`;
    case "ticket":
      return `
        <rect x="${w * 0.08}" y="${h * 0.2}" width="${w * 0.84}" height="${h * 0.6}"
              rx="10" fill="none" stroke="${ink}" stroke-width="6" stroke-dasharray="18 12" opacity="0.7"/>
        <path d="M ${w * 0.5} ${h * 0.2} v ${h * 0.6}" stroke="${ink}" stroke-width="4"
              stroke-dasharray="10 10" opacity="0.6"/>
        <circle cx="${w * 0.5}" cy="${h * 0.5}" r="${h * 0.1}" fill="${ink}" opacity="0.3"/>`;
    case "stars":
    default:
      return `
        <path d="${starPath(cx, cy - h * 0.05, Math.min(w, h) * 0.26, Math.min(w, h) * 0.11, 5)}"
              fill="${ink}" opacity="0.35"/>
        <path d="${starPath(w * 0.2, h * 0.76, w * 0.09, w * 0.038, 5)}" fill="${ink}" opacity="0.55"/>
        <path d="${starPath(w * 0.82, h * 0.24, w * 0.07, w * 0.03, 5)}" fill="${ink}" opacity="0.55"/>`;
  }
}

function starPath(cx, cy, outer, inner, points) {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(a)).toFixed(2)} ${(
      cy +
      r * Math.sin(a)
    ).toFixed(2)} `;
  }
  return d + "Z";
}

function buildPhoto(spec) {
  const { w, h, bg, ink, shapes, caption } = spec;
  return svg(
    w,
    h,
    `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg[0]}"/>
        <stop offset="100%" stop-color="${bg[1]}"/>
      </linearGradient>
      ${GRAIN("grain", 0.85, 0.28)}
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <g>${photoShapes(shapes, w, h, ink)}</g>
    <rect width="${w}" height="${h}" filter="url(#grain)" fill="${ink}" opacity="0.16"/>
    <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-width="10"
          opacity="0.35"/>
    <text x="${w / 2}" y="${h - 46}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="${Math.round(w * 0.035)}" letter-spacing="6" fill="${ink}" opacity="0.75">
      ${caption} · REPLACE ME
    </text>
    ${PLACEHOLDER_STAMP(w * 0.06, h * 0.06, -6)}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Character cut-out placeholders                                              */
/* -------------------------------------------------------------------------- */

/**
 * ORIGINAL abstract silhouettes. These deliberately do not reproduce any
 * character's actual design — they are stand-ins with one distinguishing
 * shape each, so the layout and scale relationships can be judged honestly.
 */
const CHARACTER_SPECS = [
  { file: "speedwagon.svg", name: "SPEEDWAGON", part: "PART 1", accent: "#E8743B", feature: "tophat" },
  { file: "wamuu.svg", name: "WAMUU", part: "PART 2", accent: "#4FA3D1", feature: "horns" },
  { file: "polnareff.svg", name: "POLNAREFF", part: "PART 3", accent: "#8E97A8", feature: "flattop" },
  { file: "okuyasu.svg", name: "OKUYASU", part: "PART 4", accent: "#7B5EA7", feature: "cap" },
  { file: "doppio.svg", name: "DOPPIO", part: "PART 5", accent: "#E0799B", feature: "softcap" },
  { file: "pucci.svg", name: "PUCCI", part: "PART 6", accent: "#4E9E7E", feature: "collar" },
];

const HEAD = `M 260 178 c 74 0 126 56 126 138 c 0 96 -56 156 -126 156 s -126 -60 -126 -156 c 0 -82 52 -138 126 -138 Z`;
const SHOULDERS = `M 62 700 v -92 c 0 -84 74 -128 158 -142 h 80 c 84 14 158 58 158 142 v 92 Z`;

function characterFeature(kind, accent) {
  switch (kind) {
    case "tophat":
      return `
        <rect x="120" y="150" width="280" height="26" rx="8" fill="${accent}"/>
        <rect x="176" y="46" width="168" height="112" rx="8" fill="${accent}"/>
        <rect x="176" y="128" width="168" height="30" fill="#242326" opacity="0.55"/>`;
    case "horns":
      return `
        <path d="M 132 214 q -46 -96 6 -160 q 30 74 62 104 Z" fill="${accent}"/>
        <path d="M 388 214 q 46 -96 -6 -160 q -30 74 -62 104 Z" fill="${accent}"/>
        <rect x="132" y="196" width="256" height="34" rx="17" fill="${accent}"/>`;
    case "flattop":
      return `<rect x="130" y="42" width="260" height="150" rx="14" fill="${accent}"/>`;
    case "cap":
      return `
        <path d="M 132 190 q 0 -130 128 -130 q 128 0 128 130 Z" fill="${accent}"/>
        <path d="M 260 190 h 176 q 34 0 34 30 q 0 24 -40 24 h -170 Z" fill="${accent}"/>
        <circle cx="260" cy="96" r="18" fill="#242326" opacity="0.5"/>`;
    case "softcap":
      return `
        <path d="M 128 206 q 4 -140 132 -140 q 128 0 132 140 q -60 -56 -132 -56 q -72 0 -132 56 Z"
              fill="${accent}"/>
        <circle cx="260" cy="80" r="22" fill="${accent}"/>`;
    case "collar":
    default:
      return `
        <path d="M 138 210 q 8 -124 122 -124 q 114 0 122 124 q -50 -54 -122 -54 q -72 0 -122 54 Z"
              fill="${accent}"/>
        <path d="M 214 470 l 46 78 l 46 -78 l 46 26 v 66 h -184 v -66 Z" fill="#FBF7F1"/>
        <rect x="250" y="514" width="20" height="56" rx="6" fill="${accent}"/>`;
  }
}

function buildCharacter(spec) {
  const { name, part, accent, feature } = spec;
  const W = 520;
  const H = 760;
  const silhouette = `${SHOULDERS} ${HEAD}`;

  return svg(
    W,
    H,
    `
    <defs>
      ${GRAIN("grain", 1, 0.22)}
      <filter id="shadow" x="-25%" y="-25%" width="160%" height="160%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#242326" flood-opacity="0.35"/>
      </filter>
      <clipPath id="body"><path d="${silhouette}"/></clipPath>
    </defs>

    <!-- die-cut sticker: white border painted under the fill -->
    <g filter="url(#shadow)" paint-order="stroke fill" stroke="#FFFFFF" stroke-width="26"
       stroke-linejoin="round">
      <path d="${silhouette}" fill="${accent}"/>
      ${characterFeature(feature, accent)}
    </g>

    <g clip-path="url(#body)">
      <rect width="${W}" height="${H}" filter="url(#grain)" fill="#242326" opacity="0.2"/>
      <path d="M 0 ${H * 0.55} Q ${W * 0.5} ${H * 0.44} ${W} ${H * 0.58} V ${H} H 0 Z"
            fill="#242326" opacity="0.14"/>
    </g>

    <!-- name plate -->
    <g transform="translate(${W * 0.5} ${H - 74})">
      <rect x="-176" y="-34" width="352" height="74" rx="8" fill="#FBF7F1" stroke="#242326"
            stroke-width="5"/>
      <text x="0" y="4" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
            font-size="27" font-weight="700" letter-spacing="2" fill="#242326">${name}</text>
      <text x="0" y="28" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
            font-size="13" letter-spacing="5" fill="#7D7885">${part} · PLACEHOLDER ART</text>
    </g>`,
  );
}

/* -------------------------------------------------------------------------- */

const photos = PHOTO_SPECS.map((s) => write(`public/assets/photos/${s.file}`, buildPhoto(s)));
const characters = CHARACTER_SPECS.map((s) =>
  write(`public/assets/characters/${s.file}`, buildCharacter(s)),
);

console.log(`Generated ${photos.length} photo placeholders:`);
photos.forEach((p) => console.log(`  ${p}`));
console.log(`Generated ${characters.length} character placeholders:`);
characters.forEach((p) => console.log(`  ${p}`));
