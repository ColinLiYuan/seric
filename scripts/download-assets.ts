/**
 * Downloads all remote assets (images from img.hydra-pumps.com and style.hydra-pumps.com)
 * to local public/ directory so the site can run fully offline.
 *
 * Usage: npx tsx scripts/download-assets.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');
const PUBLIC_FLAGS = path.join(process.cwd(), 'public', 'flags');
const SRC_DIR = path.join(process.cwd(), 'src');

// Ensure output directories exist
fs.mkdirSync(PUBLIC_IMAGES, { recursive: true });
fs.mkdirSync(PUBLIC_FLAGS, { recursive: true });

// --- Step 1: Extract all unique image URLs from source files ---

function findFiles(dir: string, exts: string[]): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, exts));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const urlRegex = /https?:\/\/(?:img\.hydra-pumps\.com|style\.hydra-pumps\.com)\/[^\s"')\]]+/g;
const urls = new Set<string>();

const files = findFiles(SRC_DIR, ['.ts', '.tsx', '.js']);
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(urlRegex);
  if (matches) {
    for (const m of matches) {
      urls.add(m);
    }
  }
}

console.log(`Found ${urls.size} unique URLs in source files`);

// --- Step 2: Download each URL ---

function download(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      // Handle redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        console.warn(`  Failed: ${url} (status ${res.statusCode})`);
        resolve();
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      console.warn(`  Error downloading ${url}: ${err.message}`);
      resolve();
    });
  });
}

function urlToFilename(url: string): string {
  // Extract filename from URL (everything after the last /)
  const parts = url.split('/');
  return parts[parts.length - 1];
}

async function downloadAll() {
  const urlList = Array.from(urls);
  let downloaded = 0;
  let skipped = 0;

  for (let i = 0; i < urlList.length; i++) {
    const url = urlList[i];
    const filename = urlToFilename(url);
    const destPath = path.join(PUBLIC_IMAGES, filename);

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${urlList.length}] SKIP (exists): ${filename}`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${urlList.length}] DOWNLOAD: ${filename}`);
    try {
      await download(url, destPath);
      downloaded++;
    } catch (err) {
      console.warn(`  Error: ${err}`);
    }

    // Small delay to avoid hammering the server
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Total: ${urlList.length}`);
}

// --- Step 3: Download flag images ---

// ISO country codes from i18n/config.ts
const FLAG_CODES = [
  'gb', 'fr', 'de', 'it', 'ru', 'es', 'pt', 'nl', 'gr',
  'jp', 'kr', 'ae', 'in', 'tr', 'id', 'vn', 'th', 'bd',
  'ir', 'pl', 'cn',
];

async function downloadFlags() {
  console.log(`\nDownloading ${FLAG_CODES.length} flag images...`);
  let flagDownloaded = 0;

  for (const code of FLAG_CODES) {
    const url = `https://flagcdn.com/w40/${code}.png`;
    const destPath = path.join(PUBLIC_FLAGS, `${code}.png`);

    if (fs.existsSync(destPath)) {
      console.log(`  SKIP (exists): ${code}.png`);
      continue;
    }

    console.log(`  DOWNLOAD: ${code}.png`);
    try {
      await download(url, destPath);
      flagDownloaded++;
    } catch (err) {
      console.warn(`  Error downloading flag ${code}: ${err}`);
    }
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`Flags done! Downloaded: ${flagDownloaded}`);
}

// --- Main ---
async function main() {
  console.log('Downloading assets from hydra-pumps.com...\n');
  await downloadAll();
  await downloadFlags();
  console.log('\nAll assets downloaded successfully!');
}

main().catch(console.error);
