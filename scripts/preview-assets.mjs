/**
 * Preview sheet of the optimised WebP outputs, to eyeball quality after a
 * rebuild:  node scripts/preview-assets.mjs  →  docs/asset-preview.jpg
 */
import { readdir } from 'node:fs/promises';
import sharp from 'sharp';

const files = [];
for (const character of ['speedwagon', 'wamuu', 'polnareff', 'okuyasu', 'doppio', 'pucci']) {
  for (const file of await readdir(`public/assets/characters/${character}`)) {
    files.push([`public/assets/characters/${character}/${file}`, `${character}/${file}`]);
  }
}
for (const file of (await readdir('public/assets/elements')).slice(0, 12)) {
  files.push([`public/assets/elements/${file}`, `el/${file}`]);
}
for (const file of await readdir('public/assets/backgrounds')) {
  files.push([`public/assets/backgrounds/${file}`, `bg/${file}`]);
}

const TILE = 200;
const COLS = 7;
const PAD = 8;
const LABEL = 22;
const rows = Math.ceil(files.length / COLS);
const tiles = [];

for (const [index, [file, label]] of files.entries()) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const left = PAD + col * (TILE + PAD);
  const top = PAD + row * (TILE + LABEL + PAD);
  tiles.push({
    input: await sharp(file)
      .resize(TILE, TILE, { fit: 'contain', background: { r: 236, g: 232, b: 222, alpha: 1 } })
      .png()
      .toBuffer(),
    left,
    top,
  });
  tiles.push({
    input: Buffer.from(
      `<svg width="${TILE}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg">` +
        `<rect width="100%" height="100%" fill="#1b1b1e"/>` +
        `<text x="3" y="15" font-family="monospace" font-size="12" fill="#ffd479">${label}</text>` +
        `</svg>`,
    ),
    left,
    top: top + TILE,
  });
}

await sharp({
  create: {
    width: COLS * (TILE + PAD) + PAD,
    height: rows * (TILE + LABEL + PAD) + PAD,
    channels: 4,
    background: { r: 27, g: 27, b: 30, alpha: 1 },
  },
})
  .composite(tiles)
  .jpeg({ quality: 85 })
  .toFile('docs/asset-preview.jpg');

console.log(`Wrote docs/asset-preview.jpg (${files.length} files)`);
