import { createClient } from '@supabase/supabase-js';

// Supports both NEXT_PUBLIC_ (configured) and VITE_ (fallback) prefixes
const url =
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_URL       as string | undefined);

const key =
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY        as string | undefined);

if (!url || !key) {
  console.warn('[scam-league] Supabase env vars not found — falling back to localStorage only.');
}

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  key ?? 'placeholder',
);

export const isSupabaseConfigured = !!(url && key && !url.includes('placeholder'));
