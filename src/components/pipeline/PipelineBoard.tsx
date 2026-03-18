import { motion } from "framer-motion";
import { Plus, MoreHorizontal } from "lucide-react";

interface Deal {
  id: number;
  name: string;
  company: string;
  amount: string;
  daysInStage: number;
}

interface Column {
  id: string;
  title: string;
  count: number;
  total: string;
  deals: Deal[];
}

const columns: Column[] = [
  {
    id: "new",
    title: "Yangi",
    count: 4,
    total: "$124,500",
    deals: [
      { id: 1, name: "CloudBase Systems", company: "Madina X.", amount: "$15,800", daysInStage: 2 },
      { id: 2, name: "InnoTech Solutions", company: "Kamol T.", amount: "$34,200", daysInStage: 1 },
      { id: 3, name: "AgriSmart", company: "Rustam N.", amount: "$42,000", daysInStage: 5 },
      { id: 4, name: "EduPlatform", company: "Lola S.", amount: "$32,500", daysInStage: 3 },
    ],
  },
  {
    id: "qualified",
    title: "Kvalifikatsiya",
    count: 3,
    total: "$187,000",
    deals: [
      { id: 5, name: "FinanceHub", company: "Alisher M.", amount: "$78,000", daysInStage: 7 },
      { id: 6, name: "LogiTrack", company: "Sherzod K.", amount: "$56,000", daysInStage: 4 },
      { id: 7, name: "MediaGroup", company: "Diyor R.", amount: "$53,000", daysInStage: 12 },
    ],
  },
  {
    id: "proposal",
    title: "Taklif",
    count: 2,
    total: "$95,700",
    deals: [
      { id: 8, name: "GlobalTrade Co", company: "Nilufar K.", amount: "$28,500", daysInStage: 3 },
      { id: 9, name: "BuildCorp", company: "Otabek J.", amount: "$67,200", daysInStage: 6 },
    ],
  },
  {
    id: "negotiation",
    title: "Muzokara",
    count: 2,
    total: "$159,200",
    deals: [
      { id: 10, name: "DataStream Inc", company: "Bobur A.", amount: "$67,200", daysInStage: 8 },
      { id: 11, name: "SmartLogistics", company: "Jasur T.", amount: "$92,000", daysInStage: 15 },
    ],
  },
  {
    id: "closed",
    title: "Yopilgan",
    count: 1,
    total: "$45,000",
    deals: [
      { id: 12, name: "TechVision LLC", company: "Sardor R.", amount: "$45,000", daysInStage: 0 },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export const PipelineBoard = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex gap-4 overflow-x-auto pb-4 px-6"
    >
      {columns.map((col) => (
        <motion.div key={col.id} variants={itemVariants} className="w-[280px] shrink-0 flex flex-col">
          {/* Column header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                {col.count}
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{col.total}</span>
          </div>

          {/* Cards */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
            {col.deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-card border border-border rounded-lg p-4 forge-shadow-sm forge-transition forge-hover cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{deal.name}</p>
                  <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 forge-transition" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">{deal.company}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-foreground">{deal.amount}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {deal.daysInStage === 0 ? "Bugun" : `${deal.daysInStage} kun`}
                  </span>
                </div>
              </div>
            ))}

            {/* Add button */}
            <button className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm text-muted-foreground border border-dashed border-border rounded-lg hover:bg-muted forge-transition">
              <Plus className="w-3.5 h-3.5" />
              Qo'shish
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
