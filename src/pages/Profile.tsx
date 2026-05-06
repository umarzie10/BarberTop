import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card } from "@/components/shared/Page";
import { toast } from "sonner";
import { Send, Check, Copy } from "lucide-react";

const BOT_USERNAME = "barbertop_uz_bot";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ full_name: "", phone: "" });
  const [tgChat, setTgChat] = useState<number | null>(null);
  const [tgToken, setTgToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    if (data) {
      setForm({ full_name: data.full_name || "", phone: data.phone || "" });
      setTgChat(data.telegram_chat_id);
      setTgToken(data.telegram_link_token);
    }
  };

  useEffect(() => { reload(); }, [user]);

  // Poll every 5s while waiting for Telegram link
  useEffect(() => {
    if (!tgToken || tgChat) return;
    const id = setInterval(reload, 5000);
    return () => clearInterval(id);
  }, [tgToken, tgChat]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({ user_id: user.id, ...form }, { onConflict: "user_id" });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Saqlandi");
  };

  const generateLink = async () => {
    if (!user) return;
    const token = `${user.id.slice(0, 8)}-${Math.random().toString(36).slice(2, 10)}`;
    const { error } = await supabase.from("profiles").update({ telegram_link_token: token }).eq("user_id", user.id);
    if (error) return toast.error(error.message);
    setTgToken(token);
    window.open(`https://t.me/${BOT_USERNAME}?start=${token}`, "_blank");
  };

  const unlink = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ telegram_chat_id: null, telegram_link_token: null }).eq("user_id", user.id);
    setTgChat(null); setTgToken(null);
    toast.success("Ulanish o'chirildi");
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
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

      <Card>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9]">
            <Send className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Telegram bog'lash</h3>
            <p className="text-xs text-muted-foreground mb-3">Bron, eslatma va status o'zgarishlari avtomatik Telegramga keladi.</p>

            {tgChat ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                  <Check className="w-3 h-3" /> Bog'langan
                </span>
                <button onClick={unlink} className="text-xs text-destructive hover:underline">O'chirish</button>
              </div>
            ) : tgToken ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">⏳ Telegram'da botni ochib <code className="px-1 rounded bg-muted">/start</code> bosing. Bog'langach avtomatik yangilanadi.</p>
                <a href={`https://t.me/${BOT_USERNAME}?start=${tgToken}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#229ED9] text-white rounded-md hover:opacity-90">
                  <Send className="w-3.5 h-3.5" /> Telegramni ochish
                </a>
              </div>
            ) : (
              <button onClick={generateLink} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#229ED9] text-white rounded-md hover:opacity-90">
                <Send className="w-3.5 h-3.5" /> Telegramni bog'lash
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
