import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const CITIES = [
  {
    name: 'Yogyakarta',
    tag: 'Kota Pelajar',
    units: '180+ Kos & Kontrakan',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    link: '/kos?kota=Yogyakarta',
  },
  {
    name: 'Bandung',
    tag: 'Dago & Jatinangor',
    units: '140+ Kos & Kontrakan',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    link: '/kos?kota=Bandung',
  },
  {
    name: 'Jakarta',
    tag: 'Pusat & Selatan',
    units: '220+ Kos & Kontrakan',
    image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=600&q=80',
    link: '/kos?kota=Jakarta',
  },
  {
    name: 'Surabaya',
    tag: 'Timur & Barat',
    units: '95+ Kos & Kontrakan',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80',
    link: '/kontrakan?kota=Surabaya',
  },
  {
    name: 'Malang',
    tag: 'Kawasan Dingin',
    units: '85+ Kos & Kontrakan',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    link: '/kos?kota=Malang',
  },
]

export default function PopularCities() {
  return (
    <section className="py-12 container mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5D4037] bg-[#F5EDE4] px-3 py-1 rounded-full border border-[#D4BCA7]">
            Kota Terpopuler
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#2D241E] mt-2">
            Eksplor Pilihan Hunian di Kota Favorit
          </h2>
          <p className="text-[#8D6E63] text-sm mt-1">
            Ribuan kos dan kontrakan tersedia di dekat kampus ternama dan kawasan sentra bisnis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {CITIES.map((city) => (
          <Link
            key={city.name}
            href={city.link}
            className="group relative h-64 rounded-3xl overflow-hidden shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 block border border-[#E8D8C8]"
          >
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17]/85 via-[#2D241E]/30 to-transparent" />

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#FAF7F2] group-hover:text-[#3E2723] transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-[#FAF7F2]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8D8C8] block mb-0.5">
                {city.tag}
              </span>
              <h3 className="font-extrabold text-lg leading-tight text-white">{city.name}</h3>
              <p className="text-xs text-[#D4BCA7] mt-0.5">{city.units}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
