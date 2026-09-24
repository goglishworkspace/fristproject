'use client';

import React, { useState } from 'react';
import type { StudentAccount, ModuleData, QuestionWithAnswer } from '@/lib/types/database';
import type { LibraryVideo } from '@/lib/actions/library.actions';
import { StudentManager } from '@/components/admin/student-manager';
import { ModuleAdminManager } from '@/components/admin/module-admin-manager';
import { QuestionBankManager } from '@/components/admin/question-bank-manager';
import { LibraryManager } from '@/components/admin/library-manager';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  FileQuestion,
  Film,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardTabsProps {
  students: StudentAccount[];
  modules: ModuleData[];
  questions: QuestionWithAnswer[];
  videos: LibraryVideo[];
}

type TabType = 'students' | 'modules' | 'questions' | 'library';

export function AdminDashboardTabs({
  students,
  modules,
  questions,
  videos,
}: AdminDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('students');

  return (
    <div className="space-y-6 text-right">
      {/* شريط التبويبات الفاخر الرئيسي */}
      <div className="bg-white p-2 rounded-3xl border border-slate-200/90 shadow-sm flex flex-wrap gap-2">
        {/* تبويب الطلاب */}
        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span>شؤون الطلاب والأكواد</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
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
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span>الموديولات والمحتوى</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
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
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileQuestion className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span>بنك أسئلة الاختبارات</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
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
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'library'
              ? 'bg-asu-navy text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4 shrink-0 text-asu-gold-light" />
          <span>المكتبة الإثرائية (YouTube)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              activeTab === 'library' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {videos.length}
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
          <QuestionBankManager initialQuestions={questions} />
        )}

        {activeTab === 'library' && (
          <LibraryManager initialVideos={videos} />
        )}
      </div>
    </div>
  );
}
