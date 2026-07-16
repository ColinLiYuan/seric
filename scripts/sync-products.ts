/**
 * Compare original site products with MariaDB, only scrape differences
 */
import * as https from 'https';
import * as fs from 'fs';
import mysql from 'mysql2/promise';

const BASE = 'www.hydra-pumps.com';

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function getProductUrls(): Promise<string[]> {
  const html = await fetch(`https://${BASE}/products.html`);
  const catLinks = [...new Set((html.match(/href="\/supplier-\d+-[^"]+"/g) || []).map(m => m.match(/href="([^"]+)"/)![1]))];
  const allUrls: string[] = [];

  for (const cat of catLinks) {
    let page = 1;
    while (true) {
      const url = page === 1 ? `https://${BASE}${cat}` : `https://${BASE}${cat}--p${page}.html`;
      const h = await fetch(url);
      const links = [...new Set((h.match(/href="\/sale-\d+-[^"]+\.html"/g) || []).map(m => m.match(/href="([^"]+)"/)![1]))];
      if (!links.length) break;
      allUrls.push(...links);
      page++;
      await sleep(300);
    }
    await sleep(200);
  }
  return allUrls;
}

async function scrapeProduct(purl: string) {
  const pid = purl.match(/sale-(\d+)-/)![1];
  const html = await fetch(`https://${BASE}${purl}`);

  const nameM = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const name = nameM ? nameM[1].trim() : '';

  const mainImgM = html.match(/data-bigimage="([^"]+)"/);
  const galleryImgs = html.match(/data-image="([^"]+)"/g) || [];
  const allImages: string[] = [];
  if (mainImgM) allImages.push(mainImgM[1].replace('//', 'https://'));
  galleryImgs.forEach(m => allImages.push(m.match(/data-image="([^"]+)"/)![1].replace('//', 'https://')));

  const mainImg = allImages.find((i: string) => i.includes('/py') || i.includes('/pl')) || allImages[0] || '';

  const descIdx = html.indexOf('Product Description');
  let descHtml = '';
  if (descIdx > 0) {
    const endIdx = html.indexOf('similar products', descIdx);
    const section = html.substring(descIdx, endIdx > 0 ? endIdx : descIdx + 10000);
    descHtml = section.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').trim();
  }

  const priceM = html.match(/"price":\s*"([^"]+)"/);
  const catM = html.match(/href="\/supplier-\d+-([^"]+)"/);
  const slug = pid + '-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  return {
    slug,
    category_slug: catM ? catM[1] : '',
    name_en: name,
    image: mainImg.replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//, 'products/').replace(/\/\/img\.hydra-pumps\.com\/photo\//, 'products/'),
    images: JSON.stringify(allImages.map(i => i.replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//, 'products/').replace(/\/\/img\.hydra-pumps\.com\/photo\//, 'products/'))),
    price: priceM ? priceM[1] : '',
    description_en: descHtml
      .replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//g, 'products/')
      .replace(/\/\/img\.hydra-pumps\.com\/photo\//g, 'products/')
      .replace(/\/\/style\.hydra-pumps\.com\/images\//g, 'products/'),
  };
}

async function main() {
  const db = await mysql.createConnection({ host: '127.0.0.1', port: 3306, user: 'root', password: '123456', database: 'seric' });

  // Get current MariaDB slugs
  const [existing]: any = await db.execute('SELECT id, slug, description_en FROM products ORDER BY id');
  const existingMap = new Map(existing.map((p: any) => [p.slug, p]));

  // Get original site product list
  console.log('Fetching product list from original site...');
  const siteUrls = await getProductUrls();
  console.log('Found', siteUrls.length, 'products on original site');
  console.log('We have', existing.length, 'products in MariaDB\n');

  // Find products that need scraping
  let toScrape: string[] = [];
  let newProducts: string[] = [];
  let incompleteProducts: string[] = [];

  for (const purl of siteUrls) {
    const pid = purl.match(/sale-(\d+)-/)![1];
    // Find matching product in our DB by pid prefix
    const match = existing.find((p: any) => p.slug?.startsWith(pid));
    if (!match) {
      newProducts.push(purl);
      toScrape.push(purl);
    } else if (!match.description_en || match.description_en.length < 500) {
      incompleteProducts.push(purl);
      toScrape.push(purl);
    }
  }

  console.log('New products (not in DB):', newProducts.length);
  console.log('Incomplete descriptions (<500 chars):', incompleteProducts.length);
  console.log('Total to scrape:', toScrape.length);

  if (toScrape.length === 0) {
    console.log('Nothing to do!');
    await db.end();
    return;
  }

  // Scrape
  console.log('\nScraping...');
  let scraped = 0, failed = 0;
  for (let i = 0; i < toScrape.length; i++) {
    const purl = toScrape[i];
    try {
      const p = await scrapeProduct(purl);
      const pid = purl.match(/sale-(\d+)-/)![1];
      const match = existing.find((x: any) => x.slug?.startsWith(pid));

      if (match) {
        // Update existing
        await db.execute(
          'UPDATE products SET name_en=?, image=?, images=?, price=?, description_en=?, category_slug=? WHERE id=?',
          [p.name_en, p.image, p.images, p.price, p.description_en, p.category_slug, match.id]
        );
      } else {
        // Insert new
        await db.execute(
          'INSERT INTO products (slug, category_slug, name_en, image, images, price, description_en) VALUES (?,?,?,?,?,?,?)',
          [p.slug, p.category_slug, p.name_en, p.image, p.images, p.price, p.description_en]
        );
      }
      scraped++;
      process.stdout.write(`\r[${i + 1}/${toScrape.length}] ${p.name_en?.substring(0, 50)}...`);
    } catch (err: any) {
      failed++;
      process.stdout.write('x');
    }
    await sleep(200);
  }

  console.log(`\n\nScraped: ${scraped}, Failed: ${failed}`);

  // Export final JSON
  const [all] = await db.execute('SELECT * FROM products ORDER BY id');
  fs.writeFileSync('src/data/products.json', JSON.stringify(all, null, 2));
  console.log('Exported', (all as any[]).length, 'products to products.json');

  await db.end();
}

main().catch(err => console.error(err));
