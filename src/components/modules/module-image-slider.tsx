'use client';

import React, { useState, useRef } from 'react';
import type { ModuleSlide, ScaffoldingItem } from '@/lib/types/database';
import { ModuleScaffoldingBox } from '@/components/modules/module-scaffolding-box';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
} from 'lucide-react';

interface ModuleImageSliderProps {
  images?: string[];
  slides?: ModuleSlide[];
  moduleTitle?: string;
  defaultScaffolding?: ScaffoldingItem;
}

export function ModuleImageSlider({
  images = [],
  slides = [],
  moduleTitle,
  defaultScaffolding,
}: ModuleImageSliderProps) {
  const resolvedSlides: ModuleSlide[] = React.useMemo(() => {
    if (slides && slides.length > 0) {
      return slides;
    }
    if (images && images.length > 0) {
      return images.map((url, idx) => ({
        id: `slide-${idx + 1}`,
        imageUrl: url,
        title: `الشريحة ${idx + 1}`,
        scaffolding: defaultScaffolding,
      }));
    }
    return [];
  }, [slides, images, defaultScaffolding]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // دعم السحب والإيماءات باللمس لشاشات الموبايل (Touch Swipe Gestures)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (resolvedSlides.length === 0) {
    return null;
  }

  const currentSlide = resolvedSlides[currentIndex] || resolvedSlides[0];
  const currentImage = currentSlide.imageUrl;
  const currentScaffolding = currentSlide.scaffolding || defaultScaffolding;
  const total = resolvedSlides.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  // معالجة اللمس بالسحب
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    // في الاتجاه العربي: السحب لليسار يعني التالي، والسحب لليمين يعني السابق
    if (isLeftSwipe && currentIndex < total - 1) {
      handleNext();
    } else if (isRightSwipe && currentIndex > 0) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch select-none">
        {/* ========================================================================= */}
        {/* 1. الجانب الرئيسي: الشريحة التعليمية                                        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-3.5">
          {/* إطار الصورة الملكي مع دعم السحب باللمس */}
          <div
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border-2 border-asu-gold/40 shadow-xl group touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] lg:h-[500px] flex items-center justify-center bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${moduleTitle || 'شريحة المحتوى'} - ${currentIndex + 1}`}
                className="w-full h-full object-contain cursor-pointer transition-transform duration-300"
                onClick={() => setIsFullscreen(true)}
                loading="eager"
              />
            </div>

            {/* شريط المعلومات العلوي */}
            <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 sm:py-1.5 rounded-full border border-asu-gold/40 text-white text-[10px] sm:text-xs font-bold pointer-events-auto shadow-md">
                <Sparkles className="w-3 h-3 text-asu-gold-light" />
                <span>شريحة {currentIndex + 1} من {total}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-2 sm:p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-asu-gold-light active:bg-black/90 border border-white/20 transition-all cursor-pointer pointer-events-auto shadow-md active:scale-90"
                title="تكبير بحجم الشاشة"
                aria-label="تكبير الشريحة"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* مؤشر توجيهي للسحب على الموبايل */}
            <div className="sm:hidden absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
              <span className="bg-black/60 text-[10px] text-slate-300 px-3 py-0.5 rounded-full backdrop-blur-xs">
                اسحب يميناً أو يساراً للتقليب
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* شريط التحكم السفلي: متجاوب 100% مع شاشات الهواتف والأصابع                 */}
          {/* ========================================================================= */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between gap-2 text-right">
            {/* زر السابق */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`h-11 px-3.5 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer select-none touch-manipulation active:scale-95 shrink-0 ${
                currentIndex === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 opacity-60'
                  : 'bg-slate-800 hover:bg-asu-navy text-white shadow-xs'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {/* شريط دوائر الترقيم التفاعلية */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 no-scrollbar max-w-[190px] sm:max-w-xs md:max-w-md">
              {resolvedSlides.map((_, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`min-w-8 h-8 sm:min-w-9 sm:h-9 rounded-full font-mono text-xs font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer select-none touch-manipulation active:scale-90 ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600/40 scale-105 font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                    title={`انتقال للشريحة رقم ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* زر التالي */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === total - 1}
              className={`h-11 px-3.5 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer select-none touch-manipulation active:scale-95 shrink-0 ${
                currentIndex === total - 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 opacity-60'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. الجانب الأيسر: صندوق الدعامات والمساعدة                                  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col">
          <ModuleScaffoldingBox
            scaffolding={currentScaffolding}
            className="h-full"
            title="المساعدة والدعامات"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. شريط الصور المصغرة السريع في الأسفل                                      */}
      {/* ========================================================================= */}
      {total > 1 && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-600">
            <LayoutGrid className="w-4 h-4 text-asu-gold-dark" />
            <span>معاينة الشرائح ({total} شرائح)</span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 no-scrollbar">
            {resolvedSlides.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer select-none active:scale-95 ${
                  currentIndex === idx
                    ? 'border-asu-gold shadow-md scale-105 ring-2 ring-asu-gold/40'
                    : 'border-slate-200/80 opacity-70 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.imageUrl}
                  alt={`شريحة ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-bold text-white px-1.5 rounded font-mono">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. نافذة العرض بكامل الشاشة (Fullscreen Lightbox)                         */}
      {/* ========================================================================= */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-all cursor-pointer"
                aria-label="السابق"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-all cursor-pointer"
                aria-label="التالي"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt="العرض بالحجم الكامل"
              className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
            <p className="text-white/80 text-xs font-bold mt-4 font-mono">
              شريحة {currentIndex + 1} من {total}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
