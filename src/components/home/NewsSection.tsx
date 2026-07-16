'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { newsItems } from '@/data/news';
import SectionIcon from './SectionIcon';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsSection({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const [activeIdx, setActiveIdx] = useState(0);
  const item = newsItems[activeIdx];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionIcon color="#E60000" />
        <h2 className="text-3xl font-bold text-center mb-12">{t('news')}</h2>

        {item && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : newsItems.length - 1))}
                  className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveIdx((prev) => (prev < newsItems.length - 1 ? prev + 1 : 0))}
                  className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <Link href={`/${locale}/news/${item.id}`}>
                  <h3 className="text-xl font-bold mb-2 hover:text-brand-red transition">
                    {item.title.en}
                  </h3>
                </Link>
                <span className="text-xs text-gray-400 block mb-4">{item.date}</span>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
                  {item.summary.en}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
