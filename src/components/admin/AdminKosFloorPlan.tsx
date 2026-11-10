'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle2, XCircle, Footprints, Utensils, DoorOpen,
  Sparkles, Save, Edit3, X, Check, RefreshCw, Plus, Trash2,
  Camera, Image as ImageIcon, UploadCloud, Loader2, Pencil, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'
import { KosRoom, DEFAULT_FLOOR1_ROOMS } from '@/lib/rooms'
import { createClient } from '@/lib/supabase/client'

interface AdminKosFloorPlanProps {
  propertyId?: string
  initialRooms?: KosRoom[]
  onChange?: (updatedRooms: KosRoom[]) => void
  readOnly?: boolean
}

export default function AdminKosFloorPlan({
  propertyId = 'kos-vilano-pandan',
  initialRooms = DEFAULT_FLOOR1_ROOMS,
  onChange,
  readOnly = false,
}: AdminKosFloorPlanProps) {
  const [rooms, setRooms] = useState<KosRoom[]>(initialRooms)
  const [editingRoom, setEditingRoom] = useState<KosRoom | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)
  const [newFacilityInput, setNewFacilityInput] = useState('')
  const [uploadingRoomPhoto, setUploadingRoomPhoto] = useState(false)
  const [photoUrlInput, setPhotoUrlInput] = useState('')

  // Handle upload foto kamar (Supabase Storage dengan fallback Base64)
  async function handleRoomPhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingRoom) return

    setUploadingRoomPhoto(true)
    try {
      // 1. Coba upload ke Supabase Storage
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `rooms/${editingRoom.id}-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('property-photos')
        .upload(filename, file, { upsert: true })

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('property-photos')
          .getPublicUrl(data.path)

        if (urlData?.publicUrl) {
          setEditingRoom({ ...editingRoom, photoUrl: urlData.publicUrl })
          setUploadingRoomPhoto(false)
          return
        }
      }
    } catch {
      // Abaikan jika storage belum siap
    }

    // 2. Fallback Base64 (bekerja 100% offline & instan)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingRoom({ ...editingRoom, photoUrl: reader.result })
      }
      setUploadingRoomPhoto(false)
    }
    reader.onerror = () => setUploadingRoomPhoto(false)
    reader.readAsDataURL(file)
  }

  // Kunci scroll background saat modal edit terbuka
  useEffect(() => {
    if (editingRoom) {
      const originalOverflow = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [editingRoom])

  // Preset fasilitas umum kos
  const COMMON_FACILITIES = [
    'AC Dingin',
    'Kamar Mandi Dalam',
    'Kamar Mandi Luar',
    'Kasur & Bantal',
    'Lemari Pakaian',
    'Meja Belajar',
    'WiFi Cepat',
    'Water Heater',
    'Kulkas Mini',
    'Smart TV',
    'Kipas Angin',
    'Ventilasi Jendela Luar',
  ]

  function handleAddFacility(facilityName: string) {
    if (!editingRoom) return
    const name = facilityName.trim()
    if (!name) return

    const current = editingRoom.facilities || []
    if (current.some((f) => f.toLowerCase() === name.toLowerCase())) {
      setNewFacilityInput('')
      return
    }

    setEditingRoom({
      ...editingRoom,
      facilities: [...current, name],
    })
    setNewFacilityInput('')
  }

  function handleRemoveFacility(indexToRemove: number) {
    if (!editingRoom) return
    const current = editingRoom.facilities || []
    setEditingRoom({
      ...editingRoom,
      facilities: current.filter((_, idx) => idx !== indexToRemove),
    })
  }

  function handleUpdateFacility(index: number, newName: string) {
    if (!editingRoom) return
    const current = [...(editingRoom.facilities || [])]
    current[index] = newName
    setEditingRoom({
      ...editingRoom,
      facilities: current,
    })
  }

  const availableCount = rooms.filter((r) => r.status === 'available').length
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length

  // Map rooms by ID for layout placement
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

  // Toggle room status between available and occupied
  async function handleToggleStatus(roomId: number, e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    const updated = rooms.map((r) => {
      if (r.id === roomId) {
        return {
          ...r,
          status: (r.status === 'available' ? 'occupied' : 'available') as 'available' | 'occupied',
        }
      }
      return r
    })

    setRooms(updated)
    if (onChange) onChange(updated)
    await persistRooms(updated)
  }

  // Save room edit form
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingRoom) return

    const updated = rooms.map((r) => (r.id === editingRoom.id ? editingRoom : r))
    setRooms(updated)
    if (onChange) onChange(updated)
    setEditingRoom(null)
    await persistRooms(updated)
  }

  // Ambil state terbaru dari server saat mount
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch(`/api/rooms?propertyId=${encodeURIComponent(propertyId)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.rooms && Array.isArray(data.rooms)) {
            setRooms(data.rooms)
            if (onChange) onChange(data.rooms)
          }
        }
      } catch {}
    }
    fetchLatest()
  }, [propertyId])

  // Broadcast perubahan secara instan (0ms delay) ke seluruh tab & web penyewa
  function broadcastRooms(updatedRooms: KosRoom[]) {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('vilano_rooms_sync')
        channel.postMessage({ type: 'ROOMS_UPDATED', propertyId, rooms: updatedRooms })
        channel.close()
      } catch {}
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vilano_rooms_' + propertyId, JSON.stringify(updatedRooms))
      } catch {}
    }
  }

  // Persist to server if propertyId exists
  async function persistRooms(updatedRooms: KosRoom[]) {
    // 1. Broadcast langsung tanpa delay
    broadcastRooms(updatedRooms)

    if (!propertyId || readOnly) return
    setSaving(true)
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, rooms: updatedRooms }),
      })
      if (res.ok) {
        setSaveNotice('Status tata letak berhasil disimpan & live real-time!')
        setTimeout(() => setSaveNotice(null), 3000)
      }
    } catch {
      // Fallback
    } finally {
      setSaving(false)
    }
  }

  function renderRoomBox(room: KosRoom, extraClasses: string = '') {
    const isAvail = room.status === 'available'

    return (
      <div
        onClick={() => !readOnly && setEditingRoom(room)}
        className={`relative flex flex-col justify-between p-3.5 rounded-2xl transition-all cursor-pointer border-2 ${extraClasses} ${
          isAvail
            ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 hover:bg-emerald-100 shadow-2xs'
            : 'bg-slate-100/90 border-slate-300 text-slate-500 hover:bg-slate-200/80 shadow-2xs'
        }`}
      >
        {/* Top: Room Number & Status */}
        <div className="flex items-center justify-between gap-1 w-full">
          <span className="font-black text-sm md:text-base tracking-tight text-[#2D241E]">
            {room.number}
          </span>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isAvail
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-300 text-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-white' : 'bg-slate-600'}`} />
            <span>{isAvail ? 'Kosong' : 'Terisi'}</span>
          </span>
        </div>

        {/* Center: Info */}
        <div className="my-1.5 flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-[#4E342E] truncate">
              {room.type}
            </p>
            <p className="text-[10px] text-[#8D6E63] font-semibold">
              {formatPrice(room.price)} / bln
            </p>
          </div>
          {room.photoUrl && (
            <span className="text-[10px] bg-[#FAF7F2] text-[#5D4037] px-1.5 py-0.5 rounded-md border border-[#D4BCA7] shrink-0 font-bold flex items-center gap-0.5 shadow-2xs" title="Ada Foto Kamar">
              📷
            </span>
          )}
        </div>

        {/* Bottom Quick Toggle Action */}
        {!readOnly && (
          <div className="pt-1.5 border-t border-black/5 flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={(e) => handleToggleStatus(room.id, e)}
              className={`w-full py-1 px-2 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
                isAvail
                  ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
              }`}
              title={isAvail ? 'Klik untuk tandai terisi' : 'Klik untuk tandai kosong'}
            >
              {isAvail ? (
                <>
                  <XCircle className="h-3 w-3" />
                  <span>Set Terisi</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Set Kosong</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 1. TABEL DAFTAR KAMAR KOS (LANTAI 1) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EDE4] text-xs font-bold text-[#5D4037] border border-[#D4BCA7] mb-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#8D6E63]" />
              <span>Unit Kamar Kos &bull; Lantai 1</span>
            </div>
            <h2 className="text-base md:text-lg font-black text-[#2D241E]">
              Daftar Kamar Kos (Lantai 1)
            </h2>
            <p className="text-xs text-[#8D6E63]">
              Kelola status ketersediaan, fasilitas, tarif sewa, dan foto masing-masing kamar kos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold self-start sm:self-auto">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{availableCount} Kosong</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>{occupiedCount} Terisi</span>
            </span>
            <span className="bg-[#FAF7F2] text-[#5D4037] border border-[#D4BCA7] px-3 py-1.5 rounded-xl font-black">
              Total {rooms.length} Kamar
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-4">Kamar</th>
                <th className="px-4 py-4">Tipe Kamar</th>
                <th className="px-4 py-4">Fasilitas Dalam Kamar</th>
                <th className="px-4 py-4">Tarif Sewa</th>
                <th className="px-4 py-4">Status Ketersediaan</th>
                <th className="px-5 py-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rooms.map((room) => {
                const isAvail = room.status === 'available'
                return (
                  <tr key={room.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {room.photoUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#D4BCA7] bg-[#FAF7F2] shrink-0 shadow-2xs">
                            <img
                              src={room.photoUrl}
                              alt={room.number}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl border border-dashed border-[#D4BCA7] bg-[#FAF7F2] flex items-center justify-center text-[#8D6E63] shrink-0">
                            <Camera className="h-5 w-5 opacity-60" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-sm">{room.number}</p>
                          {room.notes && (
                            <p className="text-[11px] text-slate-500 truncate max-w-xs" title={room.notes}>
                              📍 {room.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-xs font-bold text-[#4E342E] bg-[#FAF7F2] border border-[#D4BCA7] px-2.5 py-1 rounded-lg">
                        {room.type}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {room.facilities?.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {f}
                          </span>
                        ))}
                        {room.facilities && room.facilities.length > 3 && (
                          <span className="text-[10px] font-bold text-[#8D6E63] bg-[#F5EDE4] px-1.5 py-0.5 rounded-md">
                            +{room.facilities.length - 3} lagi
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-black text-slate-900 text-xs sm:text-sm">
                      {formatPrice(room.price)}
                      <span className="text-[10px] text-slate-400 font-normal block">/ bulan</span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(room.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                          isAvail
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300'
                        }`}
                        title="Klik untuk ubah status kamar"
                      >
                        <span className={`w-2 h-2 rounded-full ${isAvail ? 'bg-emerald-600 animate-pulse' : 'bg-slate-600'}`} />
                        <span>{isAvail ? 'Kosong & Siap Huni' : 'Sedang Terisi'}</span>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        type="button"
                        onClick={() => setEditingRoom(room)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-[#D4BCA7] hover:bg-[#F5EDE4] text-[#5D4037] font-bold text-xs gap-1.5 shadow-2xs cursor-pointer h-9 px-3"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit Kamar</span>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. DENAH TATA LETAK KAMAR KOS (VISUAL BLUEPRINT) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#D4BCA7] shadow-soft space-y-6">
      {/* Header Denah Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5EDE4]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EDE4] text-xs font-bold text-[#5D4037] border border-[#D4BCA7] mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span>Tata Letak &bull; Denah Lantai 1 Kos</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#2D241E]">
            Kelola Status Kamar (Denah Lantai 1)
          </h2>
          <p className="text-xs text-[#8D6E63] mt-1">
            Klik tombol &quot;Set Terisi&quot; atau &quot;Set Kosong&quot; pada kamar untuk mengubah ketersediaan unit secara instan.
          </p>
        </div>

        {/* Counter & Status */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs font-bold">
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>{availableCount} Kamar Kosong</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>{occupiedCount} Kamar Terisi</span>
          </span>
          {saving && (
            <span className="flex items-center gap-1 text-[11px] text-[#5D4037] font-semibold animate-pulse">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </span>
          )}
          {saveNotice && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-bold">
              ✓ {saveNotice}
            </span>
          )}
        </div>
      </div>

      {/* Blueprint Visual Canvas (Sesuai Sketsa Asli) */}
      <div className="relative bg-[#FAF7F2] rounded-3xl p-4 md:p-6 border-2 border-dashed border-[#D4BCA7] overflow-x-auto">
        <div className="min-w-[620px] max-w-4xl mx-auto space-y-4">
          {/* BARIS ATAS: Kamar 1 (Kiri) | Tangga & Dapur Bersama (Tengah) | Kamar 10 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            {/* Kamar 1 */}
            <div className="col-span-3 min-h-[125px]">
              {renderRoomBox(r1, 'h-full')}
            </div>

            {/* Tangga & Dapur Bersama */}
            <div className="col-span-6 grid grid-cols-2 gap-2">
              <div className="bg-[#E8D8C8]/60 border-2 border-[#D4BCA7] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-inner">
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

              <div className="bg-[#E8D8C8]/60 border-2 border-[#D4BCA7] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-inner">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] text-[#5D4037] flex items-center justify-center mb-1.5 shadow-xs">
                  <Utensils className="h-4 w-4" />
                </div>
                <span className="text-xs font-black text-[#4E342E]">DAPUR BERSAMA</span>
                <span className="text-[10px] font-semibold text-[#8D6E63]">Kompor, Wastafel</span>
              </div>
            </div>

            {/* Kamar 10 */}
            <div className="col-span-3 min-h-[125px]">
              {renderRoomBox(r10, 'h-full')}
            </div>
          </div>

          {/* BARIS TENGAH 1: Kamar 2 (Kiri) | Lorong Tengah | Kamar 9 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            <div className="col-span-3 min-h-[125px]">
              {renderRoomBox(r2, 'h-full')}
            </div>
            <div className="col-span-6 bg-white/60 border border-dashed border-[#D4BCA7] rounded-2xl flex items-center justify-center text-center p-2">
              <span className="text-[11px] font-bold text-[#A98467] tracking-wider uppercase">
                &bull; LORONG KORIDOR TENGAH &bull;
              </span>
            </div>
            <div className="col-span-3 min-h-[125px]">
              {renderRoomBox(r9, 'h-full')}
            </div>
          </div>

          {/* BARIS TENGAH 2: Kamar 3 (Kiri) | Lorong Tengah | Kamar 8 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            <div className="col-span-3 min-h-[125px]">
              {renderRoomBox(r3, 'h-full')}
            </div>
            <div className="col-span-6 bg-white/60 border border-dashed border-[#D4BCA7] rounded-2xl flex items-center justify-center text-center p-2">
              <span className="text-[10px] font-semibold text-[#8D6E63]">
                Area Sirkulasi & Ventilasi Alami
              </span>
            </div>
            <div className="col-span-3 min-h-[125px]">
              {renderRoomBox(r8, 'h-full')}
            </div>
          </div>

          {/* BARIS BAWAH: Kamar 4 & 5 (Kiri) | PINTU MASUK (Tengah) | Kamar 6 & 7 (Kanan) */}
          <div className="grid grid-cols-12 gap-3 items-stretch pt-2 border-t-2 border-[#D4BCA7]">
            <div className="col-span-5 grid grid-cols-2 gap-2 min-h-[125px]">
              {renderRoomBox(r4, 'h-full')}
              {renderRoomBox(r5, 'h-full')}
            </div>

            <div className="col-span-2 bg-[#5D4037] text-[#FAF7F2] rounded-2xl p-2 flex flex-col items-center justify-center text-center shadow-md border-2 border-[#3E2723]">
              <DoorOpen className="h-5 w-5 mb-1 text-[#E8D8C8]" />
              <span className="text-[10px] font-black tracking-wider uppercase leading-tight">
                PINTU MASUK UTAMA
              </span>
              <span className="text-[9px] text-[#D4BCA7] mt-0.5">Akses Pagar Depan</span>
            </div>

            <div className="col-span-5 grid grid-cols-2 gap-2 min-h-[125px]">
              {renderRoomBox(r6, 'h-full')}
              {renderRoomBox(r7, 'h-full')}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* MODAL EDIT DETAIL KAMAR (JIKA INGIN UBAH TARIF / FASILITAS / TIPE) */}
      {editingRoom && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex min-h-screen items-center justify-center animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingRoom(null)
          }}
        >
          <div className="bg-[#FAF7F2] rounded-3xl p-6 md:p-7 border-2 border-[#5D4037] shadow-2xl w-full max-w-lg relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingRoom(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full border border-[#D4BCA7] shadow-xs cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-xl font-black text-[#2D241E] mb-1">
              Edit {editingRoom.number}
            </h3>
            <p className="text-xs text-[#8D6E63] mb-4">
              Ubah status ketersediaan, daftar fasilitas kamar, tipe kamar, atau tarif sewa bulanan.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-[#4E342E]">Status Kamar</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditingRoom({ ...editingRoom, status: 'available' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      editingRoom.status === 'available'
                        ? 'border-emerald-600 bg-emerald-100 text-emerald-900 shadow-xs'
                        : 'border-[#D4BCA7] bg-white text-[#6D4C41]'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>🟢 Kosong</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingRoom({ ...editingRoom, status: 'occupied' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      editingRoom.status === 'occupied'
                        ? 'border-slate-500 bg-slate-200 text-slate-900 shadow-xs'
                        : 'border-[#D4BCA7] bg-white text-[#6D4C41]'
                    }`}
                  >
                    <XCircle className="h-4 w-4 text-slate-600" />
                    <span>🔴 Terisi</span>
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#4E342E]">Tipe & Fasilitas Utama</Label>
                <Input
                  className="mt-1 h-11 rounded-xl bg-white border-[#D4BCA7] text-xs font-semibold"
                  value={editingRoom.type}
                  onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })}
                  placeholder="Kamar Mandi Dalam / AC / Standar"
                />
              </div>

              {/* FOTO KAMAR INI */}
              <div className="bg-white p-4 rounded-2xl border border-[#D4BCA7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-[#5D4037]" />
                    <Label className="text-xs font-black text-[#4E342E] uppercase tracking-wide">
                      Foto Kamar Ini
                    </Label>
                  </div>
                  {editingRoom.photoUrl ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                      ✓ Foto Terpasang
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8D6E63]">
                      Opsional
                    </span>
                  )}
                </div>

                {/* Preview Foto */}
                {editingRoom.photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4BCA7] bg-[#FAF7F2] aspect-video group shadow-inner">
                    <img
                      src={editingRoom.photoUrl}
                      alt={editingRoom.number}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingRoom({ ...editingRoom, photoUrl: '' })}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus Foto</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#D4BCA7] rounded-2xl p-3.5 text-center bg-[#FAF7F2]">
                    <ImageIcon className="h-7 w-7 text-[#A98467] mx-auto mb-1 opacity-70" />
                    <p className="text-xs font-bold text-[#4E342E]">Belum ada foto kamar</p>
                    <p className="text-[10px] text-[#8D6E63] mt-0.5">Unggah foto agar penyewa bisa melihat kondisi asli kamar.</p>
                  </div>
                )}

                {/* Tombol Unggah File & Input URL */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-[#D4BCA7] bg-[#FAF7F2] hover:bg-[#F5EDE4] text-[#4E342E] text-xs font-bold cursor-pointer transition-all shadow-2xs">
                    {uploadingRoomPhoto ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#6D4C41]" />
                        <span>Memproses Foto...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4 text-[#6D4C41]" />
                        <span>{editingRoom.photoUrl ? 'Ganti Foto dari File (JPG/PNG)' : 'Unggah Foto dari File (JPG/PNG)'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingRoomPhoto}
                      onChange={handleRoomPhotoFileChange}
                    />
                  </label>

                  <div className="flex gap-2">
                    <Input
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="Atau tempel Link / URL Gambar (https://...)"
                      className="h-9 text-xs bg-[#FAF7F2] border-[#D4BCA7] rounded-xl font-medium"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (photoUrlInput.trim()) {
                          setEditingRoom({ ...editingRoom, photoUrl: photoUrlInput.trim() })
                          setPhotoUrlInput('')
                        }
                      }}
                      className="h-9 px-3 text-xs font-bold bg-[#5D4037] hover:bg-[#4E342E] text-white rounded-xl shrink-0 cursor-pointer"
                    >
                      Terapkan
                    </Button>
                  </div>
                </div>
              </div>

              {/* FASILITAS KAMAR (BISA DI-EDIT LANGSUNG, DITAMBAH, ATAU DIHAPUS) */}
              <div className="bg-white p-4 rounded-2xl border border-[#D4BCA7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-black text-[#4E342E] uppercase tracking-wide">
                      Fasilitas Kamar Ini
                    </Label>
                    <span className="text-[11px] font-bold bg-[#F5EDE4] text-[#5D4037] px-2 py-0.5 rounded-full border border-[#D4BCA7]">
                      {editingRoom.facilities?.length || 0} Fasilitas
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8D6E63]">
                    Bisa diedit / ditambah / dihapus
                  </span>
                </div>

                {/* List Fasilitas Kamar */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(!editingRoom.facilities || editingRoom.facilities.length === 0) ? (
                    <div className="p-3 bg-[#FAF7F2] rounded-xl text-center text-xs text-[#8D6E63] border border-dashed border-[#D4BCA7]">
                      Belum ada fasilitas di kamar ini. Silakan tambah di bawah.
                    </div>
                  ) : (
                    editingRoom.facilities.map((fac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 pl-2.5 rounded-xl border border-[#E8D8C8] hover:border-[#D4BCA7] transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={fac}
                          onChange={(e) => handleUpdateFacility(idx, e.target.value)}
                          className="flex-1 bg-transparent text-xs font-semibold text-[#2D241E] focus:outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded-md transition-all"
                          placeholder="Nama fasilitas..."
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(idx)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Hapus fasilitas ini"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Tambah Fasilitas Baru */}
                <div className="pt-2 border-t border-[#F5EDE4]">
                  <Label className="text-[11px] font-bold text-[#6D4C41] block mb-1.5">
                    + Tambah Fasilitas Baru:
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFacilityInput}
                      onChange={(e) => setNewFacilityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddFacility(newFacilityInput)
                        }
                      }}
                      placeholder="Ketik fasilitas baru (cth: Balkon Pribadi)..."
                      className="h-9 text-xs bg-[#FAF7F2] border-[#D4BCA7] rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddFacility(newFacilityInput)}
                      className="h-9 px-3 text-xs font-bold bg-[#5D4037] hover:bg-[#4E342E] text-white rounded-xl gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah</span>
                    </Button>
                  </div>
                </div>

                {/* Pilihan Cepat / Preset Fasilitas Umum */}
                <div>
                  <span className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wider block mb-1.5">
                    Pilihan Cepat (Klik untuk menambah):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_FACILITIES.filter(
                      (preset) => !editingRoom.facilities?.some((f) => f.toLowerCase() === preset.toLowerCase())
                    ).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddFacility(preset)}
                        className="text-[11px] font-medium bg-[#FAF7F2] hover:bg-[#5D4037] text-[#5D4037] hover:text-white px-2.5 py-1 rounded-lg border border-[#D4BCA7] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>{preset}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#4E342E]">Tarif Sewa (Rp / Bulan)</Label>
                <Input
                  type="number"
                  className="mt-1 h-11 rounded-xl bg-white border-[#D4BCA7] text-xs font-semibold"
                  value={editingRoom.price}
                  onChange={(e) => setEditingRoom({ ...editingRoom, price: Number(e.target.value) })}
                  placeholder="550000"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#4E342E]">Catatan Posisi / Lokasi</Label>
                <Input
                  className="mt-1 h-11 rounded-xl bg-white border-[#D4BCA7] text-xs font-semibold"
                  value={editingRoom.notes || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, notes: e.target.value })}
                  placeholder="Sisi depan dekat pintu masuk"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] font-bold text-xs gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRoom(null)}
                  className="h-11 rounded-xl border-[#D4BCA7] text-xs font-bold cursor-pointer"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

