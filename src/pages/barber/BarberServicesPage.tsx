import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

export default function BarberServicesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<any>({
    name: "",
    price: 0,
    duration_minutes: 30,
    discount_percent: 0,
    description: "",
  });
  const [showNew, setShowNew] = useState(false);

  const load = async (bid: string) => {
    const { data } = await supabase
      .from("barber_services")
      .select("*")
      .eq("barber_id", bid)
      .order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    if (!user) return;
    supabase
      .from("barbers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setBarberId(data.id);
          load(data.id);
        }
      });
  }, [user]);

  const create = async () => {
    if (!barberId || !draft.name.trim())
      return toast.error(t("barber.services.errorName"));
    const { error } = await supabase.from("barber_services").insert({
      name: draft.name,
      price: draft.price,
      duration_minutes: draft.duration_minutes,
      description: draft.description,
      barber_id: barberId,
    });
    if (error) return toast.error(error.message);
    setShowNew(false);
    setDraft({
      name: "",
      price: 0,
      duration_minutes: 30,
      discount_percent: 0,
      description: "",
    });
    load(barberId);
    toast.success(t("barber.services.added"));
  };

  const update = async (id: string, patch: any) => {
    const { error } = await supabase
      .from("barber_services")
      .update(patch)
      .eq("id", id);
    if (error) return toast.error(error.message);
    load(barberId!);
    setEditing(null);
  };

  const del = async (id: string) => {
    if (!confirm(t("barber.services.deleteConfirm"))) return;
    await supabase.from("barber_services").delete().eq("id", id);
    load(barberId!);
  };

  const inputCls =
    "px-2 py-1 text-sm border border-border rounded bg-background";

  if (!barberId)
    return (
      <div className="p-6">
        <Empty text={t("barber.profileNotSetup")} />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title={t("barber.services.title")}
        subtitle={t("barber.services.subtitle")}
        action={
          <button
            onClick={() => setShowNew(true)}
            className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> {t("barber.services.new")}
          </button>
        }
      />

      {showNew && (
        <Card className="mb-4">
          <h4 className="text-sm font-semibold mb-3">
            {t("barber.services.newServiceHeading")}
          </h4>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {t("barber.services.fields.name")}
              </label>
              <input
                className={`${inputCls} w-full`}
                placeholder={t("barber.services.placeholders.name")}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {t("barber.services.fields.price")}
              </label>
              <input
                type="number"
                className={`${inputCls} w-full`}
                placeholder={t("barber.services.placeholders.price")}
                value={draft.price}
                onChange={(e) =>
                  setDraft({ ...draft, price: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {t("barber.services.fields.duration")}
              </label>
              <input
                type="number"
                className={`${inputCls} w-full`}
                placeholder={t("barber.services.placeholders.duration")}
                value={draft.duration_minutes}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    duration_minutes: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs text-muted-foreground mb-1 block">
                {t("barber.services.fields.description")}
              </label>
              <input
                className={`${inputCls} w-full`}
                placeholder={t("barber.services.placeholders.description")}
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={create}
              className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded"
            >
              {t("common.save")}
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-3 py-1.5 text-xs bg-secondary rounded"
            >
              {t("common.cancel")}
            </button>
          </div>
        </Card>
      )}

      {!items.length ? (
        <Empty text={t("barber.services.empty")} />
      ) : (
        <div className="space-y-2">
          {items.map((s) => {
            const isEd = editing === s.id;
            const finalPrice =
              Number(s.price) * (1 - (s.discount_percent || 0) / 100);
            return (
              <Card key={s.id}>
                {isEd ? (
                  <div className="grid sm:grid-cols-5 gap-2 items-center">
                    <input
                      className={inputCls}
                      defaultValue={s.name}
                      onChange={(e) => (s.name = e.target.value)}
                    />
                    <input
                      type="number"
                      className={inputCls}
                      defaultValue={s.price}
                      onChange={(e) => (s.price = Number(e.target.value))}
                    />
                    <input
                      type="number"
                      className={inputCls}
                      defaultValue={s.duration_minutes}
                      onChange={(e) =>
                        (s.duration_minutes = Number(e.target.value))
                      }
                    />
                    <input
                      type="number"
                      className={inputCls}
                      defaultValue={s.discount_percent}
                      onChange={(e) =>
                        (s.discount_percent = Number(e.target.value))
                      }
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          update(s.id, {
                            name: s.name,
                            price: s.price,
                            duration_minutes: s.duration_minutes,
                            discount_percent: s.discount_percent,
                          })
                        }
                        className="p-1.5 bg-primary text-primary-foreground rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="p-1.5 bg-secondary rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.duration_minutes} daqiqa{" "}
                        {s.description && `• ${s.description}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {s.discount_percent > 0 && (
                          <p className="text-[10px] text-muted-foreground line-through">
                            {Number(s.price).toLocaleString()} so'm
                          </p>
                        )}
                        <p className="text-sm font-semibold text-primary">
                          {finalPrice.toLocaleString()} so'm
                        </p>
                        {s.discount_percent > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">
                            -{s.discount_percent}%
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditing(s.id);
                        }}
                        className="p-1.5 hover:bg-muted rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => update(s.id, { active: !s.active })}
                        className={`text-xs px-2 py-1 rounded ${s.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                      >
                        {s.active
                          ? t("barber.services.active")
                          : t("barber.services.inactive")}
                      </button>
                      <button
                        onClick={() => del(s.id)}
                        className="p-1.5 hover:bg-destructive/10 text-destructive rounded"
                        title={t("common.delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
