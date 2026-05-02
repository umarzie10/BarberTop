import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { Star, Calendar, MessageCircle, Upload, Trash2, MapPin, Instagram, Youtube, Send, Crown } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Yak", "Du", "Se", "Cho", "Pa", "Ju", "Sha"];

export default function BarberDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [barber, setBarber] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [canReview, setCanReview] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const isOwner = barber?.user_id && user?.id === barber.user_id;

  const load = async () => {
    if (!id) return;
    const [{ data: b }, { data: p }, { data: s }, { data: r }] = await Promise.all([
      supabase.from("barbers").select("*").eq("id", id).maybeSingle(),
      supabase.from("barber_portfolio").select("*").eq("barber_id", id).order("created_at", { ascending: false }),
      supabase.from("barber_schedule").select("*").eq("barber_id", id).order("day_of_week"),
      supabase.from("reviews").select("*").eq("barber_id", id).order("created_at", { ascending: false }),
    ]);
    setBarber(b);
    setPortfolio(p || []);
    setSchedule(s || []);
    setReviews(r || []);
    if (user) {
      const { data: ap } = await supabase.from("appointments").select("id").eq("barber_id", id).eq("client_id", user.id).eq("status", "completed").limit(1).maybeSingle();
      setCanReview(ap);
    }
  };
  useEffect(() => { load(); }, [id, user]);

  const upload = async (file: File) => {
    if (!user || !barber) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file);
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const { data: pub } = supabase.storage.from("portfolio").getPublicUrl(path);
    const { error } = await supabase.from("barber_portfolio").insert({ barber_id: barber.id, image_url: pub.publicUrl });
    setUploading(false);
    if (error) return toast.error(error.message);
    toast.success("Yuklandi"); load();
  };

  const delPhoto = async (p: any) => {
    if (!confirm("O'chirilsinmi?")) return;
    await supabase.from("barber_portfolio").delete().eq("id", p.id);
    load();
  };

  const setDay = async (dow: number, patch: any) => {
    const existing = schedule.find((x) => x.day_of_week === dow);
    if (existing) {
      await supabase.from("barber_schedule").update(patch).eq("id", existing.id);
    } else {
      await supabase.from("barber_schedule").insert({ barber_id: id, day_of_week: dow, ...patch });
    }
    load();
  };

  const submitReview = async () => {
    if (!user || !canReview) return;
    const { error } = await supabase.from("reviews").insert({
      barber_id: id, client_id: user.id, appointment_id: canReview.id, rating, comment,
    });
    if (error) return toast.error(error.message);
    toast.success("Sharh saqlandi"); setComment(""); load();
  };

  const startChat = async () => {
    if (!user || !barber?.user_id) return toast.error("Sartarosh hisobi yo'q");
    const { data: existing } = await supabase.from("chat_threads").select("id")
      .eq("client_id", user.id).eq("barber_user_id", barber.user_id).maybeSingle();
    if (existing) { navigate("/messages"); return; }
    const { error } = await supabase.from("chat_threads").insert({ client_id: user.id, barber_user_id: barber.user_id });
    if (error) return toast.error(error.message);
    navigate("/messages");
  };

  if (!barber) return <div className="p-6"><Empty text={t("common.loading")} /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader title={barber.full_name} subtitle={barber.specialty} action={
        <>
          {user && barber.user_id && user.id !== barber.user_id && (
            <button onClick={startChat} className="px-3 py-2 text-xs bg-secondary rounded-md hover:opacity-90 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> {t("barber.chat")}
            </button>
          )}
          <button onClick={() => navigate("/book")} className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {t("client.bookBtn")}
          </button>
        </>
      } />

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            {barber.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{Number(barber.rating).toFixed(1)}</span><span className="text-xs text-muted-foreground">({reviews.length} {t("reviews.count")})</span></div>
            {barber.bio && <p className="text-sm text-muted-foreground mt-2">{barber.bio}</p>}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">{t("barber.portfolio")}</h3>
          {(isOwner || isAdmin) && (
            <label className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> {uploading ? "..." : t("barber.upload")}
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
          )}
        </div>
        {!portfolio.length ? <Empty text={t("common.empty")} /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {portfolio.map((p) => (
              <div key={p.id} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
                <img src={p.image_url} alt="portfolio" className="w-full h-full object-cover" loading="lazy" />
                {(isOwner || isAdmin) && (
                  <button onClick={() => delPhoto(p)} className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("barber.schedule")}</h3>
        <div className="space-y-2">
          {DAYS.map((d, dow) => {
            const sc = schedule.find((x) => x.day_of_week === dow);
            return (
              <div key={dow} className="flex items-center gap-2 flex-wrap text-sm">
                <span className="w-12 font-medium text-foreground">{d}</span>
                {(isOwner || isAdmin) ? (
                  <>
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={!sc?.is_off} onChange={(e) => setDay(dow, { is_off: !e.target.checked, start_time: sc?.start_time || "09:00", end_time: sc?.end_time || "20:00" })} />
                      {t("barber.working")}
                    </label>
                    {!sc?.is_off && (
                      <>
                        <input type="time" value={sc?.start_time?.slice(0, 5) || "09:00"} onChange={(e) => setDay(dow, { start_time: e.target.value, end_time: sc?.end_time || "20:00", is_off: false })} className="px-2 py-1 text-xs bg-background border border-border rounded" />
                        <span>—</span>
                        <input type="time" value={sc?.end_time?.slice(0, 5) || "20:00"} onChange={(e) => setDay(dow, { end_time: e.target.value, start_time: sc?.start_time || "09:00", is_off: false })} className="px-2 py-1 text-xs bg-background border border-border rounded" />
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground">{sc?.is_off ? t("barber.off") : sc ? `${sc.start_time?.slice(0, 5)} — ${sc.end_time?.slice(0, 5)}` : "—"}</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("reviews.title")}</h3>
        {canReview && (
          <div className="mb-4 p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground mb-2">{t("reviews.leave")}</p>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`w-5 h-5 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder={t("reviews.comment")} className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded mb-2" />
            <button onClick={submitReview} className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded">{t("common.save")}</button>
          </div>
        )}
        {!reviews.length ? <Empty text={t("reviews.none")} /> : (
          <div className="space-y-2">
            {reviews.map((r) => (
              <div key={r.id} className="p-3 bg-muted/30 rounded-md">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-sm text-foreground mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
