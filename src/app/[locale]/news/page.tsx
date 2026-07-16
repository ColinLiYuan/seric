import { newsItems } from '@/data/news';
import Link from 'next/link';

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">News</h1>
      <div className="space-y-8">
        {newsItems.map((item) => (
          <Link
            key={item.id}
            href={`/${locale}/news/${item.id}`}
            className="block group border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="grid md:grid-cols-3">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="md:col-span-2 p-6">
                <h2 className="text-xl font-bold mb-2 group-hover:text-brand-red transition">
                  {item.title.en}
                </h2>
                <span className="text-sm text-gray-400">{item.date}</span>
                <p className="text-gray-600 mt-3 line-clamp-3">{item.summary.en}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
