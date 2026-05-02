-- Extend barbers with profile fields
ALTER TABLE public.barbers
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS telegram_username text,
  ADD COLUMN IF NOT EXISTS cover_url text,
  ADD COLUMN IF NOT EXISTS experience_years integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS tiktok text,
  ADD COLUMN IF NOT EXISTS youtube text,
  ADD COLUMN IF NOT EXISTS salon_name text,
  ADD COLUMN IF NOT EXISTS salon_address text,
  ADD COLUMN IF NOT EXISTS map_link text,
  ADD COLUMN IF NOT EXISTS home_service boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS busy_status boolean NOT NULL DEFAULT false;

-- Per-barber services
CREATE TABLE IF NOT EXISTS public.barber_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  discount_percent integer NOT NULL DEFAULT 0,
  duration_minutes integer NOT NULL DEFAULT 30,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.barber_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view barber services" ON public.barber_services FOR SELECT USING (true);
CREATE POLICY "Barber manage own services" ON public.barber_services FOR ALL
  USING (EXISTS (SELECT 1 FROM public.barbers b WHERE b.id = barber_services.barber_id AND b.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.barbers b WHERE b.id = barber_services.barber_id AND b.user_id = auth.uid()));
CREATE POLICY "Admins manage barber services" ON public.barber_services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_barber_services_updated BEFORE UPDATE ON public.barber_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Portfolio extensions
ALTER TABLE public.barber_portfolio
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS before_url text,
  ADD COLUMN IF NOT EXISTS after_url text;

-- Blacklist
CREATE TABLE IF NOT EXISTS public.barber_blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (barber_id, client_id)
);
ALTER TABLE public.barber_blacklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Barber manage own blacklist" ON public.barber_blacklist FOR ALL
  USING (EXISTS (SELECT 1 FROM public.barbers b WHERE b.id = barber_blacklist.barber_id AND b.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.barbers b WHERE b.id = barber_blacklist.barber_id AND b.user_id = auth.uid()));
CREATE POLICY "Admins manage blacklist" ON public.barber_blacklist FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Review replies
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS reply text,
  ADD COLUMN IF NOT EXISTS replied_at timestamptz;

-- Storage bucket for covers/avatars (reuse portfolio bucket — already public)

-- Indexes
CREATE INDEX IF NOT EXISTS idx_barber_services_barber ON public.barber_services(barber_id);
CREATE INDEX IF NOT EXISTS idx_barber_blacklist_barber ON public.barber_blacklist(barber_id);
