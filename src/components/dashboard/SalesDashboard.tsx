import { MetricCard } from "./MetricCard";
import { RecentDeals } from "./RecentDeals";
import { ActivityFeed } from "./ActivityFeed";
import { DollarSign, Users, TrendingUp, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  deals: any[];
  contacts: any[];
  loading: boolean;
}

export const SalesDashboard = ({ deals, contacts, loading }: Props) => {
  const { t } = useLanguage();
  const totalRevenue = deals.filter(d => d.stage === "won").reduce((s, d) => s + Number(d.amount), 0);
  const activeDeals = deals.filter(d => !["won", "lost"].includes(d.stage)).length;
  const wonDeals = deals.filter(d => d.stage === "won").length;
  const conversion = deals.length > 0 ? ((wonDeals / deals.length) * 100).toFixed(1) : "0";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title={t("dash.totalRevenue")} value={`$${totalRevenue.toLocaleString()}`} change="" changeType="neutral" icon={DollarSign} delay={0} />
        <MetricCard title={t("dash.activeDeals")} value={String(activeDeals)} change="" changeType="neutral" icon={Target} delay={1} />
        <MetricCard title={t("dash.conversion")} value={`${conversion}%`} change="" changeType="neutral" icon={TrendingUp} delay={2} />
        <MetricCard title={t("dash.newContacts")} value={String(contacts.length)} change="" changeType="neutral" icon={Users} delay={3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3"><RecentDeals deals={deals.slice(0, 5)} loading={loading} /></div>
        <div className="lg:col-span-2"><ActivityFeed /></div>
      </div>
    </>
  );
};
