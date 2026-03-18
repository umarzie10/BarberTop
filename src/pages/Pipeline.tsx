import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";

const Pipeline = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-mono">12</span> ta faol bitim · Jami <span className="font-mono">$611,400</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted forge-transition">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Ko'rinish
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
            <Plus className="w-4 h-4" />
            Yangi bitim
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden pt-4">
        <PipelineBoard />
      </div>
    </div>
  );
};

export default Pipeline;
