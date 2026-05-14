import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card } from "@/components/shared/Page";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
];

export default function Book() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetBarberId = params.get("barber");

  const [globalServices, setGlobalServices] = useState<any[]>([]);
  const [barberServices, setBarberServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState(presetBarberId || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [barberSchedule, setBarberSchedule] = useState<any>(null);

  useEffect(() => {
    setTime("");
  }, [barberId, date]);

  // Initial load
  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .then(({ data }) => setGlobalServices(data || []));
    if (!presetBarberId) {
      supabase
        .from("barbers")
        .select("*")
        .eq("active", true)
        .then(({ data }) => setBarbers(data || []));
    }
    if (user)
      supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setName(data.full_name || "");
            setPhone(data.phone || "");
          }
        });
  }, [user, presetBarberId]);

  // Load services / info for selected barber
  useEffect(() => {
    if (!barberId) {
      setBarberServices([]);
      setSelectedBarber(null);
      setBarberSchedule(null);
      return;
    }
    supabase
      .from("barber_services")
      .select("*")
      .eq("barber_id", barberId)
      .eq("active", true)
      .then(({ data }) => setBarberServices(data || []));
    supabase
      .from("barbers")
      .select("*")
      .eq("id", barberId)
      .maybeSingle()
      .then(({ data }) => setSelectedBarber(data));
    const dayOfWeek = new Date(date).getDay(); // 0 = Sunday
    supabase
      .from("barber_schedule")
      .select("*")
      .eq("barber_id", barberId)
      .eq("day_of_week", dayOfWeek)
      .maybeSingle()
      .then(({ data }) => setBarberSchedule(data));
  }, [barberId, date]);

  // Available services: barber-specific only when barber selected; otherwise global
  const services = useMemo(() => {
    if (barberId)
      return barberServices.length ? barberServices : globalServices;
    return globalServices;
  }, [barberId, barberServices, globalServices]);

  // Load taken slots + realtime subscription
  useEffect(() => {
    if (!barberId || !date) return;
    const fetchTaken = async () => {
      const { data } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("barber_id", barberId)
        .eq("appointment_date", date)
        .neq("status", "cancelled");
      setTaken((data || []).map((a) => a.appointment_time?.slice(0, 5)));
    };
    fetchTaken();

    const channel = supabase
      .channel(`book-${barberId}-${date}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `barber_id=eq.${barberId}`,
        },
        () => fetchTaken(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [barberId, date]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !serviceId || !barberId || !time)
      return toast.error("Barcha maydonlarni to'ldiring");
    setLoading(true);
    const svc = services.find((s) => s.id === serviceId);
    // For barber_services we don't have an FK to global services — store null service_id when custom
    const isBarberSvc = !!barberServices.find((s) => s.id === serviceId);
    const { data: inserted, error } = await supabase
      .from("appointments")
      .insert({
        client_id: user.id,
        service_id: isBarberSvc ? null : serviceId,
        barber_id: barberId,
        appointment_date: date,
        appointment_time: time,
        client_name: name,
        client_phone: phone,
        notes: isBarberSvc
          ? `${svc?.name}${notes ? ` — ${notes}` : ""}`
          : notes,
        total_price: svc?.price || 0,
        status: "pending",
      })
      .select("id")
      .maybeSingle();
    setLoading(false);
    if (error) return toast.error(error.message);
    // Fire-and-forget Telegram notification (no await/no toast on failure — bot is optional)
    if (inserted?.id) {
      supabase.functions
        .invoke("notify-booking", {
          body: { appointment_id: inserted.id, event: "created" },
        })
        .catch(() => {});
    }
    toast.success(t("client.bookingSuccess"));
    navigate("/my-bookings");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PageHeader title={t("client.bookTitle")} />
      <Card>
        <form onSubmit={submit} className="space-y-4">
          {presetBarberId && selectedBarber ? (
            <div className="flex items-center gap-3 p-3 rounded-md bg-muted/40 border border-border">
              {selectedBarber.photo_url ? (
                <img
                  src={selectedBarber.photo_url}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {selectedBarber.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedBarber.full_name}
                </p>
                {selectedBarber.specialty && (
                  <p className="text-xs text-muted-foreground">
                    {selectedBarber.specialty}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {t("client.selectBarber")}
              </label>
              <select
                required
                value={barberId}
                onChange={(e) => setBarberId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              >
                <option value="">—</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              {t("client.selectService")}
            </label>
            <select
              required
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              disabled={!barberId}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background disabled:opacity-50"
            >
              <option value="">—</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {Number(s.price).toLocaleString()}{" "}
                  {t("common.sum")}
                </option>
              ))}
            </select>
            {barberId && !services.length && (
              <p className="text-xs text-muted-foreground mt-1">
                Bu sartarosh hali xizmat qo'shmagan
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {t("client.selectDate")}
              </label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {t("field.phone")}
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998..."
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              {t("field.fullName")}
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              {t("client.selectTime")}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {TIMES.filter((tm) => {
                if (barberSchedule?.is_off) return false;
                if (!barberSchedule) return true;
                const [h, m] = tm.split(":").map(Number);
                const timeNum = h * 60 + m;
                const [sh, sm] = barberSchedule.start_time
                  .split(":")
                  .map(Number);
                const [eh, em] = barberSchedule.end_time.split(":").map(Number);
                const startNum = sh * 60 + sm;
                const endNum = eh * 60 + em;
                return timeNum >= startNum && timeNum < endNum;
              }).map((tm) => {
                const isTaken = taken.includes(tm);
                const isToday = date === new Date().toISOString().slice(0, 10);
                const now = new Date();
                const [hours, minutes] = tm.split(":").map(Number);
                const slotTime = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  hours,
                  minutes,
                );
                const isPast = isToday && slotTime < now;
                const disabled = isTaken || isPast;
                return (
                  <button
                    type="button"
                    key={tm}
                    disabled={disabled}
                    onClick={() => setTime(tm)}
                    className={`px-2 py-1.5 text-xs rounded-md forge-transition ${time === tm ? "bg-primary text-primary-foreground" : disabled ? "bg-muted text-muted-foreground line-through cursor-not-allowed" : "bg-secondary hover:bg-primary/10"}`}
                  >
                    {tm}
                  </button>
                );
              })}
            </div>
            {barberSchedule?.is_off && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("client.barberOff")}
              </p>
            )}
            {!barberSchedule && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("client.noScheduleFallback")}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              {t("field.notes")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : t("client.bookBtn")}
          </button>
        </form>
      </Card>
    </div>
  );
}
