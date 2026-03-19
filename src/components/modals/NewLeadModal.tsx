import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (lead: { name: string; company: string; amount: number; contactName: string }) => void;
}

export const NewLeadModal = ({ open, onClose, onAdd }: Props) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [contactName, setContactName] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!name || !company) return;
    onAdd({ name, company, amount: Number(amount) || 0, contactName });
    setName(""); setCompany(""); setAmount(""); setContactName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-6 w-[440px] shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">{t("leads.new")}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("deal.name")} *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("deal.namePlaceholder")} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("leads.company")} *</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("deal.contact")}</label>
            <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder={t("deal.contactPlaceholder")} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("deal.amount")}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">{t("deal.cancel")}</button>
          <button onClick={handleSubmit} disabled={!name || !company} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 forge-transition disabled:opacity-50">{t("deal.add")}</button>
        </div>
      </div>
    </div>
  );
};
