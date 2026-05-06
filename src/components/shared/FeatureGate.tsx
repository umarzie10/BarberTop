import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Crown, Sparkles, ArrowRight } from "lucide-react";
import { useTier, FEATURE_MIN_TIER, type Tier } from "@/hooks/usePlanFeatures";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  feature: keyof typeof FEATURE_MIN_TIER;
  audience: "client" | "barber";
  children: ReactNode;
  fallback?: ReactNode;
}

const TIER_GRADIENT: Record<Tier, string> = {
  free: "from-slate-500 to-slate-600",
  pro: "from-blue-500 to-indigo-600",
  vip: "from-amber-400 to-yellow-600",
};

export function FeatureGate({ feature, audience, children, fallback }: Props) {
  const { can, tier } = useTier(audience);
  const { t } = useLanguage();
  if (can(feature)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  const min = (FEATURE_MIN_TIER[feature]?.[audience] || "pro") as Tier;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-muted/20 to-primary/5 p-8 text-center">
      <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${TIER_GRADIENT[min]} opacity-20 blur-3xl rounded-full`} />
      <div className="relative">
        <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${TIER_GRADIENT[min]} flex items-center justify-center mb-4 shadow-lg`}>
          {min === "vip" ? <Crown className="w-7 h-7 text-white" /> : <Sparkles className="w-7 h-7 text-white" />}
        </div>
        <p className="text-base font-semibold text-foreground mb-1">{t("gate.locked")}</p>
        <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
          Bu funksiya <span className={`font-bold uppercase bg-gradient-to-r ${TIER_GRADIENT[min]} bg-clip-text text-transparent`}>{min}</span> rejasidan boshlab ochiq. Hozirgi rejangiz: <span className="uppercase font-medium">{tier}</span>.
        </p>
        <Link to="/plans" className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-full bg-gradient-to-r ${TIER_GRADIENT[min]} hover:opacity-90 shadow-md hover:shadow-lg transition`}>
          {t("gate.viewPlans")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Inline lock badge for buttons / disabled controls
export function LockBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase text-white bg-gradient-to-r ${TIER_GRADIENT[tier]}`}>
      <Lock className="w-2.5 h-2.5" /> {tier}
    </span>
  );
}
