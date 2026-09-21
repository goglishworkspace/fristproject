'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitExamAction } from '@/lib/actions/exam.actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
} from 'lucide-react';
import type { Question, ExamType } from '@/lib/types/database';

interface ExamRunnerProps {
  examType: ExamType;
  examTitle: string;
  questions: Question[];
}

export function ExamRunner({ examType, examTitle, questions }: ExamRunnerProps) {
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

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
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
    const isPassing = (result.score / result.total) >= 0.5;
    return (
      <Card className="max-w-xl mx-auto text-center p-8 shadow-xl border-emerald-100 bg-white">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <Badge variant={isPassing ? 'success' : 'warning'} className="mb-2">
          {isPassing ? 'تم اجتياز الاختبار بنجاح' : 'تم تسليم الاختبار'}
        </Badge>
        <CardTitle className="text-2xl font-bold text-slate-800">
          شكراً لك، تم رصد نتيجتك!
        </CardTitle>
        <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-sm text-slate-500 block mb-1">الدرجة المحصلة</span>
          <span className="text-4xl font-extrabold text-emerald-600">
            {result.score} <span className="text-xl text-slate-400 font-normal">/ {result.total}</span>
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {examType === 'pre_test'
            ? 'تم فتح الوحدات والموديولات التعليمية الآن، يمكنك البدء في دراسة المحتوى.'
            : 'لقد أتممت متطلبات المنصة بالكامل، يمكنك العودة للصفحة الرئيسية ومراجعة مسارك.'}
        </p>
        <Button
          onClick={() => {
            router.push(examType === 'pre_test' ? '/modules' : '/');
            router.refresh();
          }}
          className="w-full"
          size="lg"
        >
          {examType === 'pre_test' ? 'الانتقال للموديولات الدراسية' : 'العودة للرئيسية'}
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* هيدر الاختبار والتقدم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{examTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            السؤال {currentIndex + 1} من أصل {totalQ}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600 min-w-[3rem] text-left">
            {progressPercent}%
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* بطاقة السؤال الحالي */}
      <Card className="shadow-md border-slate-200/80 bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>السؤال رقم {currentIndex + 1}</span>
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.question_text}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-right p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <span>{option}</span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mr-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && '✓'}
                </span>
              </button>
            );
          })}
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0 || isSubmitting}
            className="gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </Button>

          {currentIndex < totalQ - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
              disabled={isSubmitting}
              className="gap-1"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <span>جاري التسليم...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تسليم الاختبار النهائي</span>
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
