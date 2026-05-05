import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Tier = "free" | "pro" | "vip";

// Centralized feature gating config.
// Each feature is unlocked starting from a minimum tier.
export const FEATURE_MIN_TIER: Record<string, { client?: Tier; barber?: Tier }> = {
  // Barber features
  unlimited_clients:    { barber: "pro" },
  sms_reminders:        { barber: "pro" },
  advanced_stats:       { barber: "pro" },
  ai_insights:          { barber: "vip" },
  priority_listing:     { barber: "pro" },
  vip_badge:            { barber: "vip" },
  unlimited_portfolio:  { barber: "pro" },
  custom_promo:         { barber: "vip" },
  // Client features
  see_pro_barbers:      { client: "pro" },
  see_vip_barbers:      { client: "vip" },
  ai_recommendation:    { client: "pro" },
  priority_booking:     { client: "vip" },
  exclusive_discounts:  { client: "vip" },
};

const RANK: Record<Tier, number> = { free: 0, pro: 1, vip: 2 };

export const tierGte = (a: Tier, b: Tier) => RANK[a] >= RANK[b];

export function useTier(audience: "client" | "barber") {
  const { user } = useAuth();
  const [tier, setTier] = useState<Tier>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setTier("free"); setLoading(false); return; }
    setLoading(true);
    supabase.rpc("get_my_tier", { _audience: audience }).then(({ data }) => {
      setTier((data as Tier) || "free");
      setLoading(false);
    });
  }, [user, audience]);

  const can = (feature: keyof typeof FEATURE_MIN_TIER) => {
    const min = FEATURE_MIN_TIER[feature]?.[audience];
    if (!min) return true;
    return tierGte(tier, min);
  };

  return { tier, loading, can };
}
