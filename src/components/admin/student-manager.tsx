'use client';

import React, { useState, useMemo } from 'react';
import { StudentAccount } from '@/lib/types/database';
import {
  createStudentAction,
  generateBatchStudentsAction,
  updateStudentAction,
  resetStudentPasswordAction,
  toggleBanStudentAction,
  deleteStudentAction,
  resetStudentToFreshAction,
} from '@/lib/actions/student.actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  UserPlus,
  Zap,
  Download,
  KeyRound,
  Edit2,
  Trash2,
  Ban,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Users,
  ShieldAlert,
  Sparkles,
  X,
  AlertTriangle,
  RotateCcw,
  FileText,
} from 'lucide-react';
import type { QuestionWithAnswer, ModuleData } from '@/lib/types/database';
import { StudentAnswersModal } from '@/components/admin/student-answers-modal';

interface StudentManagerProps {
  initialStudents: StudentAccount[];
  allQuestions?: QuestionWithAnswer[];
  modules?: ModuleData[];
}

export function StudentManager({ initialStudents, allQuestions = [], modules = [] }: StudentManagerProps) {
  const [students, setStudents] = useState<StudentAccount[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'banned'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // معاينة إجابات الطالب
  const [inspectingStudent, setInspectingStudent] = useState<StudentAccount | null>(null);

  // حساب إجمالي الأسئلة ديناميكياً للاختبار القبلي والبعدي الموحد
  const mainExamQuestionsCount =
    allQuestions.filter((q) => q.exam_type === 'pre_test' || q.exam_type === 'post_test').length || 12;
  const preQuestionsCount = mainExamQuestionsCount;
  const postQuestionsCount = mainExamQuestionsCount;

  // نسخ كلمة المرور السريعة
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // حالات النوافذ المنبثقة (Modals)
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentAccount | null>(null);
  const [resettingStudent, setResettingStudent] = useState<StudentAccount | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentAccount | null>(null);

  // حقول النماذج
  const [addForm, setAddForm] = useState({ username: '', password: '', fullName: '', phone: '' });
  const [batchCount, setBatchCount] = useState(10);
  const [batchPrefix, setBatchPrefix] = useState('user');
  const [editForm, setEditForm] = useState({ username: '', fullName: '', phone: '' });
  const [customResetPassword, setCustomResetPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // فلترة الطلاب والبحث
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchQuery =
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery);

      if (!matchQuery) return false;

      if (statusFilter === 'banned') return s.isBanned;
      if (statusFilter === 'completed') return s.isProfileCompleted && !s.isBanned;
      if (statusFilter === 'pending') return !s.isProfileCompleted && !s.isBanned;

      return true;
    });
  }, [students, searchQuery, statusFilter]);

  // التقسيم لصفحات (Pagination)
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  // إحصائيات سريعة
  const totalCount = students.length;
  const completedCount = students.filter((s) => s.isProfileCompleted && !s.isBanned).length;
  const pendingCount = students.filter((s) => !s.isProfileCompleted && !s.isBanned).length;
  const bannedCount = students.filter((s) => s.isBanned).length;

  // نسخ كلمة المرور
  const handleCopyPassword = (id: string, pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. إضافة طالب جديد
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.username.trim()) return;

    setIsLoading(true);
    const res = await createStudentAction(addForm);
    setIsLoading(false);

    if (res.success && res.student) {
      setStudents((prev) => [res.student!, ...prev]);
      setShowAddModal(false);
      setAddForm({ username: '', password: '', fullName: '', phone: '' });
      showToast(`تمت إضافة الطالب ${res.student.username} بنجاح`);
    } else {
      alert(res.error || 'فشلت إضافة الطالب');
    }
  };

  // 2. توليد دفعة طلاب
  const handleBatchGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await generateBatchStudentsAction(Number(batchCount), batchPrefix);
    setIsLoading(false);

    if (res.success) {
      setShowBatchModal(false);
      showToast(`تم بنجاح توليد ${res.count} حسابات طلاب جديدة!`);
      // إعادة تحميل القائمة
      const { getStudentsListAction } = await import('@/lib/actions/student.actions');
      const updated = await getStudentsListAction();
      setStudents(updated);
    } else {
      alert(res.error || 'فشل توليد الحسابات');
    }
  };

  // 3. تعديل بيانات طالب
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setIsLoading(true);
    const res = await updateStudentAction(editingStudent.id, editForm);
    setIsLoading(false);

    if (res.success) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                username: editForm.username.toLowerCase(),
                fullName: editForm.fullName,
                phone: editForm.phone,
                isProfileCompleted: !!(editForm.fullName && editForm.phone),
              }
            : s
        )
      );
      setEditingStudent(null);
      showToast('تم تحديث بيانات الطالب بنجاح');
    } else {
      alert(res.error || 'فشل التعديل');
    }
  };

  // 4. إعادة تعيين كلمة المرور
  const handleResetPassword = async () => {
    if (!resettingStudent) return;

    setIsLoading(true);
    const res = await resetStudentPasswordAction(resettingStudent.id, customResetPassword);
    setIsLoading(false);

    if (res.success && res.newPassword) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === resettingStudent.id ? { ...s, password: res.newPassword! } : s
        )
      );
      setResettingStudent(null);
      setCustomResetPassword('');
      showToast(`تم تعيين كلمة المرور الجديدة: ${res.newPassword}`);
    } else {
      alert(res.error || 'فشلت إعادة تعيين كلمة المرور');
    }
  };

  // 5. حظر / إلغاء حظر طالب
  const handleToggleBan = async (student: StudentAccount) => {
    const isCurrentlyBanned = student.isBanned;
    const confirmMsg = isCurrentlyBanned
      ? `هل ترغب في فك الحظر عن الطالب (${student.username})؟`
      : `هل أنت متأكد من حظر الطالب (${student.username})؟ لن يتمكن من تسجيل الدخول للمنصة.`;

    if (!confirm(confirmMsg)) return;

    const res = await toggleBanStudentAction(student.id);
    if (res.success) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, isBanned: res.isBanned! } : s
        )
      );
      showToast(
        res.isBanned
          ? `تم حظر الطالب ${student.username} بنجاح`
          : `تم إلغاء الحظر عن الطالب ${student.username}`
      );
    } else {
      alert(res.error || 'حدث خطأ');
    }
  };

  // 6. حذف طالب
  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;

    setIsLoading(true);
    const res = await deleteStudentAction(deletingStudent.id);
    setIsLoading(false);

    if (res.success) {
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id));
      setDeletingStudent(null);
      showToast('تم حذف الطالب نهائياً من النظام');
    } else {
      alert(res.error || 'فشل حذف الطالب');
    }
  };

  // 7. تصفير حساب الطالب وإعادته كطالب جديد لم يسجل بعد
  const handleResetToFresh = async (student: StudentAccount) => {
    const confirm = window.confirm(
      `هل أنت متأكد من تصفير حساب الطالب (${student.username})؟ سيتم مسح بياناته بالكامل ودرجاته وإعادته كحساب جديد في انتظار أول دخول مع توليد كلمة مرور جديدة.`
    );
    if (!confirm) return;

    setIsLoading(true);
    const res = await resetStudentToFreshAction(student.id);
    setIsLoading(false);

    if (res.success && res.student) {
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? res.student! : s))
      );
      showToast(`تم تصفير حساب ${student.username} بنجاح! كلمة المرور الجديدة: ${res.student.password}`);
    } else {
      alert(res.error || 'فشل تصفير حساب الطالب');
    }
  };

  // 8. تصدير كشف الحسابات CSV للتوزيع على الطلاب
  const handleExportCSV = () => {
    const headers = [
      'كود الدخول (Username)',
      'كلمة المرور (Password)',
      'الاسم الكامل (Full Name)',
      'رقم الهاتف (Phone)',
      'حالة التسجيل (Profile Status)',
      'حالة الحساب (Account Status)',
      'الاختبار القبلي (Pre-Test)',
      ...modules.map((m) => `اختبار ${m.title}`),
      'الاختبار البعدي (Post-Test)',
      'تقدم الموديولات (Module Progress)',
      'تاريخ الإنشاء (Created At)',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.username}"`,
      `"${s.password}"`,
      `"${s.fullName || 'لم يستكمل بياناته بعد'}"`,
      `"${s.phone || '---'}"`,
      `"${s.isProfileCompleted ? 'مكتمل' : 'في انتظار أول دخول'}"`,
      `"${s.isBanned ? 'محظور' : 'نشط'}"`,
      `"${s.preScore !== null ? s.preScore : '---'}"`,
      ...modules.map((m) => {
        const quiz = s.moduleQuizScores?.[m.id];
        return `"${quiz ? `${quiz.score}/${quiz.total}` : '---'}"`;
      }),
      `"${s.postScore !== null ? s.postScore : '---'}"`,
      `"${s.moduleProgress}"`,
      `"${s.createdAt ? new Date(s.createdAt).toLocaleDateString('ar-EG') : '---'}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `نتائج_وبحث_طلاب_جامعة_عين_شمس_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-right">
      {/* إشعار عائم (Toast Notification) */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-asu-gold/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-asu-gold-light shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* بطاقات الإحصائيات العلوية لحسابات الطلاب */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">إجمالي الحسابات</span>
            <Users className="w-4 h-4 text-asu-navy" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-asu-navy">{totalCount}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">طالب مسجل بالمنظومة</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">استكملوا بياناتهم</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600">{completedCount}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">طالب نشط بالاسم والهاتف</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">في انتظار أول دخول</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-600">{pendingCount}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">بانتظار تسليم الكود وتفعيله</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">الحسابات المحظورة</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-600">{bannedCount}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">موقوفة بقرار الإدارة</span>
        </div>
      </div>

      {/* شريط أدوات التحكم والبحث والإجراءات */}
      <Card className="border-slate-200/90 bg-white shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* مربع البحث الفوري */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="بحث بكود الطالب (user1001)، أو الاسم، أو الهاتف..."
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:bg-white transition-all"
              />
            </div>

            {/* أزرار الإجراءات الرئيسية */}
            <div className="flex flex-wrap items-center gap-2">
              {/* تصدير إكسيل */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="gap-1.5 text-xs border-slate-300 text-slate-700 hover:text-asu-navy"
                title="تصدير كشف كامل لتوزيع الأكواد وكلمات المرور على الطلاب"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>تصدير كشف التوزيع (CSV)</span>
              </Button>

              {/* توليد دفعة جديدة */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBatchModal(true)}
                className="gap-1.5 text-xs border-asu-gold/50 text-asu-gold-dark hover:bg-asu-gold-50"
              >
                <Zap className="w-4 h-4 text-asu-gold-dark" />
                <span>توليد دفعة حسابات</span>
              </Button>

              {/* إضافة طالب فردي */}
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-1.5 text-xs bg-asu-navy hover:bg-asu-navy-light text-white font-bold"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة طالب جديد</span>
              </Button>
            </div>
          </div>

          {/* فلاتر التصفية السريعة */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 text-[11px] font-bold ml-2">تصفية:</span>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-asu-navy text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({totalCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('completed');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              مكتملي البيانات ({completedCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              في انتظار أول دخول ({pendingCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('banned');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'banned'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              المحظورين ({bannedCount})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* جدول الطلاب المطور والحديث */}
      <Card className="border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-extrabold">
              <tr>
                <th className="py-3.5 px-4">كود الطالب (Username)</th>
                <th className="py-3.5 px-4">كلمة المرور</th>
                <th className="py-3.5 px-4">الاسم الكامل للطالب</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4 text-center">التقييم القبلي</th>
                <th className="py-3.5 px-4 text-center">التقييم البعدي</th>
                <th className="py-3.5 px-4 text-center">حالة الحساب</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    لا يوجد طلاب مطابقين لنتائج البحث أو الفلتر
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isRevealed = revealedPasswords[student.id];
                  const isCopied = copiedId === student.id;

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        student.isBanned ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      {/* كود الطالب */}
                      <td className="py-3.5 px-4 font-mono font-bold text-asu-navy">
                        <span className="inline-block px-2 py-1 rounded-md bg-slate-100 border border-slate-200/80">
                          {student.username}
                        </span>
                      </td>

                      {/* كلمة المرور مع زر الكشف والنسخ */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 font-mono text-[11px]">
                          <span className="font-bold text-slate-800 tracking-wider">
                            {isRevealed ? student.password : '••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(student.id)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                            title={isRevealed ? 'إخفاء' : 'إظهار'}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(student.id, student.password)}
                            className="text-slate-400 hover:text-asu-navy cursor-pointer p-0.5"
                            title="نسخ كلمة المرور"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* الاسم الكامل */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {student.fullName ? (
                          <span>{student.fullName}</span>
                        ) : (
                          <span className="text-slate-400 italic font-normal text-[11px]">
                            لم يستكمل بعد (أول دخول)
                          </span>
                        )}
                      </td>

                      {/* رقم الهاتف */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {student.phone ? (
                          <span>{student.phone}</span>
                        ) : (
                          <span className="text-slate-300">---</span>
                        )}
                      </td>

                      {/* درجات القبلي والبعدي */}
                      <td className="py-3.5 px-4 text-center">
                        {student.preScore !== null ? (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800">
                            {student.preScore} / {preQuestionsCount}
                          </span>
                        ) : (
                          <span className="text-slate-300">---</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {student.postScore !== null ? (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            {student.postScore} / {postQuestionsCount}
                          </span>
                        ) : (
                          <span className="text-slate-300">---</span>
                        )}
                      </td>

                      {/* حالة الحساب */}
                      <td className="py-3.5 px-4 text-center">
                        {student.isBanned ? (
                          <Badge variant="danger" className="gap-1">
                            <Ban className="w-3 h-3" />
                            <span>محظور</span>
                          </Badge>
                        ) : student.isProfileCompleted ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>نشط ومسجل</span>
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="gap-1">
                            <Clock className="w-3 h-3" />
                            <span>في انتظار الدخول</span>
                          </Badge>
                        )}
                      </td>

                      {/* الإجراءات السريعة (Actions) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          {/* معاينة إجابات الطالب والأنشطة */}
                          <button
                            type="button"
                            onClick={() => setInspectingStudent(student)}
                            className="p-2 sm:p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 cursor-pointer touch-manipulation"
                            title="عرض إجابات الطالب في الاختبارين القبلي والبعدي والأنشطة"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* تعديل البيانات */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStudent(student);
                              setEditForm({
                                username: student.username,
                                fullName: student.fullName,
                                phone: student.phone,
                              });
                            }}
                            className="p-2 sm:p-1.5 rounded-lg text-slate-500 hover:text-asu-navy hover:bg-slate-100 active:bg-slate-200 cursor-pointer touch-manipulation"
                            title="تعديل بيانات الطالب"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* إعادة تعيين كلمة المرور */}
                          <button
                            type="button"
                            onClick={() => {
                              setResettingStudent(student);
                              setCustomResetPassword('');
                            }}
                            className="p-2 sm:p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 active:bg-amber-100 cursor-pointer touch-manipulation"
                            title="إعادة تعيين كلمة المرور"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* تصفير الحساب والدرجات وإعادته كطالب جديد */}
                          <button
                            type="button"
                            onClick={() => handleResetToFresh(student)}
                            className="p-2 sm:p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 cursor-pointer touch-manipulation"
                            title="تصفير الحساب والدرجات وإعادته كطالب جديد لم يسجل بعد"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          {/* حظر / فك الحظر */}
                          <button
                            type="button"
                            onClick={() => handleToggleBan(student)}
                            className={`p-2 sm:p-1.5 rounded-lg cursor-pointer touch-manipulation ${
                              student.isBanned
                                ? 'text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100'
                            }`}
                            title={student.isBanned ? 'فك الحظر عن الطالب' : 'حظر الطالب'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>

                          {/* حذف الحساب */}
                          <button
                            type="button"
                            onClick={() => setDeletingStudent(student)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="حذف الطالب نهائياً"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ترقيم الصفحات (Pagination) */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              عرض الصفحة {currentPage} من أصل {totalPages} (إجمالي {filteredStudents.length} طالب)
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="text-xs"
              >
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="text-xs"
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 1. نافذة إضافة طالب فردي جديد                                             */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-right space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-asu-navy" />
                <span>إضافة حساب طالب جديد</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  كود الدخول / اسم المستخدم <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addForm.username}
                  onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                  placeholder="مثال: user1101"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  كلمة المرور الأولية (اختياري، تُولد عشوائياً إذا تُرِكت فارغة)
                </label>
                <input
                  type="text"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="اتركها فارغة للتوليد التلقائي"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  اسم الطالب (اختياري - سيكمله الطالب عند أول دخول)
                </label>
                <input
                  type="text"
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  placeholder="أدخل اسم الطالب إن توفر مسبقاً"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">رقم الهاتف (اختياري)</label>
                <input
                  type="tel"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="bg-asu-navy text-white font-bold"
                >
                  {isLoading ? 'جاري الإضافة...' : 'حفظ وإضافة الطالب'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. نافذة توليد دفعة حسابات (Batch Generate)                               */}
      {/* ========================================================================= */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-right space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-asu-gold-dark" />
                <span>توليد دفعة حسابات طلاب عشوائية</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchGenerate} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                يقوم هذا الخيار بإنشاء حسابات جديدة تلقائياً مع كلمات مرور عشوائية فريدة لكل طالب،
                لتكون جاهزة للطباعة والتوزيع فوراً.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">عدد الحسابات</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">بادئة الكود (Prefix)</label>
                  <input
                    type="text"
                    value={batchPrefix}
                    onChange={(e) => setBatchPrefix(e.target.value)}
                    placeholder="user"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-asu-gold-50/70 rounded-xl border border-asu-gold/30 text-xs text-asu-gold-dark">
                <span>مثال على الأكواد المتولدة: </span>
                <strong className="font-mono">{batchPrefix}1101, {batchPrefix}1102...</strong>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBatchModal(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="bg-asu-gold text-slate-950 font-black"
                >
                  {isLoading ? 'جاري التوليد...' : `توليد ${batchCount} طالب الآن`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. نافذة تعديل بيانات طالب                                                */}
      {/* ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-right space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-asu-navy" />
                <span>تعديل بيانات الطالب ({editingStudent.username})</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">كود الدخول / اسم المستخدم</label>
                <input
                  type="text"
                  required
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">الاسم الكامل للطالب</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  placeholder="أدخل الاسم الرسمي"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">رقم الهاتف / الواتساب</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingStudent(null)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="bg-asu-navy text-white font-bold"
                >
                  {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. نافذة إعادة تعيين كلمة المرور                                         */}
      {/* ========================================================================= */}
      {resettingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-right space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>تغيير كلمة المرور للطالب ({resettingStudent.username})</span>
              </h3>
              <button
                type="button"
                onClick={() => setResettingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                يمكنك كتابة كلمة مرور محددة للطالب أو ترك الحقل فارغاً لتوليد كلمة مرور عشوائية جديدة تلقائياً.
              </p>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">كلمة المرور الجديدة</label>
                <input
                  type="text"
                  value={customResetPassword}
                  onChange={(e) => setCustomResetPassword(e.target.value)}
                  placeholder="اتركها فارغة للتوليد العشوائي"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResettingStudent(null)}
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isLoading}
                  onClick={handleResetPassword}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  {isLoading ? 'جاري التعيين...' : 'تأكيد تغيير كلمة المرور'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. نافذة تأكيد حذف طالب                                                  */}
      {/* ========================================================================= */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-200 text-right space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">حذف حساب الطالب</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف حساب الطالب (
                <strong className="font-mono text-slate-800">{deletingStudent.username}</strong>
                )؟ سيتم حذف بياناته وسجل إجاباته نهائياً.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingStudent(null)}
              >
                تراجع
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isLoading}
                onClick={handleDeleteStudent}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {isLoading ? 'جاري الحذف...' : 'نعم، حذف الحساب'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. نافذة عرض وفحص إجابات الطالب والأنشطة */}
      {inspectingStudent && (
        <StudentAnswersModal
          student={inspectingStudent}
          allQuestions={allQuestions}
          modules={modules}
          onClose={() => setInspectingStudent(null)}
        />
      )}
    </div>
  );
}
