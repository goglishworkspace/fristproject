import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { ASU_LOGO_URL } from '@/lib/constants/branding';
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

  // تحويل إجباري للطالب غير مكتمل البيانات إلى صفحة إكمال البيانات
  if (userProfile?.role === 'student' && userProfile?.is_profile_completed === false) {
    redirect('/complete-profile');
  }

  // تحسين الأداء: فحص مستخدم Supabase فقط إذا لم تكن هناك جلسة ديمو وكانت هناك كوكيز sb-*
  const hasSupabaseCookie = cookieStore.getAll().some((c) => c.name.startsWith('sb-'));
  if (!userProfile && isLiveSupabaseConfigured() && hasSupabaseCookie) {
    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, student_id, full_name, role')
          .eq('id', authUser.id)
          .single();

        userProfile = profile || {
          id: authUser.id,
          student_id: authUser.email?.split('@')[0] || 'طالب',
          full_name: 'طالب المنصة',
          role: 'student',
        };
      }
    } catch {
      // ignore
    }
  }

  // متاح للزائر تماماً تصفح الموقع والنبذة دون أي إجبار على تسجيل الدخول
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 w-full max-w-full overflow-x-hidden">
      <Navbar user={userProfile} />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl w-full">
        {children}
      </main>
      <footer className="border-t border-slate-200/90 bg-white text-slate-600 mt-12 py-8 sm:py-10">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center justify-center text-center space-y-4">
          {/* 1. اللوجو في الأعلى في المنتصف */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-asu-gold/40 p-1.5 flex items-center justify-center shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASU_LOGO_URL}
              alt="شعار جامعة عين شمس"
              className="w-full h-full object-contain"
            />
          </div>

          {/* 2. اسم الجامعة والكلية */}
          <div className="space-y-0.5">
            <p className="font-black text-asu-navy text-base sm:text-lg">جامعة عين شمس</p>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              كلية الدراسات العليا والبحوث البيئية • منصة الوعي بقضايا البيئة للمرحلة الثانوية
            </p>
          </div>

          {/* 3. الروابط السريعة في المنتصف */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-bold text-asu-navy pt-1">
            <a href="/instructions" className="hover:text-asu-gold transition-colors">التعليمات</a>
            <span className="text-slate-300">•</span>
            <a href="/supervision" className="hover:text-asu-gold transition-colors">الإعداد والإشراف</a>
            <span className="text-slate-300">•</span>
            <a href="/objectives" className="hover:text-asu-gold transition-colors">الأهداف العامة</a>
            <span className="text-slate-300">•</span>
            <a href="/library" className="hover:text-asu-gold transition-colors">المكتبة الإثرائية</a>
            <span className="text-slate-300">•</span>
            <a href="/contact" className="hover:text-asu-gold transition-colors">الدعم والتواصل</a>
          </div>

          {/* 5. حقوق الملكية في المنتصف */}
          <div className="pt-4 border-t border-slate-100 w-full flex flex-col items-center justify-center text-[11px] text-slate-400 gap-1 text-center">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} - محمد فاروق مبارك أحمد • جامعة عين شمس</span>
            <span dir="rtl">تم تصميم وتطوير البيئة وفق المعايير الأكاديمية والتربوية والتكنولوجية بواسطة مؤسسة رؤية للتصميم التعليمي 01006656234</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
