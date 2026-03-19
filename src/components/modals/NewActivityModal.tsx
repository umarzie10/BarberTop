import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (activity: { title: string; type: string; description: string; due_date: string }) => void;
}

export const NewActivityModal = ({ open, onClose, onAdd }: Props) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("task");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title) return;
    onAdd({ title, type, description, due_date: dueDate });
    setTitle(""); setType("task"); setDescription(""); setDueDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-6 w-[440px] shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">{t("activities.new")}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("activities.actTitle")} *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("activities.type")}</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20">
              <option value="task">{t("activities.task")}</option>
              <option value="call">{t("activities.call")}</option>
              <option value="meeting">{t("activities.meeting")}</option>
              <option value="email">{t("activities.emailAct")}</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("activities.desc")}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("activities.dueDate")}</label>
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">{t("deal.cancel")}</button>
          <button onClick={handleSubmit} disabled={!title} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 forge-transition disabled:opacity-50">{t("deal.add")}</button>
        </div>
      </div>
    </div>
  );
};
