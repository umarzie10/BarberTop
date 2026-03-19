import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (wf: { name: string; triggerKey: string; actionKey: string }) => void;
}

export const NewWorkflowModal = ({ open, onClose, onAdd }: Props) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [triggerKey, setTriggerKey] = useState("auto.leadStageChange");
  const [actionKey, setActionKey] = useState("auto.sendNotification");

  if (!open) return null;

  const handleSubmit = () => {
    if (!name) return;
    onAdd({ name, triggerKey, actionKey });
    setName(""); setTriggerKey("auto.leadStageChange"); setActionKey("auto.sendNotification");
    onClose();
  };

  const triggers = ["auto.leadStageChange", "auto.dealWon", "auto.dealLost", "auto.newLead"];
  const actions = ["auto.sendNotification", "auto.sendEmail", "auto.assignTask", "auto.moveStage"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-6 w-[440px] shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">{t("auto.newWorkflow")}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("auto.wfName")} *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auto.wfNamePlaceholder")} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("auto.trigger")}</label>
            <select value={triggerKey} onChange={(e) => setTriggerKey(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20">
              {triggers.map((tk) => <option key={tk} value={tk}>{t(tk)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("auto.action")}</label>
            <select value={actionKey} onChange={(e) => setActionKey(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20">
              {actions.map((ak) => <option key={ak} value={ak}>{t(ak)}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">{t("deal.cancel")}</button>
          <button onClick={handleSubmit} disabled={!name} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 forge-transition disabled:opacity-50">{t("deal.add")}</button>
        </div>
      </div>
    </div>
  );
};
