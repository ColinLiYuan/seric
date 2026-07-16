'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { products as productsApi, isLoggedIn, clearToken } from '@/lib/api';
import { Pencil, Trash2, Plus, LogOut, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/admin/login'); return; }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try { setItems(await productsApi.list()); } catch (err: any) {
      if (err.message === 'Unauthorized') router.push('/admin/login');
    }
    setLoading(false);
  }

  async function deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    await productsApi.delete(id);
    loadData();
  }

  function logout() {
    clearToken();
    router.push('/admin/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} /> Products
          </h1>
          <span className="text-sm text-gray-500">{items.length} total</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new" className="flex items-center gap-1.5 bg-brand-red text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition">
            <Plus size={16} /> Add Product
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Image</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Featured</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p: any) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{p.id}</td>
                  <td className="px-4 py-3">
                    {p.image && <img src={p.image} className="w-10 h-10 object-cover rounded" alt="" />}
                  </td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{p.name?.en || p.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{p.categorySlug}</td>
                  <td className="px-4 py-3">{p.featured ? '⭐' : ''}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 text-sm text-gray-500 border-t">{items.length} products</div>
        </div>
      )}
    </div>
  );
}
