import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toast } from "sonner";
import { Check, Crown, Star } from "lucide-react";

export default function Plans() {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { t } = useLanguage();
  const [plans, setPlans] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const audience = role === "barber" ? "barber" : "client";

  const load = async () => {
    const { data } = await supabase.from("subscription_plans").select("*").eq("audience", audience).eq("active", true).order("sort_order");
    setPlans(data || []);
    if (user) {
      const { data: sub } = await supabase.from("user_subscriptions").select("*, subscription_plans(*)")
        .eq("user_id", user.id).eq("status", "active").gt("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: false }).limit(1).maybeSingle();
      setActive(sub);
    }
  };
  useEffect(() => { load(); }, [user, role]);

  const subscribe = async (p: any) => {
    if (!user) return;
    setLoading(p.id);
    const expires = new Date(Date.now() + p.duration_days * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("user_subscriptions").insert({
      user_id: user.id, plan_id: p.id, expires_at: expires, status: "active",
    });
    setLoading(null);
    if (error) return toast.error(error.message);
    toast.success(`${p.name} faollashtirildi! (mock)`); load();
  };

  const tiers: ("free" | "pro" | "vip")[] = ["free", "pro", "vip"];
  const tierMeta: Record<string, { icon: any; label: string; color: string }> = {
    free: { icon: Check, label: t("plans.tier.free"), color: "border-border" },
    pro: { icon: Star, label: t("plans.tier.pro"), color: "border-primary" },
    vip: { icon: Crown, label: t("plans.tier.vip"), color: "border-yellow-400" },
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title={t("plans.title")} subtitle={t("plans.subtitle")} />
      {active && (
        <Card className="mb-6 border-primary/40 bg-primary/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-wider">{t("plans.current")}</p>
              <p className="text-lg font-semibold text-foreground mt-1">{active.subscription_plans?.name}</p>
              <p className="text-xs text-muted-foreground">{t("plans.until")}: {new Date(active.expires_at).toLocaleDateString()}</p>
            </div>
            {active.subscription_plans?.badge && (
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">{active.subscription_plans.badge}</span>
            )}
          </div>
        </Card>
      )}
      {!plans.length ? <Empty text={t("common.empty")} /> : (
        <div className="space-y-8">
          {tiers.map((tier) => {
            const tierPlans = plans.filter((p) => p.tier === tier);
            if (!tierPlans.length) return null;
            const meta = tierMeta[tier];
            const Icon = meta.icon;
            const features = tierPlans[0].features as string[];
            return (
              <Card key={tier} className={`border-2 ${meta.color}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">{meta.label}</h2>
                </div>

                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 mb-5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tierPlans.map((p) => {
                    const isActive = active?.plan_id === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={isActive || loading === p.id || tier === "free"}
                        onClick={() => subscribe(p)}
                        className={`p-3 rounded-md border text-left forge-transition ${isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}
                      >
                        <p className="text-xs text-muted-foreground">{p.duration_label}</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {p.price > 0 ? `${Number(p.price).toLocaleString()} so'm` : t("plans.free")}
                        </p>
                        <p className="text-[10px] text-primary mt-1">
                          {isActive ? t("plans.active") : tier === "free" ? "—" : t("plans.subscribe")}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <p className="text-xs text-muted-foreground text-center mt-6">{t("plans.mockNote")}</p>
    </div>
  );
}
