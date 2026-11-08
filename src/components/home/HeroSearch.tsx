'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Building2, Home, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const POPULAR_LOCATIONS = [
  { name: 'Yogyakarta', sub: 'UGM / UNY' },
  { name: 'Bandung', sub: 'ITB / Unpad' },
  { name: 'Jakarta', sub: 'Kuningan / Tebet' },
  { name: 'Surabaya', sub: 'ITS / Unair' },
  { name: 'Malang', sub: 'UB / UM' },
  { name: 'Semarang', sub: 'UNDIP' },
]

export default function HeroSearch() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'kos' | 'kontrakan'>('all')
  const [query, setQuery] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [genderType, setGenderType] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const targetPath = activeTab === 'kos' ? '/kos' : activeTab === 'kontrakan' ? '/kontrakan' : '/kos'
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (priceMax) params.set('price', `0-${priceMax}`)
    if (genderType && activeTab !== 'kontrakan') params.set('gender', genderType)

    router.push(`${targetPath}?${params.toString()}`)
  }

  const selectCity = (cityName: string) => {
    const targetPath = activeTab === 'kontrakan' ? '/kontrakan' : '/kos'
    router.push(`${targetPath}?kota=${encodeURIComponent(cityName)}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Category Selection Tabs */}
      <div className="flex items-center justify-center gap-2.5 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all backdrop-blur-md ${
            activeTab === 'all'
              ? 'bg-white text-[#3E2723] shadow-lg scale-105 border border-[#D4BCA7]'
              : 'bg-black/20 text-[#FAF7F2] hover:bg-black/30'
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#D4BCA7]" />
          Semua Properti
        </button>

        {/* KOS: Coklat Dominan & Krem */}
        <button
          type="button"
          onClick={() => setActiveTab('kos')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all backdrop-blur-md ${
            activeTab === 'kos'
              ? 'bg-[#5D4037] text-[#FAF7F2] border-2 border-[#FAF7F2] shadow-xl scale-105'
              : 'bg-black/20 text-[#FAF7F2] hover:bg-[#5D4037]/70'
          }`}
        >
          <Building2 className="h-4 w-4 text-[#E8D8C8]" />
          Cari Kos
        </button>

        {/* KONTRAKAN: Krem Dominan & Coklat */}
        <button
          type="button"
          onClick={() => setActiveTab('kontrakan')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all backdrop-blur-md ${
            activeTab === 'kontrakan'
              ? 'bg-[#F5EDE4] text-[#4E342E] border-2 border-[#D4BCA7] shadow-xl scale-105'
              : 'bg-black/20 text-[#FAF7F2] hover:bg-[#F5EDE4]/70 hover:text-[#4E342E]'
          }`}
        >
          <Home className="h-4 w-4 text-[#5D4037]" />
          Cari Kontrakan
        </button>
      </div>

      {/* Main Search Bar Card */}
      <div className="bg-white rounded-3xl p-3 md:p-4 shadow-2xl border border-[#E8D8C8] transition-all">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Location / Keyword */}
          <div className="md:col-span-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EDE4] transition-colors border border-[#E8D8C8]">
            <MapPin className="h-5 w-5 text-[#6D4C41] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8D6E63]">
                Lokasi / Kampus / Nama
              </label>
              <input
                type="text"
                placeholder="Contoh: Pogung, Tebet, Dago, Rungkut..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#2D241E] placeholder:text-[#A98467] focus:outline-none"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EDE4] transition-colors border border-[#E8D8C8]">
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8D6E63]">
                Maksimal Budget / Bulan
              </label>
              <select
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#2D241E] focus:outline-none cursor-pointer"
              >
                <option value="">Semua Harga</option>
                <option value="1000000">&le; Rp 1 Juta</option>
                <option value="1500000">&le; Rp 1.5 Juta</option>
                <option value="2500000">&le; Rp 2.5 Juta</option>
                <option value="4000000">&le; Rp 4 Juta</option>
                <option value="10000000">&gt; Rp 4 Juta</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-3">
            <Button
              type="submit"
              variant={activeTab === 'kos' ? 'kos' : activeTab === 'kontrakan' ? 'kontrakan' : 'gradient'}
              size="lg"
              className="w-full h-14 rounded-2xl font-bold gap-2 text-sm md:text-base shadow-md"
            >
              <Search className="h-5 w-5" />
              <span>Temukan</span>
              <ArrowRight className="h-4 w-4 hidden md:inline" />
            </Button>
          </div>
        </form>

        {/* Quick Location Pills */}
        <div className="mt-3.5 pt-3 border-t border-[#F5EDE4] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-[#8D6E63] shrink-0">Kota Populer:</span>
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              type="button"
              onClick={() => selectCity(loc.name)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F5EDE4] hover:text-[#3E2723] hover:border-[#D4BCA7] border border-[#E8D8C8] text-xs font-semibold text-[#6D4C41] transition-all shrink-0"
            >
              <span>{loc.name}</span>
              <span className="text-[10px] text-[#A98467]">({loc.sub})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
