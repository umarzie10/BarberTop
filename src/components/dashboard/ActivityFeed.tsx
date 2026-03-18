import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const ActivityFeed = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      className="bg-card border border-border rounded-lg forge-shadow-sm"
    >
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">{t("dash.activity")}</h3>
      </div>
      <div className="px-5 py-8 text-center text-sm text-muted-foreground">
        {t("dash.noActivity")}
      </div>
    </motion.div>
  );
};
