'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitExamAction } from '@/lib/actions/exam.actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  ToggleLeft,
} from 'lucide-react';
import type { Question, ExamType } from '@/lib/types/database';

interface ExamRunnerProps {
  examType: ExamType;
  examTitle: string;
  questions: Question[];
  onCompleteRedirectUrl?: string;
  passingScorePercent?: number;
}

const OPTION_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

export function ExamRunner({
  examType,
  examTitle,
  questions,
  onCompleteRedirectUrl,
  passingScorePercent = 50,
}: ExamRunnerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto text-center p-8">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <CardTitle className="text-xl">لا توجد أسئلة متاحة حالياً</CardTitle>
        <p className="text-sm text-slate-500 mt-2">
          يرجى التواصل مع مسؤول المنصة لإضافة بنك الأسئلة لهذا الاختبار.
        </p>
      </Card>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQ) * 100);

  // اختيار خيار السؤال - نقي ومباشر ومضبوط للمس في شاشات الموبايل
  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex((prev) => prev + 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSubmit = async () => {
    if (answeredCount < totalQ) {
      const confirmSubmit = window.confirm(
        `لقد قمت بالإجابة على ${answeredCount} من أصل ${totalQ} أسئلة. هل أنت متأكد من تسليم الاختبار الآن؟`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitExamAction(examType, answers);
      if (res.success && res.score !== undefined && res.total !== undefined) {
        setResult({ score: res.score, total: res.total });
      } else {
        setErrorMessage(res.error || 'فشل تسليم الاختبار، يرجى المحاولة ثانية');
      }
    } catch {
      setErrorMessage('حدث خطأ غير متوقع أثناء إرسال الإجابات');
    } finally {
      setIsSubmitting(false);
    }
  };

  // شاشة ظهور النتيجة بعد التسليم
  if (result) {
    const isPassing = (result.score / (result.total || 1)) >= (passingScorePercent / 100);
    const isModuleExam = examType.startsWith('module_');

    const defaultNextUrl = onCompleteRedirectUrl || (examType === 'pre_test' ? '/modules' : '/');

    return (
      <Card className="max-w-xl mx-auto text-center p-6 sm:p-8 shadow-2xl border border-asu-gold/40 bg-white">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner ${
          isPassing ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'
        }`}>
          {isPassing ? (
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          ) : (
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12" />
          )}
        </div>
        <Badge variant={isPassing ? 'success' : 'warning'} className="mb-2 text-xs px-3 py-1">
          {isPassing ? 'تم اجتياز الاختبار بنجاح' : 'تم تسليم الاختبار'}
        </Badge>
        <CardTitle className="text-xl sm:text-2xl font-black text-asu-navy">
          {isPassing ? 'شكراً لك، تم رصد نتيجتك بنجاح!' : 'تم رصد درجتك في سجل الاختبارات'}
        </CardTitle>
        <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
          <span className="text-xs sm:text-sm text-slate-500 block mb-1 font-bold">الدرجة المحصلة</span>
          <span className={`text-4xl sm:text-5xl font-black font-mono ${isPassing ? 'text-emerald-600' : 'text-amber-600'}`}>
            {result.score} <span className="text-xl sm:text-2xl text-slate-400 font-normal">/ {result.total}</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {isModuleExam
            ? 'تم حفظ نتيجة اختبار الوحدة في سجلك الأكاديمي، يمكنك الآن المتابعة والانتقال للمرحلة التالية.'
            : examType === 'pre_test'
            ? 'تم فتح الوحدات والموديولات التعليمية الآن، يمكنك البدء في دراسة المحتوى والأنشطة.'
            : 'لقد أتممت متطلبات البرنامج التدريبي بالكامل، يمكنك العودة للصفحة الرئيسية ومراجعة مسارك.'}
        </p>
        <Button
          onClick={() => {
            window.location.href = defaultNextUrl;
          }}
          className="w-full h-12 text-sm sm:text-base font-black bg-gradient-to-r from-asu-navy to-asu-navy-light gap-2 shadow-lg cursor-pointer"
          size="lg"
        >
          <span>
            {isModuleExam
              ? 'المتابعة والانتقال للخطوة التالية'
              : examType === 'pre_test'
              ? 'الانتقال للموديولات الدراسية'
              : 'العودة للرئيسية'}
          </span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
      </Card>
    );
  }

  const isTrueFalseQuestion =
    currentQ.question_type === 'true_false' ||
    (currentQ.options.length === 2 &&
      (currentQ.options[0] === 'صح' || currentQ.options[0] === 'صواب'));

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 relative z-10 pointer-events-auto">
      {/* هيدر الاختبار والتقدم */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-asu-navy">{examTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              السؤال <span className="font-bold text-slate-700">{currentIndex + 1}</span> من أصل <span className="font-bold text-slate-700">{totalQ}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-full sm:w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 min-w-[3rem] text-left font-mono">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* شريط أرقام الأسئلة والتنقل السريع للهواتف والكمبيوتر */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`min-w-9 h-9 sm:min-w-10 sm:h-10 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-0.5 cursor-pointer touch-manipulation transition-colors active:scale-95 ${
                  isCurrent
                    ? 'bg-asu-navy text-white shadow-md ring-2 ring-asu-gold'
                    : isAnswered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 active:bg-slate-200'
                }`}
                title={`الانتقال للسؤال رقم ${idx + 1}`}
              >
                <span className="pointer-events-none">{idx + 1}</span>
                {isAnswered && !isCurrent && (
                  <span className="text-[10px] text-emerald-600 font-bold pointer-events-none">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* بطاقة السؤال الحالي */}
      <Card className="shadow-lg border-slate-200/90 bg-white rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 text-asu-navy text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-asu-gold-dark" />
              <span>السؤال رقم {currentIndex + 1} من {totalQ}</span>
            </div>
            {isTrueFalseQuestion ? (
              <Badge variant="gold" className="text-[10px] sm:text-xs gap-1 px-2.5 py-0.5 font-bold">
                <ToggleLeft className="w-3.5 h-3.5" />
                <span>سؤال صواب أو خطأ</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] sm:text-xs px-2.5 py-0.5 border-slate-300 text-slate-600 font-bold">
                <span>اختيار من متعدد</span>
              </Badge>
            )}
          </div>
          <CardTitle className="text-base sm:text-lg font-black text-slate-900 leading-relaxed pt-1 text-right">
            {currentQ.question_text}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 pb-6">
          {isTrueFalseQuestion ? (
            /* أزرار صح وخطأ - أزرار تفاعلية نقية ومريحة على الموبايل */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* خيار صح */}
              <button
                type="button"
                onClick={() => handleSelectOption(0)}
                className={`w-full min-h-[100px] p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 cursor-pointer touch-manipulation text-center transition-all active:scale-[0.98] ${
                  answers[currentQ.id] === 0
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-lg ring-2 ring-emerald-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700'
                }`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xs pointer-events-none ${
                  answers[currentQ.id] === 0 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1 pointer-events-none">
                  <span className="text-base sm:text-lg font-black block">صح (صواب)</span>
                  {answers[currentQ.id] === 0 ? (
                    <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold inline-flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✓ إجابتك المختارة</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">اضغط لتحديد الإجابة</span>
                  )}
                </div>
              </button>

              {/* خيار خطأ */}
              <button
                type="button"
                onClick={() => handleSelectOption(1)}
                className={`w-full min-h-[100px] p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 cursor-pointer touch-manipulation text-center transition-all active:scale-[0.98] ${
                  answers[currentQ.id] === 1
                    ? 'border-rose-600 bg-rose-50 text-rose-950 font-black shadow-lg ring-2 ring-rose-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700'
                }`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xs pointer-events-none ${
                  answers[currentQ.id] === 1 ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'
                }`}>
                  <XCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1 pointer-events-none">
                  <span className="text-base sm:text-lg font-black block">خطأ</span>
                  {answers[currentQ.id] === 1 ? (
                    <span className="text-xs bg-rose-600 text-white px-3 py-1 rounded-full font-bold inline-flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✓ إجابتك المختارة</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">اضغط لتحديد الإجابة</span>
                  )}
                </div>
              </button>
            </div>
          ) : (
            /* أزرار الاختيار من متعدد - أزرار تفاعلية نقية تستجيب فوراً للمس على الموبايل */
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-right min-h-[52px] p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer touch-manipulation transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'border-asu-navy bg-asu-navy-50/90 text-asu-navy font-black ring-2 ring-asu-navy/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pointer-events-none">
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 ${
                          isSelected
                            ? 'bg-asu-navy text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm md:text-base leading-relaxed break-words text-right flex-1 font-medium">
                        {option}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 pointer-events-none">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-asu-navy text-white px-2.5 py-1 rounded-full font-bold shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">تم الاختيار</span>
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white block" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            className="h-12 px-5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 flex items-center justify-center gap-1.5 font-bold text-sm sm:text-base cursor-pointer touch-manipulation shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4 ml-1 pointer-events-none" />
            <span className="pointer-events-none">السابق</span>
          </button>

          {currentIndex < totalQ - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="h-12 px-6 sm:px-8 rounded-2xl bg-asu-navy hover:bg-asu-navy-dark active:bg-asu-navy-dark text-white flex items-center justify-center gap-2 font-black text-sm sm:text-base cursor-pointer touch-manipulation shadow-lg shadow-asu-navy/25 disabled:opacity-50"
            >
              <span className="pointer-events-none">التالي</span>
              <ArrowLeft className="w-4 h-4 mr-1 pointer-events-none" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 px-6 sm:px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 text-white flex items-center justify-center gap-2 font-black text-sm sm:text-base cursor-pointer touch-manipulation shadow-lg shadow-emerald-600/25 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="pointer-events-none">جاري التسليم...</span>
              ) : (
                <div className="flex items-center gap-2 pointer-events-none">
                  <Send className="w-4 h-4 ml-1" />
                  <span>تسليم الاختبار النهائي</span>
                </div>
              )}
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
