import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
export const metadata: Metadata = { title: "USOB Bareggio", description: "App ufficiale USOB Bareggio" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20">
        <header className="bg-[#1a3a6b] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow">
          <div className="w-9 h-9 rounded-full bg-[#f5c518] flex items-center justify-center text-[#1a3a6b] font-bold text-xs flex-shrink-0">USOB</div>
          <div>
            <p className="font-semibold text-sm leading-tight">USOB Bareggio</p>
            <p className="text-xs text-blue-200">Stagione 2024/25</p>
          </div>
        </header>
        <main className="p-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
