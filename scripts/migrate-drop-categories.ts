import mysql from 'mysql2/promise';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  // Step 1: Add category_slug column
  await c.execute(
    "ALTER TABLE products ADD COLUMN category_slug VARCHAR(100) DEFAULT '' AFTER slug"
  );
  console.log('Added category_slug column');

  // Step 2: Populate category_slug from categories join
  const [rows]: any = await c.execute(
    'SELECT p.id, c.slug FROM products p JOIN categories c ON p.category_id = c.id'
  );
  for (const row of rows) {
    await c.execute('UPDATE products SET category_slug = ? WHERE id = ?', [row.slug, row.id]);
  }
  console.log('Migrated', rows.length, 'product category slugs');

  // Step 3: Drop FK and column, then drop categories table
  await c.execute('ALTER TABLE products DROP FOREIGN KEY products_ibfk_1');
  await c.execute('ALTER TABLE products DROP COLUMN category_id');
  await c.execute('DROP TABLE IF EXISTS specs');
  await c.execute('DROP TABLE IF EXISTS categories');
  console.log('Dropped categories table and FK');

  // Verify
  const [cols]: any = await c.execute('SHOW COLUMNS FROM products');
  console.log('Products columns:', cols.map((x: any) => x.Field).join(', '));

  const [cnt]: any = await c.execute('SELECT COUNT(*) as c FROM products');
  console.log('Products count:', cnt[0].c);

  const [sample]: any = await c.execute('SELECT id, slug, category_slug FROM products LIMIT 3');
  sample.forEach((r: any) => console.log(' ', r.id, r.slug, '->', r.category_slug));

  await c.end();
  console.log('Done.');
}

main().catch(err => console.error(err.message));
