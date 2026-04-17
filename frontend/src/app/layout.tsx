import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Management System",
  description: "Complete Human Resource Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
