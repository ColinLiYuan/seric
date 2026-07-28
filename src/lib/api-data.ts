import products from '@/data/products.json';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:26987/api';
const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
const localAll = products as any[];

function preImg(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return CDN + '/' + path;
}

/** Try API first, fall back to local JSON */
export async function fetchApi(path: string) {
  try {
    const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(5000) });
    if (res.status === 404) return null;
    if (res.ok) {
      const json = await res.json();
      if (json.code === 200) return json.data;
    }
  } catch {
    // API unreachable, fall back to local JSON
  }

  // === Local JSON fallback ===
  if (path.startsWith('/products')) {
    const url = new URL('http://localhost' + path);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const topSelling = url.searchParams.get('topSelling');

    let result = [...localAll];
    if (category) result = result.filter((p: any) => p.category_slug === category);
    if (featured) result = result.filter((p: any) => p.featured);
    if (topSelling) result = result.filter((p: any) => p.top_selling);

    const parts = path.split('/');
    if (parts.length === 3) {
      const p = localAll.find((x: any) => x.slug === parts[2]);
      if (!p) return null;
      const descEn = (p.description_en || '').replace(/src="products\//g, 'src="' + CDN + '/products/');
      return { ...p, image: preImg(p.image), images: JSON.parse(p.images || '[]').map(preImg), description_en: descEn };
    }
    if (parts.length >= 4 && parts[3].startsWith('related')) {
      const p = localAll.find((x: any) => x.slug === parts[2]);
      if (!p) return [];
      const limit = parseInt(url.searchParams.get('limit') || '10');
      return localAll.filter((x: any) => x.category_slug === p.category_slug && x.slug !== p.slug).slice(0, limit).map((x: any) => ({ ...x, image: preImg(x.image) }));
    }
    return result.map((x: any) => ({ ...x, image: preImg(x.image) }));
  }
  return [];
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  localAll.forEach((p: any) => { const s = p.category_slug || 'other'; counts[s] = (counts[s] || 0) + 1; });
  return counts;
}
export function getTotalCount(): number { return localAll.length; }

export function flatProduct(p: any) {
  return {
    ...p,
    name_en: p.name?.en || p.name_en || '',
    category_slug: p.categorySlug || p.category_slug || '',
    image: preImg(p.image),
  };
}
