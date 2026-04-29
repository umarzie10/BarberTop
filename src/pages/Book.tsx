import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card } from "@/components/shared/Page";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];

export default function Book() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true).then(({ data }) => setServices(data || []));
    supabase.from("barbers").select("*").eq("active", true).then(({ data }) => setBarbers(data || []));
    if (user) supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      setProfile(data);
      if (data) { setName(data.full_name || ""); setPhone(data.phone || ""); }
    });
  }, [user]);

  useEffect(() => {
    if (!barberId || !date) return;
    supabase.from("appointments").select("appointment_time").eq("barber_id", barberId).eq("appointment_date", date).neq("status", "cancelled").then(({ data }) => {
      setTaken((data || []).map((a) => a.appointment_time?.slice(0, 5)));
    });
  }, [barberId, date]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !serviceId || !barberId || !time) return toast.error("Barcha maydonlarni to'ldiring");
    setLoading(true);
    const svc = services.find((s) => s.id === serviceId);
    const { error } = await supabase.from("appointments").insert({
      client_id: user.id,
      service_id: serviceId,
      barber_id: barberId,
      appointment_date: date,
      appointment_time: time,
      client_name: name,
      client_phone: phone,
      notes,
      total_price: svc?.price || 0,
      status: "pending",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(t("client.bookingSuccess"));
    navigate("/my-bookings");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PageHeader title={t("client.bookTitle")} />
      <Card>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("client.selectService")}</label>
            <select required value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background">
              <option value="">—</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name} — {Number(s.price).toLocaleString()} so'm</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("client.selectBarber")}</label>
            <select required value={barberId} onChange={(e) => setBarberId(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background">
              <option value="">—</option>
              {barbers.map((b) => <option key={b.id} value={b.id}>{b.full_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">{t("client.selectDate")}</label>
              <input type="date" required value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">{t("field.phone")}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998..." className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("field.fullName")}</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("client.selectTime")}</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {TIMES.map((tm) => {
                const isTaken = taken.includes(tm);
                return (
                  <button type="button" key={tm} disabled={isTaken} onClick={() => setTime(tm)}
                    className={`px-2 py-1.5 text-xs rounded-md forge-transition ${time === tm ? "bg-primary text-primary-foreground" : isTaken ? "bg-muted text-muted-foreground line-through cursor-not-allowed" : "bg-secondary hover:bg-primary/10"}`}>
                    {tm}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("field.notes")}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">
            {loading ? "..." : t("client.bookBtn")}
          </button>
        </form>
      </Card>
    </div>
  );
}
