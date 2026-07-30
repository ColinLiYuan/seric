'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { blogs as blogsApi, isLoggedIn } from '@/lib/api';
import ImageUploader from '@/components/admin/ImageUploader';
import { ArrowLeft, Save } from 'lucide-react';

export default function BlogEditPage() {
  const params = useParams(); const id = params.id as string; const isNew = id === 'new';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ slug: '', titleEn: '', titleZh: '', image: '', summaryEn: '', summaryZh: '', contentEn: '', contentZh: '', category: '', published: true });

  useEffect(() => { if (!isLoggedIn()) { router.push('/admin/login'); return; } if (!isNew) loadData(); }, []);

  async function loadData() {
    try {
      const all = await blogsApi.list();
      const b = all.find((x: any) => String(x.id) === id);
      if (b) setForm({ slug: b.slug || '', titleEn: b.titleEn || '', titleZh: b.titleZh || '', image: b.image || '', summaryEn: b.summaryEn || '', summaryZh: b.summaryZh || '', contentEn: b.contentEn || '', contentZh: b.contentZh || '', category: b.category || '', published: b.published });
    } catch (e: any) { if (e.message === 'Unauthorized') router.push('/admin/login'); }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = { ...form, slug: form.slug || form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') };
      if (isNew) await blogsApi.create(payload); else await blogsApi.update(parseInt(id), payload);
      router.push('/admin/products');
    } catch (e: any) { alert('Save failed: ' + e.message); }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-brand-red"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold">{isNew ? 'New Blog' : 'Edit Blog'}</h1>
      </div>
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label><input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label><input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label><ImageUploader value={form.image} onChange={(url) => setForm({...form, image: url})} /></div>
          <div className="col-span-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> Published</label></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Summary (EN)</label><textarea value={form.summaryEn} onChange={e => setForm({...form, summaryEn: e.target.value})} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Content (EN)</label><textarea value={form.contentEn} onChange={e => setForm({...form, contentEn: e.target.value})} rows={12} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono" /></div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/admin/products" className="px-4 py-2 text-sm text-gray-600 border rounded">Cancel</Link>
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-1.5 bg-brand-red text-white px-6 py-2 rounded text-sm font-semibold hover:bg-red-700 disabled:opacity-50"><Save size={16} /> {loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
