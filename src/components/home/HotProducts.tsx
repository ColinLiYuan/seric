'use client';

import { useTranslations } from 'next-intl';
import { loc } from '@/lib/locale';
import SectionIcon from './SectionIcon';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HotProducts({ locale, products }: { locale: string; products: any[] }) {
  const t = useTranslations('home');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionIcon color="#E60000" />
        <h2 className="text-3xl font-bold text-center mb-2">{t('hotProducts')}</h2>
        <p className="text-gray-500 text-center mb-10">{t('hotProductsDesc')}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={loc(product, 'name', locale)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="text-xs font-medium line-clamp-2 mb-2 group-hover:text-brand-red transition">
                  {loc(product, 'name', locale)}
                </h3>
                <div className="flex items-center text-brand-red text-xs font-semibold">
                  {t('hotProducts') === 'HOT PRODUCTS' ? 'Contact Us' : '联系我们'}
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
