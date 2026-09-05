import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "R.E.C.O.V.E.R. | Autonomous Revenue Recovery",
  description: "Every failed payment is a decision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white selection:bg-white/30 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
