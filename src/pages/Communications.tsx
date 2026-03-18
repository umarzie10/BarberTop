import { motion } from "framer-motion";
import { Send, Search, Phone, Video, MoreHorizontal, Paperclip, Smile } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatContact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  channel: "chat" | "telegram" | "email";
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const chatContacts: ChatContact[] = [
  { id: 1, name: "Sardor Raximov", lastMessage: "Shartnomani ko'rib chiqamiz", time: "5 min", unread: 2, online: true, channel: "chat" },
  { id: 2, name: "Nilufar Karimova", lastMessage: "Taklifni qabul qildik ✅", time: "1 soat", unread: 0, online: true, channel: "telegram" },
  { id: 3, name: "Bobur Aliyev", lastMessage: "Ertaga uchrashamizmi?", time: "2 soat", unread: 1, online: false, channel: "chat" },
  { id: 4, name: "Jasur Toshmatov", lastMessage: "Invoice yuborildi", time: "Kecha", unread: 0, online: false, channel: "email" },
  { id: 5, name: "Madina Xolmatova", lastMessage: "Yangi loyiha haqida...", time: "Kecha", unread: 0, online: true, channel: "telegram" },
  { id: 6, name: "Alisher Mirzayev", lastMessage: "Demo juda yaxshi o'tdi", time: "2 kun", unread: 0, online: false, channel: "chat" },
];

const messages: Message[] = [
  { id: 1, sender: "Sardor Raximov", text: "Salom! Shartnoma haqida gaplashsak bo'ladimi?", time: "10:30", isMe: false },
  { id: 2, sender: "Siz", text: "Salom Sardor! Albatta, qanday savollaringiz bor?", time: "10:32", isMe: true },
  { id: 3, sender: "Sardor Raximov", text: "To'lov shartlarini bir ko'rib chiqmoqchimiz. 60 kunlik muddatga bo'ladimi?", time: "10:35", isMe: false },
  { id: 4, sender: "Siz", text: "Ha, biz 30 va 60 kunlik to'lov variantlarini taklif qilamiz. Sizga qaysi biri qulay?", time: "10:37", isMe: true },
  { id: 5, sender: "Sardor Raximov", text: "60 kunlik variant bilan ketamiz. Shartnomani ko'rib chiqamiz", time: "10:40", isMe: false },
];

const channelBadge = {
  chat: { label: "Chat", className: "bg-primary/10 text-primary" },
  telegram: { label: "Telegram", className: "bg-[hsl(200,80%,50%)]/10 text-[hsl(200,80%,50%)]" },
  email: { label: "Email", className: "bg-accent/10 text-accent" },
};

const Communications = () => {
  const [selectedContact, setSelectedContact] = useState(chatContacts[0]);

  return (
    <div className="h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Xabarlar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Chat, Telegram va Email — bir joyda</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Contact list */}
        <div className="w-[300px] border-r border-border flex flex-col shrink-0">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatContacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`w-full px-4 py-3 flex items-start gap-3 text-left forge-transition ${
                  selectedContact.id === c.id ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {c.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {c.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">{c.unread}</span>
                      )}
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${channelBadge[c.channel].className}`}>
                        {channelBadge[c.channel].label}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                {selectedContact.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{selectedContact.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {selectedContact.online ? "Online" : "Oxirgi faollik: " + selectedContact.time + " oldin"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-2 hover:bg-muted rounded-md forge-transition">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-md forge-transition">
                <Video className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-md forge-transition">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] px-4 py-2.5 rounded-lg ${
                  msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-md forge-transition">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
              </button>
              <input
                type="text"
                placeholder="Xabar yozing..."
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <button className="p-2 hover:bg-muted rounded-md forge-transition">
                <Smile className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 bg-primary text-primary-foreground rounded-md forge-transition hover:opacity-90">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communications;
