import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import type { UserProfile } from '@/lib/types/database';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  // جلب الملف التعريفي والتحقق من وجوده
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  const userProfile: UserProfile = profile || {
    id: authUser.id,
    student_id: authUser.email?.split('@')[0] || 'طالب',
    full_name: 'طالب المنصة',
    role: 'student',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={userProfile} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        جميع الحقوق محفوظة © {new Date().getFullYear()} - منصة بيئتي التعليمية
      </footer>
    </div>
  );
}
