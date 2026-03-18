import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

const roleHierarchy: Record<AppRole, number> = {
  admin: 5,
  crm_manager: 4,
  team_leader: 3,
  employee: 2,
  guest: 1,
};

const roleLabels: Record<AppRole, string> = {
  admin: "Administrator",
  crm_manager: "CRM Manager",
  team_leader: "Team Leader",
  employee: "Xodim",
  guest: "Mehmon",
};

const roleDescriptions: Record<AppRole, string> = {
  admin: "Barcha modul va sozlamalarni boshqaradi",
  crm_manager: "Leads, Deals, mijozlarni boshqaradi",
  team_leader: "Jamoa a'zolarining ishini kuzatadi",
  employee: "O'z leads, deals va contacts bilan ishlaydi",
  guest: "Cheklangan kirish huquqi",
};

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data, error } = await supabase.rpc("get_user_role", { _user_id: user.id });
      if (!error && data) {
        setRole(data);
      } else {
        setRole("employee"); // fallback
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  const hasPermission = (requiredRole: AppRole): boolean => {
    if (!role) return false;
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = role === "admin";
  const isManager = hasPermission("crm_manager");
  const isLeader = hasPermission("team_leader");

  return { role, loading, hasPermission, isAdmin, isManager, isLeader, roleLabels, roleDescriptions };
};

export { roleLabels, roleDescriptions };
