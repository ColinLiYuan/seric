import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hydra-pumps.com'),
  title: {
    default: "Hydraulic Vane Pump factory - Hydraulic Piston Pump manufacturer from China",
    template: "%s | Seric Hydraulic",
  },
  description: "China Hydraulic Vane Pump manufacturer, Guangzhou Seric Hydraulic Co., Ltd. is Hydraulic Piston Pump factory, offering quality products at factory prices.",
  openGraph: {
    type: 'website',
    siteName: 'Seric Hydraulic',
    title: 'Hydraulic Vane Pump factory - Hydraulic Piston Pump manufacturer from China',
    description: 'China Hydraulic Vane Pump manufacturer, Guangzhou Seric Hydraulic Co., Ltd.',
    url: 'https://www.hydra-pumps.com',
    images: [{ url: 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/cl211460488-guangzhou_seric_hydraulic_co_ltd.jpg', width: 800, height: 600 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Guangzhou Seric Hydraulic Co., Ltd.",
          "url": "https://www.hydra-pumps.com",
          "logo": "https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/logo.gif",
          "email": "salesseric@aliyun.com",
          "telephone": "+86 17620189025",
          "address": { "@type": "PostalAddress", "addressLocality": "Guangzhou", "addressCountry": "CN" },
          "sameAs": ["https://wa.me/85362157192"]
        }) }} />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
