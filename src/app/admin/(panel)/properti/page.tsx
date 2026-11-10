import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Eye, Building2, PlusCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import DeletePropertyButton from '@/components/admin/DeletePropertyButton'

export default async function DashboardPropertiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  let properties: any[] = []
  try {
    const { data } = await supabase
      .from('properties_with_details')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    properties = data || []
  } catch (err) {
    console.warn('Properti page fetch notice:', err)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Properti Saya</h1>
          <p className="text-xs text-slate-500 mt-1">Daftar semua kos dan kontrakan yang kamu sewakan di Vilano.</p>
        </div>
        <Link href="/admin/properti/baru">
          <Button variant="gradient" className="gap-2 rounded-2xl font-bold h-11 px-5 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Tambah Properti Baru
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-4xl border border-[#E8D8C8] p-16 text-center shadow-soft">
          <div className="w-16 h-16 rounded-3xl bg-[#F5EDE4] text-[#5D4037] flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#2D241E] mb-1">Belum Ada Properti</h3>
          <p className="text-xs text-[#8D6E63] mb-6 max-w-sm mx-auto">
            Mulai iklankan kos atau kontrakanmu untuk menjangkau ribuan calon penyewa di kotamu.
          </p>
          <Link href="/admin/properti/baru">
            <Button variant="gradient" className="gap-2 rounded-2xl font-bold">
              <Plus className="h-4 w-4" />
              Tambah Properti Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Properti</th>
                  <th className="px-4 py-4">Kategori</th>
                  <th className="px-4 py-4">Harga / Bln</th>
                  <th className="px-4 py-4">Ketersediaan</th>
                  <th className="px-4 py-4">Status Tayang</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {properties.map((property: any) => (
                  <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{property.name}</p>
                        <p className="text-xs text-slate-400">{property.kota} &middot; {property.address}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={property.type === 'kos' ? 'kos' : 'kontrakan'}>
                        {property.type === 'kos' ? '🏠 Kos' : '🏡 Kontrakan'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 font-extrabold text-slate-900">
                      {formatPrice(property.price_per_month)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-bold ${property.available_units > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {property.available_units}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/{property.total_units} unit</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        property.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        property.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {property.status === 'active' ? 'Aktif Tayang' :
                         property.status === 'pending' ? 'Review Admin' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/properti/${property.id}`} target="_blank">
                          <Button variant="ghost" size="icon" title="Lihat Halaman" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/properti/${property.id}/edit`}>
                          <Button variant="outline" size="icon" title="Edit Properti" className="h-9 w-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <DeletePropertyButton id={property.id} name={property.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
