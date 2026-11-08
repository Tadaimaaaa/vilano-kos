'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Home, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (authError) {
      setError('Email atau password salah. Silakan periksa kembali.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] flex items-center justify-center text-[#FAF7F2] shadow-lg shadow-[#5D4037]/20 group-hover:scale-105 transition-transform">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-3xl font-black text-[#3E2723] tracking-tight">Vilano</span>
          </Link>
          <p className="text-xs text-[#8D6E63] mt-2 font-medium">Masuk untuk mengelola kos & kontrakan atau memantau booking</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-4xl shadow-xl border border-[#E8D8C8] p-8 md:p-9 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5D4037] via-[#8D6E63] to-[#D4BCA7]" />

          <h1 className="text-xl font-black text-[#2D241E] mb-1">Selamat Datang Kembali!</h1>
          <p className="text-xs text-[#8D6E63] mb-6">Masukkan kredensial akun Vilano kamu</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-[#4E342E]">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-2xl text-xs font-semibold bg-[#FAF7F2]/60 border-[#E8D8C8]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password" className="text-xs font-bold text-[#4E342E]">Password</Label>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]" />
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 rounded-2xl text-xs font-semibold bg-[#FAF7F2]/60 border-[#E8D8C8]"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#3E2723]"
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
              className="w-full h-12 rounded-2xl font-bold text-sm shadow-md mt-2 bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2]"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sedang Masuk...</>
              ) : (
                'Masuk Sekarang'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F5EDE4] text-center">
            <p className="text-xs text-[#8D6E63] font-medium">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-[#5D4037] font-extrabold hover:underline">
                Daftar akun baru
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
