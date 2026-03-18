import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentDeals } from "@/components/dashboard/RecentDeals";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DollarSign, Users, TrendingUp, Target, Plus } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sotuvni boshqarish, ma'lumotlarni emas.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          Yangi bitim
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Umumiy daromad"
          value="$248,500"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <MetricCard
          title="Faol bitimlar"
          value="24"
          change="+3"
          changeType="positive"
          icon={Target}
          delay={1}
        />
        <MetricCard
          title="Konversiya"
          value="34.2%"
          change="-2.1%"
          changeType="negative"
          icon={TrendingUp}
          delay={2}
        />
        <MetricCard
          title="Yangi kontaktlar"
          value="156"
          change="+18"
          changeType="positive"
          icon={Users}
          delay={3}
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RecentDeals />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
