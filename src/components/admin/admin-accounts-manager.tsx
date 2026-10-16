'use client';

import React, { useState, useMemo } from 'react';
import type { AdminAccount } from '@/lib/types/database';
import {
  updateAdminAccountAction,
  deleteAdminAccountAction,
  createAdminAccountAction,
} from '@/lib/actions/admin-accounts.actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  UserPlus,
  ShieldCheck,
  Edit2,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
  Sparkles,
  Phone,
  User,
  Shield,
  AlertTriangle,
} from 'lucide-react';

interface AdminAccountsManagerProps {
  initialAdmins: AdminAccount[];
}

export function AdminAccountsManager({ initialAdmins }: AdminAccountsManagerProps) {
  const [admins, setAdmins] = useState<AdminAccount[]>(initialAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // حالة نافذة التعديل
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // حالة نافذة إضافة مشرف جديد
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // إظهار إشعار مؤقت
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // تبديل إظهار / إخفاء كلمة المرور
  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // نسخ كلمة المرور
  const handleCopyPassword = (id: string, pwd: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pwd);
      setCopiedId(id);
      showToast('تم نسخ كلمة المرور إلى الحافظة');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // فتح نافذة التعديل
  const openEditModal = (admin: AdminAccount) => {
    setEditingAdmin(admin);
    setEditFullName(admin.fullName);
    setEditPhone(admin.phone || '');
    setEditPassword('');
  };

  const closeEditModal = () => {
    setEditingAdmin(null);
    setEditFullName('');
    setEditPhone('');
    setEditPassword('');
  };

  // حفظ تعديل المشرف
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (!editFullName.trim() || editFullName.trim().length < 2) {
      alert('يرجى إدخال اسم المشرف بشكل صحيح (حرفين على الأقل)');
      return;
    }

    setIsSubmittingEdit(true);
    const res = await updateAdminAccountAction(editingAdmin.id, {
      fullName: editFullName.trim(),
      phone: editPhone.trim(),
      password: editPassword.trim() || undefined,
    });
    setIsSubmittingEdit(false);

    if (res.success && res.admin) {
      setAdmins((prev) =>
        prev.map((a) => (a.id === editingAdmin.id ? res.admin! : a))
      );
      closeEditModal();
      showToast(`تم تحديث بيانات المشرف (${res.admin.fullName}) بنجاح`);
    } else {
      alert(res.error || 'حدث خطأ أثناء حفظ التعديلات');
    }
  };

  // فتح نافذة الإضافة
  const openAddModal = () => {
    const nextNum = admins.length + 1;
    setNewUsername(`admin${nextNum}`);
    setNewFullName('');
    setNewPassword(`Admin@Env2026#${nextNum < 10 ? '0' + nextNum : nextNum}`);
    setNewPhone('');
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewUsername('');
    setNewFullName('');
    setNewPassword('');
    setNewPhone('');
  };

  // إنشاء مشرف جديد
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      alert('يرجى إدخال اسم المستخدم');
      return;
    }
    if (!newFullName.trim()) {
      alert('يرجى إدخال الاسم الكامل للمشرف');
      return;
    }

    setIsSubmittingAdd(true);
    const res = await createAdminAccountAction({
      username: newUsername.trim(),
      fullName: newFullName.trim(),
      password: newPassword.trim(),
      phone: newPhone.trim(),
    });
    setIsSubmittingAdd(false);

    if (res.success && res.admin) {
      setAdmins((prev) => [...prev, res.admin!]);
      closeAddModal();
      showToast(`تمت إضافة المشرف الجديد (${res.admin.fullName}) بنجاح`);
    } else {
      alert(res.error || 'حدث خطأ أثناء إضافة المشرف');
    }
  };

  // حذف مشرف
  const handleDeleteAdmin = async (admin: AdminAccount) => {
    if (admins.length <= 1) {
      alert('لا يمكن حذف هذا الحساب: يجب الإبقاء على حساب مشرف واحد على الأقل في المنصة.');
      return;
    }

    const confirmMsg = `هل أنت متأكد تماماً من حذف حساب المشرف الأكاديمي:\n"${admin.fullName}" (${admin.username})؟\n\nلن يتمكن هذا الحساب من تسجيل الدخول بعد الحذف.`;
    if (!window.confirm(confirmMsg)) return;

    const res = await deleteAdminAccountAction(admin.id);
    if (res.success) {
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      showToast(`تم حذف حساب المشرف (${admin.username}) بنجاح`);
    } else {
      alert(res.error || 'فشل حذف الحساب');
    }
  };

  // الفلترة والبحث
  const filteredAdmins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return admins;

    return admins.filter(
      (a) =>
        a.username.toLowerCase().includes(q) ||
        a.fullName.toLowerCase().includes(q) ||
        (a.phone && a.phone.includes(q))
    );
  }, [admins, searchQuery]);

  return (
    <div className="space-y-6 text-right select-none">
      {/* إشعار عائم Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-asu-gold/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-asu-gold-light shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. بطاقات الإحصائيات العلوية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-asu-navy/10 text-asu-navy flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-asu-gold-dark" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">إجمالي المشرفين الأكاديميين</span>
            <span className="text-2xl font-black text-asu-navy font-mono">{admins.length}</span>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">الحسابات النشطة والمفعلة</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {admins.filter((a) => !a.isBanned).length}
            </span>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">صلاحيات الإدارة الكاملة</span>
            <span className="text-sm font-black text-slate-800 mt-1 block">كلية الدراسات العليا والبحوث البيئية</span>
          </div>
        </Card>
      </div>

      {/* 2. شريط البحث وإضافة مشرف جديد */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* شريط البحث */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، اسم المستخدم (admin1)، أو رقم الهاتف..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold text-xs sm:text-sm text-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* زر إضافة مشرف جديد */}
        <Button
          type="button"
          onClick={openAddModal}
          variant="gold"
          size="md"
          className="gap-2 font-bold shadow-md shadow-asu-gold/20 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مشرف جديد</span>
        </Button>
      </div>

      {/* 3. جدول حسابات المشرفين */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-extrabold">
              <tr>
                <th className="py-3.5 px-4">اسم المستخدم (Username)</th>
                <th className="py-3.5 px-4">الاسم الكامل للمشرف الأكاديمي</th>
                <th className="py-3.5 px-4">كلمة المرور</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4 text-center">الصلاحية</th>
                <th className="py-3.5 px-4 text-center">الإجراءات والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    لا يوجد مشرفين مطابقين لبحثك
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => {
                  const isRevealed = revealedPasswords[admin.id];
                  const isCopied = copiedId === admin.id;

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* اسم المستخدم */}
                      <td className="py-3.5 px-4 font-mono font-bold text-asu-navy">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-asu-navy font-mono font-black">
                            {admin.username}
                          </span>
                        </div>
                      </td>

                      {/* الاسم الكامل */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {admin.fullName}
                          </span>
                          <button
                            type="button"
                            onClick={() => openEditModal(admin)}
                            className="text-slate-400 hover:text-asu-navy p-1 rounded-md hover:bg-slate-100 transition-colors"
                            title="تعديل الاسم السريع"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ID: {admin.id}
                        </span>
                      </td>

                      {/* كلمة المرور مع زر إظهار ونسخ */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                            {isRevealed ? admin.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(admin.id)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100"
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
                            onClick={() => handleCopyPassword(admin.id, admin.password)}
                            className="text-slate-400 hover:text-asu-navy cursor-pointer p-1 rounded hover:bg-slate-100"
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

                      {/* رقم الهاتف */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {admin.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {admin.phone}
                          </span>
                        ) : (
                          <span className="text-slate-300">---</span>
                        )}
                      </td>

                      {/* الصلاحية */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant="gold"
                          className="text-[10px] px-2.5 py-0.5 font-bold gap-1 inline-flex items-center"
                        >
                          <ShieldCheck className="w-3 h-3 text-asu-gold-dark" />
                          <span>مشرف أكاديمي</span>
                        </Badge>
                      </td>

                      {/* الإجراءات والتحكم */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* زر تعديل الاسم والبيانات */}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(admin)}
                            className="h-8 px-2.5 gap-1.5 text-xs text-asu-navy border-slate-200 hover:bg-slate-100 font-bold"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-asu-gold-dark" />
                            <span>تعديل</span>
                          </Button>

                          {/* زر الحذف */}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAdmin(admin)}
                            disabled={admins.length <= 1}
                            className="h-8 px-2.5 gap-1 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                            title={admins.length <= 1 ? 'لا يمكن حذف المشرف الأخير' : 'حذف المشرف'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* تذييل الجدول */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            عرض <strong>{filteredAdmins.length}</strong> من أصل <strong>{admins.length}</strong> مشرف
          </span>
          <span className="text-[11px] text-slate-400">
            جميع الحسابات أعلاه تمتلك صلاحيات كاملة لإدارة المنصة والطلاب والاختبارات
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. نافذة منبثقة لتعديل بيانات المشرف (Modal)              */}
      {/* ========================================================= */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-2 border-asu-gold/40 text-right overflow-hidden flex flex-col">
            {/* الترويسة */}
            <div className="p-5 bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-5 h-5 text-asu-gold-light" />
                <h3 className="font-black text-base sm:text-lg">
                  تعديل حساب المشرف: {editingAdmin.username}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* النموذج */}
            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-4">
              {/* اسم المستخدم (للقراءة فقط) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600">
                  اسم المستخدم (كود الدخول)
                </label>
                <input
                  type="text"
                  value={editingAdmin.username}
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400">
                  كود الدخول ثابت لضمان استقرار سجلات المشرف
                </span>
              </div>

              {/* الاسم الكامل للمشرف */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  الاسم الكامل واللقب الأكاديمي <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="مثال: د. محمد مبارك (المشرف الأكاديمي العام)"
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold"
                  />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  رقم الهاتف للتواصل (اختياري)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="01000000000"
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-900 bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold"
                  />
                </div>
              </div>

              {/* تغيير كلمة المرور */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  كلمة المرور الجديدة (اتركها فارغة إذا لم ترغب في تغييرها)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="اكتب كلمة مرور جديدة أو اتركها فارغة"
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold"
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  كلمة المرور الحالية: <strong className="font-mono text-slate-600">{editingAdmin.password}</strong>
                </span>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeEditModal}
                  disabled={isSubmittingEdit}
                  className="rounded-xl border-slate-200 text-slate-700"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={isSubmittingEdit}
                  className="rounded-xl font-bold shadow-md shadow-asu-gold/20"
                >
                  {isSubmittingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. نافذة منبثقة لإضافة مشرف جديد (Modal)                  */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-2 border-asu-gold/40 text-right overflow-hidden flex flex-col">
            {/* الترويسة */}
            <div className="p-5 bg-gradient-to-r from-asu-navy-dark via-asu-navy to-[#182660] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-asu-gold-light" />
                <h3 className="font-black text-base sm:text-lg">إضافة مشرف أكاديمي جديد</h3>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* النموذج */}
            <form onSubmit={handleCreateAdmin} className="p-5 sm:p-6 space-y-4">
              {/* اسم المستخدم */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  اسم المستخدم (Username للتسجيل) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="مثال: admin11 أو dr_mohammed"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-900 bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold"
                />
              </div>

              {/* الاسم الكامل */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  الاسم الكامل واللقب الأكاديمي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="مثال: د. أحمد فتحي (مشرف وحدة التقييم)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold"
                />
              </div>

              {/* كلمة المرور */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  كلمة المرور للدخول <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Admin@Env2026#11"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold"
                />
              </div>

              {/* رقم الهاتف */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  رقم الهاتف للتواصل (اختياري)
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="01000000011"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-white focus:border-asu-gold focus:ring-1 focus:ring-asu-gold"
                />
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeAddModal}
                  disabled={isSubmittingAdd}
                  className="rounded-xl border-slate-200 text-slate-700"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={isSubmittingAdd}
                  className="rounded-xl font-bold shadow-md shadow-asu-gold/20"
                >
                  {isSubmittingAdd ? 'جاري الإضافة...' : 'إضافة المشرف'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
