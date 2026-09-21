'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ExamType } from '@/lib/types/database';

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'يجب تسجيل الدخول أولاً لتسليم الاختبار' };
  }

  // 1. التحقق مما إذا كان الطالب قد سلم هذا الاختبار مسبقاً
  const { data: existingSubmission } = await supabase
    .from('exam_submissions')
    .select('id, score, total_questions')
    .eq('student_id', user.id)
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
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, correct_option_index')
    .eq('exam_type', examType);

  if (qError || !questions || questions.length === 0) {
    // في حالة عدم إدخال أسئلة بعد في قاعدة البيانات، نسجل الإجابات بدون رسوب
    const total = Object.keys(answers).length || 1;
    return { success: false, error: 'لم يتم العثور على أسئلة لهذا الاختبار في النظام' };
  }

  // 3. تصحيح الإجابات بسرية تامة على السيرفر
  let calculatedScore = 0;
  questions.forEach((q) => {
    const studentSelected = answers[q.id];
    if (studentSelected !== undefined && studentSelected === q.correct_option_index) {
      calculatedScore += 1;
    }
  });

  const totalQuestions = questions.length;

  // 4. حفظ نتيجة وتسليم الاختبار في قاعدة البيانات
  const { error: subError } = await supabase.from('exam_submissions').insert({
    student_id: user.id,
    exam_type: examType,
    score: calculatedScore,
    total_questions: totalQuestions,
    answers,
  });

  if (subError) {
    return { success: false, error: 'حدث خطأ أثناء حفظ تسليم الاختبار، يرجى المحاولة مجدداً' };
  }

  // 5. تحديث مسار وتقدم الطالب
  if (examType === 'pre_test') {
    await supabase.from('student_progress').upsert(
      {
        student_id: user.id,
        pre_test_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id' }
    );
  } else if (examType === 'post_test') {
    await supabase.from('student_progress').upsert(
      {
        student_id: user.id,
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
