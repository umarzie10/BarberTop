import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SalesDashboard } from "@/components/dashboard/SalesDashboard";
import { EducationDashboard } from "@/components/dashboard/EducationDashboard";
import { GovernmentDashboard } from "@/components/dashboard/GovernmentDashboard";
import { HealthcareDashboard } from "@/components/dashboard/HealthcareDashboard";
import { GenericDashboard } from "@/components/dashboard/GenericDashboard";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { workspace, getWorkspaceInfo } = useWorkspace();
  const [deals, setDeals] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [dealsRes, contactsRes] = await Promise.all([
        supabase.from("deals").select("*").order("created_at", { ascending: false }),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
      ]);
      setDeals(dealsRes.data || []);
      setContacts(contactsRes.data || []);
      setLoading(false);
    };
    fetchData();

    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "deals" }, () => {
        supabase.from("deals").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setDeals(data); });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, () => {
        supabase.from("contacts").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setContacts(data); });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const wsInfo = getWorkspaceInfo();
  const subtitleKey = `wdash.subtitle.${workspace}`;

  const renderDashboard = () => {
    switch (workspace) {
      case "sales": case "realestate": case "finance":
        return <SalesDashboard deals={deals} contacts={contacts} loading={loading} />;
      case "education":
        return <EducationDashboard deals={deals} contacts={contacts} />;
      case "government":
        return <GovernmentDashboard deals={deals} contacts={contacts} />;
      case "healthcare":
        return <HealthcareDashboard deals={deals} contacts={contacts} loading={loading} />;
      default:
        return <GenericDashboard deals={deals} contacts={contacts} loading={loading} />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            {wsInfo.icon} {t("dash.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t(subtitleKey)}</p>
        </div>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
