import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toCSV, downloadCSV } from "@/lib/csv";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Appointments() {
  const { t } = useLanguage();
  const { isAdmin, isBarber, role } = useUserRole();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    let q = supabase.from("appointments").select("*, services(name, price), barbers(full_name)").order("appointment_date", { ascending: false }).order("appointment_time", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter as any);
    const { data } = await q;
    setItems(data || []);
  };

  useEffect(() => {
    if (!role) return;
    load();
    const ch = supabase.channel("appts-realtime").on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [filter, role]);

  const setStatus = async (id: string, status: any) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) return toast.error(error.message);
  };

  const exportCSV = () => downloadCSV("appointments.csv", toCSV(items.map((a) => ({
    date: a.appointment_date, time: a.appointment_time, client: a.client_name, phone: a.client_phone,
    service: a.services?.name, barber: a.barbers?.full_name, price: a.total_price, status: a.status,
  }))));

  const statuses = ["all", "pending", "confirmed", "completed", "cancelled", "no_show"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title={t("nav.appointments")} action={
        <button onClick={exportCSV} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />{t("common.export")}
        </button>
      } />

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap forge-transition ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
            {s === "all" ? "Hammasi" : t(`status.${s}`)}
          </button>
        ))}
      </div>

      {!items.length ? <Empty text={t("common.empty")} /> : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Sana / Vaqt</th>
                  <th className="text-left p-3">Mijoz</th>
                  <th className="text-left p-3">Xizmat</th>
                  <th className="text-left p-3">Sartarosh</th>
                  <th className="text-left p-3">Narx</th>
                  <th className="text-left p-3">Holat</th>
                  {(isAdmin || isBarber) && <th className="text-left p-3">Amal</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="p-3">{a.appointment_date} <span className="text-muted-foreground">{a.appointment_time?.slice(0, 5)}</span></td>
                    <td className="p-3"><div>{a.client_name}</div><div className="text-xs text-muted-foreground">{a.client_phone}</div></td>
                    <td className="p-3">{a.services?.name}</td>
                    <td className="p-3">{a.barbers?.full_name}</td>
                    <td className="p-3">{Number(a.total_price).toLocaleString()} so'm</td>
                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{t(`status.${a.status}`)}</span></td>
                    {(isAdmin || isBarber) && (
                      <td className="p-3">
                        <div className="flex gap-1">
                          <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)} className="text-xs border border-border rounded px-1.5 py-1 bg-background">
                            <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No-show</option>
                          </select>
                          {isAdmin && <button onClick={() => del(a.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
