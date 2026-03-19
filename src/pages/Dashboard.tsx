import { useEffect, useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentDeals } from "@/components/dashboard/RecentDeals";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DollarSign, Users, TrendingUp, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [dealsRes, contactsRes] = await Promise.all([
        supabase.from("deals").select("*").order("created_at", { ascending: false }),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
      ]);
      setDeals(dealsRes.data || []);
      setContacts(contactsRes.data || []);
      setLoading(false);
    };
    fetchData();

    // Realtime subscription for deals
    const channel = supabase
      .channel("dashboard-deals")
      .on("postgres_changes", { event: "*", schema: "public", table: "deals" }, () => {
        supabase.from("deals").select("*").order("created_at", { ascending: false }).then(({ data }) => {
          if (data) setDeals(data);
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, () => {
        supabase.from("contacts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
          if (data) setContacts(data);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const totalRevenue = deals.filter(d => d.stage === "won").reduce((s, d) => s + Number(d.amount), 0);
  const activeDeals = deals.filter(d => !["won", "lost"].includes(d.stage)).length;
  const wonDeals = deals.filter(d => d.stage === "won").length;
  const conversion = deals.length > 0 ? ((wonDeals / deals.length) * 100).toFixed(1) : "0";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("dash.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("dash.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title={t("dash.totalRevenue")} value={`$${totalRevenue.toLocaleString()}`} change="" changeType="neutral" icon={DollarSign} delay={0} />
        <MetricCard title={t("dash.activeDeals")} value={String(activeDeals)} change="" changeType="neutral" icon={Target} delay={1} />
        <MetricCard title={t("dash.conversion")} value={`${conversion}%`} change="" changeType="neutral" icon={TrendingUp} delay={2} />
        <MetricCard title={t("dash.newContacts")} value={String(contacts.length)} change="" changeType="neutral" icon={Users} delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RecentDeals deals={deals.slice(0, 5)} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
