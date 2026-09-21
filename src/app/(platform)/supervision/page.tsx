import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users2, Award, BookOpen, GraduationCap } from 'lucide-react';

export default function SupervisionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
          <Users2 className="w-8 h-8 text-emerald-600" />
          <span>فريق الإعداد والإشراف العلمي</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          القائمون على إعداد المحتوى التعليمي وتصميم المنصة والتحكيم العلمي
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg text-slate-900">إعداد الباحث / الباحثة</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs md:text-sm text-slate-700">
            <p className="font-bold text-slate-900 text-base">الباحث القائم بالدراسة</p>
            <p className="text-slate-500">كلية التربية - قسم تكنولوجيا التعليم والتعلم الرقمي</p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block">عنوان البحث التكميلي:</span>
              <span className="text-slate-600 leading-relaxed block">
                أثر بيئة تعلم رقمية تفاعلية قائمة على الموديولات التعليمية في تنمية المفاهيم البيئية لدى الطلاب.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg text-slate-900">لجنة الإشراف العلمي</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs md:text-sm text-slate-700">
            <div className="border-r-2 border-emerald-500 pr-3">
              <p className="font-bold text-slate-900">أ.د / أستاذ المادة والمشرف الأول</p>
              <p className="text-slate-500 text-xs">أستاذ تكنولوجيا التعليم - كلية التربية</p>
            </div>
            <div className="border-r-2 border-teal-500 pr-3">
              <p className="font-bold text-slate-900">د / المشرف المشارك</p>
              <p className="text-slate-500 text-xs">أستاذ المناهج وطرق التدريس المساعد</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
