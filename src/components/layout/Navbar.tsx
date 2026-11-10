'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, Building2, Menu, X, User, LogOut, LayoutDashboard, Shield, Phone, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: {
    id: string
    email?: string
    full_name?: string
    role?: string
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isKos = Boolean(pathname?.startsWith('/kos'))
  const isHome = pathname === '/'
  const isKontrakan = Boolean(pathname?.startsWith('/kontrakan'))

  const currentActiveIndex = isKos ? 0 : isHome ? 1 : isKontrakan ? 2 : -1
  const [optimisticIndex, setOptimisticIndex] = useState<number | null>(null)

  useEffect(() => {
    setOptimisticIndex(null)
  }, [pathname])

  const activeIndex = optimisticIndex !== null ? optimisticIndex : currentActiveIndex

  const navTabs = [
    { href: '/kos', label: 'Kos', badge: 'Putra', icon: Building2 },
    { href: '/', label: 'Beranda', badge: null, icon: Sparkles },
    { href: '/kontrakan', label: 'Kontrakan', badge: null, icon: Home },
  ]

  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }


  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 relative">
          {/* Logo Brand */}
          <Link href="/" className="flex flex-col group py-1">
            <span className="font-black text-2xl md:text-[26px] tracking-tight text-[#3E2723] group-hover:text-[#5D4037] transition-colors leading-none">
              Vilano
            </span>
            <p className="text-[11px] text-[#8D6E63] font-semibold tracking-wide mt-1">
              Kos &bull; Kontrakan &bull; Kota Solok
            </p>
          </Link>

          {/* Switch Button: Kos, Beranda (Tengah), & Kontrakan dengan Animasi Sliding Smooth */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="relative grid grid-cols-3 w-80 lg:w-[350px] p-1.5 bg-[#F5EDE4]/95 rounded-full border border-[#D4BCA7] shadow-inner backdrop-blur-md overflow-hidden">
              {/* Sliding Active Indicator Pill */}
              <div
                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-12px)/3)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                style={{
                  transform: activeIndex >= 0 ? `translateX(${activeIndex * 100}%)` : undefined,
                  opacity: activeIndex >= 0 ? 1 : 0,
                  backgroundColor: activeIndex === 0 ? '#5D4037' : '#3E2723',
                  boxShadow: activeIndex === 0 ? '0 4px 14px rgba(93, 64, 55, 0.35)' : '0 4px 14px rgba(62, 39, 35, 0.35)',
                }}
              />

              {navTabs.map((tab, idx) => {
                const isActive = activeIndex === idx
                const Icon = tab.icon

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setOptimisticIndex(idx)}
                    className={cn(
                      "relative z-10 flex items-center justify-center gap-1.5 py-1.5 lg:py-2 rounded-full text-xs font-bold transition-all duration-200 select-none",
                      isActive
                        ? "text-[#FAF7F2]"
                        : "text-[#6D4C41] hover:text-[#3E2723]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 lg:h-4 lg:w-4 transition-transform duration-300",
                        isActive ? "text-[#E8D8C8] scale-105" : "text-[#8D6E63] group-hover:scale-105"
                      )}
                    />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors duration-300",
                          isActive
                            ? "bg-white/20 text-[#FAF7F2]"
                            : "bg-[#E8D8C8]/70 text-[#5D4037]"
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Direct Contact WhatsApp CTA */}
            <a
              href="https://wa.me/628127951435?text=Halo%20Pemilik%20Vilano,%20saya%20tertarik%20tanya%20ketersediaan%20unit%20kos%20/%20kontrakan%20di%20Kota%20Solok"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4BCA7] text-[#4E342E] bg-[#FAF7F2] hover:bg-[#F5EDE4] font-bold text-xs h-9 px-3.5 shadow-xs transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-[#5D4037]" />
              <span>Hubungi Pemilik</span>
            </a>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 rounded-2xl p-1.5 pr-3 bg-white border border-[#D4BCA7] shadow-xs hover:border-[#8D6E63] transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5D4037] to-[#8D6E63] flex items-center justify-center font-bold text-[#FAF7F2] text-xs">
                    {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-[#3E2723] leading-tight truncate max-w-[100px]">
                      {user.full_name || 'Akun'}
                    </p>
                    <p className="text-[10px] text-[#8D6E63] font-semibold capitalize">
                      {user.role || 'Penyewa'}
                    </p>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-[#E8D8C8] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-[#F5EDE4]">
                      <p className="text-xs text-[#8D6E63] font-medium">Masuk sebagai</p>
                      <p className="text-sm font-bold text-[#3E2723] truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#5D4037] hover:bg-[#F5EDE4] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 text-[#8D6E63]" />
                      Dashboard Admin
                    </Link>

                    <div className="my-1.5 border-t border-[#F5EDE4]" />

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar dari Akun
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-xl bg-[#F5EDE4] text-[#4E342E] hover:bg-[#E8D8C8]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Flyout */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8D8C8] animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Link
                href="/kos"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#5D4037] text-[#FAF7F2] font-bold text-xs shadow-xs"
              >
                <Building2 className="h-4 w-4" /> Cari Kos
              </Link>
              <Link
                href="/kontrakan"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#F5EDE4] text-[#4E342E] border border-[#D4BCA7] font-bold text-xs shadow-xs"
              >
                <Home className="h-4 w-4" /> Cari Kontrakan
              </Link>
            </div>

            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#4E342E] rounded-lg hover:bg-[#F5EDE4]"
                onClick={() => setMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4 text-[#A98467]" />
                Beranda Utama
              </Link>

              {user && (
                <>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#4E342E] rounded-lg hover:bg-[#F5EDE4]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4 text-[#8D6E63]" />
                    Dashboard Admin
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-700 rounded-lg hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
