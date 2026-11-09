'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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

  const isHome = pathname === '/'
  const isKos = Boolean(pathname?.startsWith('/kos'))
  const isKontrakan = Boolean(pathname?.startsWith('/kontrakan'))

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
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] flex items-center justify-center shadow-md shadow-[#5D4037]/20 group-hover:scale-105 transition-transform">
              <Home className="h-6 w-6 text-[#FAF7F2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight text-[#3E2723] group-hover:text-[#5D4037] transition-colors">Vilano</span>
                <span className="text-[10px] font-bold bg-[#F5EDE4] text-[#4E342E] px-2 py-0.5 rounded-full border border-[#D4BCA7]">ID</span>
              </div>
              <p className="text-[11px] text-[#8D6E63] font-semibold tracking-wide">Kos &bull; Kontrakan</p>
            </div>
          </Link>

          {/* Switch Button: Kos, Beranda (Tengah), & Kontrakan */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center p-1.5 bg-[#F5EDE4]/90 rounded-full border border-[#D4BCA7] shadow-inner backdrop-blur-md">
              <Link
                href="/kos"
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs font-bold transition-all duration-300",
                  isKos
                    ? "bg-[#5D4037] text-[#FAF7F2] shadow-md shadow-[#5D4037]/25 scale-[1.02]"
                    : "text-[#6D4C41] hover:text-[#3E2723] hover:bg-white/70"
                )}
              >
                <Building2 className={cn("h-3.5 w-3.5 lg:h-4 lg:w-4", isKos ? "text-[#E8D8C8]" : "text-[#8D6E63]")} />
                <span>Kos</span>
                <span className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                  isKos ? "bg-white/20 text-[#FAF7F2]" : "bg-[#E8D8C8]/70 text-[#5D4037]"
                )}>
                  Putra
                </span>
              </Link>

              <Link
                href="/"
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs font-bold transition-all duration-300",
                  isHome
                    ? "bg-[#3E2723] text-[#FAF7F2] shadow-md shadow-[#3E2723]/25 scale-[1.02]"
                    : "text-[#6D4C41] hover:text-[#3E2723] hover:bg-white/70"
                )}
              >
                <Sparkles className={cn("h-3.5 w-3.5 lg:h-4 lg:w-4", isHome ? "text-[#E8D8C8]" : "text-[#8D6E63]")} />
                <span>Beranda</span>
              </Link>

              <Link
                href="/kontrakan"
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs font-bold transition-all duration-300",
                  isKontrakan
                    ? "bg-[#3E2723] text-[#FAF7F2] shadow-md shadow-[#3E2723]/25 scale-[1.02]"
                    : "text-[#6D4C41] hover:text-[#3E2723] hover:bg-white/70"
                )}
              >
                <Home className={cn("h-3.5 w-3.5 lg:h-4 lg:w-4", isKontrakan ? "text-[#E8D8C8]" : "text-[#8D6E63]")} />
                <span>Kontrakan</span>
              </Link>
            </div>
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Direct Contact WhatsApp CTA */}
            <a
              href="https://wa.me/6281234567890?text=Halo%20Pemilik%20Vilano,%20saya%20tertarik%20tanya%20ketersediaan%20unit%20kos%20/%20kontrakan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4BCA7] text-[#4E342E] bg-[#FAF7F2] hover:bg-[#F5EDE4] font-bold text-xs h-9 px-3.5 shadow-xs transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-[#5D4037]" />
              <span>Hubungi Pemilik</span>
            </a>

            {user ? (
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
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#4E342E] hover:bg-[#F5EDE4] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#8D6E63]" />
                      Dashboard Saya
                    </Link>

                    {(user.role === 'admin' || user.role === 'pemilik') && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#5D4037] hover:bg-[#F5EDE4] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4 text-[#8D6E63]" />
                        Admin Master Panel
                      </Link>
                    )}

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
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center h-9 px-3.5 text-xs font-bold text-[#4E342E] hover:bg-[#F5EDE4] rounded-xl transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center h-9 px-4 text-xs font-bold bg-gradient-to-r from-[#795548] via-[#6D4C41] to-[#4E342E] text-[#FAF7F2] shadow-sm hover:from-[#6D4C41] hover:to-[#3E2723] rounded-xl transition-all"
                >
                  Daftar Gratis
                </Link>
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

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#4E342E] rounded-lg hover:bg-[#F5EDE4]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#8D6E63]" />
                    Dashboard
                  </Link>
                  {(user.role === 'admin' || user.role === 'pemilik') && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#4E342E] rounded-lg hover:bg-[#F5EDE4]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 text-[#8D6E63]" />
                      Admin Master Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-700 rounded-lg hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center h-10 px-3 text-xs font-bold rounded-xl border border-[#D4BCA7] bg-white text-[#4E342E] shadow-xs hover:bg-[#F5EDE4]"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center h-10 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-[#795548] via-[#6D4C41] to-[#4E342E] text-[#FAF7F2] shadow-sm hover:from-[#6D4C41] hover:to-[#3E2723]"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
