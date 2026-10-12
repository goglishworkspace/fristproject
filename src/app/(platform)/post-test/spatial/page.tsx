import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExamRunner, DEFAULT_SPATIAL_TEST_INSTRUCTIONS } from '@/components/exam/exam-runner';
import { getStudentProgressAction } from '@/lib/actions/student.actions';
import { getExamQuestionsAction } from '@/lib/actions/exam.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ArrowLeft, Lock, TrendingUp } from 'lucide-react';
import type { Question } from '@/lib/types/database';
import { shuffleArray } from '@/lib/utils';

export default async function PostSpatialTestPage() {
  const [progress, questionsList] = await Promise.all([
    getStudentProgressAction(),
    getExamQuestionsAction('spatial_test'),
  ]);

  // 1. حماية الدخول للمسجلين فقط
  if (!progress.isLoggedIn) {
    redirect('/login');
  }

  // إذا لم يكمل الطالب ملفه الشخصي بعد
  if (!progress.isProfileCompleted && progress.role !== 'admin') {
    redirect('/complete-profile');
  }

  // إذا لم تكتمل دراسة جميع الموديولات
  if (!progress.isAllModulesCompleted && progress.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-9 h-9" />
          </div>

          <Badge variant="warning" className="px-3 py-1 text-xs">
            الاختبار مغلق حالياً
          </Badge>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            يرجى استكمال دراسة الموديولات أولاً
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            وفقاً لضوابط البرنامج التعليمي، يلزم إتمام دراسة جميع الوحدات التعليمية المقررة أولاً.
          </p>

          <div className="pt-3">
            <Link href="/modules">
              <Button size="lg" className="gap-2 bg-asu-navy hover:bg-asu-navy-light text-white font-bold">
                <span>الانتقال للموديولات وإتمامها</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يكمل الطالب الاختبار البعدي الأول (الوعي البيئي) بعد
  if (!progress.postTestCompleted && progress.role !== 'admin') {
    redirect('/post-test');
  }

  const spatialTotal = questionsList.length || 36;

  // 2. إذا كان الطالب قد أتم اختبار التفكير المكاني البعدي بالفعل
  if (progress.spatialPostTestCompleted) {
    const pre = progress.spatialPreScore ?? 0;
    const post = progress.spatialPostScore ?? 0;
    const diff = post - pre;

    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-asu-gold/40 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-asu-gold/15 text-asu-gold-dark flex items-center justify-center mx-auto shadow-inner border border-asu-gold/30">
            <Award className="w-10 h-10 text-asu-gold" />
          </div>

          <div>
            <Badge variant="gold" className="px-3 py-1 text-xs mb-2">
              تم إتمام اختبار مهارات التفكير المكاني بعدياً بنجاح
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-asu-navy">
              تهانينا يا {progress.fullName || 'طالبنا العزيز'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              جامعة عين شمس • كلية الدراسات العليا والبحوث البيئية • مهارات التفكير المكاني
            </p>
          </div>

          {/* لوحة المقارنة وقياس الأثر في التفكير المكاني */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-1 font-bold">التقييم القبلي</span>
              <span className="text-2xl font-black text-slate-700 font-mono">
                {progress.spatialPreScore ?? '-'}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {spatialTotal}</span>
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-1 font-bold">التقييم البعدي النهائي</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {progress.spatialPostScore ?? '-'}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {spatialTotal}</span>
              </span>
            </div>

            <div className="p-3 bg-asu-gold/10 rounded-xl border border-asu-gold/20 shadow-2xs">
              <span className="text-[11px] text-asu-gold-dark font-bold block mb-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-asu-gold-dark" />
                مؤشر نمو المهارة
              </span>
              <span className="text-2xl font-black text-asu-navy font-mono">
                {diff >= 0 ? `+${diff}` : `${diff}`}{' '}
                <span className="text-xs text-slate-500 font-normal">درجات</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
            تم حفظ نتائجك بنجاح في السجل الأكاديمي. لقد استكملت جميع متطلبات البرنامج التعليمي بالكامل.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-asu-navy hover:bg-asu-navy-light text-white font-bold">
                <span>العودة للصفحة الرئيسية</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
            <Link href="/modules" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-200 text-slate-700">
                مراجعة الوحدات التعليمية
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
    exam_type: 'post_spatial_test',
    question_type: q.question_type || 'multiple_choice',
    context_text: q.context_text,
    question_text: q.question_text,
    options: q.options,
    order_index: q.order_index,
  }));

  const studentSeed = `${progress.studentId || progress.username || 'student'}-post_spatial_test`;
  const randomizedQuestions = shuffleArray(safeQuestions, studentSeed);

  return (
    <div className="py-4">
      <ExamRunner
        examType="post_spatial_test"
        examTitle="اختبار مهارات التفكير المكاني (بعدي)"
        questions={randomizedQuestions}
        instructions={DEFAULT_SPATIAL_TEST_INSTRUCTIONS}
        onCompleteRedirectUrl="/"
      />
    </div>
  );
}
