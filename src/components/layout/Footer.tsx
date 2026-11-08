import Link from 'next/link'
import { Home, Mail, Phone, ShieldCheck, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1F1A17] text-[#D4BCA7] mt-auto border-t border-[#3E2723]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3E2723] via-[#5D4037] to-[#8D6E63] flex items-center justify-center text-[#FAF7F2] shadow-md border border-[#8D6E63]">
                <Home className="h-5 w-5" />
              </div>
              <span className="font-black text-2xl text-[#FAF7F2] tracking-tight">Vilano</span>
            </Link>

            <p className="text-xs leading-relaxed text-[#A98467] max-w-sm">
              Platform pencarian kamar kos eksklusif (Coklat-Krem) dan rumah kontrakan keluarga (Krem-Coklat) terpercaya di seluruh Indonesia.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-[#E8D8C8] font-bold">
              <ShieldCheck className="h-4 w-4 text-[#D4BCA7]" />
              <span>100% Terverifikasi & Bebas Calo</span>
            </div>
          </div>

          {/* Nav Links: Kos (Coklat-Krem) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FAF7F2]">Kamar Kos (Coklat)</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/kos" className="hover:text-white transition-colors">Semua Kos</Link></li>
              <li><Link href="/kos?gender=putra" className="hover:text-white transition-colors">Kos Putra</Link></li>
              <li><Link href="/kos?gender=putri" className="hover:text-white transition-colors">Kos Putri</Link></li>
              <li><Link href="/kos?gender=campur" className="hover:text-white transition-colors">Kos Campur</Link></li>
              <li><Link href="/kos?price=0-1500000" className="hover:text-white transition-colors">Kos &le; 1.5 Jt/bln</Link></li>
            </ul>
          </div>

          {/* Nav Links: Kontrakan (Krem-Coklat) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FAF7F2]">Kontrakan (Krem)</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/kontrakan" className="hover:text-white transition-colors">Semua Kontrakan</Link></li>
              <li><Link href="/kontrakan?kota=Jakarta" className="hover:text-white transition-colors">Kontrakan Jakarta</Link></li>
              <li><Link href="/kontrakan?kota=Bandung" className="hover:text-white transition-colors">Kontrakan Bandung</Link></li>
              <li><Link href="/kontrakan?kota=Yogyakarta" className="hover:text-white transition-colors">Kontrakan Jogja</Link></li>
              <li><Link href="/kontrakan?kota=Surabaya" className="hover:text-white transition-colors">Kontrakan Surabaya</Link></li>
            </ul>
          </div>

          {/* Nav Links: Pemilik */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FAF7F2]">Untuk Pemilik</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/auth/register?role=pemilik" className="text-[#E8D8C8] font-bold hover:underline">Pasang Iklan Gratis</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Masuk Akun Pemilik</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard Saya</Link></li>
              <li><Link href="/dashboard/properti/baru" className="hover:text-white transition-colors">Tambah Properti</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FAF7F2]">Hubungi Kami</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#D4BCA7]" />
                <span>support@vilano.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#D4BCA7]" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#D4BCA7]" />
                <span>Jakarta & Yogyakarta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3E2723] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8D6E63]">
          <p>&copy; {new Date().getFullYear()} Vilano Indonesia. Semua Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[#FAF7F2] transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-[#FAF7F2] transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
