import { newsItems } from '@/data/news';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const item = newsItems.find((n) => n.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-1 text-brand-red hover:underline mb-6"
      >
        <ChevronLeft size={16} />
        Back to News
      </Link>
      <img
        src={item.image}
        alt={item.title.en}
        className="w-full aspect-[2/1] object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{item.title.en}</h1>
      <span className="text-sm text-gray-400">{item.date}</span>
      <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
        {item.summary.en}
      </div>
    </div>
  );
}
