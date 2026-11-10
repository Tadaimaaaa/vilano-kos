import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, Star, Users, CheckCircle2, MessageCircle, ArrowLeft, ShieldCheck,
  CalendarCheck, ArrowRight
} from 'lucide-react'
import { getPropertyById } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate, getWALink, getGenderTypeLabel } from '@/lib/utils'
import { parseRoomsFromDescription, getCleanDescription } from '@/lib/rooms'
import KosFloorPlan from '@/components/property/KosFloorPlan'

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params

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

  const waMessage = `Halo, saya tertarik dengan ${property.name} di Vilano (Alamat: ${property.address}). Apakah masih tersedia unit untuk disewa?`

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
            {/* Kos: Coklat-Krem, Kontrakan: Krem-Coklat */}
            <Badge variant={isKos ? 'kos' : 'kontrakan'} className="text-xs font-bold">
              {isKos ? '🏠 Kos' : '🏡 Kontrakan'}
            </Badge>

            {isKos && property.gender_type && property.gender_type !== 'all' && (
              <Badge variant="outline" className="text-xs font-bold">
                <Users className="h-3 w-3 mr-1 text-[#8D6E63]" />
                Khusus {getGenderTypeLabel(property.gender_type)}
              </Badge>
            )}

            <Badge variant={property.available_units > 0 ? 'success' : 'destructive'} className="text-xs font-bold">
              {property.available_units > 0 ? `Tersedia ${property.available_units} Unit` : 'Unit Penuh'}
            </Badge>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-[#2D241E] leading-tight mb-2">
            {property.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-[#8D6E63]">
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

        {/* Photo Gallery Grid */}
        <div className="rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#E8D8C8] shadow-soft mb-8">
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 p-2.5">
              <div className="md:col-span-2 relative h-72 md:h-[420px] rounded-2xl overflow-hidden">
                <Image
                  src={photos.find((p) => p.is_primary)?.url || photos[0].url}
                  alt={property.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-2.5 h-72 md:h-[420px]">
                {photos.slice(1, 5).map((photo, index) => (
                  <div key={photo.id || index} className="relative rounded-2xl overflow-hidden bg-slate-200">
                    <Image
                      src={photo.url}
                      alt={`${property.name} ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
                {photos.length <= 1 && (
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
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl gap-2 text-xs h-11 px-4 shadow-sm">
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

            {/* Denah & Tata Letak Kamar Lantai 1 (Khusus Kos) */}
            {isKos && (
              <KosFloorPlan
                propertyId={property.id}
                propertyName={property.name}
                rooms={rooms}
                ownerPhone={property.wa_number}
              />
            )}

            {/* Facilities */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8D8C8] shadow-soft">
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
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8D8C8] shadow-soft">
              <h2 className="text-lg font-black text-[#2D241E] mb-4">Informasi Spesifikasi</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                  <span className="text-[11px] font-bold text-[#8D6E63] block mb-1">Jenis Properti</span>
                  <span className="font-extrabold text-[#2D241E] text-sm capitalize">{property.type}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                  <span className="text-[11px] font-bold text-[#8D6E63] block mb-1">Kota Wilayah</span>
                  <span className="font-extrabold text-[#2D241E] text-sm">{property.kota}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                  <span className="text-[11px] font-bold text-[#8D6E63] block mb-1">Total Unit</span>
                  <span className="font-extrabold text-[#2D241E] text-sm">{property.total_units} Unit</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                  <span className="text-[11px] font-bold text-[#8D6E63] block mb-1">Sisa Unit Kosong</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{property.available_units} Unit</span>
                </div>
                {isKos && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                    <span className="text-[11px] font-bold text-[#8D6E63] block mb-1">Tipe Penghuni</span>
                    <span className="font-extrabold text-[#2D241E] text-sm">{getGenderTypeLabel(property.gender_type)}</span>
                  </div>
                )}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                  <span className="text-[11px] font-bold text-[#8D6E63] block mb-1">Status Keamanan</span>
                  <span className="font-extrabold text-[#2D241E] text-sm">Aman 24 Jam</span>
                </div>
              </div>
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
                <span className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider block mb-1">Tarif Sewa</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#2D241E]">{formatPrice(property.price_per_month)}</span>
                  <span className="text-xs text-[#8D6E63] font-semibold">/ bulan</span>
                </div>
              </div>

              {/* Unit Info & CTA Booking */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8]">
                  <span className="text-[#8D6E63] font-semibold">Ketersediaan Unit:</span>
                  <span className={`font-bold ${property.available_units > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {property.available_units > 0 ? `Sisa ${property.available_units} Unit Kosong` : 'Penuh'}
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

                {property.available_units > 0 ? (
                  <Link href={`/properti/${property.id}/booking`} className="block">
                    <Button className="w-full h-12 rounded-2xl font-bold text-xs bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] shadow-md border border-[#3E2723] gap-2 transition-all hover:-translate-y-0.5">
                      <CalendarCheck className="h-4 w-4 text-[#E8D8C8]" />
                      <span>Ajukan Booking Sekarang</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full h-12 rounded-2xl font-bold text-xs bg-slate-200 text-slate-500">
                    Unit Penuh
                  </Button>
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
                    <Button variant="outline" className="w-full rounded-2xl font-bold border-emerald-200 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/70 h-12 gap-2 text-xs">
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
