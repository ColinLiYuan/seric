'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';
import Pagination from '@/components/admin/Pagination';
import TagInput from '@/components/admin/TagInput';
import { Upload, Trash2, FileText, Film, File, X, Eye, Download, Save, Search } from 'lucide-react';

const API = '/api';
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
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [editFile, setEditFile] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); loadAllTags(); }, []);

  async function loadAllTags() {
    try {
      const token = getToken(); if (!token) return;
      const res = await fetch(`${API}/admin/files/tags?entityType=${entityType}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.code === 200) setAllTags(json.data || []);
    } catch {}
  }

  async function doSearch() {
    setPage(1);
    await loadData();
  }

  async function loadData() {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) { router.push('/admin/login'); return; }
      let url = `${API}/admin/files?entityType=${entityType}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
      if (filterTags.length > 0) url += `&tags=${encodeURIComponent(filterTags.join(','))}`;
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
      form.append('tags', JSON.stringify(uploadTags));
      await fetch(`${API}/admin/files/upload`, { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: form });
    }
    setUploading(false);
    setUploadTags([]);
    loadData();
    loadAllTags();
  }

  async function del(id: number) {
    if (!confirm('Delete?')) return;
    await fetch(`${API}/admin/files/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
    loadData();
    loadAllTags();
  }

  async function saveEdit() {
    if (!editFile) return;
    await fetch(`${API}/admin/files/${editFile.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ fileName: editName, tags: editTags }),
    });
    setEditFile(null);
    loadData();
    loadAllTags();
  }

  const paged = useMemo(() => files.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [files, page]);
  const totalPages = Math.ceil(files.length / PAGE_SIZE);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {entityType === 'material' ? '素材库' : entityType === 'sample' ? '产品样本' : '询盘文件'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{files.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
            <Upload size={16} /> {uploading ? 'Sending...' : 'Upload'}
          </button>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Upload tags */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 whitespace-nowrap">Upload tags:</span>
          <div className="flex-1 max-w-md">
            <TagInput tags={uploadTags} suggestions={allTags} onChange={setUploadTags} placeholder="Upload tag..." />
          </div>
        </div>
      </div>

      {/* Search + tag filter */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search file name..." className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:border-blue-400"
            onKeyDown={e => e.key === 'Enter' && doSearch()} />
          <div className="flex-1 max-w-md">
            <TagInput tags={filterTags} suggestions={allTags} onChange={setFilterTags} placeholder="Filter by tags..." />
          </div>
          <button onClick={doSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* File grid */}
      {files.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <File size={48} className="mx-auto mb-3 opacity-30" />
          <p>No files yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paged.map(f => (
            <div key={f.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden">
              <div className="relative aspect-square bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => isImage(f.fileType) && setPreview(f.fileUrl)}>
                {isImage(f.fileType)
                  ? <img src={f.fileUrl} alt={f.fileName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  : typeIcon(f.fileType)}
                {isImage(f.fileType) && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                {f.tags && f.tags.length > 0 && (
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
                    {f.tags.slice(0, 3).map((t: string, i: number) => (
                      <span key={i} className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                    {f.tags.length > 3 && (
                      <span className="text-[10px] bg-white/80 px-1 py-0.5 rounded">+{f.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 truncate font-medium">{f.fileName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{fmtSize(f.fileSize)}</p>
                <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition">
                  <a href={f.fileUrl} download={f.fileName}
                    className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded transition"><Download size={14} /></a>
                  <button onClick={() => { setEditFile(f); setEditName(f.fileName); setEditTags(f.tags || []); }}
                    className="p-1.5 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded transition"><Save size={14} /></button>
                  <button onClick={() => del(f.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
      )}

      {/* Edit modal */}
      {editFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditFile(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Edit File</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">File Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
                <TagInput tags={editTags} suggestions={allTags} onChange={setEditTags} />
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
          <button onClick={() => setPreview(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <X size={24} />
          </button>
          <img src={preview} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
