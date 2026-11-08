import { createClient } from '@/lib/supabase/server'
import { Building2, Users, CalendarCheck, ShieldCheck, Check, X, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  let properties: any[] = []
  let users: any[] = []
  let bookings: any[] = []

  try {
    const [propsRes, usersRes, bookingsRes] = await Promise.all([
      supabase.from('properties_with_details').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*, property:properties(name), tenant:profiles(full_name)').order('created_at', { ascending: false }).limit(10),
    ])

    properties = propsRes.data || []
    users = usersRes.data || []
    bookings = bookingsRes.data || []
  } catch (err) {
    console.warn('Admin dashboard fetch error:', err)
  }

  const pendingProps = properties.filter((p) => p.status === 'pending')
  const activeProps = properties.filter((p) => p.status === 'active')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola moderasi properti, transaksi booking, dan pengguna platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase">Menunggu Review</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{pendingProps.length}</div>
          <p className="text-xs text-gray-400 mt-1">Perlu persetujuan admin</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase">Properti Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{activeProps.length}</div>
          <p className="text-xs text-gray-400 mt-1">Dari {properties.length} total properti</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase">Total User</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          <p className="text-xs text-gray-400 mt-1">Pemilik & Penyewa</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase">Total Booking</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600">{bookings.length}</div>
          <p className="text-xs text-gray-400 mt-1">Semua reservasi</p>
        </div>
      </div>

      {/* Property Approval Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Moderasi & Persetujuan Properti</h2>
            <p className="text-xs text-gray-500 mt-0.5">Approve properti baru agar tampil di pencarian publik.</p>
          </div>
          {pendingProps.length > 0 && (
            <Badge variant="warning">{pendingProps.length} pending</Badge>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Belum ada data properti di database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500">
                  <th className="px-4 py-3">Nama & Lokasi</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Pemilik</th>
                  <th className="px-4 py-3">Harga/Bln</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {properties.map((prop: any) => (
                  <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{prop.name}</p>
                      <p className="text-xs text-gray-500">{prop.kota} · {prop.address}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={prop.type === 'kos' ? 'kos' : 'kontrakan'}>
                        {prop.type === 'kos' ? 'Kos' : 'Kontrakan'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <p className="font-medium text-xs">{prop.owner_name || '-'}</p>
                      <p className="text-[11px] text-gray-400">{prop.owner_phone || '-'}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatPrice(prop.price_per_month)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        prop.status === 'active' ? 'bg-green-100 text-green-700' :
                        prop.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {prop.status === 'active' ? 'Aktif' :
                         prop.status === 'pending' ? 'Pending Review' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/properti/${prop.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {prop.status !== 'active' && (
                          <form action={`/api/admin/properties/${prop.id}/status`} method="POST">
                            <input type="hidden" name="status" value="active" />
                            <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white gap-1 text-xs">
                              <Check className="h-3.5 w-3.5" /> Approve
                            </Button>
                          </form>
                        )}
                        {prop.status === 'active' && (
                          <form action={`/api/admin/properties/${prop.id}/status`} method="POST">
                            <input type="hidden" name="status" value="inactive" />
                            <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:bg-red-50 gap-1 text-xs">
                              <X className="h-3.5 w-3.5" /> Nonaktifkan
                            </Button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Pengguna Terdaftar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">No. HP</th>
                <th className="px-4 py-3">Terdaftar Sejak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.slice(0, 10).map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.full_name || 'Tanpa Nama'}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
