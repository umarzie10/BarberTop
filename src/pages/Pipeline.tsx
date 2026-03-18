import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const Pipeline = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bitimlarni bosqichlar orasida sudrab o'tkazing
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
