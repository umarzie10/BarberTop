import { motion } from "framer-motion";
import { Plus, Phone, Mail, Calendar, CheckCircle, Clock, Video, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Activities = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("activities.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("activities.subtitle")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          {t("activities.new")}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: t("activities.today"), value: 0, icon: Calendar, color: "text-primary" },
          { label: t("activities.overdue"), value: 0, icon: Clock, color: "text-destructive" },
          { label: t("activities.completed"), value: 0, icon: CheckCircle, color: "text-success" },
          { label: t("activities.planned"), value: 0, icon: Calendar, color: "text-primary" },
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

      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-sm text-muted-foreground">{t("dash.noActivity")}</p>
      </div>
    </div>
  );
};

export default Activities;
