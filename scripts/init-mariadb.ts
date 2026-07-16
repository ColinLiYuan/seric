/**
 * Initialize MariaDB: create database + tables + seed data
 * Usage: npx tsx scripts/init-mariadb.ts
 */
import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

const DB_HOST = '127.0.0.1';
const DB_PORT = 3306;
const DB_USER = 'root';
const DB_PASS = '123456';
const DB_NAME = 'seric';

async function main() {
  // Connect without database first to create it
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    multipleStatements: true,
  });

  console.log('Connected to MariaDB');

  // Create database
  await conn.execute(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`Database '${DB_NAME}' ready`);

  // Switch to seric database
  await conn.execute(`USE \`${DB_NAME}\``);

  // Read and execute init.sql
  const sqlPath = path.join(process.cwd(), '..', 'seric-interface', 'sql', 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  // Remove the CREATE DATABASE / USE lines since we already handled that
  const sqlClean = sql
    .replace(/CREATE DATABASE IF NOT EXISTS.*?;/g, '')
    .replace(/USE seric;/g, '');

  console.log('Executing SQL script...');
  await conn.query(sqlClean);
  console.log('SQL executed successfully!');

  // Verify
  const [cats] = await conn.execute('SELECT COUNT(*) as cnt FROM categories') as any;
  const [prods] = await conn.execute('SELECT COUNT(*) as cnt FROM products') as any;
  const [specs] = await conn.execute('SELECT COUNT(*) as cnt FROM specs') as any;
  console.log(`\nVerification:`);
  console.log(`  categories: ${cats[0].cnt}`);
  console.log(`  products:   ${prods[0].cnt}`);
  console.log(`  specs:      ${specs[0].cnt}`);

  await conn.end();
  console.log('\nDone! Database initialized successfully.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
