import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, Empty } from "@/components/shared/Page";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function Messages() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [threads, setThreads] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const endRef = useRef<HTMLDivElement>(null);

  const loadThreads = async () => {
    if (!user) return;
    const { data } = await supabase.from("chat_threads").select("*")
      .or(`client_id.eq.${user.id},barber_user_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });
    setThreads(data || []);
    const ids = new Set<string>();
    (data || []).forEach((th: any) => { ids.add(th.client_id); ids.add(th.barber_user_id); });
    if (ids.size) {
      const { data: ps } = await supabase.from("profiles").select("user_id, full_name").in("user_id", Array.from(ids));
      const map: Record<string, any> = {};
      (ps || []).forEach((p: any) => { map[p.user_id] = p; });
      setProfiles(map);
    }
  };

  const loadMessages = async (tid: string) => {
    const { data } = await supabase.from("chat_messages").select("*").eq("thread_id", tid).order("created_at");
    setMessages(data || []);
  };

  useEffect(() => { loadThreads(); }, [user]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel("chat-rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        const m: any = payload.new;
        if (active && m.thread_id === active.id) setMessages((prev) => [...prev, m]);
        loadThreads();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, active]);

  useEffect(() => { if (active) loadMessages(active.id); }, [active]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !active || !user) return;
    const body = text.trim();
    setText("");
    const { error } = await supabase.from("chat_messages").insert({ thread_id: active.id, sender_id: user.id, body });
    if (error) toast.error(error.message);
  };

  const otherId = (th: any) => th.client_id === user?.id ? th.barber_user_id : th.client_id;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title={t("nav.messages")} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        <div className="bg-card border border-border rounded-lg overflow-y-auto">
          {!threads.length ? <Empty text={t("chat.empty")} /> : (
            <ul>
              {threads.map((th) => {
                const other = profiles[otherId(th)];
                return (
                  <li key={th.id}>
                    <button onClick={() => setActive(th)}
                      className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted forge-transition ${active?.id === th.id ? "bg-muted" : ""}`}>
                      <p className="text-sm font-medium text-foreground">{other?.full_name || t("common.user")}</p>
                      <p className="text-xs text-muted-foreground">{new Date(th.last_message_at).toLocaleString()}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="md:col-span-2 bg-card border border-border rounded-lg flex flex-col">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">{t("chat.selectThread")}</div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{profiles[otherId(active)]?.full_name || t("common.user")}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                      {m.body}
                      <p className="text-[10px] opacity-60 mt-0.5">{new Date(m.created_at).toLocaleTimeString().slice(0, 5)}</p>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <div className="p-2 border-t border-border flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                  placeholder={t("chat.placeholder")} className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md" />
                <button onClick={send} disabled={!text.trim()} className="px-3 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
