import { Suspense } from 'react'
import { Building2 } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyFilters from '@/components/property/PropertyFilters'
import { getProperties, getKotaList } from '@/lib/queries'
import { PropertyFilters as Filters } from '@/types'

interface KosPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

async function KosList({ filters }: { filters: Filters }) {
  const properties = await getProperties({ ...filters, type: 'kos' })

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-4xl border border-[#E8D8C8] shadow-soft p-8">
        <div className="w-16 h-16 rounded-3xl bg-[#5D4037] text-[#FAF7F2] flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          🏠
        </div>
        <h3 className="text-xl font-extrabold text-[#2D241E]">Belum Ada Kos Ditemukan</h3>
        <p className="text-[#8D6E63] text-sm mt-1.5 max-w-sm mx-auto">
          Coba atur ulang kata kunci atau filter harga untuk menemukan kos yang kamu cari.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider">
          Menampilkan <span className="text-[#3E2723] font-black">{properties.length}</span> kos pilihan
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

export default async function KosPage({ searchParams }: KosPageProps) {
  const params = await searchParams
  const kotaList = await getKotaList()

  const filters: Filters = {
    search: params.search,
    kota: params.kota,
    gender_type: params.gender as any,
  }

  if (params.price) {
    const [min, max] = params.price.split('-').map(Number)
    if (min) filters.min_price = min
    if (max) filters.max_price = max
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl">
      {/* Header Banner - COKLAT DOMINAN & KREM */}
      <div className="relative rounded-4xl bg-gradient-to-r from-[#2D241E] via-[#5D4037] to-[#4E342E] p-8 md:p-12 text-[#FAF7F2] mb-8 overflow-hidden shadow-xl border border-[#3E2723]">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2]/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3 text-[#E8D8C8]">
            <Building2 className="h-3.5 w-3.5 text-[#D4BCA7]" />
            Khusus Cowok / Putra &bull; Kamar Kos Vilano
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3 text-[#FAF7F2]">
            Kamar Kos Putra Nyaman & Eksklusif
          </h1>
          <p className="text-[#E8D8C8] text-sm md:text-base leading-relaxed">
            Pilihan kamar kos khusus cowok (mahasiswa & karyawan) milik Vilano. Bersih, terawat, full-furnished, dan langsung dari pemilik tanpa perantara.
          </p>
        </div>
        <div className="absolute right-6 -bottom-6 text-9xl opacity-15 select-none hidden md:block">
          🏢
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <PropertyFilters kotaList={kotaList} defaultType="kos" />
      </div>

      {/* Results */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#E8D8C8]/50 rounded-3xl h-80 animate-pulse" />
          ))}
        </div>
      }>
        <KosList filters={filters} />
      </Suspense>
    </div>
  )
}
