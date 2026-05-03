import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { Plus, Trash2, Star, Crown } from "lucide-react";
import { toast } from "sonner";

export default function Barbers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isAdmin, role } = useUserRole();
  const [items, setItems] = useState<any[]>([]);
  const [plans, setPlans] = useState<Record<string, string>>({}); // user_id -> tier
  const [myTier, setMyTier] = useState<"free" | "pro" | "vip">("free");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("barbers").select("*").order("rating", { ascending: false });
    setItems(data || []);
    const { data: subs } = await supabase.rpc("get_active_barber_plans");
    const map: Record<string, string> = {};
    (subs || []).forEach((s: any) => { map[s.user_id] = s.tier; });
    setPlans(map);
    if (user && role === "client") {
      const { data: tier } = await supabase.rpc("get_my_tier", { _audience: "client" });
      if (tier) setMyTier(tier as any);
    }
  };
  useEffect(() => { load(); }, [user, role]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Email va parol kiriting");
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("create-barber", { body: form });
    setCreating(false);
    if (error || data?.error) return toast.error(error?.message || data?.error || "Xato");
    toast.success("Barber yaratildi"); setShow(false); setForm({ email: "", password: "", full_name: "" }); load();
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    const { error } = await supabase.from("barbers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  // For clients: filter by tier (free→only free, pro→free+pro, vip→all)
  let visible = items;
  if (role === "client") {
    visible = items.filter((b) => {
      const bTier = plans[b.user_id] || "free";
      if (myTier === "vip") return true;
      if (myTier === "pro") return bTier !== "vip";
      return bTier === "free";
    });
  }

  const sorted = [...visible].sort((a, b) => {
    const rank = (p: string) => p === "vip" ? 2 : p === "pro" ? 1 : 0;
    return rank(plans[b.user_id] || "") - rank(plans[a.user_id] || "") || Number(b.rating) - Number(a.rating);
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title={t("nav.barbers")} action={isAdmin ? (
        <button onClick={() => setShow(true)} className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" />{t("common.add")}</button>
      ) : null} />

      {show && (
        <Card className="mb-4">
          <h4 className="text-sm font-semibold mb-1">{t("barbers.addTitle")}</h4>
          <p className="text-xs text-muted-foreground mb-3">{t("barbers.addNote")}</p>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("auth.email")}</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="barber@example.com" className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("auth.password")}</label>
              <input required type="text" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1">{t("field.fullName")} <span className="text-muted-foreground">(ixtiyoriy)</span></label>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div className="col-span-full flex gap-2">
              <button disabled={creating} type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md disabled:opacity-50">{creating ? "..." : t("common.save")}</button>
              <button type="button" onClick={() => setShow(false)} className="px-4 py-2 text-sm bg-muted rounded-md">{t("common.cancel")}</button>
            </div>
          </form>
        </Card>
      )}

      {!sorted.length ? <Empty text={t("common.empty")} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((b) => {
            const tier = plans[b.user_id];
            return (
            <Card key={b.id} className={`relative cursor-pointer hover:border-primary forge-transition ${tier === "vip" ? "ring-2 ring-yellow-400/50" : ""}`} >
              {tier && tier !== "free" && (
                <span className={`absolute top-3 left-3 z-10 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${tier === "vip" ? "bg-yellow-400 text-black" : "bg-primary text-primary-foreground"}`}>
                  <Crown className="w-3 h-3" /> {tier.toUpperCase()}
                </span>
              )}
              {isAdmin && <button onClick={(e) => { e.stopPropagation(); del(b.id); }} className="absolute top-3 right-3 p-1 hover:bg-destructive/10 text-destructive rounded z-10"><Trash2 className="w-3.5 h-3.5" /></button>}
              <div onClick={() => navigate(`/barbers/${b.id}`)}>
                <div className="flex items-center gap-3 mt-4">
                  {b.photo_url ? <img src={b.photo_url} className="w-12 h-12 rounded-full object-cover" /> : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {b.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{b.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{b.specialty}</p>
                  </div>
                </div>
                {b.bio && <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{b.bio}</p>}
                <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-foreground font-medium">{Number(b.rating).toFixed(1)}</span>
                  {b.busy_status && <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">Bandman</span>}
                  {b.home_service && <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">Uyga boradi</span>}
                </div>
              </div>
            </Card>
          );})}
        </div>
      )}
    </div>
  );
}
