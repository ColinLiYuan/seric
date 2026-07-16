'use client';

import { useTranslations } from 'next-intl';
import { products } from '@/data/products';
import { t as tl } from '@/lib/locale';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function MoreProducts({ locale }: { locale: string }) {
  const t = useTranslations('home');

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
              {products.slice(0, 20).map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-red hover:text-white transition flex-shrink-0"
                >
                  <span className="line-clamp-1 max-w-[200px]">{tl(product.name, locale)}</span>
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
