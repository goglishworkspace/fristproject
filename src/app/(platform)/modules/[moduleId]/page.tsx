import { notFound, redirect } from 'next/navigation';
import { getModulesListAction, completeModuleAction } from '@/lib/actions/module.actions';
import { getStudentProgressAction, getStudentsListAction } from '@/lib/actions/student.actions';
import { ModuleFlowManager } from '@/components/modules/module-flow-manager';
import { getExamQuestionsAction } from '@/lib/actions/exam.actions';
import type { Question } from '@/lib/types/database';

interface ModulePageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function SingleModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const modules = await getModulesListAction();
  const moduleData = modules.find((m) => m.id === moduleId);

  if (!moduleData) {
    notFound();
  }

  const progress = await getStudentProgressAction();

  if (!progress.isLoggedIn) {
    redirect('/login');
  }

  if (!progress.isProfileCompleted && progress.role !== 'admin') {
    redirect('/complete-profile');
  }

  if (!progress.preTestCompleted && progress.role !== 'admin') {
    redirect('/pre-test');
  }

  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  const currentAllowedIndex =
    progress.role === 'admin' ? modules.length : progress.currentModuleIndex;

  if (moduleIndex > currentAllowedIndex) {
    redirect('/modules');
  }

  const isCompleted = currentAllowedIndex > moduleIndex;
  const isLastModule = moduleIndex === modules.length - 1;
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule = !isLastModule ? modules[moduleIndex + 1] : null;

  // جلب تسليم الطالب لهذا النشاط إن وُجد
  const students = await getStudentsListAction();
  const currentStudent = students.find(
    (s) =>
      s.id.toLowerCase() === progress.studentId?.toLowerCase() ||
      s.username.toLowerCase() === progress.username?.toLowerCase()
  );
  const existingSubmission = currentStudent?.activitySubmissions?.[moduleId] || null;
  const handleComplete = completeModuleAction.bind(null, moduleData.id);

  // جلب أسئلة اختبار هذه الوحدة إن وُجدت من بنك الأسئلة
  const allModuleQuestionsWithAnswers = await getExamQuestionsAction(`module_${moduleId}`);
  const safeModuleQuestions: Question[] = allModuleQuestionsWithAnswers.map((q) => ({
    id: q.id,
    exam_type: q.exam_type,
    question_type: q.question_type,
    question_text: q.question_text,
    options: q.options,
    order_index: q.order_index,
    created_at: q.created_at,
  }));
  const quizResult = currentStudent?.moduleQuizScores?.[moduleId] || null;
  const nextTargetUrl = isLastModule ? '/post-test' : nextModule ? `/modules/${nextModule.id}` : '/modules';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-16 text-right select-none">
      <ModuleFlowManager
        moduleData={moduleData}
        safeModuleQuestions={safeModuleQuestions}
        existingSubmission={existingSubmission}
        quizResult={quizResult}
        isCompleted={isCompleted}
        isLastModule={isLastModule}
        prevModule={prevModule}
        nextModule={nextModule}
        nextTargetUrl={nextTargetUrl}
        handleComplete={handleComplete}
      />
    </div>
  );
}
