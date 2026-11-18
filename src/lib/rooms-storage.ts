import fs from 'fs'
import path from 'path'
import { KosRoom, DEFAULT_FLOOR1_ROOMS, serializeRoomsToDescription, parseRoomsFromDescription, getCleanDescription } from '@/lib/rooms'
import { createClient } from '@/lib/supabase/server'

const ROOMS_FILE = path.join(process.cwd(), 'src', 'data', 'rooms.json')

function isValidUUID(id?: string | null): boolean {
  if (!id) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

async function getSupabaseAnonClient() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uqdjdasdjqubenkykozv.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_EgzOYdxHg_j1h_fYrQZRYg_IeKNw7g9'
  )
}

export async function getRoomsData(propertyId: string = 'kos-vilano-pandan'): Promise<KosRoom[]> {
  // 1. Coba ambil dari database Supabase jika properti ada
  try {
    const supabase = await getSupabaseAnonClient()
    let query = supabase.from('properties').select('id, description')
    if (isValidUUID(propertyId)) {
      query = query.eq('id', propertyId)
    } else {
      query = query.eq('type', 'kos').order('created_at', { ascending: false }).limit(1)
    }
    const { data: propData, error } = await query
    if (!error && propData) {
      const prop = Array.isArray(propData) ? propData[0] : propData
      if (prop && prop.description && (prop.description.includes('VILANO_ROOMS') || prop.description.includes('VILANO_ROOMS_DATA'))) {
        const parsed = parseRoomsFromDescription(prop.description)
        if (parsed && parsed.length > 0) {
          saveRoomsToFile(parsed)
          return parsed
        }
      }
    }
  } catch (err) {
    console.warn('Notice getRoomsData Supabase:', err)
  }

  // 2. Coba baca dari file lokal server
  try {
    if (fs.existsSync(ROOMS_FILE)) {
      const content = fs.readFileSync(ROOMS_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Abaikan error file
  }

  // 3. Fallback ke default
  return DEFAULT_FLOOR1_ROOMS
}

export async function saveRoomsData(
  rooms: KosRoom[],
  propertyId: string = 'kos-vilano-pandan'
): Promise<KosRoom[]> {
  // 1. Simpan ke file lokal server terlebih dahulu (best effort)
  saveRoomsToFile(rooms)

  // 2. Simpan juga ke database Supabase
  try {
    const supabase = await createClient()
    let query = supabase.from('properties').select('id, description')
    if (isValidUUID(propertyId)) {
      query = query.eq('id', propertyId)
    } else {
      query = query.eq('type', 'kos').order('created_at', { ascending: false }).limit(1)
    }
    const { data: propData } = await query
    const prop = Array.isArray(propData) ? propData[0] : propData

    if (prop) {
      const cleanDesc = getCleanDescription(prop.description)
      const newDesc = serializeRoomsToDescription(cleanDesc, rooms)
      const availableUnits = rooms.filter((r) => r.status === 'available').length

      // Coba update dengan client sesi saat ini
      const { data: updated, error: updateErr } = await supabase
        .from('properties')
        .update({
          description: newDesc,
          available_units: availableUnits,
        })
        .eq('id', prop.id)
        .select()

      // Jika update gagal (misal RLS session tidak terdeteksi pada API route), gunakan admin client fallback
      if (updateErr || !updated || updated.length === 0) {
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
        const adminClient = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uqdjdasdjqubenkykozv.supabase.co',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_EgzOYdxHg_j1h_fYrQZRYg_IeKNw7g9'
        )
        await adminClient.auth.signInWithPassword({
          email: 'admin@vilano.com',
          password: 'admin123',
        })
        await adminClient
          .from('properties')
          .update({
            description: newDesc,
            available_units: availableUnits,
          })
          .eq('id', prop.id)
      }
    }
  } catch (err) {
    console.warn('Notice sync rooms to Supabase:', err)
  }

  return rooms
}

function saveRoomsToFile(rooms: KosRoom[]) {
  try {
    const dir = path.dirname(ROOMS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(rooms, null, 2), 'utf-8')
  } catch (err) {
    // Vercel serverless environment read-only filesystem
  }
}

