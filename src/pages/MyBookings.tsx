import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function MyBookings() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("appointments").select("*, services(name, price), barbers(full_name)").eq("client_id", user.id).order("appointment_date", { ascending: false }).order("appointment_time", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const cancel = async (id: string) => {
    if (!confirm("Bekor qilinsinmi?")) return;
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Bekor qilindi"); load();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title={t("nav.myBookings")} />
      {!items.length ? <Empty text={t("common.empty")} /> : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{a.services?.name} — {a.barbers?.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.appointment_date} • {a.appointment_time?.slice(0, 5)} • {Number(a.total_price).toLocaleString()} so'm</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{t(`status.${a.status}`)}</span>
                  {(a.status === "pending" || a.status === "confirmed") && (
                    <button onClick={() => cancel(a.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded" title="Bekor qilish"><X className="w-4 h-4" /></button>
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
