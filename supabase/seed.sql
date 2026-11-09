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

    -- 1. Kos Putra Eksklusif Dekat Kampus (Yogyakarta)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kos', 'Vilano Kos Griya Asri Pogung',
      'Kos putra nyaman, tenang, dan strategis dekat kampus UGM. Fasilitas lengkap tinggal bawa koper. Lingkungan aman dengan CCTV 24 jam.',
      'Jl. Pogung Kidul No. 15', 'Mlati', 'Yogyakarta',
      1200000, 10, 3, 'putra', '081234567890', 'active', true
    ) RETURNING id INTO v_prop_kos1;

    INSERT INTO property_photos (property_id, url, is_primary, "order")
    VALUES (v_prop_kos1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', true, 0);

    IF v_wifi IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_wifi); END IF;
    IF v_ac IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_ac); END IF;
    IF v_km_dalam IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_km_dalam); END IF;
    IF v_parkir_motor IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos1, v_parkir_motor); END IF;

    -- 2. Kos Putri Modern Tebet (Jakarta Selatan)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kos', 'Vilano Kost Putri Cempaka Tebet',
      'Kost khusus putri di area strategis Tebet, hanya 5 menit ke stasiun KRL. Akses mudah ke perkantoran Kuningan dan Sudirman.',
      'Jl. Tebet Barat Dalam VII No. 20', 'Tebet', 'Jakarta',
      2100000, 8, 2, 'putri', '081298765432', 'active', true
    ) RETURNING id INTO v_prop_kos2;

    INSERT INTO property_photos (property_id, url, is_primary, "order")
    VALUES (v_prop_kos2, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', true, 0);

    IF v_wifi IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos2, v_wifi); END IF;
    IF v_ac IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos2, v_ac); END IF;
    IF v_km_dalam IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kos2, v_km_dalam); END IF;

    -- 3. Kontrakan Minimalis 2 Lantai (Bandung)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kontrakan', 'Vilano Kontrakan Harmoni Dago',
      'Rumah kontrakan 2 kamar tidur, 1 kamar mandi, ruang tamu luas, dapur, dan carport. Udara sejuk dekat kawasan wisata Dago.',
      'Jl. Dago Asri Blok B No. 4', 'Coblong', 'Bandung',
      3500000, 1, 1, 'all', '081311223344', 'active', true
    ) RETURNING id INTO v_prop_kontrakan1;

    INSERT INTO property_photos (property_id, url, is_primary, "order")
    VALUES (v_prop_kontrakan1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', true, 0);

    IF v_dapur IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan1, v_dapur); END IF;
    IF v_parkir_mobil IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan1, v_parkir_mobil); END IF;
    IF v_parkir_motor IS NOT NULL THEN INSERT INTO property_facilities VALUES (v_prop_kontrakan1, v_parkir_motor); END IF;

    -- 4. Kontrakan Asri Keluarga (Surabaya)
    INSERT INTO properties (
      id, owner_id, type, name, description, address, kecamatan, kota,
      price_per_month, total_units, available_units, gender_type, wa_number, status, is_featured
    ) VALUES (
      gen_random_uuid(), v_owner_id, 'kontrakan', 'Vilano Kontrakan Rungkut Asri',
      'Kontrakan siap huni di perumahan tenang. 3 Kamar Tidur, 2 Kamar Mandi, Listrik 2200 VA token, PDAM lancar, bebas banjir.',
      'Perum Rungkut Asri Timur No. 12', 'Rungkut', 'Surabaya',
      2800000, 1, 1, 'all', '081555667788', 'active', true
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

