import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Ambil semua fasilitas
export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ facilities: data || [] })
}

// POST: Tambah fasilitas baru yang diketik sendiri
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Harus login untuk menambah fasilitas' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const rawName = body?.name
    if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
      return NextResponse.json({ error: 'Nama fasilitas tidak boleh kosong' }, { status: 400 })
    }

    const trimmedName = rawName.trim()

    // 1. Cek apakah sudah ada (case-insensitive)
    const { data: existing } = await supabase
      .from('facilities')
      .select('*')
      .ilike('name', trimmedName)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        success: true,
        facility: existing,
        message: 'Fasilitas sudah terdaftar',
        alreadyExists: true,
      })
    }

    // 2. Insert fasilitas baru
    let insertClient = supabase
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceKey && !serviceKey.includes('placeholder') && !serviceKey.includes('your-')) {
      const { createClient: createAdminClient } = await import('@supabase/supabase-js')
      insertClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey
      ) as any
    }

    const { data: newFacility, error: insertError } = await insertClient
      .from('facilities')
      .insert({
        name: trimmedName,
        category: 'tambahan',
        icon: 'Sparkles',
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '42501') {
        return NextResponse.json({
          error: 'RLS_RESTRICTION',
          message: 'Izin simpan fasilitas di database Supabase terblokir RLS.',
          code: insertError.code,
        }, { status: 403 })
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      facility: newFacility,
      message: 'Fasilitas berhasil ditambahkan',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan server' }, { status: 500 })
  }
}

