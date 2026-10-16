'use client';

import React, { useState } from 'react';
import type { StudentAccount, ModuleData, QuestionWithAnswer, AdminAccount } from '@/lib/types/database';
import type { LibraryVideo } from '@/lib/actions/library.actions';
import { StudentManager } from '@/components/admin/student-manager';
import { ModuleAdminManager } from '@/components/admin/module-admin-manager';
import { QuestionBankManager } from '@/components/admin/question-bank-manager';
import { LibraryManager } from '@/components/admin/library-manager';
import { AdminAccountsManager } from '@/components/admin/admin-accounts-manager';
import {
  Users,
  BookOpen,
  FileQuestion,
  Film,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardTabsProps {
  students: StudentAccount[];
  modules: ModuleData[];
  questions: QuestionWithAnswer[];
  videos: LibraryVideo[];
  admins?: AdminAccount[];
}

type TabType = 'students' | 'modules' | 'questions' | 'library' | 'admins';

export function AdminDashboardTabs({
  students,
  modules,
  questions,
  videos,
  admins = [],
}: AdminDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('students');

  return (
    <div className="space-y-6 text-right">
      {/* شريط التبويبات المتجاوب - Grid منظم 2x3 على الموبايل و 5x1 على الشاشات الكبيرة */}
      <div className="bg-white p-2 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {/* تبويب الطلاب */}
        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer touch-manipulation select-none active:scale-95 ${
            activeTab === 'students'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span className="truncate">شؤون الطلاب</span>
          <span
            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold shrink-0 ${
              activeTab === 'students' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {students.length}
          </span>
        </button>

        {/* تبويب الموديولات */}
        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer touch-manipulation select-none active:scale-95 ${
            activeTab === 'modules'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span className="truncate">الموديولات</span>
          <span
            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold shrink-0 ${
              activeTab === 'modules' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {modules.length}
          </span>
        </button>

        {/* تبويب بنك الأسئلة */}
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer touch-manipulation select-none active:scale-95 ${
            activeTab === 'questions'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileQuestion className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span className="truncate">بنك الأسئلة</span>
          <span
            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold shrink-0 ${
              activeTab === 'questions' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {questions.length}
          </span>
        </button>

        {/* تبويب المكتبة الإثرائية */}
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer touch-manipulation select-none active:scale-95 ${
            activeTab === 'library'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span className="truncate">المكتبة الإثرائية</span>
          <span
            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold shrink-0 ${
              activeTab === 'library' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {videos.length}
          </span>
        </button>

        {/* تبويب المشرفين */}
        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer touch-manipulation select-none active:scale-95 col-span-2 sm:col-span-1 ${
            activeTab === 'admins'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span className="truncate">حسابات المشرفين</span>
          <span
            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold shrink-0 ${
              activeTab === 'admins' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {admins.length}
          </span>
        </button>
      </div>

      {/* محتوى التبويب النشط */}
      <div>
        {activeTab === 'students' && (
          <StudentManager
            initialStudents={students}
            allQuestions={questions}
            modules={modules}
          />
        )}

        {activeTab === 'modules' && (
          <ModuleAdminManager initialModules={modules} />
        )}

        {activeTab === 'questions' && (
          <QuestionBankManager initialQuestions={questions} modules={modules} />
        )}

        {activeTab === 'library' && (
          <LibraryManager initialVideos={videos} />
        )}

        {activeTab === 'admins' && (
          <AdminAccountsManager initialAdmins={admins} />
        )}
      </div>
    </div>
  );
}
