import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import type { StudentProgress } from '@/lib/types/database';

export default async function PlatformHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // جلب مسار وتقدم الطالب
  let progress: StudentProgress | null = null;
  if (user) {
    const { data } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', user.id)
      .single();
    progress = data;
  }

  const preCompleted = !!progress?.pre_test_completed;
  const postCompleted = !!progress?.post_test_completed;

  return (
    <div className="space-y-8">
      {/* قسم الترحيب والنبذة العامة */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-8 md:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4 text-right">
          <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 ml-1 inline text-emerald-300" />
            بيئة التعلم الرقمية الذكية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            مرحباً بك في منصة بيئتي التعليمية
          </h1>
          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
            تم تصميم هذه المنصة لدعم دراستك وتطوير معرفتك من خلال موديولات تفاعلية وأنشطة تطبيقية.
            تبدأ رحلتك باختبار قبلي لتحديد المستوى، يليه المحتوى التعليمي، ثم اختبار بعدي لقياس تقدمك.
          </p>
        </div>
        <div className="absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* تنبيه تعليمات المسار الإجباري */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-sm">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-right leading-relaxed">
          <span className="font-bold">تنبيه هام حول مسار التعلم:</span> يتطلب النظام اجتياز الاختبار القبلي أولاً لفتح الموديولات والأنشطة التعليمية، وبعد إتمامها سيتاح لك الاختبار البعدي.
        </div>
      </div>

      {/* خريطة مسار الطالب (Progress Cards) */}
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
                  <Clock className="w-3.5 h-3.5" /> مطلوب الآن
                </Badge>
              )}
            </div>
            <CardTitle>الاختبار القبلي (Pre-Test)</CardTitle>
            <CardDescription>
              قياس معلوماتك المبدئية قبل البدء في المنهج التعليمي
            </CardDescription>
          </CardHeader>
          <CardContent>
            {preCompleted ? (
              <p className="text-xs text-emerald-700 font-medium">
                تم تسليم الاختبار القبلي بنجاح. يمكنك الآن الانتقال للموديولات.
              </p>
            ) : (
              <Link href="/pre-test" className="block mt-2">
                <Button className="w-full gap-2">
                  <span>بدء الاختبار القبلي</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* 2. الموديولات التعليمية */}
        <Card className={`relative transition-all ${!preCompleted ? 'opacity-70 bg-slate-50' : 'bg-white shadow-md border-slate-200'}`}>
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
              المادة العلمية المقسمة والأنشطة التطبيقية لكل وحدة
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
        <Card className={`relative transition-all ${!preCompleted || !postCompleted ? 'opacity-70 bg-slate-50' : 'bg-white shadow-md border-slate-200'}`}>
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
              التقييم الختامي لقياس مدى تحصيلك وتطور مستواك
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
                يُفتح بعد الانتهاء من دراسة جميع الموديولات
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
