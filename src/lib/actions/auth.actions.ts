'use server';

import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export interface AuthState {
  error?: string;
}

import adminsData from '@/data/admins.json';

export interface AdminAccountData {
  id: string;
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'admin';
  isProfileCompleted: boolean;
  isBanned: boolean;
}

// دالة مساعدة لمزامنة حسابات المشرفين مع Supabase في الخلفية
export async function syncAdminAccountsToSupabase(): Promise<void> {
  if (!isLiveSupabaseConfigured()) return;
  try {
    const supabase = await createClient();
    const rows = adminsData.map((adm) => ({
      id: adm.id,
      username: adm.username,
      password: adm.password,
      full_name: adm.fullName,
      phone: adm.phone || '',
      role: 'admin',
      is_profile_completed: true,
      is_banned: false,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('accounts').upsert(rows, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase syncAdminAccountsToSupabase warning:', err);
  }
}

// جلب قائمة حسابات المشرفين المعتمدة
export async function getAdminAccountsAction(): Promise<AdminAccountData[]> {
  return adminsData as AdminAccountData[];
}

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const identifier = (formData.get('identifier') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!identifier || !password) {
    return { error: 'يرجى إدخال اسم المستخدم / كود الطالب وكلمة المرور' };
  }

  const cleanId = identifier.toLowerCase();

  // منع أي محارف خطيرة تمنع ثغرات PostgREST / Injection
  if (!/^[a-zA-Z0-9_.@-]+$/.test(cleanId)) {
    return { error: 'اسم المستخدم أو الكود يحتوي على رموز غير صالحة' };
  }

  // 1. فحص الحساب الرئيسي الافتراضي للمشرف العام
  const isRootAdmin =
    cleanId === 'admin@asu.edu.eg' ||
    cleanId === 'admin.env@asu.edu.eg' ||
    cleanId === 'admin';

  const expectedAdminPassword = process.env.ADMIN_PASSWORD;

  if (isRootAdmin) {
    if (!expectedAdminPassword) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('CRITICAL SECURITY ERROR: ADMIN_PASSWORD environment variable is not defined in production.');
      }
      return { error: 'متغير بيئة كلمة مرور المشرف العام ADMIN_PASSWORD غير مهيأ في السيرفر' };
    }
    if (password !== expectedAdminPassword) {
      return { error: 'كلمة مرور المشرف الأكاديمي غير صحيحة، يرجى إعادة المحاولة' };
    }

    // مزامنة الحسابات العشرة مع سوبابيز في الخلفية
    syncAdminAccountsToSupabase().catch(() => {});

    const cookieStore = await cookies();
    const adminData = {
      id: 'admin-root-id',
      student_id: 'admin@asu.edu.eg',
      full_name: 'د. المشرف الأكاديمي العام (جامعة عين شمس)',
      role: 'admin' as const,
      is_banned: false,
      is_profile_completed: true,
    };
    const { signSessionPayload } = await import('@/lib/auth/session');
    const signature = signSessionPayload(adminData);

    cookieStore.set(
      'dev_demo_user',
      JSON.stringify({
        ...adminData,
        signature,
      }),
      {
        path: '/',
        maxAge: 86400 * 7,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      }
    );
    redirect('/admin/dashboard');
  }

  // 2. فحص حسابات المشرفين المعتمدة (الحسابات المسجلة)
  const { getAdminAccountsAction: fetchAdmins } = await import('@/lib/actions/admin-accounts.actions');
  const adminAccounts = await fetchAdmins();
  const matchedAdmin = adminAccounts.find((adm) => {
    const u = adm.username.toLowerCase();
    // دعم الأشكال المتنوعة مثل: admin1, admin01, admin1@asu.edu.eg
    const padded = u.replace('admin', 'admin0');
    return (
      cleanId === u ||
      cleanId === padded ||
      cleanId === `${u}@asu.edu.eg` ||
      cleanId === `${padded}@asu.edu.eg`
    );
  });

  if (matchedAdmin) {
    if (matchedAdmin.password !== password) {
      return { error: 'كلمة مرور المشرف الأكاديمي غير صحيحة، يرجى مراجعة بيانات الاعتماد' };
    }

    // مزامنة الحسابات العشرة مع سوبابيز في الخلفية
    syncAdminAccountsToSupabase().catch(() => {});

    const cookieStore = await cookies();
    const adminData = {
      id: matchedAdmin.id,
      student_id: matchedAdmin.username,
      full_name: matchedAdmin.fullName,
      role: 'admin' as const,
      is_banned: false,
      is_profile_completed: true,
    };
    const { signSessionPayload } = await import('@/lib/auth/session');
    const signature = signSessionPayload(adminData);

    cookieStore.set(
      'dev_demo_user',
      JSON.stringify({
        ...adminData,
        signature,
      }),
      {
        path: '/',
        maxAge: 86400 * 7,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      }
    );
    redirect('/admin/dashboard');
  }

  // فحص حسابات الطلاب من سجل الطلاب المعتمد (students.json)
  const { getStudentsListAction } = await import('@/lib/actions/student.actions');
  const allStudents = await getStudentsListAction();

  // فحص باليوزر نيم (مثل user1001) أو بأكواد بديلة (مثل 2026101)
  const matchedStudent = allStudents.find(
    (s) => s.username.toLowerCase() === cleanId || (cleanId === 'student1' && s.username === 'user1001')
  );

  if (matchedStudent) {
    if (matchedStudent.password !== password) {
      return { error: 'كلمة المرور غير صحيحة، يرجى التأكد من كلمة المرور المسلمة لك' };
    }

    // التحقق من حالة الحظر
    if (matchedStudent.isBanned) {
      return { error: 'عذراً، تم إيقاف هذا الحساب من قِبل إدارة المنصة، يرجى مراجعة المشرف الأكاديمي' };
    }

    const cookieStore = await cookies();
    const studentData = {
      id: matchedStudent.id,
      student_id: matchedStudent.username,
      full_name: matchedStudent.fullName || `طالب (${matchedStudent.username})`,
      phone: matchedStudent.phone || '',
      role: 'student' as const,
      is_banned: false,
      is_profile_completed: matchedStudent.isProfileCompleted,
    };
    const { signSessionPayload } = await import('@/lib/auth/session');
    const signature = signSessionPayload(studentData);

    cookieStore.set(
      'dev_demo_user',
      JSON.stringify({
        ...studentData,
        signature,
      }),
      {
        path: '/',
        maxAge: 86400 * 7,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      }
    );

    // إذا لم يكمل الطالب بياناته بعد (أول دخول)، نوجهه إجبارياً لشاشة استكمال البيانات
    if (!matchedStudent.isProfileCompleted) {
      redirect('/complete-profile');
    }

    redirect('/');
  }

  // 3. التحقق من جدول accounts في Supabase (سواء للطلاب أو المشرفين المضافين بقاعدة البيانات)
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: dbAccount } = await supabase
        .from('accounts')
        .select('*')
        .eq('username', cleanId)
        .maybeSingle();

      if (dbAccount) {
        if (dbAccount.password !== password) {
          return { error: 'كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة' };
        }
        if (dbAccount.is_banned) {
          return { error: 'عذراً، تم إيقاف هذا الحساب من قِبل إدارة المنصة' };
        }

        const cookieStore = await cookies();
        const sessionData = {
          id: dbAccount.id,
          student_id: dbAccount.username,
          full_name: dbAccount.full_name || (dbAccount.role === 'admin' ? 'مشرف أكاديمي' : 'طالب'),
          role: (dbAccount.role === 'admin' ? 'admin' : 'student') as 'admin' | 'student',
          is_banned: false,
          is_profile_completed: !!dbAccount.is_profile_completed,
        };
        const { signSessionPayload } = await import('@/lib/auth/session');
        const signature = signSessionPayload(sessionData);

        cookieStore.set(
          'dev_demo_user',
          JSON.stringify({
            ...sessionData,
            signature,
          }),
          {
            path: '/',
            maxAge: 86400 * 7,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          }
        );

        if (dbAccount.role === 'admin') {
          redirect('/admin/dashboard');
        } else if (!dbAccount.is_profile_completed) {
          redirect('/complete-profile');
        } else {
          redirect('/');
        }
      }
    } catch (dbErr) {
      // إذا كان redirect قد تم استدعاؤه، نمرره
      if (dbErr && typeof dbErr === 'object' && 'digest' in dbErr) {
        throw dbErr;
      }
    }
  }

  if (!isLiveSupabaseConfigured()) {
    return {
      error: 'بيانات الدخول غير صحيحة، يرجى التأكد من اسم المستخدم أو البريد الإلكتروني وكلمة المرور',
    };
  }

  // 2. التحقق الفعلي من Supabase الحقيقي
  const supabase = await createClient();
  const email = identifier.includes('@')
    ? identifier
    : `${identifier.toLowerCase()}@faculty.local`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: 'بيانات الدخول غير صحيحة، يرجى التأكد من الكود وكلمة المرور' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profile?.role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/');
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('dev_demo_user');

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  
  redirect('/login');
}
