'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { companyInfo } from '@/data/company';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:26987/api';

interface Props {
  open: boolean;
  onClose: () => void;
  productSlug?: string;
  productName?: string;
}

export default function InquiryModal({ open, onClose, productSlug, productName }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          productSlug: productSlug || '',
          subject: productName ? `Inquiry about: ${productName}` : '',
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
      setDone(true);
    } catch (err) {
      console.error('Submit failed', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b bg-brand-red text-white rounded-t-lg">
          <h3 className="font-semibold">
            {done ? 'Submitted!' : productName ? `Inquiry: ${productName}` : 'Send Inquiry'}
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-gray-700 font-semibold mb-2">Thank you for your inquiry!</p>
            <p className="text-sm text-gray-500">We will reply within 24 hours.</p>
            <p className="text-sm text-gray-500 mt-1">Email: {companyInfo.email} | Phone: {companyInfo.phone} | WA: +853 6215 7192</p>
            <button onClick={onClose} className="mt-4 bg-brand-red text-white px-6 py-2 rounded text-sm hover:bg-red-700">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <input required type="text" placeholder="Your Name *" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
            <input required type="email" placeholder="Your Email *" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
            <input type="text" placeholder="Phone / WhatsApp" value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
            <input type="text" placeholder="Company Name" value={form.company}
              onChange={e => setForm({...form, company: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
            <textarea required rows={4} placeholder="Your Message *" value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none" />
            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-2.5 rounded font-semibold hover:bg-red-700 transition disabled:opacity-50">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {submitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
