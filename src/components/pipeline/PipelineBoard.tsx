import { useState, useCallback, useEffect } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { NewDealModal } from "./NewDealModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Deal {
  id: string;
  name: string;
  company: string;
  amount: number;
  daysInStage: number;
  contact_name?: string;
}

export interface PipelineColumn {
  id: string;
  titleKey: string;
  emoji: string;
  deals: Deal[];
}

const stageColors: Record<string, string> = {
  lead: "border-t-muted-foreground",
  qualified: "border-t-primary",
  negotiation: "border-t-warning",
  proposal: "border-t-accent",
  won: "border-t-success",
  lost: "border-t-destructive",
};

function DroppableColumn({ column, children, title }: { column: PipelineColumn; children: React.ReactNode; title: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const total = column.deals.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="w-[260px] shrink-0 flex flex-col">
      <div className={`border-t-2 ${stageColors[column.id] || "border-t-border"} rounded-t-lg`}>
        <div className="flex items-center justify-between mb-2 px-2 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{column.emoji}</span>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h3>
            <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {column.deals.length}
            </span>
          </div>
        </div>
        <p className="text-[11px] font-mono text-muted-foreground px-2 mb-3">${total.toLocaleString()}</p>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-240px)] p-1 rounded-lg transition-colors ${
          isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function SortableDealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} />
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const { t } = useLanguage();
  return (
    <div className="bg-card border border-border rounded-lg p-3.5 forge-shadow-sm cursor-grab active:cursor-grabbing group">
      <div className="flex items-start justify-between mb-1.5">
        <p className="text-sm font-medium text-foreground leading-tight">{deal.name}</p>
        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
      </div>
      <p className="text-xs text-muted-foreground mb-2.5">{deal.contact_name || deal.company}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono font-semibold text-foreground">${deal.amount.toLocaleString()}</span>
        <span className="text-[10px] text-muted-foreground">
          {deal.daysInStage === 0 ? t("pipe.today") : `${deal.daysInStage} ${t("pipe.days")}`}
        </span>
      </div>
    </div>
  );
}

export const PipelineBoard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [columns, setColumns] = useState<PipelineColumn[]>([
    { id: "lead", titleKey: "pipe.lead", emoji: "📍", deals: [] },
    { id: "qualified", titleKey: "pipe.qualified", emoji: "✅", deals: [] },
    { id: "negotiation", titleKey: "pipe.negotiation", emoji: "🤝", deals: [] },
    { id: "proposal", titleKey: "pipe.proposal", emoji: "📋", deals: [] },
    { id: "won", titleKey: "pipe.won", emoji: "🏆", deals: [] },
    { id: "lost", titleKey: "pipe.lost", emoji: "❌", deals: [] },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showNewDeal, setShowNewDeal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchDeals = async () => {
      const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: true });
      if (!data) return;
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          deals: data
            .filter((d) => d.stage === col.id)
            .map((d) => ({
              id: d.id,
              name: d.name,
              company: d.company,
              amount: d.amount,
              daysInStage: d.days_in_stage,
              contact_name: d.contact_name,
            })),
        }))
      );
    };
    fetchDeals();
  }, [user]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findDeal = (id: string) => {
    for (const col of columns) {
      const deal = col.deals.find((d) => d.id === id);
      if (deal) return { deal, columnId: col.id };
    }
    return null;
  };

  const findColumnByDealId = (id: string) => columns.find((c) => c.deals.some((d) => d.id === id));

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeCol = findColumnByDealId(active.id as string);
    let overColId = over.id as string;
    const overCol = columns.find((c) => c.id === overColId) || findColumnByDealId(overColId);
    if (!overCol) return;
    overColId = overCol.id;
    if (!activeCol || activeCol.id === overColId) return;
    setColumns((prev) => {
      const deal = activeCol.deals.find((d) => d.id === active.id)!;
      return prev.map((col) => {
        if (col.id === activeCol.id) return { ...col, deals: col.deals.filter((d) => d.id !== active.id) };
        if (col.id === overColId) return { ...col, deals: [...col.deals, deal] };
        return col;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active } = event;
    const result = findDeal(active.id as string);
    if (result) {
      await supabase.from("deals").update({ stage: result.columnId }).eq("id", result.deal.id);
    }
  };

  const activeDeal = activeId ? findDeal(activeId)?.deal : null;

  const handleAddDeal = async (deal: { name: string; company: string; amount: number; contactName?: string }) => {
    if (!user) return;
    const { data, error } = await supabase.from("deals").insert({
      name: deal.name,
      company: deal.company,
      amount: deal.amount,
      contact_name: deal.contactName || null,
      stage: "lead",
      user_id: user.id,
    }).select().single();

    if (data) {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === "lead"
            ? { ...col, deals: [...col.deals, { id: data.id, name: data.name, company: data.company, amount: data.amount, daysInStage: 0, contact_name: data.contact_name }] }
            : col
        )
      );
    }
  };

  const totalDeals = columns.reduce((s, c) => s + c.deals.length, 0);
  const totalValue = columns.reduce((s, c) => s + c.deals.reduce((ss, d) => ss + d.amount, 0), 0);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-4 px-6">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          {columns.map((col) => (
            <DroppableColumn key={col.id} column={col} title={t(col.titleKey)}>
              <SortableContext items={col.deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                {col.deals.map((deal) => (
                  <SortableDealCard key={deal.id} deal={deal} />
                ))}
              </SortableContext>
              {col.id !== "lost" && (
                <button
                  onClick={() => setShowNewDeal(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground border border-dashed border-border rounded-lg hover:bg-muted forge-transition"
                >
                  <Plus className="w-3 h-3" />
                  {t("pipe.add")}
                </button>
              )}
            </DroppableColumn>
          ))}
          <DragOverlay>
            {activeDeal ? (
              <div className="rotate-2 opacity-90">
                <DealCard deal={activeDeal} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <NewDealModal open={showNewDeal} onClose={() => setShowNewDeal(false)} onAdd={handleAddDeal} totalDeals={totalDeals} totalValue={totalValue} />
    </>
  );
};
