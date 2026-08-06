'use client';

import { useEffect, useState } from 'react';

export default function DescriptionHtml({ html }: { html: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !html) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="mt-12 border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 border-b">
        Product Description
      </div>
      <div
        className="p-6 text-sm text-gray-600 leading-relaxed description-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
