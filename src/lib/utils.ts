import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function getWALink(waNumber: string, message?: string): string {
  const cleaned = waNumber.replace(/\D/g, '')
  const number = cleaned.startsWith('0')
    ? '62' + cleaned.slice(1)
    : cleaned
  const encodedMsg = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${number}${encodedMsg ? `?text=${encodedMsg}` : ''}`
}

export function getPropertyTypeLabel(type: string): string {
  return type === 'kos' ? 'Kos' : 'Kontrakan'
}

export function getGenderTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    putra: 'Khusus Cowok',
    putri: 'Khusus Putri',
    campur: 'Campur',
    all: 'Semua',
  }
  return labels[type] || type
}

export function getBookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Menunggu Konfirmasi',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
    completed: 'Selesai',
  }
  return labels[status] || status
}

export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

