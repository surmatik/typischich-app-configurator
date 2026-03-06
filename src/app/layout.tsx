import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Konfigurator - Typisch Ich",
  description: "",
  icons: {
    icon: "https://typischich.ch/cdn/shop/files/logo_black.png?v=1740907843&width=140",
    shortcut: "https://typischich.ch/cdn/shop/files/logo_black.png?v=1740907843&width=140",
    apple: "https://typischich.ch/cdn/shop/files/logo_black.png?v=1740907843&width=140",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
