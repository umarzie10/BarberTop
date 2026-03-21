import { MetricCard } from "./MetricCard";
import { RecentDeals } from "./RecentDeals";
import { ActivityFeed } from "./ActivityFeed";
import { BarChart3, Users, TrendingUp, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  deals: any[];
  contacts: any[];
  loading: boolean;
}

export const GenericDashboard = ({ deals, contacts, loading }: Props) => {
  const { t } = useLanguage();

  const total = deals.length;
  const active = deals.filter(d => !["won", "lost"].includes(d.stage)).length;
  const completed = deals.filter(d => d.stage === "won").length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title={t("wdash.totalRecords")} value={String(total)} change="" changeType="neutral" icon={BarChart3} delay={0} />
        <MetricCard title={t("wdash.active")} value={String(active)} change="" changeType="neutral" icon={Layers} delay={1} />
        <MetricCard title={t("wdash.completed")} value={String(completed)} change="" changeType="neutral" icon={TrendingUp} delay={2} />
        <MetricCard title={t("wdash.contacts")} value={String(contacts.length)} change="" changeType="neutral" icon={Users} delay={3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3"><RecentDeals deals={deals.slice(0, 5)} loading={loading} /></div>
        <div className="lg:col-span-2"><ActivityFeed /></div>
      </div>
    </>
  );
};
