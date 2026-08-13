'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';

const API = '/api';

export default function SidebarInquiry({ leaveMessageText, sendMessageText, enterEmailText, sendText }: {
  leaveMessageText: string;
  sendMessageText: string;
  enterEmailText: string;
  sendText: string;
}) {
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!msg || !email) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message: msg,
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
    <div className="bg-white rounded-lg shadow-sm border mt-4 sticky top-[340px]">
      <div className="px-4 py-3 border-b bg-gray-900 text-white rounded-t-lg">
        <h2 className="font-semibold">{leaveMessageText}</h2>
      </div>
      <div className="p-4">
        {done ? (
          <div className="text-center py-2">
            <div className="text-green-500 text-3xl mb-2">✓</div>
            <p className="text-sm text-gray-600">Submitted!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea rows={3} value={msg} onChange={e => setMsg(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none"
              placeholder={sendMessageText} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
              placeholder={enterEmailText} />
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full flex items-center justify-center gap-1 bg-brand-red text-white py-2 rounded text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? 'Sending...' : sendText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
