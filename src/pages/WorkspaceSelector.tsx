import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkspace, workspaceTypes, type WorkspaceType } from "@/contexts/WorkspaceContext";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const WorkspaceSelector = () => {
  const { t, lang } = useLanguage();
  const { workspace, setWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleSelect = (type: WorkspaceType) => {
    setWorkspace(type);
    navigate("/");
  };

  const titles: Record<string, string> = {
    uz: "Ish muhitini tanlang",
    ru: "Выберите рабочее пространство",
    en: "Select Workspace",
  };

  const subtitles: Record<string, string> = {
    uz: "Sohangizga mos CRM modulini tanlang",
    ru: "Выберите модуль CRM для вашей отрасли",
    en: "Choose the CRM module for your industry",
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{titles[lang]}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitles[lang]}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {workspaceTypes.map((ws, i) => {
          const isActive = workspace === ws.type;
          return (
            <motion.button
              key={ws.type}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSelect(ws.type)}
              className={`relative text-left p-4 rounded-lg border forge-transition group ${
                isActive
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <span className="text-2xl mb-2 block">{ws.icon}</span>
              <p className="text-sm font-semibold text-foreground mb-0.5">{ws.label[lang]}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{ws.description[lang]}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceSelector;
