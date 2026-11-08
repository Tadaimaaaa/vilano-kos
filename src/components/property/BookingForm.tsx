'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface BookingFormProps {
  propertyId: string
  pricePerMonth: number
  availableUnits: number
}

const DURATIONS = [1, 3, 6, 12]

export default function BookingForm({ propertyId, pricePerMonth, availableUnits }: BookingFormProps) {
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const totalPrice = pricePerMonth * duration

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!startDate) {
      setError('Pilih tanggal mulai sewa')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Silakan login terlebih dahulu')
      setLoading(false)
      return
    }

    const { error: bookingError } = await supabase.from('bookings').insert({
      property_id: propertyId,
      tenant_id: user.id,
      start_date: startDate,
      duration_months: duration,
      total_price: totalPrice,
      notes,
    })

    setLoading(false)
    if (bookingError) {
      setError('Gagal mengajukan booking. Silakan coba lagi.')
    } else {
      setSuccess(true)
    }
  }

  if (availableUnits === 0) {
    return (
      <div className="text-center py-6 bg-rose-50 border border-rose-200 rounded-3xl p-4">
        <p className="text-sm text-rose-800 font-extrabold">Unit Saat Ini Penuh</p>
        <p className="text-xs text-rose-600 mt-1">
          Hubungi pemilik via WhatsApp untuk konfirmasi jika ada penghuni yang akan check-out.
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-6 bg-emerald-50 border border-emerald-200 rounded-3xl p-5 animate-in fade-in">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="text-sm font-extrabold text-emerald-950">Booking Berhasil Diajukan!</p>
        <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
          Permohonan sewa telah terkirim ke pemilik properti. Pantau status konfirmasi di menu <strong>Booking Saya</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleBooking} className="space-y-4">
      {/* Date */}
      <div>
        <Label className="text-xs font-bold text-[#4E342E] block mb-1">
          Tanggal Mulai Masuk
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

      {/* Duration Pills */}
      <div>
        <Label className="text-xs font-bold text-[#4E342E] block mb-1.5">
          Durasi Sewa
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

      {/* Notes */}
      <div>
        <Label className="text-xs font-bold text-[#4E342E] block mb-1">
          Catatan Tambahan (Opsional)
        </Label>
        <Textarea
          placeholder="Contoh: Rencana bawa kendaraan, waktu survey..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-xs rounded-xl bg-[#FAF7F2] border-[#D4BCA7] min-h-[60px]"
          rows={2}
        />
      </div>

      {/* Price Summary Calculation */}
      <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C8] space-y-1.5">
        <div className="flex justify-between text-xs text-[#8D6E63] font-medium">
          <span>{formatPrice(pricePerMonth)} &times; {duration} bulan</span>
          <span className="font-bold text-[#2D241E]">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#8D6E63] font-medium">
          <span>Biaya Layanan Vilano</span>
          <span className="text-emerald-700 font-bold">GRATIS</span>
        </div>
        <div className="pt-2 border-t border-[#D4BCA7] flex justify-between items-baseline">
          <span className="text-xs font-extrabold text-[#2D241E]">Total Estimasi</span>
          <span className="text-base font-black text-[#5D4037]">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {error && <p className="text-xs text-rose-700 font-medium">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        variant="gradient"
        className="w-full h-12 rounded-2xl font-bold shadow-md"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Mengirim Permohonan...</>
        ) : (
          'Ajukan Booking Sekarang'
        )}
      </Button>
    </form>
  )
}
