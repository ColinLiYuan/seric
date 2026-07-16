const https=require('https'),fs=require('fs');
function get(u: string): Promise<string> {
  return new Promise(r=>https.get(u,{headers:{'User-Agent':'Mozilla/5.0'}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>r(d))}).on('error',()=>r('')));
}

async function main() {
  const existing = JSON.parse(fs.readFileSync('src/data/products.json','utf-8'));
  const out: any[] = [];
  for (let i = 0; i < existing.length; i++) {
    const p = existing[i], pid = p.slug.match(/^\d+/)![0];
    const html = await get(`https://www.hydra-pumps.com/sale-${pid}-${p.slug}.html`);
    const nm = (html.match(/<h1[^>]*>([^<]+)<\/h1>/i)||[])[1]||p.name_en;
    const im = html.match(/data-bigimage="([^"]+)"/);
    const ga = html.match(/data-image="([^"]+)"/g)||[];
    const allImgs = (im?[im[1]]:[]).concat(ga.map(m=>m.match(/data-image="([^"]+)"/)![1]))
      .map(x=>x.replace(/\/\/img\.hydra-pumps\.com\/photo\//,'products/').replace(/https:\/\/img\.hydra-pumps\.com\/photo\//,'products/'));
    const mainImg = allImgs.find(x=>x.includes('/py')||x.includes('/pl'))||allImgs[0]||'';
    const di = html.indexOf('Product Description'); let desc='';
    if (di>0) { const ei=html.indexOf('similar products',di); desc=html.substring(di,ei>0?ei:di+12000).replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').trim().replace(/https?:\/\/img\.hydra-pumps\.com\/photo\//g,'products/').replace(/\/\/style\.hydra-pumps\.com\/images\//g,'products/').replace(/\/\/img\.hydra-pumps\.com\/photo\//g,'products/'); }
    const ca = html.match(/href="\/supplier-\d+-([^"]+)"/);
    const pr = html.match(/"price":\s*"([^"]+)"/);
    out.push({...p, name_en:nm||p.name_en, image:mainImg||p.image, images:allImgs.length?allImgs:(p.images||[]), description_en:desc||p.description_en, category_slug:ca?ca[1]:p.category_slug, price:pr?pr[1]:p.price});
    process.stdout.write(`\r[${i+1}/${existing.length}] ${(nm||p.name_en).substring(0,50)} (${desc.length}c)`);
  }
  fs.writeFileSync('src/data/products-backup.json', JSON.stringify(out,null,2));
  console.log('\nSaved '+out.length+' products');
}
main();
