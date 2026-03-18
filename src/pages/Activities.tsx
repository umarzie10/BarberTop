import { motion } from "framer-motion";
import { Plus, Phone, Mail, Calendar, CheckCircle, Clock, FileText, Video, Filter } from "lucide-react";

interface Activity {
  id: number;
  type: "call" | "email" | "meeting" | "task" | "document";
  title: string;
  description: string;
  deal?: string;
  contact: string;
  time: string;
  status: "completed" | "planned" | "overdue";
}

const typeIcons = {
  call: Phone,
  email: Mail,
  meeting: Video,
  task: CheckCircle,
  document: FileText,
};

const typeColors = {
  call: "bg-primary/10 text-primary",
  email: "bg-accent/10 text-accent",
  meeting: "bg-warning/10 text-warning",
  task: "bg-success/10 text-success",
  document: "bg-muted text-muted-foreground",
};

const statusStyles = {
  completed: "bg-success/10 text-success",
  planned: "bg-primary/10 text-primary",
  overdue: "bg-destructive/10 text-destructive",
};

const statusLabels = {
  completed: "Bajarildi",
  planned: "Rejalashtirilgan",
  overdue: "Muddati o'tgan",
};

const activities: Activity[] = [
  { id: 1, type: "call", title: "Sardor bilan qo'ng'iroq", description: "Narx bo'yicha muzokara", deal: "TechVision LLC", contact: "Sardor Raximov", time: "Bugun, 14:00", status: "planned" },
  { id: 2, type: "meeting", title: "Demo ko'rsatish", description: "Mahsulot prezentatsiyasi", deal: "FinanceHub", contact: "Alisher Mirzayev", time: "Bugun, 16:00", status: "planned" },
  { id: 3, type: "email", title: "Taklif yuborish", description: "Narx va shartlar taklifi", deal: "GlobalTrade Co", contact: "Nilufar Karimova", time: "Kecha, 11:30", status: "completed" },
  { id: 4, type: "task", title: "Shartnoma tayyorlash", description: "Huquqiy bo'lim bilan tekshirish", deal: "SmartLogistics", contact: "Jasur Toshmatov", time: "Kecha, 09:00", status: "completed" },
  { id: 5, type: "call", title: "Follow-up qo'ng'iroq", description: "Taklifga javob olish", deal: "BuildCorp", contact: "Otabek Jalolov", time: "2 kun oldin", status: "overdue" },
  { id: 6, type: "document", title: "Invoice yaratish", description: "Oylik hisob-faktura", deal: "DataStream Inc", contact: "Bobur Aliyev", time: "3 kun oldin", status: "completed" },
  { id: 7, type: "meeting", title: "Jamoa yig'ilishi", description: "Haftalik savdo hisoboti", contact: "Barcha jamoa", time: "Ertaga, 10:00", status: "planned" },
  { id: 8, type: "email", title: "Yangi lead — javob", description: "Ilk aloqa email", deal: "EduPlatform", contact: "Lola Saidova", time: "Bugun, 09:15", status: "completed" },
];

const Activities = () => {
  const stats = {
    today: activities.filter(a => a.time.includes("Bugun")).length,
    overdue: activities.filter(a => a.status === "overdue").length,
    completed: activities.filter(a => a.status === "completed").length,
    planned: activities.filter(a => a.status === "planned").length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Faoliyatlar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Qo'ng'iroqlar, uchrashuvlar, vazifalar va hujjatlar</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          Yangi faoliyat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Bugungi", value: stats.today, icon: Calendar, color: "text-primary" },
          { label: "Muddati o'tgan", value: stats.overdue, icon: Clock, color: "text-destructive" },
          { label: "Bajarilgan", value: stats.completed, icon: CheckCircle, color: "text-success" },
          { label: "Rejalashtirilgan", value: stats.planned, icon: Calendar, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className="text-xl font-semibold font-mono text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border pb-2">
        {["Barchasi", "Qo'ng'iroqlar", "Uchrashuvlar", "Vazifalar", "Email", "Hujjatlar"].map((tab, i) => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-xs font-medium rounded-md forge-transition ${
              i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
        className="space-y-2"
      >
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="bg-card border border-border rounded-lg p-4 forge-shadow-sm forge-transition forge-hover cursor-pointer flex items-start gap-4"
            >
              <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${typeColors[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-0.5">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ml-2 ${statusStyles[activity.status]}`}>
                    {statusLabels[activity.status]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5">{activity.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{activity.contact}</span>
                  {activity.deal && (
                    <>
                      <span>·</span>
                      <span className="text-primary">{activity.deal}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Activities;
