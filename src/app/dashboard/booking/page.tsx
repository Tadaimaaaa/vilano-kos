import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, getBookingStatusLabel, getBookingStatusColor } from '@/lib/utils'
import { CalendarCheck, User, Phone, Check, X, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardBookingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isPemilik = profile?.role === 'pemilik' || profile?.role === 'admin'

  let bookings: any[] = []

  try {
    if (isPemilik) {
      const { data: myProps } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', user.id)
      const propIds = myProps?.map((p: any) => p.id) || []
      if (propIds.length > 0) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, property:properties(id, name, type, kota, owner_id), tenant:profiles(full_name, phone)')
          .in('property_id', propIds)
          .order('created_at', { ascending: false })
        if (!error && data) bookings = data
      }
    } else {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, property:properties(id, name, type, kota, owner_id), tenant:profiles(full_name, phone)')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })
      if (!error && data) bookings = data
    }
  } catch (err) {
    console.warn('Fetch bookings notice:', err)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          {isPemilik ? 'Kelola Booking Masuk' : 'Riwayat Booking Saya'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isPemilik
            ? 'Konfirmasi atau tolak permohonan sewa dari calon penyewa propertimu.'
            : 'Pantau status persetujuan dari pemilik properti kos atau kontrakan.'}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-4xl border border-slate-200/80 p-16 text-center shadow-soft">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Belum Ada Riwayat Booking</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {isPemilik
              ? 'Ketika ada penyewa yang mengajukan sewa kamar kos atau kontrakanmu, datanya akan muncul di sini.'
              : 'Kamu belum mengajukan booking sewa. Jelajahi katalog kos dan kontrakan untuk mulai memilih hunian.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft hover:shadow-hover transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Property & Tenant Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">
                      {booking.property?.name || 'Properti'}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
                      {booking.property?.type || 'Kos'} &middot; {booking.property?.kota || ''}
                    </span>
                  </div>

                  {isPemilik && booking.tenant && (
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <User className="h-3.5 w-3.5 text-teal-600" />
                        <span>Penyewa: {booking.tenant.full_name || 'Tanpa Nama'}</span>
                      </div>
                      {booking.tenant.phone && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Phone className="h-3 w-3 text-emerald-600" />
                          <span>{booking.tenant.phone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                    <span className="font-medium">📅 Masuk: <strong>{new Date(booking.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                    <span className="font-medium">📆 Durasi: <strong>{booking.duration_months} Bulan</strong></span>
                    <span className="font-medium">💰 Total: <strong className="text-teal-700 font-extrabold text-sm">{formatPrice(booking.total_price)}</strong></span>
                  </div>

                  {booking.notes && (
                    <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Status & Action */}
                <div className="flex flex-col lg:items-end gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <span className={`text-xs px-3.5 py-1 rounded-full font-bold self-start lg:self-end ${
                    booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    booking.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {getBookingStatusLabel(booking.status)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Diajukan pada {formatDate(booking.created_at)}
                  </span>

                  {/* Actions for Owners on Pending */}
                  {isPemilik && booking.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-1">
                      <form action={`/api/bookings/${booking.id}/confirm`} method="POST">
                        <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-1 text-xs shadow-xs">
                          <Check className="h-3.5 w-3.5" /> Konfirmasi
                        </Button>
                      </form>
                      <form action={`/api/bookings/${booking.id}/cancel`} method="POST">
                        <Button size="sm" variant="outline" className="h-9 border-rose-200 text-rose-700 hover:bg-rose-50 font-bold rounded-xl gap-1 text-xs">
                          <X className="h-3.5 w-3.5" /> Tolak
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
