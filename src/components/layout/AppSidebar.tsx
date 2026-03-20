import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, roleLabels } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWorkspace, workspaceTypes } from "@/contexts/WorkspaceContext";
import {
  LayoutDashboard, Users, Kanban, BarChart3, Settings, Zap, MessageSquare,
  Search, LogOut, UserPlus, ClipboardList, Sun, Moon, Workflow, ChevronDown,
  GraduationCap, AlertTriangle, Heart, Home, Truck, ShoppingCart, Headphones,
  Landmark, Factory, Building,
} from "lucide-react";
import { useState } from "react";

const workspaceIcons: Record<string, typeof LayoutDashboard> = {
  sales: Kanban,
  education: GraduationCap,
  government: AlertTriangle,
  healthcare: Heart,
  realestate: Home,
  logistics: Truck,
  ecommerce: ShoppingCart,
  support: Headphones,
  finance: Landmark,
  production: Factory,
};

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useUserRole();
  const { user, signOut } = useAuth();
  const { t, lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { workspace, setWorkspace, getWorkspaceInfo } = useWorkspace();
  const [showWsPicker, setShowWsPicker] = useState(false);

  const wsInfo = getWorkspaceInfo();

  // Module-specific nav items
  const moduleItems = {
    sales: [],
    education: [{ icon: GraduationCap, label: { uz: "Talabalar", ru: "Студенты", en: "Students" }, path: "/education" }],
    government: [{ icon: AlertTriangle, label: { uz: "Murojaatlar", ru: "Обращения", en: "Complaints" }, path: "/government" }],
    healthcare: [{ icon: Heart, label: { uz: "Bemorlar", ru: "Пациенты", en: "Patients" }, path: "/healthcare" }],
    realestate: [{ icon: Home, label: { uz: "Ob'ektlar", ru: "Объекты", en: "Properties" }, path: "/realestate" }],
    logistics: [{ icon: Truck, label: { uz: "Yetkazish", ru: "Доставка", en: "Delivery" }, path: "/logistics" }],
    ecommerce: [{ icon: ShoppingCart, label: { uz: "Buyurtmalar", ru: "Заказы", en: "Orders" }, path: "/ecommerce" }],
    support: [{ icon: Headphones, label: { uz: "Ticketlar", ru: "Тикеты", en: "Tickets" }, path: "/support" }],
    finance: [{ icon: Landmark, label: { uz: "Hisoblar", ru: "Счета", en: "Accounts" }, path: "/finance" }],
    production: [{ icon: Factory, label: { uz: "Ishlab chiqarish", ru: "Производство", en: "Production" }, path: "/production" }],
  };

  const extraItems = moduleItems[workspace] || [];

  const navSections = [
    {
      label: t("nav.main"),
      items: [
        { icon: LayoutDashboard, label: t("nav.dashboard"), path: "/" },
        { icon: Kanban, label: t("nav.pipeline"), path: "/pipeline" },
        { icon: ClipboardList, label: t("nav.activities"), path: "/activities" },
        ...extraItems.map(item => ({ icon: item.icon, label: item.label[lang] || item.label.en, path: item.path })),
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

  const WsIcon = workspaceIcons[workspace] || Building;

  return (
    <aside className="w-[240px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-30">
      {/* Header with workspace picker */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        <button onClick={() => setShowWsPicker(!showWsPicker)} className="flex items-center gap-2 w-full hover:bg-sidebar-accent rounded-md px-2 py-1.5 forge-transition">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm">{wsInfo.icon}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{wsInfo.label[lang]}</p>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground forge-transition ${showWsPicker ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Workspace picker dropdown */}
      {showWsPicker && (
        <div className="absolute top-14 left-0 w-[240px] bg-card border border-border rounded-b-lg forge-shadow-md z-40 max-h-[400px] overflow-y-auto">
          {workspaceTypes.map(ws => (
            <button key={ws.type} onClick={() => { setWorkspace(ws.type); setShowWsPicker(false); navigate("/"); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm forge-transition ${workspace === ws.type ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
              <span className="text-base">{ws.icon}</span>
              <div className="text-left min-w-0">
                <p className="font-medium truncate">{ws.label[lang]}</p>
                <p className="text-[10px] text-muted-foreground truncate">{ws.description[lang]}</p>
              </div>
            </button>
          ))}
          <button onClick={() => { setShowWsPicker(false); navigate("/workspace"); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary hover:bg-muted forge-transition border-t border-border">
            <Building className="w-4 h-4" />
            <span className="font-medium">
              {{ uz: "Barcha modullar", ru: "Все модули", en: "All Modules" }[lang]}
            </span>
          </button>
        </div>
      )}

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
