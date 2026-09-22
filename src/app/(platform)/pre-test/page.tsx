import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { DEFAULT_PRE_TEST_QUESTIONS } from '@/data/exam-questions';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ExamRunner } from '@/components/exam/exam-runner';
import type { Question } from '@/lib/types/database';

export default async function PreTestPage() {
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

  if (isLive) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        currentUserId = user.id;
      }
    } catch {
      // ignore
    }
  }

  // حماية صارمة: إذا كان زائر غير مسجل، يتم تحويله فوراً لصفحة تسجيل الدخول
  if (!currentUserId) {
    redirect('/login');
  }

  let safeQuestions: Question[] = [];

  if (isLive) {
    try {
      const supabase = await createClient();
      // التحقق: إذا كان قد أتم الاختبار القبلي بالفعل، يُحول للموديولات لمنع الإعادة
      const { data: progress } = await supabase
        .from('student_progress')
        .select('pre_test_completed')
        .eq('student_id', currentUserId)
        .single();

      if (progress?.pre_test_completed) {
        redirect('/modules');
      }

      // جلب الأسئلة الآمنة بدون إجابات صحيحة
      const { data: questions } = await supabase
        .from('questions')
        .select('id, exam_type, question_text, options, order_index')
        .eq('exam_type', 'pre_test')
        .order('order_index', { ascending: true });

      if (questions && questions.length > 0) {
        safeQuestions = questions.map((q) => ({
          id: q.id,
          exam_type: q.exam_type,
          question_text: q.question_text,
          options: Array.isArray(q.options) ? q.options : [],
          order_index: q.order_index,
        }));
      }
    } catch {
      // ignore
    }
  }

  // استخدام بنك الأسئلة الافتراضي إن لم توجد أسئلة أو عند العمل محلياً
  if (safeQuestions.length === 0) {
    safeQuestions = DEFAULT_PRE_TEST_QUESTIONS.map((q) => ({
      id: q.id,
      exam_type: q.exam_type,
      question_text: q.question_text,
      options: q.options,
      order_index: q.order_index,
    }));
  }

  return (
    <div className="py-4">
      <ExamRunner
        examType="pre_test"
        examTitle="الاختبار القبلي لتحديد المستوى (Pre-Test)"
        questions={safeQuestions}
      />
    </div>
  );
}
