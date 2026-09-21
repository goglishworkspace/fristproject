'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { MODULES_DATA } from '@/data/modules';
import { redirect } from 'next/navigation';

export async function completeModuleAction(moduleId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const moduleIndex = MODULES_DATA.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) return;

  const nextIndex = moduleIndex + 1;

  // تحديث مسار الطالب إذا كان هذا الموديول هو الموديول الحالي
  const { data: progress } = await supabase
    .from('student_progress')
    .select('current_module_index')
    .eq('student_id', user.id)
    .single();

  if (!progress || progress.current_module_index <= moduleIndex) {
    await supabase.from('student_progress').upsert(
      {
        student_id: user.id,
        current_module_index: nextIndex,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id' }
    );
  }

  revalidatePath('/modules');
  revalidatePath(`/modules/${moduleId}`);
  revalidatePath('/');

  // إذا كانت هذه آخر وحدة، نوجهه للاختبار البعدي
  if (nextIndex >= MODULES_DATA.length) {
    redirect('/post-test');
  } else {
    redirect('/modules');
  }
}
