import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function InstructionsPage() {
  const instructions = [
    {
      step: '1',
      title: 'تسجيل الدخول للمنصة',
      desc: 'استخدم كود الطالب وكلمة المرور المسلمة لك من قِبل إدارة الكلية أو المشرف.',
    },
    {
      step: '2',
      title: 'أداء الاختبار القبلي (إلزامي)',
      desc: 'يجب الإجابة على جميع أسئلة الاختبار القبلي دون تخطي، حيث لن يُفتح المحتوى التعليمي إلا بعد تسليمه.',
    },
    {
      step: '3',
      title: 'دراسة الوحدات والموديولات بالتتابع',
      desc: 'انتقل بين الوحدات بترتيبها المحدد، واقرأ الأهداف ونواتج التعلم وتفاعل مع الأنشطة في نهاية كل موديول.',
    },
    {
      step: '4',
      title: 'أداء الاختبار البعدي النهائي',
      desc: 'بعد إتمام كامل الوحدات بنجاح، ستتاح لك صفحة الاختبار البعدي لقياس أثر التعلم ورصد نتيجتك النهائية.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-asu-navy flex items-center gap-3">
          <FileText className="w-8 h-8 text-asu-navy" />
          <span>تعليمات وإرشادات الاستخدام</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          دليلك الإرشادي للتنقل في بيئة التعلم الرقمية واجتياز متطلبات الدراسة بنجاح
        </p>
      </div>

      <div className="space-y-4">
        {instructions.map((item) => (
          <Card key={item.step} className="border-slate-200/80 bg-white shadow-xs hover:border-asu-navy/30 transition-colors">
            <CardContent className="p-4 sm:p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-asu-navy text-white font-bold flex items-center justify-center shrink-0 text-base shadow-sm">
                0{item.step}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs md:text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">ملاحظة تقنية:</span> تأكد من وجود اتصال مستقر بالإنترنت قبل تسليم الاختبارات لتفادي انقطاع الجلسة ورصد الدرجة بدقة في قاعدة البيانات.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/login">
          <Button className="gap-2">
            <span>تسجيل الدخول والبدء</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
