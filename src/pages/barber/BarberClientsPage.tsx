import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { useTier } from "@/hooks/usePlanFeatures";
import { toast } from "sonner";
import { Ban, MessageCircle, Trash2, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function BarberClientsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [appts, setAppts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [tab, setTab] = useState<"all" | "blacklist">("all");

  const load = async (bid: string) => {
    const { data: a } = await supabase.from("appointments").select("client_id, client_name, total_price, appointment_date, status").eq("barber_id", bid).not("client_id", "is", null);
    setAppts(a || []);
    const ids = Array.from(new Set((a || []).map((x: any) => x.client_id)));
    if (ids.length) {
      const { data: p } = await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", ids);
      const map: Record<string, any> = {};
      (p || []).forEach((x) => { map[x.user_id] = x; });
      setProfiles(map);
    }
    const { data: bl } = await supabase.from("barber_blacklist").select("*").eq("barber_id", bid);
    setBlacklist(bl || []);
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("barbers").select("id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setBarberId(data.id); load(data.id); }
    });
  }, [user]);

  const clients = useMemo(() => {
    const map = new Map<string, any>();
    appts.forEach((a) => {
      if (!a.client_id) return;
      const ex = map.get(a.client_id) || { client_id: a.client_id, visits: 0, totalSpent: 0, lastVisit: null, name: a.client_name };
      ex.visits++;
      if (a.status === "completed") ex.totalSpent += Number(a.total_price || 0);
      if (!ex.lastVisit || a.appointment_date > ex.lastVisit) ex.lastVisit = a.appointment_date;
      map.set(a.client_id, ex);
    });
    return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
  }, [appts]);

  const startChat = async (clientId: string) => {
    if (!user) return;
    const { data: existing } = await supabase.from("chat_threads").select("id").eq("client_id", clientId).eq("barber_user_id", user.id).maybeSingle();
    if (!existing) {
      await supabase.from("chat_threads").insert({ client_id: clientId, barber_user_id: user.id });
    }
    navigate("/messages");
  };

  const addBlacklist = async (clientId: string) => {
    const reason = prompt("Sabab (ixtiyoriy):") || "";
    const { error } = await supabase.from("barber_blacklist").insert({ barber_id: barberId, client_id: clientId, reason });
    if (error) return toast.error(error.message);
    toast.success("Qo'shildi");
    load(barberId!);
  };

  const removeBlacklist = async (id: string) => {
    await supabase.from("barber_blacklist").delete().eq("id", id);
    load(barberId!);
  };

  if (!barberId) return <div className="p-6"><Empty text="Profil sozlanmagan" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Mijozlarim" subtitle="Aktiv mijozlar va blacklist" />

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("all")} className={`px-3 py-1.5 text-xs rounded-md ${tab === "all" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Mijozlar ({clients.length})</button>
        <button onClick={() => setTab("blacklist")} className={`px-3 py-1.5 text-xs rounded-md ${tab === "blacklist" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Blacklist ({blacklist.length})</button>
      </div>

      {tab === "all" ? (
        !clients.length ? <Empty text="Mijoz yo'q" /> : (
          <div className="space-y-2">
            {clients.map((c) => {
              const isBl = blacklist.some((b) => b.client_id === c.client_id);
              return (
                <Card key={c.client_id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{profiles[c.client_id]?.full_name || c.name || "Mijoz"} {isBl && <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded ml-2">Blacklist</span>}</p>
                      <p className="text-xs text-muted-foreground">{c.visits} marta tashrif • {c.totalSpent.toLocaleString()} so'm • oxirgi: {c.lastVisit}</p>
                      {profiles[c.client_id]?.phone && <p className="text-xs text-muted-foreground">{profiles[c.client_id].phone}</p>}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => startChat(c.client_id)} className="p-1.5 hover:bg-muted rounded" title="Chat"><MessageCircle className="w-3.5 h-3.5" /></button>
                      {!isBl && <button onClick={() => addBlacklist(c.client_id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded" title="Blacklist"><Ban className="w-3.5 h-3.5" /></button>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        !blacklist.length ? <Empty text="Blacklist bo'sh" /> : (
          <div className="space-y-2">
            {blacklist.map((b) => (
              <Card key={b.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{profiles[b.client_id]?.full_name || "Mijoz"}</p>
                    {b.reason && <p className="text-xs text-muted-foreground">Sabab: {b.reason}</p>}
                  </div>
                  <button onClick={() => removeBlacklist(b.id)} className="p-1.5 hover:bg-muted rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
