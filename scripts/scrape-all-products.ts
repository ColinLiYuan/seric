import * as https from 'https';
import * as fs from 'fs';

function get(url: string): Promise<string> {
  return new Promise((r, j) => https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => r(d));
  }).on('error', j));
}
const s = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  // Read existing products to get all slugs
  const existing = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));
  console.log('Products to scrape:', existing.length);

  const products: any[] = [];
  let done = 0, fail = 0;

  for (const prod of existing) {
    const pid = prod.slug.match(/^\d+/)![0];
    try {
      const html = await get(`https://www.hydra-pumps.com/sale-${pid}-${prod.slug}.html`);
      done++;

      const nameM = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const name = nameM ? nameM[1].trim() : '';

      const mainImgM = html.match(/data-bigimage="([^"]+)"/);
      const gallery = html.match(/data-image="([^"]+)"/g) || [];
      const allImgs: string[] = [];
      if (mainImgM) allImgs.push(mainImgM[1].replace('//img.hydra-pumps.com/photo/', 'products/'));
      gallery.forEach(m => allImgs.push(m.match(/data-image="([^"]+)"/)![1].replace('//img.hydra-pumps.com/photo/', 'products/')));
      const mainImg = allImgs.find((x: string) => x.includes('/py') || x.includes('/pl')) || allImgs[0] || '';

      const di = html.indexOf('Product Description');
      let desc = '';
      if (di > 0) {
        const ei = html.indexOf('similar products', di);
        desc = html.substring(di, ei > 0 ? ei : di + 15000)
          .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').trim()
          .replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//g, 'products/')
          .replace(/\/\/style\.hydra-pumps\.com\/images\//g, 'products/')
          .replace(/\/\/img\.hydra-pumps\.com\/photo\//g, 'products/');
      }

      const catM = html.match(/href="\/supplier-\d+-([^"]+)"/);
      const priceM = html.match(/"price":\s*"([^"]+)"/);

      products.push({
        id: prod.id,
        slug: pid + '-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
        category_slug: catM ? catM[1] : prod.category_slug,
        name_en: name,
        image: mainImg,
        images: allImgs,
        price: priceM ? priceM[1] : (prod.price || ''),
        description_en: desc,
        featured: prod.featured || 0,
        top_selling: prod.top_selling || 0,
      });

      process.stdout.write(`\r[${done}/${existing.length}] ${name.substring(0, 55)}...`);
    } catch {
      fail++;
      products.push(prod);
      process.stdout.write('x');
    }
    await s(100);
  }

  console.log(`\n\nDone: ${done}, Failed: ${fail}`);
  fs.writeFileSync('src/data/products-backup.json', JSON.stringify(products, null, 2));
  console.log('Saved', products.length, 'products to products-backup.json');
  console.log('Size:', (fs.statSync('src/data/products-backup.json').size / 1024 / 1024).toFixed(1), 'MB');
}

main().catch(err => console.error(err));
