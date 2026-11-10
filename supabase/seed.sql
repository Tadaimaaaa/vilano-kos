-- ============================================
-- Sample Seed Data for Vilano (Kos & Kontrakan)
-- Run this AFTER creating a user in Supabase Auth
-- or replace 'YOUR_USER_ID_HERE' with an actual user UUID.
-- ============================================

-- Catatan:
-- Agar data terhubung dengan pemilik, buat akun terlebih dahulu lewat web (/auth/register)
-- lalu ganti UUID di bawah dengan ID user tersebut dari tabel profiles / auth.users.

DO $$
DECLARE
  v_owner_id UUID;
  v_prop_kos1 UUID;
  v_prop_kos2 UUID;
  v_prop_kontrakan1 UUID;
  v_prop_kontrakan2 UUID;
  v_wifi UUID;
  v_ac UUID;
  v_km_dalam UUID;
  v_parkir_motor UUID;
  v_parkir_mobil UUID;
  v_dapur UUID;
BEGIN
  -- Ambil profile pertama yang ada, atau buat dummy jika belum ada
  SELECT id INTO v_owner_id FROM profiles LIMIT 1;

  IF v_owner_id IS NOT NULL THEN
    -- Dapatkan ID fasilitas
    SELECT id INTO v_wifi FROM facilities WHERE name = 'WiFi';
    SELECT id INTO v_ac FROM facilities WHERE name = 'AC';
    SELECT id INTO v_km_dalam FROM facilities WHERE name = 'Kamar Mandi Dalam';
    SELECT id INTO v_parkir_motor FROM facilities WHERE name = 'Parkir Motor';
    SELECT id INTO v_parkir_mobil FROM facilities WHERE name = 'Parkir Mobil';
    SELECT id INTO v_dapur FROM facilities WHERE name = 'Dapur';

    -- 1. Kos Putra Pandan (Kota Solok)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kos', 'Vilano Kos Putra Pandan - Kamar AC & KM Dalam',
      'Kamar kos putra eksklusif berkonsep modern minimalis di Ps. Pandan Air Mati, Kota Solok. Lingkungan tenang, aman, bersih, dan nyaman.',
      'Jl. Pandan Tengah, Ps. Pandan Air Mati', 'Lubuk Sikarah', 'Kota Solok',
      950000, 8, 3, 'putra', '08127951435', 'active', true
    ) RETURNING id INTO v_prop_kos1;

    INSERT INTO property_photos (property_id, url, is_primary, "order")
    VALUES (v_prop_kos1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', true, 0);

    IF v_wifi IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_wifi); END IF;
    IF v_ac IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_ac); END IF;
    IF v_km_dalam IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_km_dalam); END IF;
    IF v_parkir_motor IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_parkir_motor); END IF;

    -- 2. Kos Putra Pandan Standar (Kota Solok)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kos', 'Vilano Kos Putra Pandan - Kamar Standar & KM Dalam',
      'Kamar kos putra nyaman dan sejuk alami di Jl. Pandan Tengah, Ps. Pandan Air Mati, Kota Solok. Dilengkapi kasur, lemari, meja kerja, dan kamar mandi dalam.',
      'Jl. Pandan Tengah, Ps. Pandan Air Mati', 'Lubuk Sikarah', 'Kota Solok',
      750000, 6, 2, 'putra', '08127951435', 'active', true
    ) RETURNING id INTO v_prop_kos2;

    INSERT INTO property_photos (property_id, url, is_primary, "order")
    VALUES (v_prop_kos2, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', true, 0);

    IF v_wifi IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos2, v_wifi); END IF;
    IF v_km_dalam IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos2, v_km_dalam); END IF;
    IF v_parkir_motor IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos2, v_parkir_motor); END IF;

    -- 3. Kontrakan Keluarga Suhada (Kota Solok)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kontrakan', 'Vilano Rumah Kontrakan Keluarga Suhada',
      'Satu unit rumah kontrakan utuh siap huni di Simpang Rumbio, Lubuk Sikarah, Kota Solok. 3 kamar tidur, 2 kamar mandi, ruang tamu luas, dapur pribadi, dan carport berkanopi.',
      'Jl. Gg. Suhada No.8, Simpang Rumbio', 'Lubuk Sikarah', 'Kota Solok',
      1600000, 1, 1, 'all', '08127951435', 'active', true
    ) RETURNING id INTO v_prop_kontrakan1;

    INSERT INTO property_photos (property_id, url, is_primary, "order")
    VALUES (v_prop_kontrakan1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', true, 0);

    IF v_dapur IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan1, v_dapur); END IF;
    IF v_parkir_mobil IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan1, v_parkir_mobil); END IF;
    IF v_parkir_motor IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan1, v_parkir_motor); END IF;

    -- 4. Kontrakan Minimalis Suhada (Kota Solok)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kontrakan', 'Vilano Rumah Kontrakan Minimalis Suhada',
      'Rumah kontrakan asri dan bersih berkonsep minimalis di Jl. Gg. Suhada No.8, Simpang Rumbio, Lubuk Sikarah, Kota Solok. 2 kamar tidur, 1 kamar mandi, ruang tamu, dan dapur bersih.',
      'Jl. Gg. Suhada No.8, Simpang Rumbio', 'Lubuk Sikarah', 'Kota Solok',
      1250000, 1, 1, 'all', '08127951435', 'active', true
    ) RETURNING id INTO v_prop_kontrakan2;

    INSERT INTO property_photos (property_id, url, is_primary, "order")
    VALUES (v_prop_kontrakan2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', true, 0);

    IF v_dapur IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan2, v_dapur); END IF;
    IF v_parkir_mobil IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan2, v_parkir_mobil); END IF;

    RAISE NOTICE 'Sample seed data berhasil dimasukkan!';
  ELSE
    RAISE NOTICE 'Silakan daftarkan 1 akun terlebih dahulu lewat web (/auth/register), lalu jalankan script ini lagi.';
  END IF;
END $$;

