import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const roleLabels: Record<AppRole, string> = {
  admin: "Administrator",
  barber: "Sartarosh",
  client: "Mijoz",
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
    setLoading(true);
    supabase.rpc("get_user_role", { _user_id: user.id }).then(({ data, error }) => {
      if (!error && data) setRole(data as AppRole);
      else setRole("client");
      setLoading(false);
    });
  }, [user]);

  return { role, loading, isAdmin: role === "admin", isBarber: role === "barber", isClient: role === "client" };
};
