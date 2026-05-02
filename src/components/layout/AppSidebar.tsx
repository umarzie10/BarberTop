import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage, langLabels, type Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard, Calendar, Scissors, Users, DollarSign, LogOut,
  Sun, Moon, User, Globe, Sparkles, BookOpen, MessageCircle, Crown,
  Image as ImageIcon, BarChart3, Star,
} from "lucide-react";
import { useState } from "react";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useUserRole();
  const { user, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const adminNav = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), path: "/" },
    { icon: Calendar, label: t("nav.appointments"), path: "/appointments" },
    { icon: Scissors, label: t("nav.services"), path: "/services" },
    { icon: User, label: t("nav.barbers"), path: "/barbers" },
    { icon: Users, label: t("nav.clients"), path: "/clients" },
    { icon: DollarSign, label: t("nav.payments"), path: "/payments" },
    { icon: Crown, label: t("nav.plans"), path: "/plans" },
    { icon: MessageCircle, label: t("nav.messages"), path: "/messages" },
  ];
  const barberNav = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), path: "/" },
    { icon: Calendar, label: t("nav.appointments"), path: "/appointments" },
    { icon: MessageCircle, label: t("nav.messages"), path: "/messages" },
    { icon: Crown, label: t("nav.plans"), path: "/plans" },
    { icon: User, label: t("nav.profile"), path: "/profile" },
  ];
  const clientNav = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), path: "/" },
    { icon: BookOpen, label: t("nav.book"), path: "/book" },
    { icon: User, label: t("nav.barbers"), path: "/barbers" },
    { icon: Calendar, label: t("nav.myBookings"), path: "/my-bookings" },
    { icon: MessageCircle, label: t("nav.messages"), path: "/messages" },
    { icon: Crown, label: t("nav.plans"), path: "/plans" },
    { icon: User, label: t("nav.profile"), path: "/profile" },
  ];

  const nav = role === "admin" ? adminNav : role === "barber" ? barberNav : clientNav;

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  const langs: Language[] = ["uz", "ru", "en"];
  const roleLabel = role === "admin" ? t("role.admin") : role === "barber" ? t("role.barber") : t("role.client");

  const SidebarBody = () => (
    <>
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{t("brand.name")}</p>
            <p className="text-[10px] text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {nav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md forge-transition ${
                isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-2 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-1 px-2">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          {langs.map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-2 py-0.5 text-[11px] rounded forge-transition ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              {langLabels[l]}
            </button>
          ))}
        </div>
        <button onClick={toggleTheme} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md forge-transition">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button onClick={signOut} className="p-1.5 hover:bg-muted rounded forge-transition" title={t("nav.logout")}>
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-40 flex items-center justify-between px-4">
        <button onClick={() => setOpen(!open)} className="p-2 hover:bg-muted rounded-md">
          <div className="space-y-1"><div className="w-5 h-0.5 bg-foreground" /><div className="w-5 h-0.5 bg-foreground" /><div className="w-5 h-0.5 bg-foreground" /></div>
        </button>
        <span className="font-semibold text-foreground">{t("brand.name")}</span>
        <div className="w-8" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] h-screen bg-sidebar border-r border-sidebar-border flex-col fixed left-0 top-0 z-30">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
          <aside className="md:hidden w-[260px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
            <SidebarBody />
          </aside>
        </>
      )}
    </>
  );
};
