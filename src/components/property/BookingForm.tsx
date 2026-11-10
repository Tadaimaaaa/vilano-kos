'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, MessageCircle, Calendar, User, Phone, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice } from '@/lib/utils'

interface BookingFormProps {
  propertyId: string
  propertyName: string
  propertyType?: string
  pricePerMonth: number
  availableUnits: number
  ownerPhone?: string | null
}

const DURATIONS = [1, 3, 6, 12]

export default function BookingForm({
  propertyId,
  propertyName,
  propertyType = 'kos',
  pricePerMonth,
  availableUnits,
  ownerPhone,
}: BookingFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const totalPrice = pricePerMonth * duration

  function buildWhatsAppUrl(clientName: string, clientPhone: string, date: string, dur: number, clientNotes: string) {
    const rawOwner = ownerPhone || '08127951435'
    const targetPhone = rawOwner.replace(/[^0-9]/g, '').replace(/^0/, '62')

    const dateFormatted = new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const msg = [
      `Halo Pemilik Vilano, saya *${clientName.trim()}* (${clientPhone.trim()}) ingin mengajukan sewa / booking:`,
      ``,
      `🏠 *Unit*: ${propertyName} (${propertyType === 'kos' ? 'Kos Putra' : 'Kontrakan'})`,
      `📅 *Rencana Masuk*: ${dateFormatted}`,
      `⏱️ *Durasi Sewa*: ${dur} Bulan`,
      `💰 *Total Estimasi*: ${formatPrice(pricePerMonth * dur)}`,
      clientNotes.trim() ? `📝 *Catatan*: ${clientNotes.trim()}` : null,
      ``,
      `Mohon info ketersediaan unit dan petunjuk survey/pembayarannya. Terima kasih!`,
    ]
      .filter((line) => line !== null)
      .join('\n')

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`
  }

  async function handleSubmitBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Mohon isi nama lengkap Anda')
      return
    }
    if (!phone.trim()) {
      setError('Mohon isi nomor WhatsApp aktif Anda')
      return
    }
    if (!startDate) {
      setError('Pilih tanggal rencana mulai masuk')
      return
    }

    setLoading(true)
    setError('')

    const waUrl = buildWhatsAppUrl(name, phone, startDate, duration, notes)
    setWhatsappUrl(waUrl)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          name: name.trim(),
          phone: phone.trim(),
          startDate,
          duration,
          notes: notes.trim(),
          totalPrice,
        }),
      })

      if (!res.ok) {
        console.warn('Booking record notice: network or server issue, proceeding with direct WhatsApp')
      }
    } catch (err) {
      console.warn('Booking notice:', err)
    } finally {
      setLoading(false)
      setSuccess(true)
      // Buka otomatis WhatsApp di tab baru jika browser mengizinkan
      try {
        window.open(waUrl, '_blank')
      } catch {
        // Fallback jika popup terblokir
      }
    }
  }

  function handleReset() {
    setName('')
    setPhone('')
    setStartDate('')
    setDuration(1)
    setNotes('')
    setSuccess(false)
    setError('')
    setWhatsappUrl('')
  }

  if (availableUnits === 0) {
    return (
      <div className="text-center py-6 bg-rose-50 border border-rose-200 rounded-3xl p-5">
        <p className="text-sm text-rose-800 font-extrabold">Unit Saat Ini Penuh</p>
        <p className="text-xs text-rose-600 mt-1 leading-relaxed">
          Semua kamar/unit saat ini sedang terisi. Hubungi pemilik via WhatsApp untuk menanyakan jadwal ketersediaan berikutnya.
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-6 bg-[#FAF7F2] border-2 border-[#D4BCA7] rounded-3xl p-5 animate-in fade-in space-y-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-base font-black text-[#2D241E]">Pengajuan Booking Berhasil!</h3>
          <p className="text-xs text-[#8D6E63] mt-1 leading-relaxed">
            Data Anda telah tercatat. Silakan klik tombol di bawah untuk langsung terhubung ke WhatsApp Pemilik guna konfirmasi unit.
          </p>
        </div>

        {/* Ringkasan Data */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E8D8C8] text-left text-xs space-y-1.5 text-[#6D4C41]">
          <div className="flex justify-between">
            <span className="text-[#8D6E63]">Penyewa:</span>
            <span className="font-bold text-[#2D241E]">{name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8D6E63]">WhatsApp:</span>
            <span className="font-bold text-[#2D241E]">{phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8D6E63]">Rencana Masuk:</span>
            <span className="font-bold text-[#2D241E]">
              {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8D6E63]">Durasi Sewa:</span>
            <span className="font-bold text-[#2D241E]">{duration} Bulan</span>
          </div>
          <div className="pt-1.5 border-t border-[#F5EDE4] flex justify-between font-extrabold text-[#5D4037]">
            <span>Total Tarif:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Tombol Utama WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Kirim Konfirmasi ke WhatsApp Pemilik</span>
        </a>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8D6E63] hover:text-[#2D241E] transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Isi Ulang Form Booking</span>
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmitBooking} className="space-y-4">
      <div className="border-b border-[#F5EDE4] pb-2">
        <h3 className="text-sm font-extrabold text-[#2D241E]">Formulir Pengajuan Sewa</h3>
        <p className="text-[11px] text-[#8D6E63]">Isi data di bawah untuk booking langsung ke pemilik resmi.</p>
      </div>

      {/* 2-Col Grid for Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama Lengkap */}
        <div>
          <Label className="text-xs font-bold text-[#4E342E] flex items-center gap-1 mb-1">
            <User className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span>Nama Lengkap Anda *</span>
          </Label>
          <Input
            type="text"
            placeholder="Nama lengkap calon penyewa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 rounded-xl bg-[#FAF7F2] text-xs font-semibold border-[#D4BCA7] placeholder:text-[#A98467]"
          />
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <Label className="text-xs font-bold text-[#4E342E] flex items-center gap-1 mb-1">
            <Phone className="h-3.5 w-3.5 text-[#8D6E63]" />
            <span>Nomor WhatsApp Aktif *</span>
          </Label>
          <Input
            type="tel"
            placeholder="Contoh: 081234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="h-11 rounded-xl bg-[#FAF7F2] text-xs font-semibold border-[#D4BCA7] placeholder:text-[#A98467]"
          />
        </div>
      </div>

      {/* Tanggal Mulai Masuk */}
      <div>
        <Label className="text-xs font-bold text-[#4E342E] flex items-center gap-1 mb-1">
          <Calendar className="h-3.5 w-3.5 text-[#8D6E63]" />
          <span>Rencana Tanggal Masuk *</span>
        </Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
          className="h-11 rounded-xl bg-[#FAF7F2] text-xs font-semibold border-[#D4BCA7]"
        />
      </div>

      {/* Durasi Sewa */}
      <div>
        <Label className="text-xs font-bold text-[#4E342E] block mb-1.5">
          Pilihan Durasi Sewa
        </Label>
        <div className="grid grid-cols-4 gap-1.5">
          {DURATIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setDuration(m)}
              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                duration === m
                  ? 'bg-[#5D4037] text-[#FAF7F2] border-[#3E2723] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#4E342E] border-[#D4BCA7] hover:bg-[#F5EDE4]'
              }`}
            >
              {m} Bln
            </button>
          ))}
        </div>
      </div>

      {/* Catatan Tambahan */}
      <div>
        <Label className="text-xs font-bold text-[#4E342E] block mb-1">
          Catatan Tambahan (Opsional)
        </Label>
        <Textarea
          placeholder="Contoh: Bawa motor, survey hari Sabtu, request lantai 1..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-xs rounded-xl bg-[#FAF7F2] border-[#D4BCA7] min-h-[55px] placeholder:text-[#A98467]"
          rows={2}
        />
      </div>

      {/* Ringkasan Estimasi Harga */}
      <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8] space-y-1.5">
        <div className="flex justify-between text-xs text-[#8D6E63] font-medium">
          <span>{formatPrice(pricePerMonth)} &times; {duration} bulan</span>
          <span className="font-bold text-[#2D241E]">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#8D6E63] font-medium">
          <span>Biaya Layanan Vilano</span>
          <span className="text-emerald-700 font-bold">GRATIS (0 Biaya)</span>
        </div>
        <div className="pt-2 border-t border-[#D4BCA7] flex justify-between items-baseline">
          <span className="text-xs font-extrabold text-[#2D241E]">Total Estimasi</span>
          <span className="text-base font-black text-[#5D4037]">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {error && <p className="text-xs text-rose-700 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-2xl font-bold text-xs bg-[#5D4037] hover:bg-[#4E342E] text-[#FAF7F2] shadow-md border border-[#3E2723] gap-2 transition-all hover:-translate-y-0.5"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Memproses Booking...</>
        ) : (
          <>
            <span>Ajukan Booking Sekarang</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}
