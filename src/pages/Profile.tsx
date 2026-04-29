import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card } from "@/components/shared/Page";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({ full_name: data.full_name || "", phone: data.phone || "" });
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({ user_id: user.id, ...form }, { onConflict: "user_id" });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Saqlandi");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <PageHeader title={t("nav.profile")} />
      <Card>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("auth.email")}</label>
            <input value={user?.email || ""} disabled className="w-full px-3 py-2 text-sm border border-border rounded-md bg-muted text-muted-foreground" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("field.fullName")}</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">{t("field.phone")}</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
          </div>
          <button disabled={loading} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">
            {loading ? "..." : t("common.save")}
          </button>
        </form>
      </Card>
    </div>
  );
}
