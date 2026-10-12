import Link from 'next/link';
import { getStudentProgressAction } from '@/lib/actions/student.actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Sparkles,
  LogIn,
  BookMarked,
  Leaf,
  CheckCircle2,
  Award,
  User,
  LayoutDashboard,
  BookOpen,
} from 'lucide-react';
import { ASU_LOGO_URL } from '@/lib/constants/branding';
import { EnvironmentalAwarenessCarousel } from '@/components/home/environmental-awareness-carousel';

export default async function PlatformHomePage() {
  const progress = await getStudentProgressAction();
  const isLoggedIn = progress.isLoggedIn;
  const isAdmin = progress.role === 'admin';

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 pb-6 w-full max-w-full overflow-hidden">
      {/* 1. قسم البانر التعريفي الرئيسي (Hero Section) لمنصة الوعي بقضايا البيئة للمرحلة الثانوية */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-asu-navy-dark via-asu-navy to-[#1c2c6d] text-white p-4 sm:p-8 md:p-12 shadow-2xl border border-asu-gold/20 w-full max-w-full">
        {/* خلفيات ضوئية جمالية مستوحاة من ألوان الشعار */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 sm:w-96 sm:h-96 bg-asu-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 sm:w-[420px] sm:h-[420px] bg-asu-navy-light/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
          {/* المحتوى النصي للبانر */}
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-4 md:space-y-6 text-right">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge className="bg-asu-gold/20 text-asu-gold-light border border-asu-gold/40 text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 font-bold leading-normal">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 inline text-asu-gold-light" />
                <span>جامعة عين شمس • كلية الدراسات العليا والبحوث البيئية</span>
              </Badge>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium hidden sm:inline-block">
                قسم المناهج وطرق التدريس
              </span>
            </div>

            {/* بطاقة ترحيب شخصية بالطالب المسجل */}
            {isLoggedIn && !isAdmin && progress.fullName && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-asu-gold/30 text-xs font-bold text-asu-gold-light">
                <User className="w-3.5 h-3.5 text-asu-gold" />
                <span>مرحباً بك: {progress.fullName}</span>
                <span className="text-slate-300 font-normal">({progress.username})</span>
              </div>
            )}

            <h1 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight leading-snug sm:leading-tight text-white">
              منصة <span className="text-asu-gold-light">الوعي بقضايا البيئة</span> للمرحلة الثانوية
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-normal">
              بيئة تعلم رقمية تفاعلية قائمة على المعايير التربوية الحديثة، تقدم وحدات تعليمية
              مدعومة بنظام تقييم قبلي وبعدي ذكي لقياس الأثر التعليمي وتطوير الكفايات المعرفية.
            </p>

            {/* بطاقة حالة التقدم الحالية للطالب إن كان مسجلاً */}
            {isLoggedIn && !isAdmin && (
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-100">
                    {progress.isFullyCompleted ? (
                      <>
                        <Award className="w-4 h-4 text-asu-gold-light" />
                        <span className="text-asu-gold-light font-black">تهانينا! أتممت البرنامج التعليمي بنجاح</span>
                      </>
                    ) : progress.isAllModulesCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>أنهيت دراسة جميع الموديولات، جاهز للاختبار البعدي</span>
                      </>
                    ) : progress.preTestCompleted ? (
                      <>
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>أتممت الاختبار القبلي بنجاح • جارٍ دراسة الموديولات</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-asu-gold-light" />
                        <span>المرحلة الأولى: أداء الاختبار القبلي لتحديد المستوى</span>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-300 font-mono bg-white/10 px-2.5 py-0.5 rounded-full">
                    الموديولات: {progress.moduleProgress}
                  </span>
                </div>
              </div>
            )}

            {/* أزرار الإجراءات المتجاوبة مع الهواتف والحالة */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!isLoggedIn ? (
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                  >
                    <LogIn className="w-4 h-4 ml-1" />
                    <span>تسجيل الدخول</span>
                  </Button>
                </Link>
              ) : isAdmin ? (
                <>
                  <Link href="/admin/dashboard" className="w-full sm:w-auto">
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                    >
                      <LayoutDashboard className="w-4 h-4 ml-1" />
                      <span>لوحة التحكم والمشرف الأكاديمي</span>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </Link>
                  <Link href="/modules" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent font-bold"
                    >
                      <BookMarked className="w-4 h-4 ml-1.5" />
                      <span>معاينة الموديولات</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* أزرار مسار الطالب الذكية */}
                  {!progress.preTestCompleted ? (
                    <Link href="/pre-test" className="w-full sm:w-auto">
                      <Button
                        variant="gold"
                        size="lg"
                        className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                      >
                        <span>بدء اختبار الوعي بقضايا البيئة (قبلي)</span>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>
                  ) : !progress.spatialPreTestCompleted ? (
                    <Link href="/pre-test/spatial" className="w-full sm:w-auto">
                      <Button
                        variant="gold"
                        size="lg"
                        className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                      >
                        <span>بدء اختبار التفكير المكاني (قبلي)</span>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>
                  ) : !progress.isAllModulesCompleted ? (
                    <Link href="/modules" className="w-full sm:w-auto">
                      <Button
                        variant="gold"
                        size="lg"
                        className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                      >
                        <BookOpen className="w-4 h-4 ml-1" />
                        <span>متابعة دراسة الموديولات (الدعامات)</span>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>
                  ) : !progress.postTestCompleted ? (
                    <Link href="/post-test" className="w-full sm:w-auto">
                      <Button
                        variant="gold"
                        size="lg"
                        className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                      >
                        <Award className="w-4 h-4 ml-1" />
                        <span>بدء اختبار الوعي بقضايا البيئة (بعدي)</span>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>
                  ) : !progress.spatialPostTestCompleted ? (
                    <Link href="/post-test/spatial" className="w-full sm:w-auto">
                      <Button
                        variant="gold"
                        size="lg"
                        className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                      >
                        <Award className="w-4 h-4 ml-1" />
                        <span>بدء اختبار التفكير المكاني (بعدي)</span>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/post-test/spatial" className="w-full sm:w-auto">
                      <Button
                        variant="gold"
                        size="lg"
                        className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
                      >
                        <Award className="w-4 h-4 ml-1" />
                        <span>عرض النتائج والشهادة النهائية</span>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>
                  )}

                  <Link href="/modules" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent font-bold"
                    >
                      <BookMarked className="w-4 h-4 ml-1.5" />
                      <span>قائمة الوحدات</span>
                    </Button>
                  </Link>

                  <Link href="/library" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent font-bold"
                    >
                      <span>المكتبة الإثرائية</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* لوجو الجامعة والدرع الأكاديمي في الهيرو */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative group p-4 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center text-center max-w-[240px] sm:max-w-[260px]">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-3 shadow-inner flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ASU_LOGO_URL}
                  alt="شعار جامعة عين شمس"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-extrabold text-xs sm:text-sm text-white">جامعة عين شمس</p>
              <p className="text-[10px] text-asu-gold-light mt-0.5 font-semibold">تأسست عام 1950</p>
              <div className="mt-2.5 pt-2.5 border-t border-white/15 w-full">
                <span className="text-[10px] text-slate-300">كلية الدراسات العليا والبحوث البيئية • بحث أكاديمي محكم</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. قسم صورة "تنمية الوعي بقضايا البيئة" المخصص والمجهز بالكامل */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-right border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-asu-green-50 text-asu-green flex items-center justify-center border border-asu-green/20">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-asu-navy">
                تنمية الوعي بقضايا البيئة
              </h2>
              <p className="text-xs text-slate-500">
                المحتوى البصري والتوعوي المعتمد للبرنامج التدريبي
              </p>
            </div>
          </div>
          <Badge variant="gold" className="self-start sm:self-auto text-xs px-3 py-1">
            جامعة عين شمس
          </Badge>
        </div>

        {/* معرض وبانر الصور التفاعلي المتنقل (Carousel) مع تبديل تلقائي وتأثير ناعم */}
        <EnvironmentalAwarenessCarousel />
      </section>
    </div>
  );
}
