-- ==============================================================================
-- DATABASE SCHEMA FOR FACULTY EDUCATIONAL PLATFORM (SUPABASE / POSTGRESQL)
-- ==============================================================================

-- 1. PROFILES & ROLES
-- Extending Supabase auth.users with custom roles and metadata
create type user_role as enum ('admin', 'student');

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  student_id text unique, -- رقم الطالب / كود الدخول
  full_name text not null,
  role user_role default 'student' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Allow admins full access to profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 2. EXAM QUESTIONS (PRE & POST ASSESSMENTS)
create type exam_type as enum ('pre_test', 'post_test');

create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  exam_type exam_type not null,
  question_text text not null,
  options jsonb not null, -- Array of strings e.g. ["Option 1", "Option 2", "Option 3", "Option 4"]
  correct_option_index smallint not null, -- Hidden from students in API queries
  order_index int default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.questions enable row level security;

create policy "Admins can manage all questions"
  on public.questions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Authenticated users can read question texts and options"
  on public.questions for select
  using (auth.role() = 'authenticated');

-- 3. EXAM SUBMISSIONS & SCORES
create table if not exists public.exam_submissions (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  exam_type exam_type not null,
  score int not null,
  total_questions int not null,
  answers jsonb not null, -- Stores submitted answers: { question_id: selected_index }
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, exam_type)
);

alter table public.exam_submissions enable row level security;

create policy "Admins can view all exam submissions"
  on public.exam_submissions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Students can view their own submissions"
  on public.exam_submissions for select
  using (auth.uid() = student_id);

create policy "Students can insert their own submission"
  on public.exam_submissions for insert
  with check (auth.uid() = student_id);

-- 4. STUDENT PROGRESS TRACKING (Pre-test -> Modules -> Post-test)
create table if not exists public.student_progress (
  student_id uuid references public.profiles(id) on delete cascade primary key,
  pre_test_completed boolean default false not null,
  current_module_index int default 0 not null,
  post_test_completed boolean default false not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.student_progress enable row level security;

create policy "Admins can view all student progress"
  on public.student_progress for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Students can view and update their own progress"
  on public.student_progress for select
  using (auth.uid() = student_id);
