export interface KosRoom {
  id: number
  number: string // e.g. "Kamar 01"
  label: string  // e.g. "Kamar 1"
  floor: number  // 1
  type: string   // "Kamar AC & KM Dalam" | "Kamar Standar & KM Dalam"
  price: number  // e.g. 950000 | 750000
  status: 'available' | 'occupied'
  facilities: string[]
  notes?: string
  photoUrl?: string
  photos?: string[]
}

export const DEFAULT_FLOOR1_ROOMS: KosRoom[] = [
  {
    id: 1,
    number: 'Kamar 01',
    label: 'Kamar 1',
    floor: 1,
    type: 'Kamar AC & KM Dalam',
    price: 950000,
    status: 'available',
    facilities: ['AC Dingin', 'Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi pojok kiri atas dekat tangga, sirkulasi udara sejuk dan tenang.',
    photoUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    number: 'Kamar 02',
    label: 'Kamar 2',
    floor: 1,
    type: 'Kamar AC & KM Dalam',
    price: 950000,
    status: 'available',
    facilities: ['AC Dingin', 'Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi sisi kiri tengah, akses mudah ke lorong dan jemuran.',
    photoUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    number: 'Kamar 03',
    label: 'Kamar 3',
    floor: 1,
    type: 'Kamar Standar & KM Dalam',
    price: 750000,
    status: 'occupied',
    facilities: ['Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi sisi kiri depan, akses cepat ke pintu utama.',
    photoUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    number: 'Kamar 04',
    label: 'Kamar 4',
    floor: 1,
    type: 'Kamar Standar & KM Dalam',
    price: 750000,
    status: 'available',
    facilities: ['Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi depan sebelah kiri luar, dekat area parkir motor.',
    photoUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    number: 'Kamar 05',
    label: 'Kamar 5',
    floor: 1,
    type: 'Kamar Standar & KM Dalam',
    price: 750000,
    status: 'available',
    facilities: ['Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi depan tepat di sebelah kiri pintu masuk utama.',
    photoUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    number: 'Kamar 06',
    label: 'Kamar 6',
    floor: 1,
    type: 'Kamar Standar & KM Dalam',
    price: 750000,
    status: 'occupied',
    facilities: ['Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi depan tepat di sebelah kanan pintu masuk utama.',
    photoUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    number: 'Kamar 07',
    label: 'Kamar 7',
    floor: 1,
    type: 'Kamar Standar & KM Dalam',
    price: 750000,
    status: 'available',
    facilities: ['Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi depan sebelah kanan luar, dekat teras depan.',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    number: 'Kamar 08',
    label: 'Kamar 8',
    floor: 1,
    type: 'Kamar Standar & KM Dalam',
    price: 750000,
    status: 'available',
    facilities: ['Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi sisi kanan bawah, sirkulasi udara alami.',
    photoUrl: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    number: 'Kamar 09',
    label: 'Kamar 9',
    floor: 1,
    type: 'Kamar AC & KM Dalam',
    price: 950000,
    status: 'available',
    facilities: ['AC Dingin', 'Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi sisi kanan tengah, nyaman dan tenang.',
    photoUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 10,
    number: 'Kamar 10',
    label: 'Kamar 10',
    floor: 1,
    type: 'Kamar AC & KM Dalam',
    price: 950000,
    status: 'occupied',
    facilities: ['AC Dingin', 'Kamar Mandi Dalam', 'Kasur & Bantal', 'Lemari Pakaian', 'Meja Belajar', 'WiFi Cepat'],
    notes: 'Posisi pojok kanan atas, bersebelahan dengan dapur bersama.',
    photoUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
  },
]

const ROOMS_TAG_REGEX = /<!--VILANO_ROOMS:([\s\S]*?)-->/

export function parseRoomsFromDescription(desc: string | null | undefined): KosRoom[] {
  if (!desc) return DEFAULT_FLOOR1_ROOMS
  const match = desc.match(ROOMS_TAG_REGEX)
  if (!match || !match[1]) return DEFAULT_FLOOR1_ROOMS

  try {
    const parsed = JSON.parse(match[1])
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as KosRoom[]
    }
  } catch {
    // fallback
  }

  return DEFAULT_FLOOR1_ROOMS
}

export function serializeRoomsToDescription(cleanDesc: string, rooms: KosRoom[]): string {
  const base = cleanDesc.replace(ROOMS_TAG_REGEX, '').trim()
  return `${base}\n\n<!--VILANO_ROOMS:${JSON.stringify(rooms)}-->`
}

export function getCleanDescription(desc: string | null | undefined): string {
  if (!desc) return ''
  return desc.replace(ROOMS_TAG_REGEX, '').trim()
}

