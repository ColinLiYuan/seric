import mysql from 'mysql2/promise';
import * as fs from 'fs';

async function main() {
  const c = await mysql.createConnection({ host: '127.0.0.1', port: 3306, user: 'root', password: '123456', database: 'seric' });
  const out: string[] = [];

  out.push('-- seric init script');
  out.push('CREATE DATABASE IF NOT EXISTS seric CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  out.push('USE seric;');
  out.push('');

  // Products table
  out.push('DROP TABLE IF EXISTS attachments;');
  out.push('DROP TABLE IF EXISTS inquiries;');
  out.push('DROP TABLE IF EXISTS blogs;');
  out.push('DROP TABLE IF EXISTS users;');
  out.push('DROP TABLE IF EXISTS products;');
  out.push('');

  const [cols]: any = await c.execute('SHOW CREATE TABLE products');
  out.push(cols[0]['Create Table'] + ';');

  // Export products data
  function esc(v: any) { if (v == null) return 'NULL'; return `'${String(v).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}'`; }
  const [rows]: any = await c.execute('SELECT * FROM products ORDER BY id');
  if (rows.length) {
    const fields = Object.keys(rows[0]);
    out.push('');
    for (const r of rows) {
      out.push(`INSERT INTO products (${fields.join(',')}) VALUES (${fields.map(f => esc(r[f])).join(',')});`);
    }
  }

  fs.writeFileSync('../seric-interface/sql/init.sql', out.join('\n'));
  console.log('Products:', rows.length);
  // Other tables will be created by JPA ddl-auto:update

  await c.end();
}
main();
