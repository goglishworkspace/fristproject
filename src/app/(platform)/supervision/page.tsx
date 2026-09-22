import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users2, Award, BookOpen, GraduationCap } from 'lucide-react';

export default function SupervisionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-asu-navy flex items-center gap-3">
          <Users2 className="w-8 h-8 text-asu-navy" />
          <span>فريق الإعداد والإشراف العلمي</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          جامعة عين شمس • كلية التربية • القائمون على إعداد المحتوى وتصميم المنصة والتحكيم العلمي
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-asu-navy/20 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="w-12 h-12 rounded-2xl bg-asu-navy-50 text-asu-navy flex items-center justify-center mb-2 border border-asu-navy/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg text-slate-900">إعداد الباحث / الباحثة</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs md:text-sm text-slate-700">
            <p className="font-bold text-slate-900 text-base">الباحث / محمد فاروق مبارك أحمد</p>
            <p className="text-slate-500">جامعة عين شمس - كلية التربية</p>
            <div className="p-3 bg-asu-navy-50/50 rounded-xl border border-asu-navy/10 space-y-1">
              <span className="font-bold text-asu-navy block">عنوان البحث التكميلي:</span>
              <span className="text-slate-600 leading-relaxed block">
                أثر بيئة تعلم رقمية تفاعلية قائمة على الموديولات التعليمية في تنمية المفاهيم البيئية لدى الطلاب.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-asu-gold/30 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="w-12 h-12 rounded-2xl bg-asu-gold-50 text-asu-gold-dark flex items-center justify-center mb-2 border border-asu-gold/20">
              <Award className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg text-slate-900">لجنة الإشراف العلمي</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs md:text-sm text-slate-700">
            <div className="border-r-3 border-asu-navy pr-3">
              <p className="font-bold text-slate-900">أ.د / أستاذ المادة والمشرف الأول</p>
              <p className="text-slate-500 text-xs">أستاذ تكنولوجيا التعليم - كلية التربية - جامعة عين شمس</p>
            </div>
            <div className="border-r-3 border-asu-gold pr-3">
              <p className="font-bold text-slate-900">د / المشرف المشارك</p>
              <p className="text-slate-500 text-xs">أستاذ المناهج وطرق التدريس المساعد - كلية التربية</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
