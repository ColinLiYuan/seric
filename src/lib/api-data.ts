import products from '@/data/products.json';

const all = products as any[];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchApi(path: string) {
  // Simulate API delay
  await sleep(50);

  // GET /products?category=xxx&featured=1&topSelling=1
  if (path.startsWith('/products')) {
    const url = new URL('http://localhost' + path);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const topSelling = url.searchParams.get('topSelling');

    let result = [...all];
    if (category) result = result.filter(p => p.category_slug === category);
    if (featured) result = result.filter(p => p.featured);
    if (topSelling) result = result.filter(p => p.top_selling);

    // /products/{slug}/related
    const parts = path.split('/');
    if (parts.length === 3) {
      // /products/{slug}
      const p = all.find(x => x.slug === parts[1]);
      if (!p) throw new Error('Product not found');
      return p;
    }
    if (parts.length === 4 && parts[3].startsWith('related')) {
      // /products/{slug}/related
      const p = all.find(x => x.slug === parts[1]);
      if (!p || !p.category_slug) return [];
      const limit = parseInt(new URL('http://localhost' + path).searchParams.get('limit') || '10');
      return all.filter(x => x.category_slug === p.category_slug && x.slug !== p.slug).slice(0, limit);
    }

    return result;
  }

  return [];
}

export function flatProduct(p: any) {
  return {
    ...p,
    name_en: p.name_en || '',
    category_slug: p.category_slug,
  };
}
