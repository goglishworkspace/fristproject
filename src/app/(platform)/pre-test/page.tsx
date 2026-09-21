import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExamRunner } from '@/components/exam/exam-runner';
import type { Question } from '@/lib/types/database';

export default async function PreTestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // التحقق أولاً: إذا كان قد أتم الاختبار القبلي بالفعل، نوجهه للموديولات مباشرة لمنع الإعادة
  const { data: progress } = await supabase
    .from('student_progress')
    .select('pre_test_completed')
    .eq('student_id', user.id)
    .single();

  if (progress?.pre_test_completed) {
    redirect('/modules');
  }

  // جلب الأسئلة بدون حقل الإجابة الصحيحة correct_option_index لضمان عدم تسريبها
  const { data: questions } = await supabase
    .from('questions')
    .select('id, exam_type, question_text, options, order_index')
    .eq('exam_type', 'pre_test')
    .order('order_index', { ascending: true });

  const safeQuestions: Question[] = (questions || []).map((q) => ({
    id: q.id,
    exam_type: q.exam_type,
    question_text: q.question_text,
    options: Array.isArray(q.options) ? q.options : [],
    order_index: q.order_index,
  }));

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
