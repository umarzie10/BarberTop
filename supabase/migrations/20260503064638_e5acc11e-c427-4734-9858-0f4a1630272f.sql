
-- Add tier and duration label
ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS duration_label text;

-- Wipe existing plans and reseed
DELETE FROM public.user_subscriptions;
DELETE FROM public.subscription_plans;

-- Barber plans
INSERT INTO public.subscription_plans (code, name, audience, tier, price, duration_days, duration_label, badge, sort_order, features) VALUES
('barber_free',     'FREE',         'barber', 'free', 0,      30,  'Doimiy', NULL,  10, '["Online navbat olish","Ish vaqtini belgilash","Mijozlar ro''yxati","Telegram xabarnoma","Oddiy statistika","BarberTop profili"]'::jsonb),
('barber_pro_1m',   'PRO 1 oy',     'barber', 'pro',  39000,  30,  '1 oy',   'PRO', 20, '["Cheksiz mijozlar","SMS eslatmalar","To''liq statistika","Portfolio yuklash","Sharh va reytinglar","Reklamasiz foydalanish","QR orqali bron"]'::jsonb),
('barber_pro_3m',   'PRO 3 oy',     'barber', 'pro',  99000,  90,  '3 oy',   'PRO', 21, '["PRO barcha imkoniyatlari","15% chegirma"]'::jsonb),
('barber_pro_6m',   'PRO 6 oy',     'barber', 'pro',  179000, 180, '6 oy',   'PRO', 22, '["PRO barcha imkoniyatlari","23% chegirma"]'::jsonb),
('barber_pro_1y',   'PRO 1 yil',    'barber', 'pro',  299000, 365, '1 yil',  'PRO', 23, '["PRO barcha imkoniyatlari","36% chegirma"]'::jsonb),
('barber_vip_1m',   'VIP 1 oy',     'barber', 'vip',  79000,  30,  '1 oy',   'VIP', 30, '["PRO dagi barcha imkoniyatlar","VIP belgi","Qidiruvda tepada chiqish","Premium profil dizayni","Kuchaytirilgan reklama","Batafsil statistika","Prioritet support"]'::jsonb),
('barber_vip_3m',   'VIP 3 oy',     'barber', 'vip',  199000, 90,  '3 oy',   'VIP', 31, '["VIP barcha imkoniyatlari","16% chegirma"]'::jsonb),
('barber_vip_6m',   'VIP 6 oy',     'barber', 'vip',  349000, 180, '6 oy',   'VIP', 32, '["VIP barcha imkoniyatlari","26% chegirma"]'::jsonb),
('barber_vip_1y',   'VIP 1 yil',    'barber', 'vip',  599000, 365, '1 yil',  'VIP', 33, '["VIP barcha imkoniyatlari","37% chegirma"]'::jsonb);

-- Client plans
INSERT INTO public.subscription_plans (code, name, audience, tier, price, duration_days, duration_label, badge, sort_order, features) VALUES
('client_free',     'FREE',         'client', 'free', 0,      30,  'Doimiy', NULL,  10, '["Barber qidirish","Online bron qilish","Sharh yozish","Portfolio ko''rish","Telegram eslatmalar","Sevimli barberlarni saqlash"]'::jsonb),
('client_pro_1m',   'PRO 1 oy',     'client', 'pro',  19000,  30,  '1 oy',   'PRO', 20, '["Reklamasiz foydalanish","Bronlarni tezroq tasdiqlash","Premium barberlarni ko''rish","Bron tarixini saqlash","Tez qayta bron qilish","Eslatmalarni sozlash","Maxsus chegirmalar"]'::jsonb),
('client_pro_3m',   'PRO 3 oy',     'client', 'pro',  49000,  90,  '3 oy',   'PRO', 21, '["PRO barcha imkoniyatlari","14% chegirma"]'::jsonb),
('client_pro_6m',   'PRO 6 oy',     'client', 'pro',  89000,  180, '6 oy',   'PRO', 22, '["PRO barcha imkoniyatlari","22% chegirma"]'::jsonb),
('client_pro_1y',   'PRO 1 yil',    'client', 'pro',  149000, 365, '1 yil',  'PRO', 23, '["PRO barcha imkoniyatlari","35% chegirma"]'::jsonb),
('client_vip_1m',   'VIP 1 oy',     'client', 'vip',  39000,  30,  '1 oy',   'VIP', 30, '["PRO dagi barcha imkoniyatlar","TOP barberlarga oldinroq yozilish","VIP badge","Maxsus aksiyalar","Prioritet bron","Eng yaxshi barber tavsiyalari","Chegirmali VIP kunlar","Premium support"]'::jsonb),
('client_vip_3m',   'VIP 3 oy',     'client', 'vip',  99000,  90,  '3 oy',   'VIP', 31, '["VIP barcha imkoniyatlari","16% chegirma"]'::jsonb),
('client_vip_6m',   'VIP 6 oy',     'client', 'vip',  179000, 180, '6 oy',   'VIP', 32, '["VIP barcha imkoniyatlari","23% chegirma"]'::jsonb),
('client_vip_1y',   'VIP 1 yil',    'client', 'vip',  299000, 365, '1 yil',  'VIP', 33, '["VIP barcha imkoniyatlari","36% chegirma"]'::jsonb);

-- Update RPC to return tier (for ranking + filtering)
DROP FUNCTION IF EXISTS public.get_active_barber_plans();
CREATE OR REPLACE FUNCTION public.get_active_barber_plans()
RETURNS TABLE(user_id uuid, tier text, code text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT us.user_id, sp.tier, sp.code
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON sp.id = us.plan_id
  WHERE us.status = 'active' AND us.expires_at > now() AND sp.audience = 'barber';
$$;

-- Get current user's tier (for client filter)
CREATE OR REPLACE FUNCTION public.get_my_tier(_audience text DEFAULT 'client')
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT sp.tier FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON sp.id = us.plan_id
    WHERE us.user_id = auth.uid() AND us.status = 'active'
      AND us.expires_at > now() AND sp.audience = _audience
    ORDER BY CASE sp.tier WHEN 'vip' THEN 3 WHEN 'pro' THEN 2 ELSE 1 END DESC
    LIMIT 1
  ), 'free');
$$;
