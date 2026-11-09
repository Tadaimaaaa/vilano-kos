import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Shield, Home, Building2, CalendarCheck, Users, LogOut, ArrowLeft } from 'lucide-react'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'pemilik') {
    redirect('/dashboard')
  }

  return { user, profile }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getAdminUser()

  return (
    <div className="min-h-screen bg-[#FAF7F2]/60 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F1A17] text-[#FAF7F2] flex flex-col fixed h-full z-20 border-r border-[#3E2723]">
        <div className="p-6 border-b border-[#3E2723]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] flex items-center justify-center text-[#FAF7F2] shadow-md border border-[#8D6E63]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-[#FAF7F2] text-lg tracking-tight">Vilano Admin</span>
              <p className="text-[10px] text-[#A98467] font-bold uppercase tracking-wider">Master Control</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-[#3E2723] bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#5D4037] text-[#FAF7F2] border border-[#8D6E63] rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs">
              {profile?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#FAF7F2] truncate">
                {profile?.full_name || user.email}
              </p>
              <span className="text-[10px] bg-[#5D4037] text-[#E8D8C8] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {profile?.role === 'admin' ? 'Administrator' : 'Pemilik Properti'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#E8D8C8] bg-[#3E2723] hover:bg-[#5D4037] transition-colors"
          >
            <Shield className="h-4 w-4 text-[#D4BCA7]" />
            <span>Master Control</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#A98467] hover:bg-[#3E2723] hover:text-[#FAF7F2] transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Dashboard Pemilik</span>
          </Link>
          <Link
            href="/dashboard/properti"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#A98467] hover:bg-[#3E2723] hover:text-[#FAF7F2] transition-colors"
          >
            <Building2 className="h-4 w-4" />
            <span>Kelola Unit Saya</span>
          </Link>
          <Link
            href="/dashboard/booking"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#A98467] hover:bg-[#3E2723] hover:text-[#FAF7F2] transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Booking Masuk</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#3E2723]">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#8D6E63] hover:text-[#FAF7F2] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Web Publik
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
