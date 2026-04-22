import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR System — Workforce Management",
  description: "Manage employees, attendance, payroll, and leave requests in one place.",
  icons: {
    icon: [
      { url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%235b5fcf%22/%3E%3Ctext x=%2250%22 y=%2268%22 font-size=%2255%22 font-family=%22system-ui%22 font-weight=%22700%22 text-anchor=%22middle%22 fill=%22white%22%3EHR%3C/text%3E%3C/svg%3E' },
    ],
  },
  openGraph: {
    title: "HR System — Workforce Management",
    description: "Manage employees, attendance, payroll, and leave requests in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
