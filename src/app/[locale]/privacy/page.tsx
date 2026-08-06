import type { Metadata } from 'next';
import { companyInfo } from '@/data/company';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose space-y-4 text-gray-600 leading-relaxed">
        <p><strong>{companyInfo.name}</strong> is committed to protecting your privacy.</p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">Information We Collect</h2>
        <p>We collect your name, email, phone, and company information when you submit an inquiry form. This information is used solely to respond to your inquiry and provide our services.</p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">How We Use Your Information</h2>
        <p>Your data is used to communicate with you regarding products you are interested in. We do not sell, trade, or share your personal information with third parties.</p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">Contact</h2>
        <p>Email: {companyInfo.email}</p>
      </div>
    </div>
  );
}
