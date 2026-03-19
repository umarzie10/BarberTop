import { useEffect, useState, useRef } from "react";
import { Send, Search, Phone, Video, MoreHorizontal, Paperclip } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Communications = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("contacts").select("*").order("name").then(({ data }) => {
      setContacts(data || []);
      if (data && data.length > 0) setSelectedContact(data[0]);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedContact || !user) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*").eq("contact_id", selectedContact.id).order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    const channel = supabase
      .channel(`messages-${selectedContact.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `contact_id=eq.${selectedContact.id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedContact, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user || !selectedContact) return;
    await supabase.from("messages").insert({
      user_id: user.id,
      contact_id: selectedContact.id,
      content: input.trim(),
      direction: "outgoing",
      channel: "chat",
    });
    setInput("");
  };

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("comm.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("comm.subtitle")}</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[300px] border-r border-border flex flex-col shrink-0">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("contacts.search")} className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t("contacts.noContacts")}</p>
            ) : filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`w-full px-4 py-3 flex items-start gap-3 text-left forge-transition ${selectedContact?.id === c.id ? "bg-muted" : "hover:bg-muted/50"}`}
              >
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {c.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.company}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {selectedContact.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedContact.name}</p>
                    <p className="text-[11px] text-muted-foreground">{selectedContact.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-2 hover:bg-muted rounded-md forge-transition"><Phone className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-2 hover:bg-muted rounded-md forge-transition"><Video className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">{t("comm.noMessages")}</p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-lg ${msg.direction === "outgoing" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.direction === "outgoing" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="px-5 py-3 border-t border-border">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-2">
                  <button type="button" className="p-2 hover:bg-muted rounded-md forge-transition"><Paperclip className="w-4 h-4 text-muted-foreground" /></button>
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("comm.placeholder")} className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
                  <button type="submit" disabled={!input.trim()} className="p-2 bg-primary text-primary-foreground rounded-md forge-transition hover:opacity-90 disabled:opacity-50"><Send className="w-4 h-4" /></button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{t("comm.selectContact")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communications;
