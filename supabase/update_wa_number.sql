-- Jalankan query ini di Supabase SQL Editor jika ingin memperbarui nomor WhatsApp pemilik
-- untuk semua data properti dan profil admin yang sudah ada di database:

UPDATE properties 
SET wa_number = '081363327600';

UPDATE profiles 
SET phone = '081363327600' 
WHERE role = 'admin';

