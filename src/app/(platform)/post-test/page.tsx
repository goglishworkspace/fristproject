import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { DEFAULT_POST_TEST_QUESTIONS } from '@/data/exam-questions';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ExamRunner } from '@/components/exam/exam-runner';
import { MODULES_DATA } from '@/data/modules';
import type { Question } from '@/lib/types/database';

export default async function PostTestPage() {
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

  // 1. حماية الدخول للمسجلين فقط
  if (!currentUserId) {
    redirect('/login');
  }

  let safeQuestions: Question[] = [];

  if (isLive) {
    try {
      const supabase = await createClient();
      // 2. فحص حالة الطالب وتقدمه
      const { data: progress } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', currentUserId)
        .single();

      // التحقق: هل أتم الاختبار البعدي بالفعل؟ نوجهه للرئيسية لمنع الإعادة
      if (progress?.post_test_completed) {
        redirect('/');
      }

      // التحقق: هل أتم دراسة جميع الموديولات؟
      const currentIdx = progress?.current_module_index ?? 0;
      if (currentIdx < MODULES_DATA.length) {
        redirect('/modules');
      }

      // 3. جلب أسئلة الاختبار البعدي بدون الإجابات الصحيحة للحماية من الغش
      const { data: questions } = await supabase
        .from('questions')
        .select('id, exam_type, question_text, options, order_index')
        .eq('exam_type', 'post_test')
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

  // بنك الأسئلة الاحتياطي التفاعلي
  if (safeQuestions.length === 0) {
    safeQuestions = DEFAULT_POST_TEST_QUESTIONS.map((q) => ({
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
        examType="post_test"
        examTitle="الاختبار البعدي النهائي وقياس الأثر (Post-Test)"
        questions={safeQuestions}
      />
    </div>
  );
}
