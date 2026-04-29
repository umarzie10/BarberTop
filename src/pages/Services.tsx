import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toCSV, downloadCSV, pickCSVFile } from "@/lib/csv";
import { Plus, Download, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Services() {
  const { t } = useLanguage();
  const { isAdmin } = useUserRole();
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration_minutes: "30" });

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("services").insert({
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      duration_minutes: Number(form.duration_minutes) || 30,
    });
    if (error) return toast.error(error.message);
    toast.success("Saqlandi");
    setShow(false);
    setForm({ name: "", description: "", price: "", duration_minutes: "30" });
    load();
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const exportCSV = () => {
    const csv = toCSV(items.map((s) => ({ name: s.name, description: s.description, price: s.price, duration_minutes: s.duration_minutes, active: s.active })));
    downloadCSV("services.csv", csv);
  };

  const importCSV = async () => {
    try {
      const rows = await pickCSVFile();
      const payload = rows.filter((r) => r.name).map((r) => ({
        name: r.name,
        description: r.description || null,
        price: Number(r.price) || 0,
        duration_minutes: Number(r.duration_minutes) || 30,
        active: r.active !== "false",
      }));
      if (!payload.length) return toast.error("CSV bo'sh");
      const { error } = await supabase.from("services").insert(payload);
      if (error) throw error;
      toast.success(`${payload.length} ta xizmat qo'shildi`);
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title={t("nav.services")} action={isAdmin ? (
        <>
          <button onClick={importCSV} className="px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded-md hover:opacity-90 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" />{t("common.import")}</button>
          <button onClick={exportCSV} className="px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded-md hover:opacity-90 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />{t("common.export")}</button>
          <button onClick={() => setShow(true)} className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" />{t("common.add")}</button>
        </>
      ) : null} />

      {show && (
        <Card className="mb-4">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder={t("field.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <input required type="number" placeholder={t("field.price")} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <input type="number" placeholder={t("field.duration")} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <input placeholder="Tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <div className="col-span-full flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">{t("common.save")}</button>
              <button type="button" onClick={() => setShow(false)} className="px-4 py-2 text-sm bg-muted rounded-md">{t("common.cancel")}</button>
            </div>
          </form>
        </Card>
      )}

      {!items.length ? <Empty text={t("common.empty")} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((s) => (
            <Card key={s.id} className="relative">
              {isAdmin && <button onClick={() => del(s.id)} className="absolute top-3 right-3 p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="w-3.5 h-3.5" /></button>}
              <h3 className="font-semibold text-foreground">{s.name}</h3>
              {s.description && <p className="text-xs text-muted-foreground mt-1">{s.description}</p>}
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-semibold text-primary">{Number(s.price).toLocaleString()} so'm</span>
                <span className="text-xs text-muted-foreground">{s.duration_minutes} daq.</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
