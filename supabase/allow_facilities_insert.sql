-- ============================================================
-- SQL IZINKAN PENAMBAHAN FASILITAS BARU DI SUPABASE
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- Matikan RLS untuk tabel facilities agar admin dapat mengetik dan menambahkan fasilitas baru secara fleksibel:
ALTER TABLE public.facilities DISABLE ROW LEVEL SECURITY;
