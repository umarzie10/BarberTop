
ALTER TABLE public.barbers
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male','female','any')) DEFAULT 'any',
  ADD COLUMN IF NOT EXISTS fast_response BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_barbers_region ON public.barbers(region);
CREATE INDEX IF NOT EXISTS idx_barbers_district ON public.barbers(district);
