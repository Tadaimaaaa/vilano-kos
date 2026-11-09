import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  let profile = null

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const userRes = await supabase.auth.getUser()
      user = userRes.data?.user || null

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single()
        profile = data
      }
    } catch {
      // Supabase credentials not set or network issue
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user ? {
          id: user.id,
          email: user.email,
          full_name: profile?.full_name,
          role: profile?.role,
        } : null}
      />
      <main className="flex-1 page-transition">
        {children}
      </main>
      <Footer />
    </div>
  )
}

