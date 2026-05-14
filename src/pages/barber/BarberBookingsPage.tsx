import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty, Stat } from "@/components/shared/Page";
import { toast } from "sonner";
import { Check, X, Ban, DollarSign } from "lucide-react";

export default function BarberBookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"today" | "upcoming" | "all">("today");
  const [appts, setAppts] = useState<any[]>([]);
  const [counts, setCounts] = useState({ pending: 0, today: 0, week: 0 });

  const load = async (bid: string) => {
    let q = supabase
      .from("appointments")
      .select("*, services(name, price)")
      .eq("barber_id", bid);
    const today = new Date().toISOString().slice(0, 10);
    if (filter === "today") q = q.eq("appointment_date", today);
    else if (filter === "upcoming") q = q.gte("appointment_date", today);
    const { data } = await q
      .order("appointment_date", { ascending: true })
      .order("appointment_time")
      .limit(200);
    setAppts(data || []);

    const { data: all } = await supabase
      .from("appointments")
      .select("status, appointment_date")
      .eq("barber_id", bid);
    const wk = new Date();
    wk.setDate(wk.getDate() - 7);
    setCounts({
      pending: (all || []).filter((a) => a.status === "pending").length,
      today: (all || []).filter((a) => a.appointment_date === today).length,
      week: (all || []).filter((a) => new Date(a.appointment_date) >= wk)
        .length,
    });
  };

  useEffect(() => {
    if (!user) return;
    supabase
      .from("barbers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setBarberId(data.id);
          load(data.id);
        }
      });
  }, [user]);

  useEffect(() => {
    if (barberId) load(barberId);
  }, [filter]);

  useEffect(() => {
    if (!barberId) return;
    const ch = supabase
      .channel(`bk-${barberId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `barber_id=eq.${barberId}`,
        },
        () => load(barberId),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [barberId]);

  const setStatus = async (id: string, status: any) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(t("barber.bookings.updated"));
    load(barberId!);
  };

  const blacklist = async (clientId: string) => {
    if (!barberId || !clientId) return;
    const reason = prompt(t("barber.bookings.promptReason")) || "";
    const { error } = await supabase
      .from("barber_blacklist")
      .insert({ barber_id: barberId, client_id: clientId, reason });
    if (error) return toast.error(error.message);
    toast.success(t("barber.bookings.blacklisted"));
  };

  const recordPayment = async (a: any) => {
    const { error } = await supabase.from("payments").insert({
      appointment_id: a.id,
      amount: a.total_price || a.services?.price || 0,
      method: "cash",
      recorded_by: user!.id,
    });
    if (error) return toast.error(error.message);
    await supabase
      .from("appointments")
      .update({ status: "completed" })
      .eq("id", a.id);
    toast.success(t("barber.bookings.paymentRecorded"));
    load(barberId!);
  };

  if (!barberId)
    return (
      <div className="p-6">
        <Empty text={t("barber.profileNotSetup")} />
      </div>
    );

  const statusColor = (s: string) =>
    s === "pending"
      ? "bg-yellow-500/10 text-yellow-600"
      : s === "confirmed"
        ? "bg-blue-500/10 text-blue-600"
        : s === "completed"
          ? "bg-green-500/10 text-green-600"
          : "bg-red-500/10 text-red-600";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title={t("barber.bookings.title")}
        subtitle={t("barber.bookings.subtitle")}
      />

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat label={t("barber.bookings.pending")} value={counts.pending} />
        <Stat label={t("barber.bookings.today")} value={counts.today} />
        <Stat label={t("barber.bookings.week")} value={counts.week} />
      </div>

      <div className="flex gap-2 mb-4">
        {(["today", "upcoming", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-md ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {f === "today"
              ? t("barber.bookings.filter.today")
              : f === "upcoming"
                ? t("barber.bookings.filter.upcoming")
                : t("barber.bookings.filter.all")}
          </button>
        ))}
      </div>

      {!appts.length ? (
        <Empty text={t("barber.bookings.empty")} />
      ) : (
        <div className="space-y-2">
          {appts.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {a.appointment_date} {a.appointment_time?.slice(0, 5)} —{" "}
                    {a.client_name || t("barber.client")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.services?.name} •{" "}
                    {Number(
                      a.total_price || a.services?.price || 0,
                    ).toLocaleString()}{" "}
                    {t("common.sum")} {a.client_phone && `• ${a.client_phone}`}
                  </p>
                  {a.notes && (
                    <p className="text-xs text-muted-foreground italic mt-1">
                      "{a.notes}"
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded ${statusColor(a.status)}`}
                  >
                    {t(`status.${a.status}`) || a.status}
                  </span>
                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => setStatus(a.id, "confirmed")}
                        className="p-1.5 bg-primary text-primary-foreground rounded"
                        title={t("barber.bookings.accept")}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStatus(a.id, "cancelled")}
                        className="p-1.5 bg-destructive text-destructive-foreground rounded"
                        title={t("barber.bookings.reject")}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {a.status === "confirmed" && (
                    <button
                      onClick={() => recordPayment(a)}
                      className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded flex items-center gap-1"
                    >
                      <DollarSign className="w-3 h-3" />{" "}
                      {t("barber.bookings.paid")}
                    </button>
                  )}
                  {a.client_id && (
                    <button
                      onClick={() => blacklist(a.client_id)}
                      className="p-1.5 hover:bg-destructive/10 text-destructive rounded"
                      title={t("barber.bookings.blacklist")}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
