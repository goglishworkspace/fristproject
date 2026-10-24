import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://res.cloudinary.com https://img.youtube.com;
  font-src 'self' data:;
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  media-src 'self' https://res.cloudinary.com blob: data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  // جدار حماية المحتوى والسكربتات والاتصالات (Content Security Policy)
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
  // حماية من clickjacking ومنع تضمين الموقع داخل iframe خبيث
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // منع المتصفح من تخمين نوع الملفات (MIME-type sniffing)
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // سياسة الخصوصية للمحيل (Referrer Policy)
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // تفعيل حماية ضد هجمات XSS
  {
    key: "X-XSS-Protection",
    value: "0",
  },
  // تقييد صلاحيات الكاميرا والمايكروفون والموقع الجغرافي للمتصفح
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // ضغط تلقائي للاستجابات (Gzip / Brotli) لتسريع تحميل الصفحات
  compress: true,
  // السماح بالوصول من الشبكة المحلية (الموبايل) في وضع التطوير دون حظر HMR/dev resources
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '192.168.100.41:3000',
    '192.168.100.41',
  ],
  // إخفاء هوية السيرفر (عدم إرسال X-Powered-By: Next.js) لتعزيز الأمان
  poweredByHeader: false,
  // السماح بتحميل الصور من Cloudinary واليوتيوب بأمان
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  // إضافة ترويسات الأمان الأمنية لجميع المسارات
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
