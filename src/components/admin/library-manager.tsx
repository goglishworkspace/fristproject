'use client';

import { useActionState, useState } from 'react';
import { addLibraryVideoAction, deleteLibraryVideoAction, type LibraryVideo } from '@/lib/actions/library.actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, ExternalLink, Film, CheckCircle2, AlertCircle } from 'lucide-react';

function YoutubeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface LibraryManagerProps {
  initialVideos: LibraryVideo[];
}

export function LibraryManager({ initialVideos }: LibraryManagerProps) {
  const [state, formAction, isPending] = useActionState(addLibraryVideoAction, null);
  const [videos, setVideos] = useState<LibraryVideo[]>(initialVideos);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الفيديو من المكتبة؟')) return;
    setDeletingId(id);
    const res = await deleteLibraryVideoAction(id);
    if (res.success) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } else {
      alert('حدث خطأ أثناء محاولة حذف الفيديو');
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 text-right">
      {/* 1. نموذج إضافة فيديو يوتيوب جديد */}
      <Card className="border-asu-gold/30 bg-white shadow-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <YoutubeIcon className="w-6 h-6" />
            </div>
            <div className="text-right">
              <CardTitle className="text-lg font-black text-asu-navy">
                إضافة فيديو يوتيوب جديد للمكتبة الإثرائية
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                يمكنك إدخال أي رابط فيديو من YouTube وسيتم استخراج المعرف والغلاف تلقائياً
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {state?.success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تمت إضافة الفيديو بنجاح إلى المكتبة الإثرائية!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="عنوان الفيديو *"
                name="title"
                placeholder="مثال: النظم البيئية وأثرها على التنوع الحيوي"
                required
                disabled={isPending}
              />

              <Input
                label="رابط فيديو اليوتيوب (URL) *"
                name="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="block text-sm font-medium text-slate-700">نبذة وصفية عن محتوى الفيديو (اختياري)</label>
              <textarea
                name="description"
                rows={2}
                placeholder="اكتب نبذة مختصرة تشرح أهم النقاط التي يناقشها الفيديو لمساعدة الطلاب..."
                disabled={isPending}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy/30 focus:border-asu-navy"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={isPending}
              className="gap-2 font-bold w-full sm:w-auto shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isPending ? 'جاري إضافة الفيديو...' : 'إضافة الفيديو للمكتبة الآن'}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. جدول الفيديوهات الموجودة حالياً بالمكتبة */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
              إجمالي: {videos.length} فيديو
            </span>
            <CardTitle className="text-base font-bold text-slate-900">
              الفيديوهات المعتمدة حالياً في المكتبة
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                      {vid.title}
                    </p>
                    {(vid.category || vid.duration) && (
                      <div className="flex items-center gap-2 mt-1">
                        {vid.category && (
                          <span className="text-[10px] font-bold text-asu-navy bg-asu-navy-50 px-2 py-0.5 rounded">
                            {vid.category}
                          </span>
                        )}
                        {vid.duration && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {vid.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="فتح في يوتيوب"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Button
                    onClick={() => handleDelete(vid.id)}
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === vid.id}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5 gap-1 text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
