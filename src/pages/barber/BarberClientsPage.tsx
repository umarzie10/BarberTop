import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Card, Empty } from "@/components/shared/Page";
import { useTier } from "@/hooks/usePlanFeatures";
import { toast } from "sonner";
import { Ban, MessageCircle, Trash2, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function BarberClientsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { can } = useTier("barber");
  const FREE_LIMIT = 5;
  const [barberId, setBarberId] = useState<string | null>(null);
  const [appts, setAppts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [tab, setTab] = useState<"all" | "blacklist">("all");

  const load = async (bid: string) => {
    const { data: a } = await supabase
      .from("appointments")
      .select("client_id, client_name, total_price, appointment_date, status")
      .eq("barber_id", bid)
      .not("client_id", "is", null);
    setAppts(a || []);
    const ids = Array.from(new Set((a || []).map((x: any) => x.client_id)));
    if (ids.length) {
      const { data: p } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", ids);
      const map: Record<string, any> = {};
      (p || []).forEach((x) => {
        map[x.user_id] = x;
      });
      setProfiles(map);
    }
    const { data: bl } = await supabase
      .from("barber_blacklist")
      .select("*")
      .eq("barber_id", bid);
    setBlacklist(bl || []);
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

  const clients = useMemo(() => {
    const map = new Map<string, any>();
    appts.forEach((a) => {
      if (!a.client_id) return;
      const ex = map.get(a.client_id) || {
        client_id: a.client_id,
        visits: 0,
        totalSpent: 0,
        lastVisit: null,
        name: a.client_name,
      };
      ex.visits++;
      if (a.status === "completed") ex.totalSpent += Number(a.total_price || 0);
      if (!ex.lastVisit || a.appointment_date > ex.lastVisit)
        ex.lastVisit = a.appointment_date;
      map.set(a.client_id, ex);
    });
    return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
  }, [appts]);

  const startChat = async (clientId: string) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("chat_threads")
      .select("id")
      .eq("client_id", clientId)
      .eq("barber_user_id", user.id)
      .maybeSingle();
    if (!existing) {
      await supabase
        .from("chat_threads")
        .insert({ client_id: clientId, barber_user_id: user.id });
    }
    navigate("/messages");
  };

  const addBlacklist = async (clientId: string) => {
    const reason = prompt(t("barber.clients.promptReason")) || "";
    const { error } = await supabase
      .from("barber_blacklist")
      .insert({ barber_id: barberId, client_id: clientId, reason });
    if (error) return toast.error(error.message);
    toast.success(t("barber.clients.added"));
    load(barberId!);
  };

  const removeBlacklist = async (id: string) => {
    await supabase.from("barber_blacklist").delete().eq("id", id);
    load(barberId!);
  };

  if (!barberId)
    return (
      <div className="p-6">
        <Empty text={t("barber.profileNotSetup")} />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title={t("barber.clients.title")}
        subtitle={t("barber.clients.subtitle")}
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("all")}
          className={`px-3 py-1.5 text-xs rounded-md ${tab === "all" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          {t("barber.clients.tab.all")} ({clients.length})
        </button>
        <button
          onClick={() => setTab("blacklist")}
          className={`px-3 py-1.5 text-xs rounded-md ${tab === "blacklist" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          {t("barber.clients.tab.blacklist")} ({blacklist.length})
        </button>
      </div>

      {tab === "all" ? (
        !clients.length ? (
          <Empty text={t("barber.clients.empty")} />
        ) : (
          <div className="space-y-2">
            {(can("unlimited_clients")
              ? clients
              : clients.slice(0, FREE_LIMIT)
            ).map((c) => {
              const isBl = blacklist.some((b) => b.client_id === c.client_id);
              return (
                <Card key={c.client_id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {profiles[c.client_id]?.full_name ||
                          c.name ||
                          t("barber.client")}{" "}
                        {isBl && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded ml-2">
                            {t("barber.clients.blacklistBadge")}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.visits} {t("barber.clients.visits")} •{" "}
                        {c.totalSpent.toLocaleString()} {t("common.sum")} •{" "}
                        {t("barber.clients.lastVisit")} {c.lastVisit}
                      </p>
                      {profiles[c.client_id]?.phone && (
                        <p className="text-xs text-muted-foreground">
                          {profiles[c.client_id].phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => startChat(c.client_id)}
                        className="p-1.5 hover:bg-muted rounded"
                        title={t("barber.chat")}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                      {!isBl && (
                        <button
                          onClick={() => addBlacklist(c.client_id)}
                          className="p-1.5 hover:bg-destructive/10 text-destructive rounded"
                          title={t("barber.clients.blacklist")}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            {!can("unlimited_clients") && clients.length > FREE_LIMIT && (
              <Card className="border-dashed border-2 text-center">
                <Lock className="w-5 h-5 mx-auto text-primary mb-2" />
                <p className="text-sm font-semibold mb-1">
                  +{clients.length - FREE_LIMIT}{" "}
                  {t("barber.clients.hiddenClients")}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("barber.clients.freeNote").replace(
                    "{count}",
                    String(FREE_LIMIT),
                  )}
                </p>
                <Link
                  to="/plans"
                  className="inline-block px-4 py-2 text-xs bg-primary text-primary-foreground rounded-md"
                >
                  {t("barber.clients.proButton")}
                </Link>
              </Card>
            )}
          </div>
        )
      ) : !blacklist.length ? (
        <Empty text={t("barber.clients.blacklistEmpty")} />
      ) : (
        <div className="space-y-2">
          {blacklist.map((b) => (
            <Card key={b.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {profiles[b.client_id]?.full_name || t("barber.client")}
                  </p>
                  {b.reason && (
                    <p className="text-xs text-muted-foreground">
                      {t("barber.clients.reason")} {b.reason}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeBlacklist(b.id)}
                  className="p-1.5 hover:bg-muted rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
