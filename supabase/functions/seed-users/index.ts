import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const users = [
    { email: "admin@example.com", password: "umar.1020", full_name: "Admin User", role: "admin" },
    { email: "manager@example.com", password: "umar.1020", full_name: "CRM Manager", role: "crm_manager" },
    { email: "teamleader@example.com", password: "umar.1020", full_name: "Team Leader", role: "team_leader" },
  ];

  const results = [];

  for (const u of users) {
    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((eu: any) => eu.email === u.email);

    let userId: string;

    if (existing) {
      // Update password
      await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name },
      });
      userId = existing.id;
      results.push({ email: u.email, action: "updated" });
    } else {
      // Create user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name },
      });
      if (error) {
        results.push({ email: u.email, error: error.message });
        continue;
      }
      userId = data.user.id;
      results.push({ email: u.email, action: "created" });
    }

    // Upsert role
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingRole) {
      await supabaseAdmin.from("user_roles").update({ role: u.role }).eq("user_id", userId);
    } else {
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: u.role });
    }

    // Upsert profile
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingProfile) {
      await supabaseAdmin.from("profiles").insert({ user_id: userId, display_name: u.full_name });
    }
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
