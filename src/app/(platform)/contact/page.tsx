import { Badge } from '@/components/ui/badge';
import { ContactForm } from '@/components/contact/contact-form';
import { Sparkles } from 'lucide-react';
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

      {/* 2. نموذج إرسال الاستفسار والدعم الفني المباشر */}
      <section id="contact-form-section" className="max-w-3xl mx-auto w-full">
        <ContactForm />
      </section>
    </div>
  );
}
