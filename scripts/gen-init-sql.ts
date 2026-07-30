import mysql from 'mysql2/promise';
import * as fs from 'fs';

async function main() {
  const c = await mysql.createConnection({ host: '127.0.0.1', port: 3306, user: 'root', password: '123456', database: 'seric' });
  const out: string[] = [
    'CREATE DATABASE IF NOT EXISTS seric CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;',
    'USE seric;', ''
  ];

  const tables = ['products', 'inquiries', 'users', 'blogs', 'attachments'];
  for (const t of tables) {
    const [crt]: any = await c.execute(`SHOW CREATE TABLE ${t}`);
    let ddl = crt[0]['Create Table'];
    ddl = ddl.replace(/ AUTO_INCREMENT=\d+/g, ' AUTO_INCREMENT=1').replace(/utf8mb4_uca1400_ai_ci/gi, 'utf8mb4_unicode_ci').replace(/utf8mb4_0900_ai_ci/gi, 'utf8mb4_unicode_ci');
    out.push(ddl + ';');
    out.push('');

    const [data]: any = await c.execute(`SELECT * FROM ${t} ORDER BY id`);
    if (data.length) {
      const fields = Object.keys(data[0]);
      for (const r of data) {
        const vals = fields.map(f => {
          const v = r[f];
          if (v === null || v === undefined) return 'NULL';
          if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
          return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
        });
        out.push(`INSERT INTO ${t} (${fields.join(',')}) VALUES (${vals.join(',')});`);
      }
      out.push('');
    }
  }

  fs.writeFileSync('../seric-interface/sql/init.sql', out.join('\n'));
  console.log('Exported:', tables.join(', '), '| products:', (await c.execute('SELECT COUNT(*) as c FROM products'))[0][0].c);
  await c.end();
}
main();
