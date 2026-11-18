import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Building2, Home, MapPin, ShieldCheck, CheckCircle2, Sparkles, Phone } from 'lucide-react'
import { getPropertyById } from '@/lib/queries'
import { formatPrice, getGenderTypeLabel } from '@/lib/utils'
import { parseRoomsFromDescription } from '@/lib/rooms'
import { Badge } from '@/components/ui/badge'
import BookingForm from '@/components/property/BookingForm'

interface BookingPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ kamar?: string }>
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { id } = await params
  const { kamar } = await searchParams
  const propertyData = await getPropertyById(id)

  if (!propertyData || !propertyData.property) {
    notFound()
  }

  const { property } = propertyData
  const isKos = property.type === 'kos'
  const primaryPhoto = property.primary_photo || property.photos?.[0]?.url
  const rooms = parseRoomsFromDescription(property.description)

  // Cari detail kamar jika ada kamar yang dipilih
  const matchedRoom = kamar
    ? rooms.find((r) => {
        const normKamar = kamar.toLowerCase().replace(/[^a-z0-9]/g, '')
        const normNum = r.number.toLowerCase().replace(/[^a-z0-9]/g, '')
        const normLabel = (r.label || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const normId = String(r.id)
        return (
          normKamar === normNum ||
          normKamar === normLabel ||
          normKamar === normId ||
          normKamar.endsWith(normNum) ||
          normNum.endsWith(normKamar)
        )
      })
    : null

  const displayPrice = matchedRoom ? matchedRoom.price : property.price_per_month
  const roomPhoto = matchedRoom?.photos?.[0] || matchedRoom?.photoUrl
  const displayPhoto = roomPhoto || primaryPhoto
  const roomFacilities = matchedRoom?.facilities || []

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={kamar ? `/properti/${property.id}?kamar=${encodeURIComponent(kamar)}` : `/properti/${property.id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8D6E63] hover:text-[#3E2723] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Detail Properti</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EDE4] text-xs font-bold text-[#5D4037] border border-[#D4BCA7] mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#A98467]" />
            Formulir Sewa Resmi &bull; Langsung ke Pemilik
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-[#2D241E]">
            Ajukan Booking & Sewa {matchedRoom ? matchedRoom.number : 'Unit'}
          </h1>
          <p className="text-xs md:text-sm text-[#8D6E63] mt-1">
            Lengkapi data diri Anda di bawah ini untuk mengajukan permohonan sewa resmi langsung ke pemilik Vilano tanpa calo.
          </p>
        </div>

        {/* Main Grid: Form on Left, Property Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Booking Form (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white rounded-4xl p-6 md:p-8 border-2 border-[#D4BCA7] shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-2.5 ${isKos ? 'bg-[#5D4037]' : 'bg-[#D4BCA7]'}`} />

            <BookingForm
              propertyId={property.id}
              propertyName={matchedRoom ? `${property.name} (${matchedRoom.number})` : property.name}
              propertyType={property.type}
              pricePerMonth={displayPrice}
              availableUnits={property.available_units}
              ownerPhone={property.wa_number}
              initialRoom={matchedRoom ? matchedRoom.number : (kamar || '')}
            />
          </div>

          {/* Right Column: Property Summary Card (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-4xl p-6 border border-[#E8D8C8] shadow-soft space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8D6E63] block">
                Ringkasan Unit yang Dipilih
              </span>

              {/* Photo Frame */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8D8C8]">
                {displayPhoto ? (
                  <Image
                    src={displayPhoto}
                    alt={matchedRoom ? `${property.name} ${matchedRoom.number}` : property.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#8D6E63]">
                    <span className="text-4xl mb-1">{isKos ? '🏠' : '🏡'}</span>
                    <span className="text-xs font-medium">Foto Properti</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <Badge variant={isKos ? 'kos' : 'kontrakan'} className="font-bold text-[10px]">
                    {isKos ? '🏠 Kos Putra' : '🏡 Kontrakan'}
                  </Badge>
                  {matchedRoom && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5D4037] text-white shadow-xs">
                      {matchedRoom.number}
                    </span>
                  )}
                  {isKos && property.gender_type && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#4E342E] shadow-xs">
                      {getGenderTypeLabel(property.gender_type)}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <h2 className="font-extrabold text-[#2D241E] text-base leading-snug">
                  {matchedRoom ? `${property.name} — ${matchedRoom.number}` : property.name}
                </h2>
                {matchedRoom && (
                  <p className="text-xs font-bold text-[#5D4037] mt-0.5">
                    {matchedRoom.type}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#8D6E63] mt-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#5D4037] shrink-0" />
                  <span>{property.address}, {property.kota}</span>
                </div>
              </div>

              {/* Price */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8] flex items-baseline justify-between">
                <span className="text-xs text-[#8D6E63] font-bold">
                  {matchedRoom ? `Tarif ${matchedRoom.number}:` : 'Tarif Sewa:'}
                </span>
                <div>
                  <span className="text-lg font-black text-[#5D4037]">{formatPrice(displayPrice)}</span>
                  <span className="text-xs text-[#8D6E63] font-semibold"> / bulan</span>
                </div>
              </div>

              {/* Facilities Preview */}
              {roomFacilities.length > 0 ? (
                <div>
                  <span className="text-[11px] font-bold text-[#8D6E63] block mb-2">Fasilitas {matchedRoom?.number}:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {roomFacilities.map((f: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF7F2] border border-[#E8D8C8] text-[11px] font-semibold text-[#4E342E]"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                property.facilities && property.facilities.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-[#8D6E63] block mb-2">Fasilitas Termasuk:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {property.facilities.slice(0, 6).map((f: any, i: number) => (
                        <span
                          key={f.id || i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF7F2] border border-[#E8D8C8] text-[11px] font-semibold text-[#4E342E]"
                        >
                          <CheckCircle2 className="h-3 w-3 text-[#5D4037]" />
                          <span>{f.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Guarantee list */}
              <div className="pt-3 border-t border-[#F5EDE4] space-y-2 text-xs text-[#6D4C41]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Langsung terhubung ke WhatsApp Pemilik Resmi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Bebas biaya admin & tanpa perantara</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
