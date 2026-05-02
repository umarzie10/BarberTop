CREATE OR REPLACE FUNCTION public.get_active_barber_plans()
RETURNS TABLE (user_id uuid, code text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT us.user_id, sp.code
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON sp.id = us.plan_id
  WHERE us.status = 'active' AND us.expires_at > now() AND sp.audience = 'barber';
$$;
GRANT EXECUTE ON FUNCTION public.get_active_barber_plans() TO anon, authenticated;
