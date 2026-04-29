import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar } from "lucide-react";

export default function ClientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [appts, setAppts] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("appointments")
      .select("*, services(name, price), barbers(full_name)")
      .eq("client_id", user.id)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false })
      .limit(5);
    setAppts(data || []);
  };

  useEffect(() => { load(); }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-xl p-8 mb-6">
        <div className="flex items-center gap-3 mb-2"><Sparkles className="w-6 h-6" /><h1 className="text-2xl font-semibold">{t("client.welcome")}!</h1></div>
        <p className="opacity-90 mb-4">Barber Studio'ga xush kelibsiz. Onlayn navbat oling.</p>
        <button onClick={() => navigate("/book")} className="bg-background text-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 forge-transition">
          {t("client.bookBtn")}
        </button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> {t("nav.myBookings")}</h3>
          <button onClick={() => navigate("/my-bookings")} className="text-xs text-primary hover:underline">Hammasini ko'rish</button>
        </div>
        {!appts.length ? <Empty text="Hali bron yo'q. Birinchisini hozir oling!" /> : (
          <div className="space-y-2">
            {appts.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.services?.name} — {a.barbers?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{a.appointment_date} • {a.appointment_time?.slice(0, 5)}</p>
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
