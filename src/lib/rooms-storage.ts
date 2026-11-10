import fs from 'fs'
import path from 'path'
import { KosRoom, DEFAULT_FLOOR1_ROOMS, serializeRoomsToDescription, parseRoomsFromDescription, getCleanDescription } from '@/lib/rooms'
import { createClient } from '@/lib/supabase/server'

const ROOMS_FILE = path.join(process.cwd(), 'src', 'data', 'rooms.json')

export async function getRoomsData(propertyId: string = 'kos-vilano-pandan'): Promise<KosRoom[]> {
  // 1. Coba ambil dari database Supabase jika properti ada
  try {
    const supabase = await createClient()
    const { data: prop } = await supabase
      .from('properties')
      .select('description')
      .eq('id', propertyId)
      .maybeSingle()

    if (prop && prop.description && prop.description.includes('VILANO_ROOMS_DATA')) {
      const parsed = parseRoomsFromDescription(prop.description)
      if (parsed && parsed.length > 0) {
        // Simpan juga ke file lokal sebagai sinkronisasi
        saveRoomsToFile(parsed)
        return parsed
      }
    }
  } catch {
    // Abaikan jika database offline
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
  // 1. Simpan ke file lokal server terlebih dahulu
  saveRoomsToFile(rooms)

  // 2. Simpan juga ke database Supabase jika properti ada
  try {
    const supabase = await createClient()
    const { data: prop } = await supabase
      .from('properties')
      .select('id, description')
      .eq('id', propertyId)
      .maybeSingle()

    if (prop) {
      const cleanDesc = getCleanDescription(prop.description)
      const newDesc = serializeRoomsToDescription(cleanDesc, rooms)
      const availableUnits = rooms.filter((r) => r.status === 'available').length

      await supabase
        .from('properties')
        .update({
          description: newDesc,
          available_units: availableUnits,
        })
        .eq('id', propertyId)
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
    console.warn('Notice write rooms file:', err)
  }
}

