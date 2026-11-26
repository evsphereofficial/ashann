/**
 * Crop the first row of each contact sheet into a uniquely-marked PNG so the
 * visual asset review can verify folder contents tile-by-tile.
 *
 *   node scripts/make-tiles.mjs
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = new URL('../docs/tmp-sheets/', import.meta.url);
const SHEETS = new URL('../docs/contact-sheets/', import.meta.url);

const targets = [
  ['Okuyasu.jpg', 'f-ok.png', 'OKUYASU'],
  ['Doppio.jpg', 'f-do.png', 'DOPPIO'],
  ['Enrico Pucci.jpg', 'f-pu.png', 'PUCCI'],
  ['SpeedWagon.jpg', 'f-sw.png', 'SPEEDWAGON'],
  ['Wamuu.jpg', 'f-wa.png', 'WAMUU'],
  ['Polnareff.jpg', 'f-po.png', 'POLNAREFF'],
  ['RefrenceScrapBooks.jpg', 'f-rs.png', 'REF-SCRAPBOOKS'],
  ['JojoStyledScrapBookRefrences.jpg', 'f-js.png', 'JOJO-STYLED'],
  ['ScrapBookRefrences.jpg', 'f-sc.png', 'SCRAPBOOK-REFS'],
  ['Background.jpg', 'f-bg.png', 'BACKGROUND'],
  ['Elements.jpg', 'f-el.png', 'ELEMENTS'],
];

await mkdir(OUT, { recursive: true });

for (const [sheet, out, tag] of targets) {
  const banner = Buffer.from(
    `<svg width="1100" height="20" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="1100" height="20" fill="#ff00ff"/>` +
      `<text x="6" y="15" font-family="monospace" font-size="14" fill="#000">${tag}</text>` +
      `</svg>`,
  );
  await sharp(fileURLToPath(new URL(sheet, SHEETS)))
    .resize({ width: 1100 })
    .composite([{ input: banner, top: 0, left: 0 }])
    .png()
    .toFile(fileURLToPath(new URL(out, OUT)));
  console.log(out);
}
