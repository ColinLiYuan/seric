'use client';

import { useTranslations } from 'next-intl';
import products from '@/data/products.json';
import SectionIcon from './SectionIcon';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
function imgUrl(p: any) {
  const path = p.image || '';
  if (path.startsWith('http')) return path;
  return CDN + '/' + path;
}

export default function TopSelling({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const items = (products as any[]).filter((p: any) => p.top_selling).slice(0, 8);

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <SectionIcon color="#FFFFFF" />
        <h2 className="text-3xl font-bold text-center text-white mb-10">{t('topSelling')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition group"
            >
              <Link href={`/${locale}/products/${product.slug}`}>
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={imgUrl(product)}
                    alt={product.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/${locale}/products/${product.slug}`}>
                  <h3 className="text-sm font-medium line-clamp-2 mb-3 group-hover:text-brand-red transition">
                    {product.name_en}
                  </h3>
                </Link>
                <button className="inline-flex items-center gap-1 text-sm text-white bg-brand-red px-4 py-2 rounded hover:bg-red-700 transition">
                  Get Best Price
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
