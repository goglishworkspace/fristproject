import crypto from 'crypto';
import { cookies } from 'next/headers';
import type { UserRole } from '@/lib/types/database';

const SESSION_COOKIE_NAME = 'dev_demo_user';
function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'asu_faculty_edu_secret_key_2026_secure'
  );
}

export interface UserSessionPayload {
  id: string;
  student_id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  is_banned?: boolean;
  is_profile_completed?: boolean;
  signature?: string;
}

/**
 * إنشاء توقيع HMAC رقمي للبيانات لمنع التلاعب في الجلسات وصلاحيات الأدمن
 */
export function signSessionPayload(payload: Omit<UserSessionPayload, 'signature'>): string {
  const dataToSign = `${payload.id}:${payload.student_id}:${payload.role}:${payload.is_banned}:${payload.is_profile_completed}`;
  return crypto.createHmac('sha256', getSessionSecret()).update(dataToSign).digest('hex');
}

/**
 * التحقق من صحة توقيع الجلسة
 */
export function verifySessionPayload(payload: UserSessionPayload): boolean {
  if (!payload || !payload.signature) return false;
  const expectedSig = signSessionPayload(payload);
  try {
    return crypto.timingSafeEqual(Buffer.from(payload.signature), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

/**
 * استخراج جلسة المستخدم الحالية والتحقق من صحتها وتوقيعها
 */
export async function getVerifiedUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const payload: UserSessionPayload = JSON.parse(sessionCookie.value);
    
    // إذا لم يتطابق التوقيع أو لم يكن موجوداً، نعتبر الجلسة غير موثوقة
    if (payload.signature && !verifySessionPayload(payload)) {
      console.warn('Tampered session cookie detected!');
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * فحص الصلاحية الإدارية: منع أي طالب أو مستخدم غير مسجل كـ Admin من تنفيذ إجراءات الإدارة
 */
export async function assertAdmin(): Promise<UserSessionPayload> {
  const session = await getVerifiedUserSession();

  if (!session || session.role !== 'admin') {
    throw new Error('غير مصرح لك بتنفيذ هذه العملية. يتطلب صلاحيات المشرف الأكاديمي.');
  }

  return session;
}
