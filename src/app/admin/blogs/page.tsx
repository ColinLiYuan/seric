'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { blogs as blogsApi } from '@/lib/api';
import Pagination from '@/components/admin/Pagination';
import { Pencil, Trash2, Plus } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminBlogsPage() {
  const router = useRouter();
  const [all, setAll] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => { loadData(); }, []);
  async function loadData() {
    try { setAll(await blogsApi.list()); } catch (e: any) { if (e.message === 'Unauthorized') router.push('/admin/login'); }
  }
  async function del(id: number) { if (confirm('Delete?')) { await blogsApi.delete(id); loadData(); } }

  const items = useMemo(() => all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [all, page]);
  const totalPages = Math.ceil(all.length / PAGE_SIZE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Blogs <span className="text-sm font-normal text-slate-400">({all.length})</span></h2>
        <Link href="/admin/blogs/new" className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"><Plus size={16} /> Add Blog</Link>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200"><tr>
            <th className="text-left px-5 py-3 font-medium text-slate-500">ID</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Title</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Category</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Published</th>
            <th className="text-right px-5 py-3 font-medium text-slate-500">Actions</th>
          </tr></thead>
          <tbody>{items.map((b: any) => (
            <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3 text-slate-400 text-xs">{b.id}</td>
              <td className="px-5 py-3 font-medium text-slate-700">{b.titleEn}</td>
              <td className="px-5 py-3 text-slate-500">{b.category}</td>
              <td className="px-5 py-3">{b.published ? <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">● Published</span> : <span className="text-xs text-slate-400">Draft</span>}</td>
              <td className="px-5 py-3 text-right">
                <Link href={`/admin/blogs/${b.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={15} /></Link>
                <button onClick={() => del(b.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
