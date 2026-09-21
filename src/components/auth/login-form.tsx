'use client';

import { useActionState, useTransition } from 'react';
import { loginAction, devLoginAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LogIn, GraduationCap, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [isDemoPending, startDemoTransition] = useTransition();

  const handleQuickDemo = (role: 'student' | 'admin') => {
    startDemoTransition(async () => {
      await devLoginAction(role);
    });
  };

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

      <CardContent className="space-y-4">
        {/* أزرار التجربة السريعة لمعاينة الواجهات مباشرة */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>تجربة ومعاينة فورية (وضع التطوير):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('student')}
              disabled={isDemoPending}
              className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300 text-xs gap-1.5 shadow-none"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>دخول كـ طالب</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('admin')}
              disabled={isDemoPending}
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 text-xs gap-1.5 shadow-none"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>دخول كـ مسؤول</span>
            </Button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400">أو بالبيانات العادية</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

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
              disabled={isPending || isDemoPending}
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
              disabled={isPending || isDemoPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 gap-2"
            size="lg"
            disabled={isPending || isDemoPending}
          >
            {isPending || isDemoPending ? (
              <span className="inline-block animate-pulse">جاري التحقق...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5 ml-1" />
                <span>دخول</span>
              </>
            )}
          </Button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>تسجيل دخول آمن ومحمي لمنسوبي الكلية والطلاب</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
