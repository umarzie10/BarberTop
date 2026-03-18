import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Kanban,
  BarChart3,
  Settings,
  Zap,
  Mail,
  Search,
  ChevronDown,
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Kanban, label: "Pipeline", path: "/pipeline" },
  { icon: Users, label: "Kontaktlar", path: "/contacts" },
  { icon: Mail, label: "Xabarlar", path: "/messages" },
  { icon: BarChart3, label: "Analitika", path: "/analytics" },
  { icon: Zap, label: "Integratsiya", path: "/integrations" },
  { icon: Settings, label: "Sozlamalar", path: "/settings" },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md forge-transition ${
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
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold">AK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Aziz Karimov</p>
            <p className="text-xs text-muted-foreground truncate">Sotuv menejeri</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
};
