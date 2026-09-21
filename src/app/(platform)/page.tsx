import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Info,
  Lock,
  LogIn,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import type { StudentProgress } from '@/lib/types/database';

export default async function PlatformHomePage() {
  const cookieStore = await cookies();
  const devDemoCookie = cookieStore.get('dev_demo_user');

  let studentId: string | null = null;
  if (devDemoCookie?.value) {
    try {
      const parsed = JSON.parse(devDemoCookie.value);
      studentId = parsed.id;
    } catch {
      // ignore
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUserId = studentId || user?.id;

  // جلب مسار وتقدم الطالب إذا كان مسجل دخوله
  let progress: StudentProgress | null = null;
  if (currentUserId) {
    const { data } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', currentUserId)
      .single();
    progress = data;
  }

  const isLoggedIn = !!currentUserId;
  const preCompleted = !!progress?.pre_test_completed;
  const postCompleted = !!progress?.post_test_completed;

  return (
    <div className="space-y-10">
      {/* 1. قسم البانر التعريفي والنبذة العامة للمنصة (Hero Section للزوار والطلاب) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-900 text-white p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-5 text-right">
          <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 text-xs px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 ml-1.5 inline text-emerald-300" />
            البيئة التعليمية الرقمية المعتمدة
          </Badge>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            منصة بيئتي التعليمية التفاعلية
          </h1>
          
          <p className="text-emerald-100/90 text-sm md:text-lg leading-relaxed font-normal">
            منصة تعليمية وبحثية متكاملة تقدم موديولات وأنشطة تفاعلية مدعومة بنظام تقييم قبلي وبعدي
            دقيق لقياس الأثر التعليمي وتطور المستوى المعرفي لدى الطلاب.
          </p>

          {!isLoggedIn && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/login">
                <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 gap-2 font-bold shadow-lg">
                  <LogIn className="w-4 h-4 ml-1" />
                  <span>تسجيل دخول الطالب لبدء الاختبارات</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* خلفيات جمالية خفيفة */}
        <div className="absolute left-0 bottom-0 translate-y-1/3 -translate-x-1/4 w-[450px] h-[450px] bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. نبذة عامة عن أهداف ومكونات المنصة (متاحة لكل زائر) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-right space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">تقييم قبلي تشخيصي</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            اختبار قبلي موضوعي لقياس الحصيلة المعرفية المبدئية قبل الخوض في المادة العلمية.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-right space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">موديولات تعليمية تفاعلية</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            وحدات تعليمية ممنهجة مدعومة بالوسائط والأنشطة التطبيقية لترسيخ المفاهيم.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-right space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">تقييم بعدي وقياس الأثر</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            اختبار بعدي نهائي لقياس معدل التطور والتحسن العلمي للطالب بدقة.
          </p>
        </div>
      </div>

      {/* 3. خريطة مسار الطالب */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">مسار التعلم المعتمد</h2>
          {!isLoggedIn && (
            <span className="text-xs text-slate-500">سجل الدخول لبدء مسارك الشخصي</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. الاختبار القبلي */}
          <Card className={`relative transition-all ${preCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white shadow-md'}`}>
            <CardHeader>
              <div className="flex items-center justify-between pb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  1
                </div>
                {preCompleted ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
                  </Badge>
                ) : (
                  <Badge variant="warning" className="gap-1">
                    <Clock className="w-3.5 h-3.5" /> الخطوة الأولى
                  </Badge>
                )}
              </div>
              <CardTitle>الاختبار القبلي (Pre-Test)</CardTitle>
              <CardDescription>
                تحديد المستوى المعرفي المبدئي قبل البدء في المنهج
              </CardDescription>
            </CardHeader>
            <CardContent>
              {preCompleted ? (
                <p className="text-xs text-emerald-700 font-medium">
                  تم تسليم الاختبار القبلي بنجاح.
                </p>
              ) : (
                <Link href={isLoggedIn ? "/pre-test" : "/login"} className="block mt-2">
                  <Button className="w-full gap-2">
                    <span>{isLoggedIn ? "بدء الاختبار القبلي" : "دخول لأداء الاختبار"}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* 2. الموديولات التعليمية */}
          <Card className={`relative transition-all ${!preCompleted ? 'opacity-75 bg-slate-50' : 'bg-white shadow-md border-slate-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between pb-2">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  2
                </div>
                {!preCompleted ? (
                  <Badge variant="default" className="gap-1 bg-slate-200 text-slate-600">
                    <Lock className="w-3.5 h-3.5" /> مغلق
                  </Badge>
                ) : (
                  <Badge variant="success" className="gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> متاح الآن
                  </Badge>
                )}
              </div>
              <CardTitle>الوحدات والموديولات</CardTitle>
              <CardDescription>
                المحتوى التفاعلي والأنشطة المقررة لكل وحدة
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!preCompleted ? (
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  يُفتح تلقائياً بعد إنهاء الاختبار القبلي
                </p>
              ) : (
                <Link href="/modules" className="block mt-2">
                  <Button variant="secondary" className="w-full gap-2">
                    <span>تصفح الموديولات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* 3. الاختبار البعدي */}
          <Card className={`relative transition-all ${!preCompleted || !postCompleted ? 'opacity-75 bg-slate-50' : 'bg-white shadow-md border-slate-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between pb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  3
                </div>
                {postCompleted ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1 bg-slate-200 text-slate-600">
                    <Lock className="w-3.5 h-3.5" /> مغلق
                  </Badge>
                )}
              </div>
              <CardTitle>الاختبار البعدي (Post-Test)</CardTitle>
              <CardDescription>
                التقييم الختامي لقياس مدى الاستفادة وتطور المستوى
              </CardDescription>
            </CardHeader>
            <CardContent>
              {postCompleted ? (
                <p className="text-xs text-emerald-700 font-medium">
                  تم الانتهاء من كامل متطلبات المنصة بنجاح!
                </p>
              ) : (
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  يُتاح بعد الانتهاء من دراسة الموديولات
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
