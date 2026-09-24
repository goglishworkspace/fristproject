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
