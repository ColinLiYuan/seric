// Server-side needs absolute URL; client uses relative /api → rewrites proxy (avoids mixed content)
const API = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:26987/api')
  : '/api';
const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';

// Cache public API responses for 1h so pages can be statically generated /
// served via ISR instead of rendering on every request (saves Vercel CPU).
export const REVALIDATE_SECONDS = 3600;

function preImg(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return CDN + '/' + path;
}

export async function fetchApi(path: string) {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (res.status === 404) return null;
    if (!res.ok) return [];
    const json = await res.json();
    if (json.code === 200) return json.data;
    return [];
  } catch {
    // Never fail the build/render if the backend is unreachable — pages fall
    // back to empty data and self-heal on the next revalidation.
    return [];
  }
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
