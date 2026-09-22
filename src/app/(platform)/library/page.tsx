import { getLibraryVideos } from '@/lib/actions/library.actions';
import { VideoGallery } from '@/components/library/video-gallery';
import { Video, Film, Sparkles, BookOpen, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export const dynamic = 'force-dynamic';

export default async function EnrichmentLibraryPage() {
  const videos = await getLibraryVideos();

  return (
    <div className="space-y-8 text-right max-w-6xl mx-auto">
      {/* البانر الملكي للمكتبة المرئية الإثرائية */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-asu-navy-dark via-asu-navy to-[#1a285d] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-asu-gold/20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-asu-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-asu-gold/20 text-asu-gold-light border border-asu-gold/40 text-xs px-3 py-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 ml-1.5 inline" />
                المكتبة الرقمية الإثرائية
              </Badge>
              <Badge className="bg-red-600/20 text-red-200 border border-red-500/30 text-xs px-2.5 py-0.5">
                <YoutubeIcon className="w-3.5 h-3.5 ml-1 inline text-red-400" />
                فيديوهات يوتيوب تفاعلية
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              المكتبة المرئية لتنمية <span className="text-asu-gold-light">الوعي بقضايا البيئة</span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
              مجموعة منتقاة بعناية من أفضل الفيديوهات والمحاضرات العلمية الموثوقة حول النظم البيئية،
              التغير المناخي، الاستدامة، وحماية الموارد الطبيعية لجامعة عين شمس.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 shrink-0 self-stretch sm:self-auto justify-center">
            <div className="w-12 h-12 rounded-xl bg-asu-gold text-slate-900 flex items-center justify-center font-black text-lg shadow-md">
              {videos.length}
            </div>
            <div className="text-right">
              <span className="block text-xs font-bold text-white">فيديو تعليمي معتمد</span>
              <span className="block text-[11px] text-slate-300">متاح للمشاهدة المباشرة</span>
            </div>
          </div>
        </div>
      </section>

      {/* معرض الفيديوهات التفاعلي */}
      <VideoGallery videos={videos} />
    </div>
  );
}
