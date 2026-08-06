'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import InquiryModal from './InquiryModal';

export default function ActionButtons({
  getBestPriceText,
  productSlug,
  productName,
}: {
  getBestPriceText: string;
  productSlug: string;
  productName: string;
}) {
  const [showInquiry, setShowInquiry] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setShowInquiry(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#ff8a3d] to-[#e6731a] text-white px-6 py-3.5 rounded font-semibold hover:from-[#e6731a] hover:to-[#cc5f0a] transition text-base"
        >
          <Mail size={18} />
          {getBestPriceText}
        </button>
      </div>
      <InquiryModal
        open={showInquiry}
        onClose={() => setShowInquiry(false)}
        productSlug={productSlug}
        productName={productName}
      />
    </>
  );
}
