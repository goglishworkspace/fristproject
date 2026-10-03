import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "منصة الوعي بقضايا البيئة للمرحلة الثانوية • كلية الدراسات العليا والبحوث البيئية - جامعة عين شمس",
  description: "منصة الوعي بقضايا البيئة للمرحلة الثانوية - كلية الدراسات العليا والبحوث البيئية جامعة عين شمس - محتوى وموديولات تفاعلية وامتحانات تقييمية",
  icons: {
    icon: [
      { url: '/asu-logo.jpg' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/asu-logo.jpg' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 overflow-x-hidden w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
