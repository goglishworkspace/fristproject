'use client';

import React, { useState } from 'react';
import type { ModuleData, ModuleSection, ModuleSlide, ScaffoldingItem } from '@/lib/types/database';
import {
  createModuleAction,
  updateModuleAction,
  deleteModuleAction,
} from '@/lib/actions/module.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Layers,
  Sparkles,
  ImageIcon,
  X,
  ExternalLink,
  BookOpen,
  Lightbulb,
  Info,
  FileText,
  HelpCircle,
  Compass,
} from 'lucide-react';

interface ModuleAdminManagerProps {
  initialModules: ModuleData[];
}

interface FormSlideState {
  id: string;
  imageUrl: string;
  hint: string;
  extraInfo: string;
  example: string;
  selfQuestion: string;
}

export function ModuleAdminManager({ initialModules }: ModuleAdminManagerProps) {
  const [modules, setModules] = useState<ModuleData[]>(initialModules);
  const [isAdding, setIsAdding] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // حالة نموذج الإضافة / التعديل
  const [formOrder, setFormOrder] = useState(1);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDuration, setFormDuration] = useState(30);

  // الشرائح مع بطاقات الدعم الأربعة
  const [formSlides, setFormSlides] = useState<FormSlideState[]>([
    {
      id: 'slide-1',
      imageUrl: '',
      hint: '',
      extraInfo: '',
      example: '',
      selfQuestion: '',
    },
  ]);

  // الدعامات الافتراضية للوحدة
  const [formDefaultHint, setFormDefaultHint] = useState('');
  const [formDefaultExtraInfo, setFormDefaultExtraInfo] = useState('');
  const [formDefaultExample, setFormDefaultExample] = useState('');
  const [formDefaultSelfQuestion, setFormDefaultSelfQuestion] = useState('');

  // الفقرات العلمية والنشاط
  const [formSections, setFormSections] = useState<ModuleSection[]>([
    { id: 'sec-1', title: '', content: '' },
  ]);
  const [formActivityTitle, setFormActivityTitle] = useState('نشاط تطبيقي');
  const [formActivityDesc, setFormActivityDesc] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAddModal = () => {
    const nextOrder = modules.length > 0 ? Math.max(...modules.map((m) => m.order)) + 1 : 1;
    setFormOrder(nextOrder);
    setFormTitle('');
    setFormSubtitle('');
    setFormDuration(30);
    setFormSlides([
      {
        id: 'slide-1',
        imageUrl: '',
        hint: '',
        extraInfo: '',
        example: '',
        selfQuestion: '',
      },
    ]);
    setFormDefaultHint('');
    setFormDefaultExtraInfo('');
    setFormDefaultExample('');
    setFormDefaultSelfQuestion('');
    setFormSections([{ id: 'sec-1', title: '', content: '' }]);
    setFormActivityTitle('نشاط تطبيقي');
    setFormActivityDesc('');
    setIsAdding(true);
    setEditingModule(null);
  };

  const openEditModal = (m: ModuleData) => {
    setEditingModule(m);
    setFormOrder(m.order);
    setFormTitle(m.title);
    setFormSubtitle(m.subtitle || '');
    setFormDuration(m.durationMinutes || 30);

    // تجهيز الشرائح
    if (m.slides && m.slides.length > 0) {
      setFormSlides(
        m.slides.map((s) => ({
          id: s.id,
          imageUrl: s.imageUrl,
          hint: s.scaffolding?.hint || '',
          extraInfo: s.scaffolding?.extraInfo || '',
          example: s.scaffolding?.example || '',
          selfQuestion: s.scaffolding?.selfQuestion || '',
        }))
      );
    } else if (m.images && m.images.length > 0) {
      setFormSlides(
        m.images.map((url, idx) => ({
          id: `slide-${idx + 1}`,
          imageUrl: url,
          hint: m.scaffolding?.hint || '',
          extraInfo: m.scaffolding?.extraInfo || '',
          example: m.scaffolding?.example || '',
          selfQuestion: m.scaffolding?.selfQuestion || '',
        }))
      );
    } else {
      setFormSlides([
        {
          id: 'slide-1',
          imageUrl: '',
          hint: '',
          extraInfo: '',
          example: '',
          selfQuestion: '',
        },
      ]);
    }

    setFormDefaultHint(m.scaffolding?.hint || '');
    setFormDefaultExtraInfo(m.scaffolding?.extraInfo || '');
    setFormDefaultExample(m.scaffolding?.example || '');
    setFormDefaultSelfQuestion(m.scaffolding?.selfQuestion || '');

    setFormSections(
      m.sections && m.sections.length > 0
        ? m.sections.map((s) => ({ ...s }))
        : [{ id: 'sec-1', title: '', content: '' }]
    );
    setFormActivityTitle(m.activity?.title || 'نشاط تطبيقي');
    setFormActivityDesc(m.activity?.description || '');
    setIsAdding(true);
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingModule(null);
  };

  // إدارة الشرائح
  const handleAddSlide = () => {
    setFormSlides((prev) => [
      ...prev,
      {
        id: `slide-${prev.length + 1}`,
        imageUrl: '',
        hint: '',
        extraInfo: '',
        example: '',
        selfQuestion: '',
      },
    ]);
  };

  const handleUpdateSlide = (idx: number, field: keyof FormSlideState, val: string) => {
    setFormSlides((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveSlide = (idx: number) => {
    setFormSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  // إدارة الفقرات داخل النموذج
  const handleAddSection = () => {
    setFormSections((prev) => [
      ...prev,
      { id: `sec-${prev.length + 1}`, title: '', content: '' },
    ]);
  };

  const handleUpdateSection = (idx: number, field: 'title' | 'content', val: string) => {
    setFormSections((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveSection = (idx: number) => {
    setFormSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('يرجى كتابة عنوان الوحدة');
      return;
    }

    setIsLoading(true);

    const cleanDefaultScaffolding: ScaffoldingItem = {
      hint: formDefaultHint.trim() || undefined,
      extraInfo: formDefaultExtraInfo.trim() || undefined,
      example: formDefaultExample.trim() || undefined,
      selfQuestion: formDefaultSelfQuestion.trim() || undefined,
    };

    const cleanSlides: ModuleSlide[] = formSlides
      .filter((s) => s.imageUrl.trim())
      .map((s, idx) => ({
        id: s.id || `slide-${idx + 1}`,
        imageUrl: s.imageUrl.trim(),
        scaffolding: {
          hint: s.hint.trim() || cleanDefaultScaffolding.hint,
          extraInfo: s.extraInfo.trim() || cleanDefaultScaffolding.extraInfo,
          example: s.example.trim() || cleanDefaultScaffolding.example,
          selfQuestion: s.selfQuestion.trim() || cleanDefaultScaffolding.selfQuestion,
        },
      }));

    const cleanImages = cleanSlides.map((s) => s.imageUrl);

    const cleanSections = formSections
      .filter((s) => s.title.trim() || s.content.trim())
      .map((s, idx) => ({
        id: s.id || `sec-${idx + 1}`,
        title: s.title.trim() || `فقرة ${idx + 1}`,
        content: s.content.trim(),
      }));

    if (editingModule) {
      const res = await updateModuleAction(editingModule.id, {
        order: Number(formOrder),
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        durationMinutes: Number(formDuration),
        images: cleanImages,
        slides: cleanSlides,
        scaffolding: cleanDefaultScaffolding,
        sections: cleanSections,
        activity: {
          id: editingModule.activity?.id || `act-${editingModule.id}`,
          title: formActivityTitle.trim() || 'نشاط تطبيقي',
          description: formActivityDesc.trim(),
          requiresSubmission: true,
        },
      });
      setIsLoading(false);

      if (res.success && res.module) {
        setModules((prev) =>
          prev
            .map((m) => (m.id === editingModule.id ? res.module! : m))
            .sort((a, b) => a.order - b.order)
        );
        closeModal();
        showToast('تم تحديث الوحدة التعليمية ومحتوى الدعامات بنجاح!');
      } else {
        alert(res.error || 'فشل تحديث الوحدة');
      }
    } else {
      const res = await createModuleAction({
        order: Number(formOrder),
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        durationMinutes: Number(formDuration),
        images: cleanImages,
        slides: cleanSlides,
        scaffolding: cleanDefaultScaffolding,
        sections: cleanSections,
        activity: {
          id: `act-${Date.now()}`,
          title: formActivityTitle.trim() || 'نشاط تطبيقي',
          description: formActivityDesc.trim(),
          requiresSubmission: true,
        },
      });
      setIsLoading(false);

      if (res.success && res.module) {
        setModules((prev) => [...prev, res.module!].sort((a, b) => a.order - b.order));
        closeModal();
        showToast('تمت إضافة الوحدة التعليمية وشرائح الدعامات بنجاح!');
      } else {
        alert(res.error || 'فشل إضافة الوحدة');
      }
    }
  };

  const handleDelete = async (module: ModuleData) => {
    const confirm = window.confirm(
      `هل أنت متأكد من حذف الوحدة التعليمية: "${module.title}"؟`
    );
    if (!confirm) return;

    setIsLoading(true);
    const res = await deleteModuleAction(module.id);
    setIsLoading(false);

    if (res.success) {
      setModules((prev) => prev.filter((m) => m.id !== module.id));
      showToast('تم حذف الوحدة التعليمية بنجاح');
    } else {
      alert(res.error || 'فشل حذف الوحدة');
    }
  };

  return (
    <div className="space-y-6 text-right select-none">
      {/* إشعار عائم */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-asu-gold/40 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-asu-gold-light shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* شريط الإجراءات العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-asu-navy flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-asu-gold-dark" />
            <span>إدارة الموديولات والشرائح والمساعدة والدعامات</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            إضافة وتعديل شرائح الموديول والبطاقات الأربع (تلميح، معلومة إضافية، مثال، اسأل نفسك)
          </p>
        </div>

        <Button
          type="button"
          onClick={openAddModal}
          variant="gold"
          size="md"
          className="gap-2 font-bold shadow-md shadow-asu-gold/20"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة وحدة تعليمية جديدة</span>
        </Button>
      </div>

      {/* قائمة الموديولات الحالية */}
      {modules.length === 0 ? (
        <Card className="p-10 text-center rounded-3xl border-dashed border-slate-300">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">لا توجد موديولات مضافة حالياً.</p>
          <p className="text-xs text-slate-400 mt-1">
            اضغط على زر &quot;إضافة وحدة تعليمية جديدة&quot; أعلاه لبدء بناء المحتوى.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => (
            <Card
              key={m.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-asu-gold/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-asu-navy text-white text-xs font-black flex items-center justify-center font-mono">
                      0{m.order}
                    </span>
                    <Badge variant="outline" className="text-[11px] gap-1 border-slate-300">
                      <Clock className="w-3 h-3 text-asu-gold-dark" />
                      <span>{m.durationMinutes} دقيقة</span>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(m)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-asu-navy hover:bg-slate-100 cursor-pointer"
                      title="تعديل الوحدة"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="حذف الوحدة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-asu-navy leading-snug">{m.title}</h4>
                  {m.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{m.subtitle}</p>
                  )}
                </div>

                {/* إحصائيات مكونات الموديول */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold flex items-center gap-1 font-mono">
                    <ImageIcon className="w-3 h-3 text-asu-gold-dark" />
                    <span>{m.slides?.length || m.images?.length || 0} شريحة مصورة</span>
                  </span>

                  <span className="bg-rose-50 text-rose-700 border border-rose-200/60 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    <span>المساعدة والدعامات (4 بطاقات)</span>
                  </span>

                  {m.activity && (
                    <span className="bg-asu-gold/15 text-asu-gold-dark px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>نشاط: {m.activity.title}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <a
                  href={`/modules/${m.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-asu-navy hover:text-asu-gold-dark"
                >
                  <span>معاينة صفحة الوحدة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <span className="text-[10px] text-slate-400 font-mono">ID: {m.id}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* نافذة منبثقة لإضافة / تعديل الموديول */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-asu-gold/40 text-right overflow-hidden">
            {/* الترويسة */}
            <div className="p-5 bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-asu-gold-light" />
                <h3 className="font-black text-base sm:text-lg">
                  {editingModule ? 'تعديل الوحدة التعليمية والشرائح' : 'إضافة وحدة تعليمية جديدة'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* النموذج */}
            <form onSubmit={handleSaveModule} className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
              {/* البيانات الأساسية */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">الترتيب</label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 bg-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    عنوان الوحدة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثال: الموديول الأول: البيئة من حولنا ... مسؤوليتنا جميعاً"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700">العنوان الفرعي / الوصف الموجز</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="مثال: استكشاف مكونات التوازن البيئي والتحديات المعاصرة"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">الوقت المقدر (بالدقائق)</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* =================================================================== */}
              {/* إدارة الشرائح مع بطاقات "المساعدة والدعامات" الأربع لكل شريحة        */}
              {/* =================================================================== */}
              <div className="space-y-3 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-black text-asu-navy flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-asu-gold-dark" />
                      <span>شرائح المحتوى المصور والمساعدة والدعامات</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ضع رابط الصورة لكل شريحة، واكتب محتوى البطاقات الأربع (تلميح، معلومة إضافية، مثال، اسأل نفسك)
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    onClick={handleAddSlide}
                    className="text-xs gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة شريحة جديدة</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {formSlides.map((slide, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-asu-navy text-white text-xs font-black flex items-center justify-center font-mono">
                            {sIdx + 1}
                          </span>
                          <span className="text-xs font-black text-asu-navy">
                            الشريحة رقم {sIdx + 1}
                          </span>
                        </div>

                        {formSlides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(sIdx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer text-xs flex items-center gap-1"
                            title="حذف هذه الشريحة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف الشريحة</span>
                          </button>
                        )}
                      </div>

                      {/* حقل رابط الصورة */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">
                          رابط صورة الشريحة (Cloudinary أو رابط مباشر) <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={slide.imageUrl}
                            onChange={(e) => handleUpdateSlide(sIdx, 'imageUrl', e.target.value)}
                            placeholder="https://res.cloudinary.com/... أو رابط مباشر للصورة"
                            className="flex-1 p-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 bg-white"
                          />
                          {slide.imageUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={slide.imageUrl}
                              alt={`معاينة شريحة ${sIdx + 1}`}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                            />
                          )}
                        </div>
                      </div>

                      {/* بطاقات المساعدة والدعامات الأربع الخاصة بهذه الشريحة */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60">
                        <span className="text-xs font-black text-rose-700 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5" />
                          <span>المساعدة والدعامات لهذه الشريحة (تظهر بالبطاقات الأربع):</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* 1. تلميح */}
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200/90 space-y-1">
                            <label className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3 text-amber-500" />
                              <span>1. تلميح</span>
                            </label>
                            <textarea
                              rows={2}
                              value={slide.hint}
                              onChange={(e) => handleUpdateSlide(sIdx, 'hint', e.target.value)}
                              placeholder="مثال: تأمل تأثير البيئة على الإنسان في صحته، مزاجه، وسعادته اليومية."
                              className="w-full p-1.5 text-xs text-slate-800 bg-amber-50/20 rounded-lg border border-slate-200/70"
                            />
                          </div>

                          {/* 2. معلومة إضافية */}
                          <div className="p-2.5 rounded-xl bg-white border border-rose-200/90 space-y-1">
                            <label className="text-[11px] font-black text-rose-600 flex items-center gap-1">
                              <Info className="w-3 h-3 text-rose-500" />
                              <span>2. معلومة إضافية</span>
                            </label>
                            <textarea
                              rows={2}
                              value={slide.extraInfo}
                              onChange={(e) => handleUpdateSlide(sIdx, 'extraInfo', e.target.value)}
                              placeholder="مثال: الإنسان يعتمد على البيئة في الغذاء، الهواء النقي، والماء النظيف."
                              className="w-full p-1.5 text-xs text-slate-800 bg-rose-50/20 rounded-lg border border-slate-200/70"
                            />
                          </div>

                          {/* 3. مثال */}
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 space-y-1">
                            <label className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-600" />
                              <span>3. مثال</span>
                            </label>
                            <textarea
                              rows={2}
                              value={slide.example}
                              onChange={(e) => handleUpdateSlide(sIdx, 'example', e.target.value)}
                              placeholder="مثال: العيش في بيئة نظيفة خضراء يساعد على تقليل التوتر وزيادة التركيز."
                              className="w-full p-1.5 text-xs text-slate-800 bg-slate-50 rounded-lg border border-slate-200/70"
                            />
                          </div>

                          {/* 4. اسأل نفسك */}
                          <div className="p-2.5 rounded-xl bg-white border border-sky-200/90 space-y-1">
                            <label className="text-[11px] font-black text-sky-700 flex items-center gap-1">
                              <HelpCircle className="w-3 h-3 text-sky-500" />
                              <span>4. اسأل نفسك</span>
                            </label>
                            <textarea
                              rows={2}
                              value={slide.selfQuestion}
                              onChange={(e) => handleUpdateSlide(sIdx, 'selfQuestion', e.target.value)}
                              placeholder="مثال: كيف تحس عندما تكون في مكان نظيف وجميل؟ وماذا يحدث لك في مكان ملوث؟"
                              className="w-full p-1.5 text-xs text-slate-800 bg-sky-50/20 rounded-lg border border-slate-200/70"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* إدارة الفقرات العلمية الإضافية (اختياري) */}
              <div className="space-y-3 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-asu-navy flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-asu-navy" />
                    <span>فقرات المحتوى العلمي المكتوب (اختياري)</span>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSection}
                    className="text-[11px] gap-1 h-7 border-slate-300"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة فقرة</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {formSections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-asu-navy font-mono">
                          فقرة رقم {sIdx + 1}
                        </span>
                        {formSections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="حذف هذه الفقرة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateSection(sIdx, 'title', e.target.value)}
                        placeholder="عنوان الفقرة..."
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                      />

                      <textarea
                        rows={2}
                        value={sec.content}
                        onChange={(e) => handleUpdateSection(sIdx, 'content', e.target.value)}
                        placeholder="موضوع ونص الفقرة..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* النشاط التطبيقي */}
              <div className="space-y-3 border-t border-slate-200 pt-5">
                <label className="text-xs font-black text-asu-navy flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-asu-gold-dark" />
                  <span>النشاط التطبيقي للوحدة (مطلوب من الطالب تسليمه)</span>
                </label>

                <div className="space-y-2 p-3.5 rounded-2xl bg-asu-gold/5 border border-asu-gold/20">
                  <input
                    type="text"
                    value={formActivityTitle}
                    onChange={(e) => setFormActivityTitle(e.target.value)}
                    placeholder="عنوان النشاط (مثال: نشاط عملي: تصميم خطة ترشيد بيئية)"
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  />

                  <textarea
                    rows={2}
                    value={formActivityDesc}
                    onChange={(e) => setFormActivityDesc(e.target.value)}
                    placeholder="وصف وتكليف النشاط المطلوب من الطالب تنفيذه وكتابة حله..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <Button type="button" variant="outline" size="md" onClick={closeModal} disabled={isLoading}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gold" size="md" disabled={isLoading} className="font-bold">
                  {isLoading ? 'جاري الحفظ...' : editingModule ? 'تحديث الوحدة والشرائح' : 'إضافة الوحدة'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
