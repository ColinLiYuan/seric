'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Menu, X } from 'lucide-react';
import Navigation from './Navigation';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

export default function Header({ locale, categories }: { locale: string; categories: any[] }) {
  const t = useTranslations('common');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <img
              src="/images/logo.gif"
              alt="Guangzhou Seric Hydraulic Co., Ltd."
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Navigation locale={locale} categories={categories} />
          </div>

          {/* Desktop Right: Search + Language + Quote */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    placeholder={t('search')}
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-brand-red"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-brand-red"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            <LanguageSwitcher locale={locale} />

            <Link
              href={`/${locale}/quote`}
              className="bg-brand-red text-white px-5 py-2 rounded text-sm font-semibold hover:bg-red-700 transition"
            >
              {t('quote')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t">
            <div className="pt-3">
              <Navigation locale={locale} mobile />
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t">
              <LanguageSwitcher locale={locale} />
              <Link
                href={`/${locale}/quote`}
                className="bg-brand-red text-white px-5 py-2 rounded text-sm font-semibold"
              >
                {t('quote')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
