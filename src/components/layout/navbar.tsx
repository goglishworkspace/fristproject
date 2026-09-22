'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import {
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
  LayoutDashboard,
} from 'lucide-react';
import type { UserProfile } from '@/lib/types/database';

interface NavbarProps {
  user: UserProfile | null;
}

export const NAV_LINKS = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/supervision', label: 'الإعداد والإشراف', icon: Users2 },
  { href: '/instructions', label: 'التعليمات', icon: FileText },
  { href: '/objectives', label: 'الأهداف التعليمية', icon: Target },
  { href: '/library', label: 'المكتبة الإثرائية', icon: Library },
  { href: '/contact', label: 'تواصل معنا', icon: Mail },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80">
      {/* شريط الهوية العلوى بألوان جامعة عين شمس (كحلي ملكي - ذهبي تراثي - أخضر أكاديمي) */}
      <div className="h-1 w-full bg-gradient-to-r from-asu-navy via-asu-gold to-asu-green" />

      <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* اللوجو وهوية الجامعة */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group py-1"
          aria-label="الصفحة الرئيسية - جامعة عين شمس"
        >
          {/* لوجو الجامعة الرسمي */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-asu-gold/30 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-asu-gold transition-all">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/asu-logo.png"
              alt="شعار جامعة عين شمس"
              className="w-full h-full object-contain"
            />
          </div>

          {/* نصوص الهوية والكلية */}
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-asu-navy text-sm sm:text-base leading-tight">
                منصة بيئتي التعليمية
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-asu-gold/15 text-asu-gold-dark border border-asu-gold/30">
                جامعة عين شمس
              </span>
            </div>
            <span className="block text-[10px] sm:text-xs text-slate-500 font-medium">
              البيئة الرقمية التفاعلية • كلية التربية
            </span>
          </div>
        </Link>

        {/* تابات الأقسام لشاشات الكمبيوتر واللابتوب (Desktop Navigation) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none ${
                  isActive
                    ? 'bg-asu-navy text-white shadow-sm shadow-asu-navy/25'
                    : 'text-slate-600 hover:text-asu-navy hover:bg-asu-navy/5'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-asu-gold-light' : 'text-slate-400 group-hover:text-asu-navy'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* إجراءات المستخدم / أزرار الدخول */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {user ? (
            <>
              {/* شارة المستخدم الحالية */}
              <div className="flex items-center gap-2 text-right bg-slate-50 border border-slate-200/80 px-2 sm:px-2.5 py-1 rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-asu-navy/10 text-asu-navy flex items-center justify-center shrink-0">
                  {user.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-asu-gold" />
                  ) : (
                    <User className="w-4 h-4 text-asu-navy" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[11px] font-bold text-slate-800 leading-none">
                    {user.full_name}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
                    {user.role === 'admin' ? 'مشرف المنصة' : `كود: ${user.student_id}`}
                  </p>
                </div>
              </div>

              {/* زر لوحة التحكم للمشرف */}
              {user.role === 'admin' && (
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:inline-flex text-xs py-1 px-2.5 h-8 border-asu-navy/20 text-asu-navy hover:bg-asu-navy/5 gap-1 font-bold"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>لوحة التحكم</span>
                  </Button>
                </Link>
              )}

              {/* زر تسجيل الخروج */}
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 gap-1 text-xs px-2 sm:px-2.5 h-8"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">خروج</span>
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5 text-xs py-1.5 px-3 sm:px-4 font-bold shadow-md shadow-asu-navy/20"
              >
                <LogIn className="w-3.5 h-3.5 ml-0.5" />
                <span>دخول المنصة</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* شريط الأقسام السريع للهواتف والتابلت (Mobile / Tablet Responsive Tab Bar) */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/95 px-2.5 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs select-none ${
                  isActive
                    ? 'bg-asu-navy text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                }`}
              >
                <item.icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-asu-gold-light' : 'text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
