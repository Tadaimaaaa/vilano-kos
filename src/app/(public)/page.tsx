import { Suspense } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Building2, Home, ShieldCheck,
  Sparkles, MessageSquare, Zap, ThumbsUp, CalendarCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyCard from '@/components/property/PropertyCard'
import { getFeaturedProperties, getProperties } from '@/lib/queries'

async function FeaturedSection() {
  const properties = await getFeaturedProperties()
  const displayProps = properties.length > 0 ? properties : await getProperties()

  if (displayProps.length === 0) return null

  return (
    <section className="py-12 container mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5D4037] bg-[#F5EDE4] px-3 py-1 rounded-full border border-[#D4BCA7]">
            Unit Pilihan Vilano
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#2D241E] mt-2">
            Kamar Kos & Rumah Kontrakan Kami
          </h2>
          <p className="text-[#8D6E63] text-sm mt-1">
            Pilihan kamar kos khusus cowok (coklat-krem) dan rumah kontrakan keluarga (krem-coklat) terawat yang siap kamu huni.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/kos">
            <Button size="sm" className="bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] rounded-xl font-bold text-xs gap-1.5 border border-[#3E2723]">
              <Building2 className="h-3.5 w-3.5 text-[#E8D8C8]" /> Semua Kos
            </Button>
          </Link>
          <Link href="/kontrakan">
            <Button size="sm" className="bg-[#F5EDE4] hover:bg-[#E8D8C8] text-[#4E342E] border-2 border-[#D4BCA7] rounded-xl font-bold text-xs gap-1.5">
              <Home className="h-3.5 w-3.5 text-[#5D4037]" /> Semua Kontrakan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProps.slice(0, 6).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero Section with Warm Earthy Brown & Cream Gradient */}
      <section className="relative bg-gradient-to-br from-[#1F1A17] via-[#3E2723] to-[#2D241E] text-white pt-20 pb-20 px-4 overflow-hidden">
        {/* Warm Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8D6E63]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4BCA7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#FAF7F20a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-5xl text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 bg-[#F5EDE4]/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D4BCA7]/20 text-xs font-bold text-[#E8D8C8] mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#D4BCA7]" />
            <span>Website Resmi Kos & Kontrakan Vilano &bull; Kota Solok</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#FAF7F2] mb-5 leading-[1.15]">
            Sewa Kos & Kontrakan di Kota Solok, <br />
            <span className="bg-gradient-to-r from-[#FAF7F2] via-[#E8D8C8] to-[#D4BCA7] bg-clip-text text-transparent">
              Terawat, Bersih & Langsung Pemilik.
            </span>
          </h1>

          <p className="text-sm md:text-base text-[#D4BCA7] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Pilihan kamar kos eksklusif khusus cowok di Ps. Pandan Air Mati dan rumah kontrakan keluarga di Simpang Rumbio, Lubuk Sikarah, Kota Solok. Foto 100% real sesuai aslinya, fasilitas lengkap, langsung dari pemilik tanpa perantara.
          </p>

          {/* Action CTAs: Kos (Coklat-Krem) & Kontrakan (Krem-Coklat) */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link href="/kos">
              <Button size="lg" className="bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] rounded-2xl font-bold px-8 py-6 text-sm gap-2.5 border border-[#8D6E63]/40 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">
                <Building2 className="h-5 w-5 text-[#E8D8C8]" />
                <span>Eksplor Kos Putra</span>
                <ArrowRight className="h-4 w-4 text-[#D4BCA7]" />
              </Button>
            </Link>
            <Link href="/kontrakan">
              <Button size="lg" className="bg-[#FAF7F2] hover:bg-[#F5EDE4] text-[#4E342E] rounded-2xl font-bold px-8 py-6 text-sm gap-2.5 border border-[#D4BCA7] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">
                <Home className="h-5 w-5 text-[#5D4037]" />
                <span>Eksplor Kontrakan</span>
                <ArrowRight className="h-4 w-4 text-[#5D4037]" />
              </Button>
            </Link>
          </div>

          {/* Key Value Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-[#D4BCA7]/20">
            <div>
              <p className="text-2xl font-black text-[#FAF7F2]">100%</p>
              <p className="text-xs text-[#A98467] font-semibold">Foto & Unit Real</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#E8D8C8]">0 Biaya</p>
              <p className="text-xs text-[#A98467] font-semibold">Tanpa Calo / Perantara</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#FAF7F2]">Langsung</p>
              <p className="text-xs text-[#A98467] font-semibold">Kontak Pemilik Langsung</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#D4BCA7]">4.9 / 5</p>
              <p className="text-xs text-[#A98467] font-semibold">Rating Kepuasan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <Suspense fallback={<div className="py-16 text-center text-[#8D6E63]">Memuat properti pilihan...</div>}>
        <FeaturedSection />
      </Suspense>

      {/* Why Choose Vilano - Warm Coffee Night */}
      <section className="py-16 bg-[#2D241E] text-[#FAF7F2] rounded-4xl container mx-auto px-6 lg:px-12 my-8 shadow-2xl border border-[#3E2723]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4BCA7] bg-[#3E2723] px-3 py-1 rounded-full border border-[#5D4037]">
            Kenapa Pilih Vilano?
          </span>
          <h2 className="text-3xl font-black mt-3">Sewa Hunian Tenang & Pasti</h2>
          <p className="text-[#D4BCA7] text-sm mt-2">
            Pengalaman mencari hunian yang transparan, mudah, dan aman untuk mahasiswa, pekerja, dan keluarga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#3E2723]/70 rounded-3xl p-6 border border-[#5D4037] hover:border-[#D4BCA7] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-[#E8D8C8] flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[#FAF7F2]">Direct WhatsApp</h3>
            <p className="text-[#D4BCA7] text-xs leading-relaxed">
              Tanya ketersediaan dan atur jadwal survey langsung ke kami selaku pemilik tanpa perantara.
            </p>
          </div>

          <div className="bg-[#3E2723]/70 rounded-3xl p-6 border border-[#5D4037] hover:border-[#D4BCA7] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-[#E8D8C8] flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[#FAF7F2]">100% Foto Real</h3>
            <p className="text-[#D4BCA7] text-xs leading-relaxed">
              Semua foto kamar dan fasilitas diambil langsung di lokasi unit kami sesuai kondisi nyata aslinya.
            </p>
          </div>

          <div className="bg-[#3E2723]/70 rounded-3xl p-6 border border-[#5D4037] hover:border-[#D4BCA7] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-[#E8D8C8] flex items-center justify-center mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[#FAF7F2]">Booking Langsung Cepat</h3>
            <p className="text-[#D4BCA7] text-xs leading-relaxed">
              Kunci kamar kos atau rumah kontrakan pilihanmu secara langsung dan mudah sebelum keduluan.
            </p>
          </div>

          <div className="bg-[#3E2723]/70 rounded-3xl p-6 border border-[#5D4037] hover:border-[#D4BCA7] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-[#E8D8C8] flex items-center justify-center mb-4">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[#FAF7F2]">Bebas Biaya Calo</h3>
            <p className="text-[#D4BCA7] text-xs leading-relaxed">
              Tarif murni langsung dari kami pemilik properti, tanpa mark-up komisi atau biaya perantara.
            </p>
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="container mx-auto px-4 lg:px-8 py-8 mb-8">
        <div className="relative bg-gradient-to-r from-[#4E342E] via-[#5D4037] to-[#2D241E] rounded-4xl p-8 md:p-14 text-[#FAF7F2] overflow-hidden shadow-xl border border-[#3E2723]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#D4BCA7]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#E8D8C8] border border-white/15 inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#D4BCA7]" />
              Reservasi Mudah & Cepat
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Siap Pindah ke Hunian Impian?
            </h2>
            <p className="text-[#E8D8C8] text-sm md:text-base leading-relaxed mb-8">
              Pilih kamar kos atau rumah kontrakan terbaik dengan harga transparan, fasilitas lengkap terverifikasi, dan kontak langsung ke WhatsApp pemilik.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/kos">
                <Button size="lg" className="bg-[#FAF7F2] text-[#4E342E] hover:bg-white font-black rounded-2xl w-full sm:w-auto shadow-md gap-2">
                  <CalendarCheck className="h-4 w-4 text-[#5D4037]" />
                  Booking Sekarang
                </Button>
              </Link>
              <Link href="/kontrakan">
                <Button size="lg" variant="outline" className="border-[#D4BCA7] text-[#FAF7F2] hover:bg-white/10 rounded-2xl w-full sm:w-auto font-bold gap-2">
                  <Home className="h-4 w-4 text-[#E8D8C8]" />
                  Booking Kontrakan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
