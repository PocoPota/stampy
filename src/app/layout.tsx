import type { Metadata } from "next";
import { Noto_Sans_JP } from 'next/font/google';
import "./globals.css";
import { SupabaseProvider } from "./providers";

import Header from "@/components/ui/Header";

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Stampy | 勤怠管理アプリ",
  description: "こんにちは。私はStampy。あなたの勤怠を管理します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable}`}>
      <body
         className="font-sans"
      >
        <SupabaseProvider>
          <Header/>
        {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
