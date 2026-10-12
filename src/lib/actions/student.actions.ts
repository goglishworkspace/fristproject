'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { StudentAccount, ExamType } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { assertAdmin } from '@/lib/auth/session';

const STUDENTS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'students.json');

// دالة مساعدة لتوليد كلمة مرور عشوائية سهلة القراءة
function generateRandomPassword(length = 6): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

// دالة مساعدة لتحويل سجل Supabase إلى StudentAccount
function mapDbAccountToStudent(row: any): StudentAccount {
  const activitySubmissions = row.activity_submissions || {};
  const metaSpatial = activitySubmissions._spatialMeta || {};

  const spatialPreScore =
    row.spatial_pre_score !== null && row.spatial_pre_score !== undefined
      ? Number(row.spatial_pre_score)
      : metaSpatial.spatialPreScore !== null && metaSpatial.spatialPreScore !== undefined
      ? Number(metaSpatial.spatialPreScore)
      : null;

  const spatialPostScore =
    row.spatial_post_score !== null && row.spatial_post_score !== undefined
      ? Number(row.spatial_post_score)
      : metaSpatial.spatialPostScore !== null && metaSpatial.spatialPostScore !== undefined
      ? Number(metaSpatial.spatialPostScore)
      : null;

  const spatialPreTestAnswers =
    row.spatial_pre_test_answers && Object.keys(row.spatial_pre_test_answers).length > 0
      ? row.spatial_pre_test_answers
      : metaSpatial.spatialPreTestAnswers || {};

  const spatialPostTestAnswers =
    row.spatial_post_test_answers && Object.keys(row.spatial_post_test_answers).length > 0
      ? row.spatial_post_test_answers
      : metaSpatial.spatialPostTestAnswers || {};

  return {
    id: row.id,
    username: row.username,
    password: row.password,
    fullName: row.full_name || '',
    phone: row.phone || '',
    isProfileCompleted: !!row.is_profile_completed,
    isBanned: !!row.is_banned,
    preScore: row.pre_score !== null && row.pre_score !== undefined ? Number(row.pre_score) : null,
    postScore: row.post_score !== null && row.post_score !== undefined ? Number(row.post_score) : null,
    spatialPreScore,
    spatialPostScore,
    preTestAnswers: row.pre_test_answers || {},
    postTestAnswers: row.post_test_answers || {},
    spatialPreTestAnswers,
    spatialPostTestAnswers,
    moduleQuizScores: row.module_quiz_scores || {},
    activitySubmissions: activitySubmissions,
    moduleProgress: row.module_progress || '0/2',
    status: row.status || 'not_started',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

// دالة مساعدة لتحويل StudentAccount إلى سجل Supabase مع تضمين البيانات في activity_submissions كطبقة أمان
function mapStudentToDbAccount(s: StudentAccount): any {
  const safeActivitySubmissions = {
    ...(s.activitySubmissions || {}),
    _spatialMeta: {
      spatialPreScore: s.spatialPreScore,
      spatialPostScore: s.spatialPostScore,
      spatialPreTestAnswers: s.spatialPreTestAnswers || {},
      spatialPostTestAnswers: s.spatialPostTestAnswers || {},
      updatedAt: new Date().toISOString(),
    },
  };

  return {
    id: s.id,
    username: s.username,
    password: s.password,
    full_name: s.fullName,
    phone: s.phone,
    is_profile_completed: s.isProfileCompleted,
    is_banned: s.isBanned,
    pre_score: s.preScore,
    post_score: s.postScore,
    spatial_pre_score: s.spatialPreScore,
    spatial_post_score: s.spatialPostScore,
    pre_test_answers: s.preTestAnswers || {},
    post_test_answers: s.postTestAnswers || {},
    spatial_pre_test_answers: s.spatialPreTestAnswers || {},
    spatial_post_test_answers: s.spatialPostTestAnswers || {},
    module_quiz_scores: s.moduleQuizScores || {},
    activity_submissions: safeActivitySubmissions,
    module_progress: s.moduleProgress,
    status: s.status,
    updated_at: new Date().toISOString(),
  };
}

// دالة قراءة سجل الطلاب
export async function getStudentsListAction(): Promise<StudentAccount[]> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapDbAccountToStudent);
      }
    } catch (err) {
      console.warn('Supabase getStudentsListAction failed, falling back to JSON:', err);
    }
  }

  try {
    const data = await fs.readFile(STUDENTS_FILE_PATH, 'utf-8');
    return JSON.parse(data) as StudentAccount[];
  } catch (err) {
    console.error('Error reading students.json:', err);
    return [];
  }
}

