import products from '@/data/products.json';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
const all = products as any[];

function preImg(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return CDN + '/' + path;
}

export async function fetchApi(path: string) {
  if (path.startsWith('/products')) {
    const url = new URL('http://localhost' + path);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const topSelling = url.searchParams.get('topSelling');

    let result = [...all];
    if (category) result = result.filter(p => p.category_slug === category);
    if (featured) result = result.filter(p => p.featured);
    if (topSelling) result = result.filter(p => p.top_selling);

    const parts = path.split('/');
    if (parts.length === 3) {
      const p = all.find(x => x.slug === parts[2]);
      if (!p) return null;
      const descEn = (p.description_en || '').replace(/src="products\//g, 'src="' + CDN + '/products/');
      return {
        ...p,
        image: preImg(p.image),
        images: JSON.parse(p.images || '[]').map(preImg),
        description_en: descEn,
      };
    }
    if (parts.length >= 4 && parts[3].startsWith('related')) {
      const p = all.find(x => x.slug === parts[2]);
      if (!p || !p.category_slug) return [];
      const limit = parseInt(url.searchParams.get('limit') || '10');
      return all
        .filter(x => x.category_slug === p.category_slug && x.slug !== p.slug)
        .slice(0, limit)
        .map(x => ({ ...x, image: preImg(x.image) }));
    }
    return result.map(x => ({ ...x, image: preImg(x.image) }));
  }
  return [];
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  all.forEach(p => { const s = p.category_slug || 'other'; counts[s] = (counts[s] || 0) + 1; });
  return counts;
}

export function getTotalCount(): number { return all.length; }

export function flatProduct(p: any) {
  return { ...p, name_en: p.name_en || '', category_slug: p.category_slug, image: preImg(p.image) };
}
