import { createBrowserClient } from '@supabase/ssr'

function getCleanSupabaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/+$/, '');
  return url;
}

export function createClient() {
  return createBrowserClient(
    getCleanSupabaseUrl(),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
  )
}
