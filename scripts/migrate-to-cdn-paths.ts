import mysql from 'mysql2/promise';
import * as fs from 'fs';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  for (const col of ['image', 'images', 'description_en', 'description_zh']) {
    const [b]: any = await c.execute(
      `SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%/images/%'`
    );
    console.log(`${col}: ${b[0].c} rows with /images/`);

    await c.execute(
      `UPDATE products SET ${col} = REPLACE(${col}, '/images/', 'products/') WHERE ${col} LIKE '%/images/%'`
    );

    const [a]: any = await c.execute(
      `SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%/images/%'`
    );
    console.log(`  → ${a[0].c} remaining`);
  }

  // Export to JSON
  const [rows] = await c.execute('SELECT * FROM products ORDER BY id');
  fs.writeFileSync('src/data/products.json', JSON.stringify(rows, null, 2));

  const r = rows as any[];
  console.log('\nSample:');
  console.log('  image:', r[0].image);
  console.log('  images:', r[0].images?.substring(0, 200));
  console.log('\nExported', r.length, 'products');
  await c.end();
}

main().catch(err => console.error(err.message));
