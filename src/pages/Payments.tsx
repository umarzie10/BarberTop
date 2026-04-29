import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Stat, Empty } from "@/components/shared/Page";
import { toCSV, downloadCSV } from "@/lib/csv";
import { Download } from "lucide-react";

export default function Payments() {
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("payments").select("*, appointments(client_name, services(name), barbers(full_name))").order("paid_at", { ascending: false }).limit(200);
    setItems(data || []);
  };
  useEffect(() => {
    load();
    const ch = supabase.channel("pay-rt").on("postgres_changes", { event: "*", schema: "public", table: "payments" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date(); monthStart.setDate(1);
  const todaySum = items.filter((p) => p.paid_at >= today).reduce((s, p) => s + Number(p.amount), 0);
  const monthSum = items.filter((p) => new Date(p.paid_at) >= monthStart).reduce((s, p) => s + Number(p.amount), 0);

  const exportCSV = () => downloadCSV("payments.csv", toCSV(items.map((p) => ({
    paid_at: p.paid_at, amount: p.amount, method: p.method,
    client: p.appointments?.client_name, service: p.appointments?.services?.name, barber: p.appointments?.barbers?.full_name,
  }))));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title={t("nav.payments")} action={
        <button onClick={exportCSV} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />{t("common.export")}
        </button>
      } />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Stat label={t("dash.admin.todayRevenue")} value={`${todaySum.toLocaleString()} so'm`} />
        <Stat label={t("dash.admin.monthRevenue")} value={`${monthSum.toLocaleString()} so'm`} />
        <Stat label="Jami yozuvlar" value={items.length} />
      </div>

      {!items.length ? <Empty text={t("common.empty")} /> : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="text-left p-3">Sana</th><th className="text-left p-3">Mijoz</th><th className="text-left p-3">Xizmat</th><th className="text-left p-3">Sartarosh</th><th className="text-left p-3">Usul</th><th className="text-left p-3">Summa</th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3 text-muted-foreground">{new Date(p.paid_at).toLocaleString()}</td>
                    <td className="p-3">{p.appointments?.client_name || "—"}</td>
                    <td className="p-3">{p.appointments?.services?.name || "—"}</td>
                    <td className="p-3">{p.appointments?.barbers?.full_name || "—"}</td>
                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-muted">{p.method}</span></td>
                    <td className="p-3 font-semibold text-primary">{Number(p.amount).toLocaleString()} so'm</td>
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
