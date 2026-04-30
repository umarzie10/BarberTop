import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toast } from "sonner";
import { Check, Crown, Star, Zap } from "lucide-react";

const ICONS: Record<string, any> = { PREMIUM: Crown, PRO: Star, VIP: Zap };

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
    toast.success(`${p.name} rejasi faollashtirildi! (mock to'lov)`);
    load();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const Icon = ICONS[p.badge] || Check;
            const isActive = active?.plan_id === p.id;
            const featured = !!p.badge && p.badge !== "PREMIUM";
            return (
              <Card key={p.id} className={`flex flex-col ${featured ? "border-primary shadow-lg" : ""}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                  {p.badge && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">{p.badge}</span>}
                </div>
                <div className="my-4">
                  <span className="text-3xl font-bold text-foreground">{p.price > 0 ? `${Number(p.price).toLocaleString()}` : t("plans.free")}</span>
                  {p.price > 0 && <span className="text-sm text-muted-foreground"> so'm / {p.duration_days}d</span>}
                </div>
                <ul className="space-y-2 flex-1 mb-4">
                  {(p.features as string[]).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button disabled={isActive || loading === p.id} onClick={() => subscribe(p)}
                  className={`w-full py-2.5 text-sm font-medium rounded-md forge-transition ${isActive ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:opacity-90"} disabled:opacity-60`}>
                  {isActive ? t("plans.active") : loading === p.id ? "..." : t("plans.subscribe")}
                </button>
              </Card>
            );
          })}
        </div>
      )}
      <p className="text-xs text-muted-foreground text-center mt-6">{t("plans.mockNote")}</p>
    </div>
  );
}
