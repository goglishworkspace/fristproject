import { createClient } from '@/lib/supabase/server';
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    currentUserId = user.id;
  }

  // 1. حماية الدخول للمسجلين فقط
  if (!currentUserId) {
    redirect('/login');
  }

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

  // التحقق: هل أتم دراسة جميع الموديولات؟ إذا لم يتمها نوجهه لصفحة الموديولات
  const currentIdx = progress?.current_module_index ?? (devDemoCookie ? MODULES_DATA.length : 0);
  if (currentIdx < MODULES_DATA.length && !devDemoCookie) {
    redirect('/modules');
  }

  // 3. جلب أسئلة الاختبار البعدي بدون الإجابات الصحيحة للحماية من الغش
  const { data: questions } = await supabase
    .from('questions')
    .select('id, exam_type, question_text, options, order_index')
    .eq('exam_type', 'post_test')
    .order('order_index', { ascending: true });

  // في حالة عدم توفر أسئلة في الداتابيز بعد، نستخدم نفس بنك الأسئلة أو أسئلة افتراضية
  const safeQuestions: Question[] = (questions && questions.length > 0)
    ? questions.map((q) => ({
        id: q.id,
        exam_type: q.exam_type,
        question_text: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
        order_index: q.order_index,
      }))
    : [
        {
          id: 'q-post-1',
          exam_type: 'post_test',
          question_text: 'ما هو العنصر الأساسي المسؤول عن تحلل المواد العضوية وإعادة تدوير العناصر في النظام البيئي؟',
          options: ['المستهلكات الأولية', 'المحللات (كالبكتيريا والفطريات)', 'المنتجات (النباتات)', 'المفترسات العليا'],
          order_index: 1,
        },
        {
          id: 'q-post-2',
          exam_type: 'post_test',
          question_text: 'يقصد بالاقتصاد الدائري في الممارسات البيئية المعاصرة:',
          options: ['استنزاف الموارد بأقصى سرعة ممكنة', 'تعظيم استدامة الموارد وتقليل الهدر وتدوير النفايات', 'الاعتماد الكلي على الوقود الأحفوري', 'تصدير المخلفات خارج البيئة المحلية'],
          order_index: 2,
        },
        {
          id: 'q-post-3',
          exam_type: 'post_test',
          question_text: 'أي من الممارسات التالية يسهم بشكل مباشر في خفض البصمة الكربونية؟',
          options: ['الاعتماد على مصادر الطاقة المتجددة', 'زيادة استخدام البلاستيك أحادي الاستخدام', 'حرق النفايات الصلبة عشوائياً', 'الاستخدام المفرط لوسائل النقل الفردية'],
          order_index: 3,
        }
      ];

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
