import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// قائمة المسارات المحمية التي تتطلب تسجيل دخول حقيقي
const PROTECTED_STUDENT_PREFIXES = ['/pre-test', '/modules', '/post-test'];
const ADMIN_PREFIX = '/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. فحص الجلسة أولاً
  const sessionResponse = await updateSession(request);

  // 2. التحقق من المستخدم الحالي سواء من الكوكيز أو سوبابيز
  const demoCookie = request.cookies.get('dev_demo_user');
  const hasDemoAuth = !!demoCookie?.value;

  // فحص حماية مسار الأدمن /admin
  if (pathname.startsWith(ADMIN_PREFIX)) {
    let isAdmin = false;

    if (hasDemoAuth) {
      try {
        const parsed = JSON.parse(demoCookie.value);
        isAdmin = parsed.role === 'admin';
      } catch {
        isAdmin = false;
      }
    }

    if (!isAdmin) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // فحص حماية مسارات الامتحانات والموديولات
  const isProtectedPath = PROTECTED_STUDENT_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedPath && !hasDemoAuth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return sessionResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files & assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
