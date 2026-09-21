export type UserRole = 'admin' | 'student';

export type ExamType = 'pre_test' | 'post_test';

export interface UserProfile {
  id: string;
  student_id: string; // كود الدخول أو الرقم الأكاديمي
  full_name: string;
  role: UserRole;
  created_at?: string;
}

export interface Question {
  id: string;
  exam_type: ExamType;
  question_text: string;
  options: string[];
  order_index: number;
  created_at?: string;
}

// نسخة السؤال مع الإجابة الصحيحة (للسيرفر فقط - لا تخرج للمتصفح)
export interface QuestionWithAnswer extends Question {
  correct_option_index: number;
}

export interface ExamSubmission {
  id: string;
  student_id: string;
  exam_type: ExamType;
  score: number;
  total_questions: number;
  answers: Record<string, number>; // { question_id: selected_index }
  completed_at: string;
}

export interface StudentProgress {
  student_id: string;
  pre_test_completed: boolean;
  current_module_index: number;
  post_test_completed: boolean;
  updated_at: string;
}

export interface StudentSummary {
  profile: UserProfile;
  progress: StudentProgress | null;
  preTestSubmission: ExamSubmission | null;
  postTestSubmission: ExamSubmission | null;
}
