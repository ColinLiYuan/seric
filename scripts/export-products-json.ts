import mysql from 'mysql2/promise';
import * as fs from 'fs';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });
  const [rows] = await c.execute('SELECT * FROM products ORDER BY id');
  fs.writeFileSync('src/data/products.json', JSON.stringify(rows, null, 2));
  console.log('Exported', (rows as any[]).length, 'products to src/data/products.json');
  await c.end();
}
main();
