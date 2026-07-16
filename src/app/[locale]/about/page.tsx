import { companyInfo } from '@/data/company';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, Home, Mail, Phone, MapPin } from 'lucide-react';

export default async function AboutPage({
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
          alt="About Us"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t('companyProfile')}</h2>
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
            <span className="text-gray-900 font-medium">{companyInfo.name} {t('companyProfile')}</span>
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
                  className="block px-4 py-2.5 text-sm bg-red-50 text-brand-red font-semibold border-r-2 border-brand-red"
                >
                  {t('companyProfile')}
                </Link>
                <Link
                  href={`/${locale}/about/factory`}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
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
            {/* Company Name & Slogan */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyInfo.name}</h1>
              <p className="text-gray-500 italic">
                Seric produces, and sells hydraulic valves, pumps etc. for global markets, with a focus on quality and affordability.
              </p>
            </div>

            {/* Main Company Image */}
            <div className="mb-10 rounded-lg overflow-hidden">
              <img
                src="/images/cl211460488-guangzhou_seric_hydraulic_co_ltd.jpg"
                alt={`${companyInfo.name} Company Profile`}
                className="w-full object-cover"
              />
            </div>

            {/* Introduction Section */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-red inline-block">
                {t('introduction')}
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 text-base">
                <p>{companyInfo.description.split('\n\n')[0]}</p>
                <p>{companyInfo.description.split('\n\n')[1]}</p>
                <p><strong>{t('companyAim')}</strong> {t('aimText')}</p>
                <p><strong>{t('companyPhilosophy')}</strong> {t('philosophyText')}</p>
              </div>
              <div className="mt-6 rounded-lg overflow-hidden">
                <img
                  src="/images/editor/20251230165037_83450.jpg"
                  alt="Production Facility"
                  className="w-full object-cover"
                />
              </div>
            </section>

            {/* Services Section */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-red inline-block">
                {t('services')}
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 text-base">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t('drivingIndustry')}</h3>
                  <p>{t('drivingIndustryDesc')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t('whatWeProvide')}</h3>
                  <p><strong>{t('coreProducts')}:</strong> {t('coreProductsDesc')}</p>
                  <p><strong>{t('criticalIndustries')}:</strong> {t('criticalIndustriesDesc')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t('ourCommitment')}</h3>
                  <p><strong>{t('qualitySurvival')}:</strong> {t('qualitySurvivalDesc')}</p>
                  <p><strong>{t('valueFirst')}:</strong> {t('valueFirstDesc')}</p>
                  <p><strong>{t('globalReach')}:</strong> {t('globalReachDesc')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{t('letsWorkTogether')}</h3>
                  <p>{t('letsWorkTogetherDesc')}</p>
                </div>
              </div>
              <div className="mt-6 rounded-lg overflow-hidden">
                <img
                  src="/images/editor/20251230170634_58377.jpg"
                  alt="Services"
                  className="w-full object-cover"
                />
              </div>
            </section>

            {/* History Section */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-red inline-block">
                {t('history')}
              </h2>
              <div className="text-gray-600 leading-relaxed text-base">
                <p>
                  Founded in 2008, Seric has established itself as a dedicated player in the hydraulic equipment industry. Specializing in solenoid valves, vane pumps, hydraulic motors, and related components, we have steadily expanded our global reach and customer base. Our commitment to quality and service has earned us a strong reputation and the trust of clients worldwide. Seric contributes to industrial progress and facilitates global economic and technical exchange. We look forward to building lasting partnerships and shaping a brighter future in hydraulics together.
                </p>
              </div>
            </section>

            {/* Team Section */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-red inline-block">
                {t('team')}
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-3 text-base">
                <p>
                  Seric&apos;s core engineering and operations team brings together over a decade of hydraulic expertise. Guided by seasoned professionals, we maintain full control from product design to quality assurance. Every project benefits from dedicated support and agile solutions tailored to global industrial needs.
                </p>
                <p>
                  Contact us today to discuss how our specialized approach can serve your requirements.
                </p>
              </div>
              <div className="mt-6 rounded-lg overflow-hidden">
                <img
                  src="/images/editor/20251230173118_31310.jpg"
                  alt="Seric Team"
                  className="w-full object-cover"
                />
              </div>
            </section>

            {/* Company Stats */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-brand-red inline-block">
                {t('companyFacts')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-brand-red">{companyInfo.founded}</div>
                  <div className="text-sm text-gray-500 mt-2">{t('yearEstablished')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-brand-red">{companyInfo.stats.employees}+</div>
                  <div className="text-sm text-gray-500 mt-2">{t('employees')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-brand-red">{companyInfo.exportPercentage}</div>
                  <div className="text-sm text-gray-500 mt-2">{t('exportPercentage')}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-brand-red">$100M</div>
                  <div className="text-sm text-gray-500 mt-2">{t('annualSales')}</div>
                </div>
              </div>
            </section>

            {/* Contact Info Cards */}
            <section className="mb-10">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t('address')}</div>
                    <div className="text-sm text-gray-500">{companyInfo.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t('email')}</div>
                    <a href={`mailto:${companyInfo.email}`} className="text-sm text-gray-500 hover:text-brand-red">
                      {companyInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t('phone')}</div>
                    <a href={`tel:${companyInfo.phone}`} className="text-sm text-gray-500 hover:text-brand-red">
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
