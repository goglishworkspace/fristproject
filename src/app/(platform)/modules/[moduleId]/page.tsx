import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getModulesListAction, completeModuleAction } from '@/lib/actions/module.actions';
import { getStudentProgressAction, getStudentsListAction } from '@/lib/actions/student.actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModuleImageSlider } from '@/components/modules/module-image-slider';
import { ModuleActivityBox } from '@/components/modules/module-activity-box';
import { ASU_LOGO_URL } from '@/lib/constants/branding';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react';

interface ModulePageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function SingleModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const modules = await getModulesListAction();
  const moduleData = modules.find((m) => m.id === moduleId);

  if (!moduleData) {
    notFound();
  }

  const progress = await getStudentProgressAction();

  if (!progress.isLoggedIn) {
    redirect('/login');
  }

  if (!progress.isProfileCompleted && progress.role !== 'admin') {
    redirect('/complete-profile');
  }

  if (!progress.preTestCompleted && progress.role !== 'admin') {
    redirect('/pre-test');
  }

  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  const currentAllowedIndex =
    progress.role === 'admin' ? modules.length : progress.currentModuleIndex;

  if (moduleIndex > currentAllowedIndex) {
    redirect('/modules');
  }

  const isCompleted = currentAllowedIndex > moduleIndex;
  const isLastModule = moduleIndex === modules.length - 1;
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = !isLastModule ? modules[moduleIndex + 1] : null;

  // جلب تسليم الطالب لهذا النشاط إن وُجد
  const students = await getStudentsListAction();
  const currentStudent = students.find(
    (s) =>
      s.id.toLowerCase() === progress.studentId?.toLowerCase() ||
      s.username.toLowerCase() === progress.username?.toLowerCase()
  );
  const existingSubmission = currentStudent?.activitySubmissions?.[moduleId] || null;

  const handleComplete = completeModuleAction.bind(null, moduleData.id);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16 text-right">
      {/* 1. شريط التنقل والمسار (Breadcrumbs & Navigation Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-asu-navy transition-colors">
            الرئيسية
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-300" />
          <Link href="/modules" className="hover:text-asu-navy transition-colors">
            الوحدات التعليمية
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-300" />
          <span className="text-asu-navy font-black">{moduleData.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-asu-gold/40 text-asu-gold-dark bg-asu-gold/5 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{moduleData.durationMinutes} دقيقة مقدرة</span>
          </Badge>

          {isCompleted && (
            <Badge variant="success" className="gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم إنجاز الوحدة</span>
            </Badge>
          )}
        </div>
      </div>

      {/* 2. الترويسة الملكية للوحدة التعليمية (Royal Hero Banner) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-asu-navy-dark via-asu-navy to-[#182660] text-white p-6 sm:p-10 shadow-2xl border-2 border-asu-gold/30">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 bg-asu-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-asu-gold/25 text-asu-gold-light border border-asu-gold/50 text-xs px-3 py-1 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 ml-1.5 inline" />
                الوحدة التعليمية رقم 0{moduleData.order}
              </Badge>
              <span className="text-xs text-slate-300 font-medium">
                منصة بيئتي • جامعة عين شمس
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              {moduleData.title}
            </h1>

            {moduleData.subtitle && (
              <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                {moduleData.subtitle}
              </p>
            )}
          </div>

          <div className="shrink-0 flex md:flex-col items-center gap-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ASU_LOGO_URL} alt="شعار الجامعة" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] text-asu-gold-light font-bold">كلية التربية</span>
          </div>
        </div>
      </section>

      {/* 3. سلايدر الصور التفاعلي للوحدة والدعامات التعليمية (Slide Player & Scaffolding) */}
      {((moduleData.images && moduleData.images.length > 0) || (moduleData.slides && moduleData.slides.length > 0)) && (
        <section className="space-y-2">
          <ModuleImageSlider
            images={moduleData.images}
            slides={moduleData.slides}
            defaultScaffolding={moduleData.scaffolding}
            moduleTitle={moduleData.title}
          />
        </section>
      )}

      {/* 4. فقرات وموضوعات الوحدة العلمية (Content Sections) */}
      {moduleData.sections && moduleData.sections.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
            <Layers className="w-5 h-5 text-asu-gold-dark" />
            <h2 className="text-xl font-black text-asu-navy">المحتوى العلمي والمعرفي</h2>
          </div>

          <div className="space-y-5">
            {moduleData.sections.map((section, idx) => (
              <Card
                key={section.id || idx}
                className="bg-white border border-slate-200/90 shadow-sm rounded-3xl overflow-hidden hover:border-asu-gold/40 transition-all"
              >
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl font-bold text-asu-navy flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-asu-navy/10 text-asu-navy text-xs font-black flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 sm:p-7 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-normal">
                  <p>{section.content}</p>

                  {section.points && section.points.length > 0 && (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                      {section.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-asu-gold shrink-0 mt-2" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 5. قسم النشاط التطبيقي العملي مع إمكانية التسليم والرفع */}
      {moduleData.activity && (
        <section className="pt-2">
          <ModuleActivityBox
            moduleId={moduleData.id}
            activityTitle={moduleData.activity.title}
            activityDescription={moduleData.activity.description}
            existingSubmission={existingSubmission}
          />
        </section>
      )}

      {/* 6. شريط الإجراءات السفلي والانتقال وإتمام الوحدة */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border">
        <div>
          {prevModule ? (
            <Link href={`/modules/${prevModule.id}`}>
              <Button variant="outline" size="md" className="gap-2 text-xs font-bold text-slate-600">
                <ArrowRight className="w-4 h-4" />
                <span>الوحدة السابقة: {prevModule.title}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/modules">
              <Button variant="outline" size="md" className="gap-2 text-xs font-bold text-slate-600">
                <ArrowRight className="w-4 h-4" />
                <span>العودة لقائمة الوحدات</span>
              </Button>
            </Link>
          )}
        </div>

        <form action={handleComplete}>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full sm:w-auto gap-2 shadow-lg shadow-asu-gold/20 font-black text-sm"
          >
            {isLastModule ? (
              <>
                <Award className="w-5 h-5 ml-1 text-asu-navy" />
                <span>إتمام البرنامج والانتقال للاختبار البعدي النهائي</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 ml-1 text-asu-navy" />
                <span>إتمام هذه الوحدة والانتقال للوحدة التالية</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
