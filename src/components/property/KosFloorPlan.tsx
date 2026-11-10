'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bed, Wind, Bath, CheckCircle2, XCircle, ArrowRight, X,
  Sparkles, Utensils, Footprints, DoorOpen, Info, ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { KosRoom, DEFAULT_FLOOR1_ROOMS } from '@/lib/rooms'

interface KosFloorPlanProps {
  propertyId: string
  propertyName: string
  rooms?: KosRoom[]
  ownerPhone?: string | null
}

export default function KosFloorPlan({
  propertyId,
  propertyName,
  rooms = DEFAULT_FLOOR1_ROOMS,
  ownerPhone,
}: KosFloorPlanProps) {
  const [selectedRoom, setSelectedRoom] = useState<KosRoom | null>(null)

  const availableCount = rooms.filter((r) => r.status === 'available').length
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length

  // Map rooms by ID for quick position lookup
  const roomMap = new Map<number, KosRoom>()
  rooms.forEach((r) => roomMap.set(r.id, r))

  const r1 = roomMap.get(1) || rooms[0]
  const r2 = roomMap.get(2) || rooms[1]
  const r3 = roomMap.get(3) || rooms[2]
  const r4 = roomMap.get(4) || rooms[3]
  const r5 = roomMap.get(5) || rooms[4]
  const r6 = roomMap.get(6) || rooms[5]
  const r7 = roomMap.get(7) || rooms[6]
  const r8 = roomMap.get(8) || rooms[7]
  const r9 = roomMap.get(9) || rooms[8]
  const r10 = roomMap.get(10) || rooms[9]

  function renderRoomBox(room: KosRoom, extraClasses: string = '') {
    const isAvail = room.status === 'available'
    const isSelected = selectedRoom?.id === room.id

    return (
      <button
        type="button"
        onClick={() => setSelectedRoom(room)}
        className={`relative flex flex-col justify-between p-3.5 rounded-2xl transition-all text-left group ${extraClasses} ${
          isSelected
            ? 'ring-3 ring-[#5D4037] ring-offset-2 scale-[1.02] shadow-lg'
            : 'hover:scale-[1.01] hover:shadow-md'
        } ${
          isAvail
            ? 'bg-emerald-50/90 border-2 border-emerald-400 text-emerald-950 hover:bg-emerald-100'
            : 'bg-slate-100/90 border border-slate-300 text-slate-400 hover:bg-slate-200/80'
        }`}
      >
        {/* Top: Room Number & Status Dot */}
        <div className="flex items-center justify-between gap-1 w-full">
          <span className="font-black text-sm md:text-base tracking-tight text-[#2D241E]">
            {room.number}
          </span>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isAvail
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
            <span>{isAvail ? 'Kosong' : 'Terisi'}</span>
          </span>
        </div>

        {/* Center: Type Preview */}
        <div className="my-2">
          <p className="text-[11px] font-bold text-[#4E342E] truncate">
            {room.type}
          </p>
          <p className="text-[10px] text-[#8D6E63] font-semibold">
            {formatPrice(room.price)} / bln
          </p>
        </div>

        {/* Bottom Click Hint */}
        <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] font-bold text-[#5D4037]">
          <span>{isSelected ? '★ Terpilih' : 'Klik info'}</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border-2 border-[#D4BCA7] shadow-soft space-y-6">
      {/* Header Denah */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5EDE4]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EDE4] text-xs font-bold text-[#5D4037] border border-[#D4BCA7] mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span>Denah Interaktif &bull; Lantai 1</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#2D241E]">
            Tata Letak Kamar Kos (Lantai 1)
          </h2>
          <p className="text-xs text-[#8D6E63] mt-1">
            Klik salah satu kamar di denah bawah untuk melihat posisi, fasilitas, dan memilih kamar yang Anda inginkan.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs font-bold">
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>{availableCount} Kamar Kosong</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>{occupiedCount} Kamar Terisi</span>
          </span>
        </div>
      </div>

      {/* Blueprint Visual Canvas (Sesuai Sketsa Asli) */}
      <div className="relative bg-[#FAF7F2] rounded-3xl p-4 md:p-6 border-2 border-dashed border-[#D4BCA7] overflow-x-auto">
        <div className="min-w-[620px] max-w-4xl mx-auto space-y-4">
          {/* BARIS ATAS: Kamar 1 (Kiri) | Tangga & Dapur Bersama (Tengah) | Kamar 10 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            {/* Kamar 1 */}
            <div className="col-span-3 min-h-[120px]">
              {renderRoomBox(r1, 'h-full')}
            </div>

            {/* Area Tangga & Dapur Bersama */}
            <div className="col-span-6 grid grid-cols-2 gap-2">
              {/* Tangga ke Lantai 2 */}
              <div className="bg-[#E8D8C8]/60 border-2 border-[#D4BCA7] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-inner">
                {/* Visual Step Stripes */}
                <div className="w-16 space-y-1 mb-2">
                  <div className="h-1 bg-[#8D6E63]/40 rounded-full w-full" />
                  <div className="h-1 bg-[#8D6E63]/50 rounded-full w-4/5 mx-auto" />
                  <div className="h-1 bg-[#8D6E63]/60 rounded-full w-3/5 mx-auto" />
                  <div className="h-1 bg-[#8D6E63]/70 rounded-full w-2/5 mx-auto" />
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-[#4E342E]">
                  <Footprints className="h-3.5 w-3.5 text-[#5D4037]" />
                  <span>TANGGA</span>
                </div>
                <span className="text-[10px] font-semibold text-[#8D6E63]">Akses ke Lantai 2</span>
              </div>

              {/* Dapur Bersama */}
              <div className="bg-[#E8D8C8]/60 border-2 border-[#D4BCA7] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-inner">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] text-[#5D4037] flex items-center justify-center mb-1.5 shadow-xs">
                  <Utensils className="h-4 w-4" />
                </div>
                <span className="text-xs font-black text-[#4E342E]">DAPUR BERSAMA</span>
                <span className="text-[10px] font-semibold text-[#8D6E63]">Kompor, Wastafel, Kulkas</span>
              </div>
            </div>

            {/* Kamar 10 */}
            <div className="col-span-3 min-h-[120px]">
              {renderRoomBox(r10, 'h-full')}
            </div>
          </div>

          {/* BARIS TENGAH 1: Kamar 2 (Kiri) | Lorong Tengah | Kamar 9 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            {/* Kamar 2 */}
            <div className="col-span-3 min-h-[120px]">
              {renderRoomBox(r2, 'h-full')}
            </div>

            {/* Lorong Tengah Atas */}
            <div className="col-span-6 bg-white/60 border border-dashed border-[#D4BCA7] rounded-2xl flex items-center justify-center text-center p-2">
              <span className="text-[11px] font-bold text-[#A98467] tracking-wider uppercase">
                &bull; LORONG KORIDOR TENGAH &bull;
              </span>
            </div>

            {/* Kamar 9 */}
            <div className="col-span-3 min-h-[120px]">
              {renderRoomBox(r9, 'h-full')}
            </div>
          </div>

          {/* BARIS TENGAH 2: Kamar 3 (Kiri) | Lorong Tengah | Kamar 8 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            {/* Kamar 3 */}
            <div className="col-span-3 min-h-[120px]">
              {renderRoomBox(r3, 'h-full')}
            </div>

            {/* Lorong Tengah Bawah */}
            <div className="col-span-6 bg-white/60 border border-dashed border-[#D4BCA7] rounded-2xl flex items-center justify-center text-center p-2">
              <span className="text-[10px] font-semibold text-[#8D6E63]">
                Area Sirkulasi & Ventilasi Terbuka
              </span>
            </div>

            {/* Kamar 8 */}
            <div className="col-span-3 min-h-[120px]">
              {renderRoomBox(r8, 'h-full')}
            </div>
          </div>

          {/* BARIS BAWAH: Kamar 4 & 5 (Kiri) | PINTU MASUK (Tengah) | Kamar 6 & 7 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch pt-2 border-t-2 border-[#D4BCA7]">
            {/* Kamar 4 & 5 (Sisi Depan Kiri) */}
            <div className="col-span-5 grid grid-cols-2 gap-2 min-h-[125px]">
              {renderRoomBox(r4, 'h-full')}
              {renderRoomBox(r5, 'h-full')}
            </div>

            {/* Pintu Masuk Utama (Tengah) */}
            <div className="col-span-2 bg-[#5D4037] text-[#FAF7F2] rounded-2xl p-2 flex flex-col items-center justify-center text-center shadow-md border-2 border-[#3E2723]">
              <DoorOpen className="h-5 w-5 mb-1 text-[#E8D8C8]" />
              <span className="text-[10px] font-black tracking-wider uppercase leading-tight">
                PINTU MASUK UTAMA
              </span>
              <span className="text-[9px] text-[#D4BCA7] mt-0.5">Akses Pagar Depan</span>
            </div>

            {/* Kamar 6 & 7 (Sisi Depan Kanan) */}
            <div className="col-span-5 grid grid-cols-2 gap-2 min-h-[125px]">
              {renderRoomBox(r6, 'h-full')}
              {renderRoomBox(r7, 'h-full')}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / KARTU DETAIL KAMAR YANG DIPILIH */}
      {selectedRoom && (
        <div className="bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#5D4037] shadow-lg animate-in fade-in slide-in-from-top-2 relative">
          <button
            type="button"
            onClick={() => setSelectedRoom(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-full border border-[#D4BCA7]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Info Kamar */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#5D4037] bg-white px-3 py-1 rounded-full border border-[#D4BCA7]">
                  Unit Terpilih: {selectedRoom.number}
                </span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    selectedRoom.status === 'available'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-800'
                  }`}
                >
                  {selectedRoom.status === 'available' ? '🟢 Kamar Kosong & Siap Huni' : '🔴 Sedang Terisi Penghuni'}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-[#2D241E]">
                  {selectedRoom.number} &mdash; {selectedRoom.type}
                </h3>
                {selectedRoom.notes && (
                  <p className="text-xs text-[#6D4C41] mt-1 font-medium">
                    {selectedRoom.notes}
                  </p>
                )}
              </div>

              {/* Fasilitas Kamar */}
              <div>
                <span className="text-[11px] font-bold text-[#8D6E63] block mb-1.5">Fasilitas Termasuk:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white text-[#4E342E] px-2.5 py-1 rounded-xl border border-[#D4BCA7]"
                    >
                      <CheckCircle2 className="h-3 w-3 text-[#5D4037]" />
                      <span>{fac}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-[#D4BCA7] flex flex-col justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#8D6E63] block">Tarif Sewa Kamar:</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-[#5D4037]">
                    {formatPrice(selectedRoom.price)}
                  </span>
                  <span className="text-xs text-[#8D6E63] font-semibold">/ bulan</span>
                </div>
              </div>

              {selectedRoom.status === 'available' ? (
                <Link
                  href={`/properti/${propertyId}/booking?kamar=${encodeURIComponent(selectedRoom.number)}`}
                  className="block"
                >
                  <Button className="w-full h-11 rounded-xl font-bold text-xs bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] gap-1.5 shadow-md">
                    <span>Ajukan Booking {selectedRoom.number}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <div className="text-center py-2 px-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-500">
                  Kamar ini sedang terisi. Silakan pilih kamar berwarna hijau lainnya.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

