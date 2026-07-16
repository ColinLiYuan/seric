/**
 * Download all missing product gallery images from CDN
 */
import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    https.get(url, (res: any) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  const [rows]: any = await c.execute(
    "SELECT images FROM products WHERE images IS NOT NULL AND images != '' AND images != '[]'"
  );

  // Collect all unique image paths
  const allImages = new Set<string>();
  for (const row of rows) {
    try {
      const arr = JSON.parse(row.images);
      arr.forEach((img: string) => allImages.add(img));
    } catch {}
  }
  console.log('Total unique gallery refs:', allImages.size);

  // Find missing files
  const IMG_DIR = path.join(process.cwd(), 'public', 'images');
  const missing: string[] = [];
  for (const img of allImages) {
    const filename = img.split('/').pop()!;
    const dest = path.join(IMG_DIR, filename);
    if (!fs.existsSync(dest)) {
      missing.push(filename);
    }
  }
  console.log('Missing files:', missing.length);

  // Download missing
  let dl = 0, fail = 0;
  for (let i = 0; i < missing.length; i++) {
    const fn = missing[i];
    const dest = path.join(IMG_DIR, fn);
    const urls = [
      `https://img.hydra-pumps.com/photo/${fn}`,
      `https://img.hydra-pumps.com/test/hydra-pumps.com/photo/${fn}`,
    ];

    let ok = false;
    for (const url of urls) {
      if (await downloadFile(url, dest)) { ok = true; break; }
    }

    if (ok) { dl++; process.stdout.write('.'); }
    else { fail++; process.stdout.write('x'); }

    if ((i + 1) % 50 === 0) console.log(` ${i + 1}/${missing.length}`);
    // Small delay
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\n\nDone! Downloaded: ${dl}, Failed: ${fail}`);
  await c.end();
}

main().catch(err => console.error(err.message));
