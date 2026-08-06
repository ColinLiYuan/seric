import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { fetchApi } from '@/lib/api-data';
import { marked } from 'marked';
import type { Metadata } from 'next';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
function preImg(p: string) { if (!p) return ''; if (p.startsWith('http')) return p; return CDN + '/' + p; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  try {
    const { id } = await params;
    const blogs = await fetchApi('/blogs');
    const item = blogs?.find((b: any) => b.slug === id || String(b.id) === id);
    if (item) return { title: item.titleEn, description: item.summaryEn };
  } catch {}
  return { title: 'Article' };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  let blogs: any[] = [];
  try { blogs = (await fetchApi('/blogs')) || []; } catch {}
  const item = blogs.find((b: any) => b.slug === id || String(b.id) === id);

  if (!item) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href={`/${locale}/news`} className="inline-flex items-center gap-1 text-brand-red hover:underline mb-6">
        <ChevronLeft size={16} /> Back to News
      </Link>
      {item.image && <img src={preImg(item.image)} alt={item.titleEn} className="w-full aspect-[2/1] object-cover rounded-lg mb-6" />}
      <h1 className="text-3xl font-bold mb-2">{item.titleEn}</h1>
      <span className="text-sm text-gray-400">{item.createdAt?.substring(0, 10)}</span>
      <div className="mt-6 text-gray-700 leading-relaxed description-content" dangerouslySetInnerHTML={{ __html: item.contentFormat === 'markdown' ? marked.parse(item.contentEn || '') : (item.contentEn || '') }} />
    </div>
  );
}
