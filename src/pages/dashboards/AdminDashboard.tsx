import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Stat, Card, Empty } from "@/components/shared/Page";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ today: 0, todayRevenue: 0, monthRevenue: 0, clients: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);

  const load = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date(); monthStart.setDate(1);
    const monthIso = monthStart.toISOString().slice(0, 10);

    const [{ data: ap }, { data: payToday }, { data: payMonth }, { count: clientsCount }, { data: up }] = await Promise.all([
      supabase.from("appointments").select("id").eq("appointment_date", today),
      supabase.from("payments").select("amount").gte("paid_at", today),
      supabase.from("payments").select("amount").gte("paid_at", monthIso),
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "client"),
      supabase.from("appointments").select("*, services(name), barbers(full_name)").gte("appointment_date", today).order("appointment_date").order("appointment_time").limit(8),
    ]);

    setStats({
      today: ap?.length || 0,
      todayRevenue: (payToday || []).reduce((s, p) => s + Number(p.amount), 0),
      monthRevenue: (payMonth || []).reduce((s, p) => s + Number(p.amount), 0),
      clients: clientsCount || 0,
    });
    setUpcoming(up || []);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("admin-dash")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title={t("dash.admin.title")} subtitle="Real-time studio metrics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label={t("dash.admin.todayBookings")} value={stats.today} />
        <Stat label={t("dash.admin.todayRevenue")} value={`${stats.todayRevenue.toLocaleString()} so'm`} />
        <Stat label={t("dash.admin.monthRevenue")} value={`${stats.monthRevenue.toLocaleString()} so'm`} />
        <Stat label={t("dash.admin.totalClients")} value={stats.clients} />
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-foreground mb-4">Yaqinlashayotgan bronlar</h3>
        {!upcoming.length ? <Empty text={t("common.empty")} /> : (
          <div className="space-y-2">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.client_name || "Mijoz"} → {a.barbers?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{a.services?.name} • {a.appointment_date} {a.appointment_time?.slice(0, 5)}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{t(`status.${a.status}`)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
