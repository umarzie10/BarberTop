import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface NewDealModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (deal: { name: string; company: string; amount: number }) => void;
  totalDeals: number;
  totalValue: number;
}

export const NewDealModal = ({ open, onClose, onAdd, totalDeals, totalValue }: NewDealModalProps) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !amount.trim()) return;
    onAdd({ name: name.trim(), company: company.trim(), amount: Number(amount) });
    setName("");
    setCompany("");
    setAmount("");
    onClose();
  };

  const parsedAmount = Number(amount) || 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 rounded-lg">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">Yangi bitim</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bitim nomi</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kompaniya nomi yoki bitim sarlavhasi"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kontakt</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Kontakt shaxs ismi"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Summa ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          {/* Cost preview */}
          {parsedAmount > 0 && (
            <div className="bg-muted rounded-md p-3">
              <p className="text-xs text-muted-foreground">
                Ushbu bitim qo'shilgandan so'ng: <span className="font-mono font-medium text-foreground">{totalDeals + 1}</span> ta bitim, jami <span className="font-mono font-medium text-foreground">${(totalValue + parsedAmount).toLocaleString()}</span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md forge-transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !company.trim() || !amount.trim()}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md forge-transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Qo'shish
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
