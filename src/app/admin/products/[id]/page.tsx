'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { products as productsApi, isLoggedIn } from '@/lib/api';
import { categories as hardcodedCats } from '@/data/categories';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import GalleryEditor from '@/components/admin/GalleryEditor';

export default function AdminProductEditPage() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    nameEn: '',
    image: '',
    images: '[]',
    price: '',
    categorySlug: '',
    featured: false,
    topSelling: false,
    descriptionEn: '',
  });

  const cats = hardcodedCats.map(c => ({
    slug: c.slug,
    name: (c.name as Record<string, string>)['en'] || c.slug,
  }));

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/admin/login'); return; }
    loadData();
  }, []);

  async function loadData() {
    if (!isNew) {
      try {
        const all = await productsApi.list();
        const p = all.find((x: any) => String(x.id) === id);
        if (p) {
          setForm({
            slug: p.slug || '',
            nameEn: p.name?.en || '',
            image: p.image || '',
            images: '[]',
            price: p.price || '',
            categorySlug: p.categorySlug || '',
            featured: p.featured || false,
            topSelling: p.topSelling || false,
            descriptionEn: '',
          });
          try {
            const detail = await productsApi.getBySlug(p.slug);
            if (detail) {
              setForm(prev => ({
                ...prev,
                images: JSON.stringify(detail.images || []),
                descriptionEn: detail.description?.en || '',
                categorySlug: detail.categorySlug || prev.categorySlug,
              }));
            }
          } catch {}
        }
      } catch (err: any) {
        if (err.message === 'Unauthorized') router.push('/admin/login');
      }
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = {
        slug: form.slug || form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
        name: { en: form.nameEn },
        image: form.image,
        images: JSON.parse(form.images || '[]'),
        price: form.price,
        categorySlug: form.categorySlug,
        featured: form.featured,
        topSelling: form.topSelling,
        description: form.descriptionEn ? { en: form.descriptionEn } : undefined,
      };

      if (isNew) await productsApi.create(payload);
      else await productsApi.update(parseInt(id), payload);
      router.push('/admin/products');
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-brand-red">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">{isNew ? 'New Product' : 'Edit Product'}</h1>
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">English Name</label>
            <input value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.categorySlug} onChange={e => setForm({...form, categorySlug: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red">
              <option value="">-- Select --</option>
              {cats.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            <ImageUploader value={form.image} onChange={(url) => setForm({...form, image: url})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.topSelling} onChange={e => setForm({...form, topSelling: e.target.checked})} />
              Top Selling
            </label>
          </div>
        </div>

        <GalleryEditor images={form.images} onChange={(v) => setForm({...form, images: v})} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (HTML)</label>
          <textarea value={form.descriptionEn} onChange={e => setForm({...form, descriptionEn: e.target.value})}
            rows={8} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/admin/products" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded">Cancel</Link>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-1.5 bg-brand-red text-white px-6 py-2 rounded text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50">
            <Save size={16} /> {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
