import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, CheckCircle2, Award, Sparkles } from 'lucide-react';

export default function ObjectivesPage() {
  const generalObjectives = [
    'إكساب الطلاب المفاهيم العلمية الصحيحة المرتبطة بالنظم البيئية والتنوع الحيوي.',
    'تنمية مهارات التفكير العلمي والتحليل النقدي للتحديات البيئية المعاصرة.',
    'تعزيز السلوكيات البيئية الإيجابية والممارسات المستدامة في الحياة اليومية.',
    'توضيح مفهوم الاقتصاد الدائري وإدارة النفايات وفق أهداف التنمية المستدامة (SDGs).',
    'قياس فاعلية بيئات التعلم الرقمية القائمة على الموديولات التفاعلية في التحصيل المعرفي.',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-asu-navy flex items-center gap-3">
          <Target className="w-8 h-8 text-asu-navy" />
          <span>الأهداف العامة للمنصة والبرنامج</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          المخرجات ونواتج التعلم المستهدفة التي تسعى هذه البيئة التعليمية إلى تحقيقها
        </p>
      </div>

      <div className="space-y-4">
        {generalObjectives.map((obj, index) => (
          <Card key={index} className="border-slate-200/80 bg-white shadow-xs hover:border-asu-gold/40 transition-colors">
            <CardContent className="p-4 md:p-5 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-asu-navy-50 text-asu-navy flex items-center justify-center shrink-0 mt-0.5 border border-asu-navy/10">
                <CheckCircle2 className="w-5 h-5 text-asu-gold-dark" />
              </div>
              <p className="text-sm md:text-base font-semibold text-slate-800 leading-relaxed pt-0.5">
                {obj}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
