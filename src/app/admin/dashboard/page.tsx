import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getLibraryVideos } from '@/lib/actions/library.actions';
import { getStudentsListAction } from '@/lib/actions/student.actions';
import { getModulesListAction } from '@/lib/actions/module.actions';
import { getAllQuestionsAction } from '@/lib/actions/exam.actions';
import { getAdminAccountsAction } from '@/lib/actions/admin-accounts.actions';
import { AdminDashboardTabs } from '@/components/admin/admin-dashboard-tabs';
import { ASU_LOGO_URL } from '@/lib/constants/branding';

export const metadata = {
  title: 'لوحة التحكم والمشرف الأكاديمي | منصة الوعي بقضايا البيئة للمرحلة الثانوية • جامعة عين شمس',
  description: 'إدارة حسابات الطلاب، وتوزيع الأكواد، وبنك الأسئلة، والموديولات والمكتبة الإثرائية',
};

export default async function AdminDashboardPage() {
  const [students, videos, modules, questions, admins] = await Promise.all([
    getStudentsListAction(),
    getLibraryVideos(),
    getModulesListAction(),
    getAllQuestionsAction(),
    getAdminAccountsAction(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 text-right">
      {/* 1. ترويسة لوحة التحكم الرسمية الفاخرة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-asu-gold/30 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-asu-gold/40 p-1.5 shadow-sm shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASU_LOGO_URL}
              alt="جامعة عين شمس"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-asu-navy flex items-center gap-1 font-bold"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة للمنصة</span>
              </Link>
              <span className="text-slate-300">•</span>
              <Badge variant="gold" className="text-[11px] gap-1">
                <Sparkles className="w-3 h-3 text-asu-gold-dark" />
                لوحة المشرف الأكاديمي
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-asu-navy">
              إدارة المنصة الأكاديمية • كلية الدراسات العليا والبحوث البيئية - جامعة عين شمس
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              إدارة حسابات الطلاب، وتخصيص الموديولات وسلايدر الصور، والتحكم ببنك أسئلة الاختبارات، والمكتبة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/modules" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-300">
              <span>معاينة الموديولات</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. تبويبات لوحة التحكم الشاملة */}
      <AdminDashboardTabs
        students={students}
        modules={modules}
        questions={questions}
        videos={videos}
        admins={admins}
      />
    </div>
  );
}
