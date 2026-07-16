import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  const [rows]: any = await c.execute(
    "SELECT images FROM products WHERE images IS NOT NULL AND images != '' AND images != '[]'"
  );

  const all = new Set<string>();
  for (const row of rows) {
    try { JSON.parse(row.images).forEach((i: string) => all.add(i)); } catch {}
  }

  const IMG_DIR = path.join(process.cwd(), 'public', 'images');
  let miss = 0;
  for (const img of all) {
    const fn = img.split('/').pop()!;
    if (!fs.existsSync(path.join(IMG_DIR, fn))) {
      console.log('MISS:', fn);
      miss++;
    }
  }

  // Also check main image column
  const [prods]: any = await c.execute("SELECT image FROM products WHERE image != ''");
  for (const p of prods) {
    const fn = p.image.split('/').pop()!;
    if (fn && !fs.existsSync(path.join(IMG_DIR, fn))) {
      console.log('MISS main:', fn);
      miss++;
    }
  }

  // And description_en for img tags
  const [descs]: any = await c.execute("SELECT description_en FROM products WHERE description_en LIKE '%/images/%'");
  const imgRegex = /\/images\/([^"]+)/g;
  for (const d of descs) {
    if (!d.description_en) continue;
    let m;
    while ((m = imgRegex.exec(d.description_en)) !== null) {
      const fn = m[1];
      if (!fs.existsSync(path.join(IMG_DIR, fn))) {
        console.log('MISS desc:', fn);
        miss++;
      }
    }
  }

  console.log('\nTotal missing:', miss);
  await c.end();
}

main().catch(err => console.error(err.message));
