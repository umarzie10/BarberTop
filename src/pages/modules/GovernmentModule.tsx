import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, MapPin, AlertTriangle, CheckCircle, Clock, MoreHorizontal, Filter } from "lucide-react";

const regions = [
  "Toshkent shahri", "Toshkent viloyati", "Samarqand", "Buxoro", "Farg'ona",
  "Andijon", "Namangan", "Qashqadaryo", "Surxondaryo", "Xorazm",
  "Navoiy", "Jizzax", "Sirdaryo", "Qoraqalpog'iston",
];

const GovernmentModule = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({ title: "", description: "", region: regions[0], district: "" });

  const labels = {
    title: { uz: "Murojaatlar tizimi", ru: "Система обращений", en: "Complaints System" },
    subtitle: { uz: "Fuqarolar murojaatlarini boshqarish", ru: "Управление обращениями граждан", en: "Manage citizen complaints" },
    add: { uz: "Yangi murojaat", ru: "Новое обращение", en: "New Complaint" },
    total: { uz: "Jami", ru: "Всего", en: "Total" },
    pending: { uz: "Kutilmoqda", ru: "Ожидает", en: "Pending" },
    inProgress: { uz: "Jarayonda", ru: "В процессе", en: "In Progress" },
    resolved: { uz: "Hal qilindi", ru: "Решено", en: "Resolved" },
    region: { uz: "Viloyat", ru: "Область", en: "Region" },
    district: { uz: "Tuman", ru: "Район", en: "District" },
    description: { uz: "Tavsif", ru: "Описание", en: "Description" },
    complaintTitle: { uz: "Murojaat mavzusi", ru: "Тема обращения", en: "Complaint Subject" },
    search: { uz: "Murojaat qidirish...", ru: "Поиск обращения...", en: "Search complaint..." },
    save: { uz: "Yuborish", ru: "Отправить", en: "Submit" },
    cancel: { uz: "Bekor", ru: "Отмена", en: "Cancel" },
    noComplaints: { uz: "Hali murojaatlar yo'q", ru: "Пока нет обращений", en: "No complaints yet" },
    all: { uz: "Barchasi", ru: "Все", en: "All" },
    date: { uz: "Sana", ru: "Дата", en: "Date" },
    status: { uz: "Holat", ru: "Статус", en: "Status" },
  };

  const l = (key: keyof typeof labels) => labels[key][lang] || labels[key].en;

  // Using activities table with type = "complaint" for gov module
  const fetchComplaints = async () => {
    if (!user) return;
    const { data } = await supabase.from("activities").select("*").eq("type", "complaint").order("created_at", { ascending: false });
    setComplaints(data || []);
  };

  useEffect(() => { fetchComplaints(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.title) return;
    await supabase.from("activities").insert({
      title: form.title,
      description: `${form.region} | ${form.district} | ${form.description}`,
      type: "complaint",
      status: "planned",
      user_id: user.id,
    });
    setForm({ title: "", description: "", region: regions[0], district: "" });
    setShowAdd(false);
    fetchComplaints();
  };

  const getStatus = (status: string) => {
    if (status === "completed") return { label: l("resolved"), cls: "bg-success/10 text-success", icon: CheckCircle };
    if (status === "in_progress") return { label: l("inProgress"), cls: "bg-warning/10 text-warning", icon: Clock };
    return { label: l("pending"), cls: "bg-muted text-muted-foreground", icon: AlertTriangle };
  };

  const filtered = complaints
    .filter(c => statusFilter === "all" || (statusFilter === "pending" && c.status === "planned") || (statusFilter === "in_progress" && c.status === "in_progress") || (statusFilter === "resolved" && c.status === "completed"))
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{l("title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{l("subtitle")}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90 active:scale-[0.97]">
          <Plus className="w-4 h-4" />{l("add")}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: l("total"), value: complaints.length, cls: "text-foreground" },
          { label: l("pending"), value: complaints.filter(c => c.status === "planned").length, cls: "text-warning" },
          { label: l("inProgress"), value: complaints.filter(c => c.status === "in_progress").length, cls: "text-primary" },
          { label: l("resolved"), value: complaints.filter(c => c.status === "completed").length, cls: "text-success" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-xl font-semibold font-mono ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={l("search")} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <div className="flex gap-1">
          {["all", "pending", "in_progress", "resolved"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 text-xs rounded-md forge-transition ${statusFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted border border-border"}`}>
              {f === "all" ? l("all") : f === "pending" ? l("pending") : f === "in_progress" ? l("inProgress") : l("resolved")}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("complaintTitle")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("region")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("status")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("date")}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">{l("noComplaints")}</td></tr>
            ) : filtered.map((c) => {
              const st = getStatus(c.status);
              const regionPart = c.description?.split(" | ")[0] || "—";
              return (
                <tr key={c.id} className="forge-transition forge-hover group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{c.description?.split(" | ").slice(2).join(" ") || ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {regionPart}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-medium px-2 py-1 rounded ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3.5">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Add Complaint Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-lg forge-shadow-md w-full max-w-md p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{l("add")}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("complaintTitle")}</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("region")}</label>
                <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20">
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("district")}</label>
                <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("description")}</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm border border-border rounded-md text-muted-foreground hover:bg-muted forge-transition">{l("cancel")}</button>
                <button onClick={handleAdd} className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 forge-transition font-medium">{l("save")}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GovernmentModule;
