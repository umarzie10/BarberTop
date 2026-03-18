import { motion } from "framer-motion";
import { Zap, Check, ExternalLink, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: string;
}

const integrations: Integration[] = [
  { id: "telegram", name: "Telegram", description: "Telegram orqali mijozlar bilan aloqa", icon: "💬", connected: true, category: "Kommunikatsiya" },
  { id: "email", name: "Email (SMTP)", description: "Avtomatik email yuborish va olish", icon: "📧", connected: true, category: "Kommunikatsiya" },
  { id: "instagram", name: "Instagram", description: "Instagram DM orqali leadlar", icon: "📸", connected: false, category: "Kommunikatsiya" },
  { id: "1c", name: "1C Buxgalteriya", description: "Moliyaviy ma'lumotlarni sinxronlash", icon: "🧮", connected: false, category: "ERP" },
  { id: "zapier", name: "Zapier", description: "500+ ilova bilan integratsiya", icon: "⚡", connected: true, category: "Avtomatlashtirish" },
  { id: "google-cal", name: "Google Calendar", description: "Uchrashuvlar va voqealar", icon: "📅", connected: true, category: "Unumdorlik" },
  { id: "slack", name: "Slack", description: "Jamoa xabarlashish kanali", icon: "💼", connected: false, category: "Kommunikatsiya" },
  { id: "google-sheets", name: "Google Sheets", description: "Ma'lumotlarni eksport/import", icon: "📊", connected: false, category: "Unumdorlik" },
  { id: "telephony", name: "VoIP Telephoniya", description: "Qo'ng'iroqlarni CRM bilan bog'lash", icon: "📞", connected: true, category: "Kommunikatsiya" },
  { id: "stripe", name: "Stripe", description: "Online to'lovlarni qabul qilish", icon: "💳", connected: false, category: "Moliya" },
  { id: "whatsapp", name: "WhatsApp Business", description: "WhatsApp orqali xabarlar", icon: "📱", connected: false, category: "Kommunikatsiya" },
  { id: "power-bi", name: "Power BI", description: "Kengaytirilgan analitika va hisobotlar", icon: "📈", connected: false, category: "Analitika" },
];

const Integrations = () => {
  const { t } = useLanguage();
  const connected = integrations.filter(i => i.connected);
  const available = integrations.filter(i => !i.connected);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("int.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("int.subtitle")}</p>
        </div>
      </div>

      {/* Connected */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-success" />
          Ulangan ({connected.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {connected.map((integ) => (
            <motion.div
              key={integ.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              className="bg-card border border-border rounded-lg p-4 forge-shadow-sm forge-transition forge-hover cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{integ.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{integ.name}</p>
                    <p className="text-xs text-muted-foreground">{integ.category}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded">
                  <Check className="w-2.5 h-2.5" />
                  Faol
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{integ.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Mavjud integratsiyalar ({available.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {available.map((integ) => (
            <motion.div
              key={integ.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              className="bg-card border border-border rounded-lg p-4 forge-shadow-sm forge-transition forge-hover cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl opacity-60">{integ.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{integ.name}</p>
                    <p className="text-xs text-muted-foreground">{integ.category}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 forge-transition">
                  <Plus className="w-2.5 h-2.5" />
                  Ulash
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{integ.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
