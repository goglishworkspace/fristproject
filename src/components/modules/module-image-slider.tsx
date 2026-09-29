'use client';

import React, { useState, useRef } from 'react';
import type { ModuleSlide, ScaffoldingItem } from '@/lib/types/database';
import { ModuleScaffoldingBox } from '@/components/modules/module-scaffolding-box';
import {
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
  children?: React.ReactNode;
  onProceedToActivity?: () => void;
  onSlidesCompleted?: () => void;
}

export function ModuleImageSlider({
  images = [],
  slides = [],
  moduleTitle,
  defaultScaffolding,
  children,
  onProceedToActivity,
  onSlidesCompleted,
}: ModuleImageSliderProps) {
  const resolvedSlides: ModuleSlide[] = React.useMemo(() => {
    if (slides && slides.length > 0) {
      return slides;
    }
    if (images && images.length > 0) {
      return images.map((url, idx) => ({
        id: `slide-${idx + 1}`,
        imageUrl: url,
        title: idx === 0 ? '0' : `الشريحة ${idx}`,
        scaffolding: idx === 0 ? undefined : defaultScaffolding,
      }));
    }
    return [];
  }, [slides, images, defaultScaffolding]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // مراجع للتمرير التلقائي لمركز الزر النشط في شريط الأرقام وشريط المعاينة
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  const numbersContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbsContainerRef = useRef<HTMLDivElement | null>(null);

  // تمرير تلقائي وسلس لرقم الشريحة النشطة بمجرد التقدم بالتالي أو السابق
  React.useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  // دعم السحب والإيماءات باللمس لشاشات الموبايل (Touch Swipe Gestures)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = resolvedSlides.length;

  const goToIndex = (newIdx: number) => {
    setCurrentIndex(newIdx);
    if (newIdx >= total - 1 && onSlidesCompleted) {
      onSlidesCompleted();
    }
  };

  const isAtLastSlide = total > 0 && currentIndex === total - 1;

  if (resolvedSlides.length === 0) {
    return null;
  }

  const currentSlide = resolvedSlides[currentIndex] || resolvedSlides[0];
  const currentImage = currentSlide.imageUrl;
  const currentScaffolding = currentSlide.scaffolding;

  // أول صورة (شريحة الغلاف) لا تحتوي أبداً على المساعدة والدعامات
  const isCoverSlide = currentIndex === 0 || currentSlide.id === 'slide-cover';

  const hasScaffolding = !isCoverSlide && !!(
    currentScaffolding &&
    Object.values(currentScaffolding).some((v) => typeof v === 'string' && v.trim().length > 0)
  );

  const handlePrev = () => {
    goToIndex(currentIndex === 0 ? total - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex === total - 1) {
      if (onProceedToActivity) {
        onProceedToActivity();
      }
      return;
    }
    goToIndex(currentIndex + 1);
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
    if (isLeftSwipe) {
      if (currentIndex < total - 1) {
        handleNext();
      } else if (currentIndex === total - 1 && onProceedToActivity) {
        onProceedToActivity();
      }
    } else if (isRightSwipe && currentIndex > 0) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slideDisplayName = isCoverSlide
    ? '0'
    : currentSlide.title
      ? currentSlide.title.replace(/^الشريحة\s*/, '')
      : `${currentIndex}`;

  return (
    <div className="w-full space-y-6 text-right select-none">
      {/* ========================================================================= */}
      {/* 1. إطار الشريحة التعليمية بالكامل بعرض الصفحة بنسبة 16:9 قياسية               */}
      {/* ========================================================================= */}
      <div className="w-full space-y-4">
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border-2 border-asu-gold/40 shadow-xl group touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full aspect-video flex items-center justify-center bg-slate-900 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={`${moduleTitle || 'شريحة المحتوى'} - ${slideDisplayName}`}
              className="w-full h-full object-contain cursor-pointer transition-transform duration-300"
              onClick={() => setIsFullscreen(true)}
              loading="eager"
            />
          </div>

          {/* شريط المعلومات العلوي فوق الشريحة */}
          <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 sm:py-1.5 rounded-full border border-asu-gold/40 text-white text-[11px] sm:text-xs font-bold pointer-events-auto shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-asu-gold-light" />
              <span>
                {slideDisplayName} ({currentIndex + 1} من {total})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-black/75 backdrop-blur-md text-white hover:text-asu-gold-light active:bg-black/90 border border-white/20 transition-all cursor-pointer pointer-events-auto shadow-md active:scale-90"
              title="تكبير بحجم الشاشة الكاملة"
              aria-label="تكبير الشريحة"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* مؤشر توجيهي للسحب على الموبايل */}
          <div className="sm:hidden absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
            <span className="bg-black/60 text-[10px] text-slate-300 px-3 py-0.5 rounded-full backdrop-blur-xs">
              اسحب يميناً أو يساراً للتنقل بين الشرائح
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. شريط أزرار التنقل والترقيم أسفل الصورة مباشرة                          */}
        {/* ========================================================================= */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-2">
          {/* زر السابق */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`h-11 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer select-none touch-manipulation active:scale-95 shrink-0 ${
              currentIndex === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 opacity-60'
                : 'bg-slate-800 hover:bg-asu-navy text-white shadow-xs'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          {/* أزرار أرقام الشرائح التفاعلية */}
          <div
            ref={numbersContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scroll-smooth no-scrollbar max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-xl"
          >
            {resolvedSlides.map((slide, idx) => {
              const isActive = currentIndex === idx;
              const isCover = idx === 0 && (slide.id.includes('cover') || idx === 0);
              const label = isCover ? '0' : `${idx}`;

              return (
                <button
                  key={idx}
                  ref={isActive ? activeBtnRef : null}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer select-none touch-manipulation active:scale-90 ${
                    isActive
                      ? 'bg-asu-navy text-asu-gold shadow-md border border-asu-gold/50 font-black scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                  title={`انتقال إلى ${label}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* زر التالي أو زر الانتقال للنشاط عند آخر شريحة */}
          {isAtLastSlide ? (
            <button
              type="button"
              onClick={handleNext}
              className="h-11 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer select-none touch-manipulation active:scale-95 shrink-0 bg-gradient-to-r from-asu-gold to-amber-500 hover:from-amber-500 hover:to-asu-gold text-slate-950 shadow-md shadow-asu-gold/30 hover:scale-[1.02]"
              title="الانتقال إلى النشاط"
            >
              <span>الانتقال للنشاط</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="h-11 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer select-none touch-manipulation active:scale-95 shrink-0 bg-asu-navy hover:bg-asu-navy-light text-white shadow-xs"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. صندوق المساعدة والدعامات (يظهر تحت الصورة فقط من الشريحة ١ وما بعدها)      */}
      {/* ========================================================================= */}
      {hasScaffolding && (
        <div className="w-full transition-all duration-300 animate-in fade-in">
          <ModuleScaffoldingBox
            scaffolding={currentScaffolding}
            className="w-full"
            title={`المساعدة والدعامات – ${slideDisplayName}`}
          />
        </div>
      )}

      {/* زر خاص بشريحة الغلاف لبدء التعلم والانتقال للشريحة الأولى */}
      {isCoverSlide && total > 1 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-asu-navy to-[#1a2d6d] hover:from-[#132454] hover:to-asu-navy text-white font-black text-sm sm:text-base shadow-lg shadow-asu-navy/25 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>بدء دراسة محتوى الموديول (1)</span>
            <ArrowLeft className="w-5 h-5 mr-1" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. شريط الصور المصغرة السريع في الأسفل                                      */}
      {/* ========================================================================= */}
      {total > 1 && (
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-black text-slate-700">
            <LayoutGrid className="w-4 h-4 text-asu-gold-dark" />
            <span>معاينة الصور ({total} صورة)</span>
          </div>
          <div
            ref={thumbsContainerRef}
            className="flex items-center gap-3 overflow-x-auto py-1 px-1 scroll-smooth no-scrollbar"
          >
            {resolvedSlides.map((slide, idx) => {
              const isCover = idx === 0 && (slide.id.includes('cover') || idx === 0);
              const label = isCover ? '0' : `${idx}`;

              return (
                <button
                  key={idx}
                  ref={currentIndex === idx ? activeThumbRef : null}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`relative shrink-0 w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer select-none active:scale-95 ${
                    currentIndex === idx
                      ? 'border-asu-gold shadow-md scale-105 ring-2 ring-asu-gold/40'
                      : 'border-slate-200/90 opacity-75 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/75 text-[9px] font-bold text-white px-1.5 py-0.5 rounded font-mono">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {children}

      {/* ========================================================================= */}
      {/* 6. نافذة ملء الشاشة للتكبير وفحص الخرائط                                    */}
      {/* ========================================================================= */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <span className="text-asu-gold-light">{moduleTitle}</span>
              <span>•</span>
              <span>{slideDisplayName}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all"
              aria-label="إغلاق التكبير"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={slideDisplayName}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              السابق
            </button>
            <span className="text-xs text-slate-300 font-mono">
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === total - 1}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
