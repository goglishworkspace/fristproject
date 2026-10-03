'use client';

import { useState } from 'react';
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
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import type { UserProfile } from '@/lib/types/database';
import { ASU_LOGO_URL } from '@/lib/constants/branding';

interface NavbarProps {
  user: UserProfile | null;
}

export const NAV_LINKS = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/supervision', label: 'الإعداد والإشراف', icon: Users2 },
  { href: '/instructions', label: 'التعليمات', icon: FileText },
  { href: '/objectives', label: 'الأهداف العامة', icon: Target },
  { href: '/library', label: 'المكتبة الإثرائية', icon: Library },
  { href: '/contact', label: 'تواصل معنا', icon: Mail },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80">
      {/* شريط الهوية العلوى بألوان جامعة عين شمس (كحلي ملكي - ذهبي تراثي - أخضر أكاديمي) */}
      <div className="h-1 w-full bg-gradient-to-r from-asu-navy via-asu-gold to-asu-green" />

      <div className="container mx-auto px-2.5 sm:px-4 h-16 flex items-center justify-between gap-1.5 sm:gap-4 max-w-full overflow-hidden">
        {/* اللوجو وهوية الجامعة */}
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0 group py-1"
          aria-label="الصفحة الرئيسية - جامعة عين شمس"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* لوجو الجامعة الرسمي */}
          <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white border border-asu-gold/30 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-asu-gold transition-all shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASU_LOGO_URL}
              alt="شعار جامعة عين شمس"
              className="w-full h-full object-contain"
            />
          </div>

          {/* نصوص الهوية والكلية */}
          <div className="text-right min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-asu-navy text-[11px] sm:text-sm md:text-base leading-tight truncate">
                منصة الوعي بقضايا البيئة
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-asu-gold/15 text-asu-gold-dark border border-asu-gold/30 shrink-0">
                جامعة عين شمس
              </span>
            </div>
            <span className="block text-[8px] sm:text-xs text-slate-500 font-medium truncate">
              البيئة الرقمية • كلية الدراسات العليا
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
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {user ? (
            <>
              {/* شارة المستخدم الحالية */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-right bg-slate-50 border border-slate-200/80 px-1.5 sm:px-2.5 py-1 rounded-xl shadow-2xs">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg bg-asu-navy/10 text-asu-navy flex items-center justify-center shrink-0">
                  {user.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-asu-gold" />
                  ) : (
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-asu-navy" />
                  )}
                </div>
                <div className="max-w-[70px] sm:max-w-none truncate">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-none truncate">
                    {user.full_name}
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-slate-500 mt-0.5 font-medium truncate">
                    {user.role === 'admin' ? 'مشرف' : `كود: ${user.student_id}`}
                  </p>
                </div>
              </div>

              {/* زر الوحدات التعليمية للطالب */}
              {user.role === 'student' && (
                <Link href="/modules" className="hidden sm:inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs py-1 px-2.5 h-8 border-asu-navy/20 text-asu-navy hover:bg-asu-navy/5 gap-1 font-bold"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-asu-gold-dark" />
                    <span>الموديولات</span>
                  </Button>
                </Link>
              )}

              {/* زر لوحة التحكم للمشرف */}
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="hidden md:inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs py-1 px-2.5 h-8 border-asu-navy/20 text-asu-navy hover:bg-asu-navy/5 gap-1 font-bold"
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
                  className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 gap-1 text-xs px-1.5 sm:px-2.5 h-8 cursor-pointer"
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
                className="gap-1 text-[11px] sm:text-xs py-1.5 px-2 sm:px-4 font-bold shadow-md shadow-asu-navy/20 cursor-pointer h-8 sm:h-9"
              >
                <LogIn className="w-3.5 h-3.5 ml-0.5" />
                <span className="hidden xs:inline sm:inline">دخول المنصة</span>
                <span className="inline xs:hidden sm:hidden">دخول</span>
              </Button>
            </Link>
          )}

          {/* زر القائمة المنسدلة للهواتف (Hamburger Button) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-asu-navy hover:bg-slate-100 transition-colors cursor-pointer select-none active:scale-95 shrink-0"
            aria-label="فتح القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* القائمة المنسدلة الكاملة للموبايل عند الضغط على زر الهمبرجر */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-3 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer select-none ${
                  isActive
                    ? 'bg-asu-navy text-white shadow-sm font-black'
                    : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon
                    className={`w-4 h-4 ${isActive ? 'text-asu-gold-light' : 'text-asu-navy'}`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="text-[10px] text-asu-gold-light font-bold">الحالي</span>}
              </Link>
            );
          })}

          {user && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              {user.role === 'student' && (
                <Link
                  href="/modules"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-asu-gold/10 text-asu-navy font-black text-xs flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-asu-gold-dark" />
                  <span>الوحدات والموديولات الدراسية</span>
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-asu-navy/10 text-asu-navy font-black text-xs flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-asu-navy" />
                  <span>لوحة تحكم المسؤول</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* شريط الأقسام السريع للهواتف والتابلت (Mobile Tab Bar) */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/95 px-2 py-2 overflow-x-auto no-scrollbar w-full max-w-full touch-pan-x overscroll-x-contain">
        <div className="flex items-center gap-1.5 w-max">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs select-none cursor-pointer ${
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
