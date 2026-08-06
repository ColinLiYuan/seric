import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { categories as categoriesData } from '@/data/categories';

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
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const categories = categoriesData.map(c => ({
    slug: c.slug,
    name_en: (c.name as Record<string, string>)['en'] || c.slug,
  }));

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header locale={locale} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
