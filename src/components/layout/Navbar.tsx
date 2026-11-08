'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Building2, Menu, X, User, LogOut, LayoutDashboard, Shield, PlusCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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

  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }


  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
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



          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* CTA for Owners */}
            <Link href={user ? "/dashboard/properti/baru" : "/auth/register?role=pemilik"}>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl border-[#D4BCA7] text-[#4E342E] bg-[#FAF7F2] hover:bg-[#F5EDE4]">
                <PlusCircle className="h-4 w-4 text-[#6D4C41]" />
                <span>Pasang Iklan</span>
              </Button>
            </Link>

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

                    {user.role === 'admin' && (
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
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="font-bold text-[#4E342E]">
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="gradient" size="sm" className="shadow-sm">
                    Daftar Gratis
                  </Button>
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
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-xs">Masuk</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                    <Button variant="gradient" className="w-full text-xs">Daftar</Button>
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
