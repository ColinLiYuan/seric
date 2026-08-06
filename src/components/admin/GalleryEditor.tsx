'use client';

import { useState } from 'react';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
function preImg(p: string) { if (!p) return ''; if (p.startsWith('http')) return p; return CDN + '/' + p; }

export default function GalleryEditor({ images, onChange }: { images: string; onChange: (v: string) => void }) {
  const [url, setUrl] = useState('');
  let arr: string[] = [];
  try { arr = JSON.parse(images || '[]'); } catch { arr = []; }

  function add() {
    if (!url.trim()) return;
    onChange(JSON.stringify([...arr, url.trim()]));
    setUrl('');
  }

  function remove(i: number) {
    const n = [...arr]; n.splice(i, 1);
    onChange(JSON.stringify(n));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
      {arr.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {arr.map((img: string, i: number) => (
            <div key={i} className="relative group">
              <img src={preImg(img)} alt="" className="w-20 h-20 object-cover rounded border" />
              <button onClick={() => remove(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add image URL..." className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red" />
        <button onClick={add} className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Add</button>
      </div>
    </div>
  );
}
