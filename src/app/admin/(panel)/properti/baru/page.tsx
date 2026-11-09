import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllFacilities } from '@/lib/queries'
import PropertyForm from '@/components/property/PropertyForm'

export default async function NewPropertyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'penyewa') {
    redirect('/admin')
  }

  const facilities = await getAllFacilities()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tambah Properti Baru</h1>
        <p className="text-gray-500 mt-1">Isi informasi kos atau kontrakan kamu</p>
      </div>
      <PropertyForm facilities={facilities || []} ownerId={user.id} />
    </div>
  )
}

