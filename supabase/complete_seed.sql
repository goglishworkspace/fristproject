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
  $STR$std-1001$STR$,
  $STR$user1001$STR$,
  $STR$123456$STR$,
  $STR$احمد رمزي$STR$,
  $STR$01093341944$STR$,
  'student',
  true,
  false,
  NULL,
  NULL,
  $JSON${"q-post-4":0,"q-pre-1":2,"q-post-6":1,"q-post-3":2,"q-pre-5":1,"q-pre-3":2,"q-pre-6":1,"q-pre-2":3,"q-post-2":3,"q-post-1":2,"q-post-5":2,"q-pre-4":1}$JSON$::jsonb,
  $JSON${"q-unified-87":1,"q-unified-90":1,"q-unified-89":1,"q-unified-78":1,"q-unified-98":1,"q-unified-62":1,"q-unified-79":1,"q-unified-82":1,"q-unified-84":1,"q-unified-75":1,"q-unified-95":1,"q-unified-61":1,"q-unified-100":1,"q-unified-93":1,"q-unified-92":1,"q-unified-64":1,"q-unified-85":1,"q-unified-73":1,"q-unified-83":1}$JSON$::jsonb,
  $JSON${"module-1":{"score":3,"total":10,"completedAt":"2026-09-28T18:29:40.779Z","answers":{"q-mod1-1":3,"q-mod1-2":1,"q-mod1-3":0,"q-mod1-4":2,"q-mod1-5":3,"q-mod1-6":3,"q-mod1-7":1,"q-mod1-8":3,"q-mod1-9":3,"q-mod1-10":2}},"module-4":{"score":3,"total":10,"completedAt":"2026-09-29T11:14:53.392Z","answers":{"q-mod4-1":3,"q-mod4-2":0,"q-mod4-3":3,"q-mod4-4":0,"q-mod4-5":2,"q-mod4-6":3,"q-mod4-7":2,"q-mod4-8":3,"q-mod4-9":1,"q-mod4-10":2}}}$JSON$::jsonb,
  $JSON${"module-1":{"answerText":"=== تقرير إجابات الأنشطة التطبيقية للوحدة الأولى ===\n\n--- النشاط الأول: مكونات البيئة من حولي ---\n1. المكون: (لم يُحدد) | النوع: طبيعي\n2. المكون: (لم يُحدد) | النوع: طبيعي\n3. المكون: (لم يُحدد) | النوع: طبيعي\n4. المكون: (لم يُحدد) | النوع: بشري\n5. المكون: (لم يُحدد) | النوع: بشري\n6. المكون: (لم يُحدد) | النوع: بشري\n\n--- النشاط الثاني: أين تتركز المشكلة البيئية؟ ---\nالمكان الأكثر تعرضًا للتلوث: (لم يُحدد)\nسبب الاختيار والتفسير: (لم يُحدد)\n\n--- النشاط الثالث: اختر الموقع الأنسب ---\nالموقع المقترح الأنسب: الموقع (3)\nالسبب المكاني الأول (١): (لم يُحدد)\nالسبب المكاني الثاني (٢): (لم يُحدد)","fileUrl":"","submittedAt":"2026-09-28T18:27:14.192Z"},"module-2":{"answerText":"=== تقرير إجابات الأنشطة التطبيقية (النشاط الثاني: أين تتركز المشكلة البيئية؟) ===\n\n\n--- النشاط الثاني: أين تتركز المشكلة البيئية؟ ---\n١. مصدر التلوث: (لم يُحدد)\n٢. مسار انتقال التلوث: (لم يُحدد)\n٣. المنطقة الأكثر تأثرًا: (لم يُحدد)","fileUrl":"","submittedAt":"2026-09-29T09:26:31.030Z"},"module-4":{"answerText":"=== تقرير إجابات الأنشطة التطبيقية (النشاط الأول: أيّهما أكثر استدامة؟) ===\n\n--- النشاط الأول: أيّهما أكثر استدامة؟ ---\n١. المنطقة الأكثر استدامة: (لم تُحدد)\n٢. الأدلة من الجدول:\n   - الدليل (١): ربير\n   - الدليل (٢): بيريبر\n   - الدليل (٣): بيربي\n٣. مقترحات تحسين استدامة المنطقة الأقل استدامة: بريربير","fileUrl":"","submittedAt":"2026-09-29T11:14:23.550Z"}}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1002$STR$,
  $STR$user1002$STR$,
  $STR$YGXQG2$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${"q-pre-1":2,"q-pre-2":2,"q-pre-3":1,"q-pre-4":2,"q-pre-5":2,"q-pre-6":1}$JSON$::jsonb,
  $JSON${"q-post-1":0,"q-post-2":3,"q-post-3":2,"q-post-4":1,"q-post-5":3,"q-post-6":1}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${"module-1":{"answerText":"يسشيشيشيش","fileUrl":"http://localhost:3000/modules/module-1","submittedAt":"2026-09-24T12:08:15.783Z"}}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1003$STR$,
  $STR$user1003$STR$,
  $STR$hB2n6e$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1004$STR$,
  $STR$user1004$STR$,
  $STR$tZ5w3q$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1005$STR$,
  $STR$user1005$STR$,
  $STR$6zuAJ2$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1006$STR$,
  $STR$user1006$STR$,
  $STR$WgRvtR$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1007$STR$,
  $STR$user1007$STR$,
  $STR$vMh6DN$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1008$STR$,
  $STR$user1008$STR$,
  $STR$RvcGj3$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1009$STR$,
  $STR$user1009$STR$,
  $STR$3Y35hN$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1010$STR$,
  $STR$user1010$STR$,
  $STR$P45Dsb$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1011$STR$,
  $STR$user1011$STR$,
  $STR$msnFZa$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1012$STR$,
  $STR$user1012$STR$,
  $STR$72NeVH$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1013$STR$,
  $STR$user1013$STR$,
  $STR$FJcgn4$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1014$STR$,
  $STR$user1014$STR$,
  $STR$AKwDTt$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1015$STR$,
  $STR$user1015$STR$,
  $STR$6SVbQZ$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1016$STR$,
  $STR$user1016$STR$,
  $STR$jysx9j$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1017$STR$,
  $STR$user1017$STR$,
  $STR$5KG7yq$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1018$STR$,
  $STR$user1018$STR$,
  $STR$RgSCPJ$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1019$STR$,
  $STR$user1019$STR$,
  $STR$2aKJcg$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1020$STR$,
  $STR$user1020$STR$,
  $STR$WEseaG$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1021$STR$,
  $STR$user1021$STR$,
  $STR$zd2m5x$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1022$STR$,
  $STR$user1022$STR$,
  $STR$tHLDRh$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1023$STR$,
  $STR$user1023$STR$,
  $STR$ZLfA7x$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1024$STR$,
  $STR$user1024$STR$,
  $STR$DFQESy$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1025$STR$,
  $STR$user1025$STR$,
  $STR$KcVGe5$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1026$STR$,
  $STR$user1026$STR$,
  $STR$9dQMPv$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1027$STR$,
  $STR$user1027$STR$,
  $STR$3WDq7j$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1028$STR$,
  $STR$user1028$STR$,
  $STR$6AVrH6$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1029$STR$,
  $STR$user1029$STR$,
  $STR$pEz9Yu$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1030$STR$,
  $STR$user1030$STR$,
  $STR$A2kFLf$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1031$STR$,
  $STR$user1031$STR$,
  $STR$XQRmsJ$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1032$STR$,
  $STR$user1032$STR$,
  $STR$ujJdb6$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1033$STR$,
  $STR$user1033$STR$,
  $STR$G6SCHB$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1034$STR$,
  $STR$user1034$STR$,
  $STR$JEF9Gd$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1035$STR$,
  $STR$user1035$STR$,
  $STR$6VwX6m$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1036$STR$,
  $STR$user1036$STR$,
  $STR$XPprfz$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1037$STR$,
  $STR$user1037$STR$,
  $STR$ByvQ9Z$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1038$STR$,
  $STR$user1038$STR$,
  $STR$9hYDs4$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1039$STR$,
  $STR$user1039$STR$,
  $STR$buSN33$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1040$STR$,
  $STR$user1040$STR$,
  $STR$5kv7bP$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1041$STR$,
  $STR$user1041$STR$,
  $STR$LfRBws$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1042$STR$,
  $STR$user1042$STR$,
  $STR$Xs5J8B$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1043$STR$,
  $STR$user1043$STR$,
  $STR$BNh3ZD$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1044$STR$,
  $STR$user1044$STR$,
  $STR$DpbW2b$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1045$STR$,
  $STR$user1045$STR$,
  $STR$2RJC5m$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1046$STR$,
  $STR$user1046$STR$,
  $STR$Jh3832$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1047$STR$,
  $STR$user1047$STR$,
  $STR$ydWE8d$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1048$STR$,
  $STR$user1048$STR$,
  $STR$sc5n7q$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1049$STR$,
  $STR$user1049$STR$,
  $STR$pBRmUz$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1050$STR$,
  $STR$user1050$STR$,
  $STR$vP2kgS$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1051$STR$,
  $STR$user1051$STR$,
  $STR$UfhhBe$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1052$STR$,
  $STR$user1052$STR$,
  $STR$sdxwdD$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1053$STR$,
  $STR$user1053$STR$,
  $STR$aLbaD6$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1054$STR$,
  $STR$user1054$STR$,
  $STR$Exfua7$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1055$STR$,
  $STR$user1055$STR$,
  $STR$EqZCsh$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1056$STR$,
  $STR$user1056$STR$,
  $STR$TBUkYf$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1057$STR$,
  $STR$user1057$STR$,
  $STR$PPLtkN$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1058$STR$,
  $STR$user1058$STR$,
  $STR$wmjAZ7$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1059$STR$,
  $STR$user1059$STR$,
  $STR$7axWHt$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1060$STR$,
  $STR$user1060$STR$,
  $STR$T2Svmk$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1061$STR$,
  $STR$user1061$STR$,
  $STR$awEECu$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1062$STR$,
  $STR$user1062$STR$,
  $STR$z2bgHB$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1063$STR$,
  $STR$user1063$STR$,
  $STR$NCPLAP$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1064$STR$,
  $STR$user1064$STR$,
  $STR$QsXYNx$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1065$STR$,
  $STR$user1065$STR$,
  $STR$KGAPS7$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1066$STR$,
  $STR$user1066$STR$,
  $STR$8SxbmM$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1067$STR$,
  $STR$user1067$STR$,
  $STR$q5yR4F$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1068$STR$,
  $STR$user1068$STR$,
  $STR$bZ6Y8P$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1069$STR$,
  $STR$user1069$STR$,
  $STR$Yp9AkM$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1070$STR$,
  $STR$user1070$STR$,
  $STR$HWsFyj$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1071$STR$,
  $STR$user1071$STR$,
  $STR$ZxStBJ$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1072$STR$,
  $STR$user1072$STR$,
  $STR$fBWkTe$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1073$STR$,
  $STR$user1073$STR$,
  $STR$rCcsXy$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1074$STR$,
  $STR$user1074$STR$,
  $STR$Fd23CE$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1075$STR$,
  $STR$user1075$STR$,
  $STR$kPucW6$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1076$STR$,
  $STR$user1076$STR$,
  $STR$5JjnmJ$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1077$STR$,
  $STR$user1077$STR$,
  $STR$PUzyJw$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1078$STR$,
  $STR$user1078$STR$,
  $STR$2qUeHg$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1079$STR$,
  $STR$user1079$STR$,
  $STR$Ept5jS$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1080$STR$,
  $STR$user1080$STR$,
  $STR$euMRSR$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1081$STR$,
  $STR$user1081$STR$,
  $STR$EFDZaD$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1082$STR$,
  $STR$user1082$STR$,
  $STR$3Dj8Za$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1083$STR$,
  $STR$user1083$STR$,
  $STR$krXZgn$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1084$STR$,
  $STR$user1084$STR$,
  $STR$WUrey4$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1085$STR$,
  $STR$user1085$STR$,
  $STR$bMdUME$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1086$STR$,
  $STR$user1086$STR$,
  $STR$merufh$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1087$STR$,
  $STR$user1087$STR$,
  $STR$s9hye7$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1088$STR$,
  $STR$user1088$STR$,
  $STR$nqhmVM$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1089$STR$,
  $STR$user1089$STR$,
  $STR$RL98Ne$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1090$STR$,
  $STR$user1090$STR$,
  $STR$GQrwuT$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1091$STR$,
  $STR$user1091$STR$,
  $STR$Y8JAmg$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1092$STR$,
  $STR$user1092$STR$,
  $STR$m35bKW$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1093$STR$,
  $STR$user1093$STR$,
  $STR$EzhAq5$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1094$STR$,
  $STR$user1094$STR$,
  $STR$UqAsca$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1095$STR$,
  $STR$user1095$STR$,
  $STR$ztAy5m$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1096$STR$,
  $STR$user1096$STR$,
  $STR$FYBv6f$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1097$STR$,
  $STR$user1097$STR$,
  $STR$BMQ855$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1098$STR$,
  $STR$user1098$STR$,
  $STR$9BjF2E$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1099$STR$,
  $STR$user1099$STR$,
  $STR$saGwqH$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$std-1100$STR$,
  $STR$user1100$STR$,
  $STR$YF9AYy$STR$,
  $STR$$STR$,
  $STR$$STR$,
  'student',
  false,
  false,
  NULL,
  NULL,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $JSON${}$JSON$::jsonb,
  $STR$0/2$STR$,
  $STR$not_started$STR$,
  $STR$2026-09-22T15:20:50.381Z$STR$
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
  $STR$q-unified-1$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما العامل الأشمل في اختلاف المشكلات البيئية بين الأماكن؟$STR$,
  $JSON$["الكثافة السكانية","النشاط الاقتصادي","الخصائص المكانية","الموارد الطبيعية"]$JSON$::jsonb,
  2,
  1,
  $STR$2026-09-29T12:49:23.894Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-2$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مما يلي مكوّن غير حي في البيئة؟$STR$,
  $JSON$["التربة","النباتات","الإنسان","الحيوانات"]$JSON$::jsonb,
  0,
  2,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-3$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي الموارد التالية غير متجدد؟$STR$,
  $JSON$["الشمس","الرياح","المياه","النفط"]$JSON$::jsonb,
  3,
  3,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-4$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$إزالة الغطاء النباتي تؤدي غالبًا إلى:$STR$,
  $JSON$["زيادة التنوع الحيوي","زيادة تعرية التربة","زيادة خصوبة التربة","ثبات التربة"]$JSON$::jsonb,
  1,
  4,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-5$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أفضل وسيلة لإظهار توزيع مشكلة بيئية هي:$STR$,
  $JSON$["الجدول","الصورة","النص","الخريطة"]$JSON$::jsonb,
  3,
  5,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-6$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما العنصر الذي يفسر رموز الخريطة؟$STR$,
  $JSON$["الاتجاه","المفتاح","المقياس","العنوان"]$JSON$::jsonb,
  1,
  6,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-7$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$انتقال تلوث الهواء بين منطقتين يرتبط أكثر بـ:$STR$,
  $JSON$["نوع الصخور","درجة الانحدار","اتجاه الرياح","نوع التربة"]$JSON$::jsonb,
  2,
  7,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-8$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما الأكثر فائدة لتفسير تركز التلوث في منطقة؟$STR$,
  $JSON$["عدد السكان","مواقع مصادر التلوث","مساحة المنطقة","شكل حدودها"]$JSON$::jsonb,
  1,
  8,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-9$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي موقف يمثل استفادة الإنسان المباشرة من البيئة؟$STR$,
  $JSON$["استخدام مياه الأنهار","معالجة مياه الصرف","حماية المحميات","إعادة تدوير المخلفات"]$JSON$::jsonb,
  0,
  9,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-10$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مصدر للطاقة أكثر استدامة؟$STR$,
  $JSON$["الغاز الطبيعي","النفط","الفحم","الطاقة الشمسية"]$JSON$::jsonb,
  3,
  10,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-11$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي حالة تزيد احتمال انجراف التربة؟$STR$,
  $JSON$["كثافة الأشجار","انحدار السطح وقلة النباتات","استواء السطح","زيادة الغطاء النباتي"]$JSON$::jsonb,
  1,
  11,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-12$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي قرار يراعي حقوق الأجيال القادمة؟$STR$,
  $JSON$["زيادة استخراج الموارد","تلبية الاحتياجات الحالية","الاستخدام الرشيد للموارد","استهلاك الموارد الأقل تكلفة"]$JSON$::jsonb,
  2,
  12,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-13$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$مقارنة خريطتين للمكان نفسه في زمنين مختلفين تكشف:$STR$,
  $JSON$["التغير المكاني","مقياس الرسم","الموقع الفلكي","الاتجاه الجغرافي"]$JSON$::jsonb,
  0,
  13,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-14$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$قبل اختيار حل لمشكلة بيئية ينبغي تحديد:$STR$,
  $JSON$["الحل المستخدم في مكان آخر","تكلفة الحل فقط","عدد المتأثرين","أسباب المشكلة وتوزيعها"]$JSON$::jsonb,
  3,
  14,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-15$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي سؤال يعكس التفكير المكاني بدرجة أكبر؟$STR$,
  $JSON$["متى ظهرت المشكلة؟","أين تتركز المشكلة ولماذا؟","ما تعريف المشكلة؟","ما نتائج المشكلة؟"]$JSON$::jsonb,
  1,
  15,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-16$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$التلوث البيئي هو تغير:$STR$,
  $JSON$["موسمي","ضار","مؤقت","طبيعي"]$JSON$::jsonb,
  1,
  16,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-17$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$من المصادر الطبيعية لتلوث الهواء:$STR$,
  $JSON$["المصانع","السيارات","البراكين","المحطات"]$JSON$::jsonb,
  2,
  17,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-18$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$من المصادر البشرية لتلوث الهواء:$STR$,
  $JSON$["العواصف","البراكين","الغبار","المصانع"]$JSON$::jsonb,
  3,
  18,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-19$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$يزداد التلوث الصناعي قرب:$STR$,
  $JSON$["المزارع","المصانع","الحدائق","المحميات"]$JSON$::jsonb,
  1,
  19,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-20$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تنتقل ملوثات الأنهار مع:$STR$,
  $JSON$["الجريان","التبخر","التكاثف","التسرب"]$JSON$::jsonb,
  0,
  20,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-21$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ترتبط المخلفات الصناعية بالاستخدام:$STR$,
  $JSON$["الزراعي","الصناعي","السكني","الترفيهي"]$JSON$::jsonb,
  1,
  21,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-22$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$بالابتعاد عن مصدر الضوضاء فإنها:$STR$,
  $JSON$["تزداد","تثبت","تنخفض","تتضاعف"]$JSON$::jsonb,
  2,
  22,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-23$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$يحدد اتجاه انتشار تلوث الهواء:$STR$,
  $JSON$["الأمطار","التضاريس","الحرارة","الرياح"]$JSON$::jsonb,
  3,
  23,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-24$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تنتقل ملوثات النهر غالبًا نحو:$STR$,
  $JSON$["المصب","المنبع","الضفاف","اليابس"]$JSON$::jsonb,
  0,
  24,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-25$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$يتأثر انتشار التلوث أساسًا بـ:$STR$,
  $JSON$["حجم المصدر","مسار الانتقال","شكل المصدر","عمر المصدر"]$JSON$::jsonb,
  1,
  25,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-26$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$توضح خريطة التلوث:$STR$,
  $JSON$["مصادر المياه","استخدامات الأرض","مستويات التلوث","توزيع الطرق"]$JSON$::jsonb,
  2,
  26,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-27$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$الأكثر تعرضًا للتلوث منطقة:$STR$,
  $JSON$["بعيدة عنه","مرتفعة عنه","معزولة عنه","في مساره"]$JSON$::jsonb,
  3,
  27,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-28$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$لمقارنة منطقتين نستخدم:$STR$,
  $JSON$["مؤشرًا موحدًا","مؤشرين مختلفين","وحدتين مختلفتين","زمنين مختلفين"]$JSON$::jsonb,
  0,
  28,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-29$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$المنطقة الواقعة باتجاه الرياح من المصنع تكون:$STR$,
  $JSON$["أقل تعرضًا","غير متأثرة","أكثر تعرضًا","متساوية التعرض"]$JSON$::jsonb,
  2,
  29,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-30$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تحليل التلوث مكانيًا يتطلب معرفة:$STR$,
  $JSON$["المصدر","المسار","المتأثر","جميع ما سبق"]$JSON$::jsonb,
  3,
  30,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-31$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما الذي يميز التغير المناخي عن التغيرات الجوية العابرة؟$STR$,
  $JSON$["مكان حدوثه","استمراره طويلًا","سرعة حدوثه","وقت حدوثه"]$JSON$::jsonb,
  1,
  31,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-32$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي عبارة تصف المناخ بدقة؟$STR$,
  $JSON$["حالة السماء الآن","طقس يوم محدد","رياح فترة قصيرة","خصائص جوية طويلة المدى"]$JSON$::jsonb,
  3,
  32,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-33$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مما يلي يُعد عاملًا طبيعيًا مؤثرًا في المناخ؟$STR$,
  $JSON$["الانفجارات البركانية","النقل البري","التوسع الصناعي","إزالة الغابات"]$JSON$::jsonb,
  0,
  33,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-34$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$متى يصبح الاحتباس الحراري مشكلة بيئية؟$STR$,
  $JSON$["عند انخفاض الأمطار","عند تغير الفصول","عند زيادة احتجاز الحرارة","عند هبوب الرياح"]$JSON$::jsonb,
  2,
  34,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-35$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي غاز يرتبط بدرجة كبيرة بتربية الماشية ومدافن النفايات؟$STR$,
  $JSON$["الأكسجين","الميثان","النيتروجين","بخار الماء"]$JSON$::jsonb,
  1,
  35,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-36$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$كيف تؤثر إزالة الغابات في النظام المناخي؟$STR$,
  $JSON$["تقلل تخزين الكربون","تزيد المياه الجوفية","تمنع العواصف","تخفض مستوى البحر"]$JSON$::jsonb,
  0,
  36,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-37$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي تغير يمثل تحولًا في نمط الأمطار؟$STR$,
  $JSON$["زيادة سرعة الرياح","ارتفاع مستوى البحر","تغير توقيت الهطول","انخفاض الضوضاء"]$JSON$::jsonb,
  2,
  37,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-38$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما أحد الأسباب الرئيسة لارتفاع مستوى سطح البحر؟$STR$,
  $JSON$["تغير اتجاه الرياح","التمدد الحراري للمياه","زيادة السحب","انخفاض الرطوبة"]$JSON$::jsonb,
  1,
  38,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-39$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مورد قد يتأثر بتغير تغذية باطن الأرض بالمياه؟$STR$,
  $JSON$["الغطاء السحابي","التربة السطحية","المياه الجوفية","الطاقة الشمسية"]$JSON$::jsonb,
  2,
  39,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-40$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما النتيجة الزراعية المباشرة المحتملة لتغير الظروف المناخية؟$STR$,
  $JSON$["تغير مواعيد الزراعة","زيادة مساحة المدن","انخفاض حركة النقل","تغير شكل التضاريس"]$JSON$::jsonb,
  0,
  40,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-41$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$كيف قد يمتد الأثر المناخي من الزراعة إلى المستهلك؟$STR$,
  $JSON$["عبر حركة الرياح","عبر سلاسل الإمداد","عبر المياه الجوفية","عبر التضاريس"]$JSON$::jsonb,
  1,
  41,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-42$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما استجابة بعض الأنواع الحية لتغير ظروف موائلها؟$STR$,
  $JSON$["ثبات نشاطها دائمًا","توقف تكاثرها حتمًا","تغير نطاق انتشارها","زيادة أعدادها دائمًا"]$JSON$::jsonb,
  2,
  42,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-43$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي الأنواع قد تواجه صعوبة أكبر في الاستجابة للتغير المناخي؟$STR$,
  $JSON$["واسعة الانتشار دائمًا","سريعة الحركة فقط","كثيرة الغذاء","محدودة الموائل"]$JSON$::jsonb,
  3,
  43,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-44$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما الأسلوب الأنسب لتحديد بؤر التأثر المناخي مكانيًا؟$STR$,
  $JSON$["دراسة السكان","قياس الحرارة","دمج طبقات البيانات المكانية","حساب مساحة المنطقة"]$JSON$::jsonb,
  2,
  44,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-45$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$ما الفائدة الأهم من تحديد المناطق الأكثر تأثرًا على الخريطة؟$STR$,
  $JSON$["معرفة أسماء المواقع","تحديد اتجاه الشمال","حساب المسافات","تحديد أولويات التكيف"]$JSON$::jsonb,
  3,
  45,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-46$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تهدف الاستدامة البيئية إلى:$STR$,
  $JSON$["زيادة الإنتاج","تحقيق التوازن بين الاحتياجات والموارد","منع استغلال الموارد","زيادة الاستهلاك"]$JSON$::jsonb,
  1,
  46,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-47$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$الاستخدام المستدام للموارد يحقق:$STR$,
  $JSON$["استمرار الاستفادة منها","زيادة استخراجها","سرعة استهلاكها","ثبات كمياتها"]$JSON$::jsonb,
  0,
  47,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-48$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$رفع كفاءة الأجهزة يساعد على:$STR$,
  $JSON$["زيادة الطلب","ترشيد الطاقة","زيادة الفقد","ثبات الاستهلاك"]$JSON$::jsonb,
  1,
  48,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-49$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$يعتمد اختيار الطاقة المتجددة على:$STR$,
  $JSON$["خصائص الموقع","عدد السكان","حجم المباني","عدد الطرق"]$JSON$::jsonb,
  0,
  49,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-50$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تبدأ الإدارة السليمة للمخلفات بـ:$STR$,
  $JSON$["جمعها","معالجتها","إعادة تدويرها","تقليل إنتاجها"]$JSON$::jsonb,
  3,
  50,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-51$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$يساعد فرز المخلفات على:$STR$,
  $JSON$["زيادة تخزينها","زيادة نقلها","رفع كفاءة تدويرها","زيادة كميتها"]$JSON$::jsonb,
  2,
  51,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-52$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$من وسائل حماية التنوع الحيوي:$STR$,
  $JSON$["توسيع العمران","استعادة الموائل","زيادة الاستغلال","تجزئة الموائل"]$JSON$::jsonb,
  1,
  52,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-53$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تسهم المساحات الخضراء في:$STR$,
  $JSON$["زيادة التلوث","زيادة حرارة الأسطح","تقليل الموائل","خفض درجات الحرارة"]$JSON$::jsonb,
  3,
  53,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-54$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تطوير نظم الإنذار المبكر مثال على:$STR$,
  $JSON$["التخفيف","الترشيد","التكيف","إعادة التدوير"]$JSON$::jsonb,
  2,
  54,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-55$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$يركز التخفيف على:$STR$,
  $JSON$["آثار المشكلة","مسببات التغير المناخي","توزيع السكان","زيادة التكيف"]$JSON$::jsonb,
  1,
  55,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-56$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$يركز التكيف على:$STR$,
  $JSON$["التعامل مع آثار التغير المناخي","زيادة الانبعاثات","استهلاك الموارد","إنتاج المخلفات"]$JSON$::jsonb,
  0,
  56,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-57$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$استخدام الطاقة المتجددة لخفض الانبعاثات يمثل:$STR$,
  $JSON$["تكيفًا","معالجةً","ترشيدًا فقط","تخفيفًا"]$JSON$::jsonb,
  3,
  57,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-58$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$المنطقة ذات الإشعاع الشمسي المرتفع تناسبها:$STR$,
  $JSON$["الطاقة الشمسية","طاقة المياه","طاقة الرياح فقط","الوقود الأحفوري"]$JSON$::jsonb,
  0,
  58,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-59$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$تساعد خرائط الأولوية على تحديد:$STR$,
  $JSON$["شبكات النقل","بؤر الاحتياج","أشكال المباني","أسماء المناطق"]$JSON$::jsonb,
  1,
  59,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-60$STR$,
  $STR$pre_test$STR$,
  $STR$multiple_choice$STR$,
  $STR$عند محدودية الموارد نبدأ بـ:$STR$,
  $JSON$["المنطقة الأكبر","المنطقة الأقرب","المنطقة الأعلى أولوية","المنطقة الأقل تعرضًا"]$JSON$::jsonb,
  2,
  60,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-61$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$قد تنتقل آثار المشكلة البيئية إلى مناطق بعيدة عن مصدرها.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  61,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-62$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تشابه المناخ بين منطقتين يعني تشابه مشكلاتهما البيئية.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  62,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-63$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يساعد مفتاح الخريطة في تفسير دلالات الرموز والألوان.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  63,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-64$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$زيادة الغطاء النباتي تؤدي عادةً إلى زيادة تعرية التربة.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  64,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-65$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يمكن أن يؤثر النشاط البشري في توزيع المشكلات البيئية.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  65,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-66$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تركز التلوث في مكان معين يعني أن مصدره يقع داخله بالضرورة.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  66,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-67$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$مقارنة خرائط المكان عبر الزمن تساعد في اكتشاف التغيرات المكانية.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  67,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-68$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$المورد المتجدد لا يتأثر بمعدل استهلاكه مهما زاد.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  68,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-69$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$قد يختلف الحل المناسب للمشكلة نفسها باختلاف خصائص المكان.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  69,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-70$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$التفكير المكاني يهتم بموقع الظاهرة دون دراسة علاقتها بالمناطق المحيطة.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  70,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-71$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يمكن أن تختلف مستويات تلوث الهواء بين منطقتين متقاربتين بسبب اختلاف اتجاه الرياح.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  71,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-72$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تبقى ملوثات المياه دائمًا في المكان الذي دخلت منه إلى البيئة المائية.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  72,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-73$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$قد ينقل الجريان السطحي المبيدات من الأراضي الزراعية إلى المجاري المائية.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  73,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-74$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$ترتبط المناطق الصناعية بالمبيدات والأسمدة بوصفها المصدر الرئيس لتلوث تربتها.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  74,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-75$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$قد تصل بعض ملوثات التربة إلى المياه الجوفية وتؤثر في مناطق بعيدة.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  75,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-76$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تقل شدة الضوضاء دائمًا كلما اقتربنا من مصدرها.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  76,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-77$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تساعد خريطة استخدامات الأرض في تفسير التوزيع المكاني لتلوث التربة.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  77,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-78$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تتساوى مستويات الضوضاء في المكان نفسه مهما اختلف وقت القياس.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  78,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-79$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$لا يشترط أن تكون المنطقة الأكثر تضررًا من التلوث هي الأقرب إلى مصدره.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  79,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-80$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تحديد مصدر التلوث وحده يكفي لفهم نمط انتشاره المكاني دون دراسة مسار انتقاله.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  80,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-81$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يشير التغير المناخي إلى تحولات طويلة المدى في خصائص النظام المناخي.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  81,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-82$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يمكن تحديد مناخ منطقة ما من خلال حالة الطقس فيها خلال عدة أيام فقط.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  82,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-83$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يؤدي الاحتباس الحراري الطبيعي دورًا في المحافظة على درجة حرارة مناسبة للحياة على الأرض.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  83,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-84$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تنتج جميع غازات الاحتباس الحراري من مصدر واحد فقط هو حرق الوقود الأحفوري.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  84,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-85$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$لا يعني حدوث الاحترار العالمي أن درجات الحرارة ترتفع بالمقدار نفسه في جميع المناطق.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  85,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-86$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يقتصر تغير أنماط الأمطار على تغير كميتها فقط دون توقيتها أو شدة هطولها.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  86,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-87$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$قد يؤدي ارتفاع مستوى سطح البحر إلى تداخل المياه المالحة مع بعض مصادر المياه العذبة.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  87,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-88$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تقتصر آثار التغيرات المناخية على إنتاج المحاصيل ولا تمتد إلى سلاسل الإمداد والأسواق.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  88,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-89$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$قد تغير بعض الأنواع الحية نطاق انتشارها أو توقيت نشاطها استجابةً للتحولات المناخية.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  89,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-90$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تتأثر جميع المناطق بالظاهرة المناخية نفسها بالدرجة ذاتها مهما اختلفت خصائص المكان وقدرته على التكيف.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  90,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-91$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تهدف الاستدامة البيئية إلى تلبية احتياجات الحاضر مع الحفاظ على حقوق الأجيال القادمة.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  91,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-92$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تعتمد استدامة الموارد المتجددة على استخدامها بمعدل أكبر من قدرتها على التجدد.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  92,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-93$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يعني ترشيد استهلاك المياه الامتناع عن استخدامها قدر الإمكان.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  93,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-94$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يعتمد اختيار مصدر الطاقة المتجددة المناسب على خصائص الموقع.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  94,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-95$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يساعد فرز المخلفات من المصدر على رفع كفاءة إعادة التدوير.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  95,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-96$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تكون مكافحة التلوث أكثر فاعلية بعد انتشار الملوثات بعيدًا عن مصدرها.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  96,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-97$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تتأثر فاعلية المساحات الخضراء بموقعها ومساحتها وتوزيعها.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  97,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-98$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يركز التكيف مع التغير المناخي على خفض مسبباته فقط.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  98,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-99$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$يمكن تطبيق الحل البيئي نفسه في جميع الأماكن دون دراسة خصائصها.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  1,
  99,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-unified-100$STR$,
  $STR$pre_test$STR$,
  $STR$true_false$STR$,
  $STR$تساعد خرائط الأولوية على تحديد المناطق الأكثر احتياجًا للتدخل البيئي.$STR$,
  $JSON$["صواب","خطأ"]$JSON$::jsonb,
  0,
  100,
  $STR$2026-09-29T12:49:23.895Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-1$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مما يلي يُعد مكونًا طبيعيًا للبيئة؟$STR$,
  $JSON$["الطرق","المصانع","التربة","المباني"]$JSON$::jsonb,
  2,
  1,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-2$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مما يلي يُعد مكونًا بشريًا؟$STR$,
  $JSON$["المدرسة","المياه","التربة","النباتات"]$JSON$::jsonb,
  0,
  2,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-3$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$تتأثر مكونات البيئة بعضها ببعض بعلاقة:$STR$,
  $JSON$["منفصلة","متبادلة","مؤقتة","ثابتة"]$JSON$::jsonb,
  1,
  3,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-4$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$يختلف توزيع المشكلات البيئية بسبب اختلاف:$STR$,
  $JSON$["أسماء الأماكن","أشكال المباني","أعداد الطرق","خصائص المكان"]$JSON$::jsonb,
  3,
  4,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-5$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$تساعد الخريطة البيئية على تحديد:$STR$,
  $JSON$["توزيع الظواهر","أسماء السكان","أعمار المباني","أوقات الدراسة"]$JSON$::jsonb,
  0,
  5,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-6$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$يُحدد موقع الظاهرة بالنسبة لغيرها من خلال:$STR$,
  $JSON$["اللون","الحجم","العلاقة المكانية","الزمن"]$JSON$::jsonb,
  2,
  6,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-7$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$المنطقة الأقرب إلى مصدر التلوث تكون غالبًا:$STR$,
  $JSON$["أقل تعرضًا","أكثر تعرضًا","غير متأثرة","متساوية التأثر"]$JSON$::jsonb,
  1,
  7,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-8$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$تفيد مقارنة خرائط المكان عبر الزمن في معرفة:$STR$,
  $JSON$["اتجاه الشمال","أسماء المواقع","مساحة الخريطة","التغير البيئي"]$JSON$::jsonb,
  3,
  8,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-9$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$لتحديد منطقة التلوث نبحث أولًا عن:$STR$,
  $JSON$["مصدر التلوث","عدد المباني","مساحة المنطقة","شكل الطرق"]$JSON$::jsonb,
  0,
  9,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod1-10$STR$,
  $STR$module_module-1$STR$,
  $STR$multiple_choice$STR$,
  $STR$يعتمد القرار البيئي المكاني على:$STR$,
  $JSON$["الرأي الشخصي","عامل واحد","تحليل بيانات المكان","مساحة المكان فقط"]$JSON$::jsonb,
  2,
  10,
  $STR$2026-09-28T17:00:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-1$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مصدر يرتبط بتلوث الهواء؟$STR$,
  $JSON$["المصانع","المزارع","الحدائق","الأنهار"]$JSON$::jsonb,
  0,
  1,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-2$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$تنتقل ملوثات الهواء أساسًا بفعل:$STR$,
  $JSON$["التربة","الرياح","النباتات","الصخور"]$JSON$::jsonb,
  1,
  2,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-3$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي نشاط قد يلوث المياه مباشرة؟$STR$,
  $JSON$["التشجير","التبخر","تصريف الصرف","حصاد الأمطار"]$JSON$::jsonb,
  2,
  3,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-4$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$تنتقل ملوثات النهر غالبًا مع:$STR$,
  $JSON$["الرياح","التربة","الطرق","جريان المياه"]$JSON$::jsonb,
  3,
  4,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-5$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$الإفراط في المبيدات يؤدي إلى تلوث:$STR$,
  $JSON$["التربة","الهواء فقط","الطرق","المباني"]$JSON$::jsonb,
  0,
  5,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-6$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$ترتفع الضوضاء غالبًا قرب:$STR$,
  $JSON$["المزارع","الطرق المزدحمة","الحدائق","المحميات"]$JSON$::jsonb,
  1,
  6,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-7$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$تساعد خريطة التلوث على تحديد:$STR$,
  $JSON$["شكل المباني","أسماء الشوارع","مناطق التركز","أعمار السكان"]$JSON$::jsonb,
  2,
  7,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-8$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$المنطقة الواقعة في مسار الملوث تكون:$STR$,
  $JSON$["أقل تعرضًا","بعيدة عنه","غير متأثرة","أكثر تعرضًا"]$JSON$::jsonb,
  3,
  8,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-9$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$عند مقارنة منطقتين نستخدم:$STR$,
  $JSON$["المؤشر نفسه","مؤشرين مختلفين","وحدتين مختلفتين","زمنين مختلفين"]$JSON$::jsonb,
  0,
  9,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod2-10$STR$,
  $STR$module_module-2$STR$,
  $STR$multiple_choice$STR$,
  $STR$اختيار موقع مصنع يتطلب مراعاة:$STR$,
  $JSON$["لون التربة","المناطق المتأثرة","شكل المباني","أسماء الطرق"]$JSON$::jsonb,
  1,
  10,
  $STR$2026-09-29T14:50:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-1$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$التغير المناخي يشير إلى تغيرات:$STR$,
  $JSON$["يومية","قصيرة","طويلة المدى","مفاجئة"]$JSON$::jsonb,
  2,
  1,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-2$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$يختلف المناخ عن الطقس في:$STR$,
  $JSON$["المدة الزمنية","اتجاه الرياح","كمية المياه","نوع التربة"]$JSON$::jsonb,
  0,
  2,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-3$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$من أهم أسباب زيادة الاحتباس الحراري:$STR$,
  $JSON$["الأمطار","الانبعاثات","الرياح","السحب"]$JSON$::jsonb,
  1,
  3,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-4$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$يؤدي ارتفاع الحرارة إلى زيادة:$STR$,
  $JSON$["التجمد","الرطوبة دائمًا","الأمطار دائمًا","التبخر"]$JSON$::jsonb,
  3,
  4,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-5$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$المناطق الساحلية أكثر تعرضًا لخطر:$STR$,
  $JSON$["ارتفاع سطح البحر","انجراف الرياح","الزلازل","البراكين"]$JSON$::jsonb,
  0,
  5,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-6$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$قلة الأمطار قد تؤدي إلى:$STR$,
  $JSON$["الفيضانات","الجفاف","الأعاصير","المد والجزر"]$JSON$::jsonb,
  1,
  6,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-7$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$تختلف آثار التغير المناخي بين الأماكن بسبب اختلاف:$STR$,
  $JSON$["أسمائها","مساحاتها فقط","خصائصها","حدودها"]$JSON$::jsonb,
  2,
  7,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-8$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$تساعد الخرائط المناخية على تحديد:$STR$,
  $JSON$["أسماء المدن","أنواع المباني","شبكة الطرق","مناطق الخطر"]$JSON$::jsonb,
  3,
  8,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-9$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$بناء حواجز ضد ارتفاع البحر يُعد:$STR$,
  $JSON$["تكيفًا","تخفيفًا","تلوثًا","استنزافًا"]$JSON$::jsonb,
  0,
  9,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod3-10$STR$,
  $STR$module_module-3$STR$,
  $STR$multiple_choice$STR$,
  $STR$استخدام الطاقة الشمسية لخفض الانبعاثات يُعد:$STR$,
  $JSON$["تكيفًا","تخفيفًا","استنزافًا","معالجةً"]$JSON$::jsonb,
  1,
  10,
  $STR$2026-09-29T10:38:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-1$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$تهدف الاستدامة البيئية إلى:$STR$,
  $JSON$["زيادة الاستهلاك","استنزاف الموارد","حفظ الموارد","زيادة المخلفات"]$JSON$::jsonb,
  2,
  1,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-2$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$الاستخدام المستدام للموارد يعني:$STR$,
  $JSON$["تقليل الهدر","زيادة الاستهلاك","وقف الاستخدام","تجاهل التجدد"]$JSON$::jsonb,
  0,
  2,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-3$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$من وسائل ترشيد المياه:$STR$,
  $JSON$["زيادة الري","إصلاح التسربات","زيادة التصريف","ترك الصنابير"]$JSON$::jsonb,
  1,
  3,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-4$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$أي مصدر يُعد متجددًا؟$STR$,
  $JSON$["الفحم","النفط","الغاز","الشمس"]$JSON$::jsonb,
  3,
  4,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-5$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$يساعد فرز المخلفات على:$STR$,
  $JSON$["إعادة التدوير","زيادة التلوث","زيادة الهدر","استنزاف الموارد"]$JSON$::jsonb,
  0,
  5,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-6$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$أفضل وسيلة للحد من التلوث هي:$STR$,
  $JSON$["نقله","تقليله عند المصدر","نشره","تجاهله"]$JSON$::jsonb,
  1,
  6,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-7$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$حماية موائل الكائنات تساعد على حفظ:$STR$,
  $JSON$["الوقود","المباني","التنوع الحيوي","الطرق"]$JSON$::jsonb,
  2,
  7,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-8$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$بناء حواجز لمواجهة ارتفاع البحر يُعد:$STR$,
  $JSON$["تدويرًا","ترشيدًا","تخفيفًا","تكيفًا"]$JSON$::jsonb,
  3,
  8,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-9$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$تُحدد أولوية التدخل البيئي وفق:$STR$,
  $JSON$["شدة المشكلة والتعرض","اسم المنطقة","شكل المباني","عدد الطرق"]$JSON$::jsonb,
  0,
  9,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

