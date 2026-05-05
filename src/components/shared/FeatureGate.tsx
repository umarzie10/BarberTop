import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Crown } from "lucide-react";
import { useTier, FEATURE_MIN_TIER, type Tier } from "@/hooks/usePlanFeatures";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  feature: keyof typeof FEATURE_MIN_TIER;
  audience: "client" | "barber";
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, audience, children, fallback }: Props) {
  const { can, tier } = useTier(audience);
  const { t } = useLanguage();
  if (can(feature)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  const min = FEATURE_MIN_TIER[feature]?.[audience] as Tier;
  return (
    <div className="p-6 rounded-lg border-2 border-dashed border-border bg-muted/20 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Lock className="w-5 h-5 text-primary" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">{t("gate.locked")}</p>
      <p className="text-xs text-muted-foreground mb-4">
        {t("gate.upgradeTo")} <span className="font-bold uppercase text-primary inline-flex items-center gap-1"><Crown className="w-3 h-3" />{min}</span>
      </p>
      <Link to="/plans" className="inline-block px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90">
        {t("gate.viewPlans")}
      </Link>
      <p className="text-[10px] text-muted-foreground mt-2">{t("common.user")}: <span className="uppercase font-semibold">{tier}</span></p>
    </div>
  );
}
