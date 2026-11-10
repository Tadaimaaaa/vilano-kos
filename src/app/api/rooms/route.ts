import { NextRequest, NextResponse } from 'next/server'
import { getRoomsData, saveRoomsData } from '@/lib/rooms-storage'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('propertyId') || 'kos-vilano-pandan'

  try {
    const rooms = await getRoomsData(propertyId)
    return NextResponse.json({
      success: true,
      propertyId,
      rooms,
      available_count: rooms.filter((r) => r.status === 'available').length,
      occupied_count: rooms.filter((r) => r.status === 'occupied').length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rooms, propertyId = 'kos-vilano-pandan' } = body

    if (!rooms || !Array.isArray(rooms)) {
      return NextResponse.json({ error: 'Data rooms tidak valid' }, { status: 400 })
    }

    const saved = await saveRoomsData(rooms, propertyId)
    return NextResponse.json({
      success: true,
      message: 'Status kamar berhasil disimpan dan disinkronkan secara real-time',
      propertyId,
      rooms: saved,
      available_count: saved.filter((r) => r.status === 'available').length,
      occupied_count: saved.filter((r) => r.status === 'occupied').length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

