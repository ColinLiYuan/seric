import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hydraulic Vane Pump factory - Hydraulic Piston Pump manufacturer from China",
  description:
    "China Hydraulic Vane Pump manufacturer, Guangzhou Seric Hydraulic Co., Ltd. is Hydraulic Piston Pump factory, offering quality products at factory prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
