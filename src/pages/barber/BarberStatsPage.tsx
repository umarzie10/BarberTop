import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, Card, Empty, Stat } from "@/components/shared/Page";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

export default function BarberStatsPage() {
  const { user } = useAuth();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [appts, setAppts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: b } = await supabase.from("barbers").select("id, rating").eq("user_id", user.id).maybeSingle();
      if (!b) return;
      setBarberId(b.id); setRating(Number(b.rating));
      const since = new Date(); since.setDate(since.getDate() - 30);
      const sinceStr = since.toISOString().slice(0, 10);
      const [{ data: a }, { data: r }] = await Promise.all([
        supabase.from("appointments").select("*, services(name, price)").eq("barber_id", b.id).gte("appointment_date", sinceStr),
        supabase.from("reviews").select("id").eq("barber_id", b.id),
      ]);
      setAppts(a || []);
      setReviewCount((r || []).length);
      const apptIds = (a || []).map((x: any) => x.id);
      if (apptIds.length) {
        const { data: p } = await supabase.from("payments").select("*").in("appointment_id", apptIds);
        setPayments(p || []);
      }
    })();
  }, [user]);

  const stats = useMemo(() => {
    const completed = appts.filter((a) => a.status === "completed");
    const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
    const activeClients = new Set(appts.filter((a) => a.client_id).map((a) => a.client_id)).size;

    // by service
    const svcMap: Record<string, number> = {};
    completed.forEach((a) => { const n = a.services?.name || "Noma'lum"; svcMap[n] = (svcMap[n] || 0) + 1; });
    const topServices = Object.entries(svcMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    // daily revenue 30 days
    const daily: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      daily[d.toISOString().slice(5, 10)] = 0;
    }
    payments.forEach((p) => {
      const d = p.paid_at?.slice(5, 10);
      if (d in daily) daily[d] += Number(p.amount);
    });
    const dailyArr = Object.entries(daily).map(([date, amount]) => ({ date, amount }));

    return { totalAppts: appts.length, completed: completed.length, totalRevenue, activeClients, topServices, dailyArr };
  }, [appts, payments]);

  if (!barberId) return <div className="p-6"><Empty text="Profil sozlanmagan" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title="Statistika" subtitle="So'nggi 30 kunlik ko'rsatkichlaringiz" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Bronlar" value={stats.totalAppts} hint={`${stats.completed} bajarildi`} />
        <Stat label="Daromad" value={`${(stats.totalRevenue / 1000).toFixed(0)}K so'm`} />
        <Stat label="Aktiv mijozlar" value={stats.activeClients} />
        <Stat label="Reyting" value={rating.toFixed(1)} hint={`${reviewCount} sharh`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold mb-4">Kunlik daromad (30 kun)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={stats.dailyArr}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4">Eng ko'p buyurtma — xizmatlar</h3>
          {!stats.topServices.length ? <Empty text="Ma'lumot yo'q" /> : (
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={stats.topServices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
