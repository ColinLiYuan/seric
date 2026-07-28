'use client';

import { useState } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
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
        <button
          onClick={() => setShowInquiry(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#4caf50] to-[#388e3c] text-white px-6 py-3 rounded font-semibold hover:from-[#388e3c] hover:to-[#2e7d32] transition text-sm"
        >
          <MessageCircle size={16} />
          Chat Now
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
