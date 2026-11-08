# Vilano - Web Kos & Kontrakan

Platform pencarian kos dan kontrakan berbasis **Next.js 14**, **Supabase**, dan **Tailwind CSS**.

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <repo>
cd vilano
npm install
```

### 2. Konfigurasi Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Copy `.env.local.example` → `.env.local`
3. Isi dengan credentials Supabase kamu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Setup Database

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy dan jalankan seluruh isi file `supabase/schema.sql`

### 4. Setup Storage

1. Buka **Supabase Dashboard** → **Storage**
2. Buat bucket baru: `property-photos` (set Public)
3. Di SQL Editor, jalankan policy storage (ada di bagian akhir `schema.sql`)

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy ke Vercel

1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import project
3. Set Environment Variables
4. Deploy!

## 🏠 Fitur

- Landing Page dengan hero & featured listing
- Daftar Kos & Kontrakan dengan filter/search
- Detail Properti: foto gallery, fasilitas, booking, review
- Auth: Login & Register (penyewa/pemilik)
- Dashboard Pemilik: CRUD properti, upload foto, kelola booking
- Dashboard Penyewa: tracking booking
- WhatsApp Integration
