'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn, clearToken } from '@/lib/api';
import { Package, FileText, MessageSquare, LogOut, FolderOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const menu = [
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { label: 'Files', icon: FolderOpen, children: [
    { href: '/admin/files/material', label: '素材库' },
    { href: '/admin/files/sample', label: '产品样本' },
    { href: '/admin/files/inquiry', label: '询盘文件' },
  ]},
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [filesOpen, setFilesOpen] = useState(true);

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-700/50">
          <Link href="/admin/products" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-white text-base tracking-tight">Seric Admin</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menu.map(item => {
            if (item.children) {
              const active = pathname.startsWith('/admin/files');
              return (
                <div key={item.label}>
                  <button onClick={() => setFilesOpen(!filesOpen)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      active ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                    }`}>
                    <item.icon size={18} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown size={14} className={`transition-transform ${filesOpen ? '' : '-rotate-90'}`} />
                  </button>
                  {filesOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 pl-4 border-l border-gray-700">
                      {item.children.map(c => (
                        <Link key={c.href} href={c.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            pathname === c.href
                              ? 'text-blue-400 bg-blue-500/10'
                              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                          }`}>{c.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active ? 'text-blue-400 bg-gray-800 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-700/50 p-3">
          <button onClick={() => { clearToken(); router.push('/admin/login'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 w-full transition-all duration-200">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
