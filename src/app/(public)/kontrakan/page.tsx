import { Suspense } from 'react'
import { Home } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyFilters from '@/components/property/PropertyFilters'
import { getProperties, getKotaList } from '@/lib/queries'
import { PropertyFilters as Filters } from '@/types'

interface KontrakanPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

async function KontrakanList({ filters }: { filters: Filters }) {
  const properties = await getProperties({ ...filters, type: 'kontrakan' })

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-4xl border border-[#E8D8C8] shadow-soft p-8">
        <div className="w-16 h-16 rounded-3xl bg-[#F5EDE4] text-[#4E342E] border border-[#D4BCA7] flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          🏡
        </div>
        <h3 className="text-xl font-extrabold text-[#2D241E]">Belum Ada Kontrakan Ditemukan</h3>
        <p className="text-[#8D6E63] text-sm mt-1.5 max-w-sm mx-auto">
          Coba ubah kata kunci atau pilih kota lain untuk melihat rumah kontrakan yang tersedia.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider">
          Menampilkan <span className="text-[#3E2723] font-black">{properties.length}</span> kontrakan pilihan
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </>
  )
}

export default async function KontrakanPage({ searchParams }: KontrakanPageProps) {
  const params = await searchParams
  const kotaList = await getKotaList()

  const filters: Filters = {
    search: params.search,
    kota: params.kota,
  }

  if (params.price) {
    const [min, max] = params.price.split('-').map(Number)
    if (min) filters.min_price = min
    if (max) filters.max_price = max
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl">
      {/* Header Banner - KREM DOMINAN & COKLAT */}
      <div className="relative rounded-4xl bg-gradient-to-r from-[#FAF7F2] via-[#F5EDE4] to-[#E8D8C8] p-8 md:p-12 text-[#2D241E] mb-8 overflow-hidden shadow-xl border-2 border-[#D4BCA7]">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5D4037] text-xs font-bold uppercase tracking-wider mb-3 text-[#FAF7F2]">
            <Home className="h-3.5 w-3.5 text-[#E8D8C8]" />
            Katalog Rumah Kontrakan Vilano
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3 text-[#2D241E]">
            Sewa Rumah Kontrakan Keluarga
          </h1>
          <p className="text-[#6D4C41] text-sm md:text-base leading-relaxed">
            Satu rumah utuh milik Vilano dengan ruang keluarga, dapur privat, dan carport untuk kenyamanan tempat tinggal keluargamu langsung dari pemilik.
          </p>
        </div>
        <div className="absolute right-6 -bottom-6 text-9xl opacity-15 select-none hidden md:block">
          🏘️
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <PropertyFilters kotaList={kotaList} defaultType="kontrakan" />
      </div>

      {/* Results */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#E8D8C8]/50 rounded-3xl h-80 animate-pulse" />
          ))}
        </div>
      }>
        <KontrakanList filters={filters} />
      </Suspense>
    </div>
  )
}
