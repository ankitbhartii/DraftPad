import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Wattpad - Where stories live",
  description: "Wattpad connects a global community of millions of readers and writers through the power of story. Read, write, and share original stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#f9f9fb] dark:bg-[#0f0f12] text-gray-900 dark:text-zinc-100 transition-colors">
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
