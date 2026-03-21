import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, Home, DollarSign, MapPin, Users, MoreHorizontal } from "lucide-react";

const RealEstateModule = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", price: "", type: "" });

  const l = {
    title: { uz: "Ko'chmas mulk", ru: "Недвижимость", en: "Real Estate" },
    subtitle: { uz: "Ob'ektlar, xaridorlar va agentlar", ru: "Объекты, покупатели и агенты", en: "Properties, buyers and agents" },
    add: { uz: "Yangi ob'ekt", ru: "Новый объект", en: "New Property" },
    name: { uz: "Nomi", ru: "Название", en: "Name" },
    address: { uz: "Manzil", ru: "Адрес", en: "Address" },
    price: { uz: "Narx", ru: "Цена", en: "Price" },
    type: { uz: "Turi", ru: "Тип", en: "Type" },
    status: { uz: "Holat", ru: "Статус", en: "Status" },
    total: { uz: "Jami ob'ektlar", ru: "Всего объектов", en: "Total Properties" },
    active: { uz: "Faol", ru: "Активные", en: "Active" },
    sold: { uz: "Sotilgan", ru: "Проданные", en: "Sold" },
    search: { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
    save: { uz: "Saqlash", ru: "Сохранить", en: "Save" },
    cancel: { uz: "Bekor", ru: "Отмена", en: "Cancel" },
    empty: { uz: "Hali ob'ektlar yo'q", ru: "Пока нет объектов", en: "No properties yet" },
  };

  const t = (key: keyof typeof l) => l[key][lang] || l[key].en;

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase.from("deals").select("*").eq("stage", "realestate").order("created_at", { ascending: false });
    // Fallback: use all deals and filter by a naming convention or just show all
    const { data: allDeals } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
    setItems(allDeals || []);
  };

  useEffect(() => { fetch(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.name) return;
    await supabase.from("deals").insert({
      name: form.name,
      company: form.address || "—",
      amount: Number(form.price) || 0,
      contact_name: form.type || "apartment",
      stage: "lead",
      user_id: user.id,
    });
    setForm({ name: "", address: "", price: "", type: "" });
    setShowAdd(false);
    fetch();
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase()));
  const active = items.filter(i => !["won", "lost"].includes(i.stage)).length;
  const sold = items.filter(i => i.stage === "won").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">🏠 {t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("subtitle")}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 active:scale-[0.97]">
          <Plus className="w-4 h-4" />{t("add")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: t("total"), value: items.length, icon: Home },
          { label: t("active"), value: active, icon: MapPin },
          { label: t("sold"), value: sold, icon: DollarSign },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center"><s.icon className="w-4.5 h-4.5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-lg font-semibold font-mono text-foreground">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("search")} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("name")}</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("address")}</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("price")}</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("status")}</th>
            <th className="w-10"></th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">{t("empty")}</td></tr>
            ) : filtered.map(i => (
              <tr key={i.id} className="forge-transition forge-hover group">
                <td className="px-5 py-3.5 text-sm font-medium text-foreground">{i.name}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{i.company}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-foreground">${Number(i.amount).toLocaleString()}</td>
                <td className="px-5 py-3.5"><span className={`text-[10px] font-medium px-2 py-1 rounded ${i.stage === "won" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>{i.stage}</span></td>
                <td className="px-3 py-3.5"><MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-lg forge-shadow-md w-full max-w-md p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t("add")}</h3>
            <div className="space-y-3">
              {([["name", "name"], ["address", "address"], ["price", "price"], ["type", "type"]] as const).map(([key, field]) => (
                <div key={key}><label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t(key)}</label>
                  <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm border border-border rounded-md text-muted-foreground hover:bg-muted">{t("cancel")}</button>
                <button onClick={handleAdd} className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium">{t("save")}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RealEstateModule;
