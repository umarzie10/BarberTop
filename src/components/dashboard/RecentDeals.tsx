import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const stageColors: Record<string, string> = {
  lead: "bg-muted-foreground",
  qualified: "bg-primary",
  negotiation: "bg-warning",
  proposal: "bg-accent",
  won: "bg-success",
  lost: "bg-destructive",
};

interface RecentDealsProps {
  deals: any[];
  loading: boolean;
}

export const RecentDeals = ({ deals, loading }: RecentDealsProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="bg-card border border-border rounded-lg forge-shadow-sm"
    >
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">{t("dash.recentDeals")}</h3>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
        ) : deals.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">{t("dash.noDeals")}</div>
        ) : (
          deals.map((deal) => (
            <div key={deal.id} className="px-5 py-3.5 flex items-center justify-between forge-transition forge-hover cursor-pointer">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  {deal.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{deal.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{deal.contact_name || deal.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-mono font-medium text-foreground">${deal.amount.toLocaleString()}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${stageColors[deal.stage] || "bg-muted"} text-card`}>
                  {deal.stage}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
