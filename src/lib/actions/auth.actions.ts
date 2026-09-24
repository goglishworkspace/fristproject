'use server';

import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export interface AuthState {
  error?: string;
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

  // 1. فحص حساب المشرف العام والإدارة فوراً بـ 0ms (بدون انتظار شبكة)
  const cleanId = identifier.toLowerCase();
  const isAdminUser =
    cleanId === 'admin@asu.edu.eg' ||
    cleanId === 'admin.env@asu.edu.eg' ||
    cleanId === 'admin';

  const expectedAdminPassword = process.env.ADMIN_PASSWORD || 'Asu@Edu2026#Admin';

  if (isAdminUser && password === expectedAdminPassword) {
    const cookieStore = await cookies();
    const adminData = {
      id: 'admin-demo-id',
      student_id: 'admin@asu.edu.eg',
      full_name: 'د. المشرف الأكاديمي (جامعة عين شمس)',
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
