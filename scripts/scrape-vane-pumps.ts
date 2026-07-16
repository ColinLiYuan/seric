import * as https from 'https';
import * as fs from 'fs';
import mysql from 'mysql2/promise';

const BASE = 'www.hydra-pumps.com';
const CAT_URL = '/supplier-4767411-hydraulic-vane-pump';

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function scrapeVanePumps() {
  // 1. Get all vane pump product URLs
  const urls: string[] = [];
  for (let page = 1; ; page++) {
    const url = page === 1
      ? `https://${BASE}${CAT_URL}`
      : `https://${BASE}${CAT_URL}--p${page}.html`;
    const html = await fetch(url);
    const links = [...new Set((html.match(/href="\/sale-\d+-[^"]+\.html"/g) || []).map(m => m.match(/href="([^"]+)"/)![1]))];
    if (!links.length) break;
    urls.push(...links);
    process.stdout.write(`\rFound ${urls.length} vane pump URLs (page ${page})`);
    await sleep(300);
  }
  console.log('\nTotal vane pumps:', urls.length);

  // 2. Connect DB
  const db = await mysql.createConnection({ host: '127.0.0.1', port: 3306, user: 'root', password: '123456', database: 'seric' });

  // 3. Scrape each
  let updated = 0, inserted = 0, failed = 0;
  for (let i = 0; i < urls.length; i++) {
    const purl = urls[i];
    const pid = purl.match(/sale-(\d+)-/)![1];
    try {
      const html = await fetch(`https://${BASE}${purl}`);

      const nameM = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const name = nameM ? nameM[1].trim() : '';

      const mainImgM = html.match(/data-bigimage="([^"]+)"/);
      const galleryImgs = html.match(/data-image="([^"]+)"/g) || [];
      const allImgs: string[] = [];
      if (mainImgM) allImgs.push(mainImgM[1].replace('//', 'https://'));
      galleryImgs.forEach(m => allImgs.push(m.match(/data-image="([^"]+)"/)![1].replace('//', 'https://')));
      const mainImg = allImgs.find((x: string) => x.includes('/py') || x.includes('/pl')) || allImgs[0] || '';

      const descIdx = html.indexOf('Product Description');
      let descHtml = '';
      if (descIdx > 0) {
        const endIdx = html.indexOf('similar products', descIdx);
        descHtml = html.substring(descIdx, endIdx > 0 ? endIdx : descIdx + 10000)
          .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').trim();
      }

      const priceM = html.match(/"price":\s*"([^"]+)"/);
      const priceVal = priceM ? priceM[1] : '';

      const slug = pid + '-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const imgPath = mainImg.replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//, 'products/').replace(/\/\/img\.hydra-pumps\.com\/photo\//, 'products/');
      const imgsPath = JSON.stringify(allImgs.map((x: string) => x.replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//, 'products/').replace(/\/\/img\.hydra-pumps\.com\/photo\//, 'products/')));
      const descClean = descHtml
        .replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//g, 'products/')
        .replace(/\/\/img\.hydra-pumps\.com\/photo\//g, 'products/')
        .replace(/\/\/style\.hydra-pumps\.com\/images\//g, 'products/');

      // Upsert
      const [existing]: any = await db.execute('SELECT id FROM products WHERE slug = ?', [slug]);
      if (existing.length) {
        await db.execute(
          'UPDATE products SET name_en=?, image=?, images=?, price=?, description_en=?, category_slug=? WHERE id=?',
          [name, imgPath, imgsPath, priceVal, descClean, 'hydraulic-vane-pump', existing[0].id]
        );
        updated++;
      } else {
        await db.execute(
          'INSERT INTO products (slug, category_slug, name_en, image, images, price, description_en, featured, top_selling) VALUES (?,?,?,?,?,?,?,0,0)',
          [slug, 'hydraulic-vane-pump', name, imgPath, imgsPath, priceVal, descClean]
        );
        inserted++;
      }
      process.stdout.write(`\r[${i + 1}/${urls.length}] ${name.substring(0, 60)}...`);
    } catch { failed++; process.stdout.write('x'); }
    await sleep(200);
  }

  console.log(`\n\nUpdated: ${updated}, Inserted: ${inserted}, Failed: ${failed}`);

  // 4. Export JSON
  const [all] = await db.execute('SELECT * FROM products ORDER BY id');
  fs.writeFileSync('src/data/products.json', JSON.stringify(all, null, 2));
  console.log('Exported', (all as any[]).length, 'products to products.json');
  await db.end();
}

scrapeVanePumps().catch(err => console.error(err));