// دالة حفظ ملف الطلاب (Fallback محلي)
async function saveStudentsList(students: StudentAccount[]): Promise<boolean> {
  try {
    await fs.writeFile(STUDENTS_FILE_PATH, JSON.stringify(students, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving students.json:', err);
    return false;
  }
}

// 1. إضافة طالب جديد فردي
export async function createStudentAction(data: {
  username: string;
  fullName?: string;
  phone?: string;
  password?: string;
}): Promise<{ success: boolean; student?: StudentAccount; error?: string }> {
  try {
    await assertAdmin();

    const students = await getStudentsListAction();
    const cleanUsername = data.username.trim().toLowerCase();

    if (!cleanUsername) {
      return { success: false, error: 'يرجى إدخال اسم مستخدم / كود صالح للطالب' };
    }

    if (students.some((s) => s.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'اسم المستخدم / الكود مسجل بالفعل لطالب آخر' };
    }

    const newStudent: StudentAccount = {
      id: `std-${Date.now()}`,
      username: cleanUsername,
      password: data.password?.trim() || generateRandomPassword(),
      fullName: data.fullName?.trim() || '',
      phone: data.phone?.trim() || '',
      isProfileCompleted: !!(data.fullName?.trim() && data.phone?.trim()),
      isBanned: false,
      preScore: null,
      postScore: null,
      moduleProgress: '0/2',
      status: 'not_started',
      createdAt: new Date().toISOString(),
    };

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase.from('accounts').insert({
          id: newStudent.id,
          username: newStudent.username,
          password: newStudent.password,
          full_name: newStudent.fullName,
          phone: newStudent.phone,
          role: 'student',
          is_profile_completed: newStudent.isProfileCompleted,
          is_banned: newStudent.isBanned,
          module_progress: newStudent.moduleProgress,
          status: newStudent.status,
          created_at: newStudent.createdAt,
        });
      } catch (e) {
        console.warn('Supabase createStudent error:', e);
      }
    }

    students.unshift(newStudent);
    await saveStudentsList(students);
    revalidatePath('/admin/dashboard');

    return { success: true, student: newStudent };
  } catch {
    return { success: false, error: 'حدث خطأ أثناء إضافة الطالب' };
  }
}

// 2. توليد دفعة حسابات طلاب عشوائية (Batch Generation)
export async function generateBatchStudentsAction(
  count: number,
  prefix = 'user'
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    await assertAdmin();

    if (count <= 0 || count > 500) {
      return { success: false, error: 'يرجى تحديد عدد بين 1 و 500 طالب' };
    }

    const students = await getStudentsListAction();
    const cleanPrefix = (prefix.trim() || 'user').toLowerCase();

    // البحث عن أعلى رقم مستخدم حالي لنفس البادئة
    let highestNum = 1000;
    students.forEach((s) => {
      const lower = s.username.toLowerCase();
      if (lower.startsWith(cleanPrefix)) {
        const numPart = parseInt(lower.replace(cleanPrefix, ''), 10);
        if (!isNaN(numPart) && numPart > highestNum) {
          highestNum = numPart;
        }
      }
    });

    const newBatch: StudentAccount[] = [];
    for (let i = 1; i <= count; i++) {
      const nextNum = highestNum + i;
      const username = `${cleanPrefix}${nextNum}`;

      newBatch.push({
        id: `std-${nextNum}-${Date.now()}`,
        username,
        password: generateRandomPassword(),
        fullName: '',
        phone: '',
        isProfileCompleted: false,
        isBanned: false,
        preScore: null,
        postScore: null,
        moduleProgress: '0/2',
        status: 'not_started',
        createdAt: new Date().toISOString(),
      });
    }

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const records = newBatch.map((s) => ({
          id: s.id,
          username: s.username,
          password: s.password,
          full_name: s.fullName,
          phone: s.phone,
          role: 'student',
          is_profile_completed: s.isProfileCompleted,
          is_banned: s.isBanned,
          module_progress: s.moduleProgress,
          status: s.status,
          created_at: s.createdAt,
        }));
        await supabase.from('accounts').insert(records);
      } catch (e) {
        console.warn('Supabase batch insert error:', e);
      }
    }

    const updatedStudents = [...newBatch, ...students];
    await saveStudentsList(updatedStudents);
    revalidatePath('/admin/dashboard');

    return { success: true, count: newBatch.length };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء توليد الحسابات';
    return { success: false, error: errorMsg };
  }
}

