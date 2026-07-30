'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { products as productsApi } from '@/lib/api';
import Pagination from '@/components/admin/Pagination';
import { Pencil, Trash2, Plus } from 'lucide-react';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
const PAGE_SIZE = 20;
function img(p: any) { const s = p.image; if (!s) return ''; if (s.startsWith('http')) return s; return CDN + '/' + s; }

export default function AdminProductsPage() {
  const router = useRouter();
  const [all, setAll] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => { loadData(); }, []);
  async function loadData() { try { setAll(await productsApi.list()); } catch (e: any) { if (e.message==='Unauthorized') router.push('/admin/login'); } }
  async function del(id: number) { if (confirm('Delete?')) { await productsApi.delete(id); loadData(); } }

  const items = useMemo(() => all.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE), [all, page]);
  const totalPages = Math.ceil(all.length / PAGE_SIZE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">{all.length} products total</p>
        </div>
        <Link href="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200"><tr>
            <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">ID</th>
            <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Image</th>
            <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Name</th>
            <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Category</th>
            <th className="text-right px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{p.id}</td>
                <td className="px-5 py-3.5">
                  {p.image ? <img src={img(p)} className="w-10 h-10 object-cover rounded-lg border border-gray-200" alt="" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg" />}
                </td>
                <td className="px-5 py-3.5 font-medium text-gray-800 max-w-xs truncate">{p.name?.en || p.slug}</td>
                <td className="px-5 py-3.5"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.categorySlug}</span></td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/products/${p.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={16} /></Link>
                    <button onClick={() => del(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
