import { X, Check, ExternalLink, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  integration: Integration | null;
  onDisconnect: (id: string) => void;
  onConnect: (id: string) => void;
}

export const IntegrationSettingsModal = ({ open, onClose, integration, onDisconnect, onConnect }: Props) => {
  const { t } = useLanguage();
  if (!open || !integration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-6 w-[440px] shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{integration.icon}</span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{integration.name}</h2>
              <p className="text-xs text-muted-foreground">{integration.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-foreground">{t("int.status")}</span>
            {integration.connected ? (
              <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded">
                <Check className="w-3 h-3" /> {t("int.connected")}
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{t("int.disconnected")}</span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-foreground">{t("int.category")}</span>
            <span className="text-sm text-muted-foreground">{integration.category}</span>
          </div>
        </div>

        <div className="flex justify-between">
          {integration.connected ? (
            <button onClick={() => { onDisconnect(integration.id); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-sm text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 forge-transition">
              <Trash2 className="w-3.5 h-3.5" /> {t("int.disconnect")}
            </button>
          ) : (
            <button onClick={() => { onConnect(integration.id); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 forge-transition">
              <ExternalLink className="w-3.5 h-3.5" /> {t("int.connect")}
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">{t("deal.cancel")}</button>
        </div>
      </div>
    </div>
  );
};
