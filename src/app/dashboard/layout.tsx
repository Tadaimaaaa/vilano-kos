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
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col fixed h-full z-30 shadow-xs">
        {/* Brand */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-xl text-slate-900 tracking-tight">Vilano</span>
              <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">Dashboard Panel</p>
            </div>
          </Link>
        </div>

        {/* User Badge Profile */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">
                {profile?.full_name || 'Pengguna Vilano'}
              </p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                profile?.role === 'pemilik' ? 'bg-orange-100 text-orange-800' :
                profile?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                'bg-teal-100 text-teal-800'
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
              <span className="w-full h-11 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition-all">
                <PlusCircle className="h-4 w-4" />
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
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-800 transition-all group"
            >
              <Icon className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Footer / Exit */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
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
