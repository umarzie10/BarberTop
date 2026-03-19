import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Zap, Play, Pause, ArrowRight, Mail, Bell, CheckCircle } from "lucide-react";
import { NewWorkflowModal } from "@/components/modals/NewWorkflowModal";

interface Workflow {
  id: string;
  name: string;
  triggerKey: string;
  actionKey: string;
  active: boolean;
  runs: number;
  lastRun: string | null;
}

const defaultWorkflows: Workflow[] = [
  { id: "w1", name: "Lead → Qualified bildirish", triggerKey: "auto.leadStageChange", actionKey: "auto.sendNotification", active: true, runs: 47, lastRun: "2 soat oldin" },
  { id: "w2", name: "Won deal → Email", triggerKey: "auto.dealWon", actionKey: "auto.sendEmail", active: true, runs: 12, lastRun: "1 kun oldin" },
  { id: "w3", name: "Yangi lead → Vazifa", triggerKey: "auto.newLead", actionKey: "auto.assignTask", active: false, runs: 89, lastRun: "3 kun oldin" },
  { id: "w4", name: "Lost deal → Follow-up", triggerKey: "auto.dealLost", actionKey: "auto.sendEmail", active: true, runs: 5, lastRun: "1 hafta oldin" },
];

const triggerIcons: Record<string, typeof Zap> = {
  "auto.leadStageChange": ArrowRight,
  "auto.dealWon": CheckCircle,
  "auto.dealLost": Pause,
  "auto.newLead": Plus,
};

const actionIcons: Record<string, typeof Zap> = {
  "auto.sendNotification": Bell,
  "auto.sendEmail": Mail,
  "auto.assignTask": CheckCircle,
  "auto.moveStage": ArrowRight,
};

const Automation = () => {
  const { t } = useLanguage();
  const [workflows, setWorkflows] = useState(defaultWorkflows);
  const [showNew, setShowNew] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w)));
  };

  const handleAdd = (wf: { name: string; triggerKey: string; actionKey: string }) => {
    setWorkflows((prev) => [...prev, {
      id: `w${Date.now()}`,
      name: wf.name,
      triggerKey: wf.triggerKey,
      actionKey: wf.actionKey,
      active: true,
      runs: 0,
      lastRun: null,
    }]);
  };

  const activeCount = workflows.filter((w) => w.active).length;
  const pausedCount = workflows.filter((w) => !w.active).length;
  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("auto.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("auto.subtitle")}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          {t("auto.newWorkflow")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: t("auto.active"), value: activeCount, icon: Play, color: "text-success" },
          { label: t("auto.paused"), value: pausedCount, icon: Pause, color: "text-warning" },
          { label: t("auto.runs"), value: totalRuns, icon: Zap, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className="text-xl font-semibold font-mono text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-2">
        {workflows.map((wf) => {
          const TriggerIcon = triggerIcons[wf.triggerKey] || Zap;
          const ActionIcon = actionIcons[wf.actionKey] || Zap;
          return (
            <div key={wf.id} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm forge-transition forge-hover cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); toggleWorkflow(wf.id); }} className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${wf.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {wf.active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-foreground">{wf.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><TriggerIcon className="w-3 h-3" /><span>{t(wf.triggerKey)}</span></div>
                      <ArrowRight className="w-3 h-3" />
                      <div className="flex items-center gap-1"><ActionIcon className="w-3 h-3" /><span>{t(wf.actionKey)}</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{t("auto.runs")}</p>
                    <p className="text-sm font-mono font-medium text-foreground">{wf.runs}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{t("auto.lastRun")}</p>
                    <p className="text-xs text-foreground">{wf.lastRun || "—"}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={wf.active} onChange={() => toggleWorkflow(wf.id)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-muted peer-focus:ring-2 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          );
        })}

        {workflows.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{t("auto.noWorkflows")}</p>
          </div>
        )}
      </motion.div>

      <NewWorkflowModal open={showNew} onClose={() => setShowNew(false)} onAdd={handleAdd} />
    </div>
  );
};

export default Automation;
