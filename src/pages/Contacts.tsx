import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail } from "lucide-react";

const contacts = [
  { id: 1, name: "Sardor Raximov", company: "TechVision LLC", role: "CEO", email: "sardor@techvision.uz", phone: "+998 90 123 45 67", deals: 3, value: "$145,000" },
  { id: 2, name: "Nilufar Karimova", company: "GlobalTrade Co", role: "CTO", email: "nilufar@globaltrade.uz", phone: "+998 91 234 56 78", deals: 2, value: "$85,700" },
  { id: 3, name: "Bobur Aliyev", company: "DataStream Inc", role: "VP Sales", email: "bobur@datastream.uz", phone: "+998 93 345 67 89", deals: 1, value: "$67,200" },
  { id: 4, name: "Madina Xolmatova", company: "CloudBase Systems", role: "Director", email: "madina@cloudbase.uz", phone: "+998 94 456 78 90", deals: 2, value: "$48,300" },
  { id: 5, name: "Jasur Toshmatov", company: "SmartLogistics", role: "COO", email: "jasur@smartlog.uz", phone: "+998 95 567 89 01", deals: 4, value: "$234,000" },
  { id: 6, name: "Alisher Mirzayev", company: "FinanceHub", role: "CFO", email: "alisher@finhub.uz", phone: "+998 90 678 90 12", deals: 1, value: "$78,000" },
  { id: 7, name: "Lola Saidova", company: "EduPlatform", role: "Founder", email: "lola@eduplat.uz", phone: "+998 91 789 01 23", deals: 1, value: "$32,500" },
];

const Contacts = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Kontaktlar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-mono">{contacts.length}</span> ta kontakt
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          Yangi kontakt
        </button>
      </div>

      {/* Search / Filter */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Kontakt qidirish..."
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
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border border-border rounded-lg forge-shadow-sm overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Ism</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Kompaniya</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Lavozim</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Bitimlar</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Qiymat</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((c) => (
              <tr key={c.id} className="forge-transition forge-hover cursor-pointer group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-foreground">{c.company}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.role}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-foreground">{c.deals}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-foreground text-right">{c.value}</td>
                <td className="px-3 py-3.5">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Contacts;
