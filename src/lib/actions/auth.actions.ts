'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export interface AuthState {
  error?: string;
}

// تسجيل الدخول التجريبي أثناء التطوير لتسهيل المعاينة
export async function devLoginAction(role: 'student' | 'admin'): Promise<void> {
  const cookieStore = await cookies();
  
  // وضع كوكي تجريبي للمعاينة المحلية
  cookieStore.set('dev_demo_user', JSON.stringify({
    id: role === 'admin' ? 'admin-demo-id' : 'student-demo-id',
    student_id: role === 'admin' ? 'admin' : '2026101',
    full_name: role === 'admin' ? 'د. المشرف العام' : 'أحمد محمد علي (طالب تجريبي)',
    role: role,
  }), {
    path: '/',
    maxAge: 60 * 60 * 24, // يوم واحد
    httpOnly: false,
  });

  if (role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/');
  }
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

  // دعم فوري لأكواد الاختبار الشائعة
  if (identifier.toLowerCase() === 'admin' && password === 'admin123') {
    await devLoginAction('admin');
    return {};
  } else if ((identifier === 'student' || identifier === '2026101') && password === '123456') {
    await devLoginAction('student');
    return {};
  }

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

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
