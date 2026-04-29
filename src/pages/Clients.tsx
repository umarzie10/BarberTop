import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toCSV, downloadCSV } from "@/lib/csv";
import { Download } from "lucide-react";

export default function Clients() {
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "client");
      const ids = (roles || []).map((r) => r.user_id);
      if (!ids.length) return setItems([]);
      const { data } = await supabase.from("profiles").select("*").in("user_id", ids);
      setItems(data || []);
    })();
  }, []);

  const exportCSV = () => downloadCSV("clients.csv", toCSV(items.map((c) => ({ full_name: c.full_name, phone: c.phone }))));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title={t("nav.clients")} action={
        <button onClick={exportCSV} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />{t("common.export")}
        </button>
      } />
      {!items.length ? <Empty text={t("common.empty")} /> : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="text-left p-3">F.I.O</th><th className="text-left p-3">Telefon</th><th className="text-left p-3">Ro'yxatdan o'tgan</th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="p-3 font-medium">{c.full_name || "—"}</td>
                    <td className="p-3 text-muted-foreground">{c.phone || "—"}</td>
                    <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
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
