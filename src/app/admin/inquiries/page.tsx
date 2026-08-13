'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';
import Pagination from '@/components/admin/Pagination';

const API = '/api';
const PAGE_SIZE = 20;

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [all, setAll] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => { loadData(); }, []);
  async function loadData() {
    try {
      const res = await fetch(`${API}/admin/inquiries`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.status === 401) { router.push('/admin/login'); return; }
      const json = await res.json();
      setAll(json.data || []);
    } catch {}
  }

  const items = useMemo(() => all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [all, page]);
  const totalPages = Math.ceil(all.length / PAGE_SIZE);

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Inquiries <span className="text-sm font-normal text-slate-400">({all.length})</span></h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200"><tr>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Date</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Name</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Phone</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Product</th>
            <th className="text-left px-5 py-3 font-medium text-slate-500">Message</th>
          </tr></thead>
          <tbody>{items.map((iq: any) => (
            <tr key={iq.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap">{iq.createdAt?.substring(0, 10)}</td>
              <td className="px-5 py-3 font-medium text-slate-700">{iq.name}</td>
              <td className="px-5 py-3 text-slate-500">{iq.email}</td>
              <td className="px-5 py-3 text-slate-500">{iq.phone}</td>
              <td className="px-5 py-3 text-slate-400 max-w-[120px] truncate">{iq.productSlug}</td>
              <td className="px-5 py-3 text-slate-500 max-w-[250px] truncate">{iq.message}</td>
            </tr>
          ))}</tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
