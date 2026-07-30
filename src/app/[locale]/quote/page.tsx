'use client';

import { useState } from 'react';

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:26987/api';
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}/inquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sourceUrl: window.location.href }) });
    } catch {}
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Get a Quote</h1>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-green-700 mb-2">Submitted successfully!</h3>
          <p className="text-green-600">We will get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-8 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red bg-white"
            />
            <input
              type="email"
              placeholder="Your E-mail *"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red bg-white"
            />
            <input
              type="text"
              placeholder="Your Phone or WhatsApp"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red bg-white"
            />
            <input
              type="text"
              placeholder="Your Company Name"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red bg-white"
            />
          </div>
          <textarea
            placeholder="Briefly describe your requirement *"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 border rounded focus:outline-none focus:border-brand-red bg-white"
          />
          <button
            type="submit"
            className="w-full bg-brand-red text-white py-3 rounded font-semibold hover:bg-red-700 transition text-lg"
          >
            Submit Quote Request
          </button>
        </form>
      )}
    </div>
  );
}
