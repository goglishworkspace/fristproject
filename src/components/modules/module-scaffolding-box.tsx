'use client';

import React from 'react';
import type { ScaffoldingItem } from '@/lib/types/database';
import {
  Lightbulb,
  Info,
  FileText,
  HelpCircle,
  Sparkles,
  Compass,
} from 'lucide-react';

interface ModuleScaffoldingBoxProps {
  scaffolding?: ScaffoldingItem;
  className?: string;
  title?: string;
}

export function ModuleScaffoldingBox({
  scaffolding,
  className = '',
  title = 'المساعدة والدعامات',
}: ModuleScaffoldingBoxProps) {
  const hint =
    scaffolding?.hint ||
    'تأمل تأثير البيئة على الإنسان في صحته، مزاجه، وسعادته اليومية.';
  const extraInfo =
    scaffolding?.extraInfo ||
    'الإنسان يعتمد على البيئة في الغذاء، الهواء النقي، الماء النظيف، والمسكن.';
  const example =
    scaffolding?.example ||
    'العيش في بيئة نظيفة خضراء يساعد على تقليل التوتر وزيادة التركيز والإنتاجية.';
  const selfQuestion =
    scaffolding?.selfQuestion ||
    'كيف تحس عندما تكون في مكان نظيف وجميل؟ وماذا يحدث لك في مكان مزدحم وملوث؟';

  return (
    <div
      className={`rounded-3xl border-2 border-slate-200/90 bg-slate-50/70 shadow-lg overflow-hidden flex flex-col select-none transition-all duration-300 text-right ${className}`}
    >
      {/* الترويسة العلوية للصندوق */}
      <div className="bg-gradient-to-r from-slate-900 via-asu-navy to-[#182660] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-black text-xs sm:text-sm tracking-wide text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-asu-gold-light font-bold bg-white/10 px-2 py-0.5 rounded-full border border-asu-gold/30">
          <Sparkles className="w-3 h-3 text-asu-gold" />
          <span>إرشاد تعليمي</span>
        </div>
      </div>

      {/* البطاقات الأربع (تلميح، معلومة إضافية، مثال، اسأل نفسك) */}
      <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
        {/* 1. بطاقة تلميح */}
        <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800">تلميح</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
            {hint}
          </p>
        </div>

        {/* 2. بطاقة معلومة إضافية */}
        <div className="p-3.5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-rose-600">معلومة إضافية</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
            {extraInfo}
          </p>
        </div>

        {/* 3. بطاقة مثال */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800">مثال</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
            {example}
          </p>
        </div>

        {/* 4. بطاقة اسأل نفسك */}
        <div className="p-3.5 rounded-2xl bg-white border border-sky-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-sky-700">اسأل نفسك</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
            {selfQuestion}
          </p>
        </div>
      </div>
    </div>
  );
}
