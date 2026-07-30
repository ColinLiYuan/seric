import mysql from 'mysql2/promise';

async function main() {
  const c = await mysql.createConnection({ host: '127.0.0.1', port: 3306, user: 'root', password: '123456', database: 'seric' });
  await c.execute(`CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) DEFAULT '',
    email VARCHAR(200) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    company VARCHAR(200) DEFAULT '',
    country VARCHAR(100) DEFAULT '',
    subject VARCHAR(300) DEFAULT '',
    message TEXT,
    product_slug VARCHAR(300) DEFAULT '',
    source_url VARCHAR(500) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  console.log('inquiries table created');
  const [t]: any = await c.execute('SHOW TABLES');
  console.log('Tables:', t.map((x: any) => Object.values(x)[0]));
  await c.end();
}
main();
