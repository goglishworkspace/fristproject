import type { Question } from '@/lib/types/database';
import allQuestions from '@/data/exam-questions.json';

export type ExamQuestionItem = Question & { correct_option_index: number };

export const DEFAULT_PRE_TEST_QUESTIONS: ExamQuestionItem[] =
  (allQuestions as ExamQuestionItem[]).filter((q) => q.exam_type === 'pre_test');

export const DEFAULT_POST_TEST_QUESTIONS: ExamQuestionItem[] =
  (allQuestions as ExamQuestionItem[]).filter((q) => q.exam_type === 'post_test');
