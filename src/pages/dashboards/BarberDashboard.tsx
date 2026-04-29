import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty, Stat } from "@/components/shared/Page";
import { toast } from "sonner";

export default function BarberDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [appts, setAppts] = useState<any[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  const load = async (bid: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("appointments")
      .select("*, services(name, price)")
      .eq("barber_id", bid)
      .eq("appointment_date", today)
      .order("appointment_time");
    setAppts(data || []);
    setTodayCount((data || []).length);

    const { data: pay } = await supabase
      .from("payments")
      .select("amount")
      .gte("paid_at", today);
    // filter on client by barber via joined appt — simpler: sum only paid appts shown
    const apptIds = (data || []).map((a) => a.id);
    setTodayRevenue((pay || []).filter((p: any) => apptIds.includes(p.appointment_id)).reduce((s, p) => s + Number(p.amount), 0));
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("barbers").select("id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setBarberId(data.id);
        load(data.id);
      }
    });
  }, [user]);

  useEffect(() => {
    if (!barberId) return;
    const ch = supabase.channel("barber-dash")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `barber_id=eq.${barberId}` }, () => load(barberId))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [barberId]);

  const updateStatus = async (id: string, status: any) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    if (barberId) load(barberId);
  };

  const recordPayment = async (a: any) => {
    if (!barberId) return;
    const { error } = await supabase.from("payments").insert({
      appointment_id: a.id,
      amount: a.total_price || a.services?.price || 0,
      method: "cash",
      recorded_by: user!.id,
    });
    if (error) return toast.error(error.message);
    await supabase.from("appointments").update({ status: "completed" }).eq("id", a.id);
    toast.success("To'lov yozildi");
    if (barberId) load(barberId);
  };

  if (!barberId) {
    return <div className="p-6"><Empty text="Sizning barber profilingiz hali sozlanmagan. Admin bilan bog'laning." /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title={t("dash.barber.title")} />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Stat label={t("dash.admin.todayBookings")} value={todayCount} />
        <Stat label={t("dash.admin.todayRevenue")} value={`${todayRevenue.toLocaleString()} so'm`} />
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-foreground mb-4">{t("dash.barber.todayList")}</h3>
        {!appts.length ? <Empty text={t("common.empty")} /> : (
          <div className="space-y-2">
            {appts.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/30 rounded-md">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.appointment_time?.slice(0, 5)} — {a.client_name || "Mijoz"}</p>
                  <p className="text-xs text-muted-foreground">{a.services?.name} • {Number(a.total_price || a.services?.price || 0).toLocaleString()} so'm</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">{t(`status.${a.status}`)}</span>
                  {a.status !== "completed" && (
                    <>
                      <button onClick={() => updateStatus(a.id, "confirmed")} className="text-xs px-2 py-1 bg-secondary rounded hover:opacity-90">Tasdiq</button>
                      <button onClick={() => recordPayment(a)} className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:opacity-90">{t("dash.barber.markPaid")}</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