INSERT INTO public.questions (id, exam_type, question_type, question_text, options, correct_option_index, order_index, created_at) VALUES (
  $STR$q-mod4-10$STR$,
  $STR$module_module-4$STR$,
  $STR$multiple_choice$STR$,
  $STR$اختيار الحل البيئي المناسب يعتمد على:$STR$,
  $JSON$["الرأي الشخصي","خصائص المكان","لون الخريطة","اسم المشروع"]$JSON$::jsonb,
  1,
  10,
  $STR$2026-09-29T10:55:00.000Z$STR$
) ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_index = EXCLUDED.correct_option_index,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- 4. SEED MODULES
-- ==============================================================================
INSERT INTO public.modules (id, "order", title, subtitle, duration_minutes, images, slides, scaffolding, sections, activity, created_at) VALUES (
  $STR$module-1$STR$,
  1,
  $STR$الموديول الأول: مكونات البيئة والعلاقات المكانية$STR$,
  $STR$التعرف على مكونات البيئة الحية وغير الحية والعلاقات المكانية التفاعلية بينها$STR$,
  30,
  $JSON$["https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/1.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/2.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/3.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598084/4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598094/5.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598087/6.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/7.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598086/8.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/9.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/10.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598088/11.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598091/12.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598092/13.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598093/14.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/15.png"]$JSON$::jsonb,
  $JSON$[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/1.png","title":"1","scaffolding":{"hint":"ركّز على ما يحيط بك من ماء وهواء وتربة وكائنات حية وعناصر صنعها الإنسان.","extraInfo":"البيئة ليست العناصر منفردة فقط، بل تشمل أيضًا العلاقات والتفاعلات التي تحدث بينها.","example":"الحديقة تضم تربة وماءً ونباتات وطيورًا، وقد تضم أيضًا ممرات ومقاعد وإنارة صنعها الإنسان؛ وجميعها تشكّل بيئة المكان.","selfQuestion":"انظر إلى المكان الذي توجد فيه الآن؛ ما العناصر الطبيعية والبشرية التي تستطيع تحديدها؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598083/2.png","title":"2","scaffolding":{"hint":"عند دراسة أي نظام بيئي، ابحث عن الكائنات الحية والعناصر غير الحية والعلاقات التي تربط بينها.","extraInfo":"قد تختلف الأنظمة البيئية في المساحة؛ فقد يكون النظام البيئي صغيرًا مثل بركة ماء، أو واسعًا مثل الصحراء أو البحر.","example":"في النظام البيئي المائي تتفاعل الأسماك والنباتات المائية مع الماء والضوء ودرجة الحرارة، ويؤثر تغير أي عنصر في بقية العناصر.","selfQuestion":"ما النظام البيئي الأقرب إلى المنطقة التي تعيش فيها؟ وما أهم العناصر الحية وغير الحية الموجودة فيه؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/3.png","title":"3","scaffolding":{"hint":"فكّر في التوازن البيئي باعتباره شبكة مترابطة؛ فتغيّر عنصر واحد قد يؤثر في عناصر أخرى.","extraInfo":"لا يعني التوازن البيئي ثبات أعداد الكائنات تمامًا، وإنما بقاء التغيرات ضمن حدود تسمح للنظام البيئي بالاستمرار.","example":"إذا انخفض عدد الحيوانات المفترسة بصورة كبيرة، فقد تزداد أعداد الحيوانات العاشبة، مما يؤدي إلى زيادة استهلاك النباتات والتأثير في توازن النظام البيئي.","selfQuestion":"ماذا تتوقع أن يحدث لبقية عناصر النظام البيئي إذا اختفى أحد أنواع الكائنات الحية منه؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598084/4.png","title":"4","scaffolding":{"hint":"فكّر في الأشياء التي تستخدمها يوميًا، ثم حاول تحديد المورد البيئي الذي جاءت منه.","extraInfo":"تنقسم الموارد البيئية إلى موارد متجددة يمكن أن تتجدد طبيعيًا، وموارد غير متجددة تحتاج إلى فترات زمنية طويلة جدًا لتتكون.","example":"ضوء الشمس والرياح من الموارد المتجددة، بينما النفط والفحم وبعض المعادن من الموارد غير المتجددة.","selfQuestion":"ما أهم الموارد البيئية التي تعتمد عليها في حياتك اليومية؟ وكيف يمكنك تقليل استهلاكها؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598094/5.png","title":"5","scaffolding":{"hint":"ليست كل العناصر التي يصنعها الإنسان ضارة بالبيئة؛ فالأثر يعتمد على طريقة التخطيط والاستخدام.","extraInfo":"يمكن للتخطيط البيئي للمدن والطرق والمصانع أن يقلل استهلاك الموارد والانبعاثات ويحافظ على المساحات الطبيعية.","example":"إنشاء طريق يخدم السكان قد يكون ضروريًا، لكن اختيار مساره بعيدًا عن الأراضي الزراعية والمحميات يقلل أثره البيئي.","selfQuestion":"انظر إلى منطقتك؛ ما أبرز العناصر التي صنعها الإنسان؟ وكيف تؤثر إيجابيًا أو سلبيًا في البيئة المحيطة؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598087/6.png","title":"6","scaffolding":{"hint":"عند دراسة أي تحدٍّ بيئي، حاول تحديد المشكلة ومكان حدوثها وأسبابها ونتائجها؛ فذلك يساعدك على فهمها بصورة مكانية أفضل.","extraInfo":"لا تظهر التحديات البيئية بالدرجة نفسها في جميع الأماكن؛ فقد تختلف شدتها من منطقة إلى أخرى تبعًا للسكان والأنشطة البشرية والموارد والخصائص الطبيعية.","example":"قد يزداد تلوث الهواء بالقرب من المناطق الصناعية والطرق المزدحمة، بينما تكون مستوياته أقل في المناطق ذات المساحات الخضراء الواسعة.","selfQuestion":"ما أبرز مشكلة بيئية تلاحظها في منطقتك؟ وأين تتركز أكثر؟ وما الأسباب التي قد تفسر توزيعها المكاني؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598085/7.png","title":"7","scaffolding":{"hint":"التنمية المستدامة لا تعني التوقف عن استخدام الموارد، وإنما استخدامها بطريقة تلبي احتياجاتنا مع الحفاظ عليها للأجيال القادمة.","extraInfo":"تقوم التنمية المستدامة على تحقيق التوازن بين ثلاثة أبعاد مترابطة: البيئي والاقتصادي والاجتماعي.","example":"استخدام الطاقة الشمسية في المدارس والمنازل يساعد على توفير الطاقة وتقليل الاعتماد على مصادر الطاقة الملوثة.","selfQuestion":"أي سلوك من سلوكيات حماية البيئة الموجودة في الشريحة يمكنك تطبيقه يوميًا؟ وكيف يمكن أن يؤثر تطبيقه في البيئة المحيطة بك؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598086/8.png","title":"8","scaffolding":{"hint":"حماية البيئة تبدأ من السلوك اليومي للفرد؛ فالعادات الصغيرة عندما يلتزم بها عدد كبير من الناس تُحدث أثرًا واضحًا.","extraInfo":"المسؤولية البيئية لا تقتصر على المنزل، بل تمتد إلى المدرسة والحي والأماكن العامة.","example":"إغلاق صنبور المياه أثناء تنظيف الأسنان، وإطفاء الإضاءة عند مغادرة الغرفة، وفرز المخلفات ممارسات بسيطة تقلل استهلاك الموارد.","selfQuestion":"ما السلوك البيئي الذي يمكنك البدء في تغييره من اليوم؟ وكيف يمكن أن تشجع زملاءك على ممارسته؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/9.png","title":"9","scaffolding":{"hint":"بعض المشكلات البيئية أكبر من أن يحلها فرد بمفرده؛ لذلك تصبح المشاركة والتعاون المجتمعي أكثر فاعلية.","extraInfo":"المشاركة المجتمعية البيئية تشمل الأفراد والمدارس والمؤسسات والجمعيات والجهات المحلية، ويمكن لكل جهة أن تؤدي دورًا مختلفًا ومتكاملًا.","example":"يمكن لطلاب المدرسة تنظيم حملة لتشجير محيط المدرسة، وتوزيع الأدوار بين زراعة الأشجار والعناية بها ونشر التوعية بأهميتها.","selfQuestion":"إذا أردت تنفيذ مبادرة بيئية في مدرستك أو منطقتك، فما المشكلة التي ستختارها؟ ومن الجهات التي يمكن أن تتعاون معها؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598090/10.png","title":"10","scaffolding":{"hint":"التكنولوجيا تصبح صديقة للبيئة عندما تساعد على تقليل استهلاك الموارد أو خفض التلوث أو مراقبة المشكلات البيئية.","extraInfo":"تساعد تقنيات الاستشعار والأقمار الصناعية ونظم المعلومات الجغرافية في جمع بيانات عن البيئة وتحديد مواقع التغيرات والمشكلات ومتابعتها عبر الزمن.","example":"يمكن استخدام أجهزة قياس جودة الهواء في مناطق مختلفة من المدينة، ثم مقارنة النتائج لتحديد الأماكن الأكثر تعرضًا للتلوث.","selfQuestion":"كيف يمكن استخدام التكنولوجيا للكشف عن مشكلة بيئية في منطقتك وتحديد الأماكن الأكثر تأثرًا بها؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598088/11.png","title":"11","scaffolding":{"hint":"فكّر في أثر قراراتك الحالية على البيئة بعد ١٠ أو ٢٠ عامًا؛ فالاستدامة تربط بين الحاضر والمستقبل.","extraInfo":"من مبادئ الاستدامة العدالة بين الأجيال؛ أي استخدام الموارد حاليًا بطريقة لا تقلل فرص الأجيال القادمة في الحصول عليها.","example":"التوسع في زراعة الأشجار وحماية الأراضي الزراعية اليوم يساعد في توفير بيئة أكثر صحة واستقرارًا للأجيال القادمة.","selfQuestion":"إذا استمرت أنماط استهلاك الموارد الحالية دون تغيير، فكيف تتوقع أن تبدو البيئة في منطقتك مستقبلًا؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598091/12.png","title":"12","scaffolding":{"hint":"قبل اتخاذ أي قرار يؤثر في البيئة، اسأل: هل يلبي احتياجاتنا الحالية دون الإضرار بحقوق الأجيال القادمة؟","extraInfo":"الحفاظ على حقوق الأجيال القادمة يُعرف بمبدأ العدالة بين الأجيال، وهو أحد المبادئ الأساسية المرتبطة بالتنمية المستدامة.","example":"الاعتماد على الطاقة الشمسية بدلًا من الإفراط في استهلاك الوقود الأحفوري يقلل الانبعاثات ويحافظ على الموارد غير المتجددة للمستقبل.","selfQuestion":"ما مورد طبيعي تستخدمه يوميًا؟ وما السلوك الذي يمكنك تغييره للمساعدة في الحفاظ عليه للأجيال القادمة؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598092/13.png","title":"13","scaffolding":{"spatialThink":"حدّد أولًا موقع المشكلة البيئية، ثم لاحظ خصائص المكان الطبيعية والبشرية التي قد تفسر ظهورها.","observe":"تختلف المشكلات بين المناطق الساحلية والصحراوية والزراعية والحضرية لأن لكل منطقة خصائص مكانية مختلفة.","compare":"قارن بين منطقة حضرية ومنطقة زراعية من حيث نوع النشاط البشري والموارد المتاحة والمشكلات البيئية المحتملة.","infer":"لماذا لا يصلح حل بيئي واحد للتطبيق بالطريقة نفسها في جميع الأماكن؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598093/14.png","title":"14","scaffolding":{"mapRead":"استخدم مفتاح الخريطة أولًا لمعرفة مدلول كل رمز، ثم حدّد الأماكن التي يظهر فيها كل نوع من المشكلات البيئية.","patternDiscover":"لاحظ هل تنتشر المشكلة في أماكن متفرقة، أم تتجمع في نطاق مكاني محدد، أم ترتبط بنوع معين من المناطق.","spatialRelate":"فكّر في العلاقة بين موقع المشكلة وخصائص المنطقة، مثل الكثافة السكانية أو النشاط الصناعي أو الزراعي أو طبيعة السطح.","infer":"ما المشكلة التي يظهر لها تركز مكاني واضح على الخريطة؟ وما العامل الذي يمكن أن يفسر هذا التركز؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790598096/15.png","title":"15","scaffolding":{"trackRelation":"اختر عنصرًا من المشهد، مثل النهر، وتتبّع كيف يؤثر في الزراعة والمدن والصناعة، وكيف تؤثر هذه الأنشطة فيه بدورها.","distinguishEffect":"صنّف العلاقات التي تراها إلى علاقات إيجابية تدعم استدامة المكان، وعلاقات سلبية تسبب ضغطًا على البيئة.","causeEffect":"قد يحدث الأثر البيئي في مكان مختلف عن مصدره؛ فتلوث المياه في منطقة ما يمكن أن ينتقل إلى مناطق أخرى مع حركة المياه.","deepThink":"إذا توسعت مدينة على حساب الأراضي الزراعية المحيطة بها، فما التغيرات المكانية والبيئية التي تتوقع حدوثها؟"}}]$JSON$::jsonb,
  NULL,
  $JSON$[{"id":"sec-1","title":"1. مفهوم النظام البيئي وعناصره الأساسية","content":"النظام البيئي هو مجتمع متكامل من الكائنات الحية التي تتفاعل مع بعضها البعض ومع العناصر غير الحية المحيطة بها كالماء، الهواء، والتربة ضمن دورة بيئية متوازنة تحافظ على استمرارية الحياة."}]$JSON$::jsonb,
  $JSON${"id":"act-1","title":"النشاط الأول: مكونات البيئة من حولي","description":"الهدف: التمييز بين مكونات البيئة وفهمها.\nالمهمة: تأمل البيئة المحيطة بمدرستك، ثم حدّد ثلاثة مكونات طبيعية وثلاثة مكونات بشرية وفق الجدول التالي.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790676044/%D9%86%D8%B4%D8%A7%D8%B7_1.png","requiresSubmission":true}$JSON$::jsonb,
  $STR$2026-09-22T16:00:00.000Z$STR$
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
  $STR$module-2$STR$,
  2,
  $STR$الموديول الثاني: التلوث البيئي ومصادره وتوزيعه المكاني$STR$,
  $STR$التعرف على التلوث البيئي ومصادره وتوزيعه المكاني وطرق الحد منه$STR$,
  30,
  $JSON$["https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/1.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/2.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622510/3.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622514/5.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/6.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622508/7.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/8.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622512/9.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/10.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622513/11.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/12.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622518/13.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/14.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/15.png"]$JSON$::jsonb,
  $JSON$[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/1.png","title":"1","scaffolding":{"hint":"ركّز على الفرق بين مكونات البيئة في الجانب النظيف والجانب الملوث، ولاحظ كيف يمكن للملوثات أن تغيّر خصائصها.","extraInfo":"لا يشترط أن يكون الملوث شيئًا مرئيًا؛ فقد يكون مادة كيميائية أو غازًا أو شكلًا من أشكال الطاقة كالضوضاء والحرارة.","example":"زيادة عوادم السيارات في شارع مزدحم قد ترفع تركيز الملوثات في الهواء وتؤثر في جودة البيئة المحيطة.","selfQuestion":"متى يتحول وجود مادة أو طاقة في البيئة من حالة عادية إلى مصدر للتلوث؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622505/2.png","title":"2","scaffolding":{"hint":"اسأل أولًا: هل نتج الملوث عن عملية طبيعية أم عن نشاط قام به الإنسان؟ فهذا يساعدك على تحديد مصدره.","extraInfo":"قد تنتج الطبيعة ملوثات مثل الرماد البركاني والغبار، لكن الأنشطة البشرية قد تزيد تركيز بعض الملوثات واستمرارها في المناطق المأهولة.","example":"العاصفة الترابية مصدر طبيعي للجسيمات العالقة في الهواء، بينما عوادم السيارات مصدر بشري لها.","selfQuestion":"إذا وجدت ارتفاعًا في تلوث الهواء في منطقة ما، فما المعلومات التي تحتاج إليها لتحدد ما إذا كان مصدره طبيعيًا أم بشريًا؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622510/3.png","title":"3","scaffolding":{"hint":"صنّف الملوث وفق طبيعته أولًا: صلب، سائل، غازي، أو طاقة؛ فهذا يساعدك على توقع طريقة انتشاره وتأثيره في البيئة.","extraInfo":"تختلف خطورة الملوثات باختلاف تركيزها ومدة بقائها وطريقة انتقالها، وليس بنوعها فقط.","example":"عوادم السيارات ملوثات غازية تنتشر في الهواء، بينما مياه الصرف ملوثات سائلة قد تنتقل إلى الأنهار أو المياه الجوفية.","selfQuestion":"أي أنواع الملوثات يمكن أن ينتقل لمسافات أكبر من مكان إنتاجه؟ وما العامل الذي يساعد على انتقاله؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/4.png","title":"4","scaffolding":{"hint":"اربط بين نوع الملوث والعنصر الذي يتعرض له؛ فاختلاف الملوث يؤدي إلى اختلاف الآثار الناتجة عنه.","extraInfo":"قد لا تتوقف آثار التلوث عند مكان حدوثه، بل يمكن أن تنتقل إلى مناطق أخرى عبر الهواء أو المياه وتؤثر في الإنسان والكائنات الحية.","example":"تلوث مياه النهر قد يؤدي إلى نفوق بعض الكائنات المائية، ويؤثر في صحة الإنسان إذا استُخدمت المياه الملوثة.","selfQuestion":"إذا استمر التلوث في منطقة ما فترة طويلة، فما الآثار التي يمكن أن تظهر على الإنسان والبيئة والمجتمع؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622514/5.png","title":"5","scaffolding":{"hint":"الحد من التلوث يكون أكثر فاعلية عندما نمنع الملوثات من مصدرها قبل أن تنتشر في البيئة.","extraInfo":"لا تعتمد مواجهة التلوث على حل واحد؛ بل تحتاج إلى تكامل التقنيات النظيفة، والنقل المستدام، والطاقة المتجددة، والإدارة السليمة للنفايات، والوعي البيئي.","example":"استخدام وسائل النقل الجماعي بدلًا من الاعتماد المتزايد على السيارات الخاصة يساعد على تقليل استهلاك الوقود وانبعاثات ملوثات الهواء.","selfQuestion":"أي إجراء من إجراءات الحد من التلوث يمكن تطبيقه في منطقتك، وما المشكلة التي سيساعد على تقليلها؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/6.png","title":"6","scaffolding":{"hint":"ابدأ بالسلوكيات التي تمارسها يوميًا؛ فترشيد الموارد وتقليل النفايات واختيار وسيلة النقل يمكن أن يقلل مصادر التلوث مباشرة.","extraInfo":"تزداد فاعلية الممارسات الفردية عندما تتحول إلى عادات مستمرة ويشارك فيها عدد كبير من أفراد المجتمع.","example":"استخدام زجاجة قابلة لإعادة الاستخدام بدلًا من الزجاجات البلاستيكية أحادية الاستخدام يقلل كمية المخلفات الناتجة يوميًا.","selfQuestion":"ما السلوك اليومي الذي تقوم به ويمكنك تغييره من اليوم ليصبح أقل تأثيرًا في البيئة؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622508/7.png","title":"7","scaffolding":{"hint":"ركّز على مصدر الملوث ونوعه؛ فمعرفة مصدر تلوث الهواء تساعد على تفسير ارتفاع تركيزه في بعض الأماكن.","extraInfo":"قد تبقى بعض الملوثات معلقة في الهواء، ويمكن أن تنتقل بفعل الرياح إلى مناطق بعيدة عن مصدر انبعاثها.","example":"تزداد ملوثات الهواء عادةً بالقرب من الطرق المزدحمة بسبب كثرة عوادم المركبات، بينما تقل نسبيًا في المناطق البعيدة عن حركة المرور.","selfQuestion":"كيف يمكن أن يؤثر اتجاه الرياح في انتقال ملوثات الهواء من منطقة صناعية إلى المناطق المحيطة بها؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622509/8.png","title":"8","scaffolding":{"hint":"عند تحديد منطقة تلوث الهواء، لا تكتفِ بمعرفة مصدر الانبعاث، بل لاحظ اتجاه الرياح والمسافة عن المصدر.","extraInfo":"قد تكون منطقة بعيدة نسبيًا عن مصدر التلوث أكثر تأثرًا من منطقة أقرب إليه إذا حملت الرياح الملوثات في اتجاهها.","example":"قد تنتقل انبعاثات مصنع بفعل الرياح نحو حي سكني يقع في اتجاه هبوبها، بينما يكون حي أقرب إلى المصنع أقل تأثرًا إذا كان في الاتجاه المعاكس.","selfQuestion":"لماذا يمكن أن تختلف مستويات تلوث الهواء بين منطقتين متقاربتين رغم تعرضهما لمصدر التلوث نفسه؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622512/9.png","title":"9","scaffolding":{"hint":"عند ملاحظة تغير لون المياه أو رائحتها، فكّر في مصدر الملوث الذي يمكن أن يكون قد وصل إليها.","extraInfo":"قد تبدو المياه نظيفة ظاهريًا ومع ذلك تحتوي على ملوثات دقيقة أو كائنات ممرضة لا يمكن رؤيتها بالعين المجردة.","example":"وصول مياه الصرف غير المعالجة إلى مجرى مائي قد يؤدي إلى تدهور جودة المياه وانتشار الأمراض والإضرار بالكائنات المائية.","selfQuestion":"كيف يمكن لنشاط يحدث على اليابسة، مثل استخدام المبيدات الزراعية، أن يؤدي إلى تلوث مصدر مائي قريب؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/10.png","title":"10","scaffolding":{"hint":"عند تتبع ملوثات المياه، ابحث عن ثلاثة عناصر أساسية: مصدر التلوث، ومسار انتقاله، والمنطقة التي يصل إليها.","extraInfo":"قد تنتقل بعض الملوثات لمسافات بعيدة دون أن تكون واضحة للعين، خاصةً عند تسربها إلى المياه الجوفية أو انتقالها مع التيارات المائية.","example":"قد تحمل مياه الأمطار بقايا المبيدات من أرض زراعية إلى مجرى مائي قريب، ثم تنتقل الملوثات مع حركة المياه إلى مناطق أخرى.","selfQuestion":"إذا ظهر تلوث في منطقة بعيدة عن أي مصدر واضح، فكيف يمكنك استخدام اتجاه حركة المياه وطبيعة السطح للوصول إلى المصدر المحتمل؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622513/11.png","title":"11","scaffolding":{"hint":"عند ملاحظة تدهور التربة، فكّر في الأنشطة التي تحدث فوقها أو بالقرب منها؛ فقد تساعدك على تحديد مصدر التلوث.","extraInfo":"بعض ملوثات التربة لا تبقى في الطبقات السطحية، بل قد تتسرب إلى أعماق أكبر وتصل إلى المياه الجوفية أو تمتصها النباتات.","example":"الإفراط في استخدام المبيدات في الأراضي الزراعية قد يؤدي إلى تراكم بقاياها في التربة، ثم انتقال جزء منها إلى النباتات أو المياه الجوفية.","selfQuestion":"كيف يمكن أن يتحول تلوث بقعة محدودة من التربة إلى مشكلة تؤثر في أماكن أو عناصر بيئية أخرى؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/12.png","title":"12","scaffolding":{"hint":"ابدأ بتحديد نوع استخدام الأرض في المكان، ثم ابحث عن الأنشطة المرتبطة به والمصادر المحتملة لتلوث التربة.","extraInfo":"تساعد خرائط استخدامات الأرض في تفسير اختلاف تلوث التربة من مكان إلى آخر، لأنها تكشف العلاقة بين الأنشطة البشرية ومواقع ظهور الملوثات.","example":"قد ترتفع احتمالية تلوث التربة بالمبيدات في منطقة زراعية، بينما ترتفع احتمالية وجود الزيوت والمواد الكيميائية بالقرب من منطقة صناعية.","selfQuestion":"إذا أظهرت الخريطة ارتفاع تلوث التربة في منطقة معينة، فكيف يمكن أن تستخدم نوع استخدام الأرض المحيطة بها لتفسير سبب هذا التلوث؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622518/13.png","title":"13","scaffolding":{"hint":"لا يُعد كل صوت تلوثًا ضوضائيًا؛ انتبه إلى شدة الصوت ومدة التعرض له ومدى إزعاجه.","extraInfo":"يقاس مستوى شدة الصوت بوحدة الديسيبل (dB)، ويزداد تأثير الضوضاء في الإنسان كلما ارتفع مستوى الصوت وطالت مدة التعرض له.","example":"الوجود لفترات طويلة بالقرب من طريق مزدحم أو موقع بناء قد يسبب التوتر وضعف التركيز، وقد يؤثر التعرض المستمر للأصوات المرتفعة في السمع.","selfQuestion":"ما أكثر مصادر الضوضاء التي تلاحظها في البيئة المحيطة بك، وفي أي أوقات تكون شدتها أكبر؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622517/14.png","title":"14","scaffolding":{"hint":"عند مقارنة الضوضاء بين مكانين، راقب المسافة عن مصدر الصوت وكثافة النشاط في كل مكان.","extraInfo":"قد يتغير مستوى الضوضاء في المكان نفسه خلال اليوم؛ فالطريق قد يكون أكثر ضوضاء في ساعات الذروة وأقل في الأوقات التي تنخفض فيها حركة المرور.","example":"عادةً يكون مستوى الضوضاء بالقرب من طريق رئيسي أعلى منه داخل منطقة سكنية هادئة بعيدة عنه، وقد تساعد الأشجار والحواجز في تقليل وصول الصوت.","selfQuestion":"إذا أردت اختيار موقع أكثر هدوءًا لإنشاء مدرسة، فما المعلومات المكانية التي ستبحث عنها قبل اختيار الموقع؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622521/15.png","title":"15"}]$JSON$::jsonb,
  $JSON${"hint":"تأمل في مصادر التلوث في بيئتك وكيف تؤثر على الصحة العامة والتوزيع المكاني.","extraInfo":"التلوث البيئي يشمل تلوث الهواء والماء والتربة والتلوث الضوضائي.","example":"الانبعاثات الصناعية وعوادم السيارات تمثل أبرز مسببات تلوث الهواء في المدن.","selfQuestion":"كيف يمكن للمجتمع المساهمة في تقليل مصادر التلوث البيئي؟"}$JSON$::jsonb,
  $JSON$[{"id":"sec-2-1","title":"1. مفهوم التلوث البيئي ومصادره","content":"التلوث البيئي هو إدخال مواد ضارة أو ملوثات إلى البيئة الطبيعية مما يسبب تغيراً سلبياً في خصائصها ويؤثر على الكائنات الحية."}]$JSON$::jsonb,
  $JSON${"id":"act-1","title":"النشاط الأول: تتبع مسار التلوث","description":"الهدف: التعرف على مصدر التلوث ومسار انتشاره في البيئة.\nالمهمة: تأمل الخريطة أمامك التي توضح مصدرًا للتلوث ومناطق سكنية ومجرى مائيًا، ثم حدّد مصدر التلوث ومسار انتقاله والمنطقة الأكثر تأثرًا.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790622523/%D9%86%D8%B4%D8%A7%D8%B7_1.png","requiresSubmission":true}$JSON$::jsonb,
  $STR$2026-09-28T15:20:00.000Z$STR$
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
  $STR$module-3$STR$,
  3,
  $STR$الموديول الثالث: التغيرات المناخية وآثارها البيئية والمكانية$STR$,
  $STR$التعرف على التغيرات المناخية وآثارها البيئية والمكانية على كوكب الأرض$STR$,
  30,
  $JSON$["https://res.cloudinary.com/makcnu5x/image/upload/v1790677337/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/1.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/2.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/3.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677331/5.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677335/6.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/7.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677332/8.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677336/9.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677330/10.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677333/11.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677334/12.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/13.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/14.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/15.png"]$JSON$::jsonb,
  $JSON$[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677337/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/1.png","title":"1","scaffolding":{"hint":"ركّز على المدة الزمنية التي يستمر خلالها التغير؛ فالتغير المناخي لا يُحكم عليه من خلال فترة قصيرة.","extraInfo":"يحتاج اكتشاف التغير المناخي إلى سجلات وملاحظات متتابعة تسمح بمقارنة خصائص المناخ عبر فترات زمنية طويلة.","example":"ملاحظة اتجاه مستمر في خصائص المناخ على مدى عقود تُعد مؤشرًا على تغير مناخي، بخلاف التقلبات التي تحدث خلال عدة أيام.","selfQuestion":"ما الدليل الذي تحتاج إليه لكي تميز بين تغير مناخي طويل المدى وتغير مؤقت في حالة الجو؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/2.png","title":"2","scaffolding":{"hint":"ركّز على المدة الزمنية عند التمييز بين الطقس والمناخ؛ أحدهما يصف حالة قصيرة المدى، والآخر يعتمد على خصائص ممتدة عبر سنوات.","extraInfo":"يمكن أن يختلف طقس اليوم عن اليوم التالي دون أن يعني ذلك حدوث تغير في مناخ المنطقة.","example":"سقوط الأمطار اليوم يصف حالة الطقس، بينما دراسة طبيعة الأمطار المعتادة في المنطقة على مدى سنوات تساعد في وصف مناخها.","selfQuestion":"إذا مر أسبوع شديد البرودة في منطقة معروفة بارتفاع درجات الحرارة، فهل يكفي ذلك للحكم على أن مناخها قد تغير؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/3.png","title":"3","scaffolding":{"hint":"صنّف الأسباب أولًا إلى عوامل طبيعية وعوامل ناتجة عن الإنسان، ثم فكّر في طريقة تأثير كل منها في النظام المناخي.","extraInfo":"تختلف العوامل المؤثرة في المناخ في قوتها ومدة تأثيرها؛ لذلك لا يؤدي كل عامل إلى الدرجة نفسها من التغير.","example":"قد يؤثر انفجار بركاني كبير في المناخ لفترة معينة، بينما يمكن لبعض التأثيرات البشرية المستمرة أن تتراكم آثارها عبر فترات أطول.","selfQuestion":"لماذا تُعد مدة استمرار العامل المؤثر عنصرًا مهمًا عند دراسة أسباب التغيرات المناخية؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677326/4.png","title":"4","scaffolding":{"hint":"تتبّع مسار الطاقة من وصول أشعة الشمس إلى الأرض، ثم عودة جزء منها نحو الغلاف الجوي.","extraInfo":"الاحتباس الحراري في مستواه الطبيعي ضروري للحياة، وتظهر المشكلة عندما يختل التوازن الحراري نتيجة زيادة احتجاز الحرارة.","example":"عندما يزداد مقدار الحرارة المحتجزة في الغلاف الجوي مقارنة بما يفقده النظام إلى الخارج، يرتفع متوسط درجة حرارة الأرض تدريجيًا.","selfQuestion":"ماذا يمكن أن يحدث لدرجة حرارة الأرض إذا أصبح الغلاف الجوي يحتفظ بكمية أكبر من الحرارة؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677331/5.png","title":"5","scaffolding":{"hint":"اربط كل غاز بمصدره الرئيس؛ فمصادر ثاني أكسيد الكربون تختلف عن مصادر الميثان وأكسيد النيتروز.","extraInfo":"تختلف غازات الاحتباس الحراري في قدرتها على التأثير في توازن الطاقة وفي مدة بقائها في الغلاف الجوي.","example":"يمكن أن ينتج الميثان من مدافن النفايات وتربية الماشية، في حين يرتبط أكسيد النيتروز بصورة مهمة باستخدام الأسمدة النيتروجينية وإدارة التربة الزراعية.","selfQuestion":"كيف يمكن أن يساعد تحديد مصدر كل غاز من غازات الاحتباس الحراري في اختيار الإجراء المناسب للحد من انبعاثاته؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677335/6.png","title":"6","scaffolding":{"hint":"تتبّع العلاقة بين النشاط البشري وما يسببه من تغير في تركيب الغلاف الجوي أو قدرة النظم الطبيعية على تخزين الكربون.","extraInfo":"لا يقتصر التأثير البشري على الانبعاثات المباشرة؛ فتغيير استخدام الأراضي وإزالة الغطاء النباتي يمكن أن يغيرا قدرة البيئة على تخزين الكربون.","example":"تحويل مساحة خضراء إلى منطقة عمرانية قد يجمع بين زيادة استهلاك الطاقة وانخفاض قدرة المنطقة على تخزين الكربون.","selfQuestion":"أي تغييرات في طريقة إدارة الطاقة والنقل والمدن والأراضي يمكن أن تقلل التأثير البشري في النظام المناخي؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677328/7.png","title":"7","scaffolding":{"hint":"لا تربط الاحترار بيوم شديد الحرارة، بل ابحث عن اتجاه مستمر في متوسط درجات الحرارة عبر فترة زمنية طويلة.","extraInfo":"لا ترتفع الحرارة بالمعدل نفسه في جميع أجزاء الأرض؛ إذ تختلف استجابة اليابسة والمحيطات والأقاليم المختلفة للاحترار.","example":"قد تظهر منطقة يابسة ارتفاعًا أسرع في درجات الحرارة مقارنة بمنطقة بحرية مجاورة، رغم تأثرهما بالاتجاه المناخي نفسه.","selfQuestion":"لماذا تساعد مقارنة خرائط درجات الحرارة بين مناطق مختلفة وعبر فترات زمنية طويلة على فهم الاحترار بصورة أدق؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677332/8.png","title":"8","scaffolding":{"hint":"عند دراسة تغير الأمطار، لا تنظر إلى الكمية فقط؛ راقب أيضًا توقيت الهطول وتكراره وشدته.","extraInfo":"قد يعني تغير نمط الأمطار انخفاض عدد الأيام الممطرة مع زيادة شدة الهطول في الأيام التي تسقط فيها الأمطار.","example":"قد تشهد منطقة فترات جفاف أطول، بينما تتعرض منطقة أخرى لأمطار غزيرة خلال مدة قصيرة.","selfQuestion":"كيف تساعد مقارنة خرائط الأمطار لفترات زمنية مختلفة في تحديد المناطق التي شهدت أكبر تغير؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677336/9.png","title":"9","scaffolding":{"hint":"لا يكفي أن تكون الظاهرة قوية حتى تُعد متطرفة؛ قارنها أولًا بما يُعد معتادًا في المكان الذي حدثت فيه.","extraInfo":"قد تكون الظاهرة الجوية متطرفة في منطقة، بينما لا تُعد كذلك في منطقة أخرى؛ لأن الحدود المعتادة للطقس تختلف مكانيًا.","example":"كمية من الأمطار قد تكون معتادة في إقليم كثير الأمطار، لكنها قد تمثل حدثًا متطرفًا في إقليم جاف إذا تجاوزت مستوياته المعتادة بدرجة كبيرة.","selfQuestion":"لماذا يجب معرفة مكان حدوث الظاهرة والفترة الزمنية وبياناتها السابقة قبل الحكم عليها بأنها ظاهرة جوية متطرفة؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677330/10.png","title":"10","scaffolding":{"hint":"فرّق بين السببين الرئيسيين لارتفاع مستوى البحر: تمدد مياه المحيطات عند ارتفاع حرارتها، وإضافة مياه جديدة نتيجة فقدان الجليد الموجود على اليابسة.","extraInfo":"لا تتساوى السواحل في درجة تعرضها للخطر؛ فارتفاع الأرض وشكل الساحل والظروف المحلية تؤثر في حجم التأثير.","example":"قد تكون منطقة ساحلية منخفضة أكثر تعرضًا للغمر وتداخل المياه المالحة مقارنة بساحل مرتفع، حتى عند تعرضهما لارتفاع متقارب في مستوى البحر.","selfQuestion":"ما الخصائص المكانية التي ينبغي دراستها لتحديد المناطق الساحلية الأكثر تعرضًا لمخاطر ارتفاع مستوى سطح البحر؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677333/11.png","title":"11","scaffolding":{"hint":"تتبّع أثر التغير المناخي في دورة المياه بدءًا من تغير الأمطار، ثم لاحظ انعكاس ذلك على الأنهار والمياه الجوفية وكميات المياه المتاحة.","extraInfo":"لا تعني وفرة المياه في سنة معينة ضمان استمرارها؛ فقد يتغير توقيت توافرها وكميتها من موسم إلى آخر.","example":"انخفاض تغذية المياه الجوفية خلال فترات الجفاف قد يقلل المياه المتاحة للشرب والري، ويزيد المنافسة عليها بين الاستخدامات المختلفة.","selfQuestion":"إذا انخفضت كمية المياه المتاحة في منطقة ما، فكيف يمكن تحديد الأولويات بين احتياجات الشرب والزراعة والصناعة؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677334/12.png","title":"12","scaffolding":{"hint":"تتبّع التأثير من بداية الإنتاج الزراعي حتى وصول الغذاء إلى المستهلك؛ فالأثر لا يتوقف عند نمو المحصول.","extraInfo":"تختلف استجابة المحاصيل للظروف المناخية؛ فلكل محصول احتياجات محددة من الحرارة والمياه خلال مراحل نموه.","example":"تغير موعد الأمطار قد يستدعي تعديل موعد زراعة محصول معين وكمية الري اللازمة له، ثم ينعكس ذلك على موعد الحصاد والإنتاج.","selfQuestion":"كيف يمكن أن يؤدي انخفاض إنتاج محصول في منطقة زراعية إلى تأثيرات تمتد إلى التخزين والنقل والأسواق وتوافر الغذاء؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/13.png","title":"13","scaffolding":{"hint":"تتبّع استجابة النوع الحي للتغير في بيئته: هل يبقى في موطنه، أم ينتقل، أم يغيّر توقيت نشاطه؟","extraInfo":"الأنواع التي تعيش في موائل محدودة أو مجزأة قد تواجه صعوبة أكبر في الانتقال إلى مناطق تتوافر فيها ظروف مناسبة.","example":"قد يؤدي تغير توقيت هجرة أحد الأنواع إلى عدم تزامن وصوله مع الفترة التي يتوافر فيها غذاؤه، مما يؤثر في بقائه وتكاثره.","selfQuestion":"كيف يمكن أن يؤدي تغير انتشار نوع واحد إلى تأثيرات تمتد إلى أنواع أخرى داخل النظام البيئي؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/14.png","title":"14","scaffolding":{"hint":"عند مقارنة مكانين، لا تدرس الظاهرة المناخية وحدها؛ قارن أيضًا خصائص كل مكان ودرجة تعرضه وقدرته على التكيف.","extraInfo":"قد تتساوى منطقتان في مستوى التعرض لخطر مناخي معين، لكن تختلف الخسائر بينهما بسبب اختلاف البنية العمرانية والموارد وإمكانات الاستجابة.","example":"قد تؤثر موجة حر واحدة بدرجة أكبر في مدينة كثيفة المباني مقارنة بمنطقة أقل كثافة وأكثر غطاءً نباتيًا.","selfQuestion":"إذا تعرضت منطقتان للظاهرة المناخية نفسها، فما الخصائص المكانية التي ستقارن بينها لتفسير اختلاف حجم التأثير؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677338/15.png","title":"15","scaffolding":{"hint":"لا تعتمد على البيانات المناخية وحدها؛ ادمجها مع معلومات السكان والموارد واستخدامات الأرض لتحديد المناطق الأكثر تأثرًا.","extraInfo":"قد تظهر الخرائط المكانية أن مناطق متقاربة جغرافيًا تختلف في درجة التأثر نتيجة اختلاف كثافة السكان أو الموارد أو خصائص استخدام الأرض.","example":"قد تكشف الخريطة أن منطقة ساحلية منخفضة وكثيفة السكان تحتاج إلى أولوية أكبر في الاستعداد مقارنة بمنطقة ساحلية أخرى أقل تعرضًا وأقل كثافة.","selfQuestion":"إذا كانت لديك عدة طبقات من البيانات المكانية، فكيف ستستخدمها لتحديد المنطقة التي ينبغي أن تحصل على الأولوية في إجراءات التكيف؟"}}]$JSON$::jsonb,
  $JSON${"hint":"تأمل ظواهر الاحتباس الحراري وتأثيراتها المكانية على المناخ ومناسيب المياه.","extraInfo":"التغير المناخي يؤدي إلى تقلبات جوية حادة، وارتفاع درجات الحرارة العالمية، وذوبان الجليد.","example":"زيادة معدلات الجفاف في بعض المناطق وفيضانات غير مسبوقة في مناطق أخرى.","selfQuestion":"ما الإجراءات العالمية والمحلية التي تساهم في التكيف مع التغيرات المناخية؟"}$JSON$::jsonb,
  $JSON$[{"id":"sec-3-1","title":"1. أسباب التغيرات المناخية وآثارها المكانية","content":"تعد انبعاثات الغازات الدفيئة والأنشطة الصناعية غير المنضبطة من أبرز المحركات لتغير المناخ العالمي وآثاره على التنوع الحيوي."}]$JSON$::jsonb,
  $JSON${"id":"act-1","title":"النشاط الأول: ماذا تغيّر في المكان؟","description":"الهدف: التعرف على بعض آثار التغيرات المناخية على الأماكن والموارد البيئية.\nالمهمة: تأمل الصورتين للمكان نفسه في فترتين مختلفتين، ثم حدّد التغيرات التي حدثت في الفترة الأحدث وفسر أحد هذه التغيرات.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790677341/%D9%86%D8%B4%D8%A7%D8%B7_1.png","requiresSubmission":true}$JSON$::jsonb,
  $STR$2026-09-28T15:20:00.000Z$STR$
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
  $STR$module-4$STR$,
  4,
  $STR$الموديول الرابع: الاستدامة البيئية وإدارة الموارد$STR$,
  $STR$التعرف على الاستدامة البيئية وكيفية مواجهة المشكلات البيئية واتخاذ القرارات$STR$,
  30,
  $JSON$["https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81_-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678690/1-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/2-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678697/3-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/4-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/5-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678695/6-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/7-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678698/8-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/9-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/10-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678707/11-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678702/12-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/13-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678703/14-4.png","https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/15-4.png"]$JSON$::jsonb,
  $JSON$[{"id":"slide-cover","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/%D8%A7%D9%84%D8%BA%D9%84%D8%A7%D9%81_-4.png","title":"0"},{"id":"slide-1","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678690/1-4.png","title":"1","scaffolding":{"hint":"ركّز على فكرتين أساسيتين في الاستدامة: تلبية احتياجات الحاضر، والحفاظ على قدرة الأجيال القادمة على تلبية احتياجاتها.","extraInfo":"لا تعني الاستدامة منع استخدام الموارد، وإنما إدارتها بطريقة تحافظ على استمرار وظائف البيئة ومواردها على المدى الطويل.","example":"عند إنشاء مشروع جديد، يمكن مراعاة احتياجات السكان الحالية مع تقليل استهلاك الموارد وتجنب الإضرار بالنظم الطبيعية المحيطة.","selfQuestion":"كيف يمكن لقرار نتخذه اليوم بشأن استخدام مورد طبيعي أن يؤثر في قدرة الأجيال القادمة على الاستفادة منه؟"}},{"id":"slide-2","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/2-4.png","title":"2","scaffolding":{"hint":"فكّر في العلاقة في اتجاهين: ماذا يحصل الإنسان من الموارد الطبيعية؟ وكيف تؤثر أنشطته في هذه الموارد؟","extraInfo":"تختلف الأنشطة البشرية من مكان إلى آخر تبعًا لنوع الموارد المتاحة وخصائصها؛ لذلك يرتبط توزيع كثير من الأنشطة الاقتصادية بتوزيع الموارد.","example":"وجود تربة خصبة ومياه متاحة قد يشجع النشاط الزراعي، بينما تؤثر طريقة الزراعة في جودة التربة وكمية المياه المتاحة مستقبلًا.","selfQuestion":"إذا تغيرت كمية مورد طبيعي أو جودته في مكان ما، فكيف يمكن أن تتغير أنشطة السكان في هذا المكان؟"}},{"id":"slide-3","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678697/3-4.png","title":"3","scaffolding":{"hint":"ميّز بين طريقة التعامل مع الموارد المتجددة وطريقة التعامل مع الموارد غير المتجددة؛ فلكل نوع أسلوب إدارة مختلف.","extraInfo":"قدرة المورد على التجدد لا تعني أنه غير قابل للاستنزاف؛ فقد يؤدي استخدامه بمعدل أسرع من قدرته على التعويض إلى تدهوره.","example":"يمكن استغلال الغابات بصورة مستدامة عندما يتناسب معدل قطع الأشجار مع قدرتها على التجدد، بينما يحتاج استخدام المعادن إلى تقليل الهدر وإعادة الاستخدام والبحث عن بدائل.","selfQuestion":"كيف تحدد معدل استخدام مورد طبيعي بحيث نستفيد منه حاليًا دون تهديد استمراره مستقبلًا؟"}},{"id":"slide-4","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678693/4-4.png","title":"4","scaffolding":{"hint":"ترشيد المياه لا يعني تقليل احتياجات الإنسان الأساسية، بل يعني الحصول على الفائدة المطلوبة مع تقليل الفقد والهدر.","extraInfo":"تساعد متابعة كمية المياه المستهلكة بانتظام على اكتشاف الزيادة غير المعتادة في الاستهلاك، والتي قد تشير إلى وجود تسرب أو هدر.","example":"استخدام الري بالتنقيط بدلًا من بعض طرق الري التقليدية يساعد على توصيل المياه إلى النباتات بكفاءة أكبر وتقليل الفاقد.","selfQuestion":"إذا لاحظت ارتفاع استهلاك المياه في منزل أو منشأة، فما البيانات التي تحتاج إلى فحصها لتحديد مكان الهدر واختيار الإجراء المناسب؟"}},{"id":"slide-5","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/5-4.png","title":"5","scaffolding":{"hint":"ترشيد الطاقة لا يعني الاستغناء عن الخدمات التي نحتاجها، بل الحصول على الخدمة نفسها باستهلاك أقل وكفاءة أعلى.","extraInfo":"تساعد متابعة أنماط استهلاك الطاقة على معرفة الأوقات والأنشطة التي يرتفع فيها الطلب، ومن ثم تحديد فرص الترشيد الأكثر فاعلية.","example":"استخدام مصابيح موفرة للطاقة مع الاستفادة من الإضاءة الطبيعية يقلل استهلاك الكهرباء مع الحفاظ على مستوى الإضاءة المطلوب.","selfQuestion":"ما الأجهزة أو الأنشطة التي تستهلك أكبر قدر من الطاقة في منزلك أو مدرستك، وما الإجراء الذي يمكن اتخاذه لتقليل استهلاكها؟"}},{"id":"slide-6","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678695/6-4.png","title":"6","scaffolding":{"hint":"لا يصلح كل مصدر من مصادر الطاقة المتجددة لكل مكان؛ اربط اختيار المصدر بخصائص الموقع والموارد المتاحة فيه.","extraInfo":"تختلف كفاءة مشروعات الطاقة المتجددة مكانيًا تبعًا لعوامل مثل شدة الإشعاع الشمسي، وسرعة الرياح، وتوافر الموارد المائية والحرارية الأرضية.","example":"قد تكون منطقة ذات إشعاع شمسي مرتفع أكثر ملاءمة لإنشاء محطة للطاقة الشمسية، بينما تكون منطقة ذات رياح قوية ومنتظمة أنسب لطاقة الرياح.","selfQuestion":"إذا أردت اختيار موقع لمشروع طاقة متجددة، فما البيانات المكانية التي ستدرسها لتحديد مصدر الطاقة الأكثر ملاءمة؟"}},{"id":"slide-7","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/7-4.png","title":"7","scaffolding":{"hint":"تبدأ الإدارة السليمة للمخلفات قبل مرحلة التدوير؛ فالأولوية تكون لتقليل إنتاج المخلفات ثم إعادة الاستخدام.","extraInfo":"يساعد فصل المخلفات من المصدر على تقليل اختلاط المواد ورفع جودة المواد القابلة للتدوير، مما يزيد كفاءة الاستفادة منها.","example":"يمكن فرز الورق والبلاستيك والمعادن في حاويات منفصلة، ثم إرسال المواد القابلة للتدوير إلى جهات المعالجة بدلًا من التخلص منها مع باقي المخلفات.","selfQuestion":"كيف يمكن أن يؤثر موقع حاويات الفرز ومراكز جمع المخلفات في كفاءة عملية إعادة التدوير داخل منطقة سكنية؟"}},{"id":"slide-8","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678698/8-4.png","title":"8","scaffolding":{"hint":"تبدأ الوقاية الفعالة من التلوث بتحديد مصدر الملوث ومسار انتقاله قبل اختيار طريقة الحد منه.","extraInfo":"يكون منع الملوثات أو تقليلها عند المصدر أكثر فاعلية من محاولة معالجتها بعد انتشارها في الهواء أو الماء أو التربة.","example":"يمكن تقليل تلوث أحد المجاري المائية بمعالجة مياه الصرف الصناعي قبل تصريفها، بدلًا من محاولة إزالة الملوثات بعد انتشارها في المياه.","selfQuestion":"إذا ظهر تلوث في منطقة ما، فما المعلومات التي تحتاج إليها لتحديد مصدره ومسار انتقاله واختيار المكان الأنسب للتدخل؟"}},{"id":"slide-9","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/9-4.png","title":"9","scaffolding":{"hint":"حماية التنوع الحيوي لا تقتصر على حماية الأنواع نفسها، بل تشمل أيضًا حماية الموائل والروابط التي تسمح للكائنات بالانتقال بينها.","extraInfo":"يؤدي تجزؤ الموائل إلى عزل بعض جماعات الكائنات الحية، لذلك تساعد الممرات البيئية على استمرار حركتها وتبادلها الوراثي بين المناطق.","example":"إنشاء ممر بيئي يربط بين منطقتين طبيعيتين منفصلتين قد يسمح للحيوانات بالانتقال بينهما بأمان بدلًا من بقائها في موائل معزولة.","selfQuestion":"كيف يمكن استخدام بيانات توزيع الأنواع ومساحات موائلها لتحديد المواقع التي تحتاج إلى أولوية في إجراءات الحماية؟"}},{"id":"slide-10","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678699/10-4.png","title":"10","scaffolding":{"hint":"لا تعتمد فائدة المساحات الخضراء على وجودها فقط، بل تتأثر أيضًا بموقعها ومساحتها ومدى ترابطها داخل المدينة.","extraInfo":"يساعد توزيع المساحات الخضراء بصورة متوازنة بين الأحياء على زيادة عدد السكان المستفيدين من خدماتها البيئية.","example":"زراعة الأشجار على جانبي الشوارع وحول المباني يمكن أن توفر الظل وتخفض حرارة المناطق المحيطة، بينما توفر الحدائق موائل لبعض الطيور والكائنات الأخرى.","selfQuestion":"إذا أردت اختيار موقع لمساحة خضراء جديدة داخل مدينة، فما خصائص المكان التي ستدرسها لتحقيق أكبر فائدة بيئية ولأكبر عدد من السكان؟"}},{"id":"slide-11","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678707/11-4.png","title":"11","scaffolding":{"hint":"ركّز على أن التكيف لا يمنع الخطر المناخي نفسه، وإنما يساعد الإنسان والنظم البيئية على التعامل مع آثاره وتقليل أضراره.","extraInfo":"تختلف إجراءات التكيف من مكان إلى آخر؛ لأن نوع الخطر ودرجة التعرض وخصائص السكان والموارد تختلف مكانيًا.","example":"في منطقة معرضة للفيضانات يمكن تعديل تصميم المباني ورفع بعض المنشآت، بينما قد تحتاج منطقة تعاني نقص المياه إلى ممارسات أكثر كفاءة في إدارة المياه.","selfQuestion":"إذا تعرضت منطقتان لخطرين مناخيين مختلفين، فكيف ستحدد إجراء التكيف الأنسب لكل منطقة؟"}},{"id":"slide-12","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678702/12-4.png","title":"12","scaffolding":{"hint":"ركّز على مصدر المشكلة؛ فالتخفيف يستهدف تقليل مسببات التغير المناخي، خاصة انبعاثات غازات الاحتباس الحراري.","extraInfo":"لا يقتصر التخفيف على خفض الانبعاثات، بل يشمل أيضًا زيادة قدرة الغابات والنظم الطبيعية وغيرها من المصارف على إزالة الكربون وتخزينه.","example":"استبدال جزء من الكهرباء المنتجة من الوقود الأحفوري بالطاقة الشمسية يقلل الانبعاثات الناتجة عن إنتاج الطاقة، ولذلك يُعد إجراءً للتخفيف.","selfQuestion":"إذا أردت اختيار إجراء للتخفيف في مدينة ما، فما الأنشطة الأكثر تسببًا في الانبعاثات التي ينبغي تحديدها أولًا؟"}},{"id":"slide-13","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678704/13-4.png","title":"13","scaffolding":{"hint":"حدّد أولًا هدف الإجراء؛ فإذا كان يتعامل مع آثار التغير المناخي فهو تكيف، وإذا كان يستهدف مسبباته فهو تخفيف.","extraInfo":"يمكن تطبيق التكيف والتخفيف معًا؛ فهما نهجان متكاملان، لكن لكل منهما هدف مباشر مختلف.","example":"إنشاء حواجز لحماية منطقة ساحلية من الفيضانات يُعد تكيفًا، بينما استخدام الطاقة المتجددة لتقليل انبعاثات غازات الاحتباس الحراري يُعد تخفيفًا.","selfQuestion":"إذا زُرعت الأشجار في مدينة، فمتى يمكن اعتبار ذلك تكيفًا، ومتى يمكن اعتباره تخفيفًا؟"}},{"id":"slide-14","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678703/14-4.png","title":"14","scaffolding":{"hint":"ابدأ بدراسة خصائص المكان وموارده المتاحة قبل اختيار الحل البيئي؛ فالحل المناسب في منطقة قد لا يكون مناسبًا في منطقة أخرى.","extraInfo":"تزداد فاعلية الحل البيئي عندما يعتمد على الموارد والإمكانات المحلية، ويتوافق مع طبيعة الموقع واستخدامات الأرض والبنية الأساسية.","example":"يمكن الاعتماد على الطاقة الشمسية في منطقة تتمتع بإشعاع شمسي مرتفع، بينما تكون تقنيات الري الحديثة أكثر ملاءمة لمنطقة زراعية تعاني محدودية الموارد المائية.","selfQuestion":"إذا كانت أمامك عدة حلول بيئية لمشكلة واحدة، فما البيانات المكانية والموارد التي ستقارن بينها لاختيار الحل الأنسب للمكان؟"}},{"id":"slide-15","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678706/15-4.png","title":"15","scaffolding":{"hint":"لا تُحدد أولوية التدخل بناءً على شدة المشكلة وحدها؛ بل يجب النظر أيضًا إلى حجم التعرض والحساسية والقدرة على المواجهة.","extraInfo":"يساعد دمج عدة مؤشرات في خريطة واحدة على الكشف عن بؤر الاحتياج التي قد لا تظهر عند دراسة كل مؤشر بصورة منفردة.","example":"قد تحصل منطقة ذات تلوث مرتفع وكثافة سكانية كبيرة وقدرة محدودة على المواجهة على أولوية أعلى للتدخل من منطقة تعاني مستوى التلوث نفسه ولكنها أقل تعرضًا.","selfQuestion":"إذا كانت الموارد المتاحة للتدخل محدودة، فما المؤشرات التي ستستخدمها لتحديد المنطقة التي ينبغي البدء بها؟"}}]$JSON$::jsonb,
  $JSON${"hint":"فكّر في الاستدامة البيئية كنهج للحفاظ على الموارد للأجيال الحالية والمستقبلية.","extraInfo":"الاستدامة تتطلب التوازن بين النمو الاقتصادي، العدالة الاجتماعية، والحفاظ على البيئة الطبيعية.","example":"إعادة التدوير، الاقتصاد الدائري، والمباني الخضراء الصديقة للبيئة.","selfQuestion":"كيف تتخذ قرارات يومية تدعم الاستدامة البيئية وترشيد الاستهلاك؟"}$JSON$::jsonb,
  $JSON$[{"id":"sec-4-1","title":"1. مبادئ الاستدامة البيئية واتخاذ القرار البيئي","content":"ترتكز الاستدامة على الاستخدام الرشيد للموارد الطبيعية وتطبيق ممارسات صديقة للبيئة تضمن بقاء النظم البيئية للأجيال القادمة."}]$JSON$::jsonb,
  $JSON${"id":"act-1","title":"النشاط الأول: أيّهما أكثر استدامة؟","description":"الهدف: مقارنة منطقتين مختلفتين في استخدام الموارد واستنتاج المنطقة الأكثر استدامة.\nالمهمة: تأمل البيانات والصور في المنطقتين، ثم أجب عن الأسئلة المحددة.","imageUrl":"https://res.cloudinary.com/makcnu5x/image/upload/v1790678709/%D9%86%D8%B4%D8%A7%D8%B7_1-4.png","requiresSubmission":true}$JSON$::jsonb,
  $STR$2026-09-28T15:20:00.000Z$STR$
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
  $STR$vid-1790085377156$STR$,
  $STR$دليلك الشامل للتعلم الذاتي باستخدام الذكاء الاصطناعي$STR$,
  $STR$دليلك الشامل للتعلم الذاتي باستخدام الذكاء الاصطناعي$STR$,
  $STR$https://www.youtube.com/watch?v=-cRABLd2Ckk$STR$,
  $STR$-cRABLd2Ckk$STR$,
  $STR$$STR$,
  $STR$$STR$,
  $STR$2026-09-22$STR$
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

INSERT INTO public.library_videos (id, title, description, youtube_url, youtube_id, category, duration, added_at) VALUES (
  $STR$vid-1790085332032$STR$,
  $STR$دليلك الشامل للتعلم الذاتي باستخدام الذكاء الاصطناعي$STR$,
  $STR$محتوى مرئي إثرائي حول قضايا البيئة والتنمية المستدامة.$STR$,
  $STR$https://www.youtube.com/watch?v=-cRABLd2Ckk$STR$,
  $STR$-cRABLd2Ckk$STR$,
  $STR$$STR$,
  $STR$$STR$,
  $STR$2026-09-22$STR$
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_id = EXCLUDED.youtube_id,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration;

-- ==============================================================================
-- 10 ADMIN ACCOUNTS SEED FOR FACULTY OF GRADUATE STUDIES & ENVIRONMENTAL RESEARCH
-- كلية الدراسات العليا والبحوث البيئية • جامعة عين شمس
-- منصة بيئتي التعليمية التفاعلية
-- ==============================================================================

-- إدراج حسابات المشرفين العشرة في جدول public.accounts
insert into public.accounts (
  id,
  username,
  password,
  full_name,
  phone,
  role,
  is_profile_completed,
  is_banned,
  created_at,
  updated_at
)
values
  (
    'admin-01',
    'admin1',
    'Admin@Env2026#01',
    'د. المشرف الأكاديمي 1 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000001',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-02',
    'admin2',
    'Admin@Env2026#02',
    'د. المشرف الأكاديمي 2 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000002',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-03',
    'admin3',
    'Admin@Env2026#03',
    'د. المشرف الأكاديمي 3 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000003',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-04',
    'admin4',
    'Admin@Env2026#04',
    'د. المشرف التعليمي 1 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000004',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-05',
    'admin5',
    'Admin@Env2026#05',
    'د. المشرف التعليمي 2 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000005',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-06',
    'admin6',
    'Admin@Env2026#06',
    'د. المشرف التعليمي 3 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000006',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-07',
    'admin7',
    'Admin@Env2026#07',
    'أ. منسق الأنشطة والتقييم 1 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000007',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-08',
    'admin8',
    'Admin@Env2026#08',
    'أ. منسق الأنشطة والتقييم 2 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000008',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-09',
    'admin9',
    'Admin@Env2026#09',
    'أ. مسؤول الدعم الفني 1 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000009',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'admin-10',
    'admin10',
    'Admin@Env2026#10',
    'أ. مسؤول الدعم الفني 2 (كلية الدراسات العليا والبحوث البيئية)',
    '01000000010',
    'admin',
    true,
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
on conflict (id) do update set
  username = excluded.username,
  password = excluded.password,
  full_name = excluded.full_name,
  phone = excluded.phone,
  role = excluded.role,
  is_profile_completed = excluded.is_profile_completed,
  is_banned = excluded.is_banned,
  updated_at = timezone('utc'::text, now());
