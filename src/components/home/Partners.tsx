'use client';

import { useTranslations } from 'next-intl';
import SectionIcon from './SectionIcon';

export default function Partners({ locale }: { locale: string }) {
  const t = useTranslations('home');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionIcon color="#E60000" />
        <h2 className="text-3xl font-bold text-center mb-10">{t('partners')}</h2>

        <div className="overflow-hidden">
          <div className="flex gap-8 items-center justify-center">
            {/* Placeholder partner logos */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm"
              >
                Partner {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
