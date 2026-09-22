import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isLiveSupabaseConfigured } from '@/lib/supabase/config';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Download,
  GraduationCap,
  Film,
} from 'lucide-react';
import { getLibraryVideos } from '@/lib/actions/library.actions';
import { LibraryManager } from '@/components/admin/library-manager';

interface MockStudentRow {
  id: string;
  name: string;
  studentId: string;
  preScore: number | null;
  postScore: number | null;
  moduleProgress: string;
  status: 'completed' | 'in_progress' | 'not_started';
}

export default async function AdminDashboardPage() {
  let realProfiles: any[] | null = null;
  let submissions: any[] | null = null;

  // جلب الطلاب ونتائجهم الحقيقية من قاعدة البيانات فقط إذا كان Supabase متصلاً
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: p } = await supabase
        .from('profiles')
        .select('id, full_name, student_id, role')
        .eq('role', 'student');
      realProfiles = p;

      const { data: s } = await supabase
        .from('exam_submissions')
        .select('student_id, exam_type, score, total_questions');
      submissions = s;
    } catch {
      // ignore
    }
  }

  // بيانات توضيحية أثناء التطوير لعرض الداشبورد والتحليلات فوراً
  const studentRows: MockStudentRow[] = (realProfiles && realProfiles.length > 0)
    ? realProfiles.map((p) => {
        const pre = submissions?.find((s) => s.student_id === p.id && s.exam_type === 'pre_test');
        const post = submissions?.find((s) => s.student_id === p.id && s.exam_type === 'post_test');
        return {
          id: p.id,
          name: p.full_name,
          studentId: p.student_id || '---',
          preScore: pre ? pre.score : null,
          postScore: post ? post.score : null,
          moduleProgress: post ? '2/2' : pre ? '1/2' : '0/2',
          status: post ? 'completed' : pre ? 'in_progress' : 'not_started',
        };
      })
    : [
        {
          id: 's1',
          name: 'أحمد محمود إبراهيم',
          studentId: '2026101',
          preScore: 5,
          postScore: 9,
          moduleProgress: '2/2',
          status: 'completed',
        },
        {
          id: 's2',
          name: 'سارة عبد الرحمن يوسف',
          studentId: '2026102',
          preScore: 4,
          postScore: 8,
          moduleProgress: '2/2',
          status: 'completed',
        },
        {
          id: 's3',
          name: 'خالد عمر الشريف',
          studentId: '2026103',
          preScore: 6,
          postScore: null,
          moduleProgress: '1/2',
          status: 'in_progress',
        },
        {
          id: 's4',
          name: 'نور الدين مصطفى',
          studentId: '2026104',
          preScore: null,
          postScore: null,
          moduleProgress: '0/2',
          status: 'not_started',
        },
      ];

  const totalStudents = studentRows.length;
  const completedCount = studentRows.filter((s) => s.status === 'completed').length;
  const inProgressCount = studentRows.filter((s) => s.status === 'in_progress').length;

  const videos = await getLibraryVideos();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 text-right">
      {/* هيدر لوحة التحكم */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للمنصة</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Badge variant="default" className="text-[11px]">لوحة القيادة والمتابعة</Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            لوحة المسؤول - متابعة أداء الطلاب والتحصيل العلمي
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مراقبة نسب الإنجاز، ومقارنة درجات الاختبارين القبلي والبعدي بدقة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Download className="w-4 h-4" />
            <span>تصدير تقرير إكسيل (CSV)</span>
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات الأربع الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-500 font-medium">إجمالي الطلاب المسجلين</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-400 mr-2">طالب</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-500 font-medium">أتموا المتطلبات بالكامل</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-black text-emerald-600">{completedCount}</span>
            <span className="text-xs text-slate-400 mr-2">من أصل {totalStudents}</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-500 font-medium">جاري دراسة المنهج</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-black text-amber-600">{inProgressCount}</span>
            <span className="text-xs text-slate-400 mr-2">طالب قيد التعلم</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-500 font-medium">متوسط معدل التحسن</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-black text-blue-600">+65%</span>
            <span className="text-xs text-emerald-600 font-bold mr-2">فارق التحصيل</span>
          </CardContent>
        </Card>
      </div>

      {/* جدول الطلاب والنتائج التفصيلية */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800">
              قائمة الطلاب ومقارنة درجات التقييم
            </CardTitle>
            <span className="text-xs text-slate-400">تحديث فوري</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">كود الطالب</th>
                <th className="py-3 px-4">اسم الطالب</th>
                <th className="py-3 px-4 text-center">الامتحان القبلي</th>
                <th className="py-3 px-4 text-center">الوحدات المنجزة</th>
                <th className="py-3 px-4 text-center">الامتحان البعدي</th>
                <th className="py-3 px-4 text-center">فارق التطور</th>
                <th className="py-3 px-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentRows.map((student) => {
                const diff = (student.preScore !== null && student.postScore !== null)
                  ? student.postScore - student.preScore
                  : null;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                      {student.studentId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {student.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {student.preScore !== null ? (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold">
                          {student.preScore} / 10
                        </span>
                      ) : (
                        <span className="text-slate-400">لم يؤدَ</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      {student.moduleProgress}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {student.postScore !== null ? (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          {student.postScore} / 10
                        </span>
                      ) : (
                        <span className="text-slate-400">قيد الانتظار</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {diff !== null ? (
                        <span className={`font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {diff >= 0 ? `+${diff}` : diff}
                        </span>
                      ) : (
                        <span className="text-slate-300">---</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {student.status === 'completed' && (
                        <Badge variant="success">مكتمل بالكامل</Badge>
                      )}
                      {student.status === 'in_progress' && (
                        <Badge variant="warning">قيد التعلم</Badge>
                      )}
                      {student.status === 'not_started' && (
                        <Badge variant="default">لم يبدأ بعد</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* قسم إدارة المكتبة الإثرائية وفيديوهات يوتيوب */}
      <div className="pt-6 border-t border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-asu-navy">
            <Film className="w-6 h-6 text-asu-gold-dark" />
            <h2 className="text-xl font-black">إدارة المكتبة المرئية الإثرائية (YouTube)</h2>
          </div>
          <Link href="/library" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>معاينة صفحة المكتبة كما يراها الطالب</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Button>
          </Link>
        </div>

        <LibraryManager initialVideos={videos} />
      </div>
    </div>
  );
}
