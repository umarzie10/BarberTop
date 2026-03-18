import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: delay * 0.05,
    },
  }),
};

export const MetricCard = ({ title, value, change, changeType, icon: Icon, delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="bg-card border border-border rounded-lg p-5 forge-shadow-sm forge-transition forge-hover cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {changeType === "positive" ? <TrendingUp className="w-3 h-3" /> : changeType === "negative" ? <TrendingDown className="w-3 h-3" /> : null}
          {change}
        </div>
      </div>
      <p className="text-2xl font-semibold text-foreground tracking-tight font-mono">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </motion.div>
  );
};