// 3. تعديل بيانات طالب (الاسم، الهاتف، اسم المستخدم)
export async function updateStudentAction(
  id: string,
  data: {
    username?: string;
    fullName?: string;
    phone?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();

    const students = await getStudentsListAction();
    const studentIdx = students.findIndex((s) => s.id === id);

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على الطالب في النظام' };
    }

    if (data.username) {
      const cleanUsername = data.username.trim().toLowerCase();
      const duplicate = students.find(
        (s) => s.id !== id && s.username.toLowerCase() === cleanUsername
      );
      if (duplicate) {
        return { success: false, error: 'اسم المستخدم هذا مستخدم بالفعل من قِبل طالب آخر' };
      }
      students[studentIdx].username = cleanUsername;
    }

    if (data.fullName !== undefined) {
      students[studentIdx].fullName = data.fullName.trim();
    }

    if (data.phone !== undefined) {
      students[studentIdx].phone = data.phone.trim();
    }

    students[studentIdx].updatedAt = new Date().toISOString();

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase.from('accounts').update({
          username: students[studentIdx].username,
          full_name: students[studentIdx].fullName,
          phone: students[studentIdx].phone,
          updated_at: students[studentIdx].updatedAt,
        }).eq('id', id);
      } catch (e) {
        console.warn('Supabase updateStudent error:', e);
      }
    }

    await saveStudentsList(students);
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء تعديل بيانات الطالب';
    return { success: false, error: errorMsg };
  }
}

// 4. إعادة تعيين كلمة المرور لطالب (Reset Password)
export async function resetStudentPasswordAction(
  id: string,
  newPassword?: string
): Promise<{ success: boolean; newPassword?: string; error?: string }> {
  try {
    await assertAdmin();

    const students = await getStudentsListAction();
    const studentIdx = students.findIndex((s) => s.id === id);

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على الطالب' };
    }

    const assignedPassword = newPassword?.trim() || generateRandomPassword();
    if (assignedPassword.length < 4) {
      return { success: false, error: 'كلمة المرور يجب أن لا تقل عن 4 خانات' };
    }

    students[studentIdx].password = assignedPassword;
    students[studentIdx].updatedAt = new Date().toISOString();

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase.from('accounts').update({
          password: assignedPassword,
          updated_at: students[studentIdx].updatedAt,
        }).eq('id', id);
      } catch (e) {
        console.warn('Supabase resetStudentPassword error:', e);
      }
    }

    await saveStudentsList(students);
    revalidatePath('/admin/dashboard');

    return { success: true, newPassword: assignedPassword };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء إعادة تعيين كلمة المرور';
    return { success: false, error: errorMsg };
  }
}

// 5. حظر أو إلغاء حظر طالب (Ban / Unban Toggle)
export async function toggleBanStudentAction(
  id: string
): Promise<{ success: boolean; isBanned?: boolean; error?: string }> {
  try {
    await assertAdmin();

    const students = await getStudentsListAction();
    const studentIdx = students.findIndex((s) => s.id === id);

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على الطالب' };
    }

    const newBannedState = !students[studentIdx].isBanned;

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase
          .from('accounts')
          .update({ is_banned: newBannedState, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase toggleBan failed:', e);
      }
    }

    students[studentIdx].isBanned = newBannedState;
    students[studentIdx].updatedAt = new Date().toISOString();

    await saveStudentsList(students);
    revalidatePath('/admin/dashboard');

    return { success: true, isBanned: newBannedState };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء تغيير حالة حظر الطالب';
    return { success: false, error: errorMsg };
  }
}

// 6. حذف طالب نهائياً من النظام
export async function deleteStudentAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase
          .from('accounts')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase deleteStudent error:', error);
          return { success: false, error: error.message };
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'فشل حذف الطالب من قاعدة البيانات';
        return { success: false, error: msg };
      }
    }

    // محاولة الحفظ المحلي مع تجاهل قيود الـ Read-Only على Vercel
    try {
      const students = await getStudentsListAction();
      const filtered = students.filter((s) => s.id !== id);
      await saveStudentsList(filtered);
    } catch {
      // ignore on serverless read-only disk
    }

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء حذف الطالب';
    return { success: false, error: errorMsg };
  }
}

