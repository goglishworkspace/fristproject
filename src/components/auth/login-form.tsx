'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth.actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LogIn, ShieldCheck, Home, ArrowRight } from 'lucide-react';
import { ASU_LOGO_URL } from '@/lib/constants/branding';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <Card className="w-full max-w-md shadow-2xl border-slate-200/80 bg-white">
      <CardHeader className="text-center space-y-2 pb-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-asu-gold/30 p-2 flex items-center justify-center mb-1 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASU_LOGO_URL}
            alt="شعار جامعة عين شمس"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-asu-gold-dark">جامعة عين شمس • كلية الدراسات العليا والبحوث البيئية</p>
          <CardTitle className="text-2xl font-black text-asu-navy">
            تسجيل الدخول للمنصة
          </CardTitle>
        </div>
        <CardDescription className="text-slate-500 text-xs sm:text-sm">
          أدخل اسم المستخدم الخاص بك وكلمة المرور للمتابعة
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-right flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="space-y-1">
            <Input
              id="identifier"
              name="identifier"
              label="اسم المستخدم"
              placeholder="اكتب اسم المستخدم الخاص بك"
              required
              autoComplete="username"
              disabled={isPending}
            />
          </div>

          <div className="space-y-1">
            <Input
              id="password"
              name="password"
              type="password"
              label="كلمة المرور"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 gap-2"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <span className="inline-block animate-pulse">جاري التحقق...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5 ml-1" />
                <span>تسجيل الدخول</span>
              </>
            )}
          </Button>

          <Link href="/" className="block w-full">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full gap-2 border-slate-200 text-slate-700 hover:text-asu-navy hover:bg-slate-50 font-bold"
            >
              <Home className="w-4 h-4 ml-1 text-asu-gold-dark" />
              <span>العودة للصفحة الرئيسية</span>
              <ArrowRight className="w-4 h-4 mr-1 text-slate-400" />
            </Button>
          </Link>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-asu-navy" />
            <span>تسجيل دخول آمن ومحمي لمنسوبي الكلية والطلاب</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
