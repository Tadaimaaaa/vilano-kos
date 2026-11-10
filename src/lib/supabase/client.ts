import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://uqdjdasdjqubenkykozv.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_EgzOYdxHg_j1h_fYrQZRYg_IeKNw7g9'

export function createClient() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabaseUrl = (envUrl && !envUrl.includes('placeholder')) ? envUrl : DEFAULT_SUPABASE_URL
  const supabaseKey = (envKey && !envKey.includes('placeholder')) ? envKey : DEFAULT_SUPABASE_ANON_KEY

  return createBrowserClient(supabaseUrl, supabaseKey)
}

