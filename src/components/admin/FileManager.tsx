'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';
import Pagination from '@/components/admin/Pagination';
import { Upload, Trash2, FileText, Film, File, X, Eye, Download, Save, Search } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:26987/api';
const PAGE_SIZE = 24;

function isImage(m: string) { return m?.startsWith('image/'); }
function isVideo(m: string) { return m?.startsWith('video/'); }
function fmtSize(b: number) { if (!b) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }
function typeIcon(m: string) { if (isImage(m)) return null; if (isVideo(m)) return <Film size={32} className="text-purple-400" />; return <FileText size={32} className="text-gray-400" />; }

export default function FileManager({ entityType }: { entityType: string }) {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [uploadCat, setUploadCat] = useState('other');
  const [editFile, setEditFile] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editCat, setEditCat] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData('', ''); }, []);
  async function doSearch() {
    setPage(1);
    await loadData(search, catFilter);
  }

  async function loadData(s?: string, c?: string) {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) { router.push('/admin/login'); return; }
      let url = `${API}/admin/files?entityType=${entityType}`;
      if (s) url += `&search=${encodeURIComponent(s)}`;
      if (c) url += `&category=${encodeURIComponent(c)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { router.push('/admin/login'); return; }
      const json = await res.json();
      setFiles(json.data || []);
    } catch (err) { console.error('Load files failed:', err); }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const flist = e.target.files; if (!flist?.length) return;
    setUploading(true);
    for (let i = 0; i < flist.length; i++) {
      const form = new FormData();
      form.append('file', flist[i]);
      form.append('entityType', entityType);
      form.append('category', uploadCat);
      await fetch(`${API}/admin/files/upload`, { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: form });
    }
    setUploading(false); loadData(search, catFilter);
  }

  async function del(id: number) { if (!confirm('Delete?')) return; await fetch(`${API}/admin/files/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } }); loadData(search, catFilter); }

  async function saveEdit() {
    if (!editFile) return;
    await fetch(`${API}/admin/files/${editFile.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ fileName: editName, category: editCat }) });
    setEditFile(null); loadData(search, catFilter);
  }

  const paged = useMemo(() => files.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [files, page]);
  const totalPages = Math.ceil(files.length / PAGE_SIZE);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{entityType === 'material' ? '素材库' : entityType === 'sample' ? '产品样本' : '询盘文件'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{files.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Upload category */}
          <input type="text" value={uploadCat} onChange={e => setUploadCat(e.target.value)}
            placeholder="category" className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-24" />
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
            <Upload size={16} /> {uploading ? 'Sending...' : 'Upload'}
          </button>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Search + category filter */}
      <div className="flex items-center gap-3 mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search..." className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:border-blue-400"
          onKeyDown={e => e.key === 'Enter' && doSearch()} />
        <input type="text" value={catFilter} onChange={e => setCatFilter(e.target.value)}
          placeholder="Category..." className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-36"
          onKeyDown={e => e.key === 'Enter' && doSearch()} />
        <button onClick={doSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
          <Search size={16} />
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><File size={48} className="mx-auto mb-3 opacity-30" /><p>No files yet</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paged.map(f => (
            <div key={f.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden">
              <div className="relative aspect-square bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden" onClick={() => isImage(f.fileType) && setPreview(f.fileUrl)}>
                {isImage(f.fileType) ? <img src={f.fileUrl} alt={f.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : typeIcon(f.fileType)}
                {isImage(f.fileType) && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center"><Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>}
                {f.category && <span className="absolute top-2 left-2 text-[10px] bg-white/80 px-1.5 py-0.5 rounded">{f.category}</span>}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 truncate font-medium">{f.fileName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{fmtSize(f.fileSize)}</p>
                <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition">
                  <a href={f.fileUrl} download={f.fileName} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded transition"><Download size={14} /></a>
                  <button onClick={() => { setEditFile(f); setEditName(f.fileName); setEditCat(f.category || ''); }}
                    className="p-1.5 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded transition"><Save size={14} /></button>
                  <button onClick={() => del(f.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && <div className="mt-4"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>}

      {/* Edit modal */}
      {editFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditFile(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Edit File</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">File Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <input value={editCat} onChange={e => setEditCat(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="category" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditFile(null)} className="px-4 py-2 text-sm text-gray-500 border rounded-lg">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreview(null)}>
          <button onClick={() => setPreview(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><X size={24} /></button>
          <img src={preview} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
