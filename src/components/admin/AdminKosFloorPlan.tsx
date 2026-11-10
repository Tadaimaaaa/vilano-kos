'use client'

import { useState } from 'react'
import {
  CheckCircle2, XCircle, Footprints, Utensils, DoorOpen,
  Sparkles, Save, Edit3, X, Check, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'
import { KosRoom, DEFAULT_FLOOR1_ROOMS } from '@/lib/rooms'

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

  // Persist to server if propertyId exists
  async function persistRooms(updatedRooms: KosRoom[]) {
    if (!propertyId || readOnly) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rooms: updatedRooms }),
      })
      if (res.ok) {
        setSaveNotice('Status tata letak berhasil disimpan!')
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
        <div className="my-1.5">
          <p className="text-[11px] font-bold text-[#4E342E] truncate">
            {room.type}
          </p>
          <p className="text-[10px] text-[#8D6E63] font-semibold">
            {formatPrice(room.price)} / bln
          </p>
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

      {/* MODAL EDIT DETAIL KAMAR (JIKA INGIN UBAH TARIF / TIPE) */}
      {editingRoom && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex min-h-screen items-center justify-center animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingRoom(null)
          }}
        >
          <div className="bg-[#FAF7F2] rounded-3xl p-6 md:p-8 border-2 border-[#5D4037] shadow-2xl w-full max-w-md relative my-auto">
            <button
              type="button"
              onClick={() => setEditingRoom(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full border border-[#D4BCA7]"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-xl font-black text-[#2D241E] mb-1">
              Edit {editingRoom.number}
            </h3>
            <p className="text-xs text-[#8D6E63] mb-4">
              Ubah status ketersediaan, tipe kamar, atau tarif sewa bulanan.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-[#4E342E]">Status Kamar</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditingRoom({ ...editingRoom, status: 'available' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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
                  className="flex-1 h-11 rounded-xl bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] font-bold text-xs gap-1.5 shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRoom(null)}
                  className="h-11 rounded-xl border-[#D4BCA7] text-xs font-bold"
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
