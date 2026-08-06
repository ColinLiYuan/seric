'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) {
    return (
      <div className="border rounded-lg bg-gray-50 aspect-square flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <>
      <div className="flex gap-3">
        {/* Vertical Thumbnails */}
        <div className="flex flex-col gap-2 w-[72px] flex-shrink-0 max-h-[400px] overflow-y-auto">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActive(idx)}
              className={`flex-shrink-0 w-[68px] h-[68px] border-2 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                idx === active ? 'border-brand-red opacity-100 ring-1 ring-brand-red/30' : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
              }`}>
              <img src={img} alt={`${alt} ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 relative group">
          <div
            className="border rounded-lg overflow-hidden bg-gray-50 aspect-square flex items-center justify-center cursor-zoom-in"
            onClick={() => setLightbox(true)}>
            <img
              src={images[active]}
              alt={`${alt} ${active + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {active + 1} / {images.length}
            </span>
          </div>
          {images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="pointer-events-auto w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={18} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="pointer-events-auto w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <X size={24} />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={() => prev()} className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
                <ChevronLeft size={28} />
              </button>
              <button onClick={() => next()} className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <span className="absolute bottom-4 text-white/60 text-sm">{active + 1} / {images.length}</span>
          <img src={images[active]} alt={`${alt} ${active + 1}`} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
