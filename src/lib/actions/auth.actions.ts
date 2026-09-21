'use server';

import { createClient } from '@/lib/supabase/server';
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

  // 1. فحص الحسابات التجريبية فوراً بـ 0ms (بدون انتظار شبكة)
  if (identifier.toLowerCase() === 'admin' && password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set('dev_demo_user', JSON.stringify({
      id: 'admin-demo-id',
      student_id: 'admin',
      full_name: 'د. المشرف العام',
      role: 'admin',
    }), { path: '/', maxAge: 86400 });
    redirect('/admin/dashboard');
  }

  if ((identifier === 'student' || identifier === '2026101') && password === '123456') {
    const cookieStore = await cookies();
    cookieStore.set('dev_demo_user', JSON.stringify({
      id: 'student-demo-id',
      student_id: '2026101',
      full_name: 'أحمد محمد علي',
      role: 'student',
    }), { path: '/', maxAge: 86400 });
    redirect('/');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return { error: 'بيانات الدخول غير صحيحة، جرب كود الطالب: 2026101 وباسوورد: 123456' };
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  
  redirect('/login');
}
