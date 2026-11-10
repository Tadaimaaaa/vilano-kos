'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchParams.get('error') === 'forbidden') {
      setError('Akses ditolak: Akun Anda tidak memiliki hak akses Administrator atau Pemilik Properti.')
    }
  }, [searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (
          authError.message.toLowerCase().includes('invalid login credentials') ||
          authError.message.toLowerCase().includes('invalid grant') ||
          authError.status === 400
        ) {
          setError('Email atau password salah. Silakan periksa kembali.')
        } else {
          setError(`Gagal otentikasi: ${authError.message}`)
        }
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError('Gagal masuk. Silakan coba kembali.')
        setLoading(false)
        return
      }

      // Check role in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .single()

      if (profileError || (profile?.role !== 'admin' && profile?.role !== 'pemilik')) {
        await supabase.auth.signOut()
        setError('Akses ditolak: Akun ini terdaftar sebagai Penyewa, bukan Administrator atau Pemilik.')
        setLoading(false)
        return
      }

      // Redirect directly to master admin control
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan sistem saat mencoba masuk.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Brand & Badge Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] flex items-center justify-center text-[#FAF7F2] shadow-2xl shadow-[#3E2723]/60 border border-[#8D6E63]/40 group-hover:scale-105 transition-transform">
            <Shield className="h-7 w-7 text-[#FAF7F2]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#FAF7F2] tracking-tight">Vilano</span>
              <span className="text-[10px] bg-[#5D4037] text-[#E8D8C8] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#8D6E63]/40">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-[#A98467] font-bold uppercase tracking-wider">
              Master Control Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="bg-[#241E1A] rounded-4xl shadow-2xl border border-[#3E2723] p-8 md:p-9 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5D4037] via-[#8D6E63] to-[#A98467]" />

        <div className="mb-6">
          <h1 className="text-xl font-black text-[#FAF7F2]">Masuk Administrator</h1>
          <p className="text-xs text-[#A98467] mt-1">
            Gunakan akun khusus pengelola atau pemilik untuk mengakses master control.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="admin-email" className="text-xs font-bold text-[#E8D8C8]">
              Email Administrator
            </Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]" />
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@vilano.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 rounded-2xl text-xs font-semibold bg-[#1A1614] border-[#3E2723] text-[#FAF7F2] placeholder:text-[#6D4C41] focus-visible:ring-[#8D6E63]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="admin-password" className="text-xs font-bold text-[#E8D8C8]">
              Kata Sandi
            </Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]" />
              <Input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-12 rounded-2xl text-xs font-semibold bg-[#1A1614] border-[#3E2723] text-[#FAF7F2] placeholder:text-[#6D4C41] focus-visible:ring-[#8D6E63]"
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#E8D8C8] transition-colors"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#5D4037] via-[#6D4C41] to-[#8D6E63] hover:from-[#6D4C41] hover:to-[#5D4037] text-[#FAF7F2] font-black text-xs shadow-lg shadow-[#3E2723]/50 border border-[#8D6E63]/40 mt-2 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memverifikasi Hak Akses...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#E8D8C8]" />
                Masuk ke Master Control
              </span>
            )}
          </Button>
        </form>

        {/* Petunjuk Setup Admin */}
        <div className="mt-6 pt-5 border-t border-[#3E2723]/80">
          <div className="rounded-2xl bg-[#1A1614]/80 border border-[#3E2723] p-3 text-[11px] text-[#A98467] leading-relaxed">
            <span className="font-bold text-[#E8D8C8] block mb-1">💡 Catatan Pemilik:</span>
            Pastikan akun Anda sudah diatur role-nya menjadi <code className="text-[#E8D8C8] font-mono bg-black/40 px-1 py-0.5 rounded">admin</code> atau <code className="text-[#E8D8C8] font-mono bg-black/40 px-1 py-0.5 rounded">pemilik</code> di tabel <code className="text-[#E8D8C8] font-mono bg-black/40 px-1 py-0.5 rounded">profiles</code> Supabase.
          </div>
        </div>
      </div>

      {/* Navigasi Balik */}
      <div className="mt-6 text-center space-y-2">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#A98467] hover:text-[#E8D8C8] transition-colors"
        >
          <span>Bukan admin? Buka Login Penyewa Biasa</span>
        </Link>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#6D4C41] hover:text-[#A98467] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda Publik</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151210] px-4 py-12 relative overflow-hidden">
      {/* Dark Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5D4037]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3E2723]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#FAF7F20a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <Suspense fallback={
        <div className="text-[#A98467] text-xs font-bold flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat Admin Portal...
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}

