import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { APP } from "@/app.config";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP.name,
  description: APP.tagline,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} antialiased`}>
      <body className="min-h-dvh bg-stone-50 font-sans text-stone-900">{children}</body>
    </html>
  );
}
