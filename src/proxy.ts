import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// قائمة المسارات المحمية التي تتطلب تسجيل دخول حقيقي
const PROTECTED_STUDENT_PREFIXES = ['/pre-test', '/modules', '/post-test'];
const ADMIN_PREFIX = '/admin';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. فحص الجلسة أولاً
  const sessionResponse = await updateSession(request);

  // 2. التحقق من المستخدم الحالي وحالته الأكاديمية
  const demoCookie = request.cookies.get('dev_demo_user');
  const hasDemoAuth = !!demoCookie?.value;

  if (hasDemoAuth) {
    try {
      const parsed = JSON.parse(demoCookie.value);

      // حظر الدخول إذا كان الحساب محظوراً
      if (parsed.is_banned) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('dev_demo_user');
        return response;
      }

      // توجيه الأدمن بعيداً عن شاشة استكمال بيانات الطلاب
      if (parsed.role === 'admin' && pathname === '/complete-profile') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      // إلزام الطالب بإكمال الملف الشخصي إذا لم يكن مكتملاً
      if (parsed.role === 'student' && parsed.is_profile_completed === false) {
        if (pathname !== '/complete-profile' && pathname !== '/login') {
          return NextResponse.redirect(new URL('/complete-profile', request.url));
        }
      }

      // منع الدخول لصفحة إكمال الملف إذا كان مكتمل بالفعل
      if (parsed.role === 'student' && parsed.is_profile_completed === true) {
        if (pathname === '/complete-profile') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch {
      // ignore
    }
  } else {
    // إذا لم يكن مسجل دخول وحاول فتح صفحة استكمال البيانات
    if (pathname === '/complete-profile') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

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
