import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Navbar } from '@/components/layout/navbar';
import type { UserProfile } from '@/lib/types/database';

export default async function PlatformLayout({
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

  // إذا لم يكن مستخدم تجريبي، نفحص مستخدم سوبابيز الحقيقي
  if (!userProfile) {
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

      userProfile = profile || {
        id: authUser.id,
        student_id: authUser.email?.split('@')[0] || 'طالب',
        full_name: 'طالب المنصة',
        role: 'student',
      };
    }
  }

  // متاح للزائر تماماً تصفح الموقع والنبذة دون أي إجبار على تسجيل الدخول
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
