import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Library, BookOpen, ExternalLink, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EnrichmentLibraryPage() {
  const resources = [
    {
      title: 'دليل المفاهيم البيئية والتنوع الحيوي',
      type: 'كتاب إرشادي (PDF)',
      description: 'مرجع شامل يحتوي على تفصيل المصطلحات البيئية الأساسية والتصنيفات الحيوية.',
      size: '3.4 MB',
    },
    {
      title: 'أطلس النظم البيئية والمحميات الطبيعية',
      type: 'كتيب إثرائي مصور',
      description: 'صور وخرائط توضيحية لأهم النظم البيئية وتوزعها الجغرافي ودورات الطاقة فيها.',
      size: '5.1 MB',
    },
    {
      title: 'تقرير التنمية المستدامة والاقتصاد الدائري',
      type: 'دراسة مرجعية',
      description: 'مؤشرات التنمية المستدامة واستراتيجيات تدوير الموارد وتقليل الانبعاثات الكربونية.',
      size: '2.8 MB',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
          <Library className="w-8 h-8 text-emerald-600" />
          <span>المكتبة الإثرائية والمراجع</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          موارد إضافية ومراجع علمية لتعميق الفهم وتوسيع المدارك المعرفية حول موضوعات البرنامج
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((item, index) => (
          <Card key={index} className="border-slate-200 bg-white shadow-xs flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-teal-600">{item.type}</span>
              <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{item.size}</span>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs py-1 h-7">
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل المرجع</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
