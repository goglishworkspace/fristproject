'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { ExamType } from '@/lib/types/database';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import {
  DEFAULT_PRE_TEST_QUESTIONS,
  DEFAULT_POST_TEST_QUESTIONS,
} from '@/data/exam-questions';

export interface SubmitExamResult {
  success: boolean;
  score?: number;
  total?: number;
  error?: string;
}

export async function submitExamAction(
  examType: ExamType,
  answers: Record<string, number>
): Promise<SubmitExamResult> {
  const cookieStore = await cookies();
  const devDemoCookie = cookieStore.get('dev_demo_user');
  let currentUserId: string | null = null;

  if (devDemoCookie?.value) {
    try {
      const parsed = JSON.parse(devDemoCookie.value);
      currentUserId = parsed.id;
    } catch {
      // ignore
    }
  }

  const isLive = isLiveSupabaseConfigured();

  // في حالة العمل محلياً بدون Supabase حقيقي، يتم التصحيح الفوري بـ 0ms
  if (!isLive) {
    const defaultQuestions =
      examType === 'pre_test'
        ? DEFAULT_PRE_TEST_QUESTIONS
        : DEFAULT_POST_TEST_QUESTIONS;

    let score = 0;
    defaultQuestions.forEach((q) => {
      const studentSelected = answers[q.id];
      if (studentSelected !== undefined && studentSelected === q.correct_option_index) {
        score += 1;
      }
    });

    revalidatePath('/');
    revalidatePath('/pre-test');
    revalidatePath('/post-test');
    revalidatePath('/modules');

    return {
      success: true,
      score,
      total: defaultQuestions.length,
    };
  }

  // في حالة وجود قاعدة بيانات Supabase حقيقية متصلة
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    currentUserId = user.id;
  }

  if (!currentUserId) {
    return { success: false, error: 'يجب تسجيل الدخول أولاً لتسليم الاختبار' };
  }

  // 1. التحقق مما إذا كان الطالب قد سلم هذا الاختبار مسبقاً
  const { data: existingSubmission } = await supabase
    .from('exam_submissions')
    .select('id, score, total_questions')
    .eq('student_id', currentUserId)
    .eq('exam_type', examType)
    .single();

  if (existingSubmission) {
    return {
      success: true,
      score: existingSubmission.score,
      total: existingSubmission.total_questions,
    };
  }

  // 2. جلب الأسئلة مع الإجابة الصحيحة على السيرفر فقط
  const { data: questions } = await supabase
    .from('questions')
    .select('id, correct_option_index')
    .eq('exam_type', examType);

  let calculatedScore = 0;
  let totalQuestions = 0;

  if (questions && questions.length > 0) {
    questions.forEach((q) => {
      const studentSelected = answers[q.id];
      if (studentSelected !== undefined && studentSelected === q.correct_option_index) {
        calculatedScore += 1;
      }
    });
    totalQuestions = questions.length;
  } else {
    const fallbackBank =
      examType === 'pre_test' ? DEFAULT_PRE_TEST_QUESTIONS : DEFAULT_POST_TEST_QUESTIONS;
    fallbackBank.forEach((q) => {
      const studentSelected = answers[q.id];
      if (studentSelected !== undefined && studentSelected === q.correct_option_index) {
        calculatedScore += 1;
      }
    });
    totalQuestions = fallbackBank.length;
  }

  // 3. حفظ نتيجة وتسليم الاختبار في قاعدة البيانات
  const { error: subError } = await supabase.from('exam_submissions').insert({
    student_id: currentUserId,
    exam_type: examType,
    score: calculatedScore,
    total_questions: totalQuestions,
    answers,
  });

  if (subError) {
    return { success: false, error: 'حدث خطأ أثناء حفظ تسليم الاختبار، يرجى المحاولة مجدداً' };
  }

  // 4. تحديث مسار وتقدم الطالب
  if (examType === 'pre_test') {
    await supabase.from('student_progress').upsert(
      {
        student_id: currentUserId,
        pre_test_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id' }
    );
  } else if (examType === 'post_test') {
    await supabase.from('student_progress').upsert(
      {
        student_id: currentUserId,
        post_test_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id' }
    );
  }

  revalidatePath('/');
  revalidatePath('/pre-test');
  revalidatePath('/post-test');
  revalidatePath('/modules');

  return {
    success: true,
    score: calculatedScore,
    total: totalQuestions,
  };
}
