'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { AdminAccount } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { assertAdmin } from '@/lib/auth/session';

const ADMINS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'admins.json');

// دالة مساعدة لقراءة ملف المشرفين المحلي
async function readAdminsJson(): Promise<AdminAccount[]> {
  try {
    const raw = await fs.readFile(ADMINS_FILE_PATH, 'utf-8');
    return JSON.parse(raw) as AdminAccount[];
  } catch (err) {
    console.error('Error reading admins.json:', err);
    return [];
  }
}

// دالة مساعدة لحفظ ملف المشرفين المحلي
async function saveAdminsJson(admins: AdminAccount[]): Promise<boolean> {
  try {
    await fs.writeFile(ADMINS_FILE_PATH, JSON.stringify(admins, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving admins.json:', err);
    return false;
  }
}

// 1. جلب قائمة حسابات المشرفين (مع أولوية Supabase ثم الملف المحلي)
export async function getAdminAccountsAction(): Promise<AdminAccount[]> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          username: row.username,
          password: row.password,
          fullName: row.full_name || '',
          phone: row.phone || '',
          role: 'admin',
          isProfileCompleted: true,
          isBanned: !!row.is_banned,
          createdAt: row.created_at || new Date().toISOString(),
          updatedAt: row.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase getAdminAccountsAction failed, falling back to JSON:', err);
    }
  }

  return await readAdminsJson();
}

// 2. تعديل بيانات حساب مشرف (الاسم الكامل، كلمة المرور، رقم الهاتف)
export async function updateAdminAccountAction(
  id: string,
  data: { fullName?: string; phone?: string; password?: string }
): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
  try {
    await assertAdmin();

    const cleanId = id.trim();
    const cleanFullName = data.fullName?.trim();
    const cleanPhone = data.phone?.trim() ?? '';
    const cleanPassword = data.password?.trim();

    if (!cleanFullName || cleanFullName.length < 2) {
      return { success: false, error: 'يرجى إدخال اسم المشرف بشكل صحيح (حرفين على الأقل)' };
    }

    if (cleanPassword !== undefined && cleanPassword.length > 0 && cleanPassword.length < 4) {
      return { success: false, error: 'كلمة المرور يجب أن تتكون من 4 خانات على الأقل' };
    }

    const localAdmins = await readAdminsJson();
    const targetIdx = localAdmins.findIndex(
      (a) => a.id.toLowerCase() === cleanId.toLowerCase() || a.username.toLowerCase() === cleanId.toLowerCase()
    );

    let updatedAdmin: AdminAccount;

    if (targetIdx !== -1) {
      localAdmins[targetIdx].fullName = cleanFullName;
      localAdmins[targetIdx].phone = cleanPhone;
      if (cleanPassword) {
        localAdmins[targetIdx].password = cleanPassword;
      }
      localAdmins[targetIdx].updatedAt = new Date().toISOString();
      updatedAdmin = localAdmins[targetIdx];
      await saveAdminsJson(localAdmins);
    } else {
      updatedAdmin = {
        id: cleanId,
        username: cleanId,
        password: cleanPassword || 'Admin@Env2026',
        fullName: cleanFullName,
        phone: cleanPhone,
        role: 'admin',
        isProfileCompleted: true,
        isBanned: false,
        updatedAt: new Date().toISOString(),
      };
    }

    // تحديث في Supabase
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const payload: Record<string, unknown> = {
          full_name: cleanFullName,
          phone: cleanPhone,
          updated_at: new Date().toISOString(),
        };
        if (cleanPassword) {
          payload.password = cleanPassword;
        }

        await supabase
          .from('accounts')
          .update(payload)
          .eq('id', updatedAdmin.id)
          .eq('role', 'admin');
      } catch (err) {
        console.warn('Supabase updateAdminAccountAction error:', err);
      }
    }

    revalidatePath('/admin/dashboard');
    return { success: true, admin: updatedAdmin };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء تعديل بيانات المشرف';
    return { success: false, error: msg };
  }
}

// 3. حذف حساب مشرف
export async function deleteAdminAccountAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();

    const cleanId = id.trim().toLowerCase();
    const currentAdmins = await getAdminAccountsAction();

    // حماية النظام: يجب ألا يقل عدد المشرفين عن مشرف واحد
    if (currentAdmins.length <= 1) {
      return { success: false, error: 'لا يمكن حذف الحساب: يجب الإبقاء على حساب مشرف واحد على الأقل للمنصة.' };
    }

    const targetAdmin = currentAdmins.find(
      (a) => a.id.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId
    );

    if (!targetAdmin) {
      return { success: false, error: 'لم يتم العثور على حساب المشرف المطلوب حذفه' };
    }

    // حذف من Supabase
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase
          .from('accounts')
          .delete()
          .eq('id', targetAdmin.id)
          .eq('role', 'admin');
      } catch (err) {
        console.warn('Supabase deleteAdminAccountAction error:', err);
      }
    }

    // حذف من الملف المحلي
    const localAdmins = await readAdminsJson();
    const filtered = localAdmins.filter(
      (a) => a.id.toLowerCase() !== targetAdmin.id.toLowerCase() && a.username.toLowerCase() !== targetAdmin.username.toLowerCase()
    );
    await saveAdminsJson(filtered);

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء حذف حساب المشرف';
    return { success: false, error: msg };
  }
}

// 4. إنشاء حساب مشرف جديد
export async function createAdminAccountAction(data: {
  username: string;
  fullName: string;
  password?: string;
  phone?: string;
}): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
  try {
    await assertAdmin();

    const cleanUsername = data.username.trim().toLowerCase();
    const cleanFullName = data.fullName.trim();
    const cleanPhone = data.phone?.trim() ?? '';
    const cleanPassword = data.password?.trim() || `Admin@${Math.floor(1000 + Math.random() * 9000)}`;

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'اسم المستخدم للمشرف يجب أن يكون 3 أحرف على الأقل' };
    }

    if (!cleanFullName || cleanFullName.length < 2) {
      return { success: false, error: 'يرجى إدخال الاسم الكامل للمشرف' };
    }

    const currentAdmins = await getAdminAccountsAction();
    const isDuplicate = currentAdmins.some((a) => a.username.toLowerCase() === cleanUsername);
    if (isDuplicate) {
      return { success: false, error: `اسم المستخدم (${cleanUsername}) مسجل لمشرف آخر مسبقاً` };
    }

    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}`,
      username: cleanUsername,
      password: cleanPassword,
      fullName: cleanFullName,
      phone: cleanPhone,
      role: 'admin',
      isProfileCompleted: true,
      isBanned: false,
      createdAt: new Date().toISOString(),
    };

    // حفظ في Supabase
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase.from('accounts').insert({
          id: newAdmin.id,
          username: newAdmin.username,
          password: newAdmin.password,
          full_name: newAdmin.fullName,
          phone: newAdmin.phone,
          role: 'admin',
          is_profile_completed: true,
          is_banned: false,
          created_at: newAdmin.createdAt,
        });
      } catch (err) {
        console.warn('Supabase createAdminAccountAction error:', err);
      }
    }

    // حفظ في الملف المحلي
    const localAdmins = await readAdminsJson();
    localAdmins.push(newAdmin);
    await saveAdminsJson(localAdmins);

    revalidatePath('/admin/dashboard');
    return { success: true, admin: newAdmin };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إضافة المشرف';
    return { success: false, error: msg };
  }
}
