'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { loc } from '@/lib/locale';

export default function Navigation({ locale, mobile, categories = [] }: { locale: string; mobile?: boolean; categories?: any[] }) {
  const t = useTranslations('common');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleOpen = useCallback((key: string) => {
    if (mobile) return;
    clearTimer();
    setOpenKey(key);
  }, [mobile, clearTimer]);

  const handleClose = useCallback(() => {
    if (mobile) return;
    timerRef.current = setTimeout(() => setOpenKey(null), 150);
  }, [mobile]);

  const navItems = [
    { key: 'home', href: `/${locale}`, label: t('home') },
    { key: 'products', href: `/${locale}/products`, label: t('products'), hasDropdown: true },
    { key: 'about', href: `/${locale}/about`, label: t('about'), hasDropdown: true },
    { key: 'contact', href: `/${locale}/contact`, label: t('contact') },
    { key: 'news', href: `/${locale}/news`, label: t('news') },
    { key: 'cases', href: `/${locale}/cases`, label: t('cases') },
  ];

  const aboutSubItems = [
    { key: 'company', href: `/${locale}/about`, label: 'Company Profile' },
    { key: 'certification', href: `/${locale}/about/certificate`, label: 'Certification' },
    { key: 'factory', href: `/${locale}/about/factory`, label: 'Factory Tour' },
    { key: 'quality', href: `/${locale}/about/quality`, label: 'QC Profile' },
  ];

  const baseClass = mobile
    ? 'flex flex-col gap-1'
    : 'flex items-center';

  const linkClass = mobile
    ? 'block px-3 py-2 text-sm text-gray-700 hover:text-brand-red'
    : 'px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-red whitespace-nowrap rounded';

  const dropdownLinkClass = mobile
    ? 'block px-6 py-1.5 text-sm text-gray-600 hover:text-brand-red'
    : 'block px-4 py-2.5 text-sm text-gray-600 hover:text-brand-red hover:bg-gray-50 whitespace-nowrap';

  return (
    <nav className={baseClass}>
      {navItems.map((item) =>
        item.hasDropdown ? (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => handleOpen(item.key)}
            onMouseLeave={handleClose}
          >
            {/* Button */}
            <span
              onClick={() => {
                if (mobile) setOpenKey(openKey === item.key ? null : item.key);
              }}
              className={`${linkClass} flex items-center gap-1 cursor-pointer`}
            >
              {item.label}
              <ChevronDown size={14} />
            </span>

            {/* Invisible hover bridge — fills gap between button and dropdown */}
            {!mobile && (
              <div
                className={`absolute left-0 right-0 h-3 z-40 ${openKey === item.key ? '' : 'hidden'}`}
                style={{ top: '100%' }}
              />
            )}

            {/* Dropdown — always in DOM, visibility via CSS */}
            <div
              className={
                mobile
                  ? (openKey === item.key ? 'pl-4' : 'hidden')
                  : `absolute z-50 bg-white shadow-lg rounded-md min-w-[240px] max-h-80 overflow-y-auto ${openKey === item.key ? '' : 'hidden'}`
              }
              style={mobile ? {} : { top: 'calc(100% + 8px)' }}
              onMouseEnter={clearTimer}
              onMouseLeave={handleClose}
            >
                {(item.key === 'products' ? categories : aboutSubItems).map((sub: any) => (
                  <Link
                    key={sub.slug || sub.key}
                    href={sub.slug ? `/${locale}/products?category=${sub.slug}` : sub.href}
                    className={dropdownLinkClass}
                    onClick={() => setOpenKey(null)}
                  >
                    {sub.name_en !== undefined ? loc(sub, 'name', locale) : sub.label}
                  </Link>
                ))}
              </div>
          </div>
        ) : (
          <Link key={item.key} href={item.href} className={linkClass}>
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
