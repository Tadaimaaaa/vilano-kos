'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, Building2, Home, CalendarCheck } from 'lucide-react'

export default function AdminSidebarNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentType = searchParams.get('type')

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      isActive: pathname === '/admin',
    },
    {
      label: 'Kelola Kos',
      href: '/admin/properti?type=kos',
      icon: Building2,
      isActive:
        pathname.startsWith('/admin/properti') &&
        (currentType === 'kos' || (!currentType && pathname === '/admin/properti')),
    },
    {
      label: 'Kelola Kontrakan',
      href: '/admin/properti?type=kontrakan',
      icon: Home,
      isActive:
        pathname.startsWith('/admin/properti') && currentType === 'kontrakan',
    },
    {
      label: 'Booking Masuk',
      href: '/admin/booking',
      icon: CalendarCheck,
      isActive: pathname.startsWith('/admin/booking'),
    },
  ]

  return (
    <nav className="flex-1 p-4 space-y-1.5">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              item.isActive
                ? 'bg-[#3E2723] text-[#FAF7F2] border border-[#5D4037] shadow-xs'
                : 'text-[#A98467] hover:bg-[#3E2723]/60 hover:text-[#FAF7F2]'
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                item.isActive ? 'text-[#E8D8C8]' : 'text-[#8D6E63]'
              }`}
            />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

