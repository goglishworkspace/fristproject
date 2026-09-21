import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { MODULES_DATA } from '@/data/modules';
import { completeModuleAction } from '@/lib/actions/module.actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';

interface ModulePageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function SingleModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const moduleData = MODULES_DATA.find((m) => m.id === moduleId);

  if (!moduleData) {
    notFound();
  }

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

  if (!currentUserId) {
    redirect('/login');
  }

  // التحقق من تقدم الطالب لمنع فتح موديول متقدم قبل وقته
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', currentUserId)
    .single();

  const moduleIndex = MODULES_DATA.findIndex((m) => m.id === moduleId);
  const currentAllowedIndex = progress?.current_module_index ?? (devDemoCookie ? moduleIndex : 0);

  if (moduleIndex > currentAllowedIndex) {
    redirect('/modules');
  }

  const isCompleted = currentAllowedIndex > moduleIndex;
  const isLastModule = moduleIndex === MODULES_DATA.length - 1;

  const handleComplete = completeModuleAction.bind(null, moduleData.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* زر العودة وشارة الترتيب */}
      <div className="flex items-center justify-between">
        <Link href="/modules" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة الوحدات</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3.5 h-3.5" />
            {moduleData.durationMinutes} دقيقة مقدرة
          </Badge>
          {isCompleted && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> تم إنجاز الوحدة
            </Badge>
          )}
        </div>
      </div>

      {/* ترويسة الوحدة */}
      <div className="space-y-3 border-b border-slate-200 pb-6 text-right">
        <span className="text-xs font-bold text-emerald-600 tracking-wide uppercase">
          الوحدة التعليمية رقم 0{moduleData.order}
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
          {moduleData.title}
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          {moduleData.subtitle}
        </p>
      </div>

      {/* نواتج التعلم والأهداف */}
      <Card className="bg-emerald-50/40 border-emerald-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>الأهداف التعليمية المستهدفة من هذه الوحدة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {moduleData.objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* محتوى وأقسام المادة العلمية */}
      <div className="space-y-6">
        {moduleData.sections.map((sec, i) => (
          <Card key={i} className="bg-white border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>{sec.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm text-slate-700 leading-relaxed text-right">
              <p>{sec.content}</p>
              {sec.points && (
                <ul className="space-y-2 pr-4 border-r-2 border-emerald-300 mr-1">
                  {sec.points.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs md:text-sm text-slate-600">
                      • {pt}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* النشاط التطبيقي للوحدة */}
      <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
        <CardHeader className="border-b border-amber-200/60 pb-3">
          <Badge variant="warning" className="w-fit mb-1">
            نشاط تفاعلي
          </Badge>
          <CardTitle className="text-base text-amber-950">
            {moduleData.activity.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-right space-y-3">
          <p className="text-xs md:text-sm text-amber-900 font-medium">
            {moduleData.activity.prompt}
          </p>
          <textarea
            rows={3}
            placeholder="اكتب ملاحظاتك وإجابتك حول النشاط هنا (تطبيق ذاتي)..."
            className="w-full p-3 rounded-xl border border-amber-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </CardContent>
      </Card>

      {/* قسم إنهاء الوحدة والانتقال لما بعدها */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/modules">
          <Button variant="outline" size="md" className="gap-2">
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة الوحدات</span>
          </Button>
        </Link>

        <form action={handleComplete}>
          <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-md">
            {isLastModule ? (
              <>
                <Award className="w-5 h-5" />
                <span>إتمام جميع الوحدات والانتقال للاختبار البعدي</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>إتمام هذه الوحدة والانتقال للوحدة التالية</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
