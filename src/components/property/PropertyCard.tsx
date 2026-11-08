'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Wifi, Wind, Bath, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getGenderTypeLabel } from '@/lib/utils'
import { PropertyWithDetails } from '@/types'
import { useState } from 'react'

interface PropertyCardProps {
  property: PropertyWithDetails
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [liked, setLiked] = useState(false)
  const isKos = property.type === 'kos'

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#E8D8C8] shadow-soft hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* Photo Frame */}
      <Link href={`/properti/${property.id}`} className="relative block h-56 w-full bg-[#FAF7F2] overflow-hidden">
        {property.primary_photo ? (
          <Image
            src={property.primary_photo}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF7F2] via-[#F5EDE4] to-[#FAF7F2]">
            <span className="text-5xl mb-2">{isKos ? '🏠' : '🏡'}</span>
            <span className="text-xs text-[#8D6E63] font-medium">Foto Belum Tersedia</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          {/* Badge Kos (Coklat-Krem) vs Kontrakan (Krem-Coklat) */}
          <Badge variant={isKos ? 'kos' : 'kontrakan'} className="backdrop-blur-md shadow-sm font-bold">
            {isKos ? '🏠 Kos' : '🏡 Kontrakan'}
          </Badge>

          {isKos && property.gender_type && property.gender_type !== 'all' && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF7F2] text-[#4E342E] shadow-sm border border-[#D4BCA7]">
              {getGenderTypeLabel(property.gender_type)}
            </span>
          )}

          {property.is_featured && (
            <Badge variant="featured" className="text-[10px] tracking-wide">
              ⭐ PILIHAN
            </Badge>
          )}
        </div>

        {/* Floating Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked(!liked)
          }}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#4E342E] backdrop-blur-md flex items-center justify-center transition-all z-10 shadow-sm active:scale-90"
        >
          <Heart className={`h-4 w-4 transition-colors ${liked ? 'fill-rose-600 text-rose-600' : 'text-[#6D4C41]'}`} />
        </button>

        {/* Bottom Image Overlay: Availability */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white z-10">
          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] backdrop-blur-md ${
            property.available_units > 0
              ? 'bg-emerald-600/90 text-white shadow-xs'
              : 'bg-rose-600/90 text-white'
          }`}>
            {property.available_units > 0 ? `Sisa ${property.available_units} Unit` : 'Penuh'}
          </span>

          <span className="text-[11px] font-medium bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
            Bebas Biaya Admin
          </span>
        </div>
      </Link>

      {/* Card Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 font-semibold text-[#6D4C41] truncate">
              <MapPin className="h-3.5 w-3.5 text-[#8D6E63] shrink-0" />
              <span className="truncate">{property.kecamatan ? `${property.kecamatan}, ` : ''}{property.kota}</span>
            </div>

            <div className="flex items-center gap-1 bg-[#F5EDE4] px-2 py-0.5 rounded-md border border-[#D4BCA7]/60 shrink-0">
              <Star className="h-3 w-3 text-amber-600 fill-amber-600" />
              <span className="font-bold text-[#4E342E] text-xs">
                {property.review_count > 0 ? Number(property.avg_rating).toFixed(1) : '4.9'}
              </span>
            </div>
          </div>

          {/* Property Title */}
          <Link href={`/properti/${property.id}`} className="block group-hover:text-[#6D4C41] transition-colors">
            <h3 className="font-bold text-[#2D241E] text-base leading-snug line-clamp-1 mb-1">
              {property.name}
            </h3>
          </Link>

          <p className="text-xs text-[#8D6E63] line-clamp-1">
            {property.address}
          </p>

          {/* Key Feature Chips */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8D8C8] text-[11px] font-semibold text-[#5D4037]">
              <Wifi className="h-3 w-3 text-[#8D6E63]" /> WiFi
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8D8C8] text-[11px] font-semibold text-[#5D4037]">
              <Wind className="h-3 w-3 text-[#8D6E63]" /> AC
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8D8C8] text-[11px] font-semibold text-[#5D4037]">
              <Bath className="h-3 w-3 text-[#8D6E63]" /> KM Dalam
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3.5 border-t border-[#F5EDE4] flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[11px] font-medium text-[#8D6E63] block leading-tight">Mulai dari</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-[#2D241E]">
                {formatPrice(property.price_per_month)}
              </span>
              <span className="text-xs text-[#8D6E63] font-medium">/bln</span>
            </div>
          </div>

          <Link href={`/properti/${property.id}`}>
            <span className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isKos
                ? 'bg-[#5D4037] text-[#FAF7F2] hover:bg-[#3E2723]'
                : 'bg-[#F5EDE4] text-[#4E342E] border border-[#D4BCA7] hover:bg-[#E8D8C8]'
            }`}>
              Detail
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
