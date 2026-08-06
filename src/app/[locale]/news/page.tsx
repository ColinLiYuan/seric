import Link from 'next/link';
import { fetchApi } from '@/lib/api-data';
import type { Metadata } from 'next';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
function preImg(p: string) { if (!p) return ''; if (p.startsWith('http')) return p; return CDN + '/' + p; }

export const metadata: Metadata = { title: 'News & Blog - Hydraulic Pump Industry Insights' };

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let blogs: any[] = [];
  try { blogs = (await fetchApi('/blogs')) || []; } catch {}

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">News & Blog</h1>
      <div className="space-y-8">
        {blogs.length === 0 ? (
          <p className="text-gray-400">No articles yet.</p>
        ) : (
          blogs.map((item: any) => (
            <Link
              key={item.id}
              href={`/${locale}/news/${item.slug || item.id}`}
              className="block group border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="grid md:grid-cols-3">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {item.image && <img src={preImg(item.image)} alt={item.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />}
                </div>
                <div className="md:col-span-2 p-6">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-brand-red transition">{item.titleEn}</h2>
                  <span className="text-sm text-gray-400">{item.createdAt?.substring(0, 10)}</span>
                  <p className="text-gray-600 mt-3 line-clamp-3">{item.summaryEn}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
