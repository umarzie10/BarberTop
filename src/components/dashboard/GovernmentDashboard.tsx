import { MetricCard } from "./MetricCard";
import { FileText, MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

interface Props {
  deals: any[];
  contacts: any[];
}

export const GovernmentDashboard = ({ deals, contacts }: Props) => {
  const { t } = useLanguage();

  const total = deals.length;
  const resolved = deals.filter(d => d.stage === "won").length;
  const pending = deals.filter(d => !["won", "lost"].includes(d.stage)).length;
  const regions = new Set(deals.map(d => d.company)).size;

  const statusData = [
    { name: t("wdash.resolved"), value: resolved, fill: "hsl(142, 71%, 45%)" },
    { name: t("wdash.pending"), value: pending, fill: "hsl(38, 92%, 50%)" },
    { name: t("wdash.rejected"), value: deals.filter(d => d.stage === "lost").length, fill: "hsl(0, 84%, 60%)" },
  ].filter(d => d.value > 0);

  const byRegion = Object.entries(
    deals.reduce((acc, d) => { acc[d.company] = (acc[d.company] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number })).slice(0, 8);

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(262, 83%, 58%)"];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title={t("wdash.totalComplaints")} value={String(total)} change="" changeType="neutral" icon={FileText} delay={0} />
        <MetricCard title={t("wdash.resolved")} value={String(resolved)} change="" changeType="neutral" icon={CheckCircle} delay={1} />
        <MetricCard title={t("wdash.pending")} value={String(pending)} change="" changeType="neutral" icon={AlertTriangle} delay={2} />
        <MetricCard title={t("wdash.regions")} value={String(regions)} change="" changeType="neutral" icon={MapPin} delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t("wdash.complaintStatus")}</h3>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.fill }} />
                    {s.name} ({s.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">{t("dash.noDeals")}</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t("wdash.byRegion")}</h3>
          {byRegion.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byRegion} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={100} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {byRegion.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">{t("dash.noDeals")}</p>
          )}
        </motion.div>
      </div>
    </>
  );
};
