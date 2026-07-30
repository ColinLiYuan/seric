'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(isLoggedIn() ? '/admin/products' : '/admin/login');
  }, []);
  return null;
}
