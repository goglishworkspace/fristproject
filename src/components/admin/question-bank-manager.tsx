'use client';

import React, { useState } from 'react';
import type { QuestionWithAnswer, ExamType, QuestionType } from '@/lib/types/database';
import {
  createExamQuestionAction,
  updateExamQuestionAction,
  deleteExamQuestionAction,
} from '@/lib/actions/exam.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FileQuestion,
  Sparkles,
  X,
  Check,
  HelpCircle,
  ListOrdered,
  ToggleLeft,
} from 'lucide-react';

interface QuestionBankManagerProps {
  initialQuestions: QuestionWithAnswer[];
}

export function QuestionBankManager({ initialQuestions }: QuestionBankManagerProps) {
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>(initialQuestions);
  const [activeTab, setActiveTab] = useState<ExamType>('pre_test');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithAnswer | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<QuestionWithAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // حقول النموذج
  const [formExamType, setFormExamType] = useState<ExamType>('pre_test');
  const [formQuestionType, setFormQuestionType] = useState<QuestionType>('multiple_choice');
  const [formOrderIndex, setFormOrderIndex] = useState(1);
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const preQuestions = questions
    .filter((q) => q.exam_type === 'pre_test')
    .sort((a, b) => a.order_index - b.order_index);

  const postQuestions = questions
    .filter((q) => q.exam_type === 'post_test')
    .sort((a, b) => a.order_index - b.order_index);

  const currentList = activeTab === 'pre_test' ? preQuestions : postQuestions;

  // فتح نافذة الإضافة
  const openAddModal = () => {
    const list = activeTab === 'pre_test' ? preQuestions : postQuestions;
    const nextOrder = list.length > 0 ? Math.max(...list.map((q) => q.order_index)) + 1 : 1;
    setEditingQuestion(null);
    setFormExamType(activeTab);
    setFormQuestionType('multiple_choice');
    setFormOrderIndex(nextOrder);
    setFormQuestionText('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل
  const openEditModal = (q: QuestionWithAnswer) => {
    setEditingQuestion(q);
    setFormExamType(q.exam_type);
    const qType: QuestionType =
      q.question_type || (q.options.length === 2 ? 'true_false' : 'multiple_choice');
    setFormQuestionType(qType);
    setFormOrderIndex(q.order_index);
    setFormQuestionText(q.question_text);

    if (qType === 'true_false') {
      setFormOptions(['صح', 'خطأ']);
    } else {
      const opts = q.options.length === 4 ? [...q.options] : [...q.options, '', '', ''].slice(0, 4);
      setFormOptions(opts);
    }

    setFormCorrectIndex(q.correct_option_index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  // تبديل نوع السؤال داخل النموذج
  const handleTypeChange = (newType: QuestionType) => {
    setFormQuestionType(newType);
    if (newType === 'true_false') {
      setFormOptions(['صح', 'خطأ']);
      if (formCorrectIndex > 1) {
        setFormCorrectIndex(0);
      }
    } else {
      setFormOptions(['', '', '', '']);
      setFormCorrectIndex(0);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    setFormOptions((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = formQuestionText.trim();
    if (!cleanText) {
      alert('يرجى كتابة نص السؤال');
      return;
    }

    let cleanOpts: string[] = [];

    if (formQuestionType === 'true_false') {
      cleanOpts = ['صح', 'خطأ'];
      if (formCorrectIndex !== 0 && formCorrectIndex !== 1) {
        alert('يرجى تحديد الإجابة الصحيحة (صح أم خطأ)');
        return;
      }
    } else {
      cleanOpts = formOptions.map((o) => o.trim());
      if (cleanOpts.some((o) => !o)) {
        alert('يرجى ملء جميع الاختيارات الأربعة');
        return;
      }
      if (formCorrectIndex < 0 || formCorrectIndex > 3) {
        alert('يرجى تحديد الإجابة الصحيحة');
        return;
      }
    }

    setIsLoading(true);

    if (editingQuestion) {
      const res = await updateExamQuestionAction(editingQuestion.id, {
        exam_type: formExamType,
        question_type: formQuestionType,
        order_index: Number(formOrderIndex),
        question_text: cleanText,
        options: cleanOpts,
        correct_option_index: formCorrectIndex,
      });
      setIsLoading(false);

      if (res.success && res.question) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === editingQuestion.id ? res.question! : q))
        );
        closeModal();
        showToast('تم تحديث السؤال بنجاح');
      } else {
        alert(res.error || 'فشل تحديث السؤال');
      }
    } else {
      const res = await createExamQuestionAction({
        exam_type: formExamType,
        question_type: formQuestionType,
        order_index: Number(formOrderIndex),
        question_text: cleanText,
        options: cleanOpts,
        correct_option_index: formCorrectIndex,
      });
      setIsLoading(false);

      if (res.success && res.question) {
        setQuestions((prev) => [...prev, res.question!]);
        closeModal();
        showToast('تمت إضافة السؤال بنجاح');
      } else {
        alert(res.error || 'فشل إضافة السؤال');
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingQuestion) return;

    setIsLoading(true);
    const res = await deleteExamQuestionAction(deletingQuestion.id);
    setIsLoading(false);

    if (res.success) {
      setQuestions((prev) => prev.filter((q) => q.id !== deletingQuestion.id));
      setDeletingQuestion(null);
      showToast('تم حذف السؤال بنجاح');
    } else {
      alert(res.error || 'فشل حذف السؤال');
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

      {/* الشريط العلوي للتحكم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-asu-navy flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-asu-gold-dark" />
            <span>بنك أسئلة الاختبارات (اختياري + صح وغلط)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            إدارة الأسئلة الاختيارية وأسئلة الصواب والخطأ مع تحديد الإجابة النموذجية
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
          <span>إضافة سؤال جديد</span>
        </Button>
      </div>

      {/* التبويبات الفاخرة بين القبلي والبعدي */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('pre_test')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pre_test'
              ? 'bg-asu-navy text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>أسئلة الاختبار القبلي</span>
          <Badge
            variant={activeTab === 'pre_test' ? 'gold' : 'outline'}
            className="text-xs font-mono font-black px-2 py-0.5"
          >
            {preQuestions.length} سؤالاً
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('post_test')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'post_test'
              ? 'bg-asu-navy text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-asu-gold-light" />
          <span>أسئلة الاختبار البعدي</span>
          <Badge
            variant={activeTab === 'post_test' ? 'gold' : 'outline'}
            className="text-xs font-mono font-black px-2 py-0.5"
          >
            {postQuestions.length} سؤالاً
          </Badge>
        </button>
      </div>

      {/* قائمة الأسئلة المعروضة */}
      {currentList.length === 0 ? (
        <Card className="p-10 text-center rounded-3xl border-dashed border-slate-300">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">لا توجد أسئلة مضافة لهذا الاختبار بعد.</p>
          <p className="text-xs text-slate-400 mt-1">
            اضغط على &quot;إضافة سؤال جديد&quot; أعلاه لإدخال أول سؤال.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {currentList.map((q, idx) => {
            const isTrueFalse =
              q.question_type === 'true_false' || (q.options.length === 2 && (q.options[0] === 'صح' || q.options[0] === 'صواب'));

            return (
              <Card
                key={q.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-asu-gold/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-asu-navy text-white text-xs font-black flex items-center justify-center font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {isTrueFalse ? (
                          <Badge variant="gold" className="text-[10px] gap-1 px-2 py-0.5 font-bold">
                            <ToggleLeft className="w-3 h-3" />
                            <span>صح أم خطأ</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] gap-1 px-2 py-0.5 border-slate-300 text-slate-700">
                            <span>اختيار من متعدد (4 خيارات)</span>
                          </Badge>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">الترتيب: {q.order_index}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {q.question_text}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(q)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-asu-navy hover:bg-slate-100 cursor-pointer"
                      title="تعديل السؤال"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingQuestion(q)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="حذف السؤال"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* خيارات الإجابة مع تمييز الإجابة الصحيحة */}
                {isTrueFalse ? (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between font-bold ${
                        q.correct_option_index === 0
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : 'bg-slate-50/60 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-4 h-4 ${q.correct_option_index === 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>صح (صواب)</span>
                      </span>
                      {q.correct_option_index === 0 && (
                        <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          ✓ الإجابة الصحيحة
                        </span>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between font-bold ${
                        q.correct_option_index === 1
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : 'bg-slate-50/60 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <XCircle className={`w-4 h-4 ${q.correct_option_index === 1 ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>خطأ</span>
                      </span>
                      {q.correct_option_index === 1 && (
                        <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          ✓ الإجابة الصحيحة
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correct_option_index === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-slate-50/60 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="truncate">{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>صحيحة</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* نافذة منبثقة لإضافة أو تعديل السؤال */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border-2 border-asu-gold/40 text-right overflow-hidden">
            {/* الترويسة */}
            <div className="p-5 bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileQuestion className="w-5 h-5 text-asu-gold-light" />
                <h3 className="font-black text-base sm:text-lg">
                  {editingQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد لبنك الأسئلة'}
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
            <form onSubmit={handleSaveQuestion} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">نوع الاختبار</label>
                  <select
                    value={formExamType}
                    onChange={(e) => setFormExamType(e.target.value as ExamType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="pre_test">الاختبار القبلي (Pre-Test)</option>
                    <option value="post_test">الاختبار البعدي (Post-Test)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">ترتيب الظهور</label>
                  <input
                    type="number"
                    min={1}
                    value={formOrderIndex}
                    onChange={(e) => setFormOrderIndex(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* اختيار نوع السؤال: اختياري أو صح وغلط */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700">
                  نوع صيغة السؤال <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('multiple_choice')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formQuestionType === 'multiple_choice'
                        ? 'bg-white text-asu-navy shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>اختيار من متعدد (4 اختيارات)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange('true_false')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formQuestionType === 'true_false'
                        ? 'bg-white text-asu-navy shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>صواب أو خطأ (صح وغلط)</span>
                  </button>
                </div>
              </div>

              {/* نص السؤال */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  نص السؤال <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  placeholder="اكتب صيغة السؤال بوضوح هنا..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white leading-relaxed"
                />
              </div>

              {/* تحديد الإجابات حسب نوع السؤال */}
              {formQuestionType === 'true_false' ? (
                /* حالة سؤال صح وغلط */
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">
                    حدد الإجابة الصحيحة للعبارة بالضغط عليها: <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormCorrectIndex(0)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        formCorrectIndex === 0
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-6 h-6 ${formCorrectIndex === 0 ? 'text-emerald-600' : 'text-slate-400'}`}
                      />
                      <span className="text-sm">صح (صواب)</span>
                      {formCorrectIndex === 0 && (
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                          ✓ الإجابة المعتمدة
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormCorrectIndex(1)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        formCorrectIndex === 1
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle
                        className={`w-6 h-6 ${formCorrectIndex === 1 ? 'text-emerald-600' : 'text-slate-400'}`}
                      />
                      <span className="text-sm">خطأ</span>
                      {formCorrectIndex === 1 && (
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                          ✓ الإجابة المعتمدة
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* حالة سؤال اختيار من متعدد */
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      خيارات الإجابة (حدد الخيار الصحيح بالضغط عليه) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      الخيار {formCorrectIndex + 1} هو الإجابة الصحيحة
                    </span>
                  </div>

                  <div className="space-y-2">
                    {formOptions.map((opt, i) => {
                      const isSelectedAsCorrect = formCorrectIndex === i;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                            isSelectedAsCorrect
                              ? 'bg-emerald-50/80 border-emerald-400'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setFormCorrectIndex(i)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isSelectedAsCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isSelectedAsCorrect ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-400 inline-block" />
                            )}
                            <span>خيار {i + 1}</span>
                          </button>

                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => handleOptionChange(i, e.target.value)}
                            placeholder={`نص الاختيار ${i + 1}...`}
                            className="flex-1 p-1.5 text-xs text-slate-900 bg-transparent focus:outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <Button type="button" variant="outline" size="md" onClick={closeModal} disabled={isLoading}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gold" size="md" disabled={isLoading} className="font-bold">
                  {isLoading ? 'جاري الحفظ...' : editingQuestion ? 'تحديث السؤال' : 'إضافة السؤال'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد حذف السؤال */}
      {deletingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-200 text-right space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">حذف السؤال من الاختبار</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                هل أنت متأكد من حذف هذا السؤال؟ سيتم تحديث مجموع درجات الاختبار تلقائياً بعدد الأسئلة المتبقية.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingQuestion(null)}
              >
                تراجع
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isLoading}
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {isLoading ? 'جاري الحذف...' : 'نعم، حذف السؤال'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
