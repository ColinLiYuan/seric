import { companyInfo } from '@/data/company';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default async function FactoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  return (
    <div>
      {/* Banner */}
      <div className="relative w-full h-64 md:h-80 bg-gray-900 overflow-hidden">
        <img
          src="/images/cs206444715-.jpg"
          alt="Factory Tour"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t('factoryTour')}</h2>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-brand-red flex items-center gap-1">
              <Home size={14} />
              {tc('home')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{companyInfo.name} {t('factoryTour')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border sticky top-24">
              <div className="px-4 py-3 border-b bg-brand-red text-white rounded-t-lg">
                <h2 className="font-semibold">{t('aboutUs')}</h2>
              </div>
              <nav className="py-2">
                <Link
                  href={`/${locale}/about`}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {t('companyProfile')}
                </Link>
                <Link
                  href={`/${locale}/about/factory`}
                  className="block px-4 py-2.5 text-sm bg-red-50 text-brand-red font-semibold border-r-2 border-brand-red"
                >
                  {t('factoryTour')}
                </Link>
                <Link
                  href={`/${locale}/about/certificate`}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {t('certifications')}
                </Link>
                <Link
                  href={`/${locale}/about/quality`}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {t('qcProfile')}
                </Link>
              </nav>
            </div>

            {/* Contact form sidebar */}
            <div className="bg-white rounded-lg shadow-sm border mt-4 sticky top-[340px]">
              <div className="px-4 py-3 border-b bg-gray-900 text-white rounded-t-lg">
                <h2 className="font-semibold">{t('leaveMessage')}</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none"
                    placeholder={t('sendMessage')}
                  />
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                    placeholder={t('enterEmail')}
                  />
                  <button
                    type="button"
                    className="w-full bg-brand-red text-white py-2 rounded text-sm font-semibold hover:bg-red-700 transition"
                  >
                    {tc('send')}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyInfo.name}</h1>
            </div>

            {/* Production Line Images */}
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/cl206225628-guangzhou_seric_hydraulic_co_ltd.jpg"
                  alt="Production Line"
                  className="w-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/cl206225626-guangzhou_seric_hydraulic_co_ltd.jpg"
                  alt="Production Line"
                  className="w-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/cl206225627-guangzhou_seric_hydraulic_co_ltd.jpg"
                  alt="Production Line"
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* Production Description */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-red inline-block">
                {t('productionLine')}
              </h2>
              <div className="text-gray-600 leading-relaxed text-base">
                <p>
                  Seric&apos;s vertically integrated manufacturing ensures precision control from raw material sourcing to final testing.
                  Our production facility is equipped with advanced CNC machining centers, precision grinding machines, and comprehensive
                  testing equipment to deliver consistent, high-quality hydraulic components.
                </p>
              </div>
            </section>

            {/* Company Info Cards */}
            <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand-red">{companyInfo.founded}</div>
                <div className="text-xs text-gray-500 mt-1">{t('yearEstablished')}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand-red">{companyInfo.stats.employees}+</div>
                <div className="text-xs text-gray-500 mt-1">{t('employees')}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand-red">{companyInfo.exportPercentage}</div>
                <div className="text-xs text-gray-500 mt-1">{t('exportPercentage')}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand-red">$100M</div>
                <div className="text-xs text-gray-500 mt-1">{t('annualSales')}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
