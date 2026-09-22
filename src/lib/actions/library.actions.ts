'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

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

  try {
    const currentVideos = await getLibraryVideos();

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

    const updatedVideos = [newVideo, ...currentVideos];

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
export async function deleteLibraryVideoAction(videoId: string): Promise<{ success: boolean }> {
  try {
    const currentVideos = await getLibraryVideos();
    const updated = currentVideos.filter((v) => v.id !== videoId);
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');

    revalidatePath('/library');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Failed to delete video:', err);
    return { success: false };
  }
}
