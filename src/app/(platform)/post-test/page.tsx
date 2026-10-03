import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExamRunner } from '@/components/exam/exam-runner';
import { getStudentProgressAction } from '@/lib/actions/student.actions';
import { getExamQuestionsAction } from '@/lib/actions/exam.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ArrowLeft, Lock, TrendingUp } from 'lucide-react';
import type { Question } from '@/lib/types/database';
import { shuffleArray } from '@/lib/utils';

export default async function PostTestPage() {
  const [progress, preQuestions, postQuestions] = await Promise.all([
    getStudentProgressAction(),
    getExamQuestionsAction('pre_test'),
    getExamQuestionsAction('post_test'),
  ]);

  // 1. حماية الدخول للمسجلين فقط
  if (!progress.isLoggedIn) {
    redirect('/login');
  }

  // إذا لم يكمل الطالب ملفه الشخصي بعد
  if (!progress.isProfileCompleted && progress.role !== 'admin') {
    redirect('/complete-profile');
  }

  // 2. التحقق من إتمام الموديولات
  if (!progress.isAllModulesCompleted && progress.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-9 h-9" />
          </div>

          <Badge variant="warning" className="px-3 py-1 text-xs">
            الاختبار البعدي مغلق حالياً
          </Badge>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            يرجى استكمال دراسة الموديولات أولاً
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            وفقاً لضوابط البرنامج التعليمي، يلزم إتمام دراسة جميع الوحدات التعليمية المقررة
            ({progress.completedModulesCount} من {progress.totalModulesCount}) لتتمكن من أداء الاختبار البعدي النهائي.
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

  const preTotal = preQuestions.length || 100;
  const postTotal = postQuestions.length || 100;

  // 3. إذا كان الطالب قد أتم الاختبار البعدي بالفعل، عرض بطاقة الإنجاز والأثر التعليمي
  if (progress.postTestCompleted) {
    const pre = progress.preScore ?? 0;
    const post = progress.postScore ?? 0;
    const diff = post - pre;

    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-asu-gold/40 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-asu-gold/15 text-asu-gold-dark flex items-center justify-center mx-auto shadow-inner border border-asu-gold/30">
            <Award className="w-10 h-10 text-asu-gold" />
          </div>

          <div>
            <Badge variant="gold" className="px-3 py-1 text-xs mb-2">
              شهادة إتمام البرنامج التعليمي بنجاح
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-asu-navy">
              تهانينا يا {progress.fullName || 'طالبنا العزيز'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              جامعة عين شمس • كلية الدراسات العليا والبحوث البيئية • تنمية الوعي بقضايا البيئة
            </p>
          </div>

          {/* لوحة المقارنة وقياس الأثر المعرفي */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-1">التقييم القبلي</span>
              <span className="text-2xl font-black text-slate-700 font-mono">
                {progress.preScore ?? '-'}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {preTotal}</span>
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-1">التقييم البعدي النهائي</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {progress.postScore ?? '-'}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {postTotal}</span>
              </span>
            </div>

            <div className="p-3 bg-asu-gold/10 rounded-xl border border-asu-gold/20 shadow-2xs">
              <span className="text-[11px] text-asu-gold-dark font-bold block mb-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-asu-gold-dark" />
                مؤشر نمو التعلم
              </span>
              <span className="text-2xl font-black text-asu-navy font-mono">
                {diff >= 0 ? `+${diff}` : `${diff}`}{' '}
                <span className="text-xs text-slate-500 font-normal">درجات</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
            تم تسجيل وحفظ كافة درجاتك ومخرجاتك التعليمية في السجل الأكاديمي للبحث. نشكر لك
            التزامك ومشاركتك الفعالة في البرنامج التعليمي.
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

  // 4. جلب وتجهيز أسئلة الاختبار البعدي: الاختيار من متعدد أولاً ثم الصواب والخطأ ثانياً مع خلط عشوائي لكل طالب
  const safeQuestions: Question[] = postQuestions.map((q) => ({
    id: q.id,
    exam_type: q.exam_type,
    question_type: q.question_type,
    question_text: q.question_text,
    options: q.options,
    order_index: q.order_index,
  }));

  const mcQuestions = safeQuestions.filter((q) => q.question_type === 'multiple_choice');
  const tfQuestions = safeQuestions.filter((q) => q.question_type === 'true_false');

  const studentSeed = `${progress.studentId || progress.username || 'student'}-post_test`;
  const randomizedMC = shuffleArray(mcQuestions, `${studentSeed}-mc`);
  const randomizedTF = shuffleArray(tfQuestions, `${studentSeed}-tf`);
  const randomizedQuestions = [...randomizedMC, ...randomizedTF];

  return (
    <div className="py-4">
      <ExamRunner
        examType="post_test"
        examTitle="الاختبار البعدي النهائي وقياس الأثر (Post-Test)"
        questions={randomizedQuestions}
      />
    </div>
  );
}
