'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { locales, localeNames, localeCodes, type Locale } from '@/i18n/config';

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function switchPath(newLocale: string) {
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = newLocale;
    return '/' + segments.join('/');
  }

  function flagUrl(code: string) {
    return `/flags/${code.toLowerCase()}.png`;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1.5 px-2 py-2 text-sm text-gray-600 hover:text-brand-red">
        <img
          src={flagUrl(localeCodes[locale as Locale] || locale)}
          alt={locale}
          className="w-5 h-3.5 object-cover rounded-sm border border-gray-200"
        />
        <span>{localeNames[locale as Locale] || locale}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md py-2 w-48 max-h-80 overflow-y-auto z-50">
          {locales.map((loc) => (
            <Link
              key={loc}
              href={switchPath(loc)}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-1.5 text-sm hover:bg-gray-100 ${
                loc === locale ? 'text-brand-red font-semibold' : 'text-gray-700'
              }`}
            >
              <img
                src={flagUrl(localeCodes[loc])}
                alt={loc}
                className="w-6 h-4 object-cover rounded-sm border border-gray-200 flex-shrink-0"
              />
              <span>{localeNames[loc]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
