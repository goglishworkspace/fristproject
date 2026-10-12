export type UserRole = 'admin' | 'student';

export type ExamType =
  | 'pre_test'
  | 'post_test'
  | 'pre_spatial_test'
  | 'post_spatial_test'
  | 'spatial_test'
  | `module_${string}`;

export interface UserProfile {
  id: string;
  student_id: string; // كود الدخول أو الرقم الأكاديمي
  full_name: string;
  role: UserRole;
  phone?: string;
  is_banned?: boolean;
  is_profile_completed?: boolean;
  created_at?: string;
}

export interface StudentActivitySubmission {
  answerText: string;
  fileUrl?: string;
  submittedAt: string;
}

export interface ModuleQuizResult {
  score: number;
  total: number;
  completedAt: string;
  answers: Record<string, number>;
}

export interface StudentAccount {
  id: string;
  username: string; // e.g. user1001
  password: string; // initial random or updated password
  fullName: string;
  phone: string;
  isProfileCompleted: boolean;
  isBanned: boolean;
  preScore: number | null;
  postScore: number | null;
  preTestAnswers?: Record<string, number>;
  postTestAnswers?: Record<string, number>;
  spatialPreScore?: number | null;
  spatialPostScore?: number | null;
  spatialPreTestAnswers?: Record<string, number>;
  spatialPostTestAnswers?: Record<string, number>;
  moduleQuizScores?: Record<string, ModuleQuizResult>; // e.g. { "module-1": { score: 5, total: 5, completedAt: "..." } }
  activitySubmissions?: Record<string, StudentActivitySubmission>;
  moduleProgress: string; // '0/2', '1/2', etc.
  status: 'completed' | 'in_progress' | 'not_started';
  createdAt: string;
  updatedAt?: string;
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string;
  points?: string[];
}

export interface ModuleActivity {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  requiresSubmission?: boolean;
}

export interface ScaffoldingItem {
  hint?: string;            // تلميح
  extraInfo?: string;        // معلومة إضافية
  example?: string;          // مثال
  selfQuestion?: string;     // اسأل نفسك
  mapRead?: string;          // اقرأ الخريطة
  patternDiscover?: string;  // اكتشف النمط
  spatialRelate?: string;    // اربط بالمكان
  infer?: string;            // استنتج
  spatialThink?: string;     // فكّر مكانيًا
  observe?: string;          // لاحظ
  compare?: string;          // قارن
  trackRelation?: string;    // تتبّع العلاقة
  distinguishEffect?: string;// ميّز التأثير
  causeEffect?: string;      // اربط الأسباب بالنتائج
  deepThink?: string;        // فكّر بعمق
}

export interface ModuleSlide {
  id: string;
  imageUrl: string;
  title?: string;
  scaffolding?: ScaffoldingItem;
}

export interface ModuleData {
  id: string; // e.g. "module-1"
  order: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  images: string[]; // URLs of images for the royal slider
  slides?: ModuleSlide[];
  scaffolding?: ScaffoldingItem;
  sections: ModuleSection[];
  activity: ModuleActivity;
  activities?: ModuleActivity[];
  createdAt?: string;
  updatedAt?: string;
}

export type Module = ModuleData;

export type QuestionType = 'multiple_choice' | 'true_false';

export interface Question {
  id: string;
  exam_type: ExamType;
  question_type?: QuestionType; // 'multiple_choice' | 'true_false'
  context_text?: string; // الفقرة / الموقف البيئي التمهيدي المنفصل
  question_text: string;
  options: string[];
  correct_option_index?: number;
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
