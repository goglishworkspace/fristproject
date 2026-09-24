'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ModuleData } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { assertAdmin } from '@/lib/auth/session';

const MODULES_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'modules.json');

// 1. قراءة قائمة الموديولات من ملف JSON الدائم
export async function getModulesListAction(): Promise<ModuleData[]> {
  try {
    const data = await fs.readFile(MODULES_FILE_PATH, 'utf-8');
    const modules: ModuleData[] = JSON.parse(data);
    // ترتيب الموديولات حسب order
    return modules.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error('Error reading modules.json:', err);
    return [];
  }
}

// دالة مساعدة لحفظ قائمة الموديولات
async function saveModulesList(modules: ModuleData[]): Promise<boolean> {
  try {
    await fs.writeFile(MODULES_FILE_PATH, JSON.stringify(modules, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing modules.json:', err);
    return false;
  }
}

// 2. إضافة موديول جديد
export async function createModuleAction(
  data: Omit<ModuleData, 'id' | 'createdAt'>
): Promise<{ success: boolean; module?: ModuleData; error?: string }> {
  try {
    await assertAdmin();

    const cleanTitle = data.title?.trim();
    if (!cleanTitle) {
      return { success: false, error: 'يرجى إدخال عنوان الوحدة التعليمية' };
    }

    const modules = await getModulesListAction();
    const newId = `module-${Date.now()}`;
    const nextOrder = data.order || (modules.length > 0 ? Math.max(...modules.map((m) => m.order)) + 1 : 1);

    const newModule: ModuleData = {
      id: newId,
      order: nextOrder,
      title: cleanTitle,
      subtitle: data.subtitle?.trim() || '',
      durationMinutes: data.durationMinutes || 30,
      images: Array.isArray(data.images) ? data.images.filter(Boolean) : [],
      slides: Array.isArray(data.slides) ? data.slides : [],
      scaffolding: data.scaffolding || undefined,
      sections: Array.isArray(data.sections) ? data.sections : [],
      activity: {
        id: `act-${newId}`,
        title: data.activity?.title?.trim() || 'نشاط تطبيقي',
        description: data.activity?.description?.trim() || '',
        requiresSubmission: data.activity?.requiresSubmission ?? true,
      },
      createdAt: new Date().toISOString(),
    };

    modules.push(newModule);
    modules.sort((a, b) => a.order - b.order);
    await saveModulesList(modules);

    revalidatePath('/');
    revalidatePath('/modules');
    revalidatePath('/admin/dashboard');

    return { success: true, module: newModule };
  } catch (err) {
    console.error('Error creating module:', err);
    return { success: false, error: 'حدث خطأ أثناء إضافة الموديول التعليمي' };
  }
}

// 3. تعديل موديول موجود
export async function updateModuleAction(
  id: string,
  data: Partial<ModuleData>
): Promise<{ success: boolean; module?: ModuleData; error?: string }> {
  try {
    await assertAdmin();

    const modules = await getModulesListAction();
    const idx = modules.findIndex((m) => m.id === id);

    if (idx === -1) {
      return { success: false, error: 'لم يتم العثور على الوحدة التعليمية' };
    }

    modules[idx] = {
      ...modules[idx],
      ...data,
      title: data.title ? data.title.trim() : modules[idx].title,
      subtitle: data.subtitle !== undefined ? data.subtitle.trim() : modules[idx].subtitle,
      images: Array.isArray(data.images) ? data.images.filter(Boolean) : modules[idx].images,
      slides: Array.isArray(data.slides) ? data.slides : modules[idx].slides,
      scaffolding: data.scaffolding !== undefined ? data.scaffolding : modules[idx].scaffolding,
      sections: Array.isArray(data.sections) ? data.sections : modules[idx].sections,
      activity: data.activity ? { ...modules[idx].activity, ...data.activity } : modules[idx].activity,
      updatedAt: new Date().toISOString(),
    };

    modules.sort((a, b) => a.order - b.order);
    await saveModulesList(modules);

    revalidatePath('/');
    revalidatePath('/modules');
    revalidatePath(`/modules/${id}`);
    revalidatePath('/admin/dashboard');

    return { success: true, module: modules[idx] };
  } catch (err: any) {
    console.error('Error updating module:', err);
    return { success: false, error: err?.message || 'حدث خطأ أثناء حفظ التعديلات' };
  }
}

// 4. حذف موديول
export async function deleteModuleAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();

    const modules = await getModulesListAction();
    const filtered = modules.filter((m) => m.id !== id);

    if (filtered.length === modules.length) {
      return { success: false, error: 'لم يتم العثور على الوحدة لحذفها' };
    }

    await saveModulesList(filtered);

    revalidatePath('/');
    revalidatePath('/modules');
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (err: any) {
    console.error('Error deleting module:', err);
    return { success: false, error: err?.message || 'حدث خطأ أثناء حذف الوحدة' };
  }
}

// 4.5 رفع ملف النشاط مباشرة عبر Server Action بدلاً من أي API endpoint
export async function uploadActivityFileAction(
  formData: FormData
): Promise<{ success: boolean; fileUrl?: string; fileName?: string; error?: string }> {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'لم يتم تحديد أي ملف للرفع' };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'حجم الملف كبير جداً، الحد الأقصى المسموح به هو 10 ميجابايت' };
    }

    const originalName = file.name || 'activity-file';
    const ext = path.extname(originalName).toLowerCase();
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.docx'];

    if (!allowed.includes(ext)) {
      return {
        success: false,
        error: 'نوع الملف غير مدعوم. يرجى رفع صورة (PNG, JPG, WEBP) أو مستند (PDF, DOCX)',
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeFileName = `act-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, safeFileName);
    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      fileUrl: `/uploads/${safeFileName}`,
      fileName: originalName,
    };
  } catch (err) {
    console.error('uploadActivityFileAction error:', err);
    return { success: false, error: 'حدث خطأ أثناء حفظ الملف' };
  }
}

// 5. تسليم الطالب لحل النشاط التطبيقي في الموديول
export async function submitModuleActivityAction(
  moduleId: string,
  answerText: string,
  fileUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!answerText || answerText.trim().length < 5) {
      return { success: false, error: 'يرجى كتابة إجابة وافية للنشاط (5 أحرف على الأقل)' };
    }

    const cookieStore = await cookies();
    const devDemoCookie = cookieStore.get('dev_demo_user');
    let currentUserId: string | null = null;
    let username: string | null = null;

    if (devDemoCookie?.value) {
      try {
        const parsed = JSON.parse(devDemoCookie.value);
        currentUserId = parsed.id;
        username = parsed.student_id;
      } catch {}
    }

    const identifier = currentUserId || username;
    if (!identifier) {
      return { success: false, error: 'يرجى تسجيل الدخول أولاً لتسليم النشاط' };
    }

    const { recordActivitySubmissionAction } = await import('@/lib/actions/student.actions');
    const res = await recordActivitySubmissionAction(identifier, moduleId, {
      answerText,
      fileUrl,
    });

    if (res.success) {
      revalidatePath(`/modules/${moduleId}`);
      revalidatePath('/admin/dashboard');
      return { success: true };
    }

    return { success: false, error: res.error || 'فشل تسليم النشاط' };
  } catch (err) {
    console.error('Error in submitModuleActivityAction:', err);
    return { success: false, error: 'حدث خطأ أثناء تسليم النشاط' };
  }
}

// 6. إتمام الوحدة والانتقال للتالي
export async function completeModuleAction(moduleId: string): Promise<void> {
  const modules = await getModulesListAction();
  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) return;

  const nextIndex = moduleIndex + 1;

  const cookieStore = await cookies();
  const devDemoCookie = cookieStore.get('dev_demo_user');
  let currentUserId: string | null = null;
  let username: string | null = null;

  if (devDemoCookie?.value) {
    try {
      const parsed = JSON.parse(devDemoCookie.value);
      currentUserId = parsed.id;
      username = parsed.student_id;
    } catch {}
  }

  const isLive = isLiveSupabaseConfigured();

  if (isLive) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        currentUserId = user.id;
      }
    } catch {}
  }

  const identifier = currentUserId || username;
  if (identifier) {
    const { recordModuleCompletionAction } = await import('@/lib/actions/student.actions');
    await recordModuleCompletionAction(identifier, moduleId);
  }

  if (isLive && currentUserId) {
    try {
      const supabase = await createClient();
      const { data: progress } = await supabase
        .from('student_progress')
        .select('current_module_index')
        .eq('student_id', currentUserId)
        .single();

      if (!progress || progress.current_module_index <= moduleIndex) {
        await supabase.from('student_progress').upsert(
          {
            student_id: currentUserId,
            current_module_index: nextIndex,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'student_id' }
        );
      }
    } catch {}
  }

  revalidatePath('/modules');
  revalidatePath(`/modules/${moduleId}`);
  revalidatePath('/');
  revalidatePath('/post-test');
  revalidatePath('/admin/dashboard');

  // إذا كانت هذه آخر وحدة، نوجهه للاختبار البعدي
  if (nextIndex >= modules.length) {
    redirect('/post-test');
  } else {
    redirect('/modules');
  }
}
