import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle2, Sparkles, ArrowLeft, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'الأهداف العامة | منصة الوعي بقضايا البيئة للمرحلة الثانوية • جامعة عين شمس',
  description: 'الأهداف العامة للبرنامج التعليمي - كلية التربية جامعة عين شمس',
};

export default function ObjectivesPage() {
  const objectives = [
    {
      number: '٠١',
      text: 'تتعرف على مكونات البيئة والعلاقات المكانية بينها.',
    },
    {
      number: '٠٢',
      text: 'تتعرف على التلوث البيئي ومصادره وتوزيعه المكاني.',
    },
    {
      number: '٠٣',
      text: 'تتعرف على التغيرات المناخية وآثارها البيئية والمكانية.',
    },
    {
      number: '٠٤',
      text: 'تتعرف على الاستدامة البيئية وكيفية مواجهة المشكلات البيئية واتخاذ القرارات المناسبة.',
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
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-asu-navy" />
          </div>
          <span>الأهداف العامة</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
          مخرجات ونواتج التعلم المستهدفة التي تسعى هذه البيئة التعليمية إلى إكسابها للدارسين
        </p>
      </div>

      {/* 2. بطاقة توجيه الخطاب للطالب / الطالبة */}
      <div className="rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-asu-navy via-[#1c2c6d] to-asu-navy-dark text-white shadow-xl border border-asu-gold/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-asu-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-asu-gold-light mt-0.5">
            <GraduationCap className="w-6 h-6 text-asu-gold" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-black text-asu-gold-light">
              عزيزي الطالب / الطالبة
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed">
              بعد دراستك للمحتوى التعليمي من خلال البيئة الحالية ينبغي أن تكون قادرًا على أن:
            </p>
          </div>
        </div>
      </div>

      {/* 3. قائمة الأهداف العامة الأربعة */}
      <div className="space-y-3.5 sm:space-y-4">
        {objectives.map((obj) => (
          <Card
            key={obj.number}
            className="border-slate-200/90 bg-white shadow-xs hover:border-asu-gold/60 hover:shadow-md transition-all rounded-2xl sm:rounded-3xl overflow-hidden group"
          >
            <CardContent className="p-4 sm:p-6 flex items-start gap-4">
              {/* رقم الهدف بالأرقام المعتمدة */}
              <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-asu-navy group-hover:text-white text-asu-navy font-black flex items-center justify-center shrink-0 text-base sm:text-lg border border-slate-200/80 group-hover:border-asu-navy transition-all shadow-xs">
                <span>{obj.number}</span>
              </div>

              {/* نص الهدف */}
              <div className="flex-1 pt-1 space-y-1">
                <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed group-hover:text-asu-navy transition-colors">
                  {obj.text}
                </p>
              </div>

              {/* أيقونة التحقق */}
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. أزرار التنقل السريعة */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80">
        <Link href="/instructions" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full sm:w-auto text-xs font-bold border-slate-300">
            الانتقال لصفحة التعليمات والإرشادات
          </Button>
        </Link>

        <Link href="/modules" className="w-full sm:w-auto">
          <Button variant="gold" size="md" className="w-full sm:w-auto gap-2 font-black shadow-md shadow-asu-gold/20">
            <span>بدء استعراض المحتوى والوحدات</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
