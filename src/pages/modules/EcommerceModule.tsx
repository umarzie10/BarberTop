import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, ShoppingCart, Package, CreditCard, MoreHorizontal } from "lucide-react";

const EcommerceModule = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", customer: "", amount: "", product: "" });

  const l = {
    title: { uz: "E-commerce", ru: "E-commerce", en: "E-commerce" },
    subtitle: { uz: "Onlayn buyurtmalar va mijozlar", ru: "Онлайн заказы и клиенты", en: "Online orders and customers" },
    add: { uz: "Yangi buyurtma", ru: "Новый заказ", en: "New Order" },
    name: { uz: "Buyurtma ID", ru: "ID заказа", en: "Order ID" },
    customer: { uz: "Mijoz", ru: "Клиент", en: "Customer" },
    amount: { uz: "Summa ($)", ru: "Сумма ($)", en: "Amount ($)" },
    product: { uz: "Mahsulot", ru: "Продукт", en: "Product" },
    status: { uz: "Holat", ru: "Статус", en: "Status" },
    total: { uz: "Jami buyurtmalar", ru: "Всего заказов", en: "Total Orders" },
    pending: { uz: "Kutilmoqda", ru: "В ожидании", en: "Pending" },
    completed: { uz: "Bajarilgan", ru: "Выполнено", en: "Completed" },
    search: { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
    save: { uz: "Saqlash", ru: "Сохранить", en: "Save" },
    cancel: { uz: "Bekor", ru: "Отмена", en: "Cancel" },
    empty: { uz: "Hali buyurtmalar yo'q", ru: "Пока нет заказов", en: "No orders yet" },
  };
  const t = (key: keyof typeof l) => l[key][lang] || l[key].en;

  const fetchData = async () => {
    if (!user) return;
    const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };
  useEffect(() => { fetchData(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.name) return;
    await supabase.from("deals").insert({ name: form.name, company: form.customer || "—", contact_name: form.product, amount: Number(form.amount) || 0, stage: "lead", user_id: user.id });
    setForm({ name: "", customer: "", amount: "", product: "" });
    setShowAdd(false);
    fetchData();
  };

  const filtered = orders.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-semibold text-foreground tracking-tight">🛒 {t("title")}</h1><p className="text-sm text-muted-foreground mt-0.5">{t("subtitle")}</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 active:scale-[0.97]"><Plus className="w-4 h-4" />{t("add")}</button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{ label: t("total"), value: orders.length, icon: ShoppingCart }, { label: t("pending"), value: orders.filter(i => !["won","lost"].includes(i.stage)).length, icon: Package }, { label: t("completed"), value: orders.filter(i => i.stage === "won").length, icon: CreditCard }].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center"><s.icon className="w-4.5 h-4.5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-lg font-semibold font-mono text-foreground">{s.value}</p></div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("search")} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" /></div></div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-border">
          <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("name")}</th>
          <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("customer")}</th>
          <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("amount")}</th>
          <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("status")}</th>
          <th className="w-10"></th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {filtered.length === 0 ? <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">{t("empty")}</td></tr> :
          filtered.map(i => (
            <tr key={i.id} className="forge-transition forge-hover group">
              <td className="px-5 py-3.5 text-sm font-medium text-foreground">{i.name}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{i.company}</td>
              <td className="px-5 py-3.5 text-sm font-mono text-foreground">${Number(i.amount).toLocaleString()}</td>
              <td className="px-5 py-3.5"><span className={`text-[10px] font-medium px-2 py-1 rounded ${i.stage === "won" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>{i.stage}</span></td>
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
              {([["name","name"],["customer","customer"],["amount","amount"],["product","product"]] as const).map(([k,f])=>(
                <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t(k)}</label><input value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" /></div>
              ))}
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

export default EcommerceModule;
