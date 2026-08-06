import { companyInfo } from '@/data/company';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import SidebarInquiry from '@/components/layout/SidebarInquiry';
import { ChevronRight, Home, Award, CheckCircle, Shield } from 'lucide-react';

export default async function CertificatePage({
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
          src="https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/cs206444715-.jpg"
          alt="Certifications"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t('certifications')}</h2>
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
            <span className="text-gray-900 font-medium">{companyInfo.name} {t('certifications')}</span>
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
                <Link href={`/${locale}/about`} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                  {t('companyProfile')}
                </Link>
                <Link href={`/${locale}/about/factory`} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                  {t('factoryTour')}
                </Link>
                <Link href={`/${locale}/about/certificate`} className="block px-4 py-2.5 text-sm bg-red-50 text-brand-red font-semibold border-r-2 border-brand-red">
                  {t('certifications')}
                </Link>
                <Link href={`/${locale}/about/quality`} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                  {t('qcProfile')}
                </Link>
              </nav>
            </div>
            <div className="bg-white rounded-lg shadow-sm border mt-4 sticky top-[340px]">
              <div className="px-4 py-3 border-b bg-gray-900 text-white rounded-t-lg">
                <h2 className="font-semibold">{t('leaveMessage')}</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <textarea rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none" placeholder={t('sendMessage')} />
                  <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" placeholder={t('enterEmail')} />
                  <button type="button" className="w-full bg-brand-red text-white py-2 rounded text-sm font-semibold hover:bg-red-700 transition">
                    {tc('send')}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("certifications")}</h1>
            </div>

            {/* Certification Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">CE Certification</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Our products meet European safety, health, and environmental protection standards.
                  </p>
                </div>
              </div>
              <div className="bg-white border rounded-lg p-6 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">ISO 9001:2015</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Certified quality management system ensuring consistent product quality and customer satisfaction.
                  </p>
                </div>
              </div>
              <div className="bg-white border rounded-lg p-6 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">RoHS Compliance</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    All materials comply with the EU Restriction of Hazardous Substances directive.
                  </p>
                </div>
              </div>
              <div className="bg-white border rounded-lg p-6 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">OEM/ODM Capability</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    We accept OEM and ODM orders, providing custom solutions tailored to your specifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
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
