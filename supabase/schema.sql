-- ============================================
-- Web Kos & Kontrakan - Supabase Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE property_type AS ENUM ('kos', 'kontrakan');
CREATE TYPE gender_type AS ENUM ('putra', 'putri', 'campur', 'all');
CREATE TYPE property_status AS ENUM ('pending', 'active', 'inactive');
CREATE TYPE user_role AS ENUM ('penyewa', 'pemilik', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'penyewa',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth, extensions
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Admin Vilano'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'admin'::public.user_role)
  )
  ON CONFLICT (id) DO UPDATE 
  SET role = EXCLUDED.role;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Prevent aborting auth transaction if profile creation encounters any conflict
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PROPERTIES
-- ============================================

CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type property_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  kecamatan TEXT,
  kota TEXT NOT NULL,
  price_per_month INTEGER NOT NULL,
  total_units INTEGER DEFAULT 1,
  available_units INTEGER DEFAULT 1,
  gender_type gender_type DEFAULT 'all',
  wa_number TEXT,
  status property_status DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTY PHOTOS
-- ============================================

CREATE TABLE property_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FACILITIES
-- ============================================

CREATE TABLE facilities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  category TEXT
);

-- Insert default facilities
INSERT INTO facilities (name, icon, category) VALUES
  ('WiFi', 'wifi', 'internet'),
  ('AC', 'wind', 'kenyamanan'),
  ('Kamar Mandi Dalam', 'bath', 'sanitasi'),
  ('Kamar Mandi Luar', 'droplets', 'sanitasi'),
  ('Dapur', 'utensils', 'fasilitas'),
  ('Parkir Motor', 'bike', 'parkir'),
  ('Parkir Mobil', 'car', 'parkir'),
  ('Listrik (PLN)', 'zap', 'utilitas'),
  ('Air (PDAM)', 'droplets', 'utilitas'),
  ('Lemari', 'package', 'furnitur'),
  ('Kasur', 'bed', 'furnitur'),
  ('Meja Belajar', 'table', 'furnitur'),
  ('Kursi', 'armchair', 'furnitur'),
  ('TV', 'tv', 'hiburan'),
  ('Kulkas', 'refrigerator', 'elektronik'),
  ('Mesin Cuci', 'washing-machine', 'elektronik'),
  ('Security/CCTV', 'shield', 'keamanan'),
  ('Pagar', 'fence', 'keamanan'),
  ('Taman', 'tree-pine', 'outdoor'),
  ('Jemuran', 'shirt', 'fasilitas');

-- ============================================
-- PROPERTY FACILITIES (junction table)
-- ============================================

CREATE TABLE property_facilities (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, facility_id)
);

-- ============================================
-- BOOKINGS
-- ============================================

CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  duration_months INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, reviewer_id)
);

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW properties_with_details AS
SELECT
  p.*,
  pr.full_name AS owner_name,
  pr.phone AS owner_phone,
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(DISTINCT r.id) AS review_count,
  (
    SELECT url FROM property_photos
    WHERE property_id = p.id AND is_primary = TRUE
    LIMIT 1
  ) AS primary_photo
FROM properties p
LEFT JOIN profiles pr ON p.owner_id = pr.id
LEFT JOIN reviews r ON r.property_id = p.id
GROUP BY p.id, pr.full_name, pr.phone;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_kota ON properties(kota);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_reviews_property ON reviews(property_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Active properties viewable by everyone" ON properties
  FOR SELECT USING (status = 'active' OR auth.uid() = owner_id);
CREATE POLICY "Pemilik can insert properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Pemilik can update own properties" ON properties
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Pemilik can delete own properties" ON properties
  FOR DELETE USING (auth.uid() = owner_id);

-- Property photos policies
CREATE POLICY "Photos viewable by everyone" ON property_photos FOR SELECT USING (TRUE);
CREATE POLICY "Owner can manage photos" ON property_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid())
  );

-- Facilities policies
CREATE POLICY "Facilities viewable by everyone" ON facilities FOR SELECT USING (TRUE);

-- Property facilities policies
CREATE POLICY "Property facilities viewable by everyone" ON property_facilities FOR SELECT USING (TRUE);
CREATE POLICY "Owner can manage property facilities" ON property_facilities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid())
  );

-- Bookings policies
CREATE POLICY "Tenants can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Owners can view bookings for their properties" ON bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid())
  );
CREATE POLICY "Tenants can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);
CREATE POLICY "Tenants can update own pending bookings" ON bookings
  FOR UPDATE USING (auth.uid() = tenant_id AND status = 'pending');
CREATE POLICY "Owners can update booking status" ON bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid())
  );

-- Reviews policies
CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Logged in users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- ============================================
-- STORAGE BUCKETS (for Property Photos)
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can view photos'
  ) THEN
    CREATE POLICY "Anyone can view photos" ON storage.objects
      FOR SELECT USING (bucket_id = 'property-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload photos'
  ) THEN
    CREATE POLICY "Authenticated users can upload photos" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'property-photos' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can delete photos'
  ) THEN
    CREATE POLICY "Users can delete photos" ON storage.objects
      FOR DELETE USING (bucket_id = 'property-photos' AND auth.role() = 'authenticated');
  END IF;
END $$;

