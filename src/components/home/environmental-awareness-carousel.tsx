'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Pause, Play } from 'lucide-react';

interface SlideItem {
  id: number;
  url: string;
  alt: string;
  badge?: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/makcnu5x/image/upload/v1790622067/Max_a_A_modern__stunning__.png',
    alt: 'تنمية الوعي بقضايا البيئة - الاستدامة والطاقة المتجددة',
    badge: 'تصميم ثلاثي الأبعاد • رؤية بيئية متكاملة',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/makcnu5x/image/upload/v1790622067/Max_a_A_cinematic_wide_16_.png',
    alt: 'تنمية الوعي بقضايا البيئة - حماية الطبيعة والموارد',
    badge: 'مشهد سينمائي • الحفاظ على الموارد الحيوية',
  },
];

interface CarouselProps {
  slides?: SlideItem[];
  intervalMs?: number;
}

export function EnvironmentalAwarenessCarousel({
  slides = DEFAULT_SLIDES,
  intervalMs = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // التبديل التلقائي الدوري بين الصور
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, intervalMs, nextSlide, slides.length]);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-xl group transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="معرض صور تنمية الوعي بقضايا البيئة"
    >
      {/* إطار الصور ذو التبديل الناعم (Smooth Crossfade) */}
      <div className="relative w-full aspect-[16/9] max-h-[640px] overflow-hidden bg-slate-900">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 pointer-events-auto z-10'
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.url}
                alt={slide.alt}
                className="w-full h-full object-cover sm:object-contain bg-slate-950"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* تأثير تدرج خفيف في الأسفل لإبراز المؤشرات */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

              {/* شارة وصف الصورة */}
              {slide.badge && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-black/50 text-white backdrop-blur-md border border-white/20 shadow-md">
                    <Sparkles className="w-3 h-3 text-asu-gold" />
                    <span>{slide.badge}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* أزرار التنقل اليدوي (السابق والتالي) */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-all hover:scale-110 active:scale-95 touch-manipulation"
        aria-label="الصورة السابقة"
        title="الصورة السابقة"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-all hover:scale-110 active:scale-95 touch-manipulation"
        aria-label="الصورة التالية"
        title="الصورة التالية"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* الشريط السفلي للتحكم والنقاط التفاعلية */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-6 pointer-events-none">
        {/* زر الإيقاف والتشغيل المؤقت */}
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="pointer-events-auto p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 cursor-pointer transition-colors"
          title={isPaused ? 'تشغيل التبديل التلقائي' : 'إيقاف التبديل التلقائي مؤقتاً'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* نقاط التنقل (Indicators) */}
        <div className="flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-7 sm:w-8 h-2.5 bg-gradient-to-r from-asu-gold to-amber-300 shadow-sm'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/90'
                }`}
                aria-label={`الانتقال إلى الصورة رقم ${idx + 1}`}
                title={`الصورة رقم ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* عداد الصور */}
        <div className="text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 font-mono">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}
