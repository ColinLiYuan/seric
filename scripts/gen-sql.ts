import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  const out: string[] = [];
  out.push('-- ============================================');
  out.push('-- seric database init script');
  out.push('-- Generated from MariaDB');
  out.push('-- ============================================');
  out.push('');
  out.push('CREATE DATABASE IF NOT EXISTS seric CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  out.push('USE seric;');
  out.push('');
  out.push('DROP TABLE IF EXISTS products;');
  out.push('');
  out.push('CREATE TABLE products (');
  out.push('  id INT AUTO_INCREMENT PRIMARY KEY,');
  out.push('  slug VARCHAR(300) NOT NULL UNIQUE,');
  out.push('  category_slug VARCHAR(100) DEFAULT \'\',');

  const locales = ['en','zh','fr','de','it','ru','es','pt','nl','el','ja','ko','ar','hi','tr','id','vi','th','bn','fa','pl'];
  for (const loc of locales) out.push(`  name_${loc} VARCHAR(500) DEFAULT '',`);
  out.push('  image VARCHAR(500) DEFAULT \'\',');
  out.push('  images TEXT,');
  out.push('  price VARCHAR(50) DEFAULT \'\',');
  out.push('  featured TINYINT(1) DEFAULT 0,');
  out.push('  top_selling TINYINT(1) DEFAULT 0,');
  out.push('  description_en TEXT,');
  out.push('  description_zh TEXT,');
  out.push('  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,');
  out.push('  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  out.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
  out.push('');

  function esc(val: any): string {
    if (val === null || val === undefined) return 'NULL';
    return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
  }

  // Export all products
  const cols = ['slug', 'category_slug', ...locales.map(l => `name_${l}`), 'image', 'images', 'price', 'featured', 'top_selling', 'description_en', 'description_zh'];
  const [rows]: any = await c.execute(`SELECT ${cols.join(', ')} FROM products ORDER BY id`);

  out.push('-- ============================================');
  out.push(`-- Data: ${rows.length} products`);
  out.push('-- ============================================');
  for (const r of rows) {
    const vals = cols.map(col => esc(r[col]));
    out.push(`INSERT INTO products (${cols.join(', ')}) VALUES (${vals.join(', ')});`);
  }
  out.push('');

  const dest = path.join(process.cwd(), '..', 'seric-interface', 'sql', 'init.sql');
  fs.writeFileSync(dest, out.join('\n'));
  console.log(`Generated ${dest}`);
  console.log(`  products: ${rows.length}`);

  await c.end();
}

main().catch(err => console.error(err.message));
