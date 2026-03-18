import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, roleLabels } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard, Users, Kanban, BarChart3, Settings, Zap, MessageSquare,
  Search, LogOut, UserPlus, ClipboardList, Sun, Moon, Workflow,
} from "lucide-react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useUserRole();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navSections = [
    {
      label: t("nav.main"),
      items: [
        { icon: LayoutDashboard, label: t("nav.dashboard"), path: "/" },
        { icon: Kanban, label: t("nav.pipeline"), path: "/pipeline" },
        { icon: ClipboardList, label: t("nav.activities"), path: "/activities" },
      ],
    },
    {
      label: t("nav.crm"),
      items: [
        { icon: UserPlus, label: t("nav.leads"), path: "/leads" },
        { icon: Users, label: t("nav.contacts"), path: "/contacts" },
        { icon: MessageSquare, label: t("nav.communications"), path: "/communications" },
      ],
    },
    {
      label: t("nav.system"),
      items: [
        { icon: BarChart3, label: t("nav.analytics"), path: "/analytics" },
        { icon: Workflow, label: t("nav.automation"), path: "/automation" },
        { icon: Zap, label: t("nav.integrations"), path: "/integrations" },
        { icon: Settings, label: t("nav.settings"), path: "/settings" },
      ],
    },
  ];

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <aside className="w-[240px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-30">
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">F</span>
          </div>
          <span className="font-semibold text-foreground tracking-tight">Forge CRM</span>
        </div>
      </div>

      <div className="px-3 py-3">
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-md border border-border bg-background hover:bg-muted forge-transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{t("nav.search")}</span>
          <kbd className="ml-auto text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      <nav className="flex-1 px-3 py-1 overflow-y-auto space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm rounded-md forge-transition ${
                      isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-2 border-t border-sidebar-border">
        <button onClick={toggleTheme} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md forge-transition">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{theme === "dark" ? t("settings.lightMode") : t("settings.darkMode")}</span>
        </button>
      </div>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.user_metadata?.full_name || user?.email || t("common.user")}
            </p>
            <p className="text-xs text-muted-foreground truncate">{role ? roleLabels[role] : user?.email}</p>
          </div>
          <button onClick={signOut} className="p-1 hover:bg-muted rounded forge-transition" title={t("nav.logout")}>
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export { AppSidebar };
