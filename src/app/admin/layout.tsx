import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { UserProfile } from '@/lib/types/database';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const devDemoCookie = cookieStore.get('dev_demo_user');
  let userProfile: UserProfile | null = null;

  if (devDemoCookie?.value) {
    try {
      userProfile = JSON.parse(devDemoCookie.value);
    } catch {
      // ignore
    }
  }

  if (!userProfile && isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        userProfile = profile;
      }
    } catch {
      // ignore
    }
  }

  if (!userProfile) {
    redirect('/login');
  }

  // جدار حماية صارم: خاص فقط بحسابات المسؤول (Admin Guard)
  if (userProfile.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {children}
    </div>
  );
}
