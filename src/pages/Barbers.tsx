import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTier } from "@/hooks/usePlanFeatures";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { Plus, Trash2, Star, Crown, Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { distanceKm, getBrowserLocation } from "@/lib/geo";

const REGIONS = ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan", "Qashqadaryo", "Surxondaryo", "Xorazm", "Navoiy", "Jizzax", "Sirdaryo", "Qoraqalpog'iston"];
const TASHKENT_DISTRICTS = ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Yashnobod", "Sergeli", "Yakkasaroy", "Mirobod", "Shayxontohur", "Olmazor", "Bektemir", "Uchtepa"];

type SortKey = "rating" | "priceLow" | "priceHigh" | "exp";

export default function Barbers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isAdmin, role } = useUserRole();
  const { tier: myTier } = useTier("client");

  const [items, setItems] = useState<any[]>([]);
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [creating, setCreating] = useState(false);

  // filter state
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [minExp, setMinExp] = useState(0);
  const [gender, setGender] = useState("");
  const [chips, setChips] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [myLoc, setMyLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(0); // 0 = any

  const requestLocation = async () => {
    try {
      const loc = await getBrowserLocation();
      setMyLoc(loc);
      if (!radiusKm) setRadiusKm(5);
      toast.success("Joylashuv aniqlandi");
    } catch {
      toast.error("Joylashuvga ruxsat berilmadi");
    }
  };

  const load = async () => {
    const { data } = await supabase.from("barbers").select("*").eq("active", true);
    setItems(data || []);
    const { data: subs } = await supabase.rpc("get_active_barber_plans");
    const map: Record<string, string> = {};
    (subs || []).forEach((s: any) => { map[s.user_id] = s.tier; });
    setPlans(map);
  };
  useEffect(() => { load(); }, []);

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

  const toggleChip = (key: string) => {
    const next = new Set(chips);
    next.has(key) ? next.delete(key) : next.add(key);
    setChips(next);
  };

  const reset = () => {
    setQ(""); setRegion(""); setDistrict(""); setMinRating(0); setMinExp(0); setGender(""); setChips(new Set()); setSort("rating");
  };

  const filtered = useMemo(() => {
    let list = items;

    // PLAN GATING for clients: free → only free, pro → free+pro, vip → all
    if (role === "client") {
      list = list.filter((b) => {
        const bTier = plans[b.user_id] || "free";
        if (myTier === "vip") return true;
        if (myTier === "pro") return bTier !== "vip";
        return bTier === "free";
      });
    }

    if (q) {
      const lq = q.toLowerCase();
      list = list.filter((b) =>
        b.full_name?.toLowerCase().includes(lq) ||
        b.specialty?.toLowerCase().includes(lq) ||
        b.bio?.toLowerCase().includes(lq)
      );
    }
    if (region) list = list.filter((b) => b.region === region);
    if (district) list = list.filter((b) => b.district === district);
    if (minRating > 0) list = list.filter((b) => Number(b.rating) >= minRating);
    if (minExp > 0) list = list.filter((b) => (b.experience_years || 0) >= minExp);
    if (gender) list = list.filter((b) => b.gender === gender || b.gender === "any");

    if (chips.has("pro")) list = list.filter((b) => plans[b.user_id] === "pro" || plans[b.user_id] === "vip");
    if (chips.has("vip")) list = list.filter((b) => plans[b.user_id] === "vip");
    if (chips.has("home")) list = list.filter((b) => b.home_service);
    if (chips.has("fast")) list = list.filter((b) => b.fast_response);
    if (chips.has("top")) list = list.filter((b) => Number(b.rating) >= 4.5);
    if (chips.has("open")) list = list.filter((b) => !b.busy_status);

    // sort
    const sorted = [...list].sort((a, b) => {
      const tierRank = (uid: string) => plans[uid] === "vip" ? 2 : plans[uid] === "pro" ? 1 : 0;
      const tierDiff = tierRank(b.user_id) - tierRank(a.user_id);
      if (tierDiff !== 0 && sort === "rating") return tierDiff || Number(b.rating) - Number(a.rating);
      switch (sort) {
        case "rating": return Number(b.rating) - Number(a.rating);
        case "exp": return (b.experience_years || 0) - (a.experience_years || 0);
        case "priceLow": case "priceHigh": return Number(b.rating) - Number(a.rating); // price not on barber
      }
      return 0;
    });
    return sorted;
  }, [items, plans, q, region, district, minRating, minExp, gender, chips, sort, role, myTier]);

  const districts = region === "Toshkent" ? TASHKENT_DISTRICTS : [];

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
              <label className="text-xs text-muted-foreground block mb-1">{t("field.fullName")}</label>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div className="col-span-full flex gap-2">
              <button disabled={creating} type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md disabled:opacity-50">{creating ? "..." : t("common.save")}</button>
              <button type="button" onClick={() => setShow(false)} className="px-4 py-2 text-sm bg-muted rounded-md">{t("common.cancel")}</button>
            </div>
          </form>
        </Card>
      )}

      {/* Search + filter toggle */}
      <div className="mb-3 flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-background">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("filter.search")} className="flex-1 bg-transparent text-sm focus:outline-none" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-2 text-xs border border-border rounded-md bg-background hover:bg-muted flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" /> {t("filter.title")}
        </button>
      </div>

      {/* Filter chips */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {[
          ["top", t("filter.chip.top")],
          ["open", t("filter.chip.open")],
          ["pro", t("filter.chip.pro")],
          ["vip", t("filter.chip.vip")],
          ["home", t("filter.chip.home")],
          ["fast", t("filter.chip.fast")],
        ].map(([k, label]) => (
          <button key={k} onClick={() => toggleChip(k)}
            className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap forge-transition ${chips.has(k) ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background hover:border-primary"}`}>
            {label}
          </button>
        ))}
        {(chips.size > 0 || q || region || minRating || minExp || gender) && (
          <button onClick={reset} className="px-3 py-1.5 text-xs rounded-full border border-destructive/40 text-destructive hover:bg-destructive/10 flex items-center gap-1 whitespace-nowrap">
            <X className="w-3 h-3" /> {t("filter.reset")}
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <Card className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("filter.region")}</label>
              <select value={region} onChange={(e) => { setRegion(e.target.value); setDistrict(""); }} className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background">
                <option value="">{t("filter.all")}</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("filter.district")}</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!districts.length} className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background disabled:opacity-50">
                <option value="">{t("filter.all")}</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("filter.rating")}</label>
              <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background">
                <option value={0}>{t("filter.all")}</option>
                <option value={3}>3⭐+</option>
                <option value={4}>4⭐+</option>
                <option value={4.5}>4.5⭐+</option>
                <option value={5}>5⭐</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("filter.experience")}</label>
              <select value={minExp} onChange={(e) => setMinExp(Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background">
                <option value={0}>{t("filter.all")}</option>
                <option value={1}>1+ {t("common.year")}</option>
                <option value={3}>3+ {t("common.year")}</option>
                <option value={5}>5+ {t("common.year")}</option>
                <option value={10}>10+ {t("common.year")}</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("filter.gender")}</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background">
                <option value="">{t("filter.all")}</option>
                <option value="male">{t("filter.male")}</option>
                <option value="female">{t("filter.female")}</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("filter.sort")}</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background">
                <option value="rating">{t("filter.sort.rating")}</option>
                <option value="exp">{t("filter.sort.exp")}</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground mb-3">{filtered.length} {t("filter.results")}</p>

      {!filtered.length ? <Empty text={t("common.empty")} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((b) => {
            const tier = plans[b.user_id];
            return (
            <Card key={b.id} className={`relative cursor-pointer hover:border-primary forge-transition ${tier === "vip" ? "ring-2 ring-yellow-400/50" : ""}`}>
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
                  {b.experience_years > 0 && <span className="text-muted-foreground">· {b.experience_years} {t("common.year")}</span>}
                  {b.district && <span className="text-muted-foreground">· {b.district}</span>}
                  {b.busy_status && <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">Bandman</span>}
                  {b.home_service && <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">🏠</span>}
                  {b.fast_response && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 rounded">⚡</span>}
                </div>
              </div>
            </Card>
          );})}
        </div>
      )}
    </div>
  );
}
