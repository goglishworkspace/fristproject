'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Send,
  User,
  Mail,
  Hash,
  FileText,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  ClipboardList,
  RefreshCw,
} from 'lucide-react';

type InquiryCategory = 'academic' | 'technical' | 'exam' | 'suggestion';

interface CategoryOption {
  id: InquiryCategory;
  label: string;
  icon: React.ElementType;
  description: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'academic',
    label: 'استفسار أكاديمي',
    icon: GraduationCap,
    description: 'أسئلة حول محتوى الموديولات وأنشطة التعلم',
  },
  {
    id: 'technical',
    label: 'مشكلة فنية',
    icon: ShieldCheck,
    description: 'تسجيل الدخول، كود الطالب، أو أخطاء التصفح',
  },
  {
    id: 'exam',
    label: 'الاختبارات والتقييم',
    icon: ClipboardList,
    description: 'الاختبار القبلي أو البعدي وتسجيل الدرجات',
  },
  {
    id: 'suggestion',
    label: 'مقترح تطوير',
    icon: Sparkles,
    description: 'أفكار وملاحظات لتطوير المنصة التعليمية',
  },
];

export function ContactForm() {
  const [category, setCategory] = useState<InquiryCategory>('academic');
  const [fullName, setFullName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    referenceId: string;
    categoryLabel: string;
    name: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !message.trim()) {
      setErrorMessage('يرجى ملء الاسم الكامل وتفاصيل الرسالة على الأقل لإرسال الاستفسار.');
      return;
    }

    setIsSubmitting(true);

    // محاكاة إرسال فوري أنيق بدون انتظار
    setTimeout(() => {
      const selectedCat = CATEGORIES.find((c) => c.id === category)?.label || 'استفسار عام';
      const randomTicketId = `ASU-${category.toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;

      setSubmittedTicket({
        referenceId: randomTicketId,
        categoryLabel: selectedCat,
        name: fullName,
      });

      setIsSubmitting(false);
      // إعادة ضبط الحقول
      setFullName('');
      setStudentCode('');
      setContactInfo('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setErrorMessage('');
  };

  return (
    <Card className="border border-asu-gold/30 bg-white/95 shadow-xl shadow-asu-navy/5 overflow-hidden backdrop-blur-xs">
      <div className="h-1.5 w-full bg-gradient-to-r from-asu-navy via-asu-gold to-asu-green" />
      
      <CardHeader className="border-b border-slate-100 pb-5 px-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-asu-navy text-asu-gold flex items-center justify-center shadow-md shadow-asu-navy/20">
            <MessageSquare className="w-5 h-5 text-asu-gold" />
          </div>
          <div className="text-left">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-asu-gold-50 text-asu-gold-dark border border-asu-gold/30">
              <Sparkles className="w-3 h-3 text-asu-gold-dark" />
              قناة المراسلة المعتمدة
            </span>
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-black text-asu-navy mt-3 text-right">
          إرسال استفسار أو مراسلة رسمية
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-500 text-right leading-relaxed mt-1">
          يتم تحويل رسالتكم مباشرة للجنة الأكاديمية والتقنية المشرفة بكلية التربية - جامعة عين شمس، مع إشعار بالرد.
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {submittedTicket ? (
          /* شاشة تأكيد الإرسال الملكية */
          <div className="py-8 px-4 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-asu-gold text-slate-950 flex items-center justify-center border-2 border-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                تم استلام طلبك بنجاح
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                شكراً لك يا {submittedTicket.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                تم تسجيل استفسارك الخاص بـ ({submittedTicket.categoryLabel}) وإرساله مباشرة إلى فريق الإشراف الأكاديمي والدعم الفني للمنصة.
              </p>
            </div>

            {/* بطاقة الرقم المرجعي للتذكرة */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                الرقم المرجعي للاستفسار (Reference ID)
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-asu-navy tracking-wider block">
                {submittedTicket.referenceId}
              </span>
              <span className="text-[10px] text-slate-400 block">
                يرجى الاحتفاظ بهذا الرقم لمتابعة استفسارك مع المشرف الأكاديمي
              </span>
            </div>

            <div className="pt-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2 border-asu-navy/20 text-asu-navy hover:bg-asu-navy-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إرسال استفسار أو مقترح آخر</span>
              </Button>
            </div>
          </div>
        ) : (
          /* النموذج التفاعلي */
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* اختيار تصنيف الاستفسار */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 tracking-wide">
                1. تصنيف ونوع المراسلة:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-asu-navy text-white border-asu-gold shadow-md shadow-asu-navy/25 scale-[1.02]'
                          : 'bg-slate-50/70 hover:bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? 'text-asu-gold-light' : 'text-slate-400'
                          }`}
                        />
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-asu-gold animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs font-black leading-tight block">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* الحقول الأساسية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* الاسم الكامل */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  الاسم الكامل للطالب / الباحث <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمود علي"
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* كود الطالب الأكاديمي */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  كود الطالب / الرقم الجامعي (إن وجد)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="مثال: 2026101"
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs font-mono"
                  />
                </div>
              </div>

              {/* البريد الإلكتروني أو الهاتف */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  البريد الإلكتروني أو رقم الهاتف للرد
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="example@asu.edu.eg أو رقم الهاتف"
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* موضوع الاستفسار */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  عنوان الموضوع / ملخص الاستفسار
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: استفسار حول تسليم نشاط الوحدة الثانية"
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* تفاصيل الرسالة */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                نص الرسالة والاستفسار بالتفصيل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب استفسارك أو ملاحظتك بدقة هنا ليتمكن المشرف الأكاديمي أو الدعم الفني من الرد عليك بشكل وافٍ..."
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs leading-relaxed"
                />
              </div>
            </div>

            {/* زر الإرسال الملوكي */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>بياناتكم محمية وتُعامل بخصوصية أكاديمية تامة</span>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-asu-navy to-asu-navy-light text-white hover:from-asu-navy-dark hover:to-asu-navy shadow-lg shadow-asu-navy/20 gap-2 font-black px-8 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري تسجيل وإرسال الاستفسار...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-1 text-asu-gold-light" />
                    <span>إرسال الاستفسار للجنة الأكاديمية</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
