import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactUsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-asu-navy flex items-center gap-3">
          <Mail className="w-8 h-8 text-asu-navy" />
          <span>تواصل معنا والدعم الفني</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          جامعة عين شمس • يسعدنا استقبال استفساراتكم وملاحظاتكم الأكاديمية والتقنية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* معلومات الاتصال السريعة */}
        <div className="space-y-4">
          <Card className="border-slate-200/80 bg-white shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-asu-navy-50 text-asu-navy flex items-center justify-center shrink-0 border border-asu-navy/10">
                <Mail className="w-5 h-5 text-asu-navy" />
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-slate-500 font-medium">البريد الإلكتروني للدعم</span>
                <span className="block text-xs font-bold text-slate-800 font-mono">support@faculty.local</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-asu-gold-50 text-asu-gold-dark flex items-center justify-center shrink-0 border border-asu-gold/20">
                <MapPin className="w-5 h-5 text-asu-gold-dark" />
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-slate-500 font-medium">المقر الأكاديمي</span>
                <span className="block text-xs font-bold text-slate-800">كلية التربية - جامعة عين شمس</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* نموذج إرسال رسالة */}
        <Card className="md:col-span-2 border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-asu-navy" />
              <span>إرسال استفسار أو مقترح</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="الاسم الكامل" placeholder="أدخل اسمك" />
              <Input label="البريد الإلكتروني أو كود الطالب" placeholder="مثال: 2026101" />
            </div>
            <div className="space-y-1.5 text-right">
              <label className="block text-sm font-medium text-slate-700">نص الرسالة أو الاستفسار</label>
              <textarea
                rows={4}
                placeholder="اكتب استفسارك بالتفصيل..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <Button className="w-full sm:w-auto gap-2">
              <Send className="w-4 h-4 ml-1" />
              <span>إرسال الرسالة</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
