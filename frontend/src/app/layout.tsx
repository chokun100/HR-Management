import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Libre_Franklin } from "next/font/google";
import "./globals.css";

const headline = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const body = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HR Management System",
  description: "Complete Human Resource Management System",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headline.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
