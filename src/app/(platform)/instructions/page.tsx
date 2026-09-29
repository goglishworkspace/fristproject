import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  ClipboardCheck,
  Compass,
  BookOpen,
  Award,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const metadata = {
  title: 'التعليمات | منصة بيئتي التعليمية • جامعة عين شمس',
  description: 'تعليمات وإرشادات بيئة التعلم التفاعلية - كلية التربية جامعة عين شمس',
};

export default function InstructionsPage() {
  const environmentComponents = [
    {
      step: '١',
      title: 'تطبيق اختبار الوعي بقضايا البيئة قبليًا',
      category: 'تقويم تشخيصي قبلي',
      icon: ClipboardCheck,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      step: '٢',
      title: 'تطبيق اختبار التفكير المكاني قبليًا',
      category: 'تقويم تشخيصي قبلي',
      icon: Compass,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      step: '٣',
      title: 'دراسة المحتوى التعليمي، وهو مكوّن من أربعة موديولات تعليمية',
      category: 'المسار التعليمي الأساسي',
      icon: BookOpen,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      step: '٤',
      title: 'تطبيق مقياس الوعي بقضايا البيئة بعديًا',
      category: 'تقويم ختامي وقياس أثر',
      icon: Award,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      step: '٥',
      title: 'تطبيق اختبار التفكير المكاني بعديًا',
      category: 'تقويم ختامي وقياس أثر',
      icon: TrendingUp,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 text-right py-2">
      {/* 1. الترويسة الرئيسية */}
      <div className="border-b border-slate-200/90 pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="gold" className="text-xs px-3 py-1 font-bold">
            <Sparkles className="w-3.5 h-3.5 ml-1.5 inline text-asu-gold-dark" />
            جامعة عين شمس • كلية التربية
          </Badge>
          <span className="text-xs text-slate-500 font-medium">قسم المناهج وطرق التدريس</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-asu-navy flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-asu-navy-50 text-asu-navy flex items-center justify-center shrink-0 border border-asu-navy/15 shadow-xs">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-asu-navy" />
          </div>
          <span>التعليمات</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
          إرشادات وضوابط السير في بيئة التعلم لتحقيق أقصى استفادة علمية وتربوية
        </p>
      </div>

      {/* 2. بطاقة توجيه الخطاب والهدف من البيئة */}
      <div className="rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-asu-navy via-[#1c2c6d] to-asu-navy-dark text-white shadow-xl border border-asu-gold/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-asu-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-asu-gold-light mt-0.5">
            <GraduationCap className="w-6 h-6 text-asu-gold" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-black text-asu-gold-light">
              عزيزي الطالب / الطالبة
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-100 font-normal leading-relaxed">
              إن الهدف من هذه البيئة هو تنمية الوعي بقضايا البيئة والتفكير المكاني لديك، ولتحقيق ذلك تم إعداد هذه البيئة، وهي مكوّنة من:
            </p>
          </div>
        </div>
      </div>

      {/* 3. عناصر ومكونات البيئة التعليمية الخمسة */}
      <div className="space-y-3.5 sm:space-y-4">
        {environmentComponents.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.step}
              className="border-slate-200/90 bg-white shadow-xs hover:border-asu-gold/60 hover:shadow-md transition-all rounded-2xl sm:rounded-3xl overflow-hidden group"
            >
              <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                {/* رقم العنصر بالأرقام العربية */}
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-asu-navy group-hover:text-white text-asu-navy font-black flex items-center justify-center shrink-0 text-lg sm:text-xl border border-slate-200/80 group-hover:border-asu-navy transition-all shadow-xs">
                  <span>{item.step}</span>
                </div>

                {/* نص العنصر وتصنيفه */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug group-hover:text-asu-navy transition-colors">
                    {item.title}
                  </p>
                </div>

                {/* أيقونة العنصر */}
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 group-hover:text-asu-navy group-hover:bg-asu-gold/15 flex items-center justify-center shrink-0 transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 4. تنبيه الترتيب الإلزامي والالتزام */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-2 border-amber-300 shadow-md space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-sm sm:text-base text-amber-950">
              ضوابط الترتيب والتتابع الأكاديمي الإلزامي:
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              ويجب مراعاة الترتيب في تناول عناصر البيئة؛ فتبدأ بتطبيق اختبار الوعي بقضايا البيئة واختبار التفكير المكاني قبليًا، ثم دراسة الموديولات التعليمية بالترتيب وأداء الأنشطة والتقويمات الخاصة بها، وتطبيق مقياس الوعي بقضايا البيئة واختبار التفكير المكاني بعديًا.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold text-amber-900">
          <span>الرجاء الالتزام بتلك التعليمات.</span>
          <span className="text-amber-800 font-semibold">شاكرين لكم حسن تعاونكم.</span>
        </div>
      </div>

      {/* 5. أزرار التنقل السريعة */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80">
        <Link href="/objectives" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full sm:w-auto text-xs font-bold border-slate-300">
            الانتقال لصفحة الأهداف العامة
          </Button>
        </Link>

        <Link href="/pre-test" className="w-full sm:w-auto">
          <Button variant="gold" size="md" className="w-full sm:w-auto gap-2 font-black shadow-md shadow-asu-gold/20">
            <span>البدء وأداء الاختبار القبلي</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
