'use client';

import { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { companyInfo } from '@/data/company';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const API = '/api';

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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-brand-red mt-1" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-gray-600">{companyInfo.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={20} className="text-brand-red mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <a href={`mailto:${companyInfo.email}`} className="text-gray-600 hover:text-brand-red">
                {companyInfo.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={20} className="text-brand-red mt-1" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <a href={`tel:${companyInfo.phone}`} className="text-gray-600 hover:text-brand-red">
                {companyInfo.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-green-700 mb-2">Submitted successfully!</h3>
              <p className="text-green-600">We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red"
              />
              <input
                type="email"
                placeholder="Your E-mail *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red"
              />
              <input
                type="text"
                placeholder="Your Phone or WhatsApp"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red"
              />
              <input
                type="text"
                placeholder="Your Company Name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red"
              />
              <textarea
                placeholder="Briefly describe your requirement *"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red"
              />
              <button
                type="submit"
                className="w-full bg-brand-red text-white py-3 rounded font-semibold hover:bg-red-700 transition"
              >
                Send &gt;&gt;
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