// 7. إعادة ضبط بيانات الطالب كأنه لم يسجل بعد (مسح البيانات وتوليد باسورد جديد)
export async function resetStudentToFreshAction(
  id: string
): Promise<{ success: boolean; student?: StudentAccount; error?: string }> {
  try {
    await assertAdmin();

    const students = await getStudentsListAction();
    const studentIdx = students.findIndex(
      (s) => s.id === id || s.username.toLowerCase() === id.toLowerCase()
    );

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على الطالب' };
    }

    const newPwd = generateRandomPassword();
    students[studentIdx].fullName = '';
    students[studentIdx].phone = '';
    students[studentIdx].password = newPwd;
    students[studentIdx].isProfileCompleted = false;
    students[studentIdx].isBanned = false;
    students[studentIdx].preScore = null;
    students[studentIdx].postScore = null;
    students[studentIdx].moduleProgress = '0/2';
    students[studentIdx].status = 'not_started';
    students[studentIdx].preTestAnswers = {};
    students[studentIdx].postTestAnswers = {};
    students[studentIdx].moduleQuizScores = {};
    students[studentIdx].activitySubmissions = {};
    delete students[studentIdx].updatedAt;

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase
          .from('accounts')
          .update(mapStudentToDbAccount(students[studentIdx]))
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase resetStudent failed:', e);
      }
    }

    await saveStudentsList(students);
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    revalidatePath('/pre-test');
    revalidatePath('/post-test');
    revalidatePath('/modules');

    return { success: true, student: students[studentIdx] };
  } catch {
    return { success: false, error: 'حدث خطأ أثناء إعادة ضبط بيانات الطالب' };
  }
}

// 7. إجراء الطالب: إكمال الملف الشخصي وتغيير الباسورد عند أول دخول
export async function completeStudentProfileAction(data: {
  fullName: string;
  phone: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  try {
    const cookieStore = await cookies();
    const demoCookie = cookieStore.get('dev_demo_user');

    if (!demoCookie?.value) {
      return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    }

    let parsedUser: { id?: string; student_id?: string; username?: string } | null = null;
    try {
      parsedUser = JSON.parse(demoCookie.value);
    } catch {
      return { success: false, error: 'جلسة المستخدم غير صالحة، يرجى تسجيل الدخول مجدداً' };
    }

    if (!parsedUser) {
      return { success: false, error: 'جلسة المستخدم غير صالحة، يرجى تسجيل الدخول مجدداً' };
    }

    const targetId = (parsedUser.id || '').toString().trim().toLowerCase();
    const targetUsername = (parsedUser.student_id || parsedUser.username || '').toString().trim().toLowerCase();

    const cleanName = data.fullName.trim();
    const cleanPhone = data.phone.trim();
    const cleanPassword = data.newPassword.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'يرجى كتابة الاسم الكامل للطالب' };
    }

    if (!cleanPhone || cleanPhone.length < 6) {
      return { success: false, error: 'يرجى إدخال رقم هاتف محمول / واتساب صالح للتواصل' };
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'كلمة المرور الجديدة يجب أن تتكون من 4 خانات على الأقل' };
    }

    const students = await getStudentsListAction();
    const studentIdx = students.findIndex((s) => {
      const sId = (s.id || '').toString().trim().toLowerCase();
      const sUser = (s.username || '').toString().trim().toLowerCase();
      return (
        (targetId && (sId === targetId || sUser === targetId)) ||
        (targetUsername && (sUser === targetUsername || sId === targetUsername))
      );
    });

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على سجل حسابك في المنصة' };
    }

    // تحديث بيانات الطالب وتثبيت اكتمال الملف
    students[studentIdx].fullName = cleanName;
    students[studentIdx].phone = cleanPhone;
    students[studentIdx].password = cleanPassword;
    students[studentIdx].isProfileCompleted = true;
    students[studentIdx].updatedAt = new Date().toISOString();

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const basePayload = {
          full_name: cleanName,
          phone: cleanPhone,
          password: cleanPassword,
          is_profile_completed: true,
          updated_at: new Date().toISOString(),
        };

        const dbAccount = mapStudentToDbAccount(students[studentIdx]);
        const { error: fullUpdateErr } = await supabase
          .from('accounts')
          .update(dbAccount)
          .eq('id', students[studentIdx].id);

        if (fullUpdateErr) {
          console.warn('Initial Supabase completeStudentProfile update failed, trying safe base payload:', fullUpdateErr);
          await supabase
            .from('accounts')
            .update(basePayload)
            .eq('id', students[studentIdx].id);
        }
      } catch (e) {
        console.warn('Supabase completeStudentProfile error:', e);
      }
    }

    await saveStudentsList(students);

    // تحديث كوكيز الجلسة فوراً لتعكس البيانات الجديدة والاكتمال مع توقيع أمني رقمي
    const sessionData = {
      id: students[studentIdx].id,
      student_id: students[studentIdx].username,
      full_name: cleanName,
      phone: cleanPhone,
      role: 'student' as const,
      is_profile_completed: true,
      is_banned: false,
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
        maxAge: 86400 * 30,
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      }
    );

    revalidatePath('/', 'layout');
    revalidatePath('/complete-profile');
    revalidatePath('/pre-test');
    revalidatePath('/modules');
    revalidatePath('/admin/dashboard');

    return { success: true, redirectTo: '/pre-test' };
  } catch {
    return { success: false, error: 'حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مجدداً' };
  }
}

