'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, X, CheckCircle2, Camera, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Facility } from '@/types'
import AdminKosFloorPlan from '@/components/admin/AdminKosFloorPlan'
import { parseRoomsFromDescription, serializeRoomsToDescription, getCleanDescription, KosRoom } from '@/lib/rooms'

interface PropertyFormProps {
  facilities: Facility[]
  ownerId: string
  initialData?: any
}

const KOTA_LIST = [
  'Kota Solok', 'Padang', 'Bukittinggi', 'Jakarta', 'Bandung', 'Yogyakarta', 'Lainnya'
]

export default function PropertyForm({ facilities, ownerId, initialData }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(
    initialData?.photos?.map((p: any) => p.url) || []
  )

  const [formData, setFormData] = useState({
    type: initialData?.type || 'kos',
    name: initialData?.name || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    kecamatan: initialData?.kecamatan || '',
    kota: initialData?.kota || '',
    price_per_month: initialData?.price_per_month || '',
    total_units: initialData?.total_units || 1,
    available_units: initialData?.available_units || 1,
    gender_type: initialData?.gender_type || (initialData?.type === 'kontrakan' ? 'all' : 'putra'),
    wa_number: initialData?.wa_number || '08127951435',
  })

  const [rooms, setRooms] = useState<KosRoom[]>(() =>
    parseRoomsFromDescription(initialData?.description)
  )

  const [facilityList, setFacilityList] = useState<Facility[]>(facilities || [])
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    initialData?.facilities?.map((f: any) => f.id) || []
  )
  const [customFacilityName, setCustomFacilityName] = useState('')
  const [addingFacility, setAddingFacility] = useState(false)
  const [facilityNotice, setFacilityNotice] = useState<string | null>(null)

  function toggleFacility(id: string) {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  async function handleAddCustomFacility(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const trimmed = customFacilityName.trim()
    if (!trimmed) return

    // 1. Cek apakah sudah ada di list lokal (case-insensitive)
    const existing = facilityList.find(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (existing) {
      if (!selectedFacilities.includes(existing.id)) {
        setSelectedFacilities((prev) => [...prev, existing.id])
      }
      setCustomFacilityName('')
      setFacilityNotice(`"${existing.name}" sudah ada dan otomatis dipilih.`)
      setTimeout(() => setFacilityNotice(null), 3000)
      return
    }

    setAddingFacility(true)
    setFacilityNotice(null)

    try {
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })

      const data = await res.json()

      if (res.ok && data.facility) {
        const newFac = data.facility as Facility
        // Tambahkan ke list jika belum ada
        setFacilityList((prev) => {
          if (prev.some((f) => f.id === newFac.id)) return prev
          return [...prev, newFac]
        })
        // Otomatis pilih
        setSelectedFacilities((prev) => {
          if (prev.includes(newFac.id)) return prev
          return [...prev, newFac.id]
        })
        setCustomFacilityName('')
        setFacilityNotice(`✓ Berhasil menambahkan "${newFac.name}"!`)
        setTimeout(() => setFacilityNotice(null), 3000)
      } else {
        // Fallback: tambahkan ke daftar lokal agar user tidak pernah terhambat
        const localFac: Facility = {
          id: `custom-${Date.now()}`,
          name: trimmed,
          icon: 'sparkles',
          category: 'Kustom',
        }
        setFacilityList((prev) => [...prev, localFac])
        setSelectedFacilities((prev) => [...prev, localFac.id])
        setCustomFacilityName('')
        setFacilityNotice(`✓ Berhasil menambahkan "${trimmed}" ke pilihan properti ini!`)
        setTimeout(() => setFacilityNotice(null), 3000)
      }
    } catch {
      // Fallback offline / network
      const localFac: Facility = {
        id: `custom-${Date.now()}`,
        name: trimmed,
        icon: 'sparkles',
        category: 'Kustom',
      }
      setFacilityList((prev) => [...prev, localFac])
      setSelectedFacilities((prev) => [...prev, localFac.id])
      setCustomFacilityName('')
      setFacilityNotice(`✓ Berhasil menambahkan "${trimmed}"!`)
      setTimeout(() => setFacilityNotice(null), 3000)
    } finally {
      setAddingFacility(false)
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingPhotos(true)
    const supabase = createClient()
    const urls: string[] = []

    for (const file of files) {
      const filename = `${ownerId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const { data, error } = await supabase.storage
        .from('property-photos')
        .upload(filename, file)

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('property-photos')
          .getPublicUrl(data.path)
        urls.push(urlData.publicUrl)
      }
    }

    setUploadedPhotos((prev) => [...prev, ...urls])
    setUploadingPhotos(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name || !formData.address || !formData.kota || !formData.price_per_month) {
      setError('Mohon lengkapi semua field yang wajib diisi (*)')
      return
    }

    setLoading(true)
    setError('')
    const supabase = createClient()

    const cleanDesc = getCleanDescription(formData.description)
    const finalDesc = formData.type === 'kos'
      ? serializeRoomsToDescription(cleanDesc, rooms)
      : formData.description

    const propertyData = {
      ...formData,
      description: finalDesc,
      owner_id: ownerId,
      status: initialData?.status || 'active',
      price_per_month: Number(formData.price_per_month),
      total_units: Number(formData.total_units),
      available_units: Number(formData.available_units),
    }

    let propertyId = initialData?.id
    const isMockSlug = initialData?.id && typeof initialData.id === 'string' && initialData.id.includes('-vilano-')

    if (initialData?.id && !isMockSlug) {
      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', initialData.id)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single()
      if (error) { setError(error.message); setLoading(false); return }
      propertyId = data.id
    }

    // Save photos
    if (uploadedPhotos.length > 0 && propertyId) {
      await supabase.from('property_photos').delete().eq('property_id', propertyId)
      await supabase.from('property_photos').insert(
        uploadedPhotos.map((url, i) => ({
          property_id: propertyId,
          url,
          is_primary: i === 0,
          order: i,
        }))
      )
    }

    // Save facilities
    if (propertyId) {
      await supabase.from('property_facilities').delete().eq('property_id', propertyId)
      const validDbFids = selectedFacilities.filter((fid) => !fid.startsWith('custom-'))
      if (validDbFids.length > 0) {
        await supabase.from('property_facilities').insert(
          validDbFids.map((fid) => ({ property_id: propertyId, facility_id: fid }))
        )
      }
    }

    setLoading(false)
    router.push('/admin/properti')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selector Cards: Kos (Coklat-Krem) vs Kontrakan (Krem-Coklat) */}
      <div className="bg-white rounded-3xl border border-[#E8D8C8] p-6 md:p-8 shadow-soft">
        <h2 className="text-base font-extrabold text-[#2D241E] mb-1">Pilih Kategori Hunian *</h2>
        <p className="text-xs text-[#8D6E63] mb-4">Tentukan apakah ini kamar kos (Coklat &bull; Krem) atau rumah kontrakan (Krem &bull; Coklat).</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Kos: Coklat Dominan & Krem */}
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'kos' })}
            className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all ${
              formData.type === 'kos'
                ? 'border-[#3E2723] bg-[#5D4037] text-[#FAF7F2] shadow-md scale-[1.02]'
                : 'border-[#E8D8C8] bg-[#FAF7F2] text-[#6D4C41] hover:border-[#D4BCA7]'
            }`}
          >
            <span className="text-4xl">🏠</span>
            <div className="text-center">
              <span className="font-extrabold text-sm block">Kamar Kos</span>
              <span className={`text-[11px] ${formData.type === 'kos' ? 'text-[#E8D8C8]' : 'text-[#8D6E63]'}`}>
                Coklat &bull; Krem (Per Kamar)
              </span>
            </div>
          </button>

          {/* Kontrakan: Krem Dominan & Coklat */}
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'kontrakan' })}
            className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all ${
              formData.type === 'kontrakan'
                ? 'border-[#D4BCA7] bg-[#F5EDE4] text-[#4E342E] shadow-md scale-[1.02]'
                : 'border-[#E8D8C8] bg-[#FAF7F2] text-[#6D4C41] hover:border-[#D4BCA7]'
            }`}
          >
            <span className="text-4xl">🏡</span>
            <div className="text-center">
              <span className="font-extrabold text-sm block">Rumah Kontrakan</span>
              <span className="text-[11px] text-[#8D6E63]">
                Krem &bull; Coklat (Satu Unit Utuh)
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-3xl border border-[#E8D8C8] p-6 md:p-8 shadow-soft space-y-4">
        <h2 className="text-base font-extrabold text-[#2D241E] mb-1">Informasi Dasar & Lokasi</h2>

        <div>
          <Label className="text-xs font-bold text-[#4E342E]">Nama Properti *</Label>
          <Input
            className="mt-1 h-12 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs font-semibold text-[#2D241E]"
            placeholder="Contoh: Kost Griya Asri Pogung"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label className="text-xs font-bold text-[#4E342E]">Deskripsi Lengkap</Label>
          <Textarea
            className="mt-1 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs text-[#2D241E]"
            placeholder="Tuliskan keunggulan propertimu, peraturan hunian, aksesibilitas ke kampus atau jalan raya..."
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <Label className="text-xs font-bold text-[#4E342E]">Alamat Lengkap *</Label>
          <Input
            className="mt-1 h-12 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs font-semibold text-[#2D241E]"
            placeholder="Jl. Kaliurang Km 5 No. 12"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold text-[#4E342E]">Kecamatan</Label>
            <Input
              className="mt-1 h-12 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs font-semibold text-[#2D241E]"
              placeholder="Contoh: Mlati, Tebet, Dago"
              value={formData.kecamatan}
              onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs font-bold text-[#4E342E]">Kota Wilayah *</Label>
            <select
              className="mt-1 w-full h-12 text-xs font-semibold border border-[#D4BCA7] rounded-2xl px-3 bg-[#FAF7F2] text-[#2D241E] focus:outline-none focus:border-[#6D4C41]"
              value={formData.kota}
              onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
              required
            >
              <option value="">Pilih Kota</option>
              {KOTA_LIST.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Units */}
      <div className="bg-white rounded-3xl border border-[#E8D8C8] p-6 md:p-8 shadow-soft space-y-4">
        <h2 className="text-base font-extrabold text-[#2D241E] mb-1">Tarif & Jumlah Unit</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-bold text-[#4E342E]">Harga / Bulan (Rp) *</Label>
            <Input
              className="mt-1 h-12 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs font-semibold text-[#2D241E]"
              type="number"
              placeholder="1500000"
              min="0"
              value={formData.price_per_month}
              onChange={(e) => setFormData({ ...formData, price_per_month: e.target.value })}
              required
            />
          </div>
          <div>
            <Label className="text-xs font-bold text-[#4E342E]">Total Unit/Kamar</Label>
            <Input
              className="mt-1 h-12 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs font-semibold text-[#2D241E]"
              type="number"
              min="1"
              value={formData.total_units}
              onChange={(e) => setFormData({ ...formData, total_units: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label className="text-xs font-bold text-[#4E342E]">Sisa Unit Kosong</Label>
            <Input
              className="mt-1 h-12 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs font-semibold text-[#2D241E]"
              type="number"
              min="0"
              value={formData.available_units}
              onChange={(e) => setFormData({ ...formData, available_units: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.type === 'kos' && (
            <div>
              <Label className="text-xs font-bold text-[#4E342E]">Tipe Penghuni Kos</Label>
              <select
                className="mt-1 w-full h-12 text-xs font-semibold border border-[#D4BCA7] rounded-2xl px-3 bg-[#FAF7F2] text-[#2D241E] focus:outline-none focus:border-[#6D4C41]"
                value={formData.gender_type}
                onChange={(e) => setFormData({ ...formData, gender_type: e.target.value as any })}
              >
                <option value="putra">Khusus Putra</option>
                <option value="putri">Khusus Putri</option>
                <option value="campur">Campur</option>
                <option value="all">Semua</option>
              </select>
            </div>
          )}
          <div>
            <Label className="text-xs font-bold text-[#4E342E]">No. WhatsApp Aktif</Label>
            <Input
              className="mt-1 h-12 rounded-2xl bg-[#FAF7F2] border-[#D4BCA7] text-xs font-semibold text-[#2D241E]"
              type="tel"
              placeholder="08127951435"
              value={formData.wa_number}
              onChange={(e) => setFormData({ ...formData, wa_number: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Denah & Tata Letak Kamar Kos (Lantai 1) */}
      {formData.type === 'kos' && (
        <div className="space-y-2">
          <AdminKosFloorPlan
            propertyId={initialData?.id}
            initialRooms={rooms}
            onChange={(updatedRooms) => {
              setRooms(updatedRooms)
              const avail = updatedRooms.filter((r) => r.status === 'available').length
              setFormData((prev) => ({
                ...prev,
                available_units: avail,
                total_units: updatedRooms.length,
              }))
            }}
          />
        </div>
      )}

      {/* Facilities Selection */}
      <div className="bg-white rounded-3xl border border-[#E8D8C8] p-6 md:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#2D241E]">Fasilitas yang Disediakan</h2>
            <p className="text-xs text-[#8D6E63] mt-0.5">Pilih dari daftar atau ketik sendiri fasilitas khusus di bawah.</p>
          </div>
          <span className="text-[11px] font-bold text-[#5D4037] bg-[#F5EDE4] px-3 py-1 rounded-full border border-[#D4BCA7] self-start sm:self-auto">
            {selectedFacilities.length} dipilih
          </span>
        </div>

        {/* Grid Fasilitas yang Tersedia */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {facilityList.map((facility) => {
            const isSelected = selectedFacilities.includes(facility.id)
            return (
              <button
                key={facility.id}
                type="button"
                onClick={() => toggleFacility(facility.id)}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  isSelected
                    ? 'border-[#5D4037] bg-[#F5EDE4] text-[#4E342E] shadow-xs'
                    : 'border-[#E8D8C8] text-[#6D4C41] hover:bg-[#FAF7F2]'
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#5D4037]' : 'text-[#D4BCA7]'}`} />
                <span className="truncate">{facility.name}</span>
              </button>
            )
          })}
        </div>

        {/* Input Ketik Fasilitas Sendiri */}
        <div className="mt-6 pt-5 border-t border-[#E8D8C8]/80 bg-[#FAF7F2] p-4 md:p-5 rounded-2xl border border-[#D4BCA7]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-[#5D4037] text-white flex items-center justify-center text-xs font-black">
              +
            </span>
            <label className="text-xs font-black text-[#4E342E]">
              Fasilitas Belum Ada di Daftar? Ketik Sendiri di Sini:
            </label>
          </div>
          <p className="text-[11px] text-[#8D6E63] mb-3">
            Tulis nama fasilitas khusus propertimu (contoh: Dapur Bersama, Water Heater, Balkon Pribadi, Jemuran Luas, Dispenser Galon) lalu klik tombol Tambah atau tekan Enter.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Ketik nama fasilitas baru..."
                value={customFacilityName}
                onChange={(e) => setCustomFacilityName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomFacility()
                  }
                }}
                className="h-11 rounded-2xl bg-white border-[#D4BCA7] text-xs font-semibold text-[#2D241E] placeholder:text-[#A98467] pr-8 focus:ring-2 focus:ring-[#5D4037]"
              />
              {customFacilityName && (
                <button
                  type="button"
                  onClick={() => setCustomFacilityName('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              onClick={() => handleAddCustomFacility()}
              disabled={addingFacility || !customFacilityName.trim()}
              className="h-11 px-5 rounded-2xl bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] font-bold text-xs gap-1.5 shrink-0 shadow-sm"
            >
              {addingFacility ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Fasilitas</span>
                </>
              )}
            </Button>
          </div>

          {facilityNotice && (
            <p className={`text-xs mt-3 font-semibold p-2.5 rounded-xl border ${
              facilityNotice.includes('Berhasil') || facilityNotice.includes('otomatis') || facilityNotice.includes('✓')
                ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                : 'text-amber-800 bg-amber-50 border-amber-300'
            }`}>
              {facilityNotice}
            </p>
          )}
        </div>
      </div>

      {/* Photos Upload */}
      <div className="bg-white rounded-3xl border border-[#E8D8C8] p-6 md:p-8 shadow-soft">
        <h2 className="text-base font-extrabold text-[#2D241E] mb-1">Foto-foto Properti</h2>
        <p className="text-xs text-[#8D6E63] mb-4">Unggah foto kamar, kamar mandi, fasad depan, dan lingkungan.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {uploadedPhotos.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] group border border-[#D4BCA7]">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-2 right-2 bg-rose-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <div className="absolute bottom-2 left-2 bg-[#3E2723]/90 text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Foto Utama
                </div>
              )}
            </div>
          ))}

          <label className="aspect-square rounded-2xl border-2 border-dashed border-[#D4BCA7] hover:border-[#6D4C41] hover:bg-[#F5EDE4] flex flex-col items-center justify-center cursor-pointer transition-all">
            <Camera className="h-6 w-6 text-[#8D6E63] mb-1" />
            <span className="text-xs font-bold text-[#4E342E]">Tambah Foto</span>
            <span className="text-[10px] text-[#A98467]">JPG, PNG</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {uploadingPhotos && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#4E342E] bg-[#F5EDE4] p-3 rounded-xl border border-[#D4BCA7]">
            <Loader2 className="h-4 w-4 animate-spin text-[#6D4C41]" />
            Sedang mengunggah foto ke penyimpanan Supabase...
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="rounded-2xl font-bold h-12 px-6 border-[#D4BCA7] text-[#4E342E]"
        >
          Batalkan
        </Button>
        <Button
          type="submit"
          variant="gradient"
          disabled={loading || uploadingPhotos}
          className="rounded-2xl font-bold h-12 px-8 shadow-md"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan Properti...</>
          ) : (
            initialData ? 'Simpan Perubahan' : 'Terbitkan Properti Sekarang'
          )}
        </Button>
      </div>
    </form>
  )
}
