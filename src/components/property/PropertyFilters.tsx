'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useCallback, Suspense } from 'react'
import { Search, SlidersHorizontal, MapPin, DollarSign, Users, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PropertyFiltersProps {
  kotaList?: string[]
  defaultType?: 'kos' | 'kontrakan'
}

const PRICE_RANGES = [
  { label: 'Semua Harga', min: undefined, max: undefined },
  { label: '< Rp 1 Juta', min: undefined, max: 1000000 },
  { label: 'Rp 1 Jt - 2 Jt', min: 1000000, max: 2000000 },
  { label: 'Rp 2 Jt - 3.5 Jt', min: 2000000, max: 3500000 },
  { label: 'Rp 3.5 Jt - 5 Jt', min: 3500000, max: 5000000 },
  { label: '> Rp 5 Juta', min: 5000000, max: undefined },
]

function PropertyFiltersContent({ kotaList = [], defaultType }: PropertyFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [kota, setKota] = useState(searchParams.get('kota') || '')
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '')
  const [genderType, setGenderType] = useState(searchParams.get('gender') || '')

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (kota) params.set('kota', kota)
    if (priceRange) params.set('price', priceRange)
    if (genderType) params.set('gender', genderType)
    router.push(`${pathname}?${params.toString()}`)
  }, [search, kota, priceRange, genderType, pathname, router])

  const clearFilters = () => {
    setSearch('')
    setKota('')
    setPriceRange('')
    setGenderType('')
    router.push(pathname)
  }

  const hasFilters = search || kota || priceRange || genderType

  return (
    <div className="bg-white rounded-3xl border border-[#E8D8C8] shadow-soft p-4 md:p-5">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]" />
          <input
            type="text"
            placeholder="Cari kos, kontrakan, jalan, atau area sekitar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#FAF7F2] border border-[#D4BCA7] text-sm font-semibold text-[#2D241E] placeholder:text-[#A98467] focus:outline-none focus:border-[#6D4C41] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={applyFilters}
            className="h-12 px-6 rounded-2xl font-bold bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] shadow-sm"
          >
            Terapkan
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-12 px-4 rounded-2xl font-bold gap-2 text-xs ${
              showFilters || hasFilters
                ? 'border-[#5D4037] text-[#4E342E] bg-[#F5EDE4]'
                : 'border-[#D4BCA7] text-[#6D4C41]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filter Detail</span>
          </Button>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-[#F5EDE4] grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          {/* Kota */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4E342E] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#6D4C41]" />
              Pilih Kota
            </label>
            <select
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              className="w-full h-11 text-xs font-semibold border border-[#D4BCA7] rounded-xl px-3 bg-[#FAF7F2] text-[#2D241E] focus:outline-none focus:border-[#6D4C41]"
            >
              <option value="">Semua Kota</option>
              {kotaList.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Rentang Biaya */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4E342E] flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[#6D4C41]" />
              Rentang Harga
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full h-11 text-xs font-semibold border border-[#D4BCA7] rounded-xl px-3 bg-[#FAF7F2] text-[#2D241E] focus:outline-none focus:border-[#6D4C41]"
            >
              {PRICE_RANGES.map((r) => (
                <option
                  key={r.label}
                  value={r.min !== undefined || r.max !== undefined ? `${r.min || 0}-${r.max || 99999999}` : ''}
                >
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipe Penghuni (Kos Only) */}
          {(!defaultType || defaultType === 'kos') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4E342E] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#6D4C41]" />
                Kategori Penghuni Kos
              </label>
              <select
                value={genderType}
                onChange={(e) => setGenderType(e.target.value)}
                className="w-full h-11 text-xs font-semibold border border-[#D4BCA7] rounded-xl px-3 bg-[#FAF7F2] text-[#2D241E] focus:outline-none focus:border-[#6D4C41]"
              >
                <option value="">Semua Penghuni</option>
                <option value="putra">Khusus Putra</option>
                <option value="putri">Khusus Putri</option>
                <option value="campur">Campur</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Chips */}
      {hasFilters && (
        <div className="mt-3.5 pt-3 border-t border-[#F5EDE4] flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#8D6E63]">Filter Aktif:</span>
          {search && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#F5EDE4] border border-[#D4BCA7] text-[#4E342E] font-bold px-3 py-1 rounded-full">
              Kata: &ldquo;{search}&rdquo;
            </span>
          )}
          {kota && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#F5EDE4] border border-[#D4BCA7] text-[#4E342E] font-bold px-3 py-1 rounded-full">
              Kota: {kota}
            </span>
          )}
          {priceRange && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#F5EDE4] border border-[#D4BCA7] text-[#4E342E] font-bold px-3 py-1 rounded-full">
              Harga Difilter
            </span>
          )}
          {genderType && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#5D4037] text-[#FAF7F2] font-bold px-3 py-1 rounded-full capitalize">
              Tipe: {genderType}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default function PropertyFilters(props: PropertyFiltersProps) {
  return (
    <Suspense fallback={<div className="h-14 bg-[#F5EDE4] rounded-3xl animate-pulse" />}>
      <PropertyFiltersContent {...props} />
    </Suspense>
  )
}
