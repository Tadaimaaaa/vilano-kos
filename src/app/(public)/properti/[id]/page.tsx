import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, Star, Users, CheckCircle2, MessageCircle, ArrowLeft, ShieldCheck,
  CalendarCheck, ArrowRight, Bed, Sparkles
} from 'lucide-react'
import { getPropertyById } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, getWALink, getGenderTypeLabel } from '@/lib/utils'
import { parseRoomsFromDescription, getCleanDescription } from '@/lib/rooms'

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | undefined }>
}

export default async function PropertyDetailPage({ params, searchParams }: PropertyDetailPageProps) {
  const { id } = await params
  const sParams = searchParams ? await searchParams : {}
  const selectedKamar = sParams.kamar

  const propertyData = await getPropertyById(id)
  if (!propertyData) {
    notFound()
  }

  const { property } = propertyData
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isKos = property.type === 'kos'
  const photos = property.photos || []
  const facilities = property.facilities || []
  const reviews = (property as any).reviews || []
  const rooms = parseRoomsFromDescription(property.description)
  const cleanDescription = getCleanDescription(property.description)

  // Cari kamar spesifik jika user memilih kamar dari denah atau URL (?kamar=Kamar 06)
  const matchedRoom = selectedKamar
    ? rooms.find((r) => {
        const normSelected = selectedKamar.toLowerCase().replace(/[^a-z0-9]/g, '')
        const normNum = r.number.toLowerCase().replace(/[^a-z0-9]/g, '')
        const normLabel = (r.label || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const normId = String(r.id)
        return (
          normSelected === normNum ||
          normSelected === normLabel ||
          normSelected === normId ||
          normSelected.endsWith(normNum) ||
          normNum.endsWith(normSelected)
        )
      })
    : null

  // Foto galeri: prioritaskan foto asli kamar yang diunggah admin jika memilih kamar
  const roomPhotos = matchedRoom?.photos && matchedRoom.photos.length > 0
    ? matchedRoom.photos
    : (matchedRoom?.photoUrl ? [matchedRoom.photoUrl] : [])

  const displayPhotos = roomPhotos.length > 0
    ? roomPhotos.map((url, idx) => ({
        id: `room-photo-${idx}`,
        property_id: property.id,
        url,
        is_primary: idx === 0,
        order: idx,
        created_at: new Date().toISOString(),
      }))
    : photos

  // Harga dan ketersediaan dinamis sesuai kamar yang dipilih
  const displayPrice = matchedRoom ? matchedRoom.price : property.price_per_month
  const isRoomAvailable = matchedRoom ? matchedRoom.status === 'available' : property.available_units > 0

  const waMessage = matchedRoom
    ? `Halo Pemilik Vilano, saya tertarik dengan ${matchedRoom.number} (${matchedRoom.type}) di ${property.name} dengan tarif ${formatPrice(matchedRoom.price)}/bulan. Apakah kamar ini masih tersedia untuk disurvey/disewa?`
    : `Halo, saya tertarik dengan ${property.name} di Vilano (Alamat: ${property.address}). Apakah masih tersedia unit untuk disewa?`

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href={isKos ? '/kos' : '/kontrakan'}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6D4C41] hover:text-[#2D241E] transition-colors bg-white px-4 py-2 rounded-xl border border-[#D4BCA7] shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Daftar {isKos ? 'Kos' : 'Kontrakan'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-[#F5EDE4] text-[#4E342E] border border-[#D4BCA7] px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#6D4C41]" />
              Properti Terverifikasi
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8D8C8] shadow-soft mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Kos / Kontrakan Badge */}
            <Badge variant={isKos ? 'kos' : 'kontrakan'} className="text-xs font-bold">
              {isKos ? '🏠 Kos' : '🏡 Kontrakan'}
            </Badge>

            {matchedRoom ? (
              <>
                <Badge className="bg-[#5D4037] text-white border border-[#3E2723] text-xs font-black shadow-2xs">
                  📍 {matchedRoom.number} &bull; Lantai 1
                </Badge>
                <Badge
                  variant={isRoomAvailable ? 'success' : 'destructive'}
                  className="text-xs font-bold"
                >
                  {isRoomAvailable ? 'Kamar Kosong & Siap Huni' : 'Sedang Terisi'}
                </Badge>
              </>
            ) : (
              <Badge variant={property.available_units > 0 ? 'success' : 'destructive'} className="text-xs font-bold">
                {property.available_units > 0 ? `Tersedia ${property.available_units} Unit` : 'Unit Penuh'}
              </Badge>
            )}

            {isKos && property.gender_type && property.gender_type !== 'all' && (
              <Badge variant="outline" className="text-xs font-bold">
                <Users className="h-3 w-3 mr-1 text-[#8D6E63]" />
                Khusus {getGenderTypeLabel(property.gender_type)}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-[#2D241E] leading-tight mb-1">
            {matchedRoom ? `${property.name} — ${matchedRoom.number}` : property.name}
          </h1>

          {matchedRoom && (
            <p className="text-base md:text-lg font-bold text-[#5D4037] mb-2">
              {matchedRoom.type}
            </p>
          )}

          {matchedRoom?.notes && (
            <p className="inline-flex items-center gap-1.5 text-xs text-[#6D4C41] font-semibold bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#D4BCA7] mb-3">
              📍 <span>{matchedRoom.notes}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-[#8D6E63] mt-2">
            <div className="flex items-center gap-1 text-[#4E342E] font-semibold">
              <MapPin className="h-4 w-4 text-[#6D4C41] shrink-0" />
              <span>{property.address}, {property.kecamatan ? `${property.kecamatan}, ` : ''}{property.kota}</span>
            </div>

            <div className="flex items-center gap-1 bg-[#F5EDE4] px-2.5 py-0.5 rounded-lg border border-[#D4BCA7] font-bold text-[#4E342E]">
              <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
              <span>{property.review_count > 0 ? Number(property.avg_rating).toFixed(1) : '4.9'}</span>
              <span className="text-[#8D6E63] font-normal">({property.review_count} Ulasan)</span>
            </div>
          </div>
        </div>

        {/* Quick Kamar Selector (Tab Pilihan Kamar Cepat untuk Kos) */}
        {isKos && rooms.length > 0 && (
          <div className="bg-white rounded-3xl p-4 md:p-5 border border-[#E8D8C8] shadow-soft mb-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#5D4037] flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-[#8D6E63]" />
                <span>Pilihan Kamar di {property.name}:</span>
              </span>
              <Link
                href="/kos"
                className="text-xs font-bold text-[#8D6E63] hover:text-[#2D241E] transition-colors underline"
              >
                Lihat Denah Visual
              </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {rooms.map((room) => {
                const isCurrent = matchedRoom?.number === room.number
                return (
                  <Link
                    key={room.id}
                    href={`/properti/${id}?kamar=${encodeURIComponent(room.number)}`}
                    className={`shrink-0 px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#5D4037] text-white border-[#3E2723] shadow-md scale-102 ring-2 ring-[#5D4037]/20'
                        : 'bg-[#FAF7F2] text-[#4E342E] border-[#D4BCA7] hover:bg-[#F5EDE4]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        room.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{room.number}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isCurrent ? 'bg-white/20 text-[#FAF7F2]' : 'bg-[#E8D8C8] text-[#5D4037]'
                      }`}
                    >
                      {formatPrice(room.price)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Photo Gallery Grid */}
        <div className="rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#E8D8C8] shadow-soft mb-8 relative">
          {matchedRoom && roomPhotos.length > 0 && (
            <div className="absolute top-4 left-4 z-20 bg-[#3E2723]/85 backdrop-blur-md text-[#FAF7F2] px-3.5 py-1.5 rounded-full text-xs font-black shadow-md border border-white/20 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Foto Asli {matchedRoom.number} ({roomPhotos.length} Foto)</span>
            </div>
          )}

          {displayPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 p-2.5">
              <div className="md:col-span-2 relative h-72 md:h-[420px] rounded-2xl overflow-hidden bg-[#E8D8C8]/30">
                <Image
                  src={displayPhotos.find((p) => p.is_primary)?.url || displayPhotos[0].url}
                  alt={matchedRoom ? `${property.name} ${matchedRoom.number}` : property.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-2.5 h-72 md:h-[420px]">
                {displayPhotos.slice(1, 5).map((photo, index) => (
                  <div key={photo.id || index} className="relative rounded-2xl overflow-hidden bg-[#E8D8C8]/30">
                    <Image
                      src={photo.url}
                      alt={`${property.name} foto ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
                {displayPhotos.length <= 1 && (
                  <div className="col-span-2 flex items-center justify-center bg-[#F5EDE4] text-[#8D6E63] text-xs font-semibold rounded-2xl">
                    Foto tambahan belum diunggah
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF7F2] to-[#F5EDE4]">
              <span className="text-7xl mb-2">{isKos ? '🏠' : '🏡'}</span>
              <p className="text-xs text-[#8D6E63] font-medium">Foto Properti Belum Diunggah</p>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side */}
          <div className="lg:col-span-8 space-y-6">
            {/* Host / Owner Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8D8C8] shadow-soft flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] text-[#FAF7F2] font-black text-xl flex items-center justify-center shadow-md shadow-[#5D4037]/20">
                  {property.owner_name?.[0]?.toUpperCase() || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-[#2D241E] text-base">{property.owner_name || 'Pemilik Terverifikasi'}</h2>
                    <span className="bg-[#F5EDE4] text-[#4E342E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4BCA7]">
                      Pemilik
                    </span>
                  </div>
                  <p className="text-xs text-[#8D6E63] mt-0.5">Respons cepat via WhatsApp &middot; Melayani survey lokasi</p>
                </div>
              </div>

              {property.wa_number && (
                <a
                  href={getWALink(property.wa_number, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl gap-2 text-xs h-11 px-4 shadow-sm cursor-pointer">
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </Button>
                </a>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8D8C8] shadow-soft">
              <h2 className="text-lg font-black text-[#2D241E] mb-3">Tentang Properti Ini</h2>
              <p className="text-sm text-[#4E342E] leading-relaxed whitespace-pre-line font-medium">
                {cleanDescription || 'Tidak ada deskripsi detail untuk properti ini.'}
              </p>
            </div>

            {/* Facilities Section (Fasilitas Khusus Kamar + Fasilitas Bersama) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8D8C8] shadow-soft">
              {matchedRoom && matchedRoom.facilities && matchedRoom.facilities.length > 0 ? (
                <>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-lg font-black text-[#2D241E] flex items-center gap-2">
                      <span>Fasilitas Dalam {matchedRoom.number}</span>
                    </h2>
                    <span className="text-xs font-extrabold bg-[#F5EDE4] text-[#5D4037] px-3 py-1 rounded-full border border-[#D4BCA7]">
                      {matchedRoom.facilities.length} Fasilitas
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {matchedRoom.facilities.map((fac: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8] text-xs font-bold text-[#4E342E] shadow-2xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-black text-[#5D4037] mb-3">Fasilitas Bersama di Properti:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-[#6D4C41]">
                    <div className="p-3 rounded-2xl bg-[#F5EDE4] border border-[#D4BCA7] font-semibold">
                      🍲 Dapur Bersama (Kompor & Gas)
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F5EDE4] border border-[#D4BCA7] font-semibold">
                      📶 WiFi Internet Cepat
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F5EDE4] border border-[#D4BCA7] font-semibold">
                      🛵 Parkir Motor Aman Berpagar
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F5EDE4] border border-[#D4BCA7] font-semibold">
                      💧 Air Bersih PDAM Lancar
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F5EDE4] border border-[#D4BCA7] font-semibold">
                      🪜 Tangga Akses Lantai 2
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F5EDE4] border border-[#D4BCA7] font-semibold">
                      🌿 Sirkulasi Udara & Koridor Sejuk
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-black text-[#2D241E] mb-4">Fasilitas yang Disediakan</h2>
                  {facilities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {facilities.map((facility: any) => (
                        <div
                          key={facility?.id}
                          className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8] text-xs font-bold text-[#4E342E]"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[#6D4C41] shrink-0" />
                          <span>{facility?.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8D6E63]">Belum ada daftar fasilitas khusus.</p>
                  )}
                </>
              )}
            </div>

            {/* Tenant Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8D8C8] shadow-soft">
                <h2 className="text-lg font-black text-[#2D241E] mb-4">Ulasan Penyewa</h2>
                <div className="space-y-4">
                  {reviews.map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-[#2D241E]">{rev.reviewer?.full_name || 'Penyewa'}</span>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="h-3 w-3 fill-amber-600" />
                          <span className="text-xs font-bold">{rev.rating} / 5</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#6D4C41]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Booking Console */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-4xl p-6 md:p-7 border-2 border-[#D4BCA7] shadow-xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-2.5 ${isKos ? 'bg-[#5D4037]' : 'bg-[#D4BCA7]'}`} />

              <div className="mb-5 pb-4 border-b border-[#F5EDE4]">
                <span className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider block mb-1">
                  {matchedRoom ? `Tarif Sewa ${matchedRoom.number}` : 'Tarif Sewa'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#2D241E]">{formatPrice(displayPrice)}</span>
                  <span className="text-xs text-[#8D6E63] font-semibold">/ bulan</span>
                </div>
              </div>

              {/* Unit Info & CTA Booking */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                  <span className="text-[#8D6E63] font-semibold">Status Ketersediaan:</span>
                  <span className={`font-bold ${isRoomAvailable ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {matchedRoom
                      ? (isRoomAvailable ? 'Kamar Kosong & Siap Huni' : 'Sedang Terisi')
                      : (property.available_units > 0 ? `Sisa ${property.available_units} Unit Kosong` : 'Penuh')}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#6D4C41]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Foto & Fasilitas 100% Real Sesuai Aslinya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Langsung dari Pemilik Resmi Tanpa Calo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Bebas Biaya Layanan / Admin 100%</span>
                  </div>
                </div>

                {matchedRoom && (
                  <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-[#5D4037] text-white shadow-xs">
                    <span className="font-semibold text-[#E8D8C8]">Unit Dipilih:</span>
                    <span className="font-black text-sm text-[#FAF7F2]">{matchedRoom.number} ({matchedRoom.type})</span>
                  </div>
                )}

                {isRoomAvailable ? (
                  <Link
                    href={matchedRoom ? `/properti/${property.id}/booking?kamar=${encodeURIComponent(matchedRoom.number)}` : `/properti/${property.id}/booking`}
                    className="block"
                  >
                    <Button className="w-full h-12 rounded-2xl font-bold text-xs bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] shadow-md border border-[#3E2723] gap-2 transition-all hover:-translate-y-0.5 cursor-pointer">
                      <CalendarCheck className="h-4 w-4 text-[#E8D8C8]" />
                      <span>Ajukan Booking {matchedRoom?.number || 'Sekarang'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Button disabled className="w-full h-12 rounded-2xl font-bold text-xs bg-slate-200 text-slate-500">
                      Kamar Ini Sedang Terisi
                    </Button>
                    <p className="text-[11px] text-center text-[#8D6E63]">
                      Hubungi pemilik via WhatsApp untuk konfirmasi tanggal perkiraan kosong.
                    </p>
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Callout */}
              {property.wa_number && (
                <div className="mt-4 pt-4 border-t border-[#F5EDE4]">
                  <a
                    href={getWALink(property.wa_number, waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full rounded-2xl font-bold border-emerald-200 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/70 h-12 gap-2 text-xs cursor-pointer">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      <span>Chat WhatsApp Pemilik</span>
                    </Button>
                  </a>
                </div>
              )}

              <div className="mt-5 text-center">
                <p className="text-[11px] text-[#8D6E63] font-medium flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#6D4C41]" />
                  Jaminan bebas calo & transaksi transparan 100%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
