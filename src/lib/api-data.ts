// Server-side needs absolute URL; client uses relative /api → rewrites proxy (avoids mixed content)
const API = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:26987/api')
  : '/api';
const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';

function preImg(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return CDN + '/' + path;
}

export async function fetchApi(path: string) {
  const res = await fetch(`${API}${path}`);
  if (res.status === 404) return null;
  if (!res.ok) return [];
  const json = await res.json();
  if (json.code === 200) return json.data;
  return [];
}

let _counts: Record<string, number> = {};
export function setCategoryCounts(counts: Record<string, number>) { _counts = counts; }
export function getCategoryCounts(): Record<string, number> { return _counts; }
export function getTotalCount(): number { return Object.values(_counts).reduce((a, b) => a + b, 0); }

export function flatProduct(p: any) {
  return {
    ...p,
    name_en: p.name?.en || p.name_en || '',
    category_slug: p.categorySlug || p.category_slug || '',
    image: preImg(p.image),
  };
}
