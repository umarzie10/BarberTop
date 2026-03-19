import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NewContactModal } from "@/components/modals/NewContactModal";

const Contacts = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const fetchContacts = async () => {
    if (!user) return;
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, [user]);

  const handleAdd = async (c: { name: string; company: string; email: string; phone: string; role: string }) => {
    if (!user) return;
    await supabase.from("contacts").insert({
      name: c.name,
      company: c.company,
      email: c.email || null,
      phone: c.phone || null,
      role: c.role || null,
      user_id: user.id,
    });
    fetchContacts();
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("contacts.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-mono">{contacts.length}</span> {t("contacts.count")}
          </p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          {t("contacts.new")}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("contacts.search")} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">
          <Filter className="w-3.5 h-3.5" />
          {t("common.filter")}
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("contacts.name")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("contacts.company")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("contacts.role")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("auth.email")}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">{t("common.loading")}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">{t("contacts.noContacts")}</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="forge-transition forge-hover cursor-pointer group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {c.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.phone || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-foreground">{c.company}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.role || "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.email || "—"}</td>
                  <td className="px-3 py-3.5">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <NewContactModal open={showNew} onClose={() => setShowNew(false)} onAdd={handleAdd} />
    </div>
  );
};

export default Contacts;
