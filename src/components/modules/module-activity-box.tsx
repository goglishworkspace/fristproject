'use client';

import React, { useState } from 'react';
import { submitModuleActivityAction, uploadActivityFileAction } from '@/lib/actions/module.actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import type { StudentActivitySubmission } from '@/lib/types/database';

interface ModuleActivityBoxProps {
  moduleId: string;
  activityTitle: string;
  activityDescription: string;
  existingSubmission?: StudentActivitySubmission | null;
}

export function ModuleActivityBox({
  moduleId,
  activityTitle,
  activityDescription,
  existingSubmission,
}: ModuleActivityBoxProps) {
  const [answerText, setAnswerText] = useState(existingSubmission?.answerText || '');
  const [fileUrl, setFileUrl] = useState(existingSubmission?.fileUrl || '');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(!existingSubmission);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadActivityFileAction(formData);

      if (res.success && res.fileUrl) {
        setFileUrl(res.fileUrl);
        setUploadedFileName(res.fileName || file.name);
        setStatusMessage({ type: 'success', text: `تم رفع الملف (${file.name}) بنجاح!` });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'فشل رفع الملف، يرجى المحاولة مرة ثانية' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'حدث خطأ أثناء رفع الملف' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى كتابة إجابتك أو ملخص عملك في صندوق النص' });
      return;
    }

    if (!fileUrl) {
      setStatusMessage({ type: 'error', text: 'يرجى رفع ملف حل النشاط بصيغة PDF أولاً قبل التسليم' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await submitModuleActivityAction(moduleId, answerText, fileUrl);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'تم تسليم النشاط وملف الـ PDF بنجاح وحفظه في سجلك الأكاديمي!' });
      setIsEditing(false);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'حدث خطأ أثناء تسليم النشاط' });
    }
  };

  return (
    <Card className="border-2 border-asu-gold/40 shadow-xl bg-gradient-to-br from-white via-white to-asu-gold/5 rounded-3xl overflow-hidden text-right">
      <CardHeader className="bg-gradient-to-r from-asu-navy/10 via-asu-gold/10 to-transparent border-b border-asu-gold/20 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-asu-gold/20 text-asu-gold-dark border border-asu-gold/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-asu-gold-dark" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="gold" className="text-[10px] sm:text-xs">
                  النشاط التطبيقي العملي
                </Badge>
                {existingSubmission && !isEditing && (
                  <Badge variant="success" className="gap-1 text-[10px] sm:text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>تم التسليم بنجاح</span>
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg sm:text-xl font-black text-asu-navy mt-1">
                {activityTitle}
              </CardTitle>
            </div>
          </div>

          {existingSubmission && !isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1.5 text-xs border-asu-gold/40 text-asu-navy hover:bg-asu-gold/10"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل الإجابة المسلّمة</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-8 space-y-6">
        {/* نص وصف النشاط والمطلوب */}
        <div className="p-4 rounded-2xl bg-asu-navy/5 border border-asu-navy/15 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <p>{activityDescription || 'قم بتنفيذ النشاط المطلوب وتدوين نتائجك في المربع أدناه.'}</p>
        </div>

        {/* إشعار الحالة إن وجد */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* نموذج تسليم النشاط */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                إجابتك وحل النشاط التطبيقي <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="اكتب إجابتك، ملاحظاتك، وتحليلك للنشاط التطبيقي بالتفصيل هنا..."
                rows={4}
                required
                disabled={isSubmitting}
                className="w-full p-3.5 sm:p-4 rounded-2xl border border-slate-300 focus:border-asu-gold focus:ring-2 focus:ring-asu-gold/20 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-hidden leading-relaxed"
              />
            </div>

            {/* قسم إرفاق ملف PDF للنشاط التطبيقي */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-asu-navy/20">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileUp className="w-4 h-4 text-asu-navy" />
                  <span>إرفاق ملف النشاط بصيغة PDF <span className="text-rose-500">*</span></span>
                </label>
                <p className="text-[11px] text-slate-500">
                  قم بتحميل ملف حل النشاط بتنسيق مستند PDF (.pdf) بحجم أقصى 10 ميجابايت.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <label
                    className={`cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-asu-navy/30 bg-white hover:bg-slate-100 text-xs font-black text-asu-navy shadow-xs transition-all active:scale-95 ${
                      isUploading ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    <FileUp className="w-4 h-4 text-asu-gold-dark" />
                    <span>{isUploading ? 'جاري رفع ملف PDF...' : 'اختر ملف PDF من الهاتف أو الكمبيوتر'}</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileUpload}
                      disabled={isUploading || isSubmitting}
                      className="hidden"
                    />
                  </label>

                  {uploadedFileName && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{uploadedFileName}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              {existingSubmission && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  إلغاء التعديل
                </Button>
              )}

              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isSubmitting}
                className="gap-2 shadow-lg shadow-asu-gold/20 font-extrabold"
              >
                <Send className="w-4 h-4 ml-1" />
                <span>{isSubmitting ? 'جاري الحفظ والتسليم...' : 'تسليم حل النشاط'}</span>
              </Button>
            </div>
          </form>
        ) : (
          /* عرض الإجابة المسلمة */
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                إجابتك المسجلة في هذا النشاط:
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-white p-3.5 rounded-xl border border-slate-200/60 font-medium">
                {existingSubmission?.answerText}
              </p>
            </div>

            {existingSubmission?.fileUrl && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">مستند النشاط:</span>
                <a
                  href={existingSubmission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200 px-3 py-1.5 rounded-xl shadow-2xs transition-all"
                >
                  <FileUp className="w-4 h-4 text-rose-600" />
                  <span>معاينة وتحميل ملف PDF المسلّم</span>
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                </a>
              </div>
            )}

            {existingSubmission?.submittedAt && (
              <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                تاريخ التسليم: {new Date(existingSubmission.submittedAt).toLocaleDateString('ar-EG', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
