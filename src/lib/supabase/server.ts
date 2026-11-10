import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const DEFAULT_SUPABASE_URL = 'https://uqdjdasdjqubenkykozv.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_EgzOYdxHg_j1h_fYrQZRYg_IeKNw7g9'

export function isSupabaseConfigured(): boolean {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const url = (envUrl && !envUrl.includes('placeholder')) ? envUrl : DEFAULT_SUPABASE_URL
  const key = (envKey && !envKey.includes('placeholder')) ? envKey : DEFAULT_SUPABASE_ANON_KEY

  if (!url || !key) return false
  if (url.includes('placeholder')) return false
  if (key.includes('placeholder')) return false
  return true
}

export async function createClient() {
  const cookieStore = await cookies()
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabaseUrl = (envUrl && !envUrl.includes('placeholder')) ? envUrl : DEFAULT_SUPABASE_URL
  const supabaseKey = (envKey && !envKey.includes('placeholder')) ? envKey : DEFAULT_SUPABASE_ANON_KEY

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - cookies can't be set
          }
        },
      },
    }
  )
}

