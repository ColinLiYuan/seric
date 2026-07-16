import * as https from 'https';
import * as fs from 'fs';
import mysql from 'mysql2/promise';

function get(url: string): Promise<string> {
  return new Promise((r, j) => https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => r(d));
  }).on('error', j));
}
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  const db = await mysql.createConnection({ host: '127.0.0.1', port: 3306, user: 'root', password: '123456', database: 'seric' });
  const [rows]: any = await db.execute('SELECT id, slug FROM products WHERE description_en IS NULL OR LENGTH(description_en) < 500 ORDER BY LENGTH(description_en)');
  console.log('Fixing', rows.length, 'products...');

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]; const pid = r.slug.match(/^\d+/)![0];
    try {
      const html = await get(`https://www.hydra-pumps.com/sale-${pid}-${r.slug}.html`);
      const di = html.indexOf('Product Description'); let desc = '';
      if (di > 0) {
        const ei = html.indexOf('similar products', di);
        desc = html.substring(di, ei > 0 ? ei : di + 10000)
          .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').trim()
          .replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//g, 'products/')
          .replace(/\/\/style\.hydra-pumps\.com\/images\//g, 'products/');
      }
      await db.execute('UPDATE products SET description_en = ? WHERE id = ?', [desc, r.id]);
      console.log(`[${i + 1}/${rows.length}] ${r.slug.substring(0, 50)} (${desc.length} chars)`);
    } catch { console.log(`[${i + 1}/${rows.length}] FAILED`); }
    await sleep(200);
  }

  const [all] = await db.execute('SELECT * FROM products ORDER BY id');
  fs.writeFileSync('src/data/products.json', JSON.stringify(all, null, 2));
  console.log('Exported', (all as any[]).length, 'products');
  await db.end();
}

main().catch(err => console.error(err));
