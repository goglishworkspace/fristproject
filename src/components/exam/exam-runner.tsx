'use client';

import { useState, useRef, useEffect } from 'react';
import { submitExamAction } from '@/lib/actions/exam.actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  ToggleLeft,
  BookOpen,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import type { Question, ExamType } from '@/lib/types/database';

export interface ExamInstructionsData {
  title?: string;
  salutation?: string;
  intro?: string;
  purpose?: string;
  rules?: string[];
  note?: string;
  sections?: {
    id: string;
    title: string;
    description?: string;
    count?: number;
  }[];
}

export const DEFAULT_PRE_TEST_INSTRUCTIONS: ExamInstructionsData = {
  title: 'تعليمات الاختبار',
  salutation: 'عزيزي الطالب / الطالبة',
  intro: 'اقرأ التعليمات التالية بعناية قبل أن تبدأ في الإجابة عن الاختبار.',
  purpose: 'وُضع هذا الاختبار لقياس مستوى الوعي بقضايا البيئة لديك، ومدى فهمك للمفاهيم والقضايا والمشكلات البيئية وطرق التعامل معها.',
  rules: [
    'يتكون الاختبار من (60) سؤالًا من نوع الاختيار من متعدد، ويتبع كل سؤال أربعة بدائل محتملة، أحدها فقط صحيح، ومشار إليها بالأحرف (أ، ب، ج، د) اقرأ السؤال جيدًا، ثم اختر إجابة واحدة فقط من بين البدائل المتاحة.',
    'كما يتضمن الاختبار (40) عبارة من نوع الصواب والخطأ. اقرأ كل عبارة بعناية، ثم حدد ما إذا كانت صوابًا أم خطأ.',
  ],
  note: 'أجب عن جميع الأسئلة، ولا تترك أي سؤال دون إجابة.',
  sections: [
    {
      id: 'mc',
      title: 'أولًا: أسئلة الاختيار من متعدد',
      description: 'يتكون من (60) سؤالًا، لكل سؤال 4 بدائل محتملة يمثل أحدها الإجابة الصحيحة.',
      count: 60,
    },
    {
      id: 'tf',
      title: 'ثانيًا: حدد الصواب والخطأ للأسئلة التالية',
      description: 'يتضمن (40) عبارة لتحديد ما إذا كانت العبارة صوابًا أم خطأ.',
      count: 40,
    },
  ],
};

export const DEFAULT_POST_TEST_INSTRUCTIONS: ExamInstructionsData = {
  title: 'تعليمات الاختبار البعدي',
  salutation: 'عزيزي الطالب / الطالبة',
  intro: 'اقرأ التعليمات التالية بعناية قبل أن تبدأ في الإجابة عن الاختبار البعدي النهائي.',
  purpose: 'وُضع هذا الاختبار لقياس مدى نمو الوعي بقضايا البيئة والتفكير المكاني لديك بعد دراسة الموديولات التعليمية المقررة.',
  rules: [
    'يتكون الاختبار من (60) سؤالًا من نوع الاختيار من متعدد، ويتبع كل سؤال أربعة بدائل محتملة، أحدها فقط صحيح، ومشار إليها بالأحرف (أ، ب، ج، د) اقرأ السؤال جيدًا، ثم اختر إجابة واحدة فقط من بين البدائل المتاحة.',
    'كما يتضمن الاختبار (40) عبارة من نوع الصواب والخطأ. اقرأ كل عبارة بعناية، ثم حدد ما إذا كانت صوابًا أم خطأ.',
  ],
  note: 'أجب عن جميع الأسئلة، ولا تترك أي سؤال دون إجابة.',
  sections: [
    {
      id: 'mc',
      title: 'أولًا: أسئلة الاختيار من متعدد',
      description: 'يتكون من (60) سؤالًا، لكل سؤال 4 بدائل محتملة يمثل أحدها الإجابة الصحيحة.',
      count: 60,
    },
    {
      id: 'tf',
      title: 'ثانيًا: حدد الصواب والخطأ للأسئلة التالية',
      description: 'يتضمن (40) عبارة لتحديد ما إذا كانت العبارة صوابًا أم خطأ.',
      count: 40,
    },
  ],
};

interface ExamRunnerProps {
  examType: ExamType;
  examTitle: string;
  questions: Question[];
  onCompleteRedirectUrl?: string;
  passingScorePercent?: number;
  instructions?: ExamInstructionsData | boolean;
  questionsPerPage?: number;
}

const OPTION_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

