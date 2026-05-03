import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // verify caller is admin
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(url, serviceKey);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden — admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { email, password, full_name } = await req.json();
    if (!email || !password) return new Response(JSON.stringify({ error: "email & password required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: full_name || email.split("@")[0] },
    });
    if (createErr || !created.user) return new Response(JSON.stringify({ error: createErr?.message || "Create failed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const uid = created.user.id;
    await admin.from("profiles").upsert({ user_id: uid, full_name: full_name || email.split("@")[0] }, { onConflict: "user_id" });
    await admin.from("user_roles").delete().eq("user_id", uid);
    await admin.from("user_roles").insert({ user_id: uid, role: "barber" });
    await admin.from("barbers").insert({ user_id: uid, full_name: full_name || email.split("@")[0], rating: 5 });

    return new Response(JSON.stringify({ ok: true, user_id: uid }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
