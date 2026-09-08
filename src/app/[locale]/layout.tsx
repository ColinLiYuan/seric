import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { categories as categoriesData } from '@/data/categories';

// Pre-generate one page per locale so the whole `[locale]` tree can be
// statically rendered / ISR instead of rendering on every request.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isDefault = locale === 'en';
  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `/${loc}`;
  }

  return {
    alternates: {
      canonical: isDefault ? 'https://www.hydra-pumps.com' : `https://www.hydra-pumps.com/${locale}`,
      languages: alternates,
    },
    openGraph: {
      locale: locale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering: without this, next-intl reads the request headers
  // to resolve the locale, which opts the whole `[locale]` tree into dynamic
  // (SSR) rendering and burns Vercel function CPU on every request.
  setRequestLocale(locale);

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages({ locale });
  const categories = categoriesData.map(c => ({
    slug: c.slug,
    name_en: (c.name as Record<string, string>)['en'] || c.slug,
  }));

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header locale={locale} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
