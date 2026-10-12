import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExamRunner, DEFAULT_SPATIAL_TEST_INSTRUCTIONS } from '@/components/exam/exam-runner';
import { getStudentProgressAction } from '@/lib/actions/student.actions';
import { getExamQuestionsAction } from '@/lib/actions/exam.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import type { Question } from '@/lib/types/database';
import { shuffleArray } from '@/lib/utils';

export default async function PreSpatialTestPage() {
  const [progress, questionsList] = await Promise.all([
    getStudentProgressAction(),
    getExamQuestionsAction('spatial_test'),
  ]);

  // 1. حماية صارمة: إذا كان غير مسجل، يتم تحويله فوراً لصفحة تسجيل الدخول
  if (!progress.isLoggedIn) {
    redirect('/login');
  }

  // إذا لم يكمل الطالب ملفه الشخصي بعد
  if (!progress.isProfileCompleted && progress.role !== 'admin') {
    redirect('/complete-profile');
  }

  // إذا لم يكمل الطالب الاختبار القبلي الأول (الوعي البيئي) بعد
  if (!progress.preTestCompleted && progress.role !== 'admin') {
    redirect('/pre-test');
  }

  // 2. إذا كان الطالب قد أتم اختبار التفكير المكاني القبلي بالفعل
  if (progress.spatialPreTestCompleted) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <Badge variant="success" className="px-3 py-1 text-xs">
            تم اجتياز اختبار التفكير المكاني القبلي بنجاح
          </Badge>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            أهلاً بك {progress.fullName || ''}، لقد أتممت هذا الاختبار مسبقاً!
          </h1>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-500 block mb-0.5">حالة الاختبار</span>
              <span className="text-sm font-black text-emerald-700">تم إتمام الاختبار بنجاح</span>
            </div>
            <div className="h-8 w-px bg-emerald-200" />
            <div>
              <span className="text-xs text-slate-500 block mb-0.5">حالة المسار</span>
              <span className="text-sm font-bold text-slate-700">الموديولات التعليمية مفتوحة</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            تم رصد إجاباتك بنجاح ولا يمكن إعادة أداء الاختبار القبلي مرة أخرى حفاظاً على دقة القياس العلمي. يمكنك المتابعة لدراسة الموديولات والدعامات التعليمية المقررة.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/modules" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <span>الانتقال لدراسة الموديولات</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-200 text-slate-700">
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. تجهيز الأسئلة الـ 36
  const safeQuestions: Question[] = questionsList.map((q) => ({
    id: q.id,
    exam_type: 'pre_spatial_test',
    question_type: q.question_type || 'multiple_choice',
    context_text: q.context_text,
    question_text: q.question_text,
    options: q.options,
    order_index: q.order_index,
  }));

  const studentSeed = `${progress.studentId || progress.username || 'student'}-pre_spatial_test`;
  const randomizedQuestions = shuffleArray(safeQuestions, studentSeed);

  return (
    <div className="py-4">
      <ExamRunner
        examType="pre_spatial_test"
        examTitle="اختبار مهارات التفكير المكاني (قبلي)"
        questions={randomizedQuestions}
        instructions={DEFAULT_SPATIAL_TEST_INSTRUCTIONS}
        onCompleteRedirectUrl="/modules"
      />
    </div>
  );
}
