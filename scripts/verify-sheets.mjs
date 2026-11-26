/**
 * Verify each contact sheet shows its own folder: compare the sheet's first
 * tile against every folder's first source image, report the best match.
 *
 *   node scripts/verify-sheets.mjs
 */
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../RefrenceImages/', import.meta.url));
const SHEETS = fileURLToPath(new URL('../docs/contact-sheets/', import.meta.url));

const IMAGE_EXT = /\.(png|jpg|jpeg|webp|gif|avif)$/i;

async function fp6(path, crop) {
  let pipeline = sharp(path);
  if (crop) pipeline = pipeline.extract({ left: 10, top: 10, width: 260, height: 260 });
  const { data } = await pipeline
    .resize(6, 6, { fit: 'contain', background: { r: 236, g: 232, b: 222, alpha: 1 } })
    .flatten({ background: '#ece8de' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
}

function dist(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i += 3) {
    d += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
  }
  return d;
}

const folders = (await readdir(ROOT, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

const refs = {};
for (const folder of folders) {
  const files = (await readdir(`${ROOT}${folder}`)).filter((n) => IMAGE_EXT.test(n)).sort();
  if (files.length) refs[folder] = await fp6(`${ROOT}${folder}/${files[0]}`);
}

for (const folder of folders) {
  try {
    const sheet = await fp6(`${SHEETS}${folder}.jpg`, true);
    let best = null;
    let bestDist = Infinity;
    for (const [name, ref] of Object.entries(refs)) {
      const d = dist(ref, sheet);
      if (d < bestDist) {
        bestDist = d;
        best = name;
      }
    }
    const flag = best === folder ? 'OK ' : 'MISMATCH';
    console.log(`${flag} ${folder.padEnd(32)} first tile -> ${best} (${bestDist})`);
  } catch {
    console.log(`SKIP ${folder} (no sheet)`);
  }
}
