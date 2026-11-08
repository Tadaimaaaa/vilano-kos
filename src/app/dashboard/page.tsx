import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, CalendarCheck, Star, TrendingUp, Plus, ArrowRight, ShieldCheck, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Stats
  let properties: any[] = []
  let bookings: any[] = []

  try {
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name, status, available_units, price_per_month')
      .eq('owner_id', user.id)

    properties = propertiesData || []
    const propertyIds = properties.map((p: any) => p.id)

    if (profile?.role === 'pemilik') {
      if (propertyIds.length > 0) {
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*, property:properties(name)')
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false })
          .limit(5)
        bookings = bookingsData || []
      }
    } else {
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, property:properties(name)')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      bookings = bookingsData || []
    }
  } catch (err) {
    console.warn('Dashboard fetch notice:', err)
  }

  const isPemilik = profile?.role === 'pemilik' || profile?.role === 'admin'

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-4xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-block mb-2">
            Selamat Datang di Vilano Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-black">
            Halo, {profile?.full_name || 'Pengguna'}! 👋
          </h1>
          <p className="text-teal-100 text-xs md:text-sm mt-1 max-w-md">
            {isPemilik
              ? 'Pantau properti kos dan kontrakanmu, update ketersediaan unit, dan kelola booking masuk.'
              : 'Pantau status permohonan sewa kos dan kontrakan yang sudah kamu ajukan.'}
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          {isPemilik ? (
            <Link href="/dashboard/properti/baru">
              <Button size="lg" className="bg-white text-teal-800 hover:bg-teal-50 font-bold rounded-2xl gap-2 shadow-md">
                <Plus className="h-4 w-4" />
                Tambah Properti Baru
              </Button>
            </Link>
          ) : (
            <Link href="/kos">
              <Button size="lg" className="bg-white text-teal-800 hover:bg-teal-50 font-bold rounded-2xl gap-2 shadow-md">
                <Building2 className="h-4 w-4" />
                Cari Properti
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isPemilik && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{properties.length}</div>
            <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Total Properti Saya</div>
            <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {properties.filter((p: any) => p.status === 'active').length} Properti Aktif Tayang
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <CalendarCheck className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{bookings.length}</div>
          <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
            {isPemilik ? 'Booking Masuk' : 'Booking Saya'}
          </div>
          <p className="text-xs text-slate-400 mt-2">Reservasi terdaftar di sistem</p>
        </div>

        {isPemilik && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Home className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {properties.reduce((acc, curr) => acc + (Number(curr.available_units) || 0), 0)}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Total Kamar/Unit Kosong</div>
            <p className="text-xs text-slate-400 mt-2">Siap untuk disewakan</p>
          </div>
        )}
      </div>

      {/* Recent Bookings Activity */}
      <div className="bg-white rounded-4xl border border-slate-200/80 p-6 md:p-8 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {isPemilik ? 'Daftar Booking Masuk Terbaru' : 'Status Permohonan Sewa Saya'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Pantau konfirmasi dan rincian transaksi</p>
          </div>
          <Link href="/dashboard/booking" className="text-xs font-bold text-teal-700 flex items-center gap-1 hover:gap-2 transition-all">
            Lihat semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CalendarCheck className="h-12 w-12 mx-auto mb-2 opacity-25" />
            <p className="text-sm font-semibold text-slate-600">Belum ada data booking saat ini</p>
            <p className="text-xs text-slate-400 mt-1">Data reservasi akan tampil di sini begitu ada permohonan baru.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {booking.property?.name || 'Nama Properti'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mulai: {new Date(booking.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} &middot; Durasi: {booking.duration_months} Bulan
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-sm font-extrabold text-slate-900">{formatPrice(booking.total_price)}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    booking.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status === 'pending' ? 'Menunggu Konfirmasi' :
                     booking.status === 'confirmed' ? 'Dikonfirmasi' :
                     booking.status === 'cancelled' ? 'Ditolak' : 'Selesai'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
