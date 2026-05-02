import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toCSV, downloadCSV, pickCSVFile } from "@/lib/csv";
import { Plus, Download, Upload, Trash2, Star, Crown } from "lucide-react";
import { toast } from "sonner";

export default function Barbers() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAdmin } = useUserRole();
  const [items, setItems] = useState<any[]>([]);
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ full_name: "", specialty: "", bio: "" });

  const load = async () => {
    const { data } = await supabase.from("barbers").select("*").order("rating", { ascending: false });
    setItems(data || []);
    const userIds = (data || []).map((b: any) => b.user_id).filter(Boolean);
    if (userIds.length) {
      const { data: subs } = await supabase.from("user_subscriptions")
        .select("user_id, status, expires_at, subscription_plans(code, audience)")
        .in("user_id", userIds).eq("status", "active");
      const map: Record<string, string> = {};
      (subs || []).forEach((s: any) => {
        if (s.subscription_plans?.audience !== "barber") return;
        if (new Date(s.expires_at) > new Date()) map[s.user_id] = s.subscription_plans.code;
      });
      setPlans(map);
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("barbers").insert({ full_name: form.full_name, specialty: form.specialty, bio: form.bio });
    if (error) return toast.error(error.message);
    toast.success("Saqlandi"); setShow(false); setForm({ full_name: "", specialty: "", bio: "" }); load();
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    const { error } = await supabase.from("barbers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const exportCSV = () => downloadCSV("barbers.csv", toCSV(items.map((b) => ({ full_name: b.full_name, specialty: b.specialty, bio: b.bio, rating: b.rating, active: b.active }))));
  const importCSV = async () => {
    try {
      const rows = await pickCSVFile();
      const payload = rows.filter((r) => r.full_name).map((r) => ({
        full_name: r.full_name, specialty: r.specialty || null, bio: r.bio || null,
        rating: Number(r.rating) || 5, active: r.active !== "false",
      }));
      if (!payload.length) return toast.error("Bo'sh");
      const { error } = await supabase.from("barbers").insert(payload);
      if (error) throw error;
      toast.success(`${payload.length} qo'shildi`); load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title={t("nav.barbers")} action={isAdmin ? (
        <>
          <button onClick={importCSV} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" />{t("common.import")}</button>
          <button onClick={exportCSV} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />{t("common.export")}</button>
          <button onClick={() => setShow(true)} className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" />{t("common.add")}</button>
        </>
      ) : null} />

      {show && (
        <Card className="mb-4">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder={t("field.fullName")} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <input placeholder={t("field.specialty")} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <input placeholder={t("field.bio")} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="col-span-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <div className="col-span-full flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">{t("common.save")}</button>
              <button type="button" onClick={() => setShow(false)} className="px-4 py-2 text-sm bg-muted rounded-md">{t("common.cancel")}</button>
            </div>
          </form>
        </Card>
      )}

      {!items.length ? <Empty text={t("common.empty")} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...items].sort((a, b) => {
            const rank = (p: string) => p === "vip" ? 2 : p === "pro" ? 1 : 0;
            return rank(plans[b.user_id] || "") - rank(plans[a.user_id] || "") || Number(b.rating) - Number(a.rating);
          }).map((b) => {
            const plan = plans[b.user_id];
            return (
            <Card key={b.id} className={`relative cursor-pointer hover:border-primary forge-transition ${plan === "vip" ? "ring-2 ring-yellow-400/50" : ""}`} >
              {plan && (
                <span className={`absolute top-3 left-3 z-10 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${plan === "vip" ? "bg-yellow-400 text-black" : "bg-primary text-primary-foreground"}`}>
                  <Crown className="w-3 h-3" /> {plan.toUpperCase()}
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
