import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, roleLabels, roleDescriptions, type AppRole } from "@/hooks/useUserRole";
import { useLanguage, langLabels, type Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Shield, Bell, Palette, Users, Save, Crown, UserCheck, Briefcase, Eye, Sun, Moon, Globe } from "lucide-react";

interface TeamMember { user_id: string; display_name: string | null; role: AppRole; }

const roleIcons: Record<AppRole, typeof Crown> = {
  admin: Crown, crm_manager: Briefcase, team_leader: UserCheck, employee: User, guest: Eye,
};

const Settings = () => {
  const { user } = useAuth();
  const { role, isAdmin } = useUserRole();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "team", label: t("settings.team"), icon: Users },
    { id: "roles", label: t("settings.roles"), icon: Shield },
    { id: "appearance", label: t("settings.appearance"), icon: Palette },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
  ];

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || "");
      fetchTeam();
    }
  }, [user]);

  const fetchTeam = async () => {
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    if (!roles) return;
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name");
    setTeamMembers(roles.map((r) => ({
      user_id: r.user_id,
      display_name: profiles?.find((p) => p.user_id === r.user_id)?.display_name || "—",
      role: r.role,
    })));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ display_name: displayName }).eq("user_id", user.id);
    await supabase.auth.updateUser({ data: { full_name: displayName } });
    setSaving(false);
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    if (!isAdmin) return;
    await supabase.from("user_roles").update({ role: newRole }).eq("user_id", userId);
    fetchTeam();
  };

  const langs: Language[] = ["uz", "ru", "en"];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("settings.subtitle")}</p>
      </div>

      <div className="flex gap-6">
        <div className="w-[200px] shrink-0 space-y-0.5">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md forge-transition ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex-1 max-w-2xl">

          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-lg forge-shadow-sm">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{t("settings.profile")}</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("settings.fullName")}</label>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("auth.email")}</label>
                  <input value={user?.email || ""} disabled className="w-full px-3 py-2 text-sm border border-border rounded-md bg-muted text-muted-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("settings.roles")}</label>
                  <div className="flex items-center gap-2">
                    {role && <><span className="text-sm font-medium text-foreground">{roleLabels[role]}</span><span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">{role}</span></>}
                  </div>
                </div>
                <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90 disabled:opacity-50">
                  <Save className="w-4 h-4" />{saving ? t("settings.saving") : t("settings.save")}
                </button>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-card border border-border rounded-lg forge-shadow-sm">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{t("settings.teamMembers")}</h3>
                <span className="text-xs font-mono text-muted-foreground">{teamMembers.length} {t("settings.members")}</span>
              </div>
              <div className="divide-y divide-border">
                {teamMembers.map((member) => {
                  const RoleIcon = roleIcons[member.role];
                  return (
                    <div key={member.user_id} className="px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {member.display_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.display_name}</p>
                          <p className="text-xs text-muted-foreground">{roleLabels[member.role]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <RoleIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        {isAdmin && member.user_id !== user?.id ? (
                          <select value={member.role} onChange={(e) => handleRoleChange(member.user_id, e.target.value as AppRole)}
                            className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20">
                            {(Object.keys(roleLabels) as AppRole[]).map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
                          </select>
                        ) : (
                          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">{roleLabels[member.role]}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {teamMembers.length === 0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">{t("settings.noTeam")}</div>}
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-3">
              <div className="bg-card border border-border rounded-lg forge-shadow-sm px-5 py-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t("settings.rolesAndPermissions")}</h3>
                <p className="text-xs text-muted-foreground">{t("settings.rolesDesc")}</p>
              </div>
              {(Object.keys(roleLabels) as AppRole[]).map((r) => {
                const RoleIcon = roleIcons[r];
                const permissions = getRolePermissions(r);
                return (
                  <div key={r} className="bg-card border border-border rounded-lg forge-shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
                        r === "admin" ? "bg-destructive/10 text-destructive" :
                        r === "crm_manager" ? "bg-primary/10 text-primary" :
                        r === "team_leader" ? "bg-warning/10 text-warning" :
                        r === "employee" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}><RoleIcon className="w-4.5 h-4.5" /></div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{roleLabels[r]}</p>
                        <p className="text-xs text-muted-foreground">{roleDescriptions[r]}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {permissions.map((p) => <span key={p} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">✅ {p}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg forge-shadow-sm p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">{t("settings.appearance")}</h3>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{theme === "dark" ? t("settings.darkMode") : t("settings.lightMode")}</p>
                      <p className="text-xs text-muted-foreground">{theme === "dark" ? "🌙" : "☀️"}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} className="sr-only peer" />
                    <div className="w-9 h-5 bg-muted peer-focus:ring-2 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">{t("settings.language")}</p>
                  </div>
                  <div className="flex gap-2">
                    {langs.map((l) => (
                      <button key={l} onClick={() => setLang(l)}
                        className={`px-4 py-2 text-sm rounded-md forge-transition ${lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        {langLabels[l]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-lg forge-shadow-sm">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{t("settings.notifications")}</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: "Yangi lead / Новый лид / New lead", desc: "Email & push" },
                  { label: "Stage change / Этап изменён", desc: "Pipeline" },
                  { label: "Task deadline / Срок задачи", desc: "1 day before" },
                  { label: "New message / Новое сообщение", desc: "Chat & Telegram" },
                  { label: "Weekly report / Еженедельный отчёт", desc: "Mon 9:00" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted peer-focus:ring-2 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

function getRolePermissions(role: AppRole): string[] {
  const perms: Record<AppRole, string[]> = {
    admin: ["Full access", "Users", "Roles", "Integrations", "Pipeline", "Reports"],
    crm_manager: ["Leads CRUD", "Deals", "Contacts", "Pipeline reports", "Tasks"],
    team_leader: ["Team leads", "Reports", "Tasks", "Workflow"],
    employee: ["Own leads", "Own deals", "Own tasks", "Personal reports"],
    guest: ["Limited view", "Assigned tasks only"],
  };
  return perms[role];
}

export default Settings;
