import { Building2 } from 'lucide-react'
import KosFloorPlan from '@/components/property/KosFloorPlan'
import { getRoomsData } from '@/lib/rooms-storage'

export default async function KosPage() {
  const rooms = await getRoomsData('kos-vilano-pandan')

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl">
      {/* Header Banner - COKLAT DOMINAN & KREM */}
      <div className="relative rounded-4xl bg-gradient-to-r from-[#2D241E] via-[#5D4037] to-[#4E342E] p-8 md:p-12 text-[#FAF7F2] mb-8 overflow-hidden shadow-xl border border-[#3E2723]">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2]/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3 text-[#E8D8C8]">
            <Building2 className="h-3.5 w-3.5 text-[#D4BCA7]" />
            Khusus Cowok / Putra &bull; Kota Solok
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-3 text-[#FAF7F2]">
            Kamar Kos Putra Nyaman di Kota Solok
          </h1>
          <p className="text-[#E8D8C8] text-sm md:text-base leading-relaxed">
            Pilihan kamar kos khusus cowok (mahasiswa & karyawan) milik Vilano di Jl. Pandan Tengah, Ps. Pandan Air Mati, Kec. Lubuk Sikarah, Kota Solok. Bersih, terawat, full-furnished, dan langsung dari pemilik tanpa perantara.
          </p>
        </div>
        <div className="absolute right-6 -bottom-6 text-9xl opacity-15 select-none hidden md:block">
          🏢
        </div>
      </div>

      {/* Denah Interaktif Lantai 1 Kos */}
      <KosFloorPlan
        propertyId="kos-vilano-pandan"
        propertyName="Vilano Kos Putra Pandan"
        rooms={rooms}
        ownerPhone="08127951435"
      />
    </div>
  )
}
