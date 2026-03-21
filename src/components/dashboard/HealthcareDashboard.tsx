import { MetricCard } from "./MetricCard";
import { Heart, Stethoscope, Calendar, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ActivityFeed } from "./ActivityFeed";
import { motion } from "framer-motion";

interface Props {
  deals: any[];
  contacts: any[];
  loading: boolean;
}

export const HealthcareDashboard = ({ deals, contacts, loading }: Props) => {
  const { t } = useLanguage();

  const patients = contacts.length;
  const appointments = deals.filter(d => !["won", "lost"].includes(d.stage)).length;
  const completed = deals.filter(d => d.stage === "won").length;
  const doctors = new Set(deals.map(d => d.contact_name).filter(Boolean)).size;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title={t("wdash.patients")} value={String(patients)} change="" changeType="neutral" icon={Heart} delay={0} />
        <MetricCard title={t("wdash.appointments")} value={String(appointments)} change="" changeType="neutral" icon={Calendar} delay={1} />
        <MetricCard title={t("wdash.completedVisits")} value={String(completed)} change="" changeType="neutral" icon={Activity} delay={2} />
        <MetricCard title={t("wdash.doctors")} value={String(doctors)} change="" changeType="neutral" icon={Stethoscope} delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-5 forge-shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t("wdash.recentPatients")}</h3>
          <div className="space-y-3">
            {contacts.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.company}</p>
                </div>
                <span className="text-xs text-muted-foreground">{c.phone || c.email || "—"}</span>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("contacts.noContacts")}</p>}
          </div>
        </motion.div>
        <div><ActivityFeed /></div>
      </div>
    </>
  );
};
