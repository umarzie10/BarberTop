import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const stageColors: Record<string, string> = {
  lead: "hsl(215, 16%, 47%)",
  qualified: "hsl(221, 83%, 53%)",
  negotiation: "hsl(38, 92%, 50%)",
  proposal: "hsl(262, 83%, 58%)",
  won: "hsl(142, 71%, 45%)",
  lost: "hsl(0, 84%, 60%)",
};

const Analytics = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("deals").select("*").then(({ data }) => setDeals(data || []));
  }, [user]);

  const byStage = Object.entries(
    deals.reduce((acc, d) => { acc[d.stage] = (acc[d.stage] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number, fill: stageColors[name] || "#888" }));

  const totalRevenue = deals.filter(d => d.stage === "won").reduce((s, d) => s + d.amount, 0);
  const avgDeal = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.amount, 0) / deals.length) : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("analytics.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("analytics.subtitle")}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">{t("dash.totalRevenue")}</p>
          <p className="text-2xl font-semibold font-mono text-foreground">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">{t("dash.activeDeals")}</p>
          <p className="text-2xl font-semibold font-mono text-foreground">{deals.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Avg deal</p>
          <p className="text-2xl font-semibold font-mono text-foreground">${avgDeal.toLocaleString()}</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg forge-shadow-sm p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t("pipe.title")}</h3>
        {byStage.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={byStage} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {byStage.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {byStage.map((s) => (
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
    </div>
  );
};

export default Analytics;
