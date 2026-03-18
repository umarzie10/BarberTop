import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, roleLabels } from "@/hooks/useUserRole";
import {
  LayoutDashboard,
  Users,
  Kanban,
  BarChart3,
  Settings,
  Zap,
  MessageSquare,
  Search,
  LogOut,
  UserPlus,
  ClipboardList,
  Building2,
} from "lucide-react";

const navSections = [
  {
    label: "Asosiy",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: Kanban, label: "Pipeline", path: "/pipeline" },
      { icon: ClipboardList, label: "Faoliyatlar", path: "/activities" },
    ],
  },
  {
    label: "CRM",
    items: [
      { icon: UserPlus, label: "Leadlar", path: "/leads" },
      { icon: Users, label: "Kontaktlar", path: "/contacts" },
      { icon: MessageSquare, label: "Xabarlar", path: "/communications" },
    ],
  },
  {
    label: "Tizim",
    items: [
      { icon: BarChart3, label: "Analitika", path: "/analytics" },
      { icon: Zap, label: "Integratsiya", path: "/integrations" },
      { icon: Settings, label: "Sozlamalar", path: "/settings" },
    ],
  },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <aside className="w-[240px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">F</span>
          </div>
          <span className="font-semibold text-foreground tracking-tight">Forge CRM</span>
        </div>
      </div>

      {/* Quick Search */}
      <div className="px-3 py-3">
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-md border border-border bg-background hover:bg-muted forge-transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Qidirish...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
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
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
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

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.user_metadata?.full_name || user?.email || "Foydalanuvchi"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button onClick={signOut} className="p-1 hover:bg-muted rounded forge-transition" title="Chiqish">
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
};
