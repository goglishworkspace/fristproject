import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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
        <LoginForm />
      </div>
    </div>
  );
}
