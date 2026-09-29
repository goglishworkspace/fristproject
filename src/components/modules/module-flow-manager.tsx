'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Module, Question, StudentActivitySubmission } from '@/lib/types/database';
import { ModuleImageSlider } from '@/components/modules/module-image-slider';
import { ModuleActivityBox } from '@/components/modules/module-activity-box';
import { ModuleQuizBox } from '@/components/modules/module-quiz-box';
import { Badge } from '@/components/ui/badge';
import {
  Presentation,
  FileCheck2,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export type ModuleStage = 'slides' | 'activity' | 'quiz';

interface ModuleFlowManagerProps {
  moduleData: Module;
  safeModuleQuestions: Question[];
  existingSubmission: StudentActivitySubmission | null;
  quizResult: { score: number; total: number } | null;
  isCompleted: boolean;
  isLastModule: boolean;
  prevModule: Module | null;
  nextModule: Module | null;
  nextTargetUrl: string;
  handleComplete?: () => Promise<void>;
}

export function ModuleFlowManager({
  moduleData,
  safeModuleQuestions,
  existingSubmission,
  quizResult,
  isCompleted,
  nextTargetUrl,
}: ModuleFlowManagerProps) {
  const [currentStage, setCurrentStage] = useState<ModuleStage>('slides');
  const [slidesCompleted, setSlidesCompleted] = useState(
    isCompleted || !!existingSubmission || false
  );
  const [activityCompleted, setActivityCompleted] = useState(
    isCompleted || !!existingSubmission || false
  );

  const goToStage = (stage: ModuleStage) => {
    setCurrentStage(stage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasActivitySubmitted = !!existingSubmission || activityCompleted;
  const hasQuizCompleted = quizResult?.score !== null && quizResult?.score !== undefined;

  // شروط فك قفل المراحل:
  // 1. النشاط التطبيقي: يفتح فقط بعد إكمال تصفح الشرائح حتى النهاية أو إذا كان مكتملاً سابقاً
  const isActivityUnlocked = isCompleted || hasActivitySubmitted || slidesCompleted;

  // 2. التقويم البنائي: يفتح فقط بعد تسليم حل النشاط التطبيقي أو إذا كان مكتملاً سابقاً
  const isQuizUnlocked = isCompleted || hasQuizCompleted || hasActivitySubmitted;

  return (
    <div className="w-full space-y-6 text-right select-none animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. شريط التنقل العلوي وتتبع خطوات الموديول الثلاث (Stepper) مع أقفال المراحل */}
      {/* ========================================================================= */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* سطر المسار السريع وحالة الإكمال */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Link
              href="/modules"
              className="flex items-center gap-1.5 text-asu-navy hover:text-asu-navy-light font-black transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للموديولات</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-300" />
            <span className="text-slate-800 font-extrabold">{moduleData.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <Badge variant="success" className="gap-1 font-bold text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>الموديول مكتمل بنجاح</span>
              </Badge>
            )}
          </div>
        </div>

        {/* أزرار مراحل الموديول الثلاثة (الشرائح -> النشاط -> التقويم) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* المرحلة 1: الشرائح التعليمية (متاحة دائماً) */}
          <button
            type="button"
            onClick={() => goToStage('slides')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-right transition-all cursor-pointer flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 select-none ${
              currentStage === 'slides'
                ? 'bg-asu-navy text-white border-asu-gold shadow-md ring-2 ring-asu-gold/30'
                : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Presentation
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                  currentStage === 'slides' ? 'text-asu-gold' : 'text-slate-500'
                }`}
              />
              <span className="text-[11px] sm:text-xs font-black truncate">
                ١. الشرائح التعليمية
              </span>
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentStage === 'slides'
                  ? 'bg-asu-gold text-slate-950 font-black'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStage === 'slides' ? 'الحالية' : 'استعراض'}
            </span>
          </button>

          {/* المرحلة 2: النشاط التطبيقي (مقفل حتى إنهاء الشرائح) */}
          <button
            type="button"
            disabled={!isActivityUnlocked}
            onClick={() => isActivityUnlocked && goToStage('activity')}
            title={!isActivityUnlocked ? 'أكمل استعراض جميع الشرائح التعليمية أولاً لفتح النشاط' : undefined}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-right transition-all flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 select-none ${
              !isActivityUnlocked
                ? 'bg-slate-100/70 border-slate-200/60 text-slate-400 cursor-not-allowed opacity-75'
                : currentStage === 'activity'
                ? 'bg-asu-navy text-white border-asu-gold shadow-md ring-2 ring-asu-gold/30 cursor-pointer'
                : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 border-slate-200 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2">
              {!isActivityUnlocked ? (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              ) : (
                <FileCheck2
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    currentStage === 'activity'
                      ? 'text-asu-gold'
                      : hasActivitySubmitted
                      ? 'text-emerald-500'
                      : 'text-slate-500'
                  }`}
                />
              )}
              <span className="text-[11px] sm:text-xs font-black truncate">
                ٢. النشاط التطبيقي
              </span>
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                !isActivityUnlocked
                  ? 'bg-slate-200 text-slate-500'
                  : currentStage === 'activity'
                  ? 'bg-asu-gold text-slate-950 font-black'
                  : hasActivitySubmitted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {!isActivityUnlocked ? (
                <>
                  <Lock className="w-2.5 h-2.5" />
                  <span>مغلق</span>
                </>
              ) : currentStage === 'activity' ? (
                'الحالية'
              ) : hasActivitySubmitted ? (
                'تم التسليم'
              ) : (
                'متاح'
              )}
            </span>
          </button>

          {/* المرحلة 3: اختبار التقويم البنائي (مقفل حتى تسليم النشاط التطبيقي) */}
          <button
            type="button"
            disabled={!isQuizUnlocked}
            onClick={() => isQuizUnlocked && goToStage('quiz')}
            title={!isQuizUnlocked ? 'أكمل تسليم النشاط التطبيقي أولاً لفتح الاختبار' : undefined}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-right transition-all flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 select-none ${
              !isQuizUnlocked
                ? 'bg-slate-100/70 border-slate-200/60 text-slate-400 cursor-not-allowed opacity-75'
                : currentStage === 'quiz'
                ? 'bg-asu-navy text-white border-asu-gold shadow-md ring-2 ring-asu-gold/30 cursor-pointer'
                : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 border-slate-200 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2">
              {!isQuizUnlocked ? (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              ) : (
                <HelpCircle
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    currentStage === 'quiz'
                      ? 'text-asu-gold'
                      : hasQuizCompleted
                      ? 'text-emerald-500'
                      : 'text-slate-500'
                  }`}
                />
              )}
              <span className="text-[11px] sm:text-xs font-black truncate">
                ٣. التقويم البنائي
              </span>
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                !isQuizUnlocked
                  ? 'bg-slate-200 text-slate-500'
                  : currentStage === 'quiz'
                  ? 'bg-asu-gold text-slate-950 font-black'
                  : hasQuizCompleted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {!isQuizUnlocked ? (
                <>
                  <Lock className="w-2.5 h-2.5" />
                  <span>مغلق</span>
                </>
              ) : currentStage === 'quiz' ? (
                'الحالية'
              ) : hasQuizCompleted ? (
                `${quizResult.score}/${quizResult.total}`
              ) : (
                'متاح'
              )}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. المرحلة الأولى: الشرائح التعليمية والدعامات (يخفي النشاط والاختبار)      */}
      {/* ========================================================================= */}
      {currentStage === 'slides' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <ModuleImageSlider
            images={moduleData.images}
            slides={moduleData.slides}
            defaultScaffolding={moduleData.scaffolding}
            moduleTitle={moduleData.title}
            onProceedToActivity={() => {
              setSlidesCompleted(true);
              goToStage('activity');
            }}
            onSlidesCompleted={() => {
              setSlidesCompleted(true);
            }}
          />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. المرحلة الثانية: النشاط التطبيقي (يخفي الشرائح والاختبار)               */}
      {/* ========================================================================= */}
      {currentStage === 'activity' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <ModuleActivityBox
            moduleId={moduleData.id}
            activityTitle={moduleData.activity?.title || 'النشاط التطبيقي للموديول'}
            activityDescription={moduleData.activity?.description || ''}
            activityImageUrl={moduleData.activity?.imageUrl}
            activities={moduleData.activities}
            existingSubmission={existingSubmission}
            isQuizUnlocked={isQuizUnlocked}
            onActivityCompleted={() => {
              setActivityCompleted(true);
            }}
            onProceedToQuiz={() => goToStage('quiz')}
            onBackToSlides={() => goToStage('slides')}
          />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. المرحلة الثالثة: اختبار التقويم البنائي (يخفي الشرائح والنشاط)            */}
      {/* ========================================================================= */}
      {currentStage === 'quiz' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <ModuleQuizBox
            moduleId={moduleData.id}
            moduleOrder={moduleData.order}
            moduleTitle={moduleData.title}
            questions={safeModuleQuestions}
            existingScore={quizResult?.score}
            totalQuestions={quizResult?.total || safeModuleQuestions.length}
            isCompleted={isCompleted}
            nextModuleUrl={nextTargetUrl}
            defaultOpen={true}
            onBackToActivity={() => goToStage('activity')}
            onBackToSlides={() => goToStage('slides')}
          />
        </section>
      )}
    </div>
  );
}
