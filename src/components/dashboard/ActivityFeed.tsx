import { motion } from "framer-motion";
import { Phone, Mail, FileText, CheckCircle } from "lucide-react";

const activities = [
  { icon: CheckCircle, text: "TechVision bitimi shartnoma bosqichiga o'tdi", time: "5 daqiqa oldin", color: "text-success" },
  { icon: Phone, text: "Sardor Raximov bilan qo'ng'iroq — 12 daqiqa", time: "1 soat oldin", color: "text-primary" },
  { icon: Mail, text: "GlobalTrade Co'ga taklif yuborildi", time: "2 soat oldin", color: "text-primary" },
  { icon: FileText, text: "SmartLogistics shartnomasi tayyorlandi", time: "3 soat oldin", color: "text-accent" },
  { icon: Phone, text: "Madina Xolmatova bilan uchrashish rejalashtirildi", time: "5 soat oldin", color: "text-warning" },
];

export const ActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      className="bg-card border border-border rounded-lg forge-shadow-sm"
    >
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">Faoliyat</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity, i) => (
          <div key={i} className="px-5 py-3.5 flex items-start gap-3">
            <activity.icon className={`w-4 h-4 mt-0.5 shrink-0 ${activity.color}`} />
            <div className="min-w-0">
              <p className="text-sm text-foreground">{activity.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
