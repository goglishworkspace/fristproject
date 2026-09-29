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

// دالة مساعدة لتلوين وتنسيق قيم إجابات الأنشطة
function renderValueBadge(val: string) {
  const trimmed = val ? val.trim() : '';
  if (!trimmed || trimmed === '(لم يُحدد)' || trimmed === '(لم تُحدد)') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 border border-dashed border-slate-300 px-2 py-0.5 rounded-md font-medium">
        لم يُحدد من قبل الطالب
      </span>
    );
  }

  // تمييز خيارات النوع (طبيعي / بشري)
  if (trimmed === 'طبيعي' || trimmed === 'النوع: طبيعي') {
    return (
      <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
        طبيعي
      </span>
    );
  }
  if (trimmed === 'بشري' || trimmed === 'النوع: بشري') {
    return (
      <span className="inline-flex items-center text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
        بشري
      </span>
    );
  }

  return (
    <span className="font-bold text-asu-navy bg-white px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-2xs inline-block">
      {trimmed}
    </span>
  );
}

// مكوّن عرض إجابات الأنشطة التطبيقية بشكل أكاديمي واحترافي
function ActivityReportViewer({ text }: { text?: string }) {
  if (!text || !text.trim()) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        لم يُرسل الطالب إجابة نصية لهذا النشاط حتى الآن.
      </div>
    );
  }

  // إذا لم يكن النص يحتوي على فواصل الأنشطة (---)
  if (!text.includes('---')) {
    return (
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
        {text}
      </div>
    );
  }

  // تجزئة التقرير إلى أنشطة وبنود
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: { title: string; items: string[] }[] = [];
  let currentSection: { title: string; items: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith('===') && line.endsWith('===')) {
      continue; // تجاهل سطر التقرير العام لأننا نعرض عنواناً في الكرت
    }
    if (line.startsWith('---') && line.endsWith('---')) {
      const cleanTitle = line.replace(/^-+\s*/, '').replace(/\s*-+$/, '').trim();
      currentSection = { title: cleanTitle, items: [] };
      sections.push(currentSection);
      continue;
    }
    if (!currentSection) {
      currentSection = { title: 'إجابة عامة', items: [] };
      sections.push(currentSection);
    }
    currentSection.items.push(line);
  }

  return (
    <div className="space-y-4">
      {sections.map((sec, sIdx) => (
        <div
          key={sIdx}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-3"
        >
          {/* ترويسة النشاط */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-asu-gold/15 text-asu-gold-dark flex items-center justify-center font-black text-xs shrink-0">
                {sIdx + 1}
              </div>
              <h5 className="font-extrabold text-xs sm:text-sm text-asu-navy">
                {sec.title}
              </h5>
            </div>
            <Badge variant="outline" className="text-[10px] text-slate-500 font-bold">
              {sec.items.length} بنود
            </Badge>
          </div>

          {/* محتويات وبنود النشاط */}
          <div className="space-y-2">
            {sec.items.map((item, iIdx) => {
              // حالة السطر الذي يحتوي على pipe | (مثل: 1. المكون: ماء | النوع: طبيعي)
              if (item.includes('|')) {
                const parts = item.split('|').map((p) => p.trim());
                const firstPart = parts[0].replace(/^\d+[\.\)]\s*/, '');
                const secondPart = parts[1] || '';

                return (
                  <div
                    key={iIdx}
                    className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
                        {iIdx + 1}
                      </span>
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        {renderValueBadge(firstPart)}
                      </div>
                    </div>
                    {secondPart && (
                      <div className="shrink-0">
                        {renderValueBadge(secondPart)}
                      </div>
                    )}
                  </div>
                );
              }

              // حالة السطر الذي يحتوي على مفتاح وقيمة (مثل: المكان الأكثر تعرضًا: ...)
              const colonIndex = item.indexOf(':');
              if (colonIndex > 0) {
                const label = item.substring(0, colonIndex).replace(/^[-*•\d\.\)]\s*/, '').trim();
                const val = item.substring(colonIndex + 1).trim();

                return (
                  <div
                    key={iIdx}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-slate-700">{label}:</span>
                    <div className="sm:text-left">
                      {renderValueBadge(val)}
                    </div>
                  </div>
                );
              }

              // سطر عادي
              return (
                <div
                  key={iIdx}
                  className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/40"
                >
                  {renderValueBadge(item)}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudentAnswersModal({
  student,
  allQuestions,
  modules,
  onClose,
}: StudentAnswersModalProps) {
  // التبويب النشط
  const [activeTab, setActiveTab] = useState<string>('pre');
  const [filterStatus, setFilterStatus] = useState<QuestionFilter>('all');

  if (!student) return null;

  // تجهيز الموديولات الأربعة الافتراضية
  const defaultModules: ModuleData[] = [
    { id: 'module-1', title: 'الموديول الأول: مكونات البيئة والعلاقات المكانية' } as ModuleData,
    { id: 'module-2', title: 'الموديول الثاني: التلوث البيئي ومصادره وتوزيعه المكاني' } as ModuleData,
    { id: 'module-3', title: 'الموديول الثالث: التغيرات المناخية وآثارها البيئية والمكانية' } as ModuleData,
    { id: 'module-4', title: 'الموديول الرابع: الاستدامة البيئية وإدارة الموارد' } as ModuleData,
  ];

  const activeModules = modules && modules.length > 0 ? modules : defaultModules;

  // أسماء التبويبات العربية الواضحة بدون أرقام منفصلة تمنع أي انعكاس نصي
  const moduleTabNames: Record<string, string> = {
    'module-1': 'الموديول الأول',
    'module-2': 'الموديول الثاني',
    'module-3': 'الموديول الثالث',
    'module-4': 'الموديول الرابع',
  };

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

  const totalSubmissionsCount = Object.keys(activitySubmissions).length;

  // دالة تصفية الأسئلة
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[92vh] max-h-[92vh] flex flex-col shadow-2xl border-2 border-asu-gold/40 text-right overflow-hidden">
        
        {/* 1. ترويسة النافذة المنبثقة (ثابتة تماماً ومقاومة للانكماش) */}
        <div className="shrink-0 p-4 sm:p-5 bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-asu-gold/40 flex items-center justify-center shrink-0">
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
                  <Badge variant="success" className="text-[10px] py-0 px-2 font-bold">مكتمل الملف</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] py-0 px-2 font-bold text-slate-300 border-white/20">في انتظار الدخول</Badge>
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
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. شريط التبويبات الفاخر (ثابت بارتفاع مريح ويمنع أي انضغاط أو اختفاء للكلام) */}
        <div className="shrink-0 bg-slate-100/90 border-b border-slate-200 p-2.5 sm:p-3 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            
            {/* تبويب الاختبار القبلي */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('pre');
                setFilterStatus('all');
              }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs ${
                activeTab === 'pre'
                  ? 'bg-asu-navy text-white shadow-md ring-2 ring-asu-gold/60 font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === 'pre' ? 'text-asu-gold-light' : 'text-slate-500'}`} />
              <span>الاختبار القبلي</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  activeTab === 'pre'
                    ? 'bg-white/20 text-white'
                    : student.preScore !== null
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {student.preScore !== null ? `${student.preScore}/${preQuestions.length}` : 'لم يؤدَ'}
              </span>
            </button>

            {/* تبويبات الموديولات الأربعة بأسماء عربية صريحة */}
            {activeModules.map((m, idx) => {
              const tabKey = `mod_${m.id}`;
              const quiz = moduleQuizScores[m.id];
              const modQuestions = allQuestions.filter((q) => q.exam_type === `module_${m.id}`);
              const totalQ = quiz?.total || modQuestions.length || 10;
              const tabTitle = moduleTabNames[m.id] || `الموديول ${idx + 1}`;
              const isCurrentActive = activeTab === tabKey;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tabKey);
                    setFilterStatus('all');
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs ${
                    isCurrentActive
                      ? 'bg-asu-navy text-white shadow-md ring-2 ring-asu-gold/60 font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 border border-slate-200/90'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${isCurrentActive ? 'text-asu-gold-light' : 'text-asu-gold-dark'}`} />
                  <span>{tabTitle}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isCurrentActive
                        ? 'bg-white/20 text-white'
                        : quiz
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
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
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs ${
                activeTab === 'post'
                  ? 'bg-asu-navy text-white shadow-md ring-2 ring-asu-gold/60 font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${activeTab === 'post' ? 'text-asu-gold-light' : 'text-emerald-600'}`} />
              <span>الاختبار البعدي</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  activeTab === 'post'
                    ? 'bg-white/20 text-white'
                    : student.postScore !== null
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
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
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs ${
                activeTab === 'activities'
                  ? 'bg-asu-navy text-white shadow-md ring-2 ring-asu-gold/60 font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'activities' ? 'text-asu-gold-light' : 'text-amber-500'}`} />
              <span>الأنشطة التطبيقية</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  activeTab === 'activities'
                    ? 'bg-white/20 text-white'
                    : 'bg-asu-gold/20 text-asu-gold-dark'
                }`}
              >
                {totalSubmissionsCount}/{activeModules.length}
              </span>
            </button>
          </div>
        </div>

        {/* 3. جسم المحتوى القابل للتمرير (يأخذ المساحة المتبقية بسلاسة) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/40">

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

                  {/* أزرار الفلترة السريعة */}
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
          {/* تبويبات الموديولات الفردية (الموديول الأول ... الرابع)       */}
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

                {/* 3. قسم النشاط التطبيقي المنسق باحترافية */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-asu-gold-dark" />
                      <div>
                        <h4 className="font-extrabold text-sm text-asu-navy">
                          حل النشاط التطبيقي لـ {currentMod.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {currentMod.activity?.title || 'الأنشطة الميدانية والتطبيقية'}
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
                    <div className="space-y-4 pt-1">
                      {/* استعراض التقرير المنسق باحترافية */}
                      <ActivityReportViewer text={sub.answerText} />

                      {/* زر وملف الـ PDF المرفق إن وجد */}
                      {sub.fileUrl && (
                        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-rose-950">
                                الملف المرفق من الطالب (PDF)
                              </p>
                              <p className="text-[11px] text-rose-700 mt-0.5">
                                تقرير ورسومات النشاط التطبيقي المرفوعة
                              </p>
                            </div>
                          </div>
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 text-xs text-white bg-rose-600 hover:bg-rose-700 font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
                          >
                            <span>معاينة وتحميل ملف PDF</span>
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
                    استعراض الحلول المنظمة وملفات الـ PDF المرفوعة من الطالب لكل موديول.
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
                      <div className="space-y-3">
                        <ActivityReportViewer text={sub.answerText} />

                        {sub.fileUrl && (
                          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-rose-950">
                                ملف الحل المرفق (PDF)
                              </span>
                            </div>
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-white bg-rose-600 hover:bg-rose-700 font-bold px-3.5 py-1.5 rounded-xl shadow-2xs transition-all"
                            >
                              <span>معاينة وتحميل</span>
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

        {/* 4. فوتر النافذة المنبثقة (ثابت) */}
        <div className="shrink-0 p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
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
