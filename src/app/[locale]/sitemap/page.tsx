import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = { title: 'Sitemap' };

export default async function SitemapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  const pages = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/about/factory`, label: 'Factory Tour' },
    { href: `/${locale}/about/certificate`, label: 'Certifications' },
    { href: `/${locale}/about/quality`, label: 'QC Profile' },
    { href: `/${locale}/contact`, label: t('contact') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/cases`, label: t('cases') },
    { href: `/${locale}/quote`, label: t('quote') },
    { href: `/${locale}/privacy`, label: 'Privacy Policy' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Sitemap</h1>
      <ul className="space-y-2">
        {pages.map(p => (
          <li key={p.href}><Link href={p.href} className="text-brand-red hover:underline">{p.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
