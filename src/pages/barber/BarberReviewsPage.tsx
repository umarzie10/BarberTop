import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { toast } from "sonner";
import { Star, MessageCircle, Send } from "lucide-react";

export default function BarberReviewsPage() {
  const { user } = useAuth();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  const load = async (bid: string) => {
    const { data } = await supabase.from("reviews").select("*").eq("barber_id", bid).order("created_at", { ascending: false });
    setReviews(data || []);
    const ids = Array.from(new Set((data || []).map((r) => r.client_id)));
    if (ids.length) {
      const { data: p } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
      const map: Record<string, any> = {};
      (p || []).forEach((x) => { map[x.user_id] = x; });
      setProfiles(map);
    }
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("barbers").select("id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setBarberId(data.id); load(data.id); }
    });
  }, [user]);

  const sendReply = async (id: string) => {
    const reply = replyDraft[id]?.trim();
    if (!reply) return;
    const { error } = await supabase.from("reviews").update({ reply, replied_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Javob saqlandi");
    setReplyDraft({ ...replyDraft, [id]: "" });
    load(barberId!);
  };

  if (!barberId) return <div className="p-6"><Empty text="Profil sozlanmagan" /></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="Sharhlar" subtitle="Mijozlar bahosi va sharhlariga javob bering" />
      {!reviews.length ? <Empty text="Hali sharh yo'q" /> : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{profiles[r.client_id]?.full_name || "Mijoz"}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p className="text-sm text-foreground">{r.comment}</p>}
                </div>
              </div>

              {r.reply ? (
                <div className="mt-3 ml-4 p-2.5 bg-primary/5 border-l-2 border-primary rounded">
                  <p className="text-[10px] text-primary font-medium mb-0.5 flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Javobingiz • {new Date(r.replied_at).toLocaleDateString()}</p>
                  <p className="text-sm text-foreground">{r.reply}</p>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    placeholder="Javob yozing..."
                    className="flex-1 px-3 py-1.5 text-sm border border-border rounded bg-background"
                    value={replyDraft[r.id] || ""}
                    onChange={(e) => setReplyDraft({ ...replyDraft, [r.id]: e.target.value })}
                  />
                  <button onClick={() => sendReply(r.id)} className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded flex items-center gap-1">
                    <Send className="w-3 h-3" /> Yuborish
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
