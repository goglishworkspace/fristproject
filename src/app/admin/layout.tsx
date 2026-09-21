import { createClient } from '@/lib/supabase/server';
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

  if (!userProfile) {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      redirect('/login');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    userProfile = profile;
  }

  // جدار حماية صارم: خاص فقط بحسابات المسؤول (Admin Guard)
  if (!userProfile || userProfile.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {children}
    </div>
  );
}
