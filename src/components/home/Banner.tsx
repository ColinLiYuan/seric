'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    image: 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/cs211459195-hydraulic_orbit_motor.jpg',
    category: 'hydraulic-orbit-motor',
    alt: 'Hydraulic Orbit Motor',
  },
  {
    image: 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/cs206448565-solenoid_directional_control_valve.jpg',
    category: 'solenoid-directional-control-valve',
    alt: 'Solenoid Directional Control Valve',
  },
  {
    image: 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/cs206857389-hydraulic_vane_pump.jpg',
    category: 'hydraulic-vane-pump',
    alt: 'Hydraulic Vane Pump',
  },
];

export default function Banner({ locale }: { locale: string }) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Swiper | null>(null);

  useEffect(() => {
    if (!swiperRef.current || instanceRef.current) return;

    instanceRef.current = new Swiper(swiperRef.current, {
      modules: [Autoplay, Pagination, Navigation],
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-black">
      <div className="swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {slides.map((slide, idx) => (
            <div key={idx} className="swiper-slide">
              <Link href={`/${locale}/products?category=${slide.category}`}>
                <div className="relative w-full aspect-[3/1] min-h-[300px] max-h-[500px]">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="swiper-pagination !bottom-4"></div>
        <div className="swiper-button-prev !text-white"></div>
        <div className="swiper-button-next !text-white"></div>
      </div>
    </div>
  );
}
