import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Pipeline = () => {
  const { t } = useLanguage();

  return (
    <div className="h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("pipe.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("pipe.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">
            <Filter className="w-3.5 h-3.5" />
            {t("pipe.filter")}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t("pipe.view")}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden pt-4">
        <PipelineBoard />
      </div>
    </div>
  );
};

export default Pipeline;
