import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toast } from "sonner";

const DAYS_KEY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default function BarberSchedulePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [saving, setSaving] = useState<number | null>(null);

  const days = DAYS_KEY.map((key) => t(`sched.day.${key}`));

  const load = async (bid: string) => {
    const { data } = await supabase
      .from("barber_schedule")
      .select("*")
      .eq("barber_id", bid)
      .order("day_of_week");
    setSchedule(data || []);
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

  const setDay = async (dow: number, patch: any) => {
    if (!barberId) return;
    setSaving(dow);
    const existing = schedule.find((x) => x.day_of_week === dow);
    if (existing) {
      await supabase
        .from("barber_schedule")
        .update(patch)
        .eq("id", existing.id);
    } else {
      await supabase
        .from("barber_schedule")
        .insert({ barber_id: barberId, day_of_week: dow, ...patch });
    }
    await load(barberId);
    setSaving(null);
  };

  if (!barberId)
    return (
      <div className="p-6">
        <Empty text={t("common.empty")} />
      </div>
    );

  const inputCls =
    "px-2 py-1.5 text-sm border border-border rounded bg-background";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title={t("sched.title")} subtitle={t("sched.subtitle")} />
      <Card>
        <div className="space-y-3">
          {days.map((d, dow) => {
            const sc = schedule.find((x) => x.day_of_week === dow);
            const off = !!sc?.is_off;
            return (
              <div
                key={dow}
                className="flex items-center gap-3 flex-wrap py-2 border-b border-border last:border-0"
              >
                <span className="w-32 font-medium text-sm text-foreground">
                  {d}
                </span>
                <label className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={!off}
                    onChange={(e) =>
                      setDay(dow, {
                        is_off: !e.target.checked,
                        start_time: sc?.start_time || "09:00",
                        end_time: sc?.end_time || "20:00",
                      })
                    }
                  />
                  {off ? t("sched.off") : t("barber.working")}
                </label>
                {!off && (
                  <>
                    <div>
                      <label className="text-[10px] text-muted-foreground block">
                        {t("sched.start")}
                      </label>
                      <input
                        type="time"
                        value={sc?.start_time?.slice(0, 5) || "09:00"}
                        onChange={(e) =>
                          setDay(dow, {
                            start_time: e.target.value,
                            end_time: sc?.end_time || "20:00",
                            is_off: false,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground block">
                        {t("sched.end")}
                      </label>
                      <input
                        type="time"
                        value={sc?.end_time?.slice(0, 5) || "20:00"}
                        onChange={(e) =>
                          setDay(dow, {
                            end_time: e.target.value,
                            start_time: sc?.start_time || "09:00",
                            is_off: false,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                  </>
                )}
                {saving === dow && (
                  <span className="text-xs text-muted-foreground">...</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
