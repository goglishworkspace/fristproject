import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getModulesListAction } from '@/lib/actions/module.actions';
import { getStudentProgressAction } from '@/lib/actions/student.actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, CheckCircle2, ArrowLeft, ArrowRight, Lock, Award, Sparkles, ImageIcon } from 'lucide-react';

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
    <div className="space-y-8 text-right max-w-6xl mx-auto">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 bg-white p-6 rounded-3xl shadow-sm border">
        <div>
          <Badge variant="gold" className="mb-2 font-bold gap-1">
            <Sparkles className="w-3.5 h-3.5 text-asu-gold-dark" />
            <span>مسار التعلم التفاعلي • كلية التربية</span>
          </Badge>
          <h1 className="text-2xl md:text-3xl font-black text-asu-navy">
            الوحدات والموديولات التعليمية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            يرجى دراسة الوحدات المقررة وإتمام أنشطتها بالترتيب قبل الانتقال للاختبار البعدي.
          </p>
        </div>

        {/* بطاقة الاختبار البعدي السريعة */}
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
            <div className="p-3.5 px-4 rounded-2xl bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-2 border border-slate-200/80">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>
                يُفتح الاختبار البعدي بعد إتمام الوحدات ({currentModuleIdx} / {modules.length})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* قائمة بطاقات الموديولات */}
      {modules.length === 0 ? (
        <Card className="text-center p-12 max-w-xl mx-auto rounded-3xl border-dashed">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <CardTitle className="text-lg text-slate-700">لا توجد وحدات تعليمية مضافة حالياً</CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            يمكن للمشرف الأكاديمي إضافة الوحدات وصورها وفقراتها من لوحة التحكم.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => {
            const isDone = index < currentModuleIdx;
            const isCurrent = index === currentModuleIdx;
            const isLocked = index > currentModuleIdx && progress.role !== 'admin';
            const firstImage = module.images?.[0];

            return (
              <Card
                key={module.id}
                className={`transition-all rounded-3xl overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'border-2 border-asu-gold ring-4 ring-asu-gold/15 shadow-xl bg-white'
                    : isDone
                    ? 'border border-emerald-200 bg-emerald-50/20'
                    : 'opacity-70 bg-slate-50 border-slate-200'
                }`}
              >
                {/* صورة الغلاف إن وُجدت */}
                {firstImage && (
                  <div className="relative w-full h-44 bg-slate-900 overflow-hidden border-b border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={firstImage}
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1 font-mono">
                      <ImageIcon className="w-3 h-3" />
                      <span>{module.images.length} صور</span>
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-asu-navy/10 text-asu-navy font-black text-xs flex items-center justify-center font-mono">
                        0{module.order}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-asu-gold-dark" />
                        {module.durationMinutes} دقيقة
                      </span>
                    </div>

                    {isDone && (
                      <Badge variant="success" className="gap-1 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge variant="gold" className="gap-1 font-bold text-[11px]">
                        الوحدة الحالية
                      </Badge>
                    )}
                    {isLocked && (
                      <Badge variant="default" className="gap-1 text-[11px]">
                        <Lock className="w-3.5 h-3.5" /> مغلق
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-lg font-black text-asu-navy leading-snug">
                    {module.title}
                  </CardTitle>
                  {module.subtitle && (
                    <CardDescription className="text-xs text-slate-600 line-clamp-2">
                      {module.subtitle}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-3">
                  {module.sections && module.sections.length > 0 && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1">
                      <span className="font-bold text-slate-800 block text-[11px]">المحتويات:</span>
                      <span className="line-clamp-2 text-[11px] leading-relaxed">
                        {module.sections.map((s) => s.title).join(' • ')}
                      </span>
                    </div>
                  )}

                  {module.activity && (
                    <div className="flex items-center gap-1.5 text-xs text-asu-gold-dark font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>نشاط: {module.activity.title}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-3 border-t border-slate-100">
                  {isLocked ? (
                    <Button variant="outline" size="md" className="w-full text-slate-400 cursor-not-allowed" disabled>
                      <Lock className="w-4 h-4 ml-1.5" />
                      <span>الوحدة مغلقة (أتمم الوحدة السابقة أولاً)</span>
                    </Button>
                  ) : (
                    <Link href={`/modules/${module.id}`} className="w-full">
                      <Button
                        variant={isCurrent ? 'gold' : 'outline'}
                        size="md"
                        className="w-full font-bold justify-between"
                      >
                        <span>{isDone ? 'مراجعة محتوى الوحدة' : 'بدء دراسة الوحدة'}</span>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
