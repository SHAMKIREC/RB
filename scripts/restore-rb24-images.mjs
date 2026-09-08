import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const assetsDir = resolve('src/assets/images/services');
const partsDir = resolve('scripts/rb24-image-parts');

const images = {
  'ceilings_stretch_rb24.webp': 1,
  'ceilings_paint_rb24.webp': 1,
  'walls_decor_rb24.webp': 2,
  'walls_slopes_rb24.webp': 2,
  'turnkey_capital_rb24.webp': 3,
};

await mkdir(assetsDir, { recursive: true });

for (const [name, count] of Object.entries(images)) {
  let base64 = '';
  for (let i = 1; i <= count; i += 1) {
    base64 += (await readFile(resolve(partsDir, `${name}.part${i}.txt`), 'utf8')).trim();
  }
  const target = resolve(assetsDir, name);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(base64, 'base64'));
}
