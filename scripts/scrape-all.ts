/**
 * Full re-scrape of all products from hydra-pumps.com
 */
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

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

async function main() {
  // Step 1: Get all category slugs from products.html
  console.log('Fetching product listing...');
  const productsHtml = await fetch(`https://${BASE}/products.html`);

  // Extract category links
  const catLinks = productsHtml.match(/href="\/supplier-\d+-([^"]+)"/g) || [];
  const cats = [...new Set(catLinks)].map(m => {
    const href = m.match(/href="([^"]+)"/)![1];
    return href;
  });
  console.log('Categories found:', cats.length);

  // Step 2: Scrape all product URLs from each category
  const allProductUrls: string[] = [];

  for (const cat of cats) {
    console.log('Scraping category:', cat);
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = page === 1
        ? `https://${BASE}${cat}`
        : `https://${BASE}${cat}--p${page}.html`;
      const html = await fetch(url);
      const links = html.match(/href="\/sale-\d+-[^"]+\.html"/g) || [];
      if (links.length === 0) {
        hasMore = false;
      } else {
        links.forEach(m => {
          const href = m.match(/href="([^"]+)"/)![1];
          allProductUrls.push(href);
        });
        console.log(`  Page ${page}: ${links.length} products (total: ${allProductUrls.length})`);
        page++;
        await sleep(500);
      }
    }
    await sleep(300);
  }

  console.log('\nTotal products found:', allProductUrls.length);

  // Step 3: Scrape each product detail
  const products: any[] = [];

  for (let i = 0; i < allProductUrls.length; i++) {
    const purl = allProductUrls[i];
    const pid = purl.match(/sale-(\d+)-/)![1];
    const html = await fetch(`https://${BASE}${purl}`);

    // Extract data
    const nameM = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const name = nameM ? nameM[1].trim() : '';

    // Images: main + gallery
    const mainImgM = html.match(/data-bigimage="([^"]+)"/);
    const galleryImgs = html.match(/data-image="([^"]+)"/g) || [];
    const allImages: string[] = [];
    if (mainImgM) allImages.push(mainImgM[1].replace('//', 'https://'));
    galleryImgs.forEach(m => {
      const src = m.match(/data-image="([^"]+)"/)![1].replace('//', 'https://');
      allImages.push(src);
    });

    // Main image (first py/pl image)
    const mainImg = allImages.find(i => i.includes('/py') || i.includes('/pl')) || allImages[0] || '';

    // Description - extract content after "Product Description"
    const descIdx = html.indexOf('Product Description');
    let descHtml = '';
    if (descIdx > 0) {
      const footerIdx = html.indexOf('qxkj_footer', descIdx);
      const section = html.substring(descIdx, footerIdx > 0 ? footerIdx : descIdx + 10000);
      // Clean: remove script/style tags
      descHtml = section
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/similar products[\s\S]*$/gi, '')
        .trim();
    }

    // Extract price from structured data
    const priceM = html.match(/"price":\s*"([^"]+)"/);
    const price = priceM ? priceM[1] : '';

    // Category from breadcrumb
    const catM = html.match(/href="\/supplier-\d+-([^"]+)"/);
    const categorySlug = catM ? catM[1] : '';

    // Featured/Top selling - all false by default
    console.log(`[${i + 1}/${allProductUrls.length}] ${name.substring(0, 60)}...`);

    products.push({
      slug: pid + '-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      category_slug: categorySlug,
      name_en: name,
      name_zh: '',
      image: mainImg.replace('https://img.hydra-pumps.com/photo/', 'products/'),
      images: JSON.stringify(allImages.map(i => i.replace('https://img.hydra-pumps.com/photo/', 'products/'))),
      price,
      featured: 0,
      top_selling: 0,
      description_en: descHtml.replace(/https:\/\/img\.hydra-pumps\.com\/photo\//g, 'products/')
        .replace(/\/\/style\.hydra-pumps\.com\//g, 'products/')
        .replace(/\/\/img\.hydra-pumps\.com\//g, 'products/'),
      description_zh: '',
    });

    await sleep(300);
  }

  // Save
  fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
  console.log(`\nSaved ${products.length} products to products.json`);
}

main().catch(err => console.error(err));
