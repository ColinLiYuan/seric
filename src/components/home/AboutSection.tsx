'use client';

import { useTranslations } from 'next-intl';
import { companyInfo } from '@/data/company';
import Link from 'next/link';

export default function AboutSection({ locale }: { locale: string }) {
  const t = useTranslations('about');

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/cl211460488-guangzhou_seric_hydraulic_co_ltd.jpg"
              alt={companyInfo.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <span className="text-brand-red text-sm font-semibold uppercase tracking-wider">
              about us
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4">{companyInfo.name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-[8] mb-6">
              {companyInfo.description}
            </p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-1 text-brand-red font-semibold hover:underline"
            >
              read more &gt;&gt;
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-10 pt-8 border-t">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-blue">{companyInfo.founded}</div>
                <div className="text-sm text-gray-500 mt-1">{t('yearEstablished')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-blue">{companyInfo.exportPercentage}</div>
                <div className="text-sm text-gray-500 mt-1">{t('exportPc')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
