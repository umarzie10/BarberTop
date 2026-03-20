import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, Heart, Calendar, User, MoreHorizontal, Stethoscope } from "lucide-react";

const HealthcareModule = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", doctor: "", diagnosis: "" });

  const labels = {
    title: { uz: "Bemorlar bazasi", ru: "База пациентов", en: "Patients Database" },
    subtitle: { uz: "Tibbiyot CRM tizimi", ru: "Медицинская CRM", en: "Healthcare CRM System" },
    add: { uz: "Yangi bemor", ru: "Новый пациент", en: "New Patient" },
    name: { uz: "Ism", ru: "Имя", en: "Name" },
    phone: { uz: "Telefon", ru: "Телефон", en: "Phone" },
    doctor: { uz: "Shifokor", ru: "Врач", en: "Doctor" },
    diagnosis: { uz: "Tashxis", ru: "Диагноз", en: "Diagnosis" },
    total: { uz: "Jami bemorlar", ru: "Всего пациентов", en: "Total Patients" },
    todayAppointments: { uz: "Bugungi navbatlar", ru: "Приёмы сегодня", en: "Today's Appointments" },
    active: { uz: "Faol", ru: "Активные", en: "Active" },
    search: { uz: "Bemor qidirish...", ru: "Поиск пациента...", en: "Search patient..." },
    save: { uz: "Saqlash", ru: "Сохранить", en: "Save" },
    cancel: { uz: "Bekor", ru: "Отмена", en: "Cancel" },
    noPatients: { uz: "Hali bemorlar yo'q", ru: "Пока нет пациентов", en: "No patients yet" },
    date: { uz: "Sana", ru: "Дата", en: "Date" },
  };

  const l = (key: keyof typeof labels) => labels[key][lang] || labels[key].en;

  const fetchPatients = async () => {
    if (!user) return;
    const { data } = await supabase.from("contacts").select("*").eq("role", "patient").order("created_at", { ascending: false });
    setPatients(data || []);
  };

  useEffect(() => { fetchPatients(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.name) return;
    await supabase.from("contacts").insert({
      name: form.name,
      phone: form.phone,
      company: form.doctor,
      email: form.diagnosis,
      role: "patient",
      user_id: user.id,
    });
    setForm({ name: "", phone: "", doctor: "", diagnosis: "" });
    setShowAdd(false);
    fetchPatients();
  };

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

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

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: l("total"), value: patients.length, icon: User },
          { label: l("todayAppointments"), value: 0, icon: Calendar },
          { label: l("active"), value: patients.length, icon: Heart },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-destructive/10 flex items-center justify-center">
              <s.icon className="w-4.5 h-4.5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-semibold font-mono text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={l("search")} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("name")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("phone")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("doctor")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("diagnosis")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("date")}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">{l("noPatients")}</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="forge-transition forge-hover group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-destructive/10 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-destructive" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.phone || "—"}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{p.company || "—"}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{p.email || "—"}</td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-3.5">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-lg forge-shadow-md w-full max-w-md p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{l("add")}</h3>
            <div className="space-y-3">
              {[
                { key: "name" as const, val: form.name, set: (v: string) => setForm({ ...form, name: v }) },
                { key: "phone" as const, val: form.phone, set: (v: string) => setForm({ ...form, phone: v }) },
                { key: "doctor" as const, val: form.doctor, set: (v: string) => setForm({ ...form, doctor: v }) },
                { key: "diagnosis" as const, val: form.diagnosis, set: (v: string) => setForm({ ...form, diagnosis: v }) },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l(f.key)}</label>
                  <input value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
                </div>
              ))}
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

export default HealthcareModule;
