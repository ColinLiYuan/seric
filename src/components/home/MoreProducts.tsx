'use client';

import { useTranslations } from 'next-intl';
import products from '@/data/products.json';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function MoreProducts({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const items = (products as any[]).slice(0, 20);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-8">
          <div className="flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
              {t('moreProducts')}
            </h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-3 min-w-max py-2">
              {items.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-red hover:text-white transition flex-shrink-0"
                >
                  <span className="line-clamp-1 max-w-[200px]">{product.name_en}</span>
                  <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
