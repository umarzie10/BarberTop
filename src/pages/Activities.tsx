import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Phone, Mail, Calendar, CheckCircle, Clock, Video, FileText, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NewActivityModal } from "@/components/modals/NewActivityModal";

const typeIcons: Record<string, typeof Phone> = {
  call: Phone,
  meeting: Video,
  email: Mail,
  task: FileText,
};

const statusColors: Record<string, string> = {
  planned: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  overdue: "bg-destructive/10 text-destructive",
};

const Activities = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const fetchActivities = async () => {
    if (!user) return;
    const { data } = await supabase.from("activities").select("*").order("created_at", { ascending: false });
    setActivities(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const handleAdd = async (act: { title: string; type: string; description: string; due_date: string }) => {
    if (!user) return;
    await supabase.from("activities").insert({
      title: act.title,
      type: act.type,
      description: act.description || null,
      due_date: act.due_date || null,
      user_id: user.id,
    });
    fetchActivities();
  };

  const toggleComplete = async (id: string, current: string) => {
    const newStatus = current === "completed" ? "planned" : "completed";
    await supabase.from("activities").update({
      status: newStatus,
      completed_at: newStatus === "completed" ? new Date().toISOString() : null,
    }).eq("id", id);
    fetchActivities();
  };

  const today = activities.filter(a => {
    if (!a.due_date) return false;
    return new Date(a.due_date).toDateString() === new Date().toDateString();
  }).length;
  const overdue = activities.filter(a => a.status !== "completed" && a.due_date && new Date(a.due_date) < new Date()).length;
  const completed = activities.filter(a => a.status === "completed").length;
  const planned = activities.filter(a => a.status === "planned").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("activities.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("activities.subtitle")}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90">
          <Plus className="w-4 h-4" />
          {t("activities.new")}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: t("activities.today"), value: today, icon: Calendar, color: "text-primary" },
          { label: t("activities.overdue"), value: overdue, icon: Clock, color: "text-destructive" },
          { label: t("activities.completed"), value: completed, icon: CheckCircle, color: "text-success" },
          { label: t("activities.planned"), value: planned, icon: Calendar, color: "text-primary" },
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

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-2">
        {loading ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("dash.noActivity")}</p>
          </div>
        ) : (
          activities.map((act) => {
            const Icon = typeIcons[act.type] || FileText;
            const sc = statusColors[act.status] || statusColors.planned;
            return (
              <div key={act.id} className="bg-card border border-border rounded-lg p-4 forge-shadow-sm forge-transition forge-hover">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleComplete(act.id, act.status)} className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${act.status === "completed" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {act.status === "completed" ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${act.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{act.title}</p>
                      {act.description && <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${sc}`}>{t(`activities.${act.status}`)}</span>
                    {act.due_date && <span className="text-xs text-muted-foreground">{new Date(act.due_date).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </motion.div>

      <NewActivityModal open={showNew} onClose={() => setShowNew(false)} onAdd={handleAdd} />
    </div>
  );
};

export default Activities;
