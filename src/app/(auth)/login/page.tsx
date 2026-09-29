import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const devDemoCookie = cookieStore.get('dev_demo_user');

  if (devDemoCookie?.value) {
    try {
      const parsed = JSON.parse(devDemoCookie.value);
      if (parsed.role === 'admin') {
        redirect('/admin/dashboard');
      } else {
        redirect('/');
      }
    } catch {
      // ignore
    }
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          redirect('/admin/dashboard');
        } else {
          redirect('/');
        }
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-100 via-asu-navy-50/20 to-slate-200">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-asu-navy bg-white/90 hover:bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5 text-asu-gold-dark" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
