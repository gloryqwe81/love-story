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
  metadataBase: new URL("https://gloryqwe81.github.io"),
  title: "Николь, это для тебя ♥",
  description:
    "Личная вселенная для Николь — фотографии, музыка и самые важные слова о любви.",
  openGraph: {
    title: "Николь, это для тебя ♥",
    description: "Личная вселенная, созданная с любовью.",
    images: [{ url: "/love-story/og.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Николь, это для тебя ♥",
    description: "Личная вселенная, созданная с любовью.",
    images: ["/love-story/og.png"],
  },
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
