import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "المنصة التعليمية • كلية التربية جامعة عين شمس",
  description: "المنصة التعليمية للكلية - محتوى وموديولات تفاعلية وامتحانات تقييمية",
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
