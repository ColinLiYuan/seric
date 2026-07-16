'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight as ChevRight } from 'lucide-react';

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (!images.length) {
    return (
      <div className="border rounded-lg overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <div>
      {/* Main image */}
      <div
        className="border rounded-lg overflow-hidden bg-gray-50 mb-3 aspect-square flex items-center justify-center relative"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <img
          src={images[active]}
          alt={`${alt} ${active + 1}`}
          className="max-w-full max-h-full object-contain cursor-crosshair"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="relative flex items-center">
          <button onClick={prev} className="flex-shrink-0 p-1 text-gray-400 hover:text-brand-red transition">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2 overflow-x-auto flex-1 px-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActive(idx)}
                className={`flex-shrink-0 w-[60px] h-[60px] border-2 rounded overflow-hidden cursor-pointer transition ${
                  idx === active ? 'border-brand-red' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img src={img} alt={`${alt} ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <button onClick={next} className="flex-shrink-0 p-1 text-gray-400 hover:text-brand-red transition">
            <ChevRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