// 8. رصد وتخزين نتيجة الاختبار (القبلي أو البعدي) مع خريطة الإجابات
export async function recordExamResultAction(
  studentIdentifier: string,
  examType: ExamType,
  score: number,
  total: number,
  answers?: Record<string, number>
): Promise<{ success: boolean; student?: StudentAccount; error?: string }> {
  try {
    const students = await getStudentsListAction();
    const cleanId = studentIdentifier.trim().toLowerCase();

    const studentIdx = students.findIndex(
      (s) => s.id.toLowerCase() === cleanId || s.username.toLowerCase() === cleanId
    );

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على سجل الطالب' };
    }

    if (examType === 'pre_test') {
      students[studentIdx].preScore = score;
      if (answers) {
        students[studentIdx].preTestAnswers = answers;
      }
      if (students[studentIdx].status === 'not_started') {
        students[studentIdx].status = 'in_progress';
      }
    } else if (examType === 'pre_spatial_test' || (examType === 'spatial_test' && students[studentIdx].spatialPreScore === null)) {
      students[studentIdx].spatialPreScore = score;
      if (answers) {
        students[studentIdx].spatialPreTestAnswers = answers;
      }
      if (students[studentIdx].status === 'not_started') {
        students[studentIdx].status = 'in_progress';
      }
    } else if (examType === 'post_test') {
      students[studentIdx].postScore = score;
      if (answers) {
        students[studentIdx].postTestAnswers = answers;
      }
      if (students[studentIdx].spatialPostScore !== null && students[studentIdx].spatialPostScore !== undefined) {
        students[studentIdx].status = 'completed';
      }
    } else if (examType === 'post_spatial_test' || examType === 'spatial_test') {
      students[studentIdx].spatialPostScore = score;
      if (answers) {
        students[studentIdx].spatialPostTestAnswers = answers;
      }
      if (students[studentIdx].postScore !== null && students[studentIdx].postScore !== undefined) {
        students[studentIdx].status = 'completed';
      }
    } else if (examType.startsWith('module_')) {
      const modId = examType.replace('module_', '');
      if (!students[studentIdx].moduleQuizScores) {
        students[studentIdx].moduleQuizScores = {};
      }
      students[studentIdx].moduleQuizScores![modId] = {
        score,
        total,
        completedAt: new Date().toISOString(),
        answers: answers || {},
      };
      if (students[studentIdx].status === 'not_started') {
        students[studentIdx].status = 'in_progress';
      }
    }

    students[studentIdx].updatedAt = new Date().toISOString();

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const dbPayload = mapStudentToDbAccount(students[studentIdx]);
        const { error: updateErr } = await supabase
          .from('accounts')
          .update(dbPayload)
          .eq('id', students[studentIdx].id);

        if (updateErr) {
          console.warn('Initial Supabase accounts update warning, trying fallback without spatial columns:', updateErr);
          // إذا كان جدول accounts في Supabase لا يحتوي على أعمدة التفكير المكاني، نحدث الأعمدة الأساسية مع activity_submissions الحاوية للـ _spatialMeta
          const fallbackPayload: any = {
            pre_score: students[studentIdx].preScore,
            post_score: students[studentIdx].postScore,
            pre_test_answers: students[studentIdx].preTestAnswers || {},
            post_test_answers: students[studentIdx].postTestAnswers || {},
            module_quiz_scores: students[studentIdx].moduleQuizScores || {},
            activity_submissions: dbPayload.activity_submissions,
            module_progress: students[studentIdx].moduleProgress,
            status: students[studentIdx].status,
            updated_at: new Date().toISOString(),
          };
          await supabase
            .from('accounts')
            .update(fallbackPayload)
            .eq('id', students[studentIdx].id);
        }
      } catch (e) {
        console.warn('Supabase recordExamResult error:', e);
      }
    }

    await saveStudentsList(students);

    // تحديث فوري لكوكيز الجلسة dev_demo_user لضمان عدم حجب الطالب عن الموديولات نهائياً
    try {
      const cookieStore = await cookies();
      const existingCookie = cookieStore.get('dev_demo_user');
      if (existingCookie?.value) {
        const parsed = JSON.parse(existingCookie.value);
        if (
          parsed.id === students[studentIdx].id ||
          parsed.student_id === students[studentIdx].username
        ) {
          const sessionData = {
            ...parsed,
            spatial_pre_completed: students[studentIdx].spatialPreScore !== null,
            spatial_pre_score: students[studentIdx].spatialPreScore,
            pre_completed: students[studentIdx].preScore !== null,
            pre_score: students[studentIdx].preScore,
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
              maxAge: 86400 * 30,
              sameSite: 'lax',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
            }
          );
        }
      }
    } catch (cookieErr) {
      console.warn('Could not update session cookie after exam record:', cookieErr);
    }

    revalidatePath('/');
    revalidatePath('/pre-test');
    revalidatePath('/pre-test/spatial');
    revalidatePath('/post-test');
    revalidatePath('/post-test/spatial');
    revalidatePath('/modules');
    revalidatePath('/admin/dashboard');

    return { success: true, student: students[studentIdx] };
  } catch (err) {
    console.error('Error recording exam result:', err);
    return { success: false, error: 'حدث خطأ أثناء رصد نتيجة الاختبار' };
  }
}

