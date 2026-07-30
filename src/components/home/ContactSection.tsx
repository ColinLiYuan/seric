'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';

export default function ContactSection({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const ct = useTranslations('contact');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:26987/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sourceUrl: window.location.href }),
      });
    } catch {}
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">{t('contactTitle')}</h2>
        <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
          <MapPin size={18} />
          <span className="text-sm">
            Room 211, No. 9, Wanyu Street, Huangpu District, Guangzhou City
          </span>
        </div>

        {submitted ? (
          <div className="bg-green-600 text-white rounded-lg p-8 mt-8">
            <h3 className="text-2xl font-bold mb-2">Submitted successfully!</h3>
            <p>We will call you back soon!</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mt-8 mb-6">{t('contactSubtitle')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={ct('yourName')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-brand-red"
                />
                <input
                  type="email"
                  placeholder={ct('yourEmail')}
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-brand-red"
                />
                <input
                  type="text"
                  placeholder={ct('yourPhone')}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-brand-red"
                />
                <input
                  type="text"
                  placeholder={ct('yourCompany')}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-brand-red"
                />
              </div>
              <textarea
                placeholder={ct('yourMessage')}
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-brand-red"
              />
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-brand-red text-white px-10 py-3 rounded font-semibold hover:bg-red-700 transition"
                >
                  Send &gt;&gt;
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
