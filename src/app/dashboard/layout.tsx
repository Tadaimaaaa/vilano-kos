import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Building2, CalendarCheck, LogOut, ChevronRight, Home, Shield, PlusCircle, ArrowLeft } from 'lucide-react'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUser()

  const isPemilik = profile?.role === 'pemilik' || profile?.role === 'admin'

  const navItems = [
    { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    ...(isPemilik
      ? [{ href: '/dashboard/properti', label: 'Properti Saya', icon: Building2 }]
      : []
    ),
    { href: '/dashboard/booking', label: isPemilik ? 'Booking Masuk' : 'Booking Saya', icon: CalendarCheck },
    ...(profile?.role === 'admin'
      ? [{ href: '/admin', label: 'Admin Master Panel', icon: Shield }]
      : []
    ),
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F2]/60 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E8D8C8] flex flex-col fixed h-full z-30 shadow-xs">
        {/* Brand */}
        <div className="p-5 border-b border-[#F5EDE4]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] flex items-center justify-center text-[#FAF7F2] shadow-md shadow-[#5D4037]/20">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-xl text-[#3E2723] tracking-tight">Vilano</span>
              <p className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wider">Dashboard Panel</p>
            </div>
          </Link>
        </div>

        {/* User Badge Profile */}
        <div className="p-4 border-b border-[#F5EDE4] bg-[#FAF7F2]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5D4037] to-[#8D6E63] flex items-center justify-center font-bold text-[#FAF7F2] text-sm shadow-xs">
              {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-[#2D241E] truncate">
                {profile?.full_name || 'Pengguna Vilano'}
              </p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                profile?.role === 'pemilik' ? 'bg-[#5D4037] text-[#FAF7F2]' :
                profile?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                'bg-[#F5EDE4] text-[#4E342E]'
              }`}>
                {profile?.role || 'Penyewa'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button for Owners */}
        {isPemilik && (
          <div className="px-4 pt-4">
            <Link href="/dashboard/properti/baru">
              <span className="w-full h-11 px-4 rounded-2xl bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-[#5D4037]/20 transition-all">
                <PlusCircle className="h-4 w-4 text-[#E8D8C8]" />
                Tambah Properti
              </span>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-[#6D4C41] hover:bg-[#F5EDE4] hover:text-[#3E2723] transition-all group"
            >
              <Icon className="h-4 w-4 text-[#8D6E63] group-hover:text-[#5D4037] transition-colors" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Footer / Exit */}
        <div className="p-4 border-t border-[#F5EDE4] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#8D6E63] hover:bg-[#F5EDE4] hover:text-[#3E2723] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Ke Beranda Publik
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8 lg:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
