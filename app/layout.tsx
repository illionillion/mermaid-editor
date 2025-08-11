import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mermaid フローチャート エディター",
  description: "Mermaidフローチャートを作成・編集するためのWebベースのツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
