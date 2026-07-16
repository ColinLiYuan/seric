import mysql from 'mysql2/promise';
import * as fs from 'fs';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  // 1. First reset: all CDN URLs back to /images/ relative paths
  for (const col of ['image', 'images', 'description_en', 'description_zh']) {
    // Fix the new CDN prefix → /images/
    const [b1]: any = await c.execute(`SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev%'`);
    if (b1[0].c > 0) {
      await c.execute(`UPDATE products SET ${col} = REPLACE(${col}, '${CDN}/', '/images/') WHERE ${col} LIKE '%pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev%'`);
      console.log(`${col}: reset CDN → /images/ (${b1[0].c} rows)`);
    }

    // Fix broken https:/images/ → /images/
    const [b2]: any = await c.execute(`SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%https:/images/%'`);
    if (b2[0].c > 0) {
      await c.execute(`UPDATE products SET ${col} = REPLACE(${col}, 'https:/images/', '/images/') WHERE ${col} LIKE '%https:/images/%'`);
      console.log(`${col}: fixed https:/images/ (${b2[0].c} rows)`);
    }
  }

  // 2. Verify all columns are using /images/
  console.log('\n--- Final check ---');
  for (const col of ['image', 'images', 'description_en', 'description_zh']) {
    const [r]: any = await c.execute(`SELECT COUNT(*) as c FROM products WHERE ${col} NOT LIKE '/images/%' AND ${col} != ''`);
    console.log(`${col}: non-relative paths = ${r[0].c}`);
  }

  // Show sample
  const [s]: any = await c.execute('SELECT image, SUBSTR(images,1,200) as img FROM products LIMIT 2');
  console.log('\nSamples:');
  s.forEach((r: any) => console.log('  image:', r.image, '\n  images:', r.img, '\n'));

  // 3. Export to JSON
  const [rows] = await c.execute('SELECT * FROM products ORDER BY id');
  fs.writeFileSync('src/data/products.json', JSON.stringify(rows, null, 2));
  console.log('Exported', (rows as any[]).length, 'products to products.json');

  await c.end();
}

main().catch(err => console.error(err.message));
