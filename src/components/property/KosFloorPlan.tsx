'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bed, Wind, Bath, CheckCircle2, XCircle, ArrowRight, X,
  Sparkles, Utensils, Footprints, DoorOpen, Info, ShieldCheck,
  MessageCircle, Camera, ChevronLeft, ChevronRight
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
  propertyId = 'kos-vilano-pandan',
  propertyName,
  rooms: initialRooms = DEFAULT_FLOOR1_ROOMS,
  ownerPhone = '08127951435',
}: KosFloorPlanProps) {
  const [rooms, setRooms] = useState<KosRoom[]>(initialRooms)
  const [selectedRoom, setSelectedRoom] = useState<KosRoom | null>(null)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  // Reset indeks foto saat ganti kamar
  useEffect(() => {
    setActivePhotoIndex(0)
  }, [selectedRoom?.id])

  // Sinkronisasi Real-Time (BroadcastChannel + LocalStorage + Server Polling)
  useEffect(() => {
    // 1. Ambil dari cache lokal awal jika ada
    try {
      const cached = localStorage.getItem('vilano_rooms_' + propertyId)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRooms(parsed)
        }
      }
    } catch {}

    // 2. Fetch data terkini dari server
    async function fetchLatest() {
      try {
        const res = await fetch(`/api/rooms?propertyId=${encodeURIComponent(propertyId)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.rooms && Array.isArray(data.rooms)) {
            setRooms(data.rooms)
          }
        }
      } catch {}
    }
    fetchLatest()

    // 3. BroadcastChannel untuk instan 0ms update saat admin ubah status di tab lain
    let channel: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('vilano_rooms_sync')
        channel.onmessage = (event) => {
          if (event.data?.rooms && (!event.data.propertyId || event.data.propertyId === propertyId)) {
            setRooms(event.data.rooms)
          }
        }
      } catch {}
    }

    // 4. Storage event untuk cross-window sync
    function handleStorage(e: StorageEvent) {
      if (e.key === 'vilano_rooms_' + propertyId && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) setRooms(parsed)
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)

    // 5. Polling server setiap 3 detik untuk sinkronisasi antar-perangkat (device berbeda)
    const interval = setInterval(fetchLatest, 3000)

    return () => {
      if (channel) channel.close()
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [propertyId])

  // Update detail kamar pop-up secara real-time jika kamar yang sedang dibuka datanya diubah oleh admin
  useEffect(() => {
    if (selectedRoom) {
      const updated = rooms.find((r) => r.id === selectedRoom.id)
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedRoom)) {
        setSelectedRoom(updated)
      }
    }
  }, [rooms, selectedRoom])

  // Kunci scroll halaman (html & body) saat pop up terbuka & tutup jika tekan tombol Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedRoom(null)
      }
    }
    if (selectedRoom) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedRoom])

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
      <div
        role="button"
        tabIndex={0}
        onClick={() => setSelectedRoom(room)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setSelectedRoom(room)
          }
        }}
        className={`relative flex flex-col justify-between p-3.5 rounded-2xl transition-all text-left group cursor-pointer select-none ${extraClasses} ${
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
        <div className="my-2 flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-[#4E342E] truncate">
              {room.type}
            </p>
            <p className="text-[10px] text-[#8D6E63] font-semibold">
              {formatPrice(room.price)} / bln
            </p>
          </div>
          {room.photoUrl && (
            <span className="text-[10px] bg-white text-[#5D4037] px-1.5 py-0.5 rounded-md border border-[#D4BCA7] shrink-0 font-bold flex items-center gap-0.5 shadow-2xs" title="Ada Foto Kamar">
              📷
            </span>
          )}
        </div>

        {/* Bottom Click Hint */}
        <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] font-bold text-[#5D4037]">
          <span className="inline-flex items-center gap-1 bg-white/90 group-hover:bg-[#5D4037] group-hover:text-[#FAF7F2] px-2 py-0.5 rounded-lg border border-black/10 transition-colors shadow-2xs">
            <Info className="h-3 w-3" />
            <span>Klik info</span>
          </span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform text-[#5D4037]" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border-2 border-[#D4BCA7] shadow-soft space-y-6" suppressHydrationWarning>
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

      {/* POP-UP MODAL INFO KAMAR (DIALOG OVERLAY) */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm p-3 sm:p-4 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRoom(null)
          }}
        >
          <div
            className="bg-[#FAF7F2] rounded-3xl p-5 md:p-6 border-2 border-[#5D4037] shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Tombol Tutup Silang (X) */}
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-[#8D6E63] hover:text-[#2D241E] bg-white p-2 rounded-full border border-[#D4BCA7] shadow-xs hover:bg-[#F5EDE4] transition-all cursor-pointer"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Pop Up */}
            <div className="space-y-2 pb-3 border-b border-[#E8D8C8] pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#FAF7F2] bg-[#5D4037] px-3 py-1 rounded-full border border-[#3E2723]">
                  {selectedRoom.number} &bull; Lantai 1
                </span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    selectedRoom.status === 'available'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-300 text-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedRoom.status === 'available' ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
                  <span>{selectedRoom.status === 'available' ? 'Kamar Kosong & Siap Huni' : 'Sedang Terisi'}</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-[#2D241E]">
                  {selectedRoom.number} &mdash; {selectedRoom.type}
                </h3>
                {selectedRoom.notes && (
                  <p className="text-xs text-[#6D4C41] mt-1 font-medium bg-white/80 p-2 rounded-xl border border-[#D4BCA7]">
                    📍 <span className="font-semibold">{selectedRoom.notes}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Galeri Foto Kamar Asli (Bisa Banyak Foto dengan Slider & Thumbnail) */}
            {(() => {
              const roomPhotos = selectedRoom.photos && selectedRoom.photos.length > 0
                ? selectedRoom.photos
                : (selectedRoom.photoUrl ? [selectedRoom.photoUrl] : [])

              if (roomPhotos.length === 0) return null

              const safeIndex = activePhotoIndex < roomPhotos.length ? activePhotoIndex : 0

              return (
                <div className="my-3 space-y-2">
                  <div className="relative w-full aspect-video max-h-60 rounded-2xl overflow-hidden border-2 border-[#D4BCA7] shadow-sm group bg-[#E8D8C8]/40">
                    <img
                      src={roomPhotos[safeIndex]}
                      alt={`${selectedRoom.number} - Foto ${safeIndex + 1}`}
                      className="w-full h-full object-cover transition-all duration-300"
                    />

                    {/* Badge Counter */}
                    <div className="absolute top-2.5 left-2.5 bg-[#3E2723]/80 backdrop-blur-md text-[#FAF7F2] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
                      <Camera className="h-3 w-3" />
                      <span>
                        {roomPhotos.length > 1
                          ? `Foto ${safeIndex + 1} dari ${roomPhotos.length}`
                          : 'Foto Asli Kamar'}
                      </span>
                    </div>

                    {/* Navigasi Panah Kiri/Kanan jika foto > 1 */}
                    {roomPhotos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : roomPhotos.length - 1))
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 text-white p-1.5 rounded-full transition-all cursor-pointer shadow-md"
                          aria-label="Foto sebelumnya"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActivePhotoIndex((prev) => (prev < roomPhotos.length - 1 ? prev + 1 : 0))
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 text-white p-1.5 rounded-full transition-all cursor-pointer shadow-md"
                          aria-label="Foto berikutnya"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row jika foto > 1 */}
                  {roomPhotos.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 px-0.5">
                      {roomPhotos.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhotoIndex(idx)}
                          className={`relative w-14 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer shadow-2xs ${
                            safeIndex === idx
                              ? 'border-[#5D4037] ring-2 ring-[#5D4037]/40 scale-105'
                              : 'border-[#D4BCA7] opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Spesifikasi & Fasilitas Kamar */}
            <div className="py-3 space-y-3">
              <div>
                <span className="text-[11px] font-black text-[#4E342E] uppercase tracking-wider block mb-1.5">
                  Fasilitas Dalam Kamar:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedRoom.facilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-white text-[#4E342E] px-2.5 py-1.5 rounded-xl border border-[#D4BCA7] shadow-2xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas Bersama */}
              <div className="bg-[#F5EDE4] p-2.5 rounded-xl border border-[#D4BCA7] text-[11px] text-[#5D4037]">
                <span className="font-bold">Fasilitas Bersama di Lantai 1: </span>
                <span className="text-[#6D4C41]">
                  Dapur Bersama, tangga lantai 2, koridor sirkulasi udara sejuk, parkir motor, air PDAM.
                </span>
              </div>

              {/* Tarif Sewa Bulanan */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#D4BCA7] flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold text-[#8D6E63] block uppercase tracking-wider">Tarif Sewa Kamar:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl md:text-2xl font-black text-[#5D4037]">
                      {formatPrice(selectedRoom.price)}
                    </span>
                    <span className="text-xs text-[#8D6E63] font-semibold">/ bulan</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#A98467] font-semibold block">Tanpa Biaya Calo</span>
                  <span className="text-xs font-bold text-emerald-700">Langsung Pemilik</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              {selectedRoom.status === 'available' ? (
                <>
                  <Link
                    href={`/properti/${propertyId}?kamar=${encodeURIComponent(selectedRoom.number)}`}
                    className="flex-1"
                    onClick={() => setSelectedRoom(null)}
                  >
                    <Button className="w-full h-11 rounded-xl font-bold text-xs md:text-sm bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] gap-2 shadow-md">
                      <span>Info Detail Kamar</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <a
                    href={`https://wa.me/628127951435?text=${encodeURIComponent(`Halo Pemilik Vilano, saya tertarik tanya ketersediaan dan survey ${selectedRoom.number} (${selectedRoom.type}) di Kos Pandan Kota Solok.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shrink-0"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Tanya WA</span>
                  </a>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <div className="text-center py-2 px-3 bg-slate-200/90 rounded-xl text-xs font-bold text-slate-700">
                    Kamar ini sedang terisi penghuni. Silakan pilih kamar berwarna hijau lainnya di denah.
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/properti/${propertyId}?kamar=${encodeURIComponent(selectedRoom.number)}`}
                      className="flex-1"
                      onClick={() => setSelectedRoom(null)}
                    >
                      <Button className="w-full h-11 rounded-xl font-bold text-xs bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] gap-2 shadow-md">
                        <span>Info Detail Kamar</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a
                      href={`https://wa.me/628127951435?text=${encodeURIComponent(`Halo Pemilik Vilano, saya ingin tanya perkiraan tanggal kosong untuk ${selectedRoom.number} di Kos Pandan Kota Solok.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shrink-0"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Tanya WA</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

