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
