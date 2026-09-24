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
  Award,
  ExternalLink,
  HelpCircle,
  Sparkles,
  TrendingUp,
  User,
  Clock,
  BookOpen,
} from 'lucide-react';

interface StudentAnswersModalProps {
  student: StudentAccount | null;
  allQuestions: QuestionWithAnswer[];
  modules: ModuleData[];
  onClose: () => void;
}

export function StudentAnswersModal({
  student,
  allQuestions,
  modules,
  onClose,
}: StudentAnswersModalProps) {
  const [activeTab, setActiveTab] = useState<'pre' | 'post' | 'activities'>('pre');

  if (!student) return null;

  const preQuestions = allQuestions.filter((q) => q.exam_type === 'pre_test');
  const postQuestions = allQuestions.filter((q) => q.exam_type === 'post_test');

  const preAnswers = student.preTestAnswers || {};
  const postAnswers = student.postTestAnswers || {};
  const activitySubmissions = student.activitySubmissions || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border-2 border-asu-gold/40 text-right overflow-hidden">
        {/* ترويسة النافذة المنبثقة */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-asu-gold/40 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-asu-gold-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white">
                  {student.fullName || 'طالب غير مسجل بالاسم'}
                </span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-asu-gold-light">
                  {student.username}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                سجل إجابات الاختبارات والأنشطة التطبيقية • هاتف: {student.phone || 'غير مسجل'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* أزرار التبويبات الفاخرة - قابلة للتمرير بسلاسة على الهواتف */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-2 sm:px-4 pt-3 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('pre')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pre'
                ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>الاختبار القبلي</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                student.preScore !== null ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {student.preScore !== null ? `${student.preScore} / ${preQuestions.length}` : 'لم يؤدَ'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'post'
                ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>الاختبار البعدي</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                student.postScore !== null ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {student.postScore !== null ? `${student.postScore} / ${postQuestions.length}` : 'لم يؤدَ'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('module_quizzes' as any)}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              (activeTab as string) === 'module_quizzes'
                ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-asu-gold-dark" />
            <span>اختبارات الموديولات</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-asu-navy/10 text-asu-navy">
              {Object.keys(student.moduleQuizScores || {}).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-white text-asu-navy border-t-2 border-x border-asu-gold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-asu-gold-dark" />
            <span>حلول الأنشطة التطبيقية</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-asu-gold/15 text-asu-gold-dark">
              {Object.keys(activitySubmissions).length}
            </span>
          </button>
        </div>

        {/* محتوى التبويب النشط */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. تبويب الاختبار القبلي */}
          {activeTab === 'pre' && (
            <div className="space-y-4">
              {student.preScore === null ? (
                <div className="text-center py-12 text-slate-400">
                  <HelpCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-bold">لم يقم الطالب بأداء الاختبار القبلي بعد.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-800 font-bold block">نتيجة الاختبار القبلي</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono">
                        {student.preScore} من أصل {preQuestions.length} سؤالاً
                      </span>
                    </div>
                    <Badge variant="success" className="text-xs">
                      النسبة: {Math.round(((student.preScore || 0) / (preQuestions.length || 1)) * 100)}%
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {preQuestions.map((q, idx) => {
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
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-slate-400 text-xs font-bold">س{idx + 1}</span>
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
                              <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                {q.question_text}
                              </span>
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
                              <Badge variant="outline" className="text-[10px]">
                                لم يُجب
                              </Badge>
                            )}
                          </div>

                          {/* الخيارات الأربعة مع تمييز إجابة الطالب والصحيحة */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isStudentChoice = selectedIdx === optIdx;
                              const isTheCorrectChoice = q.correct_option_index === optIdx;

                              let style = 'bg-white border-slate-200 text-slate-700';
                              if (isTheCorrectChoice) {
                                style = 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold';
                              }
                              if (isStudentChoice && !isTheCorrectChoice) {
                                style = 'bg-rose-100/70 border-rose-300 text-rose-950 line-through';
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
                                  {isTheCorrectChoice && !isStudentChoice && (
                                    <span className="text-[10px] font-bold text-emerald-700 shrink-0">
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

          {/* 2. تبويب الاختبار البعدي */}
          {activeTab === 'post' && (
            <div className="space-y-4">
              {student.postScore === null ? (
                <div className="text-center py-12 text-slate-400">
                  <HelpCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-bold">لم يقم الطالب بأداء الاختبار البعدي بعد.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-800 font-bold block">نتيجة الاختبار البعدي</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono">
                        {student.postScore} من أصل {postQuestions.length} سؤالاً
                      </span>
                    </div>
                    {student.preScore !== null && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-asu-navy bg-white px-3 py-1.5 rounded-xl border border-asu-gold/30">
                        <TrendingUp className="w-4 h-4 text-asu-gold-dark" />
                        <span>نمو التعلم: +{(student.postScore || 0) - (student.preScore || 0)} درجات</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {postQuestions.map((q, idx) => {
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
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-slate-400 text-xs font-bold">س{idx + 1}</span>
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
                              <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                {q.question_text}
                              </span>
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
                              <Badge variant="outline" className="text-[10px]">
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
                                style = 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold';
                              }
                              if (isStudentChoice && !isTheCorrectChoice) {
                                style = 'bg-rose-100/70 border-rose-300 text-rose-950 line-through';
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
                                  {isTheCorrectChoice && !isStudentChoice && (
                                    <span className="text-[10px] font-bold text-emerald-700 shrink-0">
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

          {/* 3. تبويب اختبارات الموديولات */}
          {(activeTab as string) === 'module_quizzes' && (
            <div className="space-y-6">
              {modules.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-bold">لا توجد موديولات تعليمية مضافة بعد.</p>
                </div>
              ) : (
                modules.map((m) => {
                  const modExamType = `module_${m.id}`;
                  const modQuestions = allQuestions.filter((q) => q.exam_type === modExamType);
                  const quizResult = student.moduleQuizScores?.[m.id];
                  const answers = quizResult?.answers || {};

                  return (
                    <div
                      key={m.id}
                      className="border border-slate-200/90 rounded-2xl p-4 sm:p-5 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-asu-navy" />
                          <h4 className="font-black text-sm sm:text-base text-asu-navy">
                            {m.title}
                          </h4>
                        </div>
                        {quizResult ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="success" className="text-xs">
                              الدرجة: {quizResult.score} / {quizResult.total}
                            </Badge>
                            <span className="text-[11px] text-slate-400">
                              تاريخ الأداء: {new Date(quizResult.completedAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs text-slate-400">
                            لم يختبر الطالب هذه الوحدة بعد
                          </Badge>
                        )}
                      </div>

                      {modQuestions.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          لم يتم وضع أسئلة اختبار لهذه الوحدة من بنك الأسئلة بعد.
                        </p>
                      ) : (
                        <div className="space-y-2.5 pt-1">
                          {modQuestions.map((q, qIdx) => {
                            const selectedIdx = answers[q.id];
                            const hasAnswered = selectedIdx !== undefined;
                            const isCorrect = hasAnswered && selectedIdx === q.correct_option_index;

                            return (
                              <div
                                key={q.id}
                                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                                  isCorrect
                                    ? 'bg-emerald-50/40 border-emerald-200'
                                    : hasAnswered
                                    ? 'bg-rose-50/40 border-rose-200'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-slate-900">
                                    س{qIdx + 1}: {q.question_text}
                                  </span>
                                  {hasAnswered ? (
                                    isCorrect ? (
                                      <Badge variant="success" className="text-[10px]">
                                        صحيحة (+1)
                                      </Badge>
                                    ) : (
                                      <Badge variant="danger" className="text-[10px]">
                                        خاطئة
                                      </Badge>
                                    )
                                  ) : (
                                    <span className="text-[10px] text-slate-400">لم يُجب</span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                  {q.options.map((opt, optIdx) => {
                                    const isStudentChoice = selectedIdx === optIdx;
                                    const isTheCorrectChoice = q.correct_option_index === optIdx;

                                    let optStyle = 'bg-white border-slate-200 text-slate-700';
                                    if (isTheCorrectChoice) {
                                      optStyle = 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold';
                                    }
                                    if (isStudentChoice && !isTheCorrectChoice) {
                                      optStyle = 'bg-rose-100/70 border-rose-300 text-rose-950 line-through';
                                    }

                                    return (
                                      <div
                                        key={optIdx}
                                        className={`p-2 rounded-lg border text-[11px] flex items-center justify-between gap-2 ${optStyle}`}
                                      >
                                        <span>{opt}</span>
                                        {isStudentChoice && (
                                          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-black/10 shrink-0">
                                            خيار الطالب
                                          </span>
                                        )}
                                        {isTheCorrectChoice && !isStudentChoice && (
                                          <span className="text-[9px] font-bold text-emerald-700 shrink-0">
                                            ✓ الصحيحة
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
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 4. تبويب حلول الأنشطة التطبيقية */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              {modules.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">لا توجد وحدات تعليمية حالياً.</p>
              ) : (
                modules.map((m) => {
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
                            {m.activity?.title || 'نشاط تطبيقي'}
                          </h4>
                        </div>

                        {sub ? (
                          <Badge variant="success" className="gap-1 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>تم التسليم</span>
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px]">
                            لم يتم التسليم بعد
                          </Badge>
                        )}
                      </div>

                      {sub ? (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60 whitespace-pre-wrap">
                            {sub.answerText}
                          </p>

                          {sub.fileUrl && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-slate-500 font-bold">الملف المرفق:</span>
                              <a
                                href={sub.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200 px-3 py-1.5 rounded-xl shadow-2xs transition-all"
                              >
                                <FileText className="w-4 h-4 text-rose-600 ml-1" /><span>معاينة وتحميل ملف PDF</span>
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
                })
              )}
            </div>
          )}
        </div>

        {/* فوتر النافذة */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <Button variant="outline" size="md" onClick={onClose} className="text-xs font-bold">
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}
