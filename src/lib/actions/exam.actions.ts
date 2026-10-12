'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { ExamType, QuestionWithAnswer, QuestionType } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';

import { assertAdmin } from '@/lib/auth/session';

const QUESTIONS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'exam-questions.json');

// 1. قراءة جميع الأسئلة من بنك الأسئلة الدائم
export async function getAllQuestionsAction(): Promise<QuestionWithAnswer[]> {
  try {
    const data = await fs.readFile(QUESTIONS_FILE_PATH, 'utf-8');
    const questions: QuestionWithAnswer[] = JSON.parse(data);
    return questions.sort((a, b) => a.order_index - b.order_index);
  } catch (err) {
    console.error('Error reading exam-questions.json:', err);
    return [];
  }
}

// دالة مساعدة لحفظ بنك الأسئلة
async function saveQuestionsList(questions: QuestionWithAnswer[]): Promise<boolean> {
  try {
    await fs.writeFile(QUESTIONS_FILE_PATH, JSON.stringify(questions, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing exam-questions.json:', err);
    return false;
  }
}

const SPATIAL_QUESTIONS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'spatial-questions.json');

// قراءة أسئلة اختبار التفكير المكاني
export async function getSpatialQuestionsAction(): Promise<QuestionWithAnswer[]> {
  try {
    const data = await fs.readFile(SPATIAL_QUESTIONS_FILE_PATH, 'utf-8');
    const questions: QuestionWithAnswer[] = JSON.parse(data);
    return questions.sort((a, b) => a.order_index - b.order_index);
  } catch (err) {
    console.error('Error reading spatial-questions.json:', err);
    return [];
  }
}

// 2. جلب أسئلة اختبار معين (الاختبار القبلي والبعدي موحدان ويشتركان في نفس الأسئلة تماماً)
export async function getExamQuestionsAction(examType?: ExamType): Promise<QuestionWithAnswer[]> {
  if (
    examType === 'spatial_test' ||
    examType === 'pre_spatial_test' ||
    examType === 'post_spatial_test'
  ) {
    return getSpatialQuestionsAction();
  }

  const all = await getAllQuestionsAction();
  if (!examType) return all;

  // الربط التام: الاختبار القبلي والبعدي متطابقان تماماً ويستخدمان نفس بنك الأسئلة الموحد
  if (examType === 'pre_test' || examType === 'post_test') {
    return all
      .filter((q) => q.exam_type === 'pre_test' || q.exam_type === 'post_test')
      .sort((a, b) => a.order_index - b.order_index);
  }

  return all
    .filter((q) => q.exam_type === examType)
    .sort((a, b) => a.order_index - b.order_index);
}

// 3. إضافة سؤال جديد لبنك الأسئلة
export async function createExamQuestionAction(data: {
  exam_type: ExamType;
  question_type?: QuestionType;
  question_text: string;
  options: string[];
  correct_option_index: number;
  order_index?: number;
}): Promise<{ success: boolean; question?: QuestionWithAnswer; error?: string }> {
  try {
    await assertAdmin();

    const cleanText = data.question_text?.trim();
    if (!cleanText) {
      return { success: false, error: 'يرجى إدخال نص السؤال' };
    }

    const cleanOptions = data.options?.map((o) => o.trim()).filter(Boolean) || [];
    if (cleanOptions.length < 2) {
      return { success: false, error: 'يجب توفير اختيارين على الأقل لكل سؤال' };
    }

    if (
      data.correct_option_index === undefined ||
      data.correct_option_index < 0 ||
      data.correct_option_index >= cleanOptions.length
    ) {
      return { success: false, error: 'يرجى تحديد الإجابة الصحيحة بشكل صحيح' };
    }

    const effectiveExamType: ExamType =
      data.exam_type === 'post_test' ? 'pre_test' : data.exam_type;

    const allQuestions = await getAllQuestionsAction();
    const sameTypeQuestions = allQuestions.filter((q) =>
      effectiveExamType === 'pre_test'
        ? q.exam_type === 'pre_test' || q.exam_type === 'post_test'
        : q.exam_type === effectiveExamType
    );
    const nextOrder =
      data.order_index || (sameTypeQuestions.length > 0 ? Math.max(...sameTypeQuestions.map((q) => q.order_index)) + 1 : 1);

    const questionType: QuestionType = data.question_type || (cleanOptions.length === 2 ? 'true_false' : 'multiple_choice');

    const prefix = effectiveExamType.startsWith('module_')
      ? effectiveExamType.replace('module_', 'mod-')
      : 'main';

    const newQuestion: QuestionWithAnswer = {
      id: `q-${prefix}-${Date.now()}`,
      exam_type: effectiveExamType,
      question_type: questionType,
      question_text: cleanText,
      options: cleanOptions,
      correct_option_index: data.correct_option_index,
      order_index: nextOrder,
      created_at: new Date().toISOString(),
    };

    allQuestions.push(newQuestion);
    await saveQuestionsList(allQuestions);

    revalidatePath('/pre-test');
    revalidatePath('/post-test');
    revalidatePath('/modules');
    revalidatePath('/admin/dashboard');

    return { success: true, question: newQuestion };
  } catch {
    return { success: false, error: 'حدث خطأ أثناء إضافة السؤال' };
  }
}

// 4. تعديل سؤال موجود
export async function updateExamQuestionAction(
  id: string,
  data: Partial<QuestionWithAnswer>
): Promise<{ success: boolean; question?: QuestionWithAnswer; error?: string }> {
  try {
    await assertAdmin();

    const allQuestions = await getAllQuestionsAction();
    const idx = allQuestions.findIndex((q) => q.id === id);

    if (idx === -1) {
      return { success: false, error: 'لم يتم العثور على السؤال' };
    }

    allQuestions[idx] = {
      ...allQuestions[idx],
      ...data,
      question_text: data.question_text ? data.question_text.trim() : allQuestions[idx].question_text,
      options: data.options ? data.options.map((o) => o.trim()).filter(Boolean) : allQuestions[idx].options,
    };

    await saveQuestionsList(allQuestions);

    revalidatePath('/pre-test');
    revalidatePath('/post-test');
    revalidatePath('/admin/dashboard');

    return { success: true, question: allQuestions[idx] };
  } catch (err: unknown) {
    console.error('Error updating question:', err);
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تعديل السؤال';
    return { success: false, error: message };
  }
}

// 5. حذف سؤال
export async function deleteExamQuestionAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();

    const allQuestions = await getAllQuestionsAction();
    const filtered = allQuestions.filter((q) => q.id !== id);

    if (filtered.length === allQuestions.length) {
      return { success: false, error: 'لم يتم العثور على السؤال لحذفه' };
    }

    await saveQuestionsList(filtered);

    revalidatePath('/pre-test');
    revalidatePath('/post-test');
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (err: unknown) {
    console.error('Error deleting question:', err);
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء حذف السؤال';
    return { success: false, error: message };
  }
}

