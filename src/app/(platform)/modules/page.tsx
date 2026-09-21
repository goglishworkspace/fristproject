import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { MODULES_DATA } from '@/data/modules';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, CheckCircle2, ArrowLeft, ArrowRight, Lock, Award } from 'lucide-react';
import type { StudentProgress } from '@/lib/types/database';

export default async function ModulesListPage() {
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

  // 1. حماية الدخول: للمستخدمين المسجلين فقط
  if (!currentUserId) {
    redirect('/login');
  }

  // 2. التحقق الصارم: هل أتم الطالب الاختبار القبلي؟
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', currentUserId)
    .single();

  // في وضع المعاينة السريعة (Demo) إذا لم يكن هناك سجل نسمح بالمرور
  const isPreCompleted = progress?.pre_test_completed ?? (devDemoCookie ? true : false);

  if (!isPreCompleted) {
    redirect('/pre-test');
  }

  const currentModuleIdx = progress?.current_module_index ?? 0;
  const isAllModulesDone = currentModuleIdx >= MODULES_DATA.length;

  return (
    <div className="space-y-8">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Badge variant="success" className="mb-2">
            تم اجتياز الاختبار القبلي بنجاح
          </Badge>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            الوحدات والموديولات التعليمية
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            يرجى دراسة الوحدات المقررة وإتمام أنشطتها بالترتيب قبل الانتقال للاختبار البعدي.
          </p>
        </div>

        {/* بطاقة الاختبار البعدي السريعة */}
        <div className="flex items-center gap-3">
          {isAllModulesDone ? (
            <Link href="/post-test">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-md">
                <Award className="w-5 h-5" />
                <span>الانتقال للاختبار البعدي النهائي</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <div className="p-3 px-4 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>يُفتح الاختبار البعدي بعد إتمام الموديولات ({currentModuleIdx}/{MODULES_DATA.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* قائمة بطاقات الموديولات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MODULES_DATA.map((module, index) => {
          const isDone = index < currentModuleIdx;
          const isCurrent = index === currentModuleIdx;
          const isLocked = index > currentModuleIdx;

          return (
            <Card
              key={module.id}
              className={`transition-all ${
                isCurrent
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-lg bg-white'
                  : isDone
                  ? 'border-emerald-100 bg-emerald-50/20'
                  : 'opacity-70 bg-slate-50 border-slate-200'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      0{module.order}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {module.durationMinutes} دقيقة
                    </span>
                  </div>

                  {isDone && (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="warning" className="gap-1">
                      الوحدة الحالية
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge variant="default" className="gap-1">
                      <Lock className="w-3.5 h-3.5" /> مغلق
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-lg font-bold text-slate-900 leading-snug">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 line-clamp-2">
                  {module.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {module.overview}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    أهداف الوحدة:
                  </span>
                  {module.objectives.slice(0, 2).map((obj, i) => (
                    <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span className="line-clamp-1">{obj}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-slate-100">
                {isLocked ? (
                  <Button variant="secondary" disabled className="w-full text-xs gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>يلزم إتمام الوحدة السابقة</span>
                  </Button>
                ) : (
                  <Link href={`/modules/${module.id}`} className="w-full">
                    <Button
                      variant={isCurrent ? 'primary' : 'outline'}
                      className="w-full text-xs gap-2"
                    >
                      <span>{isDone ? 'مراجعة محتوى الوحدة' : 'بدء دراسة الوحدة'}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
