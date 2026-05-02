import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, Card } from "@/components/shared/Page";
import { toast } from "sonner";
import { Upload, MapPin, Instagram, Youtube, Send } from "lucide-react";

export default function BarberProfileEdit() {
  const { user } = useAuth();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "cover" | null>(null);
  const [form, setForm] = useState<any>({
    full_name: "", username: "", telegram_username: "", phone: "",
    bio: "", specialty: "", experience_years: 0,
    photo_url: "", cover_url: "",
    instagram: "", tiktok: "", youtube: "",
    salon_name: "", salon_address: "", map_link: "",
    home_service: false, busy_status: false,
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: b } = await supabase.from("barbers").select("*").eq("user_id", user.id).maybeSingle();
      const { data: p } = await supabase.from("profiles").select("phone").eq("user_id", user.id).maybeSingle();
      if (b) setBarberId(b.id);
      setForm((f: any) => ({ ...f, ...(b || {}), phone: p?.phone || "" }));
    })();
  }, [user]);

  const upload = async (file: File, kind: "photo" | "cover") => {
    if (!user) return;
    setUploading(kind);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file, { upsert: true });
    if (upErr) { setUploading(null); return toast.error(upErr.message); }
    const { data: pub } = supabase.storage.from("portfolio").getPublicUrl(path);
    setForm({ ...form, [kind === "photo" ? "photo_url" : "cover_url"]: pub.publicUrl });
    setUploading(null);
    toast.success("Yuklandi");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { phone, ...barberData } = form;
    if (barberId) {
      await supabase.from("barbers").update(barberData).eq("id", barberId);
    } else {
      const { data } = await supabase.from("barbers").insert({ ...barberData, user_id: user.id }).select().maybeSingle();
      if (data) setBarberId(data.id);
    }
    await supabase.from("profiles").upsert({ user_id: user.id, full_name: form.full_name, phone }, { onConflict: "user_id" });
    setLoading(false);
    toast.success("Saqlandi");
  };

  const Field = ({ label, children }: any) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
  const inputCls = "w-full px-3 py-2 text-sm border border-border rounded-md bg-background";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Profil ma'lumotlari" subtitle="Mijozlar profilingizda ko'radigan ma'lumotlar" />

      <form onSubmit={save} className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold mb-4">Rasmlar</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Cover (banner)</p>
              <div className="aspect-[3/1] rounded-md bg-muted overflow-hidden mb-2 relative">
                {form.cover_url && <img src={form.cover_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary rounded-md cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> {uploading === "cover" ? "..." : "Cover yuklash"}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "cover")} />
              </label>
            </div>
            <div className="w-full sm:w-40">
              <p className="text-xs text-muted-foreground mb-2">Profil rasmi</p>
              <div className="w-32 h-32 rounded-full bg-muted overflow-hidden mb-2">
                {form.photo_url && <img src={form.photo_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary rounded-md cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> {uploading === "photo" ? "..." : "Rasm"}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "photo")} />
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4">Asosiy</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Ism familiya"><input className={inputCls} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></Field>
            <Field label="Username (@nick)"><input className={inputCls} value={form.username || ""} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="aziz_barber" /></Field>
            <Field label="Telefon"><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998..." /></Field>
            <Field label="Telegram"><input className={inputCls} value={form.telegram_username || ""} onChange={(e) => setForm({ ...form, telegram_username: e.target.value })} placeholder="@username" /></Field>
            <Field label="Mutaxassislik"><input className={inputCls} value={form.specialty || ""} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Fade, Beard..." /></Field>
            <Field label="Tajriba (yil)"><input type="number" min={0} className={inputCls} value={form.experience_years || 0} onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })} /></Field>
            <div className="sm:col-span-2"><Field label="Bio"><textarea rows={3} className={inputCls} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field></div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Lokatsiya</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Salon nomi"><input className={inputCls} value={form.salon_name || ""} onChange={(e) => setForm({ ...form, salon_name: e.target.value })} /></Field>
            <Field label="Manzil"><input className={inputCls} value={form.salon_address || ""} onChange={(e) => setForm({ ...form, salon_address: e.target.value })} /></Field>
            <div className="sm:col-span-2"><Field label="Google Maps havola"><input className={inputCls} value={form.map_link || ""} onChange={(e) => setForm({ ...form, map_link: e.target.value })} placeholder="https://maps.google.com/..." /></Field></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.home_service} onChange={(e) => setForm({ ...form, home_service: e.target.checked })} /> Uyga borib xizmat ko'rsataman</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.busy_status} onChange={(e) => setForm({ ...form, busy_status: e.target.checked })} /> Hozir bandman (bron qabul qilmayman)</label>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4">Ijtimoiy tarmoqlar</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label={<><Instagram className="w-3 h-3 inline" /> Instagram</>}><input className={inputCls} value={form.instagram || ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@username" /></Field>
            <Field label={<><Send className="w-3 h-3 inline" /> TikTok</>}><input className={inputCls} value={form.tiktok || ""} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} placeholder="@username" /></Field>
            <Field label={<><Youtube className="w-3 h-3 inline" /> YouTube</>}><input className={inputCls} value={form.youtube || ""} onChange={(e) => setForm({ ...form, youtube: e.target.value })} placeholder="channel" /></Field>
          </div>
        </Card>

        <button disabled={loading} className="px-5 py-2.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
