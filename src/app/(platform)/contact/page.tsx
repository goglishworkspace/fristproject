import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContactForm } from '@/components/contact/contact-form';
import {
  Mail,
  Building2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Clock,
  ExternalLink,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { ASU_LOGO_URL } from '@/lib/constants/branding';

export const metadata = {
  title: 'تواصل معنا والدعم الفني | منصة الوعي بقضايا البيئة للمرحلة الثانوية • جامعة عين شمس',
  description: 'قنوات التواصل المعتمدة مع فريق الإشراف الأكاديمي والدعم الفني لمنصة الوعي بقضايا البيئة للمرحلة الثانوية بكلية التربية جامعة عين شمس.',
};

export default function ContactUsPage() {
  return (
    <div className="space-y-8 md:space-y-12 text-right pb-12">
      {/* 1. الهيدر الملكي الفاخر (Royal Hero Header) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-asu-navy-dark via-asu-navy to-[#18265b] text-white p-6 sm:p-10 md:p-12 shadow-2xl border border-asu-gold/30">
        {/* تأثيرات الإضاءة التراثية الهادئة */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 sm:w-96 sm:h-96 bg-asu-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 sm:w-[420px] sm:h-[420px] bg-asu-navy-light/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-asu-gold/20 text-asu-gold-light border border-asu-gold/40 text-[11px] sm:text-xs px-3 py-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 ml-1.5 inline text-asu-gold-light" />
                جامعة عين شمس • كلية التربية
              </Badge>
              <span className="text-[11px] text-slate-300 font-medium">
                قسم المناهج وطرق التدريس
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              تواصل معنا • <span className="text-asu-gold-light">الإشراف الأكاديمي</span> والدعم الفني
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-normal">
              يسعدنا في منصة الوعي بقضايا البيئة للمرحلة الثانوية استقبال استفسارات وملاحظات الطلاب والباحثين وأعضاء هيئة التدريس،
              لتوفير الدعم الأكاديمي والتقني المتميز وفق أعلى معايير الجودة التعليمية.
            </p>

            {/* شارة حالة الاستجابة الفورية */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-bold backdrop-blur-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>فريق الإشراف والدعم متاح للرد على استفساراتكم</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-slate-300 text-xs">
                <Clock className="w-4 h-4 text-asu-gold-light" />
                <span>المواعيد: الأحد - الخميس | 9:00 ص - 3:00 م</span>
              </div>
            </div>
          </div>

          {/* لوجو الجامعة والدرع الأكاديمي الملكي */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative group p-5 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-asu-gold/40 shadow-2xl flex flex-col items-center text-center max-w-[240px] sm:max-w-[260px]">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-3 shadow-inner flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ASU_LOGO_URL}
                  alt="شعار جامعة عين شمس"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-extrabold text-xs sm:text-sm text-white">جامعة عين شمس</p>
              <p className="text-[11px] text-asu-gold-light mt-0.5 font-bold">كلية التربية</p>
              <div className="mt-2.5 pt-2.5 border-t border-white/15 w-full">
                <span className="text-[10px] text-slate-200">الإشراف والمتابعة البحثية المستمرة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. بطاقات قنوات التواصل الرسمية الأربع (Royal Contact Hub) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-asu-navy-50 text-asu-navy flex items-center justify-center border border-asu-navy/20">
              <Compass className="w-4 h-4 text-asu-navy" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-asu-navy">
                قنوات التواصل والاعتماد الأكاديمي
              </h2>
              <p className="text-xs text-slate-500">
                اختر القناة المناسبة لاستفسارك للحصول على أسرع استجابة
              </p>
            </div>
          </div>
          <Badge variant="gold" className="text-xs px-3 py-1 hidden sm:inline-flex">
            قنوات رسمية معتمدة
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* القناة 1: الإشراف الأكاديمي */}
          <div className="group rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-asu-gold/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-asu-navy-50 text-asu-navy flex items-center justify-center border border-asu-navy/15 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-asu-navy" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-asu-navy bg-asu-navy-50 px-2 py-0.5 rounded-md inline-block mb-1">
                  أكاديمي وبحثي
                </span>
                <h3 className="text-base font-black text-slate-900">
                  الإشراف الأكاديمي
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  قسم المناهج وطرق التدريس بكلية التربية لمتابعة محتوى الوحدات والتقييمات.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a
                href="mailto:education@asu.edu.eg"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-asu-navy hover:text-asu-gold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">education@asu.edu.eg</span>
              </a>
            </div>
          </div>

          {/* القناة 2: الدعم الفني والتقني */}
          <div className="group rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-asu-gold/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-asu-gold-50 text-asu-gold-dark flex items-center justify-center border border-asu-gold/30 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-asu-gold-dark" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-asu-gold-dark bg-asu-gold-50 px-2 py-0.5 rounded-md inline-block mb-1">
                  تقني ومنظومة
                </span>
                <h3 className="text-base font-black text-slate-900">
                  الدعم الفني للمنصة
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  حل مشكلات الحسابات وكود الطالب، وتسجيل الاختبارات والتوافق مع الأجهزة.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a
                href="mailto:support@asu.edu.eg"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-asu-navy transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">support@faculty.local</span>
              </a>
            </div>
          </div>

          {/* القناة 3: المقر الجامعي والزيارات */}
          <div className="group rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-asu-gold/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-asu-green-50 text-asu-green flex items-center justify-center border border-asu-green/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-asu-green" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-asu-green bg-asu-green-50 px-2 py-0.5 rounded-md inline-block mb-1">
                  المقر الأكاديمي
                </span>
                <h3 className="text-base font-black text-slate-900">
                  كلية التربية - روكسي
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  مصر الجديدة، القاهرة • جامعة عين شمس، مبنى كلية التربية، قسم المناهج.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a
                href="https://maps.google.com/?q=Ain+Shams+University+Faculty+of+Education"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-asu-green hover:underline"
              >
                <span>الموقع على الخريطة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. نموذج إرسال الاستفسار والدعم الفني المباشر */}
      <section id="contact-form-section" className="max-w-3xl mx-auto w-full">
        <ContactForm />
      </section>

      {/* 4. قسم الأسئلة الشائعة الأكاديمية والتقنية (Royal FAQ Section) */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-asu-navy-50 text-asu-navy flex items-center justify-center border border-asu-navy/20">
            <HelpCircle className="w-4 h-4 text-asu-navy" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-asu-navy">
              الأسئلة الشائعة والإجابات الفورية
            </h2>
            <p className="text-xs text-slate-500">
              إجابات سريعة ومباشرة على أكثر الاستفسارات تكراراً من الطلاب والباحثين
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-slate-200/80 bg-white shadow-2xs hover:border-asu-gold/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-asu-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-asu-navy-50 text-asu-navy text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>كيف أحصل على كود الطالب وكلمة المرور الخاصة بي؟</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              يتم تسليم كود الطالب الأكاديمي (مثل 2026101) من خلال المشرف الأكاديمي أو إدارة البحث بكلية التربية، وتكون كلمة المرور الموحدة الافتراضية مسجلة وموثقة في كشف المجموعات التجريبية.
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white shadow-2xs hover:border-asu-gold/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-asu-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-asu-navy-50 text-asu-navy text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>هل يمكنني إعادة أداء الاختبار القبلي بعد إنهائه؟</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              وفق المعايير المنهجية للبحث الأكاديمي، يُسمح بأداء الاختبار القبلي لمرة واحدة فقط لتشخيص المستوى الأولي، وبعدها ينتقل الطالب مباشرة لدراسة الوحدات والموديولات التعليمية.
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white shadow-2xs hover:border-asu-gold/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-asu-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-asu-navy-50 text-asu-navy text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>ماذا أفعل إذا انقطع الاتصال بالإنترنت أثناء حل الاختبار؟</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              النظام يحتفظ بالإجابات محلياً على المتصفح أثناء التفاعل، ولكن يُنصح بضمان استقرار الشبكة قبل الضغط على زر «تسليم وإنهاء الاختبار نهائياً» لضمان حفظ النتيجة في السجل.
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white shadow-2xs hover:border-asu-gold/40 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-asu-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-asu-navy-50 text-asu-navy text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <span>كيف يتأكد المشرف من استكمال دراسة كافة الموديولات؟</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              تحتوي لوحة تحكم المشرف (`/admin/dashboard`) على نظام رصد فوري لنسب إنجاز كل طالب لكل موديول على حدة، وتاريخ تسليم الاختبار القبلي والبعدي لحساب الفروق الإحصائية.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
