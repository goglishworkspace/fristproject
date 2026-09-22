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

  // 1. فحص الحسابات التجريبية فوراً بـ 0ms (بدون انتظار شبكة)
  // حساب المشرف والأدمن
  if (
    (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@asu.edu.eg') &&
    password === 'admin123'
  ) {
    const cookieStore = await cookies();
    cookieStore.set(
      'dev_demo_user',
      JSON.stringify({
        id: 'admin-demo-id',
        student_id: 'admin',
        full_name: 'د. المشرف الأكاديمي (جامعة عين شمس)',
        role: 'admin',
      }),
      { path: '/', maxAge: 86400 }
    );
    redirect('/admin/dashboard');
  }

  // حسابات الطلاب التجريبية للاختبار والمعاينة
  const demoStudents: Record<string, { id: string; student_id: string; full_name: string }> = {
    '2026101': { id: 's1', student_id: '2026101', full_name: 'أحمد محمود علي (طالب 1)' },
    'student1': { id: 's1', student_id: '2026101', full_name: 'أحمد محمود علي (طالب 1)' },
    'student': { id: 's1', student_id: '2026101', full_name: 'أحمد محمود علي (طالب 1)' },
    '2026102': { id: 's2', student_id: '2026102', full_name: 'سارة عبد الرحمن يوسف (طالبة 2)' },
    'student2': { id: 's2', student_id: '2026102', full_name: 'سارة عبد الرحمن يوسف (طالبة 2)' },
    '2026103': { id: 's3', student_id: '2026103', full_name: 'خالد عمر الشريف (طالب 3)' },
    'student3': { id: 's3', student_id: '2026103', full_name: 'خالد عمر الشريف (طالب 3)' },
    '2026104': { id: 's4', student_id: '2026104', full_name: 'نور الدين مصطفى (طالب 4)' },
    'student4': { id: 's4', student_id: '2026104', full_name: 'نور الدين مصطفى (طالب 4)' },
  };

  const matchedStudent = demoStudents[identifier.toLowerCase()];
  if (matchedStudent && password === '123456') {
    const cookieStore = await cookies();
    cookieStore.set(
      'dev_demo_user',
      JSON.stringify({
        ...matchedStudent,
        role: 'student',
      }),
      { path: '/', maxAge: 86400 }
    );
    redirect('/');
  }

  if (!isLiveSupabaseConfigured()) {
    return {
      error:
        'بيانات الدخول غير صحيحة. للإدارة: admin / admin123 | للطلاب: 2026101 أو student1 / 123456',
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