// 9. رصد تسليم حل نشاط تطبيقي لوحدة تعليمية معينة
export async function recordActivitySubmissionAction(
  studentIdentifier: string,
  moduleId: string,
  data: { answerText: string; fileUrl?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const students = await getStudentsListAction();
    const cleanId = studentIdentifier.trim().toLowerCase();

    const studentIdx = students.findIndex(
      (s) => s.id.toLowerCase() === cleanId || s.username.toLowerCase() === cleanId
    );

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على سجل الطالب' };
    }

    if (!students[studentIdx].activitySubmissions) {
      students[studentIdx].activitySubmissions = {};
    }

    students[studentIdx].activitySubmissions![moduleId] = {
      answerText: data.answerText.trim(),
      fileUrl: data.fileUrl?.trim() || '',
      submittedAt: new Date().toISOString(),
    };

    students[studentIdx].updatedAt = new Date().toISOString();

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase
          .from('accounts')
          .update(mapStudentToDbAccount(students[studentIdx]))
          .eq('id', students[studentIdx].id);
      } catch (e) {
        console.warn('Supabase recordActivitySubmission error:', e);
      }
    }

    await saveStudentsList(students);

    revalidatePath(`/modules/${moduleId}`);
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (err) {
    console.error('Error saving activity submission:', err);
    return { success: false, error: 'حدث خطأ أثناء حفظ النشاط' };
  }
}

