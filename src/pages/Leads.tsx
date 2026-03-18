import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, ArrowRight } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  company: string;
  source: string;
  status: "yangi" | "ishlov" | "qualified" | "disqualified";
  phone: string;
  created: string;
}

const statusConfig = {
  yangi: { label: "Yangi", className: "bg-muted text-muted-foreground" },
  ishlov: { label: "Ishlov berilmoqda", className: "bg-primary/10 text-primary" },
  qualified: { label: "Qualified", className: "bg-success/10 text-success" },
  disqualified: { label: "Disqualified", className: "bg-destructive/10 text-destructive" },
};

const leads: Lead[] = [
  { id: 1, name: "Farhod Umarov", company: "TechStart UZ", source: "Veb-sayt shakli", status: "yangi", phone: "+998 90 111 22 33", created: "Bugun" },
  { id: 2, name: "Gulnora Azimova", company: "Fashion Plaza", source: "Telegram", status: "ishlov", phone: "+998 91 222 33 44", created: "Kecha" },
  { id: 3, name: "Bekzod Tursunov", company: "Agro Export", source: "Telefon qo'ng'iroq", status: "qualified", phone: "+998 93 333 44 55", created: "2 kun oldin" },
  { id: 4, name: "Shaxlo Mirzayeva", company: "EduTech Academy", source: "Instagram", status: "yangi", phone: "+998 94 444 55 66", created: "Bugun" },
  { id: 5, name: "Oybek Xasanov", company: "LogiTrans Co", source: "Referral", status: "ishlov", phone: "+998 95 555 66 77", created: "3 kun oldin" },
  { id: 6, name: "Dilbar Normatova", company: "MediCare Plus", source: "Email", status: "disqualified", phone: "+998 90 666 77 88", created: "1 hafta oldin" },
  { id: 7, name: "Jamshid Karimov", company: "BuildMax", source: "Veb-sayt shakli", status: "qualified", phone: "+998 91 777 88 99", created: "4 kun oldin" },
  { id: 8, name: "Nargiza Rahimova", company: "FoodChain UZ", source: "Telegram", status: "yangi", phone: "+998 93 888 99 00", created: "Bugun" },
];

const Leads = () => {
  const stats = {
    total: leads.length,
    yangi: leads.filter(l => l.status === "yangi").length,
    qualified: leads.filter(l => l.status === "qualified").length,
    conversion: Math.round((leads.filter(l => l.status === "qualified").length / leads.length) * 100),
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Leadlar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Potentsial mijozlarni boshqaring</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          Yangi lead
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Jami leadlar", value: stats.total, suffix: "" },
          { label: "Yangi", value: stats.yangi, suffix: "" },
          { label: "Qualified", value: stats.qualified, suffix: "" },
          { label: "Konversiya", value: stats.conversion, suffix: "%" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-xl font-semibold font-mono text-foreground">{s.value}{s.suffix}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Lead qidirish..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
        className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Ism</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Kompaniya</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Manba</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Sana</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => {
              const st = statusConfig[lead.status];
              return (
                <tr key={lead.id} className="forge-transition forge-hover cursor-pointer group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {lead.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-foreground">{lead.company}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{lead.source}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-medium px-2 py-1 rounded ${st.className}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{lead.created}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 forge-transition">
                      <button className="p-1 hover:bg-muted rounded" title="Dealga o'tkazish">
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Leads;
