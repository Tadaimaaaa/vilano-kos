'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, Home, Building2, Users, Mail, Phone, Lock, User, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'penyewa'

  const [role, setRole] = useState<'penyewa' | 'pemilik'>(defaultRole as any)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, phone },
      },
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-teal-50 px-4 py-12">
        <div className="bg-white rounded-4xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Akunmu berhasil dibuat. Silakan periksa inbox email <strong>{email}</strong> untuk verifikasi, lalu masuk ke akunmu.
          </p>
          <Link href="/auth/login" className="block">
            <Button variant="gradient" className="w-full h-12 rounded-2xl font-bold">
              Lanjut ke Halaman Masuk
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-teal-50/40 to-slate-100 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">Vilano</span>
          </Link>
          <p className="text-xs text-slate-500 mt-2 font-medium">Buat akun untuk sewa atau pasang iklan properti</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-4xl shadow-xl border border-slate-200/80 p-8 md:p-9 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500" />

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('penyewa')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
                role === 'penyewa'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4 text-teal-600" />
              <span>Saya Penyewa</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('pemilik')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
                role === 'pemilik'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-4 w-4 text-orange-600" />
              <span>Saya Pemilik</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <Label className="text-xs font-bold text-slate-700">Nama Lengkap</Label>
              <div className="relative mt-1">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-2xl text-xs font-semibold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Alamat Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="budi@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-2xl text-xs font-semibold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Nomor WhatsApp Aktif</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-2xl text-xs font-semibold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Kata Sandi (Password)</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-11 rounded-2xl text-xs font-semibold bg-slate-50"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-2xl font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="w-full h-12 rounded-2xl font-bold text-sm shadow-md mt-4"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Mendaftarkan Akun...</>
              ) : (
                'Daftar Sekarang Gratis'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Sudah memiliki akun?{' '}
              <Link href="/auth/login" className="text-teal-700 font-extrabold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat form pendaftaran...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