// 10. رصد إتمام وحدة دراسية معينة
export async function recordModuleCompletionAction(
  studentIdentifier: string,
  moduleId: string
): Promise<{ success: boolean; progress?: string; error?: string }> {
  try {
    const { getModulesListAction } = await import('@/lib/actions/module.actions');
    const modules = await getModulesListAction();
    const totalModules = modules.length || 1;
    const moduleIndex = modules.findIndex((m) => m.id === moduleId);
    if (moduleIndex === -1) return { success: false, error: 'الوحدة غير موجودة' };

    const students = await getStudentsListAction();
    const cleanId = studentIdentifier.trim().toLowerCase();
    const studentIdx = students.findIndex(
      (s) => s.id.toLowerCase() === cleanId || s.username.toLowerCase() === cleanId
    );

    if (studentIdx === -1) {
      return { success: false, error: 'لم يتم العثور على سجل الطالب' };
    }

    const currentCompleted = Math.max(
      parseInt(students[studentIdx].moduleProgress?.split('/')[0] || '0', 10),
      moduleIndex + 1
    );

    students[studentIdx].moduleProgress = `${currentCompleted}/${totalModules}`;
    if (students[studentIdx].status === 'not_started') {
      students[studentIdx].status = 'in_progress';
    }
    students[studentIdx].updatedAt = new Date().toISOString();

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase
          .from('accounts')
          .update(mapStudentToDbAccount(students[studentIdx]))
          .eq('id', students[studentIdx].id);
      } catch (e) {
        console.warn('Supabase recordModuleCompletion error:', e);
      }
    }

    await saveStudentsList(students);

    revalidatePath('/');
    revalidatePath('/modules');
    revalidatePath(`/modules/${moduleId}`);
    revalidatePath('/post-test');
    revalidatePath('/admin/dashboard');

    return { success: true, progress: students[studentIdx].moduleProgress };
  } catch (err) {
    console.error('Error recording module completion:', err);
    return { success: false, error: 'حدث خطأ أثناء حفظ تقدم الوحدة' };
  }
}

// 10. نموذج واسترجاع الحالة التعليمية الشاملة للطالب (Student Progress State)
export interface StudentProgressData {
  isLoggedIn: boolean;
  role: 'student' | 'admin' | null;
  studentId: string | null;
  username: string | null;
  fullName: string | null;
  phone: string | null;
  preTestCompleted: boolean;
  preScore: number | null;
  spatialPreTestCompleted: boolean;
  spatialPreScore: number | null;
  postTestCompleted: boolean;
  postScore: number | null;
  spatialPostTestCompleted: boolean;
  spatialPostScore: number | null;
  currentModuleIndex: number; // 0, 1, 2...
  completedModulesCount: number;
  totalModulesCount: number;
  moduleProgress: string; // '0/2', '1/2', '2/2'
  isAllModulesCompleted: boolean;
  isFullyCompleted: boolean;
  isBanned: boolean;
  isProfileCompleted: boolean;
}

