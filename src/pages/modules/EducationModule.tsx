import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, GraduationCap, BookOpen, CreditCard, Calendar, Users, Filter, MoreHorizontal } from "lucide-react";

interface Student {
  id: string;
  name: string;
  phone: string;
  course: string;
  group_name: string;
  status: string;
  payment_status: string;
  enrolled_at: string;
}

const EducationModule = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", course: "", group_name: "" });

  const labels = {
    title: { uz: "Talabalar bazasi", ru: "База студентов", en: "Students Database" },
    subtitle: { uz: "O'quv markaz CRM tizimi", ru: "CRM для учебного центра", en: "Education Center CRM" },
    addStudent: { uz: "Yangi talaba", ru: "Новый студент", en: "New Student" },
    name: { uz: "Ism", ru: "Имя", en: "Name" },
    phone: { uz: "Telefon", ru: "Телефон", en: "Phone" },
    course: { uz: "Kurs", ru: "Курс", en: "Course" },
    group: { uz: "Guruh", ru: "Группа", en: "Group" },
    status: { uz: "Holat", ru: "Статус", en: "Status" },
    payment: { uz: "To'lov", ru: "Оплата", en: "Payment" },
    total: { uz: "Jami talabalar", ru: "Всего студентов", en: "Total Students" },
    active: { uz: "Faol", ru: "Активные", en: "Active" },
    graduated: { uz: "Bitirgan", ru: "Выпускники", en: "Graduated" },
    search: { uz: "Talaba qidirish...", ru: "Поиск студента...", en: "Search student..." },
    save: { uz: "Saqlash", ru: "Сохранить", en: "Save" },
    cancel: { uz: "Bekor", ru: "Отмена", en: "Cancel" },
    noStudents: { uz: "Hali talabalar yo'q", ru: "Пока нет студентов", en: "No students yet" },
  };

  const l = (key: keyof typeof labels) => labels[key][lang] || labels[key].en;

  // Using contacts table with role = "student" for education module
  const fetchStudents = async () => {
    if (!user) return;
    const { data } = await supabase.from("contacts").select("*").eq("role", "student").order("created_at", { ascending: false });
    setStudents((data || []).map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone || "",
      course: c.company, // reuse company field for course
      group_name: c.email || "", // reuse email field for group
      status: "active",
      payment_status: "paid",
      enrolled_at: c.created_at,
    })));
  };

  useEffect(() => { fetchStudents(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.name) return;
    await supabase.from("contacts").insert({
      name: form.name,
      phone: form.phone,
      company: form.course, // course stored in company
      email: form.group_name, // group stored in email
      role: "student",
      user_id: user.id,
    });
    setForm({ name: "", phone: "", course: "", group_name: "" });
    setShowAdd(false);
    fetchStudents();
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.course.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{l("title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{l("subtitle")}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90 active:scale-[0.97]">
          <Plus className="w-4 h-4" />{l("addStudent")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: l("total"), value: students.length, icon: Users },
          { label: l("active"), value: students.filter(s => s.status === "active").length, icon: GraduationCap },
          { label: l("graduated"), value: students.filter(s => s.status === "graduated").length, icon: BookOpen },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
              <s.icon className="w-4.5 h-4.5 text-primary" />
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
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("course")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("group")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{l("status")}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">{l("noStudents")}</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} className="forge-transition forge-hover group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {s.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.phone || "—"}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{s.course}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{s.group_name || "—"}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] font-medium px-2 py-1 rounded bg-success/10 text-success">
                    {s.status === "active" ? l("active") : l("graduated")}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Add Student Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-lg forge-shadow-md w-full max-w-md p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{l("addStudent")}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("name")}</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("phone")}</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("course")}</label>
                <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{l("group")}</label>
                <input value={form.group_name} onChange={(e) => setForm({ ...form, group_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
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

export default EducationModule;
