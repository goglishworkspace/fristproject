import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getModulesListAction } from '@/lib/actions/module.actions';
import { getStudentProgressAction } from '@/lib/actions/student.actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Award,
  Sparkles,
} from 'lucide-react';

const MODULE_LABELS = [
  'الموديول الأول',
  'الموديول الثاني',
  'الموديول الثالث',
  'الموديول الرابع',
];

export default async function ModulesListPage() {
  const [progress, modules] = await Promise.all([
    getStudentProgressAction(),
    getModulesListAction(),
  ]);

  // 1. حماية الدخول: للمستخدمين المسجلين فقط
  if (!progress.isLoggedIn) {
    redirect('/login');
  }

  // إذا لم يكمل الطالب ملفه الشخصي بعد
  if (!progress.isProfileCompleted && progress.role !== 'admin') {
    redirect('/complete-profile');
  }

  // 2. التحقق من أداء الاختبار القبلي
  if (!progress.preTestCompleted && progress.role !== 'admin') {
    redirect('/pre-test');
  }

  const currentModuleIdx = progress.currentModuleIndex;
  const isAllModulesDone = currentModuleIdx >= modules.length && modules.length > 0;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 pb-6 bg-white p-6 sm:p-7 rounded-3xl shadow-xs">
        <div>
          <Badge variant="gold" className="mb-2 font-bold gap-1 px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-asu-gold-dark" />
            <span>مسار التعلم التفاعلي • كلية الدراسات العليا والبحوث البيئية</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-asu-navy">
            الموديولات التعليمية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            يرجى دراسة الموديولات المقررة بالترتيب وإتمام متطلباتها قبل الانتقال للاختبار البعدي.
          </p>
        </div>

        {/* بطاقة الانتقال للاختبار البعدي */}
        <div className="flex items-center gap-3">
          {isAllModulesDone ? (
            <Link href="/post-test">
              <Button size="lg" variant="gold" className="gap-2 shadow-lg shadow-asu-gold/20 font-black">
                <Award className="w-5 h-5 ml-1 text-asu-navy" />
                <span>الانتقال للاختبار البعدي النهائي</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          ) : (
            <div className="p-3 px-4 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-2 border border-slate-200/80">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>
                يُفتح الاختبار البعدي بعد إتمام الموديولات ({Math.min(currentModuleIdx, modules.length)} / {modules.length})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* قائمة الموديولات الـ 4 بعرض الصفحة وتحت بعض */}
      {modules.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">لا توجد موديولات مضافة حالياً</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-5">
          {modules.map((module, index) => {
            const isDone = index < currentModuleIdx;
            const isCurrent = index === currentModuleIdx;
            const isLocked = index > currentModuleIdx && progress.role !== 'admin';
            const moduleLabel = MODULE_LABELS[index] || `الموديول ${index + 1}`;
            const moduleNumber = `0${index + 1}`;

            return (
              <div
                key={module.id}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 ${
                  isCurrent
                    ? 'bg-white border-asu-gold shadow-lg shadow-asu-gold/15 ring-4 ring-asu-gold/10'
                    : isDone
                    ? 'bg-white border-emerald-300/80 shadow-xs hover:border-emerald-400'
                    : 'bg-slate-50/70 border-slate-200 opacity-75'
                }`}
              >
                {/* خط جانبي جمالي للموديول النشط */}
                {isCurrent && (
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-asu-gold to-asu-gold-dark" />
                )}
                {isDone && (
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-emerald-500" />
                )}

                {/* الجانب الأيمن: الترقيم واسم الموديول */}
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* شارة الترقيم الفاخرة */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-xl shrink-0 transition-transform group-hover:scale-105 ${
                      isCurrent
                        ? 'bg-asu-navy text-asu-gold shadow-md shadow-asu-navy/20 border border-asu-gold/40'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-200/80 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    ) : (
                      moduleNumber
                    )}
                  </div>

                  {/* اسم الموديول وحالته فقط بدون أي بيانات أخرى أو صور */}
                  <div className="space-y-1">
                    <h2
                      className={`text-xl sm:text-2xl font-black tracking-tight ${
                        isCurrent
                          ? 'text-asu-navy'
                          : isDone
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {moduleLabel}
                    </h2>

                    <div className="flex items-center gap-2">
                      {isDone && (
                        <Badge
                          variant="success"
                          className="px-2.5 py-0.5 text-xs font-bold gap-1 bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم إتمام الموديول بنجاح</span>
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge
                          variant="gold"
                          className="px-2.5 py-0.5 text-xs font-bold gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-asu-gold-dark" />
                          <span>الموديول متاح حالياً للتعلم</span>
                        </Badge>
                      )}
                      {isLocked && (
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>مغلق (أتمم الموديول السابق أولاً)</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* الجانب الأيسر: زر بدء التعلم أو الدراسة */}
                <div className="shrink-0 w-full sm:w-auto">
                  {isLocked ? (
                    <Button
                      size="lg"
                      disabled
                      className="w-full sm:w-auto px-7 py-6 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 font-bold text-sm gap-2 cursor-not-allowed shadow-none"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>مغلق حالياً</span>
                    </Button>
                  ) : (
                    <Link href={`/modules/${module.id}`} className="block w-full sm:w-auto">
                      <Button
                        size="lg"
                        className={`w-full sm:w-auto px-8 sm:px-10 py-6 rounded-2xl font-black text-sm sm:text-base gap-2.5 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                          isCurrent
                            ? 'bg-gradient-to-r from-asu-navy to-[#182a63] hover:from-[#132252] hover:to-asu-navy text-white shadow-asu-navy/20'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                        }`}
                      >
                        <span>{isDone ? 'مراجعة الموديول' : 'بدء التعلم'}</span>
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
