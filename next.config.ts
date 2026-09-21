import type { NextConfig } from "next";

const securityHeaders = [
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
    value: "1; mode=block",
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
  // إخفاء هوية السيرفر (عدم إرسال X-Powered-By: Next.js) لتعزيز الأمان
  poweredByHeader: false,
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
