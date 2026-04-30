
-- ============ SUBSCRIPTIONS ============
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  audience text NOT NULL CHECK (audience IN ('client','barber')),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration_days integer NOT NULL DEFAULT 30,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  badge text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_sub_user ON public.user_subscriptions(user_id, status);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins manage plans" ON public.subscription_plans FOR ALL USING (has_role(auth.uid(),'admin'));

CREATE POLICY "Users view own subs" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Users create own subs" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cancel own subs" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage subs" ON public.user_subscriptions FOR ALL USING (has_role(auth.uid(),'admin'));

-- Helper: get active subscription tier for a user
CREATE OR REPLACE FUNCTION public.get_active_plan(_user_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT sp.code FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON sp.id = us.plan_id
  WHERE us.user_id = _user_id AND us.status = 'active' AND us.expires_at > now()
  ORDER BY us.expires_at DESC LIMIT 1;
$$;

-- ============ PORTFOLIO ============
CREATE TABLE public.barber_portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.barber_portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view portfolio" ON public.barber_portfolio FOR SELECT USING (true);
CREATE POLICY "Barber manage own portfolio" ON public.barber_portfolio FOR ALL
  USING (EXISTS(SELECT 1 FROM public.barbers b WHERE b.id = barber_portfolio.barber_id AND b.user_id = auth.uid()));
CREATE POLICY "Admins manage portfolio" ON public.barber_portfolio FOR ALL USING (has_role(auth.uid(),'admin'));

-- ============ SCHEDULE ============
CREATE TABLE public.barber_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_off boolean NOT NULL DEFAULT false,
  start_time time NOT NULL DEFAULT '09:00',
  end_time time NOT NULL DEFAULT '20:00',
  break_start time,
  break_end time,
  UNIQUE(barber_id, day_of_week)
);
ALTER TABLE public.barber_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view schedule" ON public.barber_schedule FOR SELECT USING (true);
CREATE POLICY "Barber manage own schedule" ON public.barber_schedule FOR ALL
  USING (EXISTS(SELECT 1 FROM public.barbers b WHERE b.id = barber_schedule.barber_id AND b.user_id = auth.uid()));
CREATE POLICY "Admins manage schedule" ON public.barber_schedule FOR ALL USING (has_role(auth.uid(),'admin'));

-- ============ REVIEWS ============
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_barber ON public.reviews(barber_id);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Clients write reviews" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = client_id AND EXISTS(
    SELECT 1 FROM public.appointments a
    WHERE a.id = reviews.appointment_id
      AND a.client_id = auth.uid()
      AND a.status = 'completed'
  )
);
CREATE POLICY "Clients edit own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Clients delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = client_id);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (has_role(auth.uid(),'admin'));

-- Recompute barber rating on review change
CREATE OR REPLACE FUNCTION public.recalc_barber_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE bid uuid;
BEGIN
  bid := COALESCE(NEW.barber_id, OLD.barber_id);
  UPDATE public.barbers SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric,2) FROM public.reviews WHERE barber_id = bid),5)
  WHERE id = bid;
  RETURN NULL;
END; $$;
CREATE TRIGGER trg_reviews_recalc AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recalc_barber_rating();

-- ============ CHAT ============
CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  barber_user_id uuid NOT NULL,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, barber_user_id)
);
CREATE INDEX idx_chat_thread_client ON public.chat_threads(client_id);
CREATE INDEX idx_chat_thread_barber ON public.chat_threads(barber_user_id);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_msg_thread ON public.chat_messages(thread_id, created_at);

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view threads" ON public.chat_threads FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = barber_user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Anyone create thread" ON public.chat_threads FOR INSERT
  WITH CHECK (auth.uid() = client_id OR auth.uid() = barber_user_id);
CREATE POLICY "Participants update thread" ON public.chat_threads FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = barber_user_id);

CREATE POLICY "Participants view messages" ON public.chat_messages FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.chat_threads t WHERE t.id = chat_messages.thread_id
    AND (t.client_id = auth.uid() OR t.barber_user_id = auth.uid() OR has_role(auth.uid(),'admin')))
);
CREATE POLICY "Participants send messages" ON public.chat_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS(SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id
    AND (t.client_id = auth.uid() OR t.barber_user_id = auth.uid()))
);

CREATE OR REPLACE FUNCTION public.bump_thread()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.chat_threads SET last_message_at = NEW.created_at WHERE id = NEW.thread_id;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_chat_bump AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.bump_thread();

-- ============ AI CONVERSATIONS ============
CREATE TABLE public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_msg_conv ON public.ai_messages(conversation_id, created_at);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own conv" ON public.ai_conversations FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own ai msg" ON public.ai_messages FOR ALL
  USING (EXISTS(SELECT 1 FROM public.ai_conversations c WHERE c.id = ai_messages.conversation_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS(SELECT 1 FROM public.ai_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid()));

-- ============ STORAGE ============
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio','portfolio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Auth upload portfolio" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner update portfolio" ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner delete portfolio" ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_threads REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.user_subscriptions REPLICA IDENTITY FULL;

-- ============ SEED DEFAULT PLANS ============
INSERT INTO public.subscription_plans (code, audience, name, price, duration_days, badge, sort_order, features) VALUES
('client_free','client','Free',0,365,NULL,1,'["Oddiy bron","Barber ko''rish","Reyting yozish"]'::jsonb),
('client_premium','client','Premium',39000,30,'PREMIUM',2,'["Navbatsiz bron","Top barberlar","AI tavsiyalar","Maxsus chegirmalar","VIP support","Sevimli barberlar"]'::jsonb),
('barber_free','barber','Free',0,365,NULL,1,'["10 ta bron limit","Oddiy profil"]'::jsonb),
('barber_pro','barber','Pro',99000,30,'PRO',2,'["Cheksiz bron","Statistika","AI analytics","Portfolio","Top search","Premium badge"]'::jsonb),
('barber_vip','barber','VIP',299000,30,'VIP',3,'["Home page top","Reklama","AI klient tavsiyasi","Prioritet support","Daromad hisobi","Bir nechta filial"]'::jsonb);
