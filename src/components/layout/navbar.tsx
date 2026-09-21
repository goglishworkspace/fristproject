import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  LogIn,
  LogOut,
  ShieldCheck,
  User,
  Home,
  Users2,
  FileText,
  Target,
  Library,
  Mail,
} from 'lucide-react';
import type { UserProfile } from '@/lib/types/database';

interface NavbarProps {
  user: UserProfile | null;
}

export const NAV_LINKS = [
  { href: '/', label: 'الصفحة الرئيسية', icon: Home },
  { href: '/supervision', label: 'الإعداد والإشراف', icon: Users2 },
  { href: '/instructions', label: 'التعليمات', icon: FileText },
  { href: '/objectives', label: 'الأهداف العامة', icon: Target },
  { href: '/library', label: 'المكتبة الإثرائية', icon: Library },
  { href: '/contact', label: 'تواصل معنا', icon: Mail },
];

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* اللوجو والعنوان */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-right hidden sm:block">
            <span className="block font-bold text-slate-900 text-sm md:text-base leading-tight">
              منصة بيئتي التعليمية
            </span>
            <span className="block text-[10px] text-slate-500 font-medium">
              البيئة الرقمية التفاعلية
            </span>
          </div>
        </Link>

        {/* التابات الرئيسية (السايت ماب المطلوبة) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all flex items-center gap-1.5"
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* إجراءات المستخدم / تسجيل الدخول */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-right bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  {user.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[11px] font-bold text-slate-800 leading-none">
                    {user.full_name}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    {user.role === 'admin' ? 'مشرف المنصة' : `كود: ${user.student_id}`}
                  </p>
                </div>
              </div>

              {user.role === 'admin' && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm" className="hidden xl:inline-flex text-xs py-1 px-2.5 h-8">
                    لوحة التحكم
                  </Button>
                </Link>
              )}

              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 gap-1 text-xs px-2.5 h-8"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">خروج</span>
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-1.5 text-xs py-1.5 px-3">
                <LogIn className="w-3.5 h-3.5 ml-0.5" />
                <span>تسجيل الدخول</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* شريط تابات إضافي للشاشات الصغيرة والمتوسطة (Mobile / Tablet Nav) */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-50/70 text-xs">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-2.5 py-1 rounded-md whitespace-nowrap text-slate-600 hover:text-emerald-700 hover:bg-white transition-colors flex items-center gap-1 font-medium"
          >
            <item.icon className="w-3 h-3" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
