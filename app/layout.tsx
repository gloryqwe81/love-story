import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Для тебя, любовь моя ♥",
  description:
    "Маленькая история о большой любви — фотографии, воспоминания и самые важные слова.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
