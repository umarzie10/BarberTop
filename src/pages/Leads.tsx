import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NewLeadModal } from "@/components/modals/NewLeadModal";

const Leads = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const fetchLeads = async () => {
    if (!user) return;
    const { data } = await supabase.from("deals").select("*").in("stage", ["lead", "qualified"]).order("created_at", { ascending: false });
    setDeals(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [user]);

  const handleAdd = async (lead: { name: string; company: string; amount: number; contactName: string }) => {
    if (!user) return;
    await supabase.from("deals").insert({
      name: lead.name,
      company: lead.company,
      amount: lead.amount,
      contact_name: lead.contactName || null,
      stage: "lead",
      user_id: user.id,
    });
    fetchLeads();
  };

  const filtered = deals.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.company.toLowerCase().includes(search.toLowerCase())
  );

  const stageLabels: Record<string, { label: string; className: string }> = {
    lead: { label: t("pipe.lead"), className: "bg-muted text-muted-foreground" },
    qualified: { label: t("pipe.qualified"), className: "bg-success/10 text-success" },
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("leads.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("leads.subtitle")}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          {t("leads.new")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: t("leads.total"), value: deals.length },
          { label: t("leads.newCount"), value: deals.filter(d => d.stage === "lead").length },
          { label: t("leads.qualified"), value: deals.filter(d => d.stage === "qualified").length },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-xl font-semibold font-mono text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("leads.search")} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
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
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("leads.name")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("leads.company")}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{t("leads.status")}</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">{t("deal.amount")}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">{t("common.loading")}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">{t("dash.noDeals")}</td></tr>
            ) : (
              filtered.map((deal) => {
                const st = stageLabels[deal.stage] || stageLabels.lead;
                return (
                  <tr key={deal.id} className="forge-transition forge-hover cursor-pointer group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {deal.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{deal.name}</p>
                          <p className="text-xs text-muted-foreground">{deal.contact_name || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{deal.company}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-medium px-2 py-1 rounded ${st.className}`}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono text-foreground text-right">${Number(deal.amount).toLocaleString()}</td>
                    <td className="px-3 py-3.5">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>

      <NewLeadModal open={showNew} onClose={() => setShowNew(false)} onAdd={handleAdd} />
    </div>
  );
};

export default Leads;
