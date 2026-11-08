// ============================================
// TypeScript Types for Web Kos & Kontrakan
// ============================================

export type PropertyType = 'kos' | 'kontrakan'
export type GenderType = 'putra' | 'putri' | 'campur' | 'all'
export type PropertyStatus = 'pending' | 'active' | 'inactive'
export type UserRole = 'penyewa' | 'pemilik' | 'admin'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  owner_id: string
  type: PropertyType
  name: string
  description: string | null
  address: string
  kecamatan: string | null
  kota: string
  price_per_month: number
  total_units: number
  available_units: number
  gender_type: GenderType
  wa_number: string | null
  status: PropertyStatus
  is_featured: boolean
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
}

export interface PropertyWithDetails extends Property {
  owner_name: string | null
  owner_phone: string | null
  avg_rating: number
  review_count: number
  primary_photo: string | null
  photos?: PropertyPhoto[]
  facilities?: Facility[]
}

export interface PropertyPhoto {
  id: string
  property_id: string
  url: string
  is_primary: boolean
  order: number
  created_at: string
}

export interface Facility {
  id: string
  name: string
  icon: string | null
  category: string | null
}

export interface Booking {
  id: string
  property_id: string
  tenant_id: string
  start_date: string
  duration_months: number
  total_price: number
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
  property?: Property
  tenant?: Profile
}

export interface Review {
  id: string
  property_id: string
  reviewer_id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer?: Profile
}

// ============================================
// Filter & Search Types
// ============================================

export interface PropertyFilters {
  type?: PropertyType
  kota?: string
  min_price?: number
  max_price?: number
  gender_type?: GenderType
  facilities?: string[]
  search?: string
}

// ============================================
// Form Types
// ============================================

export interface PropertyFormData {
  type: PropertyType
  name: string
  description: string
  address: string
  kecamatan: string
  kota: string
  price_per_month: number
  total_units: number
  available_units: number
  gender_type: GenderType
  wa_number: string
  facilities: string[]
}

export interface BookingFormData {
  property_id: string
  start_date: string
  duration_months: number
  notes: string
}

export interface RegisterFormData {
  full_name: string
  email: string
  password: string
  phone: string
  role: 'penyewa' | 'pemilik'
}

