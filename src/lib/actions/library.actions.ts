'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';

export interface LibraryVideo {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  category: string;
  duration: string;
  addedAt: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'library-videos.json');

// استخراج معرّف فيديو اليوتيوب من أي رابط (Standard, Shortened, Embed, etc.)
export async function extractYouTubeId(url: string): Promise<string | null> {
  if (!url) return null;
  const trimmed = url.trim();

  // إذا كان المستخدم أدخل الـ ID مباشرة (11 حرفاً)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // روابط مثل: https://www.youtube.com/watch?v=XXXXX
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  return null;
}

// جلب قائمة الفيديوهات
export async function getLibraryVideos(): Promise<LibraryVideo[]> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('library_videos')
        .select('*')
        .order('added_at', { ascending: false });

      if (!error && data) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          youtubeUrl: item.youtube_url,
          youtubeId: item.youtube_id,
          category: item.category,
          duration: item.duration,
          addedAt: item.added_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase getLibraryVideos failed, falling back to JSON:', err);
    }
  }

  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading library videos:', error);
    return [];
  }
}

// إضافة فيديو يوتيوب جديد من لوحة تحكم المشرف
export async function addLibraryVideoAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const title = (formData.get('title') as string)?.trim();
  const youtubeUrl = (formData.get('youtubeUrl') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || '';
  const duration = (formData.get('duration') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';

  if (!title || !youtubeUrl) {
    return { error: 'يرجى إدخال عنوان الفيديو ورابط اليوتيوب' };
  }

  const youtubeId = await extractYouTubeId(youtubeUrl);
  if (!youtubeId) {
    return { error: 'رابط اليوتيوب غير صحيح، يرجى التأكد من الرابط (مثال: https://www.youtube.com/watch?v=...)' };
  }

  const newVideo: LibraryVideo = {
    id: `vid-${Date.now()}`,
    title,
    description: description || 'محتوى مرئي إثرائي حول قضايا البيئة والتنمية المستدامة.',
    youtubeUrl,
    youtubeId,
    category,
    duration,
    addedAt: new Date().toISOString().split('T')[0],
  };

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('library_videos').insert({
        id: newVideo.id,
        title: newVideo.title,
        description: newVideo.description,
        youtube_url: newVideo.youtubeUrl,
        youtube_id: newVideo.youtubeId,
        category: newVideo.category,
        duration: newVideo.duration,
        added_at: newVideo.addedAt,
      });

      if (error) {
        console.error('Supabase add video error:', error);
      } else {
        revalidatePath('/library');
        revalidatePath('/admin/dashboard');
        return { success: true };
      }
    } catch (err) {
      console.error('Supabase add video exception:', err);
    }
  }

  try {
    const currentVideos = await getLibraryVideos();
    const updatedVideos = [newVideo, ...currentVideos.filter((v) => v.id !== newVideo.id)];
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedVideos, null, 2), 'utf-8');

    revalidatePath('/library');
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Failed to save library video:', error);
    return { error: 'حدث خطأ أثناء حفظ الفيديو في قاعدة البيانات' };
  }
}

// حذف فيديو من المكتبة (للمشرف)
export async function deleteLibraryVideoAction(videoId: string): Promise<{ success: boolean; error?: string }> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('library_videos')
        .delete()
        .eq('id', videoId);

      if (error) {
        console.error('Supabase delete video error:', error);
        return { success: false, error: error.message };
      }

      revalidatePath('/library');
      revalidatePath('/admin/dashboard');
      return { success: true };
    } catch (err: unknown) {
      console.error('Supabase delete video exception:', err);
      const msg = err instanceof Error ? err.message : 'فشل حذف الفيديو من قاعدة البيانات';
      return { success: false, error: msg };
    }
  }

  try {
    const currentVideos = await getLibraryVideos();
    const updated = currentVideos.filter((v) => v.id !== videoId);
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');

    revalidatePath('/library');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Failed to delete video locally:', err);
    return { success: false, error: 'فشل حذف الفيديو محلياً' };
  }
}