// 6. تسليم وتصحيح الاختبار ديناميكياً وحفظ إجابات الطالب
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
  let username: string | null = null;

  if (devDemoCookie?.value) {
    try {
      const parsed = JSON.parse(devDemoCookie.value);
      currentUserId = parsed.id;
      username = parsed.student_id;
    } catch {}
  }

  const isLive = isLiveSupabaseConfigured();

  if (isLive) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        currentUserId = user.id;
      }
    } catch {}
  }

  if (!currentUserId && !username) {
    return { success: false, error: 'يجب تسجيل الدخول أولاً لتسليم الاختبار' };
  }

  const studentIdentifier = currentUserId || username!;

  // 1. جلب أسئلة الاختبار الحالية من بنك الأسئلة المعتمد
  const questions = await getExamQuestionsAction(examType);
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return { success: false, error: 'لا توجد أسئلة متوفرة في هذا الاختبار حالياً' };
  }

  // التحقق الصارم من الإجابة على جميع الأسئلة بدون أي تجاوز
  const unansweredCount = questions.filter((q) => answers[q.id] === undefined).length;
  if (unansweredCount > 0) {
    return {
      success: false,
      error: `لا يمكن تسليم الاختبار: متبقي ${unansweredCount} أسئلة لم يتم الإجابة عليها. يجب الإجابة على كافة الأسئلة أولاً.`,
    };
  }

  let calculatedScore = 0;
  questions.forEach((q) => {
    const studentSelected = answers[q.id];
    if (studentSelected !== undefined && studentSelected === q.correct_option_index) {
      calculatedScore += 1;
    }
  });

  // 2. تخزين النتيجة مع خريطة الإجابات الكاملة في سجل الطلاب students.json
  const { recordExamResultAction, recordModuleCompletionAction } = await import('@/lib/actions/student.actions');
  await recordExamResultAction(studentIdentifier, examType, calculatedScore, totalQuestions, answers);

  // إذا كان اختبار موديول، يُسجل إتمام الموديول للتقدم الأكاديمي فقط إذا حقق الطالب 7 درجات على الأقل
  if (examType.startsWith('module_')) {
    const modId = examType.replace('module_', '');
    const MODULE_PASSING_SCORE = 7;
    if (calculatedScore >= MODULE_PASSING_SCORE) {
      await recordModuleCompletionAction(studentIdentifier, modId);
    }
  }

  // 3. تخزين في Supabase إذا كانت متصلة
  if (isLive && currentUserId) {
    try {
      const supabase = await createClient();
      await supabase.from('exam_submissions').insert({
        student_id: currentUserId,
        exam_type: examType,
        score: calculatedScore,
        total_questions: totalQuestions,
        answers,
      });

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
      } else if (examType.startsWith('module_')) {
        const modId = examType.replace('module_', '');
        const { getModulesListAction } = await import('@/lib/actions/module.actions');
        const modules = await getModulesListAction();
        const modIdx = modules.findIndex((m) => m.id === modId);
        if (modIdx !== -1) {
          await supabase.from('student_progress').upsert(
            {
              student_id: currentUserId,
              current_module_index: modIdx + 1,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'student_id' }
          );
        }
      }
    } catch (err) {
      console.error('Supabase exam record error:', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/pre-test');
  revalidatePath('/post-test');
  revalidatePath('/modules');
  revalidatePath('/admin/dashboard');

  return {
    success: true,
    score: calculatedScore,
    total: totalQuestions,
  };
}
