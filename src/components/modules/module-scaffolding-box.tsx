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
  MapPin,
  Search,
  Navigation,
  Brain,
  Eye,
  Scale,
  Link as LinkIcon,
  Puzzle,
  CheckCircle2,
} from 'lucide-react';

interface ModuleScaffoldingBoxProps {
  scaffolding?: ScaffoldingItem;
  className?: string;
  title?: string;
}

export function ModuleScaffoldingBox({
  scaffolding,
  className = '',
  title = 'الدعامات التعليمية الإلكترونية',
}: ModuleScaffoldingBoxProps) {
  if (!scaffolding) {
    return null;
  }

  const hasCards =
    scaffolding.hint ||
    scaffolding.extraInfo ||
    scaffolding.example ||
    scaffolding.selfQuestion ||
    scaffolding.mapRead ||
    scaffolding.patternDiscover ||
    scaffolding.spatialRelate ||
    scaffolding.infer ||
    scaffolding.spatialThink ||
    scaffolding.observe ||
    scaffolding.compare ||
    scaffolding.trackRelation ||
    scaffolding.distinguishEffect ||
    scaffolding.causeEffect ||
    scaffolding.deepThink;

  if (!hasCards) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 bg-white shadow-md overflow-hidden flex flex-col select-none transition-all duration-300 text-right ${className}`}
    >
      {/* الترويسة العلوية للصندوق */}
      <div className="bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-asu-gold/20 border border-asu-gold/40 flex items-center justify-center text-asu-gold-light shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-black text-xs sm:text-sm tracking-wide text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-asu-gold-light font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-asu-gold/30">
          <Sparkles className="w-3 h-3 text-asu-gold" />
          <span>إرشاد ودعامات</span>
        </div>
      </div>

      {/* بطاقات المساعدة والدعامات بنظام شبكي متسع بعرض الصفحة */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. بطاقة تلميح */}
        {scaffolding.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-900">💡 تلميح</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.hint}
            </p>
          </div>
        )}

        {/* 2. بطاقة معلومة إضافية */}
        {scaffolding.extraInfo && (
          <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-orange-900">🟠 معلومة إضافية</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Info className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.extraInfo}
            </p>
          </div>
        )}

        {/* 3. بطاقة مثال */}
        {scaffolding.example && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">📄 مثال</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.example}
            </p>
          </div>
        )}

        {/* 4. بطاقة اسأل نفسك */}
        {scaffolding.selfQuestion && (
          <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-sky-900">❓ اسأل نفسك</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.selfQuestion}
            </p>
          </div>
        )}

        {/* 5. بطاقة اقرأ الخريطة / تأمل المشهد (التفكير المكاني) */}
        {scaffolding.mapRead && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-900">🗺️ اقرأ الخريطة / تأمل المشهد</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.mapRead}
            </p>
          </div>
        )}

        {/* 6. بطاقة اكتشف النمط */}
        {scaffolding.patternDiscover && (
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-300/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-950">🔎 اكتشف النمط</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                <Search className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.patternDiscover}
            </p>
          </div>
        )}

        {/* 7. بطاقة اربط بالمكان */}
        {scaffolding.spatialRelate && (
          <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-teal-900">🧭 اربط بالمكان</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                <Navigation className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.spatialRelate}
            </p>
          </div>
        )}

        {/* 8. بطاقة استنتج */}
        {scaffolding.infer && (
          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-900">🧠 استنتج</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Brain className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.infer}
            </p>
          </div>
        )}

        {/* 9. بطاقة فكّر مكانيًا */}
        {scaffolding.spatialThink && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-900">🗺️ فكّر مكانيًا</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Compass className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.spatialThink}
            </p>
          </div>
        )}

        {/* 10. بطاقة لاحظ */}
        {scaffolding.observe && (
          <div className="p-3.5 rounded-2xl bg-cyan-50/50 border border-cyan-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-cyan-900">🔍 لاحظ</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.observe}
            </p>
          </div>
        )}

        {/* 11. بطاقة قارن */}
        {scaffolding.compare && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-900">🔄 قارن</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Scale className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.compare}
            </p>
          </div>
        )}

        {/* 12. بطاقة تتبّع العلاقة */}
        {scaffolding.trackRelation && (
          <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-sky-900">🔗 تتبّع العلاقة</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.trackRelation}
            </p>
          </div>
        )}

        {/* 13. بطاقة ميّز التأثير */}
        {scaffolding.distinguishEffect && (
          <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-teal-900">🟢 ميّز التأثير</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.distinguishEffect}
            </p>
          </div>
        )}

        {/* 14. بطاقة اربط الأسباب بالنتائج */}
        {scaffolding.causeEffect && (
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-900">🧩 اربط الأسباب بالنتائج</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Puzzle className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.causeEffect}
            </p>
          </div>
        )}

        {/* 15. بطاقة فكّر بعمق */}
        {scaffolding.deepThink && (
          <div className="p-3.5 rounded-2xl bg-violet-50/50 border border-violet-200/80 shadow-2xs hover:shadow-xs transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-violet-900">🤔 فكّر بعمق</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                <Brain className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {scaffolding.deepThink}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
