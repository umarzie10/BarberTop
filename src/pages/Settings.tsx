import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, roleLabels, roleDescriptions, type AppRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { User, Shield, Bell, Palette, Users, ChevronRight, Save, Crown, UserCheck, Briefcase, Eye } from "lucide-react";

interface TeamMember {
  user_id: string;
  display_name: string | null;
  role: AppRole;
  email?: string;
}

const roleIcons: Record<AppRole, typeof Crown> = {
  admin: Crown,
  crm_manager: Briefcase,
  team_leader: UserCheck,
  employee: User,
  guest: Eye,
};

const tabs = [
  { id: "profile", label: "Profil", icon: User },
  { id: "team", label: "Jamoa", icon: Users },
  { id: "roles", label: "Rollar", icon: Shield },
  { id: "notifications", label: "Bildirishnomalar", icon: Bell },
];

const Settings = () => {
  const { user } = useAuth();
  const { role, isAdmin, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState(false);

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

    const members: TeamMember[] = roles.map((r) => {
      const profile = profiles?.find((p) => p.user_id === r.user_id);
      return {
        user_id: r.user_id,
        display_name: profile?.display_name || "Noma'lum",
        role: r.role,
      };
    });
    setTeamMembers(members);
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Sozlamalar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Profil, jamoa va tizim sozlamalari</p>
      </div>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="w-[200px] shrink-0 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md forge-transition ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex-1 max-w-2xl"
        >
          {/* Profile tab */}
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-lg forge-shadow-sm">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Shaxsiy ma'lumotlar</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To'liq ism</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-muted text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rol</label>
                  <div className="flex items-center gap-2">
                    {role && (
                      <>
                        <span className="text-sm font-medium text-foreground">{roleLabels[role]}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">{role}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md forge-transition hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </div>
          )}

          {/* Team tab */}
          {activeTab === "team" && (
            <div className="bg-card border border-border rounded-lg forge-shadow-sm">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Jamoa a'zolari</h3>
                <span className="text-xs font-mono text-muted-foreground">{teamMembers.length} ta a'zo</span>
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
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.user_id, e.target.value as AppRole)}
                            className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                          >
                            {(Object.keys(roleLabels) as AppRole[]).map((r) => (
                              <option key={r} value={r}>{roleLabels[r]}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">
                            {roleLabels[member.role]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {teamMembers.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Hali jamoa a'zolari yo'q
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Roles tab */}
          {activeTab === "roles" && (
            <div className="space-y-3">
              <div className="bg-card border border-border rounded-lg forge-shadow-sm px-5 py-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Rollar va huquqlar</h3>
                <p className="text-xs text-muted-foreground">Har bir rol turli darajadagi ruxsatlarga ega</p>
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
                        r === "employee" ? "bg-success/10 text-success" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        <RoleIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{roleLabels[r]}</p>
                        <p className="text-xs text-muted-foreground">{roleDescriptions[r]}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {permissions.map((p) => (
                        <span key={p} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">
                          ✅ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-lg forge-shadow-sm">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Bildirishnoma sozlamalari</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: "Yangi lead kelganda", desc: "Email va push bildirishnoma" },
                  { label: "Bitim bosqichi o'zgarganda", desc: "Pipeline harakatlari" },
                  { label: "Vazifa muddati yaqinlashganda", desc: "1 kun oldin eslatma" },
                  { label: "Yangi xabar kelganda", desc: "Chat va Telegram xabarlari" },
                  { label: "Haftalik hisobot", desc: "Har dushanba soat 9:00" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
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
    admin: ["Barcha modullarni boshqarish", "Foydalanuvchilar", "Rollar", "Integratsiyalar", "Pipeline sozlash", "Hisobotlar"],
    crm_manager: ["Leads yaratish/o'zgartirish", "Deals boshqarish", "Mijozlar", "Pipeline hisobotlari", "Vazifalar"],
    team_leader: ["Jamoa leadlarini kuzatish", "Hisobotlar", "Vazifalar nazorati", "Workflow nazorat"],
    employee: ["O'z leadlari", "O'z deallari", "O'z vazifalari", "Shaxsiy hisobot"],
    guest: ["Cheklangan ko'rish", "Berilgan vazifalar"],
  };
  return perms[role];
}

export default Settings;