export async function getStudentProgressAction(): Promise<StudentProgressData> {
  const { getModulesListAction } = await import('@/lib/actions/module.actions');
  const modules = await getModulesListAction();
  const totalModules = modules.length || 1;

  const defaultState: StudentProgressData = {
    isLoggedIn: false,
    role: null,
    studentId: null,
    username: null,
    fullName: null,
    phone: null,
    preTestCompleted: false,
    preScore: null,
    spatialPreTestCompleted: false,
    spatialPreScore: null,
    postTestCompleted: false,
    postScore: null,
    spatialPostTestCompleted: false,
    spatialPostScore: null,
    currentModuleIndex: 0,
    completedModulesCount: 0,
    totalModulesCount: totalModules,
    moduleProgress: `0/${totalModules}`,
    isAllModulesCompleted: false,
    isFullyCompleted: false,
    isBanned: false,
    isProfileCompleted: false,
  };

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('dev_demo_user');
  let currentUserId: string | null = null;
  let cookieRole: 'student' | 'admin' = 'student';

  if (demoCookie?.value) {
    try {
      const parsed = JSON.parse(demoCookie.value);
      currentUserId = parsed.id || parsed.student_id;
      cookieRole = parsed.role || 'student';
    } catch {
      // ignore
    }
  }

  // إذا كان المستخدم هو المشرف الأكاديمي
  if (cookieRole === 'admin') {
    return {
      ...defaultState,
      isLoggedIn: true,
      role: 'admin',
      fullName: 'د. المشرف الأكاديمي',
      preTestCompleted: true,
      spatialPreTestCompleted: true,
      postTestCompleted: true,
      spatialPostTestCompleted: true,
      currentModuleIndex: totalModules,
      completedModulesCount: totalModules,
      isAllModulesCompleted: true,
      isFullyCompleted: true,
      isProfileCompleted: true,
    };
  }

  // إذا لم نجد كوكيز تجريبية وكان Supabase متصلاً
  if (!currentUserId && isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) currentUserId = user.id;
    } catch {
      // ignore
    }
  }

  if (!currentUserId) {
    return defaultState;
  }

  // 1. البحث في سجل الطلاب المعتمد أولاً
  const students = await getStudentsListAction();
  const cleanId = currentUserId.trim().toLowerCase();
  const student = students.find(
    (s) => s.id.toLowerCase() === cleanId || s.username.toLowerCase() === cleanId
  );

  let cookieSpatialPre = false;
  let cookieSpatialScore: number | null = null;
  let cookiePre = false;
  let cookiePreScore: number | null = null;

  let cookieProfileCompleted = false;

  if (demoCookie?.value) {
    try {
      const parsed = JSON.parse(demoCookie.value);
      if (parsed.is_profile_completed === true) {
        cookieProfileCompleted = true;
      }
      if (parsed.spatial_pre_completed || parsed.spatial_pre_score !== undefined) {
        cookieSpatialPre = true;
        cookieSpatialScore = parsed.spatial_pre_score ?? null;
      }
      if (parsed.pre_completed || parsed.pre_score !== undefined) {
        cookiePre = true;
        cookiePreScore = parsed.pre_score ?? null;
      }
    } catch {}
  }

  if (student) {
    const preCompleted =
      cookiePre || (student.preScore !== null && student.preScore !== undefined);
    const spatialPreCompleted =
      cookieSpatialPre || (student.spatialPreScore !== null && student.spatialPreScore !== undefined);
    const postCompleted = student.postScore !== null && student.postScore !== undefined;
    const spatialPostCompleted = student.spatialPostScore !== null && student.spatialPostScore !== undefined;
    const completedModules = parseInt(student.moduleProgress?.split('/')[0] || '0', 10);
    const allModulesDone = completedModules >= totalModules;

    const isProfileCompleted =
      student.isProfileCompleted ||
      cookieProfileCompleted ||
      (!!student.fullName && student.fullName !== `طالب (${student.username})`);

    return {
      isLoggedIn: true,
      role: 'student',
      studentId: student.id,
      username: student.username,
      fullName: student.fullName || `طالب (${student.username})`,
      phone: student.phone || '',
      preTestCompleted: preCompleted,
      preScore: student.preScore ?? cookiePreScore,
      spatialPreTestCompleted: spatialPreCompleted,
      spatialPreScore: student.spatialPreScore ?? cookieSpatialScore,
      postTestCompleted: postCompleted,
      postScore: student.postScore,
      spatialPostTestCompleted: spatialPostCompleted,
      spatialPostScore: student.spatialPostScore ?? null,
      currentModuleIndex: completedModules,
      completedModulesCount: completedModules,
      totalModulesCount: totalModules,
      moduleProgress: student.moduleProgress || `0/${totalModules}`,
      isAllModulesCompleted: allModulesDone,
      isFullyCompleted: (postCompleted && spatialPostCompleted) || student.status === 'completed',
      isBanned: student.isBanned,
      isProfileCompleted: isProfileCompleted,
    };
  }

  // 2. إذا كان الحساب من Supabase
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: progress } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', currentUserId)
        .single();

      if (progress) {
        const completedModules = progress.current_module_index || 0;
        return {
          isLoggedIn: true,
          role: 'student',
          studentId: currentUserId,
          username: currentUserId,
          fullName: 'طالب مسجل',
          phone: '',
          preTestCompleted: !!progress.pre_test_completed,
          preScore: null,
          spatialPreTestCompleted: !!(progress as any).spatial_pre_test_completed,
          spatialPreScore: null,
          postTestCompleted: !!progress.post_test_completed,
          postScore: null,
          spatialPostTestCompleted: !!(progress as any).spatial_post_test_completed,
          spatialPostScore: null,
          currentModuleIndex: completedModules,
          completedModulesCount: completedModules,
          totalModulesCount: totalModules,
          moduleProgress: `${completedModules}/${totalModules}`,
          isAllModulesCompleted: completedModules >= totalModules,
          isFullyCompleted: !!progress.post_test_completed,
          isBanned: false,
          isProfileCompleted: true,
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    ...defaultState,
    isLoggedIn: true,
  };
}

