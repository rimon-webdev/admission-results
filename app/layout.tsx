import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NSU Fall 2025 — Admission Results",
  description: "Check admission test results instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
       
      </body>
    </html>
  );
}