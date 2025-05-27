import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "./providers";

import Header from "@/components/Header";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
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
    <html lang="ja" className={`${notoSansJP.variable} bg-black min-h-full`}>
      <body className="font-sans w-sm mx-auto bg-white min-h-[100vh]">
        <SupabaseProvider>
          <Header />
          <main className="px-4">{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
