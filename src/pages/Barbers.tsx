import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toCSV, downloadCSV, pickCSVFile } from "@/lib/csv";
import { Plus, Download, Upload, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function Barbers() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAdmin } = useUserRole();
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ full_name: "", specialty: "", bio: "" });

  const load = async () => {
    const { data } = await supabase.from("barbers").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("barbers").insert({ full_name: form.full_name, specialty: form.specialty, bio: form.bio });
    if (error) return toast.error(error.message);
    toast.success("Saqlandi"); setShow(false); setForm({ full_name: "", specialty: "", bio: "" }); load();
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    const { error } = await supabase.from("barbers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const exportCSV = () => downloadCSV("barbers.csv", toCSV(items.map((b) => ({ full_name: b.full_name, specialty: b.specialty, bio: b.bio, rating: b.rating, active: b.active }))));
  const importCSV = async () => {
    try {
      const rows = await pickCSVFile();
      const payload = rows.filter((r) => r.full_name).map((r) => ({
        full_name: r.full_name, specialty: r.specialty || null, bio: r.bio || null,
        rating: Number(r.rating) || 5, active: r.active !== "false",
      }));
      if (!payload.length) return toast.error("Bo'sh");
      const { error } = await supabase.from("barbers").insert(payload);
      if (error) throw error;
      toast.success(`${payload.length} qo'shildi`); load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title={t("nav.barbers")} action={isAdmin ? (
        <>
          <button onClick={importCSV} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" />{t("common.import")}</button>
          <button onClick={exportCSV} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />{t("common.export")}</button>
          <button onClick={() => setShow(true)} className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" />{t("common.add")}</button>
        </>
      ) : null} />

      {show && (
        <Card className="mb-4">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder={t("field.fullName")} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <input placeholder={t("field.specialty")} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <input placeholder={t("field.bio")} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="col-span-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
            <div className="col-span-full flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">{t("common.save")}</button>
              <button type="button" onClick={() => setShow(false)} className="px-4 py-2 text-sm bg-muted rounded-md">{t("common.cancel")}</button>
            </div>
          </form>
        </Card>
      )}

      {!items.length ? <Empty text={t("common.empty")} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((b) => (
            <Card key={b.id} className="relative">
              {isAdmin && <button onClick={() => del(b.id)} className="absolute top-3 right-3 p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="w-3.5 h-3.5" /></button>}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {b.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{b.full_name}</h3>
                  <p className="text-xs text-muted-foreground">{b.specialty}</p>
                </div>
              </div>
              {b.bio && <p className="text-xs text-muted-foreground mt-3">{b.bio}</p>}
              <div className="flex items-center gap-1 mt-3 text-xs"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /><span className="text-foreground font-medium">{Number(b.rating).toFixed(1)}</span></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
