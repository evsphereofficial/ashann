/**
 * Build the web asset pipeline from the supplied `RefrenceImages/` pack.
 *
 * The raw pack is multi-megabyte PNG/JPG; this script produces optimised
 * WebP files under `public/assets/` and writes a typed manifest
 * (`src/content/assets.ts`) so the app never hard-codes a file name.
 *
 *   node scripts/build-assets.mjs
 *
 * Outputs
 *   public/assets/characters/<id>/<n>.webp   5 cut-outs per character
 *   public/assets/elements/<n>.webp          scrapbook decorations
 *   public/assets/backgrounds/<n>.webp       textures / papers
 *   src/content/assets.ts                    manifest (regenerated)
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SRC = 'RefrenceImages';
const OUT = 'public/assets';

const IMAGE_EXT = /\.(png|jpg|jpeg|webp|gif|avif)$/i;

/** Folder in the pack → manifest key. */
const CHARACTER_FOLDERS = {
  SpeedWagon: 'speedwagon',
  Wamuu: 'wamuu',
  Polnareff: 'polnareff',
  Okuyasu: 'okuyasu',
  Doppio: 'doppio',
  'Enrico Pucci': 'pucci',
};

const path = (...parts) => join(ROOT, ...parts);
const outPath = (...parts) => join(ROOT, OUT, ...parts);

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/** True when the PNG actually has see-through pixels (a real cut-out). */
async function hasTransparency(file) {
  const { data, info } = await sharp(file)
    .resize(48, 48, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let clear = 0;
  for (let i = 3; i < data.length; i += info.channels) if (data[i] < 16) clear += 1;
  return clear / (info.width * info.height) > 0.12;
}

async function saveWebp(source, destination, { maxWidth, withAlpha }) {
  let pipeline = sharp(source).rotate();
  const meta = await sharp(source).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (longest > maxWidth) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  await pipeline
    .webp(withAlpha ? { quality: 82, alphaQuality: 90 } : { quality: 78, mozjpeg: true })
    .toFile(destination);
  return (await stat(destination)).size;
}

const manifest = { characters: {}, elements: [], backgrounds: [] };
let totalIn = 0;
let totalOut = 0;

/* ── characters ──────────────────────────────────────────────────────────── */
for (const [folder, id] of Object.entries(CHARACTER_FOLDERS)) {
  const dir = path(SRC, folder);
  const files = await listImages(dir);
  const destDir = outPath('characters', id);
  await mkdir(destDir, { recursive: true });

  const entries = [];
  for (const [index, file] of files.entries()) {
    const source = join(dir, file);
    const cutout = await hasTransparency(source);
    const name = `${index}.webp`;
    const destination = join(destDir, name);
    totalIn += (await stat(source)).size;
    totalOut += await saveWebp(source, destination, { maxWidth: 1100, withAlpha: true });

    const meta = await sharp(destination).metadata();
    entries.push({
      src: `/assets/characters/${id}/${name}`,
      width: meta.width,
      height: meta.height,
      cutout,
      source: file,
    });
  }
  manifest.characters[id] = entries;
  console.log(`characters/${id}: ${entries.length} images`);
}

/* ── elements ────────────────────────────────────────────────────────────── */
{
  const dir = path(SRC, 'Elements');
  const files = await listImages(dir);
  await mkdir(outPath('elements'), { recursive: true });
  for (const [index, file] of files.entries()) {
    const source = join(dir, file);
    const name = `${String(index).padStart(2, '0')}.webp`;
    totalIn += (await stat(source)).size;
    totalOut += await saveWebp(source, join(outPath('elements'), name), {
      maxWidth: 720,
      withAlpha: true,
    });
    manifest.elements.push(`/assets/elements/${name}`);
  }
  console.log(`elements: ${files.length} images`);
}

/* ── backgrounds ─────────────────────────────────────────────────────────── */
{
  const dir = path(SRC, 'Background');
  const files = await listImages(dir);
  await mkdir(outPath('backgrounds'), { recursive: true });
  for (const [index, file] of files.entries()) {
    const source = join(dir, file);
    const name = `${String(index).padStart(2, '0')}.webp`;
    totalIn += (await stat(source)).size;
    totalOut += await saveWebp(source, join(outPath('backgrounds'), name), {
      maxWidth: 1400,
      withAlpha: false,
    });
    manifest.backgrounds.push(`/assets/backgrounds/${name}`);
  }
  console.log(`backgrounds: ${files.length} images`);
}

/* ── manifest ────────────────────────────────────────────────────────────── */
const header = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Run \`node scripts/build-assets.mjs\` after changing anything in
 * \`RefrenceImages/\`. Every path here is a real optimised file under
 * \`public/assets/\`; \`cutout\` marks art with genuine transparency (safe to
 * layer over paper as a sticker), non-cut-outs are full-bleed panels.
 */
`;

const body = `export interface AssetEntry {
  src: string;
  width: number;
  height: number;
  cutout: boolean;
  source: string;
}

export interface AssetManifest {
  characters: Record<string, AssetEntry[]>;
  elements: string[];
  backgrounds: string[];
}

export const assets: AssetManifest = ${JSON.stringify(manifest, null, 2)};
`;

await writeFile(path('src', 'content', 'assets.ts'), header + '\n' + body);

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\n${mb(totalIn)} MB in → ${mb(totalOut)} MB out`);
console.log('Wrote src/content/assets.ts');
