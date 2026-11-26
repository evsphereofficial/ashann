/**
 * Find which source image each contact sheet's first tile came from, by
 * re-rendering every candidate through the same pipeline as contact-sheet.mjs
 * and comparing 6x6 fingerprints.
 *
 *   node scripts/verify-tiles.mjs
 */
import { readdir } from 'node:fs/promises';
import sharp from 'sharp';

const IMAGE_EXT = /\.(png|jpg|jpeg|webp|gif|avif)$/i;

async function sheetStyle(path) {
  const b = await sharp(path)
    .rotate()
    .resize(260, 260, { fit: 'contain', background: { r: 236, g: 232, b: 222, alpha: 1 } })
    .png()
    .toBuffer();
  const { data } = await sharp(b).resize(6, 6).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return data;
}

async function tileFp(sheet) {
  const { data } = await sharp(`docs/contact-sheets/${sheet}.jpg`)
    .extract({ left: 10, top: 10, width: 260, height: 260 })
    .resize(6, 6)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
}

const dist = (a, b) => {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]);
  return d;
};

for (const folder of ['SpeedWagon', 'Okuyasu', 'Polnareff', 'Wamuu', 'Enrico Pucci', 'Elements']) {
  const files = (await readdir(`RefrenceImages/${folder}`)).filter((n) => IMAGE_EXT.test(n)).sort();
  const tile = await tileFp(folder);
  const rows = [];
  for (const file of files) {
    rows.push([file, dist(await sheetStyle(`RefrenceImages/${folder}/${file}`), tile)]);
  }
  rows.sort((a, b) => a[1] - b[1]);
  console.log(
    folder.padEnd(15),
    rows.slice(0, 2).map((r) => `${r[0]} d=${r[1]}`).join(' | '),
  );
}
