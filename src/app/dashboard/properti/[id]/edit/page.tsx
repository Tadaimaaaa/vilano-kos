import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllFacilities, getPropertyById } from '@/lib/queries'
import PropertyForm from '@/components/property/PropertyForm'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const propertyData = await getPropertyById(id)
  if (!propertyData) {
    notFound()
  }

  const { property } = propertyData

  // Only owner can edit
  if (property.owner_id !== user.id) {
    redirect('/dashboard/properti')
  }

  const facilities = await getAllFacilities()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Properti</h1>
        <p className="text-gray-500 mt-1">Update informasi {property.name}</p>
      </div>
      <PropertyForm
        facilities={facilities || []}
        ownerId={user.id}
        initialData={property}
      />
    </div>
  )
}

