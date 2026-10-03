'use client';

import React, { useState } from 'react';
import { ASU_LOGO_URL } from '@/lib/constants/branding';
import { completeStudentProfileAction } from '@/lib/actions/student.actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Phone,
  Lock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export default function CompleteProfilePage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('يرجى كتابة الاسم الكامل للطالب للتسجيل الأكاديمي الرسمي.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 6) {
      setErrorMessage('يرجى إدخال رقم هاتف محمول / واتساب صالح للتواصل.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setErrorMessage('كلمة المرور الجديدة يجب أن تتكون من 4 خانات على الأقل.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين، يرجى إعادة التأكد.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await completeStudentProfileAction({
        fullName: cleanName,
        phone: cleanPhone,
        newPassword,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'حدث خطأ أثناء حفظ البيانات');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      // توجيه فوري للمنصة باستخدام window.location لتخطي كاش Next.js نهائياً
      setTimeout(() => {
        window.location.href = res.redirectTo || '/';
      }, 700);
    } catch {
      setErrorMessage('حدث خطأ غير متوقع، يرجى المحاولة ثانية');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-100 via-asu-navy-50/25 to-slate-200 text-right">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border border-asu-gold/40 bg-white/95 backdrop-blur-xs overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-asu-navy via-asu-gold to-asu-green" />

          <CardHeader className="text-center space-y-3 pb-4 pt-6">
            {/* لوجو الجامعة والدرع الملكي */}
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-asu-gold/40 p-2 flex items-center justify-center shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASU_LOGO_URL}
                alt="جامعة عين شمس"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-asu-gold-50 text-asu-gold-dark border border-asu-gold/30">
                <Sparkles className="w-3.5 h-3.5 text-asu-gold-dark" />
                تسجيل الدخول للمرة الأولى
              </span>
              <CardTitle className="text-xl sm:text-2xl font-black text-asu-navy">
                استكمال بيانات الطالب الأكاديمية
              </CardTitle>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                مرحباً بك في منصة الوعي بقضايا البيئة للمرحلة الثانوية! لتوثيق مشاركتك ورصد نتائجك بدقة،
                يُرجى إكمال بياناتك الرسمية وتعيين كلمة مرور خاصة بك.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {isSuccess ? (
              <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-300 mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">تم حفظ بياناتك بنجاح!</h3>
                  <p className="text-xs text-slate-500">جاري توجيهك الآن إلى المنصة التعليمية لبدء التقييم القبلي...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* الاسم الكامل */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    الاسم الكامل للطالب (كما في الكشف الجامعي) <span className="text-rose-500">*</span>
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
                      placeholder="مثال: أحمد محمود علي إبراهيم"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* رقم الهاتف / الواتساب */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    رقم الهاتف المحمول / الواتساب <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 01012345678"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs font-mono"
                    />
                  </div>
                </div>

                {/* كلمة المرور الجديدة */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    كلمة المرور الجديدة الخاصة بك <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={4}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="4 خانات على الأقل"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs font-mono"
                    />
                  </div>
                </div>

                {/* تأكيد كلمة المرور */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    تأكيد كلمة المرور الجديدة <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={4}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد كتابة نفس كلمة المرور"
                      className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:border-transparent transition-all shadow-2xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-asu-navy to-asu-navy-light hover:from-asu-navy-dark hover:to-asu-navy text-white shadow-lg shadow-asu-navy/20 gap-2 font-black cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ml-1" />
                        <span>جاري حفظ وتفعيل الحساب...</span>
                      </>
                    ) : (
                      <>
                        <span>حفظ البيانات وتفعيل الحساب</span>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="pt-2 text-center">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>بياناتكم مسجلة برعاية وإشراف كلية التربية - جامعة عين شمس</span>
                  </span>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
