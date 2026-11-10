'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeletePropertyButtonProps {
  id: string
  name: string
}

export default function DeletePropertyButton({ id, name }: DeletePropertyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus properti "${name}"? Tindakan ini tidak dapat dibatalkan.`)
    if (!confirmDelete) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Gagal menghapus properti')
        return
      }
      router.refresh()
    } catch {
      alert('Terjadi kesalahan saat menghapus properti')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      title="Hapus Properti"
      className="h-9 w-9 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}

