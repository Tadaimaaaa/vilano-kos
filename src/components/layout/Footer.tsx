import Link from 'next/link'
import { Home, Mail, Phone, ShieldCheck, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1F1A17] text-[#D4BCA7] mt-auto border-t border-[#3E2723]">
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex flex-col">
              <span className="font-black text-2xl md:text-[26px] text-[#FAF7F2] tracking-tight leading-none">
                Vilano
              </span>
              <p className="text-[11px] text-[#A98467] font-semibold tracking-wide mt-1">
                Kos &bull; Kontrakan &bull; Kota Solok
              </p>
            </Link>

            <p className="text-xs leading-relaxed text-[#A98467] max-w-sm">
              Situs resmi sewa kamar kos eksklusif putra dan rumah kontrakan keluarga Vilano di Kota Solok. Hunian bersih, nyaman, dan terawat langsung dari pemilik tanpa perantara.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#E8D8C8] font-bold">
              <ShieldCheck className="h-4 w-4 text-[#D4BCA7]" />
              <span>100% Unit Resmi & Bebas Calo</span>
            </div>
          </div>

          {/* Lokasi Properti di Kota Solok */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FAF7F2]">
              Alamat 
            </h4>
            <div className="space-y-3 text-xs">
              <div className="rounded-2xl bg-black/20 p-3.5 border border-[#3E2723]">
                <p className="font-bold text-[#E8D8C8] mb-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#D4BCA7] shrink-0" />
                  <span>Kos Putra Vilano:</span>
                </p>
                <p className="text-[#A98467] leading-relaxed pl-5">
                  Jl. Pandan Tengah, Ps. Pandan Air Mati, Kec. Lubuk Sikarah, Kota Solok, Sumatera Barat 27317
                </p>
              </div>

              <div className="rounded-2xl bg-black/20 p-3.5 border border-[#3E2723]">
                <p className="font-bold text-[#E8D8C8] mb-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#D4BCA7] shrink-0" />
                  <span>Kontrakan Keluarga Vilano:</span>
                </p>
                <p className="text-[#A98467] leading-relaxed pl-5">
                  Jl. Gg. Suhada No.8, Simpang Rumbio, Kec. Lubuk Sikarah, Kota Solok, Sumatera Barat 27316
                </p>
              </div>
            </div>
          </div>

          {/* Navigasi Utama */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FAF7F2]">Navigasi</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/kos" className="hover:text-white transition-colors">Kos Putra</Link></li>
              <li><Link href="/kontrakan" className="hover:text-white transition-colors">Kontrakan</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors text-[#A98467]">Portal Login Admin</Link></li>
            </ul>
          </div>

          {/* Kontak Langsung */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FAF7F2]">Kontak Langsung</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#D4BCA7] shrink-0" />
                <a
                  href="https://wa.me/6281363327600?text=Halo%20Pemilik%20Vilano,%20saya%20tertarik%20tanya%20unit%20kos%20/%20kontrakan%20di%20Kota%20Solok"
                  target="_blank"
                  rel="noopener noreferrer"
                  suppressHydrationWarning
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: 0813-6332-7600
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#D4BCA7] shrink-0" />
                <span>support@vilano.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#3E2723] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8D6E63]">
          <p>&copy; {new Date().getFullYear()} Vilano Kota Solok. Semua Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-[#FAF7F2] transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
