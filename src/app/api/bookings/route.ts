import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyId, name, phone, startDate, duration, notes, totalPrice } = body

    if (!propertyId || !name || !phone || !startDate) {
      return NextResponse.json({ error: 'Mohon lengkapi nama, nomor WhatsApp, dan tanggal masuk' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Ambil info properti untuk mendapatkan owner_id dan no WhatsApp pemilik
    const { data: prop, error: propError } = await supabase
      .from('properties')
      .select('id, name, owner_id, wa_number')
      .eq('id', propertyId)
      .single()

    if (propError || !prop) {
      return NextResponse.json({ error: 'Properti tidak ditemukan' }, { status: 404 })
    }

    // 2. Client dengan service role jika ada
    let dbClient = supabase
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceKey && !serviceKey.includes('placeholder') && !serviceKey.includes('your-')) {
      const { createClient: createAdminClient } = await import('@supabase/supabase-js')
      dbClient = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey) as any
    }

    const formattedNotes = `[CALON PENYEWA]\nNama: ${name.trim()}\nNo. WhatsApp: ${phone.trim()}\n\n${notes ? `Catatan: ${notes.trim()}` : ''}`.trim()

    // 3. Simpan permohonan booking ke database
    const bookingPayload: any = {
      property_id: propertyId,
      tenant_id: prop.owner_id, // Menggunakan owner_id sebagai relasi default jika belum ada user login
      start_date: startDate,
      duration_months: Number(duration) || 1,
      total_price: Number(totalPrice),
      status: 'pending',
      notes: formattedNotes,
    }

    const { data: newBooking, error: bookingError } = await dbClient
      .from('bookings')
      .insert(bookingPayload)
      .select()
      .maybeSingle()

    if (bookingError) {
      console.warn('Booking insert warning:', bookingError.message)
    }

    return NextResponse.json({
      success: true,
      booking: newBooking,
      ownerWa: prop.wa_number || '08127951435',
      message: 'Booking berhasil diajukan',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan sistem' }, { status: 500 })
  }
}

