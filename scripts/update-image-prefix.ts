import mysql from 'mysql2/promise';
import * as fs from 'fs';

const NEW_PREFIX = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  // Fix all: /images/xxx.jpg → NEW_PREFIX + xxx.jpg
  for (const col of ['image', 'images', 'description_en', 'description_zh']) {
    const [before]: any = await c.execute(
      `SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%/images/%'`
    );
    await c.execute(
      `UPDATE products SET ${col} = REPLACE(${col}, '/images/', '${NEW_PREFIX}') WHERE ${col} LIKE '%/images/%'`
    );
    const [after]: any = await c.execute(
      `SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%/images/%'`
    );
    console.log(`${col}: ${before[0].c} → ${after[0].c}`);
  }

  // 2. Export to JSON
  const [rows] = await c.execute('SELECT * FROM products ORDER BY id');
  fs.writeFileSync('src/data/products.json', JSON.stringify(rows, null, 2));
  console.log('\nExported', (rows as any[]).length, 'products to src/data/products.json');

  // Show sample
  const [s]: any = await c.execute('SELECT image, SUBSTR(images,1,200) as img FROM products LIMIT 1');
  console.log('\nSample:');
  console.log('  image:', s[0].image);
  console.log('  images:', s[0].img);

  await c.end();
  console.log('\nDone.');
}

main().catch(err => console.error(err.message));
