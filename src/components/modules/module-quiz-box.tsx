'use client';

import React, { useState } from 'react';
import type { Question } from '@/lib/types/database';
import { ExamRunner } from '@/components/exam/exam-runner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface ModuleQuizBoxProps {
  moduleId: string;
  moduleOrder: number;
  moduleTitle: string;
  questions: Question[];
  existingScore?: number | null;
  totalQuestions?: number;
  isCompleted?: boolean;
  nextModuleUrl: string;
}

export function ModuleQuizBox({
  moduleId,
  moduleOrder,
  moduleTitle,
  questions,
  existingScore = null,
  totalQuestions = questions.length,
  isCompleted = false,
  nextModuleUrl,
}: ModuleQuizBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const hasScore = existingScore !== null && existingScore !== undefined;
  const isPassing = hasScore && (existingScore / (totalQuestions || 1)) >= 0.5;

  if (questions.length === 0) {
    return null; // لا توجد أسئلة مضافة بعد من لوحة التحكم لهذا الموديول
  }

  return (
    <Card className="border-2 border-asu-navy/20 shadow-xl bg-white rounded-3xl overflow-hidden text-right">
      <CardHeader className="bg-gradient-to-r from-asu-navy-50 via-white to-asu-gold-50/40 p-5 sm:p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-asu-navy text-white flex items-center justify-center shrink-0 shadow-md">
              <FileQuestion className="w-6 h-6 text-asu-gold-light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="gold" className="text-[10px] sm:text-xs font-bold">
                  التقويم البنائي للوحدة {moduleOrder}
                </Badge>
                {hasScore ? (
                  <Badge variant={isPassing ? 'success' : 'warning'} className="gap-1 text-[10px] sm:text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>الدرجة: {existingScore} / {totalQuestions}</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] sm:text-xs text-slate-500">
                    {questions.length} أسئلة تقويمية
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-asu-navy">
                اختبار التحصيل الذاتي لنهاية {moduleTitle}
              </CardTitle>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {hasScore && !retrying ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setRetrying(true);
                  setIsOpen(true);
                }}
                className="gap-1.5 text-xs border-asu-gold text-slate-700 hover:bg-asu-gold/10"
              >
                <RotateCcw className="w-3.5 h-3.5 text-asu-gold-dark" />
                <span>إعادة الاختبار</span>
              </Button>
            ) : null}

            <Button
              type="button"
              variant={isOpen ? 'ghost' : 'primary'}
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="gap-1 text-xs font-bold"
            >
              <span>{isOpen ? 'إخفاء الاختبار' : hasScore ? 'عرض الأسئلة' : 'بدء الاختبار الآن'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* تفاصيل أو مشغل الاختبار */}
      <CardContent className="p-5 sm:p-6">
        {!isOpen ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-1 text-right">
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {hasScore
                  ? `لقد اجتزت هذا الاختبار بنتيجة ${existingScore} من ${totalQuestions}. يمكنك المتابعة أو إعادة الاختبار لتحسين تحصيلك.`
                  : 'لقد أتممت دراسة محتوى وسلايدات الوحدة، أجب عن أسئلة هذا الاختبار للتأكد من فهمك واستيعابك للهدف التعليمي.'}
              </p>
              <p className="text-xs text-slate-500">
                يحتوي الاختبار على {questions.length} أسئلة متنوعة (اختيار من متعدد وصواب أو خطأ).
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setIsOpen(true)}
              variant="gold"
              className="w-full sm:w-auto shrink-0 font-black text-xs gap-1.5 shadow-md shadow-asu-gold/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hasScore ? 'مراجعة أو إعادة الاختبار' : 'بدء أداء الاختبار الآن'}</span>
            </Button>
          </div>
        ) : (
          <div className="pt-2">
            <ExamRunner
              examType={`module_${moduleId}`}
              examTitle={`اختبار نهاية ${moduleTitle}`}
              questions={questions}
              onCompleteRedirectUrl={nextModuleUrl}
              passingScorePercent={50}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
