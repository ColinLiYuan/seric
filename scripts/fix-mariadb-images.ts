import mysql from 'mysql2/promise';

async function main() {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3306,
    user: 'root', password: '123456', database: 'seric',
  });

  const countCols = [
    'image', 'images', 'description_en', 'description_zh'
  ];

  // Count CDN refs in each column
  console.log('=== Before ===');
  for (const col of countCols) {
    const [r]: any = await c.execute(
      `SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%img.hydra-pumps.com%' OR ${col} LIKE '%style.hydra-pumps.com%'`
    );
    console.log(`${col}: ${r[0].c} CDN refs`);
  }

  // Fix each column with REPLACE for known patterns
  const imgPatterns = [
    'https://img.hydra-pumps.com/photo/hydra-pumps/editor/',
    'https://img.hydra-pumps.com/test/hydra-pumps.com/photo/',
    '//img.hydra-pumps.com/test/hydra-pumps.com/photo/',
    'https://img.hydra-pumps.com/photo/',
    '//img.hydra-pumps.com/photo/',
  ];
  const stylePatterns = [
    '//style.hydra-pumps.com/images/',
    'https://style.hydra-pumps.com/images/',
    '//style.hydra-pumps.com/',
    'https://style.hydra-pumps.com/',
  ];

  const colsToFix = ['image', 'images', 'description_en', 'description_zh'];

  for (const col of colsToFix) {
    for (const pat of imgPatterns) {
      await c.execute(
        `UPDATE products SET ${col} = REPLACE(${col}, '${pat}', '/images/') WHERE ${col} LIKE '%img.hydra-pumps.com%'`
      );
    }
    for (const pat of stylePatterns) {
      await c.execute(
        `UPDATE products SET ${col} = REPLACE(${col}, '${pat}', '/images/') WHERE ${col} LIKE '%style.hydra-pumps.com%'`
      );
    }
  }

  // Check remaining
  console.log('\n=== After ===');
  let total = 0;
  for (const col of countCols) {
    const [r]: any = await c.execute(
      `SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%img.hydra-pumps.com%' OR ${col} LIKE '%style.hydra-pumps.com%'`
    );
    console.log(`${col}: ${r[0].c} CDN refs`);
    total += r[0].c;
  }

  // If anything remains, try regex approach on description
  if (total > 0) {
    console.log('\nTrying harder...');
    // Direct replacement of common patterns in description
    await c.execute(
      `UPDATE products SET description_en = REPLACE(description_en, '//style.hydra-pumps.com/', '/images/') WHERE description_en LIKE '%style.hydra-pumps.com%'`
    );
    await c.execute(
      `UPDATE products SET description_zh = REPLACE(description_zh, '//style.hydra-pumps.com/', '/images/') WHERE description_zh LIKE '%style.hydra-pumps.com%'`
    );

    let remaining = 0;
    for (const col of countCols) {
      const [r]: any = await c.execute(
        `SELECT COUNT(*) as c FROM products WHERE ${col} LIKE '%hydra-pumps.com%'`
      );
      console.log(`${col}: ${r[0].c} refs`);
      remaining += r[0].c;
    }
    console.log('Total remaining:', remaining);
  }

  await c.end();
  console.log('\nDone.');
}

main().catch(err => console.error(err.message));
