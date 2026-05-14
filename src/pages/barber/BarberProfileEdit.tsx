import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, Card } from "@/components/shared/Page";
import { toast } from "sonner";
import { Upload, MapPin, Instagram, Youtube, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BarberProfileEdit() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "cover" | null>(null);
  const [form, setForm] = useState<any>({
    full_name: "",
    username: "",
    telegram_username: "",
    phone: "",
    bio: "",
    specialty: "",
    experience_years: 0,
    photo_url: "",
    cover_url: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    salon_name: "",
    salon_address: "",
    map_link: "",
    home_service: false,
    busy_status: false,
  });

  const regions = [
    {
      value: "Toshkent",
      label: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
    },
    {
      value: "Samarqand",
      label: { uz: "Samarqand", ru: "Самарканд", en: "Samarkand" },
    },
    { value: "Buxoro", label: { uz: "Buxoro", ru: "Бухара", en: "Bukhara" } },
    {
      value: "Andijon",
      label: { uz: "Andijon", ru: "Андижан", en: "Andijan" },
    },
    {
      value: "Farg'ona",
      label: { uz: "Farg'ona", ru: "Фергана", en: "Fergana" },
    },
    {
      value: "Namangan",
      label: { uz: "Namangan", ru: "Наманган", en: "Namangan" },
    },
    {
      value: "Qashqadaryo",
      label: { uz: "Qashqadaryo", ru: "Кашкадарья", en: "Kashkadarya" },
    },
    {
      value: "Surxondaryo",
      label: { uz: "Surxondaryo", ru: "Сурхандарья", en: "Surkhandarya" },
    },
    { value: "Xorazm", label: { uz: "Xorazm", ru: "Хорезм", en: "Khorezm" } },
    { value: "Navoiy", label: { uz: "Navoiy", ru: "Навои", en: "Navoi" } },
    { value: "Jizzax", label: { uz: "Jizzax", ru: "Джизак", en: "Jizzakh" } },
    {
      value: "Sirdaryo",
      label: { uz: "Sirdaryo", ru: "Сырдарья", en: "Syrdarya" },
    },
    {
      value: "Qoraqalpog'iston",
      label: {
        uz: "Qoraqalpog'iston",
        ru: "Каракалпакстан",
        en: "Karakalpakstan",
      },
    },
  ];

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: b } = await supabase
        .from("barbers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      const { data: p } = await supabase
        .from("profiles")
        .select("phone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (b) setBarberId(b.id);
      setForm((f: any) => ({ ...f, ...(b || {}), phone: p?.phone || "" }));
    })();
  }, [user]);

  const upload = async (file: File, kind: "photo" | "cover") => {
    if (!user) return;
    setUploading(kind);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio")
      .upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(null);
      return toast.error(upErr.message);
    }
    const { data: pub } = supabase.storage.from("portfolio").getPublicUrl(path);
    setForm({
      ...form,
      [kind === "photo" ? "photo_url" : "cover_url"]: pub.publicUrl,
    });
    setUploading(null);
    toast.success(t("barberProfile.uploaded"));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { phone, ...barberData } = form;
    if (barberId) {
      await supabase.from("barbers").update(barberData).eq("id", barberId);
    } else {
      const { data } = await supabase
        .from("barbers")
        .insert({ ...barberData, user_id: user.id })
        .select()
        .maybeSingle();
      if (data) setBarberId(data.id);
    }
    await supabase
      .from("profiles")
      .upsert(
        { user_id: user.id, full_name: form.full_name, phone },
        { onConflict: "user_id" },
      );
    setLoading(false);
    toast.success(t("barberProfile.saved"));
  };

  const Field = ({ label, children }: any) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
  const inputCls =
    "w-full px-3 py-2 text-sm border border-border rounded-md bg-background";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title={t("barberProfile.title")}
        subtitle={t("barberProfile.subtitle")}
      />

      <form onSubmit={save} className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold mb-4">
            {t("barberProfile.photo")}
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-muted overflow-hidden">
              {form.photo_url && (
                <img
                  src={form.photo_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary rounded-md cursor-pointer">
              <Upload className="w-3.5 h-3.5" />{" "}
              {uploading === "photo"
                ? t("barberProfile.uploading")
                : t("barberProfile.uploadPhoto")}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  e.target.files?.[0] && upload(e.target.files[0], "photo")
                }
              />
            </label>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4">
            {t("barberProfile.basic")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label={t("barberProfile.fullName")}>
              <input
                className={inputCls}
                value={form.full_name}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    full_name: e.target.value,
                  }))
                }
                required
              />
            </Field>
            <Field label={t("barberProfile.username")}>
              <input
                className={inputCls}
                value={form.username || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder={t("barberProfile.usernamePlaceholder")}
              />
            </Field>
            <Field label={t("barberProfile.phone")}>
              <input
                className={inputCls}
                value={form.phone}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, phone: e.target.value }))
                }
                placeholder={t("barberProfile.phonePlaceholder")}
              />
            </Field>
            <Field label={t("barberProfile.telegram")}>
              <input
                className={inputCls}
                value={form.telegram_username || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    telegram_username: e.target.value,
                  }))
                }
                placeholder={t("barberProfile.telegramPlaceholder")}
              />
            </Field>
            <Field label={t("barberProfile.specialty")}>
              <input
                className={inputCls}
                value={form.specialty || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    specialty: e.target.value,
                  }))
                }
                placeholder={t("barberProfile.specialtyPlaceholder")}
              />
            </Field>
            <Field label={t("barberProfile.experience")}>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.experience_years || 0}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    experience_years: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("barberProfile.bio")}>
                <textarea
                  rows={3}
                  className={inputCls}
                  value={form.bio || ""}
                  onChange={(e) =>
                    setForm((prev: any) => ({ ...prev, bio: e.target.value }))
                  }
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {t("barberProfile.location")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label={t("barberProfile.region")}>
              <select
                className={inputCls}
                value={form.region || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, region: e.target.value }))
                }
              >
                <option value="">—</option>
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label[lang]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("barberProfile.district")}>
              <input
                className={inputCls}
                value={form.district || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
                placeholder={t("barberProfile.districtPlaceholder")}
              />
            </Field>
            <Field label={t("barberProfile.salonName")}>
              <input
                className={inputCls}
                value={form.salon_name || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    salon_name: e.target.value,
                  }))
                }
              />
            </Field>
            <Field label={t("barberProfile.address")}>
              <input
                className={inputCls}
                value={form.salon_address || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    salon_address: e.target.value,
                  }))
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("barberProfile.mapLink")}>
                <input
                  className={inputCls}
                  value={form.map_link || ""}
                  onChange={(e) =>
                    setForm((prev: any) => ({
                      ...prev,
                      map_link: e.target.value,
                    }))
                  }
                  placeholder={t("barberProfile.mapPlaceholder")}
                />
              </Field>
            </div>
            <Field label={t("barberProfile.gender")}>
              <select
                className={inputCls}
                value={form.gender || "any"}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="any">{t("barberProfile.genderAny")}</option>
                <option value="male">{t("barberProfile.genderMale")}</option>
                <option value="female">
                  {t("barberProfile.genderFemale")}
                </option>
              </select>
            </Field>
            <Field label={t("barberProfile.latitude")}>
              <input
                type="number"
                step="0.000001"
                className={inputCls}
                value={form.latitude || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    latitude: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="41.311081"
              />
            </Field>
            <Field label={t("barberProfile.longitude")}>
              <input
                type="number"
                step="0.000001"
                className={inputCls}
                value={form.longitude || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    longitude: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="69.240562"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.home_service}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    home_service: e.target.checked,
                  }))
                }
              />{" "}
              {t("barberProfile.homeService")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.busy_status}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    busy_status: e.target.checked,
                  }))
                }
              />{" "}
              {t("barberProfile.busyStatus")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.fast_response || false}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    fast_response: e.target.checked,
                  }))
                }
              />{" "}
              {t("barberProfile.fastResponse")}
            </label>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4">
            {t("barberProfile.social")}
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field
              label={
                <>
                  <Instagram className="w-3 h-3 inline" />{" "}
                  {t("barberProfile.instagram")}
                </>
              }
            >
              <input
                className={inputCls}
                value={form.instagram || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    instagram: e.target.value,
                  }))
                }
                placeholder={t("barberProfile.socialPlaceholder")}
              />
            </Field>
            <Field
              label={
                <>
                  <Send className="w-3 h-3 inline" />{" "}
                  {t("barberProfile.tiktok")}
                </>
              }
            >
              <input
                className={inputCls}
                value={form.tiktok || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, tiktok: e.target.value }))
                }
                placeholder={t("barberProfile.socialPlaceholder")}
              />
            </Field>
            <Field
              label={
                <>
                  <Youtube className="w-3 h-3 inline" />{" "}
                  {t("barberProfile.youtube")}
                </>
              }
            >
              <input
                className={inputCls}
                value={form.youtube || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, youtube: e.target.value }))
                }
                placeholder={t("barberProfile.youtubePlaceholder")}
              />
            </Field>
          </div>
        </Card>

        <button
          disabled={loading}
          className="px-5 py-2.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {loading ? t("barberProfile.saving") : t("barberProfile.save")}
        </button>
      </form>
    </div>
  );
}
