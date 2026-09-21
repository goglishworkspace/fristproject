'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LogIn, GraduationCap, ShieldCheck } from 'lucide-react';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <Card className="w-full max-w-md shadow-xl border-slate-200/80 bg-white">
      <CardHeader className="text-center space-y-2 pb-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 shadow-inner">
          <GraduationCap className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">
          تسجيل الدخول للمنصة
        </CardTitle>
        <CardDescription className="text-slate-500 text-sm">
          أدخل كود الطالب أو اسم المستخدم وكلمة المرور المسلمة لك
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
              label="كود الطالب أو البريد الإلكتروني"
              placeholder="مثال: 2026101 أو admin"
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
                <span>دخول</span>
              </>
            )}
          </Button>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>تسجيل دخول آمن ومحمي لمنسوبي الكلية والطلاب</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
