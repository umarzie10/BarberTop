import { MetricCard } from "./MetricCard";
import { GraduationCap, BookOpen, CreditCard, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  deals: any[];
  contacts: any[];
}

export const EducationDashboard = ({ deals, contacts }: Props) => {
  const { t } = useLanguage();

  const students = contacts.length;
  const activeCourses = new Set(deals.map(d => d.name)).size;
  const totalPayments = deals.filter(d => d.stage === "won").reduce((s, d) => s + Number(d.amount), 0);
  const activeStudents = deals.filter(d => !["won", "lost"].includes(d.stage)).length;

  const stageData = Object.entries(
    deals.reduce((acc, d) => { acc[d.stage] = (acc[d.stage] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }));

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(262, 83%, 58%)", "hsl(0, 84%, 60%)"];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title={t("wdash.students")} value={String(students)} change="" changeType="neutral" icon={GraduationCap} delay={0} />
        <MetricCard title={t("wdash.courses")} value={String(activeCourses)} change="" changeType="neutral" icon={BookOpen} delay={1} />
        <MetricCard title={t("wdash.payments")} value={`$${totalPayments.toLocaleString()}`} change="" changeType="neutral" icon={CreditCard} delay={2} />
        <MetricCard title={t("wdash.activeStudents")} value={String(activeStudents)} change="" changeType="neutral" icon={Users} delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t("wdash.studentsByStage")}</h3>
          {stageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stageData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stageData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">{t("dash.noDeals")}</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t("wdash.recentStudents")}</h3>
          <div className="space-y-3">
            {contacts.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.company}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("contacts.noContacts")}</p>}
          </div>
        </motion.div>
      </div>
    </>
  );
};
