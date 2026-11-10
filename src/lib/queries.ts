import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { PropertyFilters, PropertyWithDetails } from '@/types'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

function filterMockProperties(filters?: PropertyFilters): PropertyWithDetails[] {
  let list = [...MOCK_PROPERTIES]
  if (filters?.type) {
    list = list.filter((p) => p.type === filters.type)
  }
  if (filters?.kota) {
    list = list.filter((p) => p.kota.toLowerCase().includes(filters.kota!.toLowerCase()))
  }
  if (filters?.gender_type && filters.gender_type !== 'all') {
    list = list.filter((p) => p.gender_type === filters.gender_type || p.gender_type === 'all')
  }
  if (filters?.min_price) {
    list = list.filter((p) => p.price_per_month >= filters.min_price!)
  }
  if (filters?.max_price) {
    list = list.filter((p) => p.price_per_month <= filters.max_price!)
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.kota.toLowerCase().includes(q) ||
      (p.kecamatan && p.kecamatan.toLowerCase().includes(q))
    )
  }
  return list
}

export async function getProperties(filters?: PropertyFilters): Promise<PropertyWithDetails[]> {
  if (!isSupabaseConfigured()) {
    return filterMockProperties(filters)
  }

  try {
    const supabase = await createClient()

    let query = supabase
      .from('properties_with_details')
      .select('*')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (filters?.type) query = query.eq('type', filters.type)
    if (filters?.kota) query = query.ilike('kota', `%${filters.kota}%`)
    if (filters?.gender_type) query = query.eq('gender_type', filters.gender_type)
    if (filters?.min_price) query = query.gte('price_per_month', filters.min_price)
    if (filters?.max_price) query = query.lte('price_per_month', filters.max_price)
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,address.ilike.%${filters.search}%,kota.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return filterMockProperties(filters)
    }
    return data as PropertyWithDetails[]
  } catch {
    return filterMockProperties(filters)
  }
}

export async function getFeaturedProperties(): Promise<PropertyWithDetails[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_PROPERTIES.filter((p) => p.is_featured)
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties_with_details')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(6)
    if (error || !data || data.length === 0) {
      return MOCK_PROPERTIES.filter((p) => p.is_featured)
    }
    return data as PropertyWithDetails[]
  } catch {
    return MOCK_PROPERTIES.filter((p) => p.is_featured)
  }
}

export async function getPropertyById(id: string) {
  const fallback = MOCK_PROPERTIES.find((p) => p.id === id) || (id.includes('kontrakan') ? MOCK_PROPERTIES[1] : MOCK_PROPERTIES[0])

  if (!isSupabaseConfigured()) {
    return { property: fallback }
  }

  try {
    const supabase = await createClient()

    const [propertyRes, photosRes, facilitiesRes, reviewsRes] = await Promise.all([
      supabase.from('properties_with_details').select('*').eq('id', id).single(),
      supabase
        .from('property_photos')
        .select('*')
        .eq('property_id', id)
        .order('order'),
      supabase
        .from('property_facilities')
        .select('facilities(*)')
        .eq('property_id', id),
      supabase
        .from('reviews')
        .select('*, reviewer:profiles(full_name, avatar_url)')
        .eq('property_id', id)
        .order('created_at', { ascending: false }),
    ])

    if (propertyRes.error || !propertyRes.data) {
      return { property: fallback }
    }

    return {
      property: {
        ...propertyRes.data,
        photos: photosRes.data && photosRes.data.length > 0 ? photosRes.data : fallback?.photos || [],
        facilities: facilitiesRes.data && facilitiesRes.data.length > 0 ? facilitiesRes.data.map((f: any) => f.facilities) : fallback?.facilities || [],
        reviews: reviewsRes.data || [],
      } as PropertyWithDetails,
    }
  } catch {
    return { property: fallback }
  }
}

export async function getOwnerProperties(ownerId: string): Promise<PropertyWithDetails[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties_with_details')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error || !data) return []
    return data as PropertyWithDetails[]
  } catch {
    return []
  }
}

export async function getAllFacilities() {
  if (!isSupabaseConfigured()) {
    return [
      { id: 'f-1', name: 'WiFi', icon: 'Wifi', category: 'umum' },
      { id: 'f-2', name: 'AC', icon: 'Wind', category: 'kamar' },
      { id: 'f-3', name: 'Kamar Mandi Dalam', icon: 'Bath', category: 'kamar' },
      { id: 'f-4', name: 'Kasur & Lemari', icon: 'Bed', category: 'kamar' },
      { id: 'f-5', name: 'Parkir Motor', icon: 'Bike', category: 'umum' },
      { id: 'f-6', name: 'Parkir Mobil', icon: 'Car', category: 'umum' },
      { id: 'f-7', name: 'Dapur', icon: 'Utensils', category: 'umum' },
      { id: 'f-8', name: 'CCTV 24 Jam', icon: 'Shield', category: 'keamanan' },
    ]
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('category')
    if (error || !data || data.length === 0) {
      return [
        { id: 'f-1', name: 'WiFi', icon: 'Wifi', category: 'umum' },
        { id: 'f-2', name: 'AC', icon: 'Wind', category: 'kamar' },
        { id: 'f-3', name: 'Kamar Mandi Dalam', icon: 'Bath', category: 'kamar' },
        { id: 'f-4', name: 'Kasur & Lemari', icon: 'Bed', category: 'kamar' },
      ]
    }
    return data
  } catch {
    return []
  }
}

export async function getKotaList(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return ['Kota Solok']
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .select('kota')
      .eq('status', 'active')
    if (error || !data || data.length === 0) {
      return ['Kota Solok']
    }
    const unique = [...new Set(data.map((d: any) => d.kota).filter(Boolean))] as string[]
    return unique.length > 0 ? unique.sort() : ['Kota Solok']
  } catch {
    return ['Kota Solok']
  }
}
