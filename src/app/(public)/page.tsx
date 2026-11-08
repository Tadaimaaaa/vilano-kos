import { Suspense } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Building2, Home, ShieldCheck, Star, Users,
  CheckCircle2, Sparkles, MessageSquare, Zap, Clock, ThumbsUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyCard from '@/components/property/PropertyCard'
import HeroSearch from '@/components/home/HeroSearch'
import PopularCities from '@/components/home/PopularCities'
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
            Rekomendasi Terhangat
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#2D241E] mt-2">
            Hunian Terpilih Minggu Ini
          </h2>
          <p className="text-[#8D6E63] text-sm mt-1">
            Pilihan kos (coklat-krem) dan kontrakan (krem-coklat) dengan rating tertinggi.
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
      <section className="relative bg-gradient-to-br from-[#1F1A17] via-[#3E2723] to-[#2D241E] text-white pt-20 pb-28 px-4 overflow-hidden">
        {/* Warm Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8D6E63]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4BCA7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#FAF7F20a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-5xl text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 bg-[#F5EDE4]/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D4BCA7]/20 text-xs font-bold text-[#E8D8C8] mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#D4BCA7]" />
            <span>Platform Kos & Kontrakan Nyaman Terpercaya</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#FAF7F2] mb-5 leading-[1.15]">
            Temukan Kos & Kontrakan Impian, <br />
            <span className="bg-gradient-to-r from-[#FAF7F2] via-[#E8D8C8] to-[#D4BCA7] bg-clip-text text-transparent">
              Hangat, Nyaman & Transparan.
            </span>
          </h1>

          <p className="text-sm md:text-base text-[#D4BCA7] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Bebas pilih kamar kos harian/bulanan atau rumah kontrakan keluarga dengan foto real, fasilitas terverifikasi, dan kontak langsung ke WhatsApp pemilik.
          </p>

          {/* Search Console Component */}
          <HeroSearch />

          {/* Key Value Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-[#D4BCA7]/20">
            <div>
              <p className="text-2xl font-black text-[#FAF7F2]">5.000+</p>
              <p className="text-xs text-[#A98467] font-semibold">Unit Kos & Kontrakan</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#E8D8C8]">100%</p>
              <p className="text-xs text-[#A98467] font-semibold">Bebas Biaya Admin</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#FAF7F2]">1.800+</p>
              <p className="text-xs text-[#A98467] font-semibold">Pemilik Terdaftar</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#D4BCA7]">4.9 / 5</p>
              <p className="text-xs text-[#A98467] font-semibold">Rating Kepuasan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Big Category Showcases (Kos: Coklat-Krem, Kontrakan: Krem-Coklat) */}
      <section className="container mx-auto px-4 lg:px-8 -mt-10 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Kos: COKLAT DOMINAN dengan Aksen KREM */}
          <Link
            href="/kos"
            className="group relative bg-gradient-to-br from-[#4E342E] via-[#5D4037] to-[#795548] rounded-4xl p-8 text-[#FAF7F2] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block border border-[#3E2723]"
          >
            <div className="relative z-10 max-w-md">
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2]/15 backdrop-blur-md text-xs font-black uppercase tracking-wider inline-block mb-3 text-[#E8D8C8]">
                Kamar Kos Eksklusif
              </span>
              <h3 className="text-3xl font-black mb-2 text-[#FAF7F2]">Kamar Kos</h3>
              <p className="text-[#E8D8C8] text-sm mb-6 leading-relaxed">
                Kamar siap huni lengkap dengan WiFi, AC, dan kamar mandi dalam. Pilihan kos putra, putri, dan campur dekat kampus & perkantoran.
              </p>
              <div className="inline-flex items-center gap-2 font-bold text-sm bg-[#FAF7F2] text-[#4E342E] px-5 py-2.5 rounded-2xl group-hover:bg-white transition-colors shadow-sm">
                <span>Eksplor Kos</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute right-4 bottom-2 text-8xl md:text-9xl opacity-20 group-hover:scale-110 transition-transform select-none">
              🏠
            </div>
          </Link>

          {/* Card Kontrakan: KREM DOMINAN dengan Aksen COKLAT */}
          <Link
            href="/kontrakan"
            className="group relative bg-gradient-to-br from-[#FAF7F2] via-[#F5EDE4] to-[#E8D8C8] rounded-4xl p-8 text-[#2D241E] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block border-2 border-[#D4BCA7]"
          >
            <div className="relative z-10 max-w-md">
              <span className="px-3 py-1 rounded-full bg-[#5D4037] text-xs font-black uppercase tracking-wider inline-block mb-3 text-[#FAF7F2]">
                Rumah Kontrakan Keluarga
              </span>
              <h3 className="text-3xl font-black mb-2 text-[#3E2723]">Rumah Kontrakan</h3>
              <p className="text-[#6D4C41] text-sm mb-6 leading-relaxed">
                Satu rumah utuh dengan ruang tamu, dapur, dan carport mobil. Ideal untuk tempat tinggal keluarga atau patungan teman kerja.
              </p>
              <div className="inline-flex items-center gap-2 font-bold text-sm bg-[#5D4037] text-[#FAF7F2] px-5 py-2.5 rounded-2xl group-hover:bg-[#4E342E] transition-colors shadow-sm">
                <span>Eksplor Kontrakan</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute right-4 bottom-2 text-8xl md:text-9xl opacity-20 group-hover:scale-110 transition-transform select-none">
              🏡
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Properties Section */}
      <Suspense fallback={<div className="py-16 text-center text-[#8D6E63]">Memuat properti pilihan...</div>}>
        <FeaturedSection />
      </Suspense>

      {/* Popular Cities */}
      <PopularCities />

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
              Tanya ketersediaan dan survey lokasi langsung ke pemilik tanpa perantara atau calo liar.
            </p>
          </div>

          <div className="bg-[#3E2723]/70 rounded-3xl p-6 border border-[#5D4037] hover:border-[#D4BCA7] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-[#E8D8C8] flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[#FAF7F2]">100% Foto Real</h3>
            <p className="text-[#D4BCA7] text-xs leading-relaxed">
              Foto dan fasilitas dicek secara berkala untuk memastikan kondisi kamar real sesuai dengan aslinya.
            </p>
          </div>

          <div className="bg-[#3E2723]/70 rounded-3xl p-6 border border-[#5D4037] hover:border-[#D4BCA7] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-[#E8D8C8] flex items-center justify-center mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[#FAF7F2]">Booking Online Cepat</h3>
            <p className="text-[#D4BCA7] text-xs leading-relaxed">
              Kunci unit impianmu sebelum keduluan orang lain hanya dengan mengisi form reservasi singkat.
            </p>
          </div>

          <div className="bg-[#3E2723]/70 rounded-3xl p-6 border border-[#5D4037] hover:border-[#D4BCA7] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-[#E8D8C8] flex items-center justify-center mb-4">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[#FAF7F2]">Tanpa Biaya Calo</h3>
            <p className="text-[#D4BCA7] text-xs leading-relaxed">
              Bebas komisi perantara. Tarif yang tertera adalah tarif murni yang ditentukan pemilik properti.
            </p>
          </div>
        </div>
      </section>

      {/* Property Owner Banner */}
      <section className="container mx-auto px-4 lg:px-8 py-8 mb-8">
        <div className="relative bg-gradient-to-r from-[#4E342E] via-[#5D4037] to-[#2D241E] rounded-4xl p-8 md:p-14 text-[#FAF7F2] overflow-hidden shadow-xl border border-[#3E2723]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#D4BCA7]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#E8D8C8] border border-white/15 inline-block mb-3">
              Untuk Pemilik Properti
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Punya Kamar Kos atau Kontrakan Kosong?
            </h2>
            <p className="text-[#E8D8C8] text-sm md:text-base leading-relaxed mb-8">
              Iklankan propertimu di Vilano dan dapatkan calon penyewa terpercaya mahasiswa & karyawan di kotamu secara gratis!
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register?role=pemilik">
                <Button size="lg" className="bg-[#FAF7F2] text-[#4E342E] hover:bg-white font-black rounded-2xl w-full sm:w-auto shadow-md">
                  Daftarkan Properti Sekarang
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-[#D4BCA7] text-[#FAF7F2] hover:bg-white/10 rounded-2xl w-full sm:w-auto">
                  Pelajari Selengkapnya
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
