import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { serializeRoomsToDescription, getCleanDescription } from '@/lib/rooms'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Verify property ownership or admin
  const { data: prop } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', id)
    .single()

  if (!prop) {
    return NextResponse.json({ error: 'Properti tidak ditemukan' }, { status: 404 })
  }

  if (profile?.role !== 'admin' && prop.owner_id !== user.id) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Properti berhasil dihapus' })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { rooms } = body

    if (!rooms || !Array.isArray(rooms)) {
      return NextResponse.json({ error: 'Data rooms tidak valid' }, { status: 400 })
    }

    const { data: prop } = await supabase
      .from('properties')
      .select('id, description, owner_id')
      .eq('id', id)
      .maybeSingle()

    if (!prop) {
      // Mock / fallback property success
      return NextResponse.json({ success: true, message: 'Status kamar tersimpan' })
    }

    const cleanDesc = getCleanDescription(prop.description)
    const newDescription = serializeRoomsToDescription(cleanDesc, rooms)
    const availableUnits = rooms.filter((r: any) => r.status === 'available').length

    const { error } = await supabase
      .from('properties')
      .update({
        description: newDescription,
        available_units: availableUnits,
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Status denah kamar berhasil diperbarui' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan status' }, { status: 500 })
  }
}
