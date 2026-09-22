/**
 * التحقق مما إذا كان مشروع Supabase حقيقياً ومتصلاً، أم أنه مجرد إعداد محلي تجريبي (Dummy/Placeholder)
 * يفيد هذا الفحص في منع الـ Network Timeouts والتأخير (10-30 ثانية) عند التصفح المحلي.
 */
export function isLiveSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) return false;

  if (
    url.includes('dummy') ||
    url.includes('placeholder') ||
    url.includes('your-project-id') ||
    url.includes('example.com')
  ) {
    return false;
  }

  return true;
}
