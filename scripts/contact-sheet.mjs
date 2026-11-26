/**
 * Build labelled contact sheets + a JSON metadata inventory for every folder in
 * `RefrenceImages/`, so the whole asset pack can be inspected visually and
 * programmatically (dimensions, alpha, dominant colours) without opening
 * hundreds of multi-megabyte PNGs one at a time.
 *
 *   node scripts/contact-sheet.mjs
 *
 * Output: docs/contact-sheets/<folder>.jpg  +  docs/asset-inventory.json
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../RefrenceImages/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT = new URL('../docs/contact-sheets/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const TILE = 260;
const COLS = 6;
const PAD = 10;
const LABEL_H = 26;

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collect(full)));
    } else if (IMAGE_EXT.has(`.${entry.name.split('.').pop().toLowerCase()}`)) {
      files.push(full);
    }
  }
  return files;
}

/** Average colour of the visible (non-transparent) pixels, for palette notes. */
async function averageColour(buffer) {
  const { data, info } = await sharp(buffer)
    .resize(32, 32, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0;
  let g = 0;
  let b = 0;
  const n = info.width * info.height;
  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const hex = (v) => Math.round(v / n).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

async function sheetFor(folderName, files) {
  const rows = Math.ceil(files.length / COLS);
  const width = COLS * (TILE + PAD) + PAD;
  const height = rows * (TILE + LABEL_H + PAD) + PAD;

  const tiles = [];
  const inventory = [];

  for (const [index, file] of files.entries()) {
    const buffer = await sharp(file).rotate().toBuffer();
    const meta = await sharp(buffer).metadata();
    const hasAlpha = Boolean(meta.hasAlpha);
    // Measure real transparency: how much of the alpha channel is see-through.
    let transparentShare = null;
    if (hasAlpha) {
      const { data, info } = await sharp(buffer)
        .resize(48, 48, { fit: 'inside' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      let clear = 0;
      for (let i = 3; i < data.length; i += info.channels) if (data[i] < 16) clear += 1;
      transparentShare = Number((clear / (info.width * info.height)).toFixed(2));
    }
    inventory.push({
      file: file.slice(ROOT.replace(/[\\/]+$/, '').length + 1).replace(/\\/g, '/'),
      width: meta.width,
      height: meta.height,
      format: meta.format,
      hasAlpha,
      transparentShare,
      averageColour: await averageColour(buffer),
    });

    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const left = PAD + col * (TILE + PAD);
    const top = PAD + row * (TILE + LABEL_H + PAD);

    const thumb = await sharp(buffer)
      .resize(TILE, TILE, { fit: 'contain', background: { r: 236, g: 232, b: 222, alpha: 1 } })
      .png()
      .toBuffer();

    tiles.push({ input: thumb, left, top });
    tiles.push({
      input: Buffer.from(
        `<svg width="${TILE}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
           <rect width="100%" height="100%" fill="#1b1b1e"/>
           <text x="4" y="17" font-family="monospace" font-size="13" fill="#ffffff">#${index}</text>
           <text x="44" y="17" font-family="monospace" font-size="13" fill="#ffd479">${esc(
             basename(file).slice(0, 30),
           )}</text>
         </svg>`,
      ),
      left,
      top: top + TILE,
    });
  }

  await sharp({
    create: { width, height, channels: 4, background: { r: 27, g: 27, b: 30, alpha: 1 } },
  })
    .composite(tiles)
    .jpeg({ quality: 82 })
    .toFile(join(OUT, `${folderName}.jpg`));

  return inventory;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`ROOT=${ROOT}`);
  const rootEntries = await readdir(ROOT, { withFileTypes: true });
  console.log(`rootEntries=${rootEntries.length}`);
  const inventory = {};

  for (const entry of rootEntries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const files = await collect(join(ROOT, entry.name));
    if (files.length === 0) continue;
    console.log(`${entry.name}: ${files.length} images`);
    inventory[entry.name] = await sheetFor(entry.name.replace(/[\\/:*?"<>|]/g, '_'), files);
  }

  await writeFile(join(OUT, '..', 'asset-inventory.json'), JSON.stringify(inventory, null, 2));
  console.log(`\nWrote ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