export function ExamRunner({
  examType,
  examTitle,
  questions,
  onCompleteRedirectUrl,
  passingScorePercent = 50,
  instructions,
  questionsPerPage = 10,
}: ExamRunnerProps) {
  // التحقق من تفعيل شاشة التعليمات (تلقائياً للاختبار القبلي والبعدي أو عند تمرير instructions)
  const activeInstructions: ExamInstructionsData | null =
    instructions === false
      ? null
      : typeof instructions === 'object'
      ? instructions
      : examType === 'pre_test'
      ? DEFAULT_PRE_TEST_INSTRUCTIONS
      : examType === 'post_test'
      ? DEFAULT_POST_TEST_INSTRUCTIONS
      : null;

  const [hasStarted, setHasStarted] = useState<boolean>(!activeInstructions);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const pageSize = questionsPerPage || 10;
  const totalQ = questions?.length || 0;
  const totalPages = Math.ceil(totalQ / pageSize) || 1;
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalQ);
  const pageQuestions = questions?.slice(startIndex, endIndex) || [];

  // مرجع للتمرير التلقائي لرقم الصفحة النشطة في شريط التابات العلوي
  const activePageBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activePageBtnRef.current) {
      activePageBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [pageIndex]);

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

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQ) * 100);

  // اختيار خيار السؤال
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setErrorMessage(null);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // دالة القفز التلقائي إلى أول سؤال لم تتم الإجابة عليه في الاختبار
  const jumpToFirstUnanswered = () => {
    const unansweredIndex = questions.findIndex((q) => answers[q.id] === undefined);
    if (unansweredIndex !== -1) {
      const targetPage = Math.floor(unansweredIndex / pageSize);
      const qNumber = unansweredIndex + 1;
      setPageIndex(targetPage);
      setErrorMessage(
        `تم نقلك إلى أول سؤال غير مُجاب (السؤال رقم ${qNumber} في الصفحة ${targetPage + 1})، يرجى اختياره للمتابعة.`
      );
      setTimeout(() => {
        const el = document.getElementById(`question-${qNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 150);
    }
  };

  // الانتقال للصفحة التالية مع شرط تربوي صارم بعدم ترك أي سؤال بالصفحة الحالية
  const handleNextPage = () => {
    const unansweredOnPage = pageQuestions.filter((q) => answers[q.id] === undefined);
    if (unansweredOnPage.length > 0) {
      const firstMissing = unansweredOnPage[0];
      const qNumber = questions.findIndex((q) => q.id === firstMissing.id) + 1;
      setErrorMessage(
        `يرجى الإجابة عن جميع أسئلة هذه الصفحة أولاً قبل الانتقال للصفحة التالية (السؤال رقم ${qNumber} لم تتم الإجابة عليه بعد).`
      );
      setTimeout(() => {
        const el = document.getElementById(`question-${qNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setErrorMessage(null);
    if (pageIndex < totalPages - 1) {
      setPageIndex((prev) => prev + 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // الانتقال للصفحة السابقة
  const handlePrevPage = () => {
    setErrorMessage(null);
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // تسليم الاختبار مع تحقق صارم من إجابة كافة الأسئلة الـ 100
  const handleSubmit = async () => {
    const unansweredIndex = questions.findIndex((q) => answers[q.id] === undefined);
    if (unansweredIndex !== -1) {
      const targetPage = Math.floor(unansweredIndex / pageSize);
      const qNumber = unansweredIndex + 1;
      setPageIndex(targetPage);
      setErrorMessage(
        `تنبيه هام: لا يمكنك تسليم الاختبار حتى تجيب على جميع الأسئلة! متبقي ${totalQ - answeredCount} أسئلة غير مُجابة. تم نقلك تلقائياً إلى السؤال رقم (${qNumber}) في الصفحة (${targetPage + 1}) الذي لم تتم الإجابة عليه بعد.`
      );
      setTimeout(() => {
        const el = document.getElementById(`question-${qNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 150);
      return;
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
    const isPreTest = examType === 'pre_test';
    const isPassing = (result.score / (result.total || 1)) >= (passingScorePercent / 100);
    const isModuleExam = examType.startsWith('module_');

    const defaultNextUrl = onCompleteRedirectUrl || (isPreTest ? '/modules' : '/');

    return (
      <Card className="max-w-xl mx-auto text-center p-6 sm:p-8 shadow-2xl border border-asu-gold/40 bg-white">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner ${
          isPreTest || isPassing ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'
        }`}>
          {isPreTest || isPassing ? (
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          ) : (
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12" />
          )}
        </div>
        <Badge variant={isPreTest || isPassing ? 'success' : 'warning'} className="mb-2 text-xs px-3 py-1">
          {isPreTest ? 'تم تسليم الاختبار القبلي بنجاح' : isPassing ? 'تم اجتياز الاختبار بنجاح' : 'تم تسليم الاختبار'}
        </Badge>
        <CardTitle className="text-xl sm:text-2xl font-black text-asu-navy">
          {isPreTest
            ? 'شكراً لك، تم تسجيل إجاباتك بنجاح!'
            : isPassing
            ? 'شكراً لك، تم رصد نتيجتك بنجاح!'
            : 'تم رصد درجتك في سجل الاختبارات'}
        </CardTitle>

        {/* لا تظهر نتيجة الدرجة إطلاقاً في الاختبار القبلي */}
        {!isPreTest && (
          <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
            <span className="text-xs sm:text-sm text-slate-500 block mb-1 font-bold">الدرجة المحصلة</span>
            <span className={`text-4xl sm:text-5xl font-black font-mono ${isPassing ? 'text-emerald-600' : 'text-amber-600'}`}>
              {result.score} <span className="text-xl sm:text-2xl text-slate-400 font-normal">/ {result.total}</span>
            </span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-600 my-6 leading-relaxed">
          {isPreTest
            ? 'تم حفظ إجاباتك في سجلك بنجاح، وفُتحت لك الموديولات التعليمية للبدء في دراستها الآن.'
            : isModuleExam
            ? 'تم حفظ نتيجة اختبار الوحدة في سجلك الأكاديمي، يمكنك الآن المتابعة والانتقال للمرحلة التالية.'
            : 'لقد أتممت متطلبات البرنامج التدريبي بالكامل، ويمكنك الآن مراجعة مسارك ونتيجتك النهائية.'}
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
              : isPreTest
              ? 'الانتقال للموديولات الدراسية'
              : 'العودة للرئيسية'}
          </span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
      </Card>
    );
  }

  // 1. شاشة تعليمات الاختبار التمهيدية الإلزامية قبل بدء الإجابة
  if (!hasStarted && activeInstructions) {
    return (
      <div className="max-w-3xl mx-auto py-2 sm:py-6 text-right space-y-6">
        <Card className="border-asu-gold/40 shadow-2xl bg-white rounded-3xl overflow-hidden border">
          {/* هيدر التعليمات التراثي الملكي */}
          <div className="bg-gradient-to-br from-asu-navy-dark via-asu-navy to-[#18265b] p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 bg-asu-gold/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 bg-asu-navy-light/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-asu-gold/20 text-asu-gold-light border border-asu-gold/40 text-xs px-3 py-1 font-bold">
                  <Sparkles className="w-3.5 h-3.5 ml-1.5 inline text-asu-gold-light" />
                  جامعة عين شمس • كلية التربية
                </Badge>
                <Badge variant="outline" className="border-white/20 text-slate-200 text-xs px-2.5 py-0.5">
                  قسم المناهج وطرق التدريس
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {activeInstructions.title || 'تعليمات الاختبار'}
              </h1>

              <div className="pt-2 text-asu-gold-light font-black text-base sm:text-lg">
                {activeInstructions.salutation || 'عزيزي الطالب / الطالبة'}
              </div>

              <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                {activeInstructions.intro || 'اقرأ التعليمات التالية بعناية قبل أن تبدأ في الإجابة عن الاختبار.'}
              </p>
            </div>
          </div>

          <CardContent className="p-5 sm:p-8 space-y-6">
            {/* هدف الاختبار */}
            {activeInstructions.purpose && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center gap-2 text-asu-navy font-black text-sm sm:text-base">
                  <div className="w-8 h-8 rounded-xl bg-asu-navy/10 text-asu-navy flex items-center justify-center shrink-0">
                    <Target className="w-4.5 h-4.5 text-asu-gold-dark" />
                  </div>
                  <span>هدف الاختبار:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pr-10">
                  {activeInstructions.purpose}
                </p>
              </div>
            )}

            {/* بنود الاختبار وتفاصيل الأسئلة */}
            {activeInstructions.rules && activeInstructions.rules.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-asu-navy" />
                  <span>ضوابط وتعليمات الإجابة:</span>
                </h3>
                <div className="space-y-3">
                  {activeInstructions.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3 hover:border-asu-gold/40 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-xl bg-asu-navy text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* تفصيل الأقسام (أولاً وثانياً) */}
            {activeInstructions.sections && activeInstructions.sections.length > 0 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  أقسام ومكونات الاختبار:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {activeInstructions.sections.map((sec, sIdx) => (
                    <div
                      key={sec.id || sIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm sm:text-base text-asu-navy">{sec.title}</span>
                        {sec.count && (
                          <Badge variant="outline" className="text-xs bg-white text-slate-800 font-bold border-slate-300">
                            ({sec.count}) سؤال
                          </Badge>
                        )}
                      </div>
                      {sec.description && (
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {sec.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* تنبيه بعدم ترك أي سؤال دون إجابة */}
            {activeInstructions.note && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-800" />
                </div>
                <div className="text-right">
                  <span className="block font-black text-xs sm:text-sm text-amber-950">
                    من فضلك:
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-amber-900">
                    {activeInstructions.note}
                  </span>
                </div>
              </div>
            )}

            {/* زر البدء في الاختبار */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={() => {
                  setHasStarted(true);
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full h-13 sm:h-14 text-sm sm:text-base font-black bg-gradient-to-r from-asu-navy via-[#1e2f75] to-asu-navy-light text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer rounded-2xl gap-2 border border-asu-gold/40"
              >
                <span>ابدأ الإجابة عن الاختبار الآن</span>
                <ArrowLeft className="w-5 h-5 mr-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 relative z-10 pointer-events-auto">
      {/* هيدر الاختبار والتقدم ورقم الصفحة */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-asu-navy">{examTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              الصفحة <span className="font-bold text-slate-700">{pageIndex + 1}</span> من أصل <span className="font-bold text-slate-700">{totalPages}</span>
              {' • '}
              الأسئلة من <span className="font-bold text-slate-700">{startIndex + 1}</span> إلى <span className="font-bold text-slate-700">{endIndex}</span>
              {' '}(إجمالي {totalQ} سؤالاً)
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {activeInstructions && (
              <button
                type="button"
                onClick={() => setShowInstructionsModal(true)}
                className="inline-flex items-center gap-1.5 text-xs text-asu-navy bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title="عرض تعليمات الاختبار"
              >
                <BookOpen className="w-3.5 h-3.5 text-asu-navy" />
                <span>تعليمات الاختبار</span>
              </button>
            )}
            {answeredCount < totalQ && (
              <button
                type="button"
                onClick={jumpToFirstUnanswered}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                title="اضغط للانتقال التلقائي لأول سؤال غير مُجاب"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>متبقي {totalQ - answeredCount} أسئلة (انتقل للناقص)</span>
              </button>
            )}
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

        {answeredCount < totalQ && (
          <div className="sm:hidden flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-[11px] text-amber-800 font-bold">
              متبقي {totalQ - answeredCount} أسئلة غير مُجابة
            </span>
            <button
              type="button"
              onClick={jumpToFirstUnanswered}
              className="text-[11px] text-amber-800 bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 font-bold cursor-pointer"
            >
              الانتقال للسؤال الناقص ←
            </button>
          </div>
        )}

        {/* شريط تابات الصفحات والتنقل السريع (10 أسئلة في كل صفحة) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scroll-smooth no-scrollbar">
          {Array.from({ length: totalPages }).map((_, pIdx) => {
            const pageStart = pIdx * pageSize;
            const pageEnd = Math.min(pageStart + pageSize, totalQ);
            const pQuestions = questions.slice(pageStart, pageEnd);
            const pAnswered = pQuestions.filter((q) => answers[q.id] !== undefined).length;
            const isPageComplete = pAnswered === pQuestions.length;
            const isCurrentPage = pIdx === pageIndex;

            return (
              <button
                key={pIdx}
                ref={isCurrentPage ? activePageBtnRef : null}
                type="button"
                onClick={() => {
                  setPageIndex(pIdx);
                  setErrorMessage(null);
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer touch-manipulation transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  isCurrentPage
                    ? 'bg-asu-navy text-white shadow-md ring-2 ring-asu-gold'
                    : isPageComplete
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                title={`الصفحة ${pIdx + 1}: الأسئلة (${pageStart + 1} - ${pageEnd})`}
              >
                <span>الصفحة {pIdx + 1}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isCurrentPage
                      ? 'bg-white/20 text-white'
                      : isPageComplete
                      ? 'bg-emerald-200 text-emerald-900 font-bold'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {pAnswered}/{pQuestions.length}
                </span>
                {isPageComplete && !isCurrentPage && (
                  <span className="text-emerald-600 text-xs font-black">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-md sticky top-20 z-30">
          <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-700" />
          </div>
          <span className="leading-relaxed flex-1">{errorMessage}</span>
        </div>
      )}

      {/* قائمة الـ 10 أسئلة الخاصة بالصفحة الحالية */}
      <div className="space-y-6">
        {pageQuestions.map((q, qLocalIdx) => {
          const globalIdx = startIndex + qLocalIdx;
          const qNumber = globalIdx + 1;
          const isSelected = answers[q.id] !== undefined;
          const isTrueFalseQuestion =
            q.question_type === 'true_false' ||
            (q.options.length === 2 && (q.options[0] === 'صح' || q.options[0] === 'صواب'));

          return (
            <Card
              key={q.id}
              id={`question-${qNumber}`}
              className={`scroll-mt-24 shadow-md bg-white rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-amber-200/80 bg-amber-50/15'
              }`}
            >
              <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/40">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-asu-navy text-xs font-bold">
                    <HelpCircle className="w-4 h-4 text-asu-gold-dark" />
                    <span>السؤال رقم {qNumber} من {totalQ}</span>
                    <span className="text-slate-400 font-normal">
                      (صفحة {pageIndex + 1})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* شارة حالة الإجابة */}
                    {isSelected ? (
                      <Badge variant="success" className="text-[10px] sm:text-xs gap-1 px-2.5 py-0.5 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>تمت الإجابة</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] sm:text-xs px-2.5 py-0.5 border-amber-300 text-amber-800 bg-amber-50 font-bold">
                        <span>مطلوب إجابته</span>
                      </Badge>
                    )}

                    {/* تصنيف القسم الخاص بالسؤال بالصيغة المطلوبة تماماً */}
                    {isTrueFalseQuestion ? (
                      <Badge variant="gold" className="text-[10px] sm:text-xs gap-1.5 px-3 py-1 font-black bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
                        <ToggleLeft className="w-3.5 h-3.5 text-amber-700" />
                        <span>ثانيًا: حدد الصواب والخطأ للأسئلة التالية</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] sm:text-xs gap-1.5 px-3 py-1 font-black bg-asu-navy/10 text-asu-navy border border-asu-navy/25 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-asu-navy inline-block" />
                        <span>أولًا: أسئلة الاختيار من متعدد</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <CardTitle className="text-base sm:text-lg font-black text-slate-900 leading-relaxed pt-1 text-right">
                  {q.question_text}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 pb-6">
                {isTrueFalseQuestion ? (
                  /* أزرار صح وخطأ - أزرار تفاعلية نقية ومريحة على الموبايل */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* خيار صح */}
                    <button
                      type="button"
                      onClick={() => handleSelectOption(q.id, 0)}
                      className={`w-full min-h-[90px] p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer touch-manipulation text-center transition-all active:scale-[0.98] ${
                        answers[q.id] === 0
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-md ring-2 ring-emerald-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-xs pointer-events-none ${
                          answers[q.id] === 0 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5 pointer-events-none">
                        <span className="text-base sm:text-lg font-black block">صح (صواب)</span>
                        {answers[q.id] === 0 ? (
                          <span className="text-[11px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 shadow-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>✓ إجابتك المختارة</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">اضغط لتحديد الإجابة</span>
                        )}
                      </div>
                    </button>

                    {/* خيار خطأ */}
                    <button
                      type="button"
                      onClick={() => handleSelectOption(q.id, 1)}
                      className={`w-full min-h-[90px] p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer touch-manipulation text-center transition-all active:scale-[0.98] ${
                        answers[q.id] === 1
                          ? 'border-rose-600 bg-rose-50 text-rose-950 font-black shadow-md ring-2 ring-rose-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-xs pointer-events-none ${
                          answers[q.id] === 1 ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5 pointer-events-none">
                        <span className="text-base sm:text-lg font-black block">خطأ</span>
                        {answers[q.id] === 1 ? (
                          <span className="text-[11px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 shadow-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>✓ إجابتك المختارة</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">اضغط لتحديد الإجابة</span>
                        )}
                      </div>
                    </button>
                  </div>
                ) : (
                  /* أزرار الاختيار من متعدد - أزرار تفاعلية نقية تستجيب فوراً للمس على الموبايل */
                  <div className="space-y-2.5">
                    {q.options.map((option, optIdx) => {
                      const isOptSelected = answers[q.id] === optIdx;
                      const letter = OPTION_LETTERS[optIdx] || `${optIdx + 1}`;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-right min-h-[50px] p-3 sm:p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer touch-manipulation transition-all active:scale-[0.99] ${
                            isOptSelected
                              ? 'border-asu-navy bg-asu-navy-50/90 text-asu-navy font-black ring-2 ring-asu-navy/20 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1 pointer-events-none">
                            <span
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 ${
                                isOptSelected
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
                            {isOptSelected ? (
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
            </Card>
          );
        })}
      </div>

      {/* شريط التحكم السفلي بالصفحة والتنقل والتسليم (Fixed / Sticky Footer) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-3 sticky bottom-4 z-20 backdrop-blur-md bg-white/95">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={pageIndex === 0 || isSubmitting}
          className="h-12 px-5 sm:px-6 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 flex items-center justify-center gap-1.5 font-bold text-sm sm:text-base cursor-pointer touch-manipulation shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-4 h-4 ml-1 pointer-events-none" />
          <span className="pointer-events-none">الصفحة السابقة</span>
        </button>

        <div className="text-center font-bold text-xs sm:text-sm text-slate-700">
          <span>الصفحة {pageIndex + 1} من {totalPages}</span>
          <span className="block text-[11px] text-slate-400 font-normal">
            الأسئلة من {startIndex + 1} إلى {endIndex}
          </span>
        </div>

        {pageIndex < totalPages - 1 ? (
          <button
            type="button"
            onClick={handleNextPage}
            disabled={isSubmitting}
            className="h-12 px-6 sm:px-8 rounded-2xl bg-asu-navy hover:bg-asu-navy-dark active:bg-asu-navy-dark text-white flex items-center justify-center gap-2 font-black text-sm sm:text-base cursor-pointer touch-manipulation shadow-lg shadow-asu-navy/25"
          >
            <span className="pointer-events-none">الانتقال للصفحة التالية</span>
            <ArrowLeft className="w-4 h-4 mr-1 pointer-events-none" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`h-12 px-6 sm:px-8 rounded-2xl text-white flex items-center justify-center gap-2 font-black text-sm sm:text-base cursor-pointer touch-manipulation shadow-lg transition-all ${
              answeredCount < totalQ
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <span className="pointer-events-none">جاري التسليم...</span>
            ) : (
              <div className="flex items-center gap-2 pointer-events-none">
                <Send className="w-4 h-4 ml-1" />
                <span>
                  {answeredCount < totalQ
                    ? `تسليم الاختبار (متبقي ${totalQ - answeredCount} أسئلة)`
                    : 'تسليم الاختبار النهائي'}
                </span>
              </div>
            )}
          </button>
        )}
      </div>

      {/* نافذة عرض التعليمات المنبثقة أثناء سير الاختبار */}
      {showInstructionsModal && activeInstructions && (
        <div
          onClick={() => setShowInstructionsModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-asu-gold/40 cursor-default max-h-[90vh] flex flex-col text-right"
          >
            <div className="p-4 sm:p-5 bg-gradient-to-r from-asu-navy-dark to-asu-navy text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-asu-gold-light" />
                <h3 className="font-black text-sm sm:text-base text-white">
                  {activeInstructions.title || 'تعليمات الاختبار'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="font-extrabold text-asu-navy text-sm sm:text-base">
                {activeInstructions.salutation}
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                {activeInstructions.intro}
              </p>

              {activeInstructions.purpose && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                  <span className="font-black text-asu-navy block">هدف الاختبار:</span>
                  <p className="text-slate-700 leading-relaxed font-normal">{activeInstructions.purpose}</p>
                </div>
              )}

              {activeInstructions.rules && (
                <div className="space-y-2">
                  <span className="font-black text-slate-700 block">ضوابط الإجابة:</span>
                  <div className="space-y-2">
                    {activeInstructions.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800">
                        <span className="w-5 h-5 rounded-lg bg-asu-navy text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed font-medium">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInstructions.sections && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {activeInstructions.sections.map((sec, sIdx) => (
                    <div key={sec.id || sIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-xs text-asu-navy block mb-0.5">{sec.title}</span>
                      <span className="text-[11px] text-slate-500">{sec.description}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeInstructions.note && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>من فضلك: {activeInstructions.note}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <Button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                size="sm"
                className="font-bold bg-asu-navy hover:bg-asu-navy-light text-white px-6"
              >
                متابعة الاختبار
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
