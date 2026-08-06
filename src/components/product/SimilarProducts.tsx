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
      <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Similar Products</h3>

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
                    <h3 className="text-xs text-gray-700 line-clamp-2 mb-2 min-h-[2.5rem]">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="hover:text-brand-red transition"
                      >
                        {product.name_en}
                      </Link>
                    </h3>
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
