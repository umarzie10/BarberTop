
-- Drop legacy trigger that references old 'employee' role
DROP FUNCTION IF EXISTS public.handle_new_user_role() CASCADE;

DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
  barber_uid uuid := gen_random_uuid();
  client_uid uuid := gen_random_uuid();
  pwd_hash text := crypt('umar.1020', gen_salt('bf'));
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@barber.uz') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@barber.uz', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Administrator"}', now(), now(), '', '', '', '');
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id, admin_id::text, jsonb_build_object('sub', admin_id::text, 'email', 'admin@barber.uz'), 'email', now(), now(), now());
  ELSE
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@barber.uz';
    UPDATE auth.users SET encrypted_password = pwd_hash, email_confirmed_at = now() WHERE id = admin_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'barber@barber.uz') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES (barber_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'barber@barber.uz', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Aziz Barber"}', now(), now(), '', '', '', '');
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), barber_uid, barber_uid::text, jsonb_build_object('sub', barber_uid::text, 'email', 'barber@barber.uz'), 'email', now(), now(), now());
  ELSE
    SELECT id INTO barber_uid FROM auth.users WHERE email = 'barber@barber.uz';
    UPDATE auth.users SET encrypted_password = pwd_hash, email_confirmed_at = now() WHERE id = barber_uid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@barber.uz') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
    VALUES (client_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user@barber.uz', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mijoz Foydalanuvchi"}', now(), now(), '', '', '', '');
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), client_uid, client_uid::text, jsonb_build_object('sub', client_uid::text, 'email', 'user@barber.uz'), 'email', now(), now(), now());
  ELSE
    SELECT id INTO client_uid FROM auth.users WHERE email = 'user@barber.uz';
    UPDATE auth.users SET encrypted_password = pwd_hash, email_confirmed_at = now() WHERE id = client_uid;
  END IF;

  INSERT INTO public.profiles (user_id, full_name) VALUES
    (admin_id, 'Administrator'), (barber_uid, 'Aziz Barber'), (client_uid, 'Mijoz Foydalanuvchi')
  ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name;

  DELETE FROM public.user_roles WHERE user_id IN (admin_id, barber_uid, client_uid);
  INSERT INTO public.user_roles (user_id, role) VALUES
    (admin_id, 'admin'), (barber_uid, 'barber'), (client_uid, 'client');

  INSERT INTO public.barbers (user_id, full_name, specialty, bio, rating)
  VALUES (barber_uid, 'Aziz Barber', 'Klassik soch olish, soqol', 'Tajribali sartarosh, 5+ yil tajriba', 4.9)
  ON CONFLICT (user_id) DO NOTHING;
END $$;

INSERT INTO public.services (name, description, price, duration_minutes) VALUES
  ('Klassik soch olish', 'Mashinka + qaychi bilan', 50000, 30),
  ('Soqol olish va shakllantirish', 'Issiq sochiq bilan', 40000, 25),
  ('Bolalar soch olish', '12 yoshgacha', 35000, 20),
  ('Soch va soqol kompleks', 'Soch + soqol birga', 80000, 50),
  ('Soch bo''yash', 'Professional bo''yoq', 120000, 60);
