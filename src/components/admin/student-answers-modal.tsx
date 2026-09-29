'use client';

import React, { useState } from 'react';
import type { StudentAccount, QuestionWithAnswer, ModuleData } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  HelpCircle,
  Sparkles,
  TrendingUp,
  BookOpen,
  Filter,
  Award,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface StudentAnswersModalProps {
  student: StudentAccount | null;
  allQuestions: QuestionWithAnswer[];
  modules: ModuleData[];
  onClose: () => void;
}

type QuestionFilter = 'all' | 'correct' | 'wrong' | 'unanswered';

export function StudentAnswersModal({
  student,
  allQuestions,
  modules,
  onClose,
}: StudentAnswersModalProps) {
  // التبويب النشط: 'pre' أو 'post' أو 'activities' أو 'mod_module-1' إلخ
  const [activeTab, setActiveTab] = useState<string>('pre');
  const [filterStatus, setFilterStatus] = useState<QuestionFilter>('all');

  if (!student) return null;

  // تجهيز الموديولات الأربعة الافتراضية في حال كانت المصفوفة غير مكتملة
  const defaultModules: ModuleData[] = [
    { id: 'module-1', title: 'الموديول الأول: مكونات البيئة والعلاقات المكانية' } as ModuleData,
    { id: 'module-2', title: 'الموديول الثاني: التلوث البيئي ومصادره وتوزيعه المكاني' } as ModuleData,
    { id: 'module-3', title: 'الموديول الثالث: التغيرات المناخية وآثارها البيئية والمكانية' } as ModuleData,
    { id: 'module-4', title: 'الموديول الرابع: الاستدامة البيئية وإدارة الموارد' } as ModuleData,
  ];

  const activeModules = modules && modules.length > 0 ? modules : defaultModules;

  // أسئلة الاختبار الموحد (القبلي والبعدي)
  const unifiedQuestions = allQuestions
    .filter((q) => q.exam_type === 'pre_test' || q.exam_type === 'post_test')
    .sort((a, b) => a.order_index - b.order_index);

  const preQuestions = unifiedQuestions;
  const postQuestions = unifiedQuestions;

  const preAnswers = student.preTestAnswers || {};
  const postAnswers = student.postTestAnswers || {};
  const activitySubmissions = student.activitySubmissions || {};
  const moduleQuizScores = student.moduleQuizScores || {};

  // عدد التسليمات للأنشطة
  const totalSubmissionsCount = Object.keys(activitySubmissions).length;

  // دالة مساعدة لفلترة الأسئلة بحسب حالة الإجابة
  const filterQuestions = (questions: QuestionWithAnswer[], answers: Record<string, number>) => {
    if (filterStatus === 'all') return questions;
    return questions.filter((q) => {
      const ans = answers[q.id];
      const isAnswered = ans !== undefined;
      const isCorrect = isAnswered && ans === q.correct_option_index;

      if (filterStatus === 'correct') return isCorrect;
      if (filterStatus === 'wrong') return isAnswered && !isCorrect;
      if (filterStatus === 'unanswered') return !isAnswered;
      return true;
    });
  };

  // إحصائيات الإجابات للاختبار القبلي
  const preCorrectCount = preQuestions.filter(
    (q) => preAnswers[q.id] !== undefined && preAnswers[q.id] === q.correct_option_index
  ).length;
  const preWrongCount = preQuestions.filter(
    (q) => preAnswers[q.id] !== undefined && preAnswers[q.id] !== q.correct_option_index
  ).length;
  const preUnansweredCount = preQuestions.length - preCorrectCount - preWrongCount;

  // إحصائيات الإجابات للاختبار البعدي
  const postCorrectCount = postQuestions.filter(
    (q) => postAnswers[q.id] !== undefined && postAnswers[q.id] === q.correct_option_index
  ).length;
  const postWrongCount = postQuestions.filter(
    (q) => postAnswers[q.id] !== undefined && postAnswers[q.id] !== q.correct_option_index
  ).length;
  const postUnansweredCount = postQuestions.length - postCorrectCount - postWrongCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-asu-gold/40 text-right overflow-hidden">
        
        {/* 1. ترويسة النافذة المنبثقة الفاخرة */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-asu-gold/40 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-asu-gold-light" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-black text-white">
                  {student.fullName || 'طالب غير مسجل بالاسم'}
                </span>
                <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full font-mono text-asu-gold-light border border-white/10">
                  {student.username}
                </span>
                {student.isProfileCompleted ? (
                  <Badge variant="success" className="text-[10px] py-0 px-2">مكتمل الملف</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] py-0 px-2">في انتظار الدخول</Badge>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                سجل إجابات الاختبارات والأنشطة التطبيقية • هاتف: {student.phone || 'غير مسجل'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. شريط التبويبات الفاخر - تبويب لكل اختبار وكل موديول على حدة */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-2 sm:px-4 pt-2.5 gap-1 sm:gap-1.5 overflow-x-auto scrollbar-thin">
          
          {/* تبويب الاختبار القبلي */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('pre');
              setFilterStatus('all');
            }}
            className={`px-3 sm:px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'pre'
                ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Award className="w-4 h-4 text-asu-navy" />
            <span>الاختبار القبلي</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                student.preScore !== null
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {student.preScore !== null ? `${student.preScore}/${preQuestions.length}` : 'لم يؤدَ'}
            </span>
          </button>

          {/* تبويبات الموديولات الأربعة المنفصلة */}
          {activeModules.map((m, idx) => {
            const tabKey = `mod_${m.id}`;
            const quiz = moduleQuizScores[m.id];
            const modQuestions = allQuestions.filter((q) => q.exam_type === `module_${m.id}`);
            const totalQ = quiz?.total || modQuestions.length || 10;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setActiveTab(tabKey);
                  setFilterStatus('all');
                }}
                className={`px-3 sm:px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tabKey
                    ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-asu-gold-dark" />
                <span>الموديول {idx + 1}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    quiz
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {quiz ? `${quiz.score}/${totalQ}` : 'لم يختبر'}
                </span>
              </button>
            );
          })}

          {/* تبويب الاختبار البعدي */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('post');
              setFilterStatus('all');
            }}
            className={`px-3 sm:px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'post'
                ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>الاختبار البعدي</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                student.postScore !== null
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {student.postScore !== null ? `${student.postScore}/${postQuestions.length}` : 'لم يؤدَ'}
            </span>
          </button>

          {/* تبويب حلول الأنشطة التطبيقية */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('activities');
              setFilterStatus('all');
            }}
            className={`px-3 sm:px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>الأنشطة التطبيقية</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-asu-gold/20 text-asu-gold-dark">
              {totalSubmissionsCount}/{activeModules.length}
            </span>
          </button>
        </div>

        {/* 3. جسم المحتوى القابل للتمرير */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/30">

          {/* ======================================================== */}
          {/* تبويب: الاختبار القبلي                                    */}
          {/* ======================================================== */}
          {activeTab === 'pre' && (
            <div className="space-y-4">
              {student.preScore === null ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <h4 className="text-base font-bold text-slate-700">لم يؤدِ الطالب الاختبار القبلي بعد</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    سيظهر تقرير تفصيلي بكل سؤال وإجابة الطالب فور قيامه ببدء الاختبار من حسابه.
                  </p>
                </div>
              ) : (
                <>
                  {/* بطاقة النتيجة والإحصائيات */}
                  <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-emerald-800 font-bold block">
                        نتيجة الاختبار القبلي الشامل (تحديد المستوى)
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-700 font-mono">
                          {student.preScore}
                        </span>
                        <span className="text-sm font-bold text-slate-500 font-mono">
                          من أصل {preQuestions.length} سؤالاً
                        </span>
                        <Badge variant="success" className="text-xs font-bold font-mono mr-2">
                          النسبة: {Math.round(((student.preScore || 0) / (preQuestions.length || 1)) * 100)}%
                        </Badge>
                      </div>
                    </div>

                    {/* ملخص الإجابات */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>صحيحة: {preCorrectCount}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>خاطئة: {preWrongCount}</span>
                      </div>
                      {preUnansweredCount > 0 && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          <span>لم يُجب: {preUnansweredCount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* أزرار الفلترة السريعة للأسئلة */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> تصفية الأسئلة:
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filterStatus === 'all'
                          ? 'bg-asu-navy text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      الكل ({preQuestions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('correct')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filterStatus === 'correct'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      الصحيحة فقط ({preCorrectCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('wrong')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filterStatus === 'wrong'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      الخاطئة فقط ({preWrongCount})
                    </button>
                    {preUnansweredCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setFilterStatus('unanswered')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          filterStatus === 'unanswered'
                            ? 'bg-slate-700 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        لم يُجب ({preUnansweredCount})
                      </button>
                    )}
                  </div>

                  {/* قائمة الأسئلة */}
                  <div className="space-y-3">
                    {filterQuestions(preQuestions, preAnswers).map((q, idx) => {
                      const selectedIdx = preAnswers[q.id];
                      const hasAnswered = selectedIdx !== undefined;
                      const isCorrect = hasAnswered && selectedIdx === q.correct_option_index;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/30 border-emerald-200'
                              : hasAnswered
                              ? 'bg-rose-50/30 border-rose-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-slate-500 text-xs font-bold">
                                  س{q.order_index || idx + 1}
                                </span>
                                {q.question_type === 'true_false' || q.options.length === 2 ? (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                                    صح أم خطأ
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                                    اختيار من متعدد
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                {q.question_text}
                              </h5>
                            </div>

                            {hasAnswered ? (
                              isCorrect ? (
                                <Badge variant="success" className="gap-1 shrink-0 text-[10px]">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>صحيحة (+1)</span>
                                </Badge>
                              ) : (
                                <Badge variant="danger" className="gap-1 shrink-0 text-[10px]">
                                  <XCircle className="w-3 h-3" />
                                  <span>خاطئة (0)</span>
                                </Badge>
                              )
                            ) : (
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                لم يُجب
                              </Badge>
                            )}
                          </div>

                          {/* الخيارات مع تلوين واضح لإجابة الطالب والصحيحة */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isStudentChoice = selectedIdx === optIdx;
                              const isTheCorrectChoice = q.correct_option_index === optIdx;

                              let style = 'bg-white border-slate-200 text-slate-700';
                              if (isTheCorrectChoice) {
                                style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-2xs';
                              }
                              if (isStudentChoice && !isTheCorrectChoice) {
                                style = 'bg-rose-100 border-rose-300 text-rose-950 line-through';
                              }

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${style}`}
                                >
                                  <span>{opt}</span>
                                  {isStudentChoice && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/10 shrink-0">
                                      خيار الطالب
                                    </span>
                                  )}
                                  {isTheCorrectChoice && (
                                    <span className="text-[10px] font-bold text-emerald-800 shrink-0">
                                      ✓ الإجابة الصحيحة
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* تبويبات الموديولات الفردية (الموديول 1، 2، 3، 4)             */}
          {/* ======================================================== */}
          {activeTab.startsWith('mod_') && (() => {
            const currentModId = activeTab.replace('mod_', '');
            const currentMod = activeModules.find((m) => m.id === currentModId) || activeModules[0];
            const quiz = moduleQuizScores[currentMod.id];
            const answers = quiz?.answers || {};
            const modQuestions = allQuestions
              .filter((q) => q.exam_type === `module_${currentMod.id}`)
              .sort((a, b) => a.order_index - b.order_index);
            const sub = activitySubmissions[currentMod.id];

            const totalQuestionsCount = quiz?.total || modQuestions.length || 10;
            const score = quiz?.score ?? 0;
            const percentage = quiz ? Math.round((score / totalQuestionsCount) * 100) : 0;

            return (
              <div className="space-y-6">
                {/* 1. بطاقة نتيجة تقويم هذا الموديول */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <Badge variant="gold" className="text-xs px-2.5 py-0.5 font-bold mb-1">
                        {currentMod.title}
                      </Badge>
                      <h3 className="text-lg font-black text-asu-navy">
                        تقرير التقويم البنائي والنشاط التطبيقي
                      </h3>
                      {currentMod.subtitle && (
                        <p className="text-xs text-slate-500">{currentMod.subtitle}</p>
                      )}
                    </div>

                    {quiz ? (
                      <div className="flex flex-col sm:items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-emerald-700 font-mono">
                            {score} / {totalQuestionsCount}
                          </span>
                          <Badge variant="success" className="text-xs font-mono font-bold">
                            النسبة: {percentage}%
                          </Badge>
                        </div>
                        {quiz.completedAt && (
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            تاريخ الاختبار: {new Date(quiz.completedAt).toLocaleString('ar-EG')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs text-slate-500 py-1.5 px-3">
                        لم يقم الطالب بأداء تقويم هذا الموديول بعد
                      </Badge>
                    )}
                  </div>

                  {/* 2. أسئلة التقويم البنائي الـ 10 للموديول */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-asu-navy flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-asu-gold-dark" />
                        <span>أسئلة التقويم البنائي للموديول ({modQuestions.length} أسئلة)</span>
                      </h4>
                      {!quiz && (
                        <span className="text-xs text-slate-400">
                          (معاينة الأسئلة النموذجية المعتمدة)
                        </span>
                      )}
                    </div>

                    {modQuestions.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl">
                        لم يتم ربط أسئلة في بنك الأسئلة لهذا الموديول حالياً.
                      </div>
                    ) : (
                      modQuestions.map((q, qIdx) => {
                        const selectedIdx = answers[q.id];
                        const hasAnswered = selectedIdx !== undefined;
                        const isCorrect = hasAnswered && selectedIdx === q.correct_option_index;

                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                              quiz
                                ? isCorrect
                                  ? 'bg-emerald-50/30 border-emerald-200'
                                  : hasAnswered
                                  ? 'bg-rose-50/30 border-rose-200'
                                  : 'bg-white border-slate-200'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-500 text-xs font-bold">
                                  س{qIdx + 1}
                                </span>
                                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {q.question_text}
                                </span>
                              </div>

                              {quiz ? (
                                hasAnswered ? (
                                  isCorrect ? (
                                    <Badge variant="success" className="text-[10px] shrink-0">
                                      صحيحة (+1)
                                    </Badge>
                                  ) : (
                                    <Badge variant="danger" className="text-[10px] shrink-0">
                                      خاطئة (0)
                                    </Badge>
                                  )
                                ) : (
                                  <Badge variant="outline" className="text-[10px] shrink-0">
                                    لم يُجب
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="outline" className="text-[10px] shrink-0">
                                  سؤال موديول
                                </Badge>
                              )}
                            </div>

                            {/* الخيارات الأربعة */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const isStudentChoice = selectedIdx === optIdx;
                                const isTheCorrectChoice = q.correct_option_index === optIdx;

                                let optStyle = 'bg-white border-slate-200 text-slate-700';
                                if (isTheCorrectChoice) {
                                  optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                                }
                                if (isStudentChoice && !isTheCorrectChoice) {
                                  optStyle = 'bg-rose-100 border-rose-300 text-rose-950 line-through';
                                }

                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${optStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isStudentChoice && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/10 shrink-0">
                                        خيار الطالب
                                      </span>
                                    )}
                                    {isTheCorrectChoice && (
                                      <span className="text-[9px] font-bold text-emerald-800 shrink-0">
                                        ✓ الإجابة الصحيحة
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 3. قسم النشاط التطبيقي الخاص بهذا الموديول */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-asu-gold-dark" />
                      <div>
                        <h4 className="font-extrabold text-sm text-asu-navy">
                          النشاط التطبيقي لـ {currentMod.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {currentMod.activity?.title || 'الأنشطة التطبيقية الميدانية'}
                        </p>
                      </div>
                    </div>

                    {sub ? (
                      <Badge variant="success" className="gap-1 text-xs py-1 px-3">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم تسليم النشاط</span>
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-xs py-1 px-3">
                        لم يقم بالتسليم بعد
                      </Badge>
                    )}
                  </div>

                  {sub ? (
                    <div className="space-y-3 pt-1">
                      <div>
                        <span className="text-xs font-bold text-slate-600 block mb-1">
                          إجابة وحل الطالب:
                        </span>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {sub.answerText || 'لا توجد إجابة نصية.'}
                        </div>
                      </div>

                      {sub.fileUrl && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-slate-600 font-bold">الملف المرفق:</span>
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200 px-3.5 py-2 rounded-xl shadow-2xs transition-all"
                          >
                            <FileText className="w-4 h-4 text-rose-600 ml-1" />
                            <span>معاينة وتحميل ملف الحل المرفق (PDF)</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {sub.submittedAt && (
                        <span className="text-[11px] text-slate-400 block pt-1 font-mono">
                          تاريخ التسليم: {new Date(sub.submittedAt).toLocaleString('ar-EG')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2">
                      لم يُرسل الطالب حلاً لهذا النشاط حتى الآن.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* تبويب: الاختبار البعدي                                    */}
          {/* ======================================================== */}
          {activeTab === 'post' && (
            <div className="space-y-4">
              {student.postScore === null ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <h4 className="text-base font-bold text-slate-700">لم يؤدِ الطالب الاختبار البعدي بعد</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    يتاح الاختبار البعدي للطالب بعد استكمال دراسة كافة الموديولات التعليمية الأربعة.
                  </p>
                </div>
              ) : (
                <>
                  {/* بطاقة النتيجة والنمو */}
                  <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-emerald-800 font-bold block">
                        نتيجة الاختبار البعدي النهائي
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-700 font-mono">
                          {student.postScore}
                        </span>
                        <span className="text-sm font-bold text-slate-500 font-mono">
                          من أصل {postQuestions.length} سؤالاً
                        </span>
                        <Badge variant="success" className="text-xs font-bold font-mono mr-2">
                          النسبة: {Math.round(((student.postScore || 0) / (postQuestions.length || 1)) * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {student.preScore !== null && (
                        <div className="px-3.5 py-2 rounded-xl bg-asu-navy text-white text-xs font-bold flex items-center gap-2 shadow-xs">
                          <TrendingUp className="w-4 h-4 text-asu-gold-light" />
                          <span>
                            نمو التعلم: +{(student.postScore || 0) - (student.preScore || 0)} درجات
                          </span>
                        </div>
                      )}
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>صحيحة: {postCorrectCount}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>خاطئة: {postWrongCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* أزرار الفلترة */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> تصفية الأسئلة:
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filterStatus === 'all'
                          ? 'bg-asu-navy text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      الكل ({postQuestions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('correct')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filterStatus === 'correct'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      الصحيحة فقط ({postCorrectCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('wrong')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filterStatus === 'wrong'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      الخاطئة فقط ({postWrongCount})
                    </button>
                    {postUnansweredCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setFilterStatus('unanswered')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          filterStatus === 'unanswered'
                            ? 'bg-slate-700 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        لم يُجب ({postUnansweredCount})
                      </button>
                    )}
                  </div>

                  {/* قائمة الأسئلة */}
                  <div className="space-y-3">
                    {filterQuestions(postQuestions, postAnswers).map((q, idx) => {
                      const selectedIdx = postAnswers[q.id];
                      const hasAnswered = selectedIdx !== undefined;
                      const isCorrect = hasAnswered && selectedIdx === q.correct_option_index;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/30 border-emerald-200'
                              : hasAnswered
                              ? 'bg-rose-50/30 border-rose-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-slate-500 text-xs font-bold">
                                  س{q.order_index || idx + 1}
                                </span>
                                {q.question_type === 'true_false' || q.options.length === 2 ? (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                                    صح أم خطأ
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                                    اختيار من متعدد
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                {q.question_text}
                              </h5>
                            </div>

                            {hasAnswered ? (
                              isCorrect ? (
                                <Badge variant="success" className="gap-1 shrink-0 text-[10px]">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>صحيحة (+1)</span>
                                </Badge>
                              ) : (
                                <Badge variant="danger" className="gap-1 shrink-0 text-[10px]">
                                  <XCircle className="w-3 h-3" />
                                  <span>خاطئة (0)</span>
                                </Badge>
                              )
                            ) : (
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                لم يُجب
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isStudentChoice = selectedIdx === optIdx;
                              const isTheCorrectChoice = q.correct_option_index === optIdx;

                              let style = 'bg-white border-slate-200 text-slate-700';
                              if (isTheCorrectChoice) {
                                style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                              }
                              if (isStudentChoice && !isTheCorrectChoice) {
                                style = 'bg-rose-100 border-rose-300 text-rose-950 line-through';
                              }

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${style}`}
                                >
                                  <span>{opt}</span>
                                  {isStudentChoice && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/10 shrink-0">
                                      خيار الطالب
                                    </span>
                                  )}
                                  {isTheCorrectChoice && (
                                    <span className="text-[10px] font-bold text-emerald-800 shrink-0">
                                      ✓ الإجابة الصحيحة
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* تبويب: حلول الأنشطة التطبيقية المجمعة                      */}
          {/* ======================================================== */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-asu-navy">تسليمات الأنشطة التطبيقية</h4>
                  <p className="text-xs text-slate-500">
                    استعراض الحلول المكتوبة وملفات الـ PDF المرفوعة من الطالب لكل موديول.
                  </p>
                </div>
                <Badge variant="gold" className="text-xs font-mono font-bold">
                  {totalSubmissionsCount} من أصل {activeModules.length} موديولات
                </Badge>
              </div>

              {activeModules.map((m) => {
                const sub = activitySubmissions[m.id];

                return (
                  <div
                    key={m.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <Badge variant="gold" className="text-[10px] mb-1">
                          {m.title}
                        </Badge>
                        <h4 className="font-bold text-xs sm:text-sm text-asu-navy">
                          {m.activity?.title || 'نشاط تطبيقي ميداني'}
                        </h4>
                      </div>

                      {sub ? (
                        <Badge variant="success" className="gap-1 text-[10px] py-1 px-2.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>تم التسليم</span>
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px] py-1 px-2.5">
                          لم يتم التسليم بعد
                        </Badge>
                      )}
                    </div>

                    {sub ? (
                      <div className="space-y-2.5">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {sub.answerText || 'لا يوجد نص مكتوب.'}
                        </div>

                        {sub.fileUrl && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-slate-500 font-bold">الملف المرفق:</span>
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200 px-3 py-1.5 rounded-xl shadow-2xs transition-all"
                            >
                              <FileText className="w-4 h-4 text-rose-600 ml-1" />
                              <span>معاينة وتحميل ملف PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {sub.submittedAt && (
                          <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                            تاريخ التسليم: {new Date(sub.submittedAt).toLocaleString('ar-EG')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        لم يُرسل الطالب حلاً لهذا النشاط حتى الآن.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* 4. فوتر النافذة المنبثقة */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            منصة بيئتي التعليمية • لوحة المشرف الأكاديمي
          </span>
          <Button variant="outline" size="md" onClick={onClose} className="text-xs font-bold px-6">
            إغلاق النافذة
          </Button>
        </div>
      </div>
    </div>
  );
}
