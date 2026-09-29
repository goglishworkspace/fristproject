-- ==============================================================================
-- COMPLETE SUPABASE SEED SCRIPT (FACULTY EDUCATIONAL PLATFORM)
-- سكريبت إنشاء الجداول وتخزين كافة بيانات الطلاب، الموديولات، والأسئلة كاملة
-- ==============================================================================

-- ==============================================================================
-- DATABASE SCHEMA FOR FACULTY EDUCATIONAL PLATFORM (SUPABASE / POSTGRESQL)
-- كلية التربية • جامعة عين شمس • منصة بيئتي التعليمية التفاعلية
-- ==============================================================================

-- 1. جدول حسابات الطلاب والإدارة (Accounts & Credentials)
create table if not exists public.accounts (
  id text primary key,
  username text unique not null,
  password text not null,
  full_name text default '' not null,
  phone text default '' not null,
  role text default 'student' not null,
  is_profile_completed boolean default false not null,
  is_banned boolean default false not null,
  pre_score int,
  post_score int,
  pre_test_answers jsonb default '{}'::jsonb,
  post_test_answers jsonb default '{}'::jsonb,
  module_quiz_scores jsonb default '{}'::jsonb,
  activity_submissions jsonb default '{}'::jsonb,
  module_progress text default '0/2' not null,
  status text default 'not_started' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. جدول بنك الأسئلة (Question Bank)
create table if not exists public.questions (
  id text primary key,
  exam_type text not null, -- pre_test, post_test, module_module-1, etc.
  question_type text default 'multiple_choice' not null, -- multiple_choice, true_false
  question_text text not null,
  options jsonb not null, -- ["أ", "ب", "ج", "د"] أو ["صح", "خطأ"]
  correct_option_index smallint not null,
  order_index int default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. جدول الموديولات والوحدات التعليمية (Modules)
create table if not exists public.modules (
  id text primary key,
  "order" int default 1 not null,
  title text not null,
  subtitle text default '' not null,
  duration_minutes int default 30 not null,
  images jsonb default '[]'::jsonb,
  slides jsonb default '[]'::jsonb,
  scaffolding jsonb,
  sections jsonb default '[]'::jsonb,
  activity jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. جدول المكتبة الإثرائية (Library Videos)
create table if not exists public.library_videos (
  id text primary key,
  title text not null,
  description text default '' not null,
  youtube_url text not null,
  youtube_id text not null,
  category text default '' not null,
  duration text default '' not null,
  added_at text not null
);

-- تمكين الأمان RLS (Row Level Security)
alter table public.accounts enable row level security;
alter table public.questions enable row level security;
alter table public.modules enable row level security;
alter table public.library_videos enable row level security;

-- السماح بالوصول الكامل عبر مفتاح الخدمة Service Role، والسماح بالقراءة للمستخدمين
create policy "Allow public read access to modules" on public.modules for select using (true);
create policy "Allow public read access to library" on public.library_videos for select using (true);
create policy "Allow public read access to questions" on public.questions for select using (true);

-- ==============================================================================
-- 5. إعداد مستودع التخزين السحابي لملفات الأنشطة (Supabase Storage Bucket: activity-files)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('activity-files', 'activity-files', true)
on conflict (id) do nothing;

-- سياسات الأمان لـ Storage
create policy "Allow public read on activity files"
on storage.objects for select
using (bucket_id = 'activity-files');

create policy "Allow authenticated & anon uploads to activity files"
on storage.objects for insert
with check (bucket_id = 'activity-files');



-- ==============================================================================
-- 2. SEED ACCOUNTS (STUDENTS)
-- ==============================================================================
INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1001',
  'user1001',
  '123456',
  'احمد رمزي',
  '01093341944',
  'student',
  true,
  false,
  NULL,
  NULL,
  '{"q-post-4":0,"q-pre-1":2,"q-post-6":1,"q-post-3":2,"q-pre-5":1,"q-pre-3":2,"q-pre-6":1,"q-pre-2":3,"q-post-2":3,"q-post-1":2,"q-post-5":2,"q-pre-4":1}'::jsonb,
  '{"q-unified-87":1,"q-unified-90":1,"q-unified-89":1,"q-unified-78":1,"q-unified-98":1,"q-unified-62":1,"q-unified-79":1,"q-unified-82":1,"q-unified-84":1,"q-unified-75":1,"q-unified-95":1,"q-unified-61":1,"q-unified-100":1,"q-unified-93":1,"q-unified-92":1,"q-unified-64":1,"q-unified-85":1,"q-unified-73":1,"q-unified-83":1}'::jsonb,
  '{"module-1":{"score":3,"total":10,"completedAt":"2026-09-28T18:29:40.779Z","answers":{"q-mod1-1":3,"q-mod1-2":1,"q-mod1-3":0,"q-mod1-4":2,"q-mod1-5":3,"q-mod1-6":3,"q-mod1-7":1,"q-mod1-8":3,"q-mod1-9":3,"q-mod1-10":2}},"module-4":{"score":3,"total":10,"completedAt":"2026-09-29T11:14:53.392Z","answers":{"q-mod4-1":3,"q-mod4-2":0,"q-mod4-3":3,"q-mod4-4":0,"q-mod4-5":2,"q-mod4-6":3,"q-mod4-7":2,"q-mod4-8":3,"q-mod4-9":1,"q-mod4-10":2}}}'::jsonb,
  '{"module-1":{"answerText":"=== تقرير إجابات الأنشطة التطبيقية للوحدة الأولى ===\n\n--- النشاط الأول: مكونات البيئة من حولي ---\n1. المكون: (لم يُحدد) | النوع: طبيعي\n2. المكون: (لم يُحدد) | النوع: طبيعي\n3. المكون: (لم يُحدد) | النوع: طبيعي\n4. المكون: (لم يُحدد) | النوع: بشري\n5. المكون: (لم يُحدد) | النوع: بشري\n6. المكون: (لم يُحدد) | النوع: بشري\n\n--- النشاط الثاني: أين تتركز المشكلة البيئية؟ ---\nالمكان الأكثر تعرضًا للتلوث: (لم يُحدد)\nسبب الاختيار والتفسير: (لم يُحدد)\n\n--- النشاط الثالث: اختر الموقع الأنسب ---\nالموقع المقترح الأنسب: الموقع (3)\nالسبب المكاني الأول (١): (لم يُحدد)\nالسبب المكاني الثاني (٢): (لم يُحدد)","fileUrl":"","submittedAt":"2026-09-28T18:27:14.192Z"},"module-2":{"answerText":"=== تقرير إجابات الأنشطة التطبيقية (النشاط الثاني: أين تتركز المشكلة البيئية؟) ===\n\n\n--- النشاط الثاني: أين تتركز المشكلة البيئية؟ ---\n١. مصدر التلوث: (لم يُحدد)\n٢. مسار انتقال التلوث: (لم يُحدد)\n٣. المنطقة الأكثر تأثرًا: (لم يُحدد)","fileUrl":"","submittedAt":"2026-09-29T09:26:31.030Z"},"module-4":{"answerText":"=== تقرير إجابات الأنشطة التطبيقية (النشاط الأول: أيّهما أكثر استدامة؟) ===\n\n--- النشاط الأول: أيّهما أكثر استدامة؟ ---\n١. المنطقة الأكثر استدامة: (لم تُحدد)\n٢. الأدلة من الجدول:\n   - الدليل (١): ربير\n   - الدليل (٢): بيريبر\n   - الدليل (٣): بيربي\n٣. مقترحات تحسين استدامة المنطقة الأقل استدامة: بريربير","fileUrl":"","submittedAt":"2026-09-29T11:14:23.550Z"}}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1002',
  'user1002',
  'YGXQG2',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{"q-pre-1":2,"q-pre-2":2,"q-pre-3":1,"q-pre-4":2,"q-pre-5":2,"q-pre-6":1}'::jsonb,
  '{"q-post-1":0,"q-post-2":3,"q-post-3":2,"q-post-4":1,"q-post-5":3,"q-post-6":1}'::jsonb,
  '{}'::jsonb,
  '{"module-1":{"answerText":"يسشيشيشيش","fileUrl":"http://localhost:3000/modules/module-1","submittedAt":"2026-09-24T12:08:15.783Z"}}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1003',
  'user1003',
  'hB2n6e',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1004',
  'user1004',
  'tZ5w3q',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1005',
  'user1005',
  '6zuAJ2',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1006',
  'user1006',
  'WgRvtR',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1007',
  'user1007',
  'vMh6DN',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1008',
  'user1008',
  'RvcGj3',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1009',
  'user1009',
  '3Y35hN',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1010',
  'user1010',
  'P45Dsb',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1011',
  'user1011',
  'msnFZa',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1012',
  'user1012',
  '72NeVH',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1013',
  'user1013',
  'FJcgn4',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1014',
  'user1014',
  'AKwDTt',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1015',
  'user1015',
  '6SVbQZ',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1016',
  'user1016',
  'jysx9j',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1017',
  'user1017',
  '5KG7yq',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1018',
  'user1018',
  'RgSCPJ',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1019',
  'user1019',
  '2aKJcg',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1020',
  'user1020',
  'WEseaG',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1021',
  'user1021',
  'zd2m5x',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1022',
  'user1022',
  'tHLDRh',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1023',
  'user1023',
  'ZLfA7x',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1024',
  'user1024',
  'DFQESy',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1025',
  'user1025',
  'KcVGe5',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1026',
  'user1026',
  '9dQMPv',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1027',
  'user1027',
  '3WDq7j',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1028',
  'user1028',
  '6AVrH6',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1029',
  'user1029',
  'pEz9Yu',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1030',
  'user1030',
  'A2kFLf',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1031',
  'user1031',
  'XQRmsJ',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1032',
  'user1032',
  'ujJdb6',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1033',
  'user1033',
  'G6SCHB',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1034',
  'user1034',
  'JEF9Gd',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1035',
  'user1035',
  '6VwX6m',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1036',
  'user1036',
  'XPprfz',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1037',
  'user1037',
  'ByvQ9Z',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1038',
  'user1038',
  '9hYDs4',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1039',
  'user1039',
  'buSN33',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1040',
  'user1040',
  '5kv7bP',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1041',
  'user1041',
  'LfRBws',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1042',
  'user1042',
  'Xs5J8B',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1043',
  'user1043',
  'BNh3ZD',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1044',
  'user1044',
  'DpbW2b',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1045',
  'user1045',
  '2RJC5m',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1046',
  'user1046',
  'Jh3832',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1047',
  'user1047',
  'ydWE8d',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1048',
  'user1048',
  'sc5n7q',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1049',
  'user1049',
  'pBRmUz',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1050',
  'user1050',
  'vP2kgS',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1051',
  'user1051',
  'UfhhBe',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1052',
  'user1052',
  'sdxwdD',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1053',
  'user1053',
  'aLbaD6',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1054',
  'user1054',
  'Exfua7',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1055',
  'user1055',
  'EqZCsh',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1056',
  'user1056',
  'TBUkYf',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1057',
  'user1057',
  'PPLtkN',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1058',
  'user1058',
  'wmjAZ7',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1059',
  'user1059',
  '7axWHt',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1060',
  'user1060',
  'T2Svmk',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1061',
  'user1061',
  'awEECu',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1062',
  'user1062',
  'z2bgHB',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1063',
  'user1063',
  'NCPLAP',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1064',
  'user1064',
  'QsXYNx',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1065',
  'user1065',
  'KGAPS7',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1066',
  'user1066',
  '8SxbmM',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1067',
  'user1067',
  'q5yR4F',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1068',
  'user1068',
  'bZ6Y8P',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1069',
  'user1069',
  'Yp9AkM',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1070',
  'user1070',
  'HWsFyj',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1071',
  'user1071',
  'ZxStBJ',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1072',
  'user1072',
  'fBWkTe',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1073',
  'user1073',
  'rCcsXy',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1074',
  'user1074',
  'Fd23CE',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1075',
  'user1075',
  'kPucW6',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1076',
  'user1076',
  '5JjnmJ',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1077',
  'user1077',
  'PUzyJw',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1078',
  'user1078',
  '2qUeHg',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1079',
  'user1079',
  'Ept5jS',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1080',
  'user1080',
  'euMRSR',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1081',
  'user1081',
  'EFDZaD',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1082',
  'user1082',
  '3Dj8Za',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1083',
  'user1083',
  'krXZgn',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1084',
  'user1084',
  'WUrey4',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1085',
  'user1085',
  'bMdUME',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1086',
  'user1086',
  'merufh',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1087',
  'user1087',
  's9hye7',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1088',
  'user1088',
  'nqhmVM',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1089',
  'user1089',
  'RL98Ne',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1090',
  'user1090',
  'GQrwuT',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1091',
  'user1091',
  'Y8JAmg',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1092',
  'user1092',
  'm35bKW',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1093',
  'user1093',
  'EzhAq5',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1094',
  'user1094',
  'UqAsca',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1095',
  'user1095',
  'ztAy5m',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1096',
  'user1096',
  'FYBv6f',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1097',
  'user1097',
  'BMQ855',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1098',
  'user1098',
  '9BjF2E',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1099',
  'user1099',
  'saGwqH',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

INSERT INTO public.accounts (id, username, password, full_name, phone, role, is_profile_completed, is_banned, pre_score, post_score, pre_test_answers, post_test_answers, module_quiz_scores, activity_submissions, module_progress, status, created_at) VALUES (
  'std-1100',
  'user1100',
  'YF9AYy',
  '',
  '',
  'student',
  false,
  false,
  NULL,
  NULL,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '0/2',
  'not_started',
  '2026-09-22T15:20:50.381Z'
) ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  is_profile_completed = EXCLUDED.is_profile_completed,
  is_banned = EXCLUDED.is_banned,
  pre_score = EXCLUDED.pre_score,
  post_score = EXCLUDED.post_score,
  pre_test_answers = EXCLUDED.pre_test_answers,
  post_test_answers = EXCLUDED.post_test_answers,
  module_quiz_scores = EXCLUDED.module_quiz_scores,
  activity_submissions = EXCLUDED.activity_submissions,
  module_progress = EXCLUDED.module_progress,
  status = EXCLUDED.status;

-- ==============================================================================
-- 3. SEED QUESTIONS (EXAM BANK)
-- ==============================================================================
INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-1',
  'pre_test',
  'multiple_choice',
  'ما العامل الأشمل في اختلاف المشكلات البيئية بين الأماكن؟',
  '["الكثافة السكانية","النشاط الاقتصادي","الخصائص المكانية","الموارد الطبيعية"]'::jsonb,
  2,
  1,
  '2026-09-29T12:25:19.584Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-2',
  'pre_test',
  'multiple_choice',
  'أي مما يلي مكوّن غير حي في البيئة؟',
  '["التربة","النباتات","الإنسان","الحيوانات"]'::jsonb,
  0,
  2,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-3',
  'pre_test',
  'multiple_choice',
  'أي الموارد التالية غير متجدد؟',
  '["الشمس","الرياح","المياه","النفط"]'::jsonb,
  3,
  3,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-4',
  'pre_test',
  'multiple_choice',
  'إزالة الغطاء النباتي تؤدي غالبًا إلى:',
  '["زيادة التنوع الحيوي","زيادة تعرية التربة","زيادة خصوبة التربة","ثبات التربة"]'::jsonb,
  1,
  4,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-5',
  'pre_test',
  'multiple_choice',
  'أفضل وسيلة لإظهار توزيع مشكلة بيئية هي:',
  '["الجدول","الصورة","النص","الخريطة"]'::jsonb,
  3,
  5,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-6',
  'pre_test',
  'multiple_choice',
  'ما العنصر الذي يفسر رموز الخريطة؟',
  '["الاتجاه","المفتاح","المقياس","العنوان"]'::jsonb,
  1,
  6,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-7',
  'pre_test',
  'multiple_choice',
  'انتقال تلوث الهواء بين منطقتين يرتبط أكثر بـ:',
  '["نوع الصخور","درجة الانحدار","اتجاه الرياح","نوع التربة"]'::jsonb,
  2,
  7,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-8',
  'pre_test',
  'multiple_choice',
  'ما الأكثر فائدة لتفسير تركز التلوث في منطقة؟',
  '["عدد السكان","مواقع مصادر التلوث","مساحة المنطقة","شكل حدودها"]'::jsonb,
  1,
  8,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-9',
  'pre_test',
  'multiple_choice',
  'أي موقف يمثل استفادة الإنسان المباشرة من البيئة؟',
  '["استخدام مياه الأنهار","معالجة مياه الصرف","حماية المحميات","إعادة تدوير المخلفات"]'::jsonb,
  0,
  9,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-10',
  'pre_test',
  'multiple_choice',
  'أي مصدر للطاقة أكثر استدامة؟',
  '["الغاز الطبيعي","النفط","الفحم","الطاقة الشمسية"]'::jsonb,
  3,
  10,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-11',
  'pre_test',
  'multiple_choice',
  'أي حالة تزيد احتمال انجراف التربة؟',
  '["كثافة الأشجار","انحدار السطح وقلة النباتات","استواء السطح","زيادة الغطاء النباتي"]'::jsonb,
  1,
  11,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-12',
  'pre_test',
  'multiple_choice',
  'أي قرار يراعي حقوق الأجيال القادمة؟',
  '["زيادة استخراج الموارد","تلبية الاحتياجات الحالية","الاستخدام الرشيد للموارد","استهلاك الموارد الأقل تكلفة"]'::jsonb,
  2,
  12,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-13',
  'pre_test',
  'multiple_choice',
  'مقارنة خريطتين للمكان نفسه في زمنين مختلفين تكشف:',
  '["التغير المكاني","مقياس الرسم","الموقع الفلكي","الاتجاه الجغرافي"]'::jsonb,
  0,
  13,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-14',
  'pre_test',
  'multiple_choice',
  'قبل اختيار حل لمشكلة بيئية ينبغي تحديد:',
  '["الحل المستخدم في مكان آخر","تكلفة الحل فقط","عدد المتأثرين","أسباب المشكلة وتوزيعها"]'::jsonb,
  3,
  14,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-15',
  'pre_test',
  'multiple_choice',
  'أي سؤال يعكس التفكير المكاني بدرجة أكبر؟',
  '["متى ظهرت المشكلة؟","أين تتركز المشكلة ولماذا؟","ما تعريف المشكلة؟","ما نتائج المشكلة؟"]'::jsonb,
  1,
  15,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-16',
  'pre_test',
  'multiple_choice',
  'التلوث البيئي هو تغير:',
  '["موسمي","ضار","مؤقت","طبيعي"]'::jsonb,
  1,
  16,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-17',
  'pre_test',
  'multiple_choice',
  'من المصادر الطبيعية لتلوث الهواء:',
  '["المصانع","السيارات","البراكين","المحطات"]'::jsonb,
  2,
  17,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-18',
  'pre_test',
  'multiple_choice',
  'من المصادر البشرية لتلوث الهواء:',
  '["العواصف","البراكين","الغبار","المصانع"]'::jsonb,
  3,
  18,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-19',
  'pre_test',
  'multiple_choice',
  'يزداد التلوث الصناعي قرب:',
  '["المزارع","المصانع","الحدائق","المحميات"]'::jsonb,
  1,
  19,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-20',
  'pre_test',
  'multiple_choice',
  'تنتقل ملوثات الأنهار مع:',
  '["الجريان","التبخر","التكاثف","التسرب"]'::jsonb,
  0,
  20,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-21',
  'pre_test',
  'multiple_choice',
  'ترتبط المخلفات الصناعية بالاستخدام:',
  '["الزراعي","الصناعي","السكني","الترفيهي"]'::jsonb,
  1,
  21,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-22',
  'pre_test',
  'multiple_choice',
  'بالابتعاد عن مصدر الضوضاء فإنها:',
  '["تزداد","تثبت","تنخفض","تتضاعف"]'::jsonb,
  2,
  22,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-23',
  'pre_test',
  'multiple_choice',
  'يحدد اتجاه انتشار تلوث الهواء:',
  '["الأمطار","التضاريس","الحرارة","الرياح"]'::jsonb,
  3,
  23,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-24',
  'pre_test',
  'multiple_choice',
  'تنتقل ملوثات النهر غالبًا نحو:',
  '["المصب","المنبع","الضفاف","اليابس"]'::jsonb,
  0,
  24,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-25',
  'pre_test',
  'multiple_choice',
  'يتأثر انتشار التلوث أساسًا بـ:',
  '["حجم المصدر","مسار الانتقال","شكل المصدر","عمر المصدر"]'::jsonb,
  1,
  25,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-26',
  'pre_test',
  'multiple_choice',
  'توضح خريطة التلوث:',
  '["مصادر المياه","استخدامات الأرض","مستويات التلوث","توزيع الطرق"]'::jsonb,
  2,
  26,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-27',
  'pre_test',
  'multiple_choice',
  'الأكثر تعرضًا للتلوث منطقة:',
  '["بعيدة عنه","مرتفعة عنه","معزولة عنه","في مساره"]'::jsonb,
  3,
  27,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-28',
  'pre_test',
  'multiple_choice',
  'لمقارنة منطقتين نستخدم:',
  '["مؤشرًا موحدًا","مؤشرين مختلفين","وحدتين مختلفتين","زمنين مختلفين"]'::jsonb,
  0,
  28,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-29',
  'pre_test',
  'multiple_choice',
  'المنطقة الواقعة باتجاه الرياح من المصنع تكون:',
  '["أقل تعرضًا","غير متأثرة","أكثر تعرضًا","متساوية التعرض"]'::jsonb,
  2,
  29,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-30',
  'pre_test',
  'multiple_choice',
  'تحليل التلوث مكانيًا يتطلب معرفة:',
  '["المصدر","المسار","المتأثر","جميع ما سبق"]'::jsonb,
  3,
  30,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-31',
  'pre_test',
  'multiple_choice',
  'ما الذي يميز التغير المناخي عن التغيرات الجوية العابرة؟',
  '["مكان حدوثه","استمراره طويلًا","سرعة حدوثه","وقت حدوثه"]'::jsonb,
  1,
  31,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-32',
  'pre_test',
  'multiple_choice',
  'أي عبارة تصف المناخ بدقة؟',
  '["حالة السماء الآن","طقس يوم محدد","رياح فترة قصيرة","خصائص جوية طويلة المدى"]'::jsonb,
  3,
  32,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-33',
  'pre_test',
  'multiple_choice',
  'أي مما يلي يُعد عاملًا طبيعيًا مؤثرًا في المناخ؟',
  '["الانفجارات البركانية","النقل البري","التوسع الصناعي","إزالة الغابات"]'::jsonb,
  0,
  33,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-34',
  'pre_test',
  'multiple_choice',
  'متى يصبح الاحتباس الحراري مشكلة بيئية؟',
  '["عند انخفاض الأمطار","عند تغير الفصول","عند زيادة احتجاز الحرارة","عند هبوب الرياح"]'::jsonb,
  2,
  34,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-35',
  'pre_test',
  'multiple_choice',
  'أي غاز يرتبط بدرجة كبيرة بتربية الماشية ومدافن النفايات؟',
  '["الأكسجين","الميثان","النيتروجين","بخار الماء"]'::jsonb,
  1,
  35,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-36',
  'pre_test',
  'multiple_choice',
  'كيف تؤثر إزالة الغابات في النظام المناخي؟',
  '["تقلل تخزين الكربون","تزيد المياه الجوفية","تمنع العواصف","تخفض مستوى البحر"]'::jsonb,
  0,
  36,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-37',
  'pre_test',
  'multiple_choice',
  'أي تغير يمثل تحولًا في نمط الأمطار؟',
  '["زيادة سرعة الرياح","ارتفاع مستوى البحر","تغير توقيت الهطول","انخفاض الضوضاء"]'::jsonb,
  2,
  37,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-38',
  'pre_test',
  'multiple_choice',
  'ما أحد الأسباب الرئيسة لارتفاع مستوى سطح البحر؟',
  '["تغير اتجاه الرياح","التمدد الحراري للمياه","زيادة السحب","انخفاض الرطوبة"]'::jsonb,
  1,
  38,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-39',
  'pre_test',
  'multiple_choice',
  'أي مورد قد يتأثر بتغير تغذية باطن الأرض بالمياه؟',
  '["الغطاء السحابي","التربة السطحية","المياه الجوفية","الطاقة الشمسية"]'::jsonb,
  2,
  39,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-40',
  'pre_test',
  'multiple_choice',
  'ما النتيجة الزراعية المباشرة المحتملة لتغير الظروف المناخية؟',
  '["تغير مواعيد الزراعة","زيادة مساحة المدن","انخفاض حركة النقل","تغير شكل التضاريس"]'::jsonb,
  0,
  40,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-41',
  'pre_test',
  'multiple_choice',
  'كيف قد يمتد الأثر المناخي من الزراعة إلى المستهلك؟',
  '["عبر حركة الرياح","عبر سلاسل الإمداد","عبر المياه الجوفية","عبر التضاريس"]'::jsonb,
  1,
  41,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-42',
  'pre_test',
  'multiple_choice',
  'ما استجابة بعض الأنواع الحية لتغير ظروف موائلها؟',
  '["ثبات نشاطها دائمًا","توقف تكاثرها حتمًا","تغير نطاق انتشارها","زيادة أعدادها دائمًا"]'::jsonb,
  2,
  42,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-43',
  'pre_test',
  'multiple_choice',
  'أي الأنواع قد تواجه صعوبة أكبر في الاستجابة للتغير المناخي؟',
  '["واسعة الانتشار دائمًا","سريعة الحركة فقط","كثيرة الغذاء","محدودة الموائل"]'::jsonb,
  3,
  43,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-44',
  'pre_test',
  'multiple_choice',
  'ما الأسلوب الأنسب لتحديد بؤر التأثر المناخي مكانيًا؟',
  '["دراسة السكان","قياس الحرارة","دمج طبقات البيانات المكانية","حساب مساحة المنطقة"]'::jsonb,
  2,
  44,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-45',
  'pre_test',
  'multiple_choice',
  'ما الفائدة الأهم من تحديد المناطق الأكثر تأثرًا على الخريطة؟',
  '["معرفة أسماء المواقع","تحديد اتجاه الشمال","حساب المسافات","تحديد أولويات التكيف"]'::jsonb,
  3,
  45,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-46',
  'pre_test',
  'multiple_choice',
  'تهدف الاستدامة البيئية إلى:',
  '["زيادة الإنتاج","تحقيق التوازن بين الاحتياجات والموارد","منع استغلال الموارد","زيادة الاستهلاك"]'::jsonb,
  1,
  46,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-47',
  'pre_test',
  'multiple_choice',
  'الاستخدام المستدام للموارد يحقق:',
  '["استمرار الاستفادة منها","زيادة استخراجها","سرعة استهلاكها","ثبات كمياتها"]'::jsonb,
  0,
  47,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-48',
  'pre_test',
  'multiple_choice',
  'رفع كفاءة الأجهزة يساعد على:',
  '["زيادة الطلب","ترشيد الطاقة","زيادة الفقد","ثبات الاستهلاك"]'::jsonb,
  1,
  48,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-49',
  'pre_test',
  'multiple_choice',
  'يعتمد اختيار الطاقة المتجددة على:',
  '["خصائص الموقع","عدد السكان","حجم المباني","عدد الطرق"]'::jsonb,
  0,
  49,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-50',
  'pre_test',
  'multiple_choice',
  'تبدأ الإدارة السليمة للمخلفات بـ:',
  '["جمعها","معالجتها","إعادة تدويرها","تقليل إنتاجها"]'::jsonb,
  3,
  50,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-51',
  'pre_test',
  'multiple_choice',
  'يساعد فرز المخلفات على:',
  '["زيادة تخزينها","زيادة نقلها","رفع كفاءة تدويرها","زيادة كميتها"]'::jsonb,
  2,
  51,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-52',
  'pre_test',
  'multiple_choice',
  'من وسائل حماية التنوع الحيوي:',
  '["توسيع العمران","استعادة الموائل","زيادة الاستغلال","تجزئة الموائل"]'::jsonb,
  1,
  52,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-53',
  'pre_test',
  'multiple_choice',
  'تسهم المساحات الخضراء في:',
  '["زيادة التلوث","زيادة حرارة الأسطح","تقليل الموائل","خفض درجات الحرارة"]'::jsonb,
  3,
  53,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-54',
  'pre_test',
  'multiple_choice',
  'تطوير نظم الإنذار المبكر مثال على:',
  '["التخفيف","الترشيد","التكيف","إعادة التدوير"]'::jsonb,
  2,
  54,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-55',
  'pre_test',
  'multiple_choice',
  'يركز التخفيف على:',
  '["آثار المشكلة","مسببات التغير المناخي","توزيع السكان","زيادة التكيف"]'::jsonb,
  1,
  55,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-56',
  'pre_test',
  'multiple_choice',
  'يركز التكيف على:',
  '["التعامل مع آثار التغير المناخي","زيادة الانبعاثات","استهلاك الموارد","إنتاج المخلفات"]'::jsonb,
  0,
  56,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-57',
  'pre_test',
  'multiple_choice',
  'استخدام الطاقة المتجددة لخفض الانبعاثات يمثل:',
  '["تكيفًا","معالجةً","ترشيدًا فقط","تخفيفًا"]'::jsonb,
  3,
  57,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-58',
  'pre_test',
  'multiple_choice',
  'المنطقة ذات الإشعاع الشمسي المرتفع تناسبها:',
  '["الطاقة الشمسية","طاقة المياه","طاقة الرياح فقط","الوقود الأحفوري"]'::jsonb,
  0,
  58,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-59',
  'pre_test',
  'multiple_choice',
  'تساعد خرائط الأولوية على تحديد:',
  '["شبكات النقل","بؤر الاحتياج","أشكال المباني","أسماء المناطق"]'::jsonb,
  1,
  59,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-60',
  'pre_test',
  'multiple_choice',
  'عند محدودية الموارد نبدأ بـ:',
  '["المنطقة الأكبر","المنطقة الأقرب","المنطقة الأعلى أولوية","المنطقة الأقل تعرضًا"]'::jsonb,
  2,
  60,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-61',
  'pre_test',
  'true_false',
  'قد تنتقل آثار المشكلة البيئية إلى مناطق بعيدة عن مصدرها.',
  '["صواب","خطأ"]'::jsonb,
  0,
  61,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-62',
  'pre_test',
  'true_false',
  'تشابه المناخ بين منطقتين يعني تشابه مشكلاتهما البيئية.',
  '["صواب","خطأ"]'::jsonb,
  1,
  62,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-63',
  'pre_test',
  'true_false',
  'يساعد مفتاح الخريطة في تفسير دلالات الرموز والألوان.',
  '["صواب","خطأ"]'::jsonb,
  0,
  63,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-64',
  'pre_test',
  'true_false',
  'زيادة الغطاء النباتي تؤدي عادةً إلى زيادة تعرية التربة.',
  '["صواب","خطأ"]'::jsonb,
  1,
  64,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-65',
  'pre_test',
  'true_false',
  'يمكن أن يؤثر النشاط البشري في توزيع المشكلات البيئية.',
  '["صواب","خطأ"]'::jsonb,
  0,
  65,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-66',
  'pre_test',
  'true_false',
  'تركز التلوث في مكان معين يعني أن مصدره يقع داخله بالضرورة.',
  '["صواب","خطأ"]'::jsonb,
  1,
  66,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-67',
  'pre_test',
  'true_false',
  'مقارنة خرائط المكان عبر الزمن تساعد في اكتشاف التغيرات المكانية.',
  '["صواب","خطأ"]'::jsonb,
  0,
  67,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-68',
  'pre_test',
  'true_false',
  'المورد المتجدد لا يتأثر بمعدل استهلاكه مهما زاد.',
  '["صواب","خطأ"]'::jsonb,
  1,
  68,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-69',
  'pre_test',
  'true_false',
  'قد يختلف الحل المناسب للمشكلة نفسها باختلاف خصائص المكان.',
  '["صواب","خطأ"]'::jsonb,
  0,
  69,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-70',
  'pre_test',
  'true_false',
  'التفكير المكاني يهتم بموقع الظاهرة دون دراسة علاقتها بالمناطق المحيطة.',
  '["صواب","خطأ"]'::jsonb,
  1,
  70,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-71',
  'pre_test',
  'true_false',
  'يمكن أن تختلف مستويات تلوث الهواء بين منطقتين متقاربتين بسبب اختلاف اتجاه الرياح.',
  '["صواب","خطأ"]'::jsonb,
  0,
  71,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-72',
  'pre_test',
  'true_false',
  'تبقى ملوثات المياه دائمًا في المكان الذي دخلت منه إلى البيئة المائية.',
  '["صواب","خطأ"]'::jsonb,
  1,
  72,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-73',
  'pre_test',
  'true_false',
  'قد ينقل الجريان السطحي المبيدات من الأراضي الزراعية إلى المجاري المائية.',
  '["صواب","خطأ"]'::jsonb,
  0,
  73,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-74',
  'pre_test',
  'true_false',
  'ترتبط المناطق الصناعية بالمبيدات والأسمدة بوصفها المصدر الرئيس لتلوث تربتها.',
  '["صواب","خطأ"]'::jsonb,
  1,
  74,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-75',
  'pre_test',
  'true_false',
  'قد تصل بعض ملوثات التربة إلى المياه الجوفية وتؤثر في مناطق بعيدة.',
  '["صواب","خطأ"]'::jsonb,
  0,
  75,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-76',
  'pre_test',
  'true_false',
  'تقل شدة الضوضاء دائمًا كلما اقتربنا من مصدرها.',
  '["صواب","خطأ"]'::jsonb,
  1,
  76,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-77',
  'pre_test',
  'true_false',
  'تساعد خريطة استخدامات الأرض في تفسير التوزيع المكاني لتلوث التربة.',
  '["صواب","خطأ"]'::jsonb,
  0,
  77,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-78',
  'pre_test',
  'true_false',
  'تتساوى مستويات الضوضاء في المكان نفسه مهما اختلف وقت القياس.',
  '["صواب","خطأ"]'::jsonb,
  1,
  78,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-79',
  'pre_test',
  'true_false',
  'لا يشترط أن تكون المنطقة الأكثر تضررًا من التلوث هي الأقرب إلى مصدره.',
  '["صواب","خطأ"]'::jsonb,
  0,
  79,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-80',
  'pre_test',
  'true_false',
  'تحديد مصدر التلوث وحده يكفي لفهم نمط انتشاره المكاني دون دراسة مسار انتقاله.',
  '["صواب","خطأ"]'::jsonb,
  1,
  80,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-81',
  'pre_test',
  'true_false',
  'يشير التغير المناخي إلى تحولات طويلة المدى في خصائص النظام المناخي.',
  '["صواب","خطأ"]'::jsonb,
  0,
  81,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-82',
  'pre_test',
  'true_false',
  'يمكن تحديد مناخ منطقة ما من خلال حالة الطقس فيها خلال عدة أيام فقط.',
  '["صواب","خطأ"]'::jsonb,
  1,
  82,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-83',
  'pre_test',
  'true_false',
  'يؤدي الاحتباس الحراري الطبيعي دورًا في المحافظة على درجة حرارة مناسبة للحياة على الأرض.',
  '["صواب","خطأ"]'::jsonb,
  0,
  83,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-84',
  'pre_test',
  'true_false',
  'تنتج جميع غازات الاحتباس الحراري من مصدر واحد فقط هو حرق الوقود الأحفوري.',
  '["صواب","خطأ"]'::jsonb,
  1,
  84,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-85',
  'pre_test',
  'true_false',
  'لا يعني حدوث الاحترار العالمي أن درجات الحرارة ترتفع بالمقدار نفسه في جميع المناطق.',
  '["صواب","خطأ"]'::jsonb,
  0,
  85,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-86',
  'pre_test',
  'true_false',
  'يقتصر تغير أنماط الأمطار على تغير كميتها فقط دون توقيتها أو شدة هطولها.',
  '["صواب","خطأ"]'::jsonb,
  1,
  86,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-87',
  'pre_test',
  'true_false',
  'قد يؤدي ارتفاع مستوى سطح البحر إلى تداخل المياه المالحة مع بعض مصادر المياه العذبة.',
  '["صواب","خطأ"]'::jsonb,
  0,
  87,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-88',
  'pre_test',
  'true_false',
  'تقتصر آثار التغيرات المناخية على إنتاج المحاصيل ولا تمتد إلى سلاسل الإمداد والأسواق.',
  '["صواب","خطأ"]'::jsonb,
  1,
  88,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-89',
  'pre_test',
  'true_false',
  'قد تغير بعض الأنواع الحية نطاق انتشارها أو توقيت نشاطها استجابةً للتحولات المناخية.',
  '["صواب","خطأ"]'::jsonb,
  0,
  89,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-90',
  'pre_test',
  'true_false',
  'تتأثر جميع المناطق بالظاهرة المناخية نفسها بالدرجة ذاتها مهما اختلفت خصائص المكان وقدرته على التكيف.',
  '["صواب","خطأ"]'::jsonb,
  1,
  90,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-91',
  'pre_test',
  'true_false',
  'تهدف الاستدامة البيئية إلى تلبية احتياجات الحاضر مع الحفاظ على حقوق الأجيال القادمة.',
  '["صواب","خطأ"]'::jsonb,
  0,
  91,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-92',
  'pre_test',
  'true_false',
  'تعتمد استدامة الموارد المتجددة على استخدامها بمعدل أكبر من قدرتها على التجدد.',
  '["صواب","خطأ"]'::jsonb,
  1,
  92,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-93',
  'pre_test',
  'true_false',
  'يعني ترشيد استهلاك المياه الامتناع عن استخدامها قدر الإمكان.',
  '["صواب","خطأ"]'::jsonb,
  1,
  93,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-94',
  'pre_test',
  'true_false',
  'يعتمد اختيار مصدر الطاقة المتجددة المناسب على خصائص الموقع.',
  '["صواب","خطأ"]'::jsonb,
  0,
  94,
  '2026-09-29T12:25:19.585Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-95',
  'pre_test',
  'true_false',
  'يساعد فرز المخلفات من المصدر على رفع كفاءة إعادة التدوير.',
  '["صواب","خطأ"]'::jsonb,
  0,
  95,
  '2026-09-29T12:25:19.586Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-96',
  'pre_test',
  'true_false',
  'تكون مكافحة التلوث أكثر فاعلية بعد انتشار الملوثات بعيدًا عن مصدرها.',
  '["صواب","خطأ"]'::jsonb,
  1,
  96,
  '2026-09-29T12:25:19.586Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-97',
  'pre_test',
  'true_false',
  'تتأثر فاعلية المساحات الخضراء بموقعها ومساحتها وتوزيعها.',
  '["صواب","خطأ"]'::jsonb,
  0,
  97,
  '2026-09-29T12:25:19.586Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-98',
  'pre_test',
  'true_false',
  'يركز التكيف مع التغير المناخي على خفض مسبباته فقط.',
  '["صواب","خطأ"]'::jsonb,
  1,
  98,
  '2026-09-29T12:25:19.586Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-99',
  'pre_test',
  'true_false',
  'يمكن تطبيق الحل البيئي نفسه في جميع الأماكن دون دراسة خصائصها.',
  '["صواب","خطأ"]'::jsonb,
  1,
  99,
  '2026-09-29T12:25:19.586Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-unified-100',
  'pre_test',
  'true_false',
  'تساعد خرائط الأولوية على تحديد المناطق الأكثر احتياجًا للتدخل البيئي.',
  '["صواب","خطأ"]'::jsonb,
  0,
  100,
  '2026-09-29T12:25:19.586Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-1',
  'module_module-1',
  'multiple_choice',
  'أي مما يلي يُعد مكونًا طبيعيًا للبيئة؟',
  '["الطرق","المصانع","التربة","المباني"]'::jsonb,
  2,
  1,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-2',
  'module_module-1',
  'multiple_choice',
  'أي مما يلي يُعد مكونًا بشريًا؟',
  '["المدرسة","المياه","التربة","النباتات"]'::jsonb,
  0,
  2,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-3',
  'module_module-1',
  'multiple_choice',
  'تتأثر مكونات البيئة بعضها ببعض بعلاقة:',
  '["منفصلة","متبادلة","مؤقتة","ثابتة"]'::jsonb,
  1,
  3,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-4',
  'module_module-1',
  'multiple_choice',
  'يختلف توزيع المشكلات البيئية بسبب اختلاف:',
  '["أسماء الأماكن","أشكال المباني","أعداد الطرق","خصائص المكان"]'::jsonb,
  3,
  4,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-5',
  'module_module-1',
  'multiple_choice',
  'تساعد الخريطة البيئية على تحديد:',
  '["توزيع الظواهر","أسماء السكان","أعمار المباني","أوقات الدراسة"]'::jsonb,
  0,
  5,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-6',
  'module_module-1',
  'multiple_choice',
  'يُحدد موقع الظاهرة بالنسبة لغيرها من خلال:',
  '["اللون","الحجم","العلاقة المكانية","الزمن"]'::jsonb,
  2,
  6,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-7',
  'module_module-1',
  'multiple_choice',
  'المنطقة الأقرب إلى مصدر التلوث تكون غالبًا:',
  '["أقل تعرضًا","أكثر تعرضًا","غير متأثرة","متساوية التأثر"]'::jsonb,
  1,
  7,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-8',
  'module_module-1',
  'multiple_choice',
  'تفيد مقارنة خرائط المكان عبر الزمن في معرفة:',
  '["اتجاه الشمال","أسماء المواقع","مساحة الخريطة","التغير البيئي"]'::jsonb,
  3,
  8,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-9',
  'module_module-1',
  'multiple_choice',
  'لتحديد منطقة التلوث نبحث أولًا عن:',
  '["مصدر التلوث","عدد المباني","مساحة المنطقة","شكل الطرق"]'::jsonb,
  0,
  9,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod1-10',
  'module_module-1',
  'multiple_choice',
  'يعتمد القرار البيئي المكاني على:',
  '["الرأي الشخصي","عامل واحد","تحليل بيانات المكان","مساحة المكان فقط"]'::jsonb,
  2,
  10,
  '2026-09-28T17:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-1',
  'module_module-2',
  'multiple_choice',
  'أي مصدر يرتبط بتلوث الهواء؟',
  '["المصانع","المزارع","الحدائق","الأنهار"]'::jsonb,
  0,
  1,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-2',
  'module_module-2',
  'multiple_choice',
  'تنتقل ملوثات الهواء أساسًا بفعل:',
  '["التربة","الرياح","النباتات","الصخور"]'::jsonb,
  1,
  2,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-3',
  'module_module-2',
  'multiple_choice',
  'أي نشاط قد يلوث المياه مباشرة؟',
  '["التشجير","التبخر","تصريف الصرف","حصاد الأمطار"]'::jsonb,
  2,
  3,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-4',
  'module_module-2',
  'multiple_choice',
  'تنتقل ملوثات النهر غالبًا مع:',
  '["الرياح","التربة","الطرق","جريان المياه"]'::jsonb,
  3,
  4,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-5',
  'module_module-2',
  'multiple_choice',
  'الإفراط في المبيدات يؤدي إلى تلوث:',
  '["التربة","الهواء فقط","الطرق","المباني"]'::jsonb,
  0,
  5,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-6',
  'module_module-2',
  'multiple_choice',
  'ترتفع الضوضاء غالبًا قرب:',
  '["المزارع","الطرق المزدحمة","الحدائق","المحميات"]'::jsonb,
  1,
  6,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-7',
  'module_module-2',
  'multiple_choice',
  'تساعد خريطة التلوث على تحديد:',
  '["شكل المباني","أسماء الشوارع","مناطق التركز","أعمار السكان"]'::jsonb,
  2,
  7,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-8',
  'module_module-2',
  'multiple_choice',
  'المنطقة الواقعة في مسار الملوث تكون:',
  '["أقل تعرضًا","بعيدة عنه","غير متأثرة","أكثر تعرضًا"]'::jsonb,
  3,
  8,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-9',
  'module_module-2',
  'multiple_choice',
  'عند مقارنة منطقتين نستخدم:',
  '["المؤشر نفسه","مؤشرين مختلفين","وحدتين مختلفتين","زمنين مختلفين"]'::jsonb,
  0,
  9,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod2-10',
  'module_module-2',
  'multiple_choice',
  'اختيار موقع مصنع يتطلب مراعاة:',
  '["لون التربة","المناطق المتأثرة","شكل المباني","أسماء الطرق"]'::jsonb,
  1,
  10,
  '2026-09-29T14:50:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-1',
  'module_module-3',
  'multiple_choice',
  'التغير المناخي يشير إلى تغيرات:',
  '["يومية","قصيرة","طويلة المدى","مفاجئة"]'::jsonb,
  2,
  1,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-2',
  'module_module-3',
  'multiple_choice',
  'يختلف المناخ عن الطقس في:',
  '["المدة الزمنية","اتجاه الرياح","كمية المياه","نوع التربة"]'::jsonb,
  0,
  2,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-3',
  'module_module-3',
  'multiple_choice',
  'من أهم أسباب زيادة الاحتباس الحراري:',
  '["الأمطار","الانبعاثات","الرياح","السحب"]'::jsonb,
  1,
  3,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-4',
  'module_module-3',
  'multiple_choice',
  'يؤدي ارتفاع الحرارة إلى زيادة:',
  '["التجمد","الرطوبة دائمًا","الأمطار دائمًا","التبخر"]'::jsonb,
  3,
  4,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-5',
  'module_module-3',
  'multiple_choice',
  'المناطق الساحلية أكثر تعرضًا لخطر:',
  '["ارتفاع سطح البحر","انجراف الرياح","الزلازل","البراكين"]'::jsonb,
  0,
  5,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-6',
  'module_module-3',
  'multiple_choice',
  'قلة الأمطار قد تؤدي إلى:',
  '["الفيضانات","الجفاف","الأعاصير","المد والجزر"]'::jsonb,
  1,
  6,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-7',
  'module_module-3',
  'multiple_choice',
  'تختلف آثار التغير المناخي بين الأماكن بسبب اختلاف:',
  '["أسمائها","مساحاتها فقط","خصائصها","حدودها"]'::jsonb,
  2,
  7,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-8',
  'module_module-3',
  'multiple_choice',
  'تساعد الخرائط المناخية على تحديد:',
  '["أسماء المدن","أنواع المباني","شبكة الطرق","مناطق الخطر"]'::jsonb,
  3,
  8,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-9',
  'module_module-3',
  'multiple_choice',
  'بناء حواجز ضد ارتفاع البحر يُعد:',
  '["تكيفًا","تخفيفًا","تلوثًا","استنزافًا"]'::jsonb,
  0,
  9,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod3-10',
  'module_module-3',
  'multiple_choice',
  'استخدام الطاقة الشمسية لخفض الانبعاثات يُعد:',
  '["تكيفًا","تخفيفًا","استنزافًا","معالجةً"]'::jsonb,
  1,
  10,
  '2026-09-29T10:38:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-1',
  'module_module-4',
  'multiple_choice',
  'تهدف الاستدامة البيئية إلى:',
  '["زيادة الاستهلاك","استنزاف الموارد","حفظ الموارد","زيادة المخلفات"]'::jsonb,
  2,
  1,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-2',
  'module_module-4',
  'multiple_choice',
  'الاستخدام المستدام للموارد يعني:',
  '["تقليل الهدر","زيادة الاستهلاك","وقف الاستخدام","تجاهل التجدد"]'::jsonb,
  0,
  2,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-3',
  'module_module-4',
  'multiple_choice',
  'من وسائل ترشيد المياه:',
  '["زيادة الري","إصلاح التسربات","زيادة التصريف","ترك الصنابير"]'::jsonb,
  1,
  3,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-4',
  'module_module-4',
  'multiple_choice',
  'أي مصدر يُعد متجددًا؟',
  '["الفحم","النفط","الغاز","الشمس"]'::jsonb,
  3,
  4,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-5',
  'module_module-4',
  'multiple_choice',
  'يساعد فرز المخلفات على:',
  '["إعادة التدوير","زيادة التلوث","زيادة الهدر","استنزاف الموارد"]'::jsonb,
  0,
  5,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-6',
  'module_module-4',
  'multiple_choice',
  'أفضل وسيلة للحد من التلوث هي:',
  '["نقله","تقليله عند المصدر","نشره","تجاهله"]'::jsonb,
  1,
  6,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-7',
  'module_module-4',
  'multiple_choice',
  'حماية موائل الكائنات تساعد على حفظ:',
  '["الوقود","المباني","التنوع الحيوي","الطرق"]'::jsonb,
  2,
  7,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-8',
  'module_module-4',
  'multiple_choice',
  'بناء حواجز لمواجهة ارتفاع البحر يُعد:',
  '["تدويرًا","ترشيدًا","تخفيفًا","تكيفًا"]'::jsonb,
  3,
  8,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-9',
  'module_module-4',
  'multiple_choice',
  'تُحدد أولوية التدخل البيئي وفق:',
  '["شدة المشكلة والتعرض","اسم المنطقة","شكل المباني","عدد الطرق"]'::jsonb,
  0,
  9,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  'q-mod4-10',
  'module_module-4',
  'multiple_choice',
  'اختيار الحل البيئي المناسب يعتمد على:',
  '["الرأي الشخصي","خصائص المكان","لون الخريطة","اسم المشروع"]'::jsonb,
  1,
  10,
  '2026-09-29T10:55:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- 4. SEED MODULES
-- ==============================================================================
INSERT INTO public.modules (id, "order", title, subtitle, duration_minutes, images, slides, scaffolding, sections, activity, created_at) VALUES (
  'module-1',
  1,
  'الموديول الأول: مكونات البيئة والعلاقات المكانية',
  'التعرف على مكونات البيئة الحية وغير الحية والعلاقات المكانية التفاعلية بينها',
  30,
  '["https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/1.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/2.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/3.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598084/4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598094/5.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598087/6.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/7.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598086/8.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/9.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/10.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598088/11.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598091/12.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598092/13.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598093/14.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/15.png"]'::jsonb,
  '[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/1.png","title":"1","scaffolding":{"hint":"ركّز على ما يحيط بك من ماء وهواء وتربة وكائنات حية وعناصر صنعها الإنسان.","extraInfo":"البيئة ليست العناصر منفردة فقط، بل تشمل أيضًا العلاقات والتفاعلات التي تحدث بينها.","example":"الحديقة تضم تربة وماءً ونباتات وطيورًا، وقد تضم أيضًا ممرات ومقاعد وإنارة صنعها الإنسان؛ وجميعها تشكّل بيئة المكان.","selfQuestion":"انظر إلى المكان الذي توجد فيه الآن؛ ما العناصر الطبيعية والبشرية التي تستطيع تحديدها؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/2.png","title":"2","scaffolding":{"hint":"عند دراسة أي نظام بيئي، ابحث عن الكائنات الحية والعناصر غير الحية والعلاقات التي تربط بينها.","extraInfo":"قد تختلف الأنظمة البيئية في المساحة؛ فقد يكون النظام البيئي صغيرًا مثل بركة ماء، أو واسعًا مثل الصحراء أو البحر.","example":"في النظام البيئي المائي تتفاعل الأسماك والنباتات المائية مع الماء والضوء ودرجة الحرارة، ويؤثر تغير أي عنصر في بقية العناصر.","selfQuestion":"ما النظام البيئي الأقرب إلى المنطقة التي تعيش فيها؟ وما أهم العناصر الحية وغير الحية الموجودة فيه؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/3.png","title":"3","scaffolding":{"hint":"فكّر في التوازن البيئي باعتباره شبكة مترابطة؛ فتغيّر عنصر واحد قد يؤثر في عناصر أخرى.","extraInfo":"لا يعني التوازن البيئي ثبات أعداد الكائنات تمامًا، وإنما بقاء التغيرات ضمن حدود تسمح للنظام البيئي بالاستمرار.","example":"إذا انخفض عدد الحيوانات المفترسة بصورة كبيرة، فقد تزداد أعداد الحيوانات العاشبة، مما يؤدي إلى زيادة استهلاك النباتات والتأثير في توازن النظام البيئي.","selfQuestion":"ماذا تتوقع أن يحدث لبقية عناصر النظام البيئي إذا اختفى أحد أنواع الكائنات الحية منه؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598084/4.png","title":"4","scaffolding":{"hint":"فكّر في الأشياء التي تستخدمها يوميًا، ثم حاول تحديد المورد البيئي الذي جاءت منه.","extraInfo":"تنقسم الموارد البيئية إلى موارد متجددة يمكن أن تتجدد طبيعيًا، وموارد غير متجددة تحتاج إلى فترات زمنية طويلة جدًا لتتكون.","example":"ضوء الشمس والرياح من الموارد المتجددة، بينما النفط والفحم وبعض المعادن من الموارد غير المتجددة.","selfQuestion":"ما أهم الموارد البيئية التي تعتمد عليها في حياتك اليومية؟ وكيف يمكنك تقليل استهلاكها؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598094/5.png","title":"5","scaffolding":{"hint":"ليست كل العناصر التي يصنعها الإنسان ضارة بالبيئة؛ فالأثر يعتمد على طريقة التخطيط والاستخدام.","extraInfo":"يمكن للتخطيط البيئي للمدن والطرق والمصانع أن يقلل استهلاك الموارد والانبعاثات ويحافظ على المساحات الطبيعية.","example":"إنشاء طريق يخدم السكان قد يكون ضروريًا، لكن اختيار مساره بعيدًا عن الأراضي الزراعية والمحميات يقلل أثره البيئي.","selfQuestion":"انظر إلى منطقتك؛ ما أبرز العناصر التي صنعها الإنسان؟ وكيف تؤثر إيجابيًا أو سلبيًا في البيئة المحيطة؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598087/6.png","title":"6","scaffolding":{"hint":"عند دراسة أي تحدٍّ بيئي، حاول تحديد المشكلة ومكان حدوثها وأسبابها ونتائجها؛ فذلك يساعدك على فهمها بصورة مكانية أفضل.","extraInfo":"لا تظهر التحديات البيئية بالدرجة نفسها في جميع الأماكن؛ فقد تختلف شدتها من منطقة إلى أخرى تبعًا للسكان والأنشطة البشرية والموارد والخصائص الطبيعية.","example":"قد يزداد تلوث الهواء بالقرب من المناطق الصناعية والطرق المزدحمة، بينما تكون مستوياته أقل في المناطق ذات المساحات الخضراء الواسعة.","selfQuestion":"ما أبرز مشكلة بيئية تلاحظها في منطقتك؟ وأين تتركز أكثر؟ وما الأسباب التي قد تفسر توزيعها المكاني؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/7.png","title":"7","scaffolding":{"hint":"التنمية المستدامة لا تعني التوقف عن استخدام الموارد، وإنما استخدامها بطريقة تلبي احتياجاتنا مع الحفاظ عليها للأجيال القادمة.","extraInfo":"تقوم التنمية المستدامة على تحقيق التوازن بين ثلاثة أبعاد مترابطة: البيئي والاقتصادي والاجتماعي.","example":"استخدام الطاقة الشمسية في المدارس والمنازل يساعد على توفير الطاقة وتقليل الاعتماد على مصادر الطاقة الملوثة.","selfQuestion":"أي سلوك من سلوكيات حماية البيئة الموجودة في الشريحة يمكنك تطبيقه يوميًا؟ وكيف يمكن أن يؤثر تطبيقه في البيئة المحيطة بك؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598086/8.png","title":"8","scaffolding":{"hint":"حماية البيئة تبدأ من السلوك اليومي للفرد؛ فالعادات الصغيرة عندما يلتزم بها عدد كبير من الناس تُحدث أثرًا واضحًا.","extraInfo":"المسؤولية البيئية لا تقتصر على المنزل، بل تمتد إلى المدرسة والحي والأماكن العامة.","example":"إغلاق صنبور المياه أثناء تنظيف الأسنان، وإطفاء الإضاءة عند مغادرة الغرفة، وفرز المخلفات ممارسات بسيطة تقلل استهلاك الموارد.","selfQuestion":"ما السلوك البيئي الذي يمكنك البدء في تغييره من اليوم؟ وكيف يمكن أن تشجع زملاءك على ممارسته؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/9.png","title":"9","scaffolding":{"hint":"بعض المشكلات البيئية أكبر من أن يحلها فرد بمفرده؛ لذلك تصبح المشاركة والتعاون المجتمعي أكثر فاعلية.","extraInfo":"المشاركة المجتمعية البيئية تشمل الأفراد والمدارس والمؤسسات والجمعيات والجهات المحلية، ويمكن لكل جهة أن تؤدي دورًا مختلفًا ومتكاملًا.","example":"يمكن لطلاب المدرسة تنظيم حملة لتشجير محيط المدرسة، وتوزيع الأدوار بين زراعة الأشجار والعناية بها ونشر التوعية بأهميتها.","selfQuestion":"إذا أردت تنفيذ مبادرة بيئية في مدرستك أو منطقتك، فما المشكلة التي ستختارها؟ ومن الجهات التي يمكن أن تتعاون معها؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/10.png","title":"10","scaffolding":{"hint":"التكنولوجيا تصبح صديقة للبيئة عندما تساعد على تقليل استهلاك الموارد أو خفض التلوث أو مراقبة المشكلات البيئية.","extraInfo":"تساعد تقنيات الاستشعار والأقمار الصناعية ونظم المعلومات الجغرافية في جمع بيانات عن البيئة وتحديد مواقع التغيرات والمشكلات ومتابعتها عبر الزمن.","example":"يمكن استخدام أجهزة قياس جودة الهواء في مناطق مختلفة من المدينة، ثم مقارنة النتائج لتحديد الأماكن الأكثر تعرضًا للتلوث.","selfQuestion":"كيف يمكن استخدام التكنولوجيا للكشف عن مشكلة بيئية في منطقتك وتحديد الأماكن الأكثر تأثرًا بها؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598088/11.png","title":"11","scaffolding":{"hint":"فكّر في أثر قراراتك الحالية على البيئة بعد ١٠ أو ٢٠ عامًا؛ فالاستدامة تربط بين الحاضر والمستقبل.","extraInfo":"من مبادئ الاستدامة العدالة بين الأجيال؛ أي استخدام الموارد حاليًا بطريقة لا تقلل فرص الأجيال القادمة في الحصول عليها.","example":"التوسع في زراعة الأشجار وحماية الأراضي الزراعية اليوم يساعد في توفير بيئة أكثر صحة واستقرارًا للأجيال القادمة.","selfQuestion":"إذا استمرت أنماط استهلاك الموارد الحالية دون تغيير، فكيف تتوقع أن تبدو البيئة في منطقتك مستقبلًا؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598091/12.png","title":"12","scaffolding":{"hint":"قبل اتخاذ أي قرار يؤثر في البيئة، اسأل: هل يلبي احتياجاتنا الحالية دون الإضرار بحقوق الأجيال القادمة؟","extraInfo":"الحفاظ على حقوق الأجيال القادمة يُعرف بمبدأ العدالة بين الأجيال، وهو أحد المبادئ الأساسية المرتبطة بالتنمية المستدامة.","example":"الاعتماد على الطاقة الشمسية بدلًا من الإفراط في استهلاك الوقود الأحفوري يقلل الانبعاثات ويحافظ على الموارد غير المتجددة للمستقبل.","selfQuestion":"ما مورد طبيعي تستخدمه يوميًا؟ وما السلوك الذي يمكنك تغييره للمساعدة في الحفاظ عليه للأجيال القادمة؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598092/13.png","title":"13","scaffolding":{"spatialThink":"حدّد أولًا موقع المشكلة البيئية، ثم لاحظ خصائص المكان الطبيعية والبشرية التي قد تفسر ظهورها.","observe":"تختلف المشكلات بين المناطق الساحلية والصحراوية والزراعية والحضرية لأن لكل منطقة خصائص مكانية مختلفة.","compare":"قارن بين منطقة حضرية ومنطقة زراعية من حيث نوع النشاط البشري والموارد المتاحة والمشكلات البيئية المحتملة.","infer":"لماذا لا يصلح حل بيئي واحد للتطبيق بالطريقة نفسها في جميع الأماكن؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598093/14.png","title":"14","scaffolding":{"mapRead":"استخدم مفتاح الخريطة أولًا لمعرفة مدلول كل رمز، ثم حدّد الأماكن التي يظهر فيها كل نوع من المشكلات البيئية.","patternDiscover":"لاحظ هل تنتشر المشكلة في أماكن متفرقة، أم تتجمع في نطاق مكاني محدد، أم ترتبط بنوع معين من المناطق.","spatialRelate":"فكّر في العلاقة بين موقع المشكلة وخصائص المنطقة، مثل الكثافة السكانية أو النشاط الصناعي أو الزراعي أو طبيعة السطح.","infer":"ما المشكلة التي يظهر لها تركز مكاني واضح على الخريطة؟ وما العامل الذي يمكن أن يفسر هذا التركز؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/15.png","title":"15","scaffolding":{"trackRelation":"اختر عنصرًا من المشهد، مثل النهر، وتتبّع كيف يؤثر في الزراعة والمدن والصناعة، وكيف تؤثر هذه الأنشطة فيه بدورها.","distinguishEffect":"صنّف العلاقات التي تراها إلى علاقات إيجابية تدعم استدامة المكان، وعلاقات سلبية تسبب ضغطًا على البيئة.","causeEffect":"قد يحدث الأثر البيئي في مكان مختلف عن مصدره؛ فتلوث المياه في منطقة ما يمكن أن ينتقل إلى مناطق أخرى مع حركة المياه.","deepThink":"إذا توسعت مدينة على حساب الأراضي الزراعية المحيطة بها، فما التغيرات المكانية والبيئية التي تتوقع حدوثها؟"}}]'::jsonb,
  NULL,
  '[{"id":"sec-1","title":"1. مفهوم النظام البيئي وعناصره الأساسية","content":"النظام البيئي هو مجتمع متكامل من الكائنات الحية التي تتفاعل مع بعضها البعض ومع العناصر غير الحية المحيطة بها كالماء، الهواء، والتربة ضمن دورة بيئية متوازنة تحافظ على استمرارية الحياة."}]'::jsonb,
  '{"id":"act-1","title":"النشاط الأول: مكونات البيئة من حولي","description":"الهدف: التمييز بين مكونات البيئة وفهمها.\nالمهمة: تأمل البيئة المحيطة بمدرستك، ثم حدّد ثلاثة مكونات طبيعية وثلاثة مكونات بشرية وفق الجدول التالي.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790676044/%D9%86%D8%B4%D8%A7%D8%B7_1.png","requiresSubmission":true}'::jsonb,
  '2026-09-22T16:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  "order" = EXCLUDED."order",
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  duration_minutes = EXCLUDED.duration_minutes,
  images = EXCLUDED.images,
  slides = EXCLUDED.slides,
  scaffolding = EXCLUDED.scaffolding,
  sections = EXCLUDED.sections,
  activity = EXCLUDED.activity;

INSERT INTO public.modules (id, "order", title, subtitle, duration_minutes, images, slides, scaffolding, sections, activity, created_at) VALUES (
  'module-2',
  2,
  'الموديول الثاني: التلوث البيئي ومصادره وتوزيعه المكاني',
  'التعرف على التلوث البيئي ومصادره وتوزيعه المكاني وطرق الحد منه',
  30,
  '["https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/1.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/2.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622510/3.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622514/5.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/6.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622508/7.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/8.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622512/9.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/10.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622513/11.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/12.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622518/13.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/14.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/15.png"]'::jsonb,
  '[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/1.png","title":"1","scaffolding":{"hint":"ركّز على الفرق بين مكونات البيئة في الجانب النظيف والجانب الملوث، ولاحظ كيف يمكن للملوثات أن تغيّر خصائصها.","extraInfo":"لا يشترط أن يكون الملوث شيئًا مرئيًا؛ فقد يكون مادة كيميائية أو غازًا أو شكلًا من أشكال الطاقة كالضوضاء والحرارة.","example":"زيادة عوادم السيارات في شارع مزدحم قد ترفع تركيز الملوثات في الهواء وتؤثر في جودة البيئة المحيطة.","selfQuestion":"متى يتحول وجود مادة أو طاقة في البيئة من حالة عادية إلى مصدر للتلوث؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/2.png","title":"2","scaffolding":{"hint":"اسأل أولًا: هل نتج الملوث عن عملية طبيعية أم عن نشاط قام به الإنسان؟ فهذا يساعدك على تحديد مصدره.","extraInfo":"قد تنتج الطبيعة ملوثات مثل الرماد البركاني والغبار، لكن الأنشطة البشرية قد تزيد تركيز بعض الملوثات واستمرارها في المناطق المأهولة.","example":"العاصفة الترابية مصدر طبيعي للجسيمات العالقة في الهواء، بينما عوادم السيارات مصدر بشري لها.","selfQuestion":"إذا وجدت ارتفاعًا في تلوث الهواء في منطقة ما، فما المعلومات التي تحتاج إليها لتحدد ما إذا كان مصدره طبيعيًا أم بشريًا؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622510/3.png","title":"3","scaffolding":{"hint":"صنّف الملوث وفق طبيعته أولًا: صلب، سائل، غازي، أو طاقة؛ فهذا يساعدك على توقع طريقة انتشاره وتأثيره في البيئة.","extraInfo":"تختلف خطورة الملوثات باختلاف تركيزها ومدة بقائها وطريقة انتقالها، وليس بنوعها فقط.","example":"عوادم السيارات ملوثات غازية تنتشر في الهواء، بينما مياه الصرف ملوثات سائلة قد تنتقل إلى الأنهار أو المياه الجوفية.","selfQuestion":"أي أنواع الملوثات يمكن أن ينتقل لمسافات أكبر من مكان إنتاجه؟ وما العامل الذي يساعد على انتقاله؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/4.png","title":"4","scaffolding":{"hint":"اربط بين نوع الملوث والعنصر الذي يتعرض له؛ فاختلاف الملوث يؤدي إلى اختلاف الآثار الناتجة عنه.","extraInfo":"قد لا تتوقف آثار التلوث عند مكان حدوثه، بل يمكن أن تنتقل إلى مناطق أخرى عبر الهواء أو المياه وتؤثر في الإنسان والكائنات الحية.","example":"تلوث مياه النهر قد يؤدي إلى نفوق بعض الكائنات المائية، ويؤثر في صحة الإنسان إذا استُخدمت المياه الملوثة.","selfQuestion":"إذا استمر التلوث في منطقة ما فترة طويلة، فما الآثار التي يمكن أن تظهر على الإنسان والبيئة والمجتمع؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622514/5.png","title":"5","scaffolding":{"hint":"الحد من التلوث يكون أكثر فاعلية عندما نمنع الملوثات من مصدرها قبل أن تنتشر في البيئة.","extraInfo":"لا تعتمد مواجهة التلوث على حل واحد؛ بل تحتاج إلى تكامل التقنيات النظيفة، والنقل المستدام، والطاقة المتجددة، والإدارة السليمة للنفايات، والوعي البيئي.","example":"استخدام وسائل النقل الجماعي بدلًا من الاعتماد المتزايد على السيارات الخاصة يساعد على تقليل استهلاك الوقود وانبعاثات ملوثات الهواء.","selfQuestion":"أي إجراء من إجراءات الحد من التلوث يمكن تطبيقه في منطقتك، وما المشكلة التي سيساعد على تقليلها؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/6.png","title":"6","scaffolding":{"hint":"ابدأ بالسلوكيات التي تمارسها يوميًا؛ فترشيد الموارد وتقليل النفايات واختيار وسيلة النقل يمكن أن يقلل مصادر التلوث مباشرة.","extraInfo":"تزداد فاعلية الممارسات الفردية عندما تتحول إلى عادات مستمرة ويشارك فيها عدد كبير من أفراد المجتمع.","example":"استخدام زجاجة قابلة لإعادة الاستخدام بدلًا من الزجاجات البلاستيكية أحادية الاستخدام يقلل كمية المخلفات الناتجة يوميًا.","selfQuestion":"ما السلوك اليومي الذي تقوم به ويمكنك تغييره من اليوم ليصبح أقل تأثيرًا في البيئة؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622508/7.png","title":"7","scaffolding":{"hint":"ركّز على مصدر الملوث ونوعه؛ فمعرفة مصدر تلوث الهواء تساعد على تفسير ارتفاع تركيزه في بعض الأماكن.","extraInfo":"قد تبقى بعض الملوثات معلقة في الهواء، ويمكن أن تنتقل بفعل الرياح إلى مناطق بعيدة عن مصدر انبعاثها.","example":"تزداد ملوثات الهواء عادةً بالقرب من الطرق المزدحمة بسبب كثرة عوادم المركبات، بينما تقل نسبيًا في المناطق البعيدة عن حركة المرور.","selfQuestion":"كيف يمكن أن يؤثر اتجاه الرياح في انتقال ملوثات الهواء من منطقة صناعية إلى المناطق المحيطة بها؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/8.png","title":"8","scaffolding":{"hint":"عند تحديد منطقة تلوث الهواء، لا تكتفِ بمعرفة مصدر الانبعاث، بل لاحظ اتجاه الرياح والمسافة عن المصدر.","extraInfo":"قد تكون منطقة بعيدة نسبيًا عن مصدر التلوث أكثر تأثرًا من منطقة أقرب إليه إذا حملت الرياح الملوثات في اتجاهها.","example":"قد تنتقل انبعاثات مصنع بفعل الرياح نحو حي سكني يقع في اتجاه هبوبها، بينما يكون حي أقرب إلى المصنع أقل تأثرًا إذا كان في الاتجاه المعاكس.","selfQuestion":"لماذا يمكن أن تختلف مستويات تلوث الهواء بين منطقتين متقاربتين رغم تعرضهما لمصدر التلوث نفسه؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622512/9.png","title":"9","scaffolding":{"hint":"عند ملاحظة تغير لون المياه أو رائحتها، فكّر في مصدر الملوث الذي يمكن أن يكون قد وصل إليها.","extraInfo":"قد تبدو المياه نظيفة ظاهريًا ومع ذلك تحتوي على ملوثات دقيقة أو كائنات ممرضة لا يمكن رؤيتها بالعين المجردة.","example":"وصول مياه الصرف غير المعالجة إلى مجرى مائي قد يؤدي إلى تدهور جودة المياه وانتشار الأمراض والإضرار بالكائنات المائية.","selfQuestion":"كيف يمكن لنشاط يحدث على اليابسة، مثل استخدام المبيدات الزراعية، أن يؤدي إلى تلوث مصدر مائي قريب؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/10.png","title":"10","scaffolding":{"hint":"عند تتبع ملوثات المياه، ابحث عن ثلاثة عناصر أساسية: مصدر التلوث، ومسار انتقاله، والمنطقة التي يصل إليها.","extraInfo":"قد تنتقل بعض الملوثات لمسافات بعيدة دون أن تكون واضحة للعين، خاصةً عند تسربها إلى المياه الجوفية أو انتقالها مع التيارات المائية.","example":"قد تحمل مياه الأمطار بقايا المبيدات من أرض زراعية إلى مجرى مائي قريب، ثم تنتقل الملوثات مع حركة المياه إلى مناطق أخرى.","selfQuestion":"إذا ظهر تلوث في منطقة بعيدة عن أي مصدر واضح، فكيف يمكنك استخدام اتجاه حركة المياه وطبيعة السطح للوصول إلى المصدر المحتمل؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622513/11.png","title":"11","scaffolding":{"hint":"عند ملاحظة تدهور التربة، فكّر في الأنشطة التي تحدث فوقها أو بالقرب منها؛ فقد تساعدك على تحديد مصدر التلوث.","extraInfo":"بعض ملوثات التربة لا تبقى في الطبقات السطحية، بل قد تتسرب إلى أعماق أكبر وتصل إلى المياه الجوفية أو تمتصها النباتات.","example":"الإفراط في استخدام المبيدات في الأراضي الزراعية قد يؤدي إلى تراكم بقاياها في التربة، ثم انتقال جزء منها إلى النباتات أو المياه الجوفية.","selfQuestion":"كيف يمكن أن يتحول تلوث بقعة محدودة من التربة إلى مشكلة تؤثر في أماكن أو عناصر بيئية أخرى؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/12.png","title":"12","scaffolding":{"hint":"ابدأ بتحديد نوع استخدام الأرض في المكان، ثم ابحث عن الأنشطة المرتبطة به والمصادر المحتملة لتلوث التربة.","extraInfo":"تساعد خرائط استخدامات الأرض في تفسير اختلاف تلوث التربة من مكان إلى آخر، لأنها تكشف العلاقة بين الأنشطة البشرية ومواقع ظهور الملوثات.","example":"قد ترتفع احتمالية تلوث التربة بالمبيدات في منطقة زراعية، بينما ترتفع احتمالية وجود الزيوت والمواد الكيميائية بالقرب من منطقة صناعية.","selfQuestion":"إذا أظهرت الخريطة ارتفاع تلوث التربة في منطقة معينة، فكيف يمكن أن تستخدم نوع استخدام الأرض المحيطة بها لتفسير سبب هذا التلوث؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622518/13.png","title":"13","scaffolding":{"hint":"لا يُعد كل صوت تلوثًا ضوضائيًا؛ انتبه إلى شدة الصوت ومدة التعرض له ومدى إزعاجه.","extraInfo":"يقاس مستوى شدة الصوت بوحدة الديسيبل (dB)، ويزداد تأثير الضوضاء في الإنسان كلما ارتفع مستوى الصوت وطالت مدة التعرض له.","example":"الوجود لفترات طويلة بالقرب من طريق مزدحم أو موقع بناء قد يسبب التوتر وضعف التركيز، وقد يؤثر التعرض المستمر للأصوات المرتفعة في السمع.","selfQuestion":"ما أكثر مصادر الضوضاء التي تلاحظها في البيئة المحيطة بك، وفي أي أوقات تكون شدتها أكبر؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/14.png","title":"14","scaffolding":{"hint":"عند مقارنة الضوضاء بين مكانين، راقب المسافة عن مصدر الصوت وكثافة النشاط في كل مكان.","extraInfo":"قد يتغير مستوى الضوضاء في المكان نفسه خلال اليوم؛ فالطريق قد يكون أكثر ضوضاء في ساعات الذروة وأقل في الأوقات التي تنخفض فيها حركة المرور.","example":"عادةً يكون مستوى الضوضاء بالقرب من طريق رئيسي أعلى منه داخل منطقة سكنية هادئة بعيدة عنه، وقد تساعد الأشجار والحواجز في تقليل وصول الصوت.","selfQuestion":"إذا أردت اختيار موقع أكثر هدوءًا لإنشاء مدرسة، فما المعلومات المكانية التي ستبحث عنها قبل اختيار الموقع؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/15.png","title":"15"}]'::jsonb,
  '{"hint":"تأمل في مصادر التلوث في بيئتك وكيف تؤثر على الصحة العامة والتوزيع المكاني.","extraInfo":"التلوث البيئي يشمل تلوث الهواء والماء والتربة والتلوث الضوضائي.","example":"الانبعاثات الصناعية وعوادم السيارات تمثل أبرز مسببات تلوث الهواء في المدن.","selfQuestion":"كيف يمكن للمجتمع المساهمة في تقليل مصادر التلوث البيئي؟"}'::jsonb,
  '[{"id":"sec-2-1","title":"1. مفهوم التلوث البيئي ومصادره","content":"التلوث البيئي هو إدخال مواد ضارة أو ملوثات إلى البيئة الطبيعية مما يسبب تغيراً سلبياً في خصائصها ويؤثر على الكائنات الحية."}]'::jsonb,
  '{"id":"act-1","title":"النشاط الأول: تتبع مسار التلوث","description":"الهدف: التعرف على مصدر التلوث ومسار انتشاره في البيئة.\nالمهمة: تأمل الخريطة أمامك التي توضح مصدرًا للتلوث ومناطق سكنية ومجرى مائيًا، ثم حدّد مصدر التلوث ومسار انتقاله والمنطقة الأكثر تأثرًا.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622523/%D9%86%D8%B4%D8%A7%D8%B7_1.png","requiresSubmission":true}'::jsonb,
  '2026-09-28T15:20:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  "order" = EXCLUDED."order",
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  duration_minutes = EXCLUDED.duration_minutes,
  images = EXCLUDED.images,
  slides = EXCLUDED.slides,
  scaffolding = EXCLUDED.scaffolding,
  sections = EXCLUDED.sections,
  activity = EXCLUDED.activity;

INSERT INTO public.modules (id, "order", title, subtitle, duration_minutes, images, slides, scaffolding, sections, activity, created_at) VALUES (
  'module-3',
  3,
  'الموديول الثالث: التغيرات المناخية وآثارها البيئية والمكانية',
  'التعرف على التغيرات المناخية وآثارها البيئية والمكانية على كوكب الأرض',
  30,
  '["https://res.cloudinary.com/makcnu5x/image/upload/v1790677337/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/1.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/2.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/3.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677331/5.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677335/6.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/7.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677332/8.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677336/9.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677330/10.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677333/11.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677334/12.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/13.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/14.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/15.png"]'::jsonb,
  '[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677337/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/1.png","title":"1","scaffolding":{"hint":"ركّز على المدة الزمنية التي يستمر خلالها التغير؛ فالتغير المناخي لا يُحكم عليه من خلال فترة قصيرة.","extraInfo":"يحتاج اكتشاف التغير المناخي إلى سجلات وملاحظات متتابعة تسمح بمقارنة خصائص المناخ عبر فترات زمنية طويلة.","example":"ملاحظة اتجاه مستمر في خصائص المناخ على مدى عقود تُعد مؤشرًا على تغير مناخي، بخلاف التقلبات التي تحدث خلال عدة أيام.","selfQuestion":"ما الدليل الذي تحتاج إليه لكي تميز بين تغير مناخي طويل المدى وتغير مؤقت في حالة الجو؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/2.png","title":"2","scaffolding":{"hint":"ركّز على المدة الزمنية عند التمييز بين الطقس والمناخ؛ أحدهما يصف حالة قصيرة المدى، والآخر يعتمد على خصائص ممتدة عبر سنوات.","extraInfo":"يمكن أن يختلف طقس اليوم عن اليوم التالي دون أن يعني ذلك حدوث تغير في مناخ المنطقة.","example":"سقوط الأمطار اليوم يصف حالة الطقس، بينما دراسة طبيعة الأمطار المعتادة في المنطقة على مدى سنوات تساعد في وصف مناخها.","selfQuestion":"إذا مر أسبوع شديد البرودة في منطقة معروفة بارتفاع درجات الحرارة، فهل يكفي ذلك للحكم على أن مناخها قد تغير؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/3.png","title":"3","scaffolding":{"hint":"صنّف الأسباب أولًا إلى عوامل طبيعية وعوامل ناتجة عن الإنسان، ثم فكّر في طريقة تأثير كل منها في النظام المناخي.","extraInfo":"تختلف العوامل المؤثرة في المناخ في قوتها ومدة تأثيرها؛ لذلك لا يؤدي كل عامل إلى الدرجة نفسها من التغير.","example":"قد يؤثر انفجار بركاني كبير في المناخ لفترة معينة، بينما يمكن لبعض التأثيرات البشرية المستمرة أن تتراكم آثارها عبر فترات أطول.","selfQuestion":"لماذا تُعد مدة استمرار العامل المؤثر عنصرًا مهمًا عند دراسة أسباب التغيرات المناخية؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/4.png","title":"4","scaffolding":{"hint":"تتبّع مسار الطاقة من وصول أشعة الشمس إلى الأرض، ثم عودة جزء منها نحو الغلاف الجوي.","extraInfo":"الاحتباس الحراري في مستواه الطبيعي ضروري للحياة، وتظهر المشكلة عندما يختل التوازن الحراري نتيجة زيادة احتجاز الحرارة.","example":"عندما يزداد مقدار الحرارة المحتجزة في الغلاف الجوي مقارنة بما يفقده النظام إلى الخارج، يرتفع متوسط درجة حرارة الأرض تدريجيًا.","selfQuestion":"ماذا يمكن أن يحدث لدرجة حرارة الأرض إذا أصبح الغلاف الجوي يحتفظ بكمية أكبر من الحرارة؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677331/5.png","title":"5","scaffolding":{"hint":"اربط كل غاز بمصدره الرئيس؛ فمصادر ثاني أكسيد الكربون تختلف عن مصادر الميثان وأكسيد النيتروز.","extraInfo":"تختلف غازات الاحتباس الحراري في قدرتها على التأثير في توازن الطاقة وفي مدة بقائها في الغلاف الجوي.","example":"يمكن أن ينتج الميثان من مدافن النفايات وتربية الماشية، في حين يرتبط أكسيد النيتروز بصورة مهمة باستخدام الأسمدة النيتروجينية وإدارة التربة الزراعية.","selfQuestion":"كيف يمكن أن يساعد تحديد مصدر كل غاز من غازات الاحتباس الحراري في اختيار الإجراء المناسب للحد من انبعاثاته؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677335/6.png","title":"6","scaffolding":{"hint":"تتبّع العلاقة بين النشاط البشري وما يسببه من تغير في تركيب الغلاف الجوي أو قدرة النظم الطبيعية على تخزين الكربون.","extraInfo":"لا يقتصر التأثير البشري على الانبعاثات المباشرة؛ فتغيير استخدام الأراضي وإزالة الغطاء النباتي يمكن أن يغيرا قدرة البيئة على تخزين الكربون.","example":"تحويل مساحة خضراء إلى منطقة عمرانية قد يجمع بين زيادة استهلاك الطاقة وانخفاض قدرة المنطقة على تخزين الكربون.","selfQuestion":"أي تغييرات في طريقة إدارة الطاقة والنقل والمدن والأراضي يمكن أن تقلل التأثير البشري في النظام المناخي؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/7.png","title":"7","scaffolding":{"hint":"لا تربط الاحترار بيوم شديد الحرارة، بل ابحث عن اتجاه مستمر في متوسط درجات الحرارة عبر فترة زمنية طويلة.","extraInfo":"لا ترتفع الحرارة بالمعدل نفسه في جميع أجزاء الأرض؛ إذ تختلف استجابة اليابسة والمحيطات والأقاليم المختلفة للاحترار.","example":"قد تظهر منطقة يابسة ارتفاعًا أسرع في درجات الحرارة مقارنة بمنطقة بحرية مجاورة، رغم تأثرهما بالاتجاه المناخي نفسه.","selfQuestion":"لماذا تساعد مقارنة خرائط درجات الحرارة بين مناطق مختلفة وعبر فترات زمنية طويلة على فهم الاحترار بصورة أدق؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677332/8.png","title":"8","scaffolding":{"hint":"عند دراسة تغير الأمطار، لا تنظر إلى الكمية فقط؛ راقب أيضًا توقيت الهطول وتكراره وشدته.","extraInfo":"قد يعني تغير نمط الأمطار انخفاض عدد الأيام الممطرة مع زيادة شدة الهطول في الأيام التي تسقط فيها الأمطار.","example":"قد تشهد منطقة فترات جفاف أطول، بينما تتعرض منطقة أخرى لأمطار غزيرة خلال مدة قصيرة.","selfQuestion":"كيف تساعد مقارنة خرائط الأمطار لفترات زمنية مختلفة في تحديد المناطق التي شهدت أكبر تغير؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677336/9.png","title":"9","scaffolding":{"hint":"لا يكفي أن تكون الظاهرة قوية حتى تُعد متطرفة؛ قارنها أولًا بما يُعد معتادًا في المكان الذي حدثت فيه.","extraInfo":"قد تكون الظاهرة الجوية متطرفة في منطقة، بينما لا تُعد كذلك في منطقة أخرى؛ لأن الحدود المعتادة للطقس تختلف مكانيًا.","example":"كمية من الأمطار قد تكون معتادة في إقليم كثير الأمطار، لكنها قد تمثل حدثًا متطرفًا في إقليم جاف إذا تجاوزت مستوياته المعتادة بدرجة كبيرة.","selfQuestion":"لماذا يجب معرفة مكان حدوث الظاهرة والفترة الزمنية وبياناتها السابقة قبل الحكم عليها بأنها ظاهرة جوية متطرفة؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677330/10.png","title":"10","scaffolding":{"hint":"فرّق بين السببين الرئيسيين لارتفاع مستوى البحر: تمدد مياه المحيطات عند ارتفاع حرارتها، وإضافة مياه جديدة نتيجة فقدان الجليد الموجود على اليابسة.","extraInfo":"لا تتساوى السواحل في درجة تعرضها للخطر؛ فارتفاع الأرض وشكل الساحل والظروف المحلية تؤثر في حجم التأثير.","example":"قد تكون منطقة ساحلية منخفضة أكثر تعرضًا للغمر وتداخل المياه المالحة مقارنة بساحل مرتفع، حتى عند تعرضهما لارتفاع متقارب في مستوى البحر.","selfQuestion":"ما الخصائص المكانية التي ينبغي دراستها لتحديد المناطق الساحلية الأكثر تعرضًا لمخاطر ارتفاع مستوى سطح البحر؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677333/11.png","title":"11","scaffolding":{"hint":"تتبّع أثر التغير المناخي في دورة المياه بدءًا من تغير الأمطار، ثم لاحظ انعكاس ذلك على الأنهار والمياه الجوفية وكميات المياه المتاحة.","extraInfo":"لا تعني وفرة المياه في سنة معينة ضمان استمرارها؛ فقد يتغير توقيت توافرها وكميتها من موسم إلى آخر.","example":"انخفاض تغذية المياه الجوفية خلال فترات الجفاف قد يقلل المياه المتاحة للشرب والري، ويزيد المنافسة عليها بين الاستخدامات المختلفة.","selfQuestion":"إذا انخفضت كمية المياه المتاحة في منطقة ما، فكيف يمكن تحديد الأولويات بين احتياجات الشرب والزراعة والصناعة؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677334/12.png","title":"12","scaffolding":{"hint":"تتبّع التأثير من بداية الإنتاج الزراعي حتى وصول الغذاء إلى المستهلك؛ فالأثر لا يتوقف عند نمو المحصول.","extraInfo":"تختلف استجابة المحاصيل للظروف المناخية؛ فلكل محصول احتياجات محددة من الحرارة والمياه خلال مراحل نموه.","example":"تغير موعد الأمطار قد يستدعي تعديل موعد زراعة محصول معين وكمية الري اللازمة له، ثم ينعكس ذلك على موعد الحصاد والإنتاج.","selfQuestion":"كيف يمكن أن يؤدي انخفاض إنتاج محصول في منطقة زراعية إلى تأثيرات تمتد إلى التخزين والنقل والأسواق وتوافر الغذاء؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/13.png","title":"13","scaffolding":{"hint":"تتبّع استجابة النوع الحي للتغير في بيئته: هل يبقى في موطنه، أم ينتقل، أم يغيّر توقيت نشاطه؟","extraInfo":"الأنواع التي تعيش في موائل محدودة أو مجزأة قد تواجه صعوبة أكبر في الانتقال إلى مناطق تتوافر فيها ظروف مناسبة.","example":"قد يؤدي تغير توقيت هجرة أحد الأنواع إلى عدم تزامن وصوله مع الفترة التي يتوافر فيها غذاؤه، مما يؤثر في بقائه وتكاثره.","selfQuestion":"كيف يمكن أن يؤدي تغير انتشار نوع واحد إلى تأثيرات تمتد إلى أنواع أخرى داخل النظام البيئي؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/14.png","title":"14","scaffolding":{"hint":"عند مقارنة مكانين، لا تدرس الظاهرة المناخية وحدها؛ قارن أيضًا خصائص كل مكان ودرجة تعرضه وقدرته على التكيف.","extraInfo":"قد تتساوى منطقتان في مستوى التعرض لخطر مناخي معين، لكن تختلف الخسائر بينهما بسبب اختلاف البنية العمرانية والموارد وإمكانات الاستجابة.","example":"قد تؤثر موجة حر واحدة بدرجة أكبر في مدينة كثيفة المباني مقارنة بمنطقة أقل كثافة وأكثر غطاءً نباتيًا.","selfQuestion":"إذا تعرضت منطقتان للظاهرة المناخية نفسها، فما الخصائص المكانية التي ستقارن بينها لتفسير اختلاف حجم التأثير؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/15.png","title":"15","scaffolding":{"hint":"لا تعتمد على البيانات المناخية وحدها؛ ادمجها مع معلومات السكان والموارد واستخدامات الأرض لتحديد المناطق الأكثر تأثرًا.","extraInfo":"قد تظهر الخرائط المكانية أن مناطق متقاربة جغرافيًا تختلف في درجة التأثر نتيجة اختلاف كثافة السكان أو الموارد أو خصائص استخدام الأرض.","example":"قد تكشف الخريطة أن منطقة ساحلية منخفضة وكثيفة السكان تحتاج إلى أولوية أكبر في الاستعداد مقارنة بمنطقة ساحلية أخرى أقل تعرضًا وأقل كثافة.","selfQuestion":"إذا كانت لديك عدة طبقات من البيانات المكانية، فكيف ستستخدمها لتحديد المنطقة التي ينبغي أن تحصل على الأولوية في إجراءات التكيف؟"}}]'::jsonb,
  '{"hint":"تأمل ظواهر الاحتباس الحراري وتأثيراتها المكانية على المناخ ومناسيب المياه.","extraInfo":"التغير المناخي يؤدي إلى تقلبات جوية حادة، وارتفاع درجات الحرارة العالمية، وذوبان الجليد.","example":"زيادة معدلات الجفاف في بعض المناطق وفيضانات غير مسبوقة في مناطق أخرى.","selfQuestion":"ما الإجراءات العالمية والمحلية التي تساهم في التكيف مع التغيرات المناخية؟"}'::jsonb,
  '[{"id":"sec-3-1","title":"1. أسباب التغيرات المناخية وآثارها المكانية","content":"تعد انبعاثات الغازات الدفيئة والأنشطة الصناعية غير المنضبطة من أبرز المحركات لتغير المناخ العالمي وآثاره على التنوع الحيوي."}]'::jsonb,
  '{"id":"act-1","title":"النشاط الأول: ماذا تغيّر في المكان؟","description":"الهدف: التعرف على بعض آثار التغيرات المناخية على الأماكن والموارد البيئية.\nالمهمة: تأمل الصورتين للمكان نفسه في فترتين مختلفتين، ثم حدّد التغيرات التي حدثت في الفترة الأحدث وفسر أحد هذه التغيرات.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677341/%D9%86%D8%B4%D8%A7%D8%B7_1.png","requiresSubmission":true}'::jsonb,
  '2026-09-28T15:20:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  "order" = EXCLUDED."order",
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  duration_minutes = EXCLUDED.duration_minutes,
  images = EXCLUDED.images,
  slides = EXCLUDED.slides,
  scaffolding = EXCLUDED.scaffolding,
  sections = EXCLUDED.sections,
  activity = EXCLUDED.activity;

INSERT INTO public.modules (id, "order", title, subtitle, duration_minutes, images, slides, scaffolding, sections, activity, created_at) VALUES (
  'module-4',
  4,
  'الموديول الرابع: الاستدامة البيئية وإدارة الموارد',
  'التعرف على الاستدامة البيئية وكيفية مواجهة المشكلات البيئية واتخاذ القرارات',
  30,
  '["https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81_-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678690/1-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/2-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678697/3-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/4-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/5-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678695/6-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/7-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678698/8-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/9-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/10-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678707/11-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678702/12-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/13-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678703/14-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/15-4.png"]'::jsonb,
  '[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81_-4.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678690/1-4.png","title":"1","scaffolding":{"hint":"ركّز على فكرتين أساسيتين في الاستدامة: تلبية احتياجات الحاضر، والحفاظ على قدرة الأجيال القادمة على تلبية احتياجاتها.","extraInfo":"لا تعني الاستدامة منع استخدام الموارد، وإنما إدارتها بطريقة تحافظ على استمرار وظائف البيئة ومواردها على المدى الطويل.","example":"عند إنشاء مشروع جديد، يمكن مراعاة احتياجات السكان الحالية مع تقليل استهلاك الموارد وتجنب الإضرار بالنظم الطبيعية المحيطة.","selfQuestion":"كيف يمكن لقرار نتخذه اليوم بشأن استخدام مورد طبيعي أن يؤثر في قدرة الأجيال القادمة على الاستفادة منه؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/2-4.png","title":"2","scaffolding":{"hint":"فكّر في العلاقة في اتجاهين: ماذا يحصل الإنسان من الموارد الطبيعية؟ وكيف تؤثر أنشطته في هذه الموارد؟","extraInfo":"تختلف الأنشطة البشرية من مكان إلى آخر تبعًا لنوع الموارد المتاحة وخصائصها؛ لذلك يرتبط توزيع كثير من الأنشطة الاقتصادية بتوزيع الموارد.","example":"وجود تربة خصبة ومياه متاحة قد يشجع النشاط الزراعي، بينما تؤثر طريقة الزراعة في جودة التربة وكمية المياه المتاحة مستقبلًا.","selfQuestion":"إذا تغيرت كمية مورد طبيعي أو جودته في مكان ما، فكيف يمكن أن تتغير أنشطة السكان في هذا المكان؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678697/3-4.png","title":"3","scaffolding":{"hint":"ميّز بين طريقة التعامل مع الموارد المتجددة وطريقة التعامل مع الموارد غير المتجددة؛ فلكل نوع أسلوب إدارة مختلف.","extraInfo":"قدرة المورد على التجدد لا تعني أنه غير قابل للاستنزاف؛ فقد يؤدي استخدامه بمعدل أسرع من قدرته على التعويض إلى تدهوره.","example":"يمكن استغلال الغابات بصورة مستدامة عندما يتناسب معدل قطع الأشجار مع قدرتها على التجدد، بينما يحتاج استخدام المعادن إلى تقليل الهدر وإعادة الاستخدام والبحث عن بدائل.","selfQuestion":"كيف تحدد معدل استخدام مورد طبيعي بحيث نستفيد منه حاليًا دون تهديد استمراره مستقبلًا؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/4-4.png","title":"4","scaffolding":{"hint":"ترشيد المياه لا يعني تقليل احتياجات الإنسان الأساسية، بل يعني الحصول على الفائدة المطلوبة مع تقليل الفقد والهدر.","extraInfo":"تساعد متابعة كمية المياه المستهلكة بانتظام على اكتشاف الزيادة غير المعتادة في الاستهلاك، والتي قد تشير إلى وجود تسرب أو هدر.","example":"استخدام الري بالتنقيط بدلًا من بعض طرق الري التقليدية يساعد على توصيل المياه إلى النباتات بكفاءة أكبر وتقليل الفاقد.","selfQuestion":"إذا لاحظت ارتفاع استهلاك المياه في منزل أو منشأة، فما البيانات التي تحتاج إلى فحصها لتحديد مكان الهدر واختيار الإجراء المناسب؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/5-4.png","title":"5","scaffolding":{"hint":"ترشيد الطاقة لا يعني الاستغناء عن الخدمات التي نحتاجها، بل الحصول على الخدمة نفسها باستهلاك أقل وكفاءة أعلى.","extraInfo":"تساعد متابعة أنماط استهلاك الطاقة على معرفة الأوقات والأنشطة التي يرتفع فيها الطلب، ومن ثم تحديد فرص الترشيد الأكثر فاعلية.","example":"استخدام مصابيح موفرة للطاقة مع الاستفادة من الإضاءة الطبيعية يقلل استهلاك الكهرباء مع الحفاظ على مستوى الإضاءة المطلوب.","selfQuestion":"ما الأجهزة أو الأنشطة التي تستهلك أكبر قدر من الطاقة في منزلك أو مدرستك، وما الإجراء الذي يمكن اتخاذه لتقليل استهلاكها؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678695/6-4.png","title":"6","scaffolding":{"hint":"لا يصلح كل مصدر من مصادر الطاقة المتجددة لكل مكان؛ اربط اختيار المصدر بخصائص الموقع والموارد المتاحة فيه.","extraInfo":"تختلف كفاءة مشروعات الطاقة المتجددة مكانيًا تبعًا لعوامل مثل شدة الإشعاع الشمسي، وسرعة الرياح، وتوافر الموارد المائية والحرارية الأرضية.","example":"قد تكون منطقة ذات إشعاع شمسي مرتفع أكثر ملاءمة لإنشاء محطة للطاقة الشمسية، بينما تكون منطقة ذات رياح قوية ومنتظمة أنسب لطاقة الرياح.","selfQuestion":"إذا أردت اختيار موقع لمشروع طاقة متجددة، فما البيانات المكانية التي ستدرسها لتحديد مصدر الطاقة الأكثر ملاءمة؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/7-4.png","title":"7","scaffolding":{"hint":"تبدأ الإدارة السليمة للمخلفات قبل مرحلة التدوير؛ فالأولوية تكون لتقليل إنتاج المخلفات ثم إعادة الاستخدام.","extraInfo":"يساعد فصل المخلفات من المصدر على تقليل اختلاط المواد ورفع جودة المواد القابلة للتدوير، مما يزيد كفاءة الاستفادة منها.","example":"يمكن فرز الورق والبلاستيك والمعادن في حاويات منفصلة، ثم إرسال المواد القابلة للتدوير إلى جهات المعالجة بدلًا من التخلص منها مع باقي المخلفات.","selfQuestion":"كيف يمكن أن يؤثر موقع حاويات الفرز ومراكز جمع المخلفات في كفاءة عملية إعادة التدوير داخل منطقة سكنية؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678698/8-4.png","title":"8","scaffolding":{"hint":"تبدأ الوقاية الفعالة من التلوث بتحديد مصدر الملوث ومسار انتقاله قبل اختيار طريقة الحد منه.","extraInfo":"يكون منع الملوثات أو تقليلها عند المصدر أكثر فاعلية من محاولة معالجتها بعد انتشارها في الهواء أو الماء أو التربة.","example":"يمكن تقليل تلوث أحد المجاري المائية بمعالجة مياه الصرف الصناعي قبل تصريفها، بدلًا من محاولة إزالة الملوثات بعد انتشارها في المياه.","selfQuestion":"إذا ظهر تلوث في منطقة ما، فما المعلومات التي تحتاج إليها لتحديد مصدره ومسار انتقاله واختيار المكان الأنسب للتدخل؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/9-4.png","title":"9","scaffolding":{"hint":"حماية التنوع الحيوي لا تقتصر على حماية الأنواع نفسها، بل تشمل أيضًا حماية الموائل والروابط التي تسمح للكائنات بالانتقال بينها.","extraInfo":"يؤدي تجزؤ الموائل إلى عزل بعض جماعات الكائنات الحية، لذلك تساعد الممرات البيئية على استمرار حركتها وتبادلها الوراثي بين المناطق.","example":"إنشاء ممر بيئي يربط بين منطقتين طبيعيتين منفصلتين قد يسمح للحيوانات بالانتقال بينهما بأمان بدلًا من بقائها في موائل معزولة.","selfQuestion":"كيف يمكن استخدام بيانات توزيع الأنواع ومساحات موائلها لتحديد المواقع التي تحتاج إلى أولوية في إجراءات الحماية؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/10-4.png","title":"10","scaffolding":{"hint":"لا تعتمد فائدة المساحات الخضراء على وجودها فقط، بل تتأثر أيضًا بموقعها ومساحتها ومدى ترابطها داخل المدينة.","extraInfo":"يساعد توزيع المساحات الخضراء بصورة متوازنة بين الأحياء على زيادة عدد السكان المستفيدين من خدماتها البيئية.","example":"زراعة الأشجار على جانبي الشوارع وحول المباني يمكن أن توفر الظل وتخفض حرارة المناطق المحيطة، بينما توفر الحدائق موائل لبعض الطيور والكائنات الأخرى.","selfQuestion":"إذا أردت اختيار موقع لمساحة خضراء جديدة داخل مدينة، فما خصائص المكان التي ستدرسها لتحقيق أكبر فائدة بيئية ولأكبر عدد من السكان؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678707/11-4.png","title":"11","scaffolding":{"hint":"ركّز على أن التكيف لا يمنع الخطر المناخي نفسه، وإنما يساعد الإنسان والنظم البيئية على التعامل مع آثاره وتقليل أضراره.","extraInfo":"تختلف إجراءات التكيف من مكان إلى آخر؛ لأن نوع الخطر ودرجة التعرض وخصائص السكان والموارد تختلف مكانيًا.","example":"في منطقة معرضة للفيضانات يمكن تعديل تصميم المباني ورفع بعض المنشآت، بينما قد تحتاج منطقة تعاني نقص المياه إلى ممارسات أكثر كفاءة في إدارة المياه.","selfQuestion":"إذا تعرضت منطقتان لخطرين مناخيين مختلفين، فكيف ستحدد إجراء التكيف الأنسب لكل منطقة؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678702/12-4.png","title":"12","scaffolding":{"hint":"ركّز على مصدر المشكلة؛ فالتخفيف يستهدف تقليل مسببات التغير المناخي، خاصة انبعاثات غازات الاحتباس الحراري.","extraInfo":"لا يقتصر التخفيف على خفض الانبعاثات، بل يشمل أيضًا زيادة قدرة الغابات والنظم الطبيعية وغيرها من المصارف على إزالة الكربون وتخزينه.","example":"استبدال جزء من الكهرباء المنتجة من الوقود الأحفوري بالطاقة الشمسية يقلل الانبعاثات الناتجة عن إنتاج الطاقة، ولذلك يُعد إجراءً للتخفيف.","selfQuestion":"إذا أردت اختيار إجراء للتخفيف في مدينة ما، فما الأنشطة الأكثر تسببًا في الانبعاثات التي ينبغي تحديدها أولًا؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/13-4.png","title":"13","scaffolding":{"hint":"حدّد أولًا هدف الإجراء؛ فإذا كان يتعامل مع آثار التغير المناخي فهو تكيف، وإذا كان يستهدف مسبباته فهو تخفيف.","extraInfo":"يمكن تطبيق التكيف والتخفيف معًا؛ فهما نهجان متكاملان، لكن لكل منهما هدف مباشر مختلف.","example":"إنشاء حواجز لحماية منطقة ساحلية من الفيضانات يُعد تكيفًا، بينما استخدام الطاقة المتجددة لتقليل انبعاثات غازات الاحتباس الحراري يُعد تخفيفًا.","selfQuestion":"إذا زُرعت الأشجار في مدينة، فمتى يمكن اعتبار ذلك تكيفًا، ومتى يمكن اعتباره تخفيفًا؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678703/14-4.png","title":"14","scaffolding":{"hint":"ابدأ بدراسة خصائص المكان وموارده المتاحة قبل اختيار الحل البيئي؛ فالحل المناسب في منطقة قد لا يكون مناسبًا في منطقة أخرى.","extraInfo":"تزداد فاعلية الحل البيئي عندما يعتمد على الموارد والإمكانات المحلية، ويتوافق مع طبيعة الموقع واستخدامات الأرض والبنية الأساسية.","example":"يمكن الاعتماد على الطاقة الشمسية في منطقة تتمتع بإشعاع شمسي مرتفع، بينما تكون تقنيات الري الحديثة أكثر ملاءمة لمنطقة زراعية تعاني محدودية الموارد المائية.","selfQuestion":"إذا كانت أمامك عدة حلول بيئية لمشكلة واحدة، فما البيانات المكانية والموارد التي ستقارن بينها لاختيار الحل الأنسب للمكان؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/15-4.png","title":"15","scaffolding":{"hint":"لا تُحدد أولوية التدخل بناءً على شدة المشكلة وحدها؛ بل يجب النظر أيضًا إلى حجم التعرض والحساسية والقدرة على المواجهة.","extraInfo":"يساعد دمج عدة مؤشرات في خريطة واحدة على الكشف عن بؤر الاحتياج التي قد لا تظهر عند دراسة كل مؤشر بصورة منفردة.","example":"قد تحصل منطقة ذات تلوث مرتفع وكثافة سكانية كبيرة وقدرة محدودة على المواجهة على أولوية أعلى للتدخل من منطقة تعاني مستوى التلوث نفسه ولكنها أقل تعرضًا.","selfQuestion":"إذا كانت الموارد المتاحة للتدخل محدودة، فما المؤشرات التي ستستخدمها لتحديد المنطقة التي ينبغي البدء بها؟"}}]'::jsonb,
  '{"hint":"فكّر في الاستدامة البيئية كنهج للحفاظ على الموارد للأجيال الحالية والمستقبلية.","extraInfo":"الاستدامة تتطلب التوازن بين النمو الاقتصادي، العدالة الاجتماعية، والحفاظ على البيئة الطبيعية.","example":"إعادة التدوير، الاقتصاد الدائري، والمباني الخضراء الصديقة للبيئة.","selfQuestion":"كيف تتخذ قرارات يومية تدعم الاستدامة البيئية وترشيد الاستهلاك؟"}'::jsonb,
  '[{"id":"sec-4-1","title":"1. مبادئ الاستدامة البيئية واتخاذ القرار البيئي","content":"ترتكز الاستدامة على الاستخدام الرشيد للموارد الطبيعية وتطبيق ممارسات صديقة للبيئة تضمن بقاء النظم البيئية للأجيال القادمة."}]'::jsonb,
  '{"id":"act-1","title":"النشاط الأول: أيّهما أكثر استدامة؟","description":"الهدف: مقارنة منطقتين مختلفتين في استخدام الموارد واستنتاج المنطقة الأكثر استدامة.\nالمهمة: تأمل البيانات والصور في المنطقتين، ثم أجب عن الأسئلة المحددة.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678709/%D9%86%D8%B4%D8%A7%D8%B7_1-4.png","requiresSubmission":true}'::jsonb,
  '2026-09-28T15:20:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
  "order" = EXCLUDED."order",
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  duration_minutes = EXCLUDED.duration_minutes,
  images = EXCLUDED.images,
  slides = EXCLUDED.slides,
  scaffolding = EXCLUDED.scaffolding,
  sections = EXCLUDED.sections,
  activity = EXCLUDED.activity;

-- ==============================================================================
-- 5. SEED LIBRARY VIDEOS
-- ==============================================================================
INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-1790085377156',
  'دليلك الشامل للتعلم الذاتي باستخدام الذكاء الاصطناعي',
  'دليلك الشامل للتعلم الذاتي باستخدام الذكاء الاصطناعي',
  'https://www.youtube.com/watch?v=-cRABLd2Ckk',
  '-cRABLd2Ckk',
  '',
  '',
  '2026-09-22'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  'vid-1790085332032',
  'دليلك الشامل للتعلم الذاتي باستخدام الذكاء الاصطناعي',
  'محتوى مرئي إثرائي حول قضايا البيئة والتنمية المستدامة.',
  'https://www.youtube.com/watch?v=-cRABLd2Ckk',
  '-cRABLd2Ckk',
  '',
  '',
  '2026-09-22'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

