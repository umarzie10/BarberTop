import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, Headphones, AlertCircle, CheckCircle, Clock, MoreHorizontal } from "lucide-react";

const SupportModule = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", customer: "" });

  const l = {
    title: { uz: "Support", ru: "Поддержка", en: "Support" },
    subtitle: { uz: "Ticketlar va mijoz muammolari", ru: "Тикеты и проблемы клиентов", en: "Tickets and client issues" },
    add: { uz: "Yangi ticket", ru: "Новый тикет", en: "New Ticket" },
    ticketTitle: { uz: "Sarlavha", ru: "Заголовок", en: "Title" },
    description: { uz: "Tavsif", ru: "Описание", en: "Description" },
    priority: { uz: "Muhimlik", ru: "Приоритет", en: "Priority" },
    customer: { uz: "Mijoz", ru: "Клиент", en: "Customer" },
    status: { uz: "Holat", ru: "Статус", en: "Status" },
    total: { uz: "Jami ticketlar", ru: "Всего тикетов", en: "Total Tickets" },
    open: { uz: "Ochiq", ru: "Открытые", en: "Open" },
    resolved: { uz: "Hal qilingan", ru: "Решённые", en: "Resolved" },
    search: { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
    save: { uz: "Saqlash", ru: "Сохранить", en: "Save" },
    cancel: { uz: "Bekor", ru: "Отмена", en: "Cancel" },
    empty: { uz: "Hali ticketlar yo'q", ru: "Пока нет тикетов", en: "No tickets yet" },
  };
  const t = (key: keyof typeof l) => l[key][lang] || l[key].en;

  const fetchData = async () => {
    if (!user) return;
    const { data } = await supabase.from("activities").select("*").order("created_at", { ascending: false });
    setTickets(data || []);
  };
  useEffect(() => { fetchData(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.title) return;
    await supabase.from("activities").insert({ title: form.title, description: form.description, type: "task", status: "planned", user_id: user.id });
    setForm({ title: "", description: "", priority: "medium", customer: "" });
    setShowAdd(false);
    fetchData();
  };

  const filtered = tickets.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const open = tickets.filter(i => i.status !== "completed").length;
  const resolved = tickets.filter(i => i.status === "completed").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-semibold text-foreground tracking-tight">📱 {t("title")}</h1><p className="text-sm text-muted-foreground mt-0.5">{t("subtitle")}</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 active:scale-[0.97]"><Plus className="w-4 h-4" />{t("add")}</button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{ label: t("total"), value: tickets.length, icon: Headphones }, { label: t("open"), value: open, icon: AlertCircle }, { label: t("resolved"), value: resolved, icon: CheckCircle }].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center"><s.icon className="w-4.5 h-4.5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-lg font-semibold font-mono text-foreground">{s.value}</p></div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("search")} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" /></div></div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-border">
          <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("ticketTitle")}</th>
          <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("description")}</th>
          <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("status")}</th>
          <th className="w-10"></th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {filtered.length === 0 ? <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">{t("empty")}</td></tr> :
          filtered.map(i => (
            <tr key={i.id} className="forge-transition forge-hover group">
              <td className="px-5 py-3.5 text-sm font-medium text-foreground">{i.title}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground truncate max-w-[200px]">{i.description || "—"}</td>
              <td className="px-5 py-3.5"><span className={`text-[10px] font-medium px-2 py-1 rounded ${i.status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>{i.status}</span></td>
              <td className="px-3 py-3.5"><MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" /></td>
            </tr>
          ))}
        </tbody></table>
      </motion.div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-lg forge-shadow-md w-full max-w-md p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t("add")}</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ticketTitle")}</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("description")}</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 h-20 resize-none" /></div>
              <div className="flex gap-2 pt-2">
                <button onClick={()=>setShowAdd(false)} className="flex-1 py-2 text-sm border border-border rounded-md text-muted-foreground hover:bg-muted">{t("cancel")}</button>
                <button onClick={handleAdd} className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium">{t("save")}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupportModule;
