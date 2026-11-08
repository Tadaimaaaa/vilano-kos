import { createClient } from '@/lib/supabase/server'
import { PropertyFilters, PropertyWithDetails } from '@/types'

export async function getProperties(filters?: PropertyFilters): Promise<PropertyWithDetails[]> {
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
    if (error) {
      console.warn('⚠️ Supabase getProperties notice:', error.message || error)
      return []
    }
    return (data || []) as PropertyWithDetails[]
  } catch (err) {
    console.warn('⚠️ getProperties caught error:', err)
    return []
  }
}

export async function getFeaturedProperties(): Promise<PropertyWithDetails[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties_with_details')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(6)
    if (error) {
      console.warn('⚠️ Supabase getFeaturedProperties notice:', error.message || error)
      return []
    }
    return (data || []) as PropertyWithDetails[]
  } catch (err) {
    console.warn('⚠️ getFeaturedProperties caught error:', err)
    return []
  }
}

export async function getPropertyById(id: string) {
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
      return null
    }

    return {
      property: {
        ...propertyRes.data,
        photos: photosRes.data || [],
        facilities: facilitiesRes.data?.map((f: any) => f.facilities) || [],
        reviews: reviewsRes.data || [],
      } as PropertyWithDetails,
    }
  } catch (err) {
    console.warn('⚠️ getPropertyById caught error:', err)
    return null
  }
}

export async function getOwnerProperties(ownerId: string): Promise<PropertyWithDetails[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties_with_details')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) {
      console.warn('⚠️ getOwnerProperties notice:', error.message || error)
      return []
    }
    return (data || []) as PropertyWithDetails[]
  } catch {
    return []
  }
}

export async function getAllFacilities() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('category')
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function getKotaList(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .select('kota')
      .eq('status', 'active')
    if (error || !data) return []
    const unique = [...new Set(data.map((d: any) => d.kota).filter(Boolean))] as string[]
    return unique.sort()
  } catch {
    return []
  }
}

