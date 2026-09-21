import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, ShieldCheck, User } from 'lucide-react';
import type { UserProfile } from '@/lib/types/database';

interface NavbarProps {
  user: UserProfile;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* اللوجو والعنوان */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="block font-bold text-slate-800 text-base leading-tight">
              منصة بيئتي التعليمية
            </span>
            <span className="block text-[11px] text-slate-500 font-medium">
              الكلية الجامعية - بيئة التعلم الرقمي
            </span>
          </div>
        </Link>

        {/* معلومات المستخدم والإجراءات */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-right bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {user.role === 'admin' ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">
                {user.full_name}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {user.role === 'admin' ? 'مشرف المنصة' : `كود: ${user.student_id}`}
              </p>
            </div>
          </div>

          {user.role === 'admin' && (
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="hidden md:inline-flex text-xs">
                لوحة التحكم
              </Button>
            </Link>
          )}

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 gap-1.5 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
