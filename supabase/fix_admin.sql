-- ============================================================
-- SCRIPT PERBAIKAN SUPABASE AUTH & ADMIN VILANO
-- Jalankan seluruh script ini di Supabase SQL Editor (Run / Ctrl+Enter)
-- ============================================================

-- 1. Enable extension pgcrypto & uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bersihkan NULL pada kolom token auth.users
-- (Penyebab utama error: "Database error loading user" & "Database error creating new user")
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  phone_change_token = COALESCE(phone_change_token, '')
WHERE confirmation_token IS NULL
   OR recovery_token IS NULL
   OR email_change_token_new IS NULL
   OR email_change IS NULL
   OR reauthentication_token IS NULL;

-- 3. Perbaiki Trigger handle_new_user dengan perlindungan Exception
-- (Supaya tidak pernah menggagalkan create user di Dashboard)
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
    'admin'::public.user_role
  )
  ON CONFLICT (id) DO UPDATE 
  SET role = 'admin'::public.user_role;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Pastikan Akun admin@vilano.com Tersedia, Dikonfirmasi & Password 'admin123'
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@vilano.com';

  IF v_user_id IS NULL THEN
    v_user_id := uuid_generate_v4();

    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      aud,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      reauthentication_token,
      phone_change_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@vilano.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Admin Vilano", "role": "admin"}',
      FALSE,
      'authenticated',
      'authenticated',
      '',
      '',
      '',
      '',
      '',
      ''
    );
  ELSE
    -- Jika user sudah ada, reset password menjadi admin123 & pastikan email confirmed
    UPDATE auth.users
    SET 
      encrypted_password = crypt('admin123', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW(),
      confirmation_token = COALESCE(confirmation_token, ''),
      recovery_token = COALESCE(recovery_token, ''),
      email_change_token_new = COALESCE(email_change_token_new, ''),
      email_change = COALESCE(email_change, ''),
      reauthentication_token = COALESCE(reauthentication_token, ''),
      phone_change_token = COALESCE(phone_change_token, '')
    WHERE id = v_user_id;
  END IF;

  -- Pastikan identity di auth.identities ada
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_user_id,
    format('{"sub":"%s","email":"admin@vilano.com"}', v_user_id)::jsonb,
    'email',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (provider, id) DO UPDATE 
  SET updated_at = NOW();

  -- Pastikan profile di public.profiles adalah admin
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    v_user_id,
    'Admin Vilano',
    '',
    'admin'::public.user_role
  )
  ON CONFLICT (id) DO UPDATE 
  SET role = 'admin'::public.user_role,
      full_name = 'Admin Vilano';

END $$;

-- 5. Cek Hasil
SELECT u.id, u.email, u.email_confirmed_at, p.role, p.full_name 
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'admin@vilano.com';
