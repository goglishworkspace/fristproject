'use client';

import { useState } from 'react';
import { Play, Search, X, ExternalLink, Clock, Tag, Film, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { LibraryVideo } from '@/lib/actions/library.actions';

interface VideoGalleryProps {
  videos: LibraryVideo[];
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<LibraryVideo | null>(null);

  // استخراج الفئات المتاحة
  const categories = ['الكل', ...Array.from(new Set(videos.map((v) => v.category).filter(Boolean)))];

  // تصفية الفيديوهات حسب الفئة والبحث
  const filteredVideos = videos.filter((video) => {
    const matchesCategory =
      selectedCategory === 'الكل' || !video.category || video.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 text-right">
      {/* شريط البحث وتصنيفات الفيديو */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* أزرار الفئات إذا وُجدت */}
        {categories.length > 2 ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  selectedCategory === cat
                    ? 'bg-asu-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-asu-gold-dark" />
            <span>فيديوهات إثرائية وتوعوية</span>
          </div>
        )}

        {/* حقل البحث السريع */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث في مكتبة الفيديوهات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-asu-navy/20 focus:border-asu-navy transition-all"
          />
        </div>
      </div>

      {/* شبكة الفيديوهات الملكية (Royal Video Grid) */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200/80 hover:border-asu-gold/50 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* صورة الغلاف المصغرة مع زر التشغيل */}
                <div
                  onClick={() => setActiveVideo(video)}
                  className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer select-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* تدرج لوني خفيف على الغلاف */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* زر تشغيل اليوتيوب المميز بالهوية الملكية */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-13 h-13 rounded-2xl bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-red-600 transition-all border-2 border-white/80">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* مدة الفيديو وشارة التصنيف إذا وُجدت */}
                  {(video.duration || video.category) && (
                    <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] text-white">
                      {video.duration ? (
                        <span className="px-2 py-0.5 rounded-md bg-black/70 font-mono font-bold backdrop-blur-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{video.duration}</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      {video.category && (
                        <span className="px-2 py-0.5 rounded-md bg-asu-navy/80 text-asu-gold-light font-bold backdrop-blur-xs border border-asu-gold/30 text-[10px]">
                          {video.category}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* محتوى وتفاصيل الفيديو */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <h3
                    onClick={() => setActiveVideo(video)}
                    className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-asu-navy leading-snug line-clamp-2 cursor-pointer transition-colors"
                  >
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {video.description}
                  </p>
                </div>
              </div>

              {/* أزرار الإجراءات في أسفل البطاقة */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100/80 mt-2 flex items-center justify-between">
                <Button
                  onClick={() => setActiveVideo(video)}
                  variant="primary"
                  size="sm"
                  className="w-full gap-1.5 text-xs font-bold shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>مشاهدة الفيديو داخل المنصة</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Film className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base">لا توجد نتائج مطابقة لبحثك</p>
          <p className="text-xs">جرب اختيار تصنيف آخر أو تفريغ حقل البحث</p>
        </div>
      )}

      {/* نافذة تشغيل الفيديو المنبثقة (Video Modal Player) */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-asu-gold/30">
            {/* شريط رأس النافذة */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-900 border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors mr-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في YouTube</span>
                </a>
              </div>

              <div className="text-right">
                <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                  {activeVideo.title}
                </h4>
                <span className="text-[10px] text-asu-gold-light">{activeVideo.category}</span>
              </div>
            </div>

            {/* مشغل يوتيوب المدمج (Iframe) */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* وصف الفيديو أسفل المشغل */}
            <div className="p-4 bg-slate-900/90 text-right text-xs text-slate-300">
              <p className="leading-relaxed">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
