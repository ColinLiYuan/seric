'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  id: number;
  slug: string;
  name_en: string;
  image: string;
}

export default function SimilarProducts({
  locale,
  products,
}: {
  locale: string;
  products: Product[];
}) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Swiper | null>(null);

  useEffect(() => {
    if (!swiperRef.current || instanceRef.current) return;

    instanceRef.current = new Swiper(swiperRef.current, {
      modules: [Navigation],
      slidesPerView: 2,
      spaceBetween: 12,
      navigation: {
        nextEl: '.simi-next',
        prevEl: '.simi-prev',
      },
      breakpoints: {
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      },
    });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  if (!products.length) return null;

  return (
    <div className="mt-12">
      {/* Header with SVG wave icon — matching original site */}
      <div className="flex flex-col items-center mb-6">
        <div className="mb-2">
          <svg width="85" height="30" viewBox="0 0 85 30" fill="none">
            <path
              d="M0 30C6.18 12.52 22.85 0 42.44 0C62.03 0 78.7 12.52 84.88 30H76.28C75.47 28.17 74.52 26.44 73.44 24.78C72.05 22.66 70.44 20.67 68.6 18.84C66.77 17 64.78 15.39 62.66 14C60.82 12.8 58.89 11.77 56.84 10.9C54.85 10.06 52.82 9.4 50.74 8.93C48.05 8.31 45.28 8 42.44 8C39.6 8 36.84 8.31 34.14 8.93C32.06 9.4 30.03 10.06 28.04 10.9C25.99 11.77 24.05 12.8 22.22 14C20.09 15.39 18.11 17 16.28 18.84C14.44 20.67 12.83 22.66 11.44 24.78C10.36 26.43 9.41 28.17 8.6 30H0Z"
              fill="#E60000"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800">similar products</h3>
      </div>

      {/* Swiper carousel — matching original site */}
      <div className="relative px-8">
        <div className="swiper" ref={swiperRef}>
          <div className="swiper-wrapper">
            {products.map((product) => (
              <div key={product.id} className="swiper-slide">
                <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition">
                  <Link href={`/${locale}/products/${product.slug}`}>
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.image || 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/load_icon.gif'}
                        alt={product.name_en}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-3">
                    <h2 className="text-xs text-gray-700 line-clamp-2 mb-2 min-h-[2.5rem]">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="hover:text-brand-red transition"
                      >
                        {product.name_en}
                      </Link>
                    </h2>
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      className="flex items-center justify-center gap-1 bg-gradient-to-b from-[#ff8a3d] to-[#e6731a] text-white px-3 py-2 rounded text-xs font-semibold hover:from-[#e6731a] hover:to-[#cc5f0a] transition"
                    >
                      Get Best Price
                      <span className="text-[10px]">✓</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button className="simi-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border rounded-full shadow flex items-center justify-center text-gray-500 hover:text-brand-red transition">
          ‹
        </button>
        <button className="simi-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border rounded-full shadow flex items-center justify-center text-gray-500 hover:text-brand-red transition">
          ›
        </button>
      </div>
    </div>
  );
}
