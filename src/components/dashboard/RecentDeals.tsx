import { motion } from "framer-motion";

const deals = [
  { id: 1, name: "TechVision LLC", contact: "Sardor Raximov", amount: "$45,000", stage: "Shartnoma", stageColor: "bg-success" },
  { id: 2, name: "GlobalTrade Co", contact: "Nilufar Karimova", amount: "$28,500", stage: "Taklif", stageColor: "bg-primary" },
  { id: 3, name: "DataStream Inc", contact: "Bobur Aliyev", amount: "$67,200", stage: "Muzokara", stageColor: "bg-warning" },
  { id: 4, name: "CloudBase Systems", contact: "Madina Xolmatova", amount: "$15,800", stage: "Yangi", stageColor: "bg-muted-foreground" },
  { id: 5, name: "SmartLogistics", contact: "Jasur Toshmatov", amount: "$92,000", stage: "Shartnoma", stageColor: "bg-success" },
];

export const RecentDeals = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="bg-card border border-border rounded-lg forge-shadow-sm"
    >
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">So'nggi bitimlar</h3>
      </div>
      <div className="divide-y divide-border">
        {deals.map((deal) => (
          <div key={deal.id} className="px-5 py-3.5 flex items-center justify-between forge-transition forge-hover cursor-pointer">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {deal.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{deal.name}</p>
                <p className="text-xs text-muted-foreground truncate">{deal.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm font-mono font-medium text-foreground">{deal.amount}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${deal.stageColor} text-card`}>
                {deal.stage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
