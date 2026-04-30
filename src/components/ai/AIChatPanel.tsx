import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";

type Msg = { role: "user" | "assistant"; content: string };

const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const AIChatPanel = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Salom! Men sizga qanday yordam bera olaman?\n- Sartarosh tanlash\n- Hairstyle tavsiyasi\n- Narxlar va xizmatlar haqida" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  if (!user) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);
    try {
      const resp = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ messages: next, role: role || "client" }),
      });
      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        setMessages((m) => { const a = [...m]; a[a.length - 1] = { role: "assistant", content: `❌ ${j.error || "Xatolik"}` }; return a; });
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") continue;
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              setMessages((m) => { const a = [...m]; a[a.length - 1] = { role: "assistant", content: acc }; return a; });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e: any) {
      setMessages((m) => { const a = [...m]; a[a.length - 1] = { role: "assistant", content: `❌ ${e.message}` }; return a; });
    } finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 forge-transition">
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[360px] max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-card border border-border rounded-xl shadow-2xl flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">AI Yordamchi</p>
              <p className="text-[10px] text-muted-foreground capitalize">{role || "client"}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {m.content || (loading ? "..." : "")}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t border-border flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Savolingizni yozing..."
              className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
