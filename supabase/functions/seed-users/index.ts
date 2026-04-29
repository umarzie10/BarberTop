import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEED = [
  { email: "admin@barber.uz", password: "umar.1020", full_name: "Admin", role: "admin" },
  { email: "barber@barber.uz", password: "umar.1020", full_name: "Aziz Barber", role: "barber" },
  { email: "user@barber.uz", password: "umar.1020", full_name: "Mijoz Foydalanuvchi", role: "client" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const results: any[] = [];

  for (const u of SEED) {
    try {
      // First, look up if user already exists
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users.find((x) => x.email === u.email);
      let userId: string | undefined = existing?.id;

      if (existing) {
        await supabase.auth.admin.updateUserById(existing.id, { password: u.password, email_confirm: true });
      } else {
        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { full_name: u.full_name },
        });
        userId = created?.user?.id;
        if (createErr) console.error("createUser error:", u.email, createErr.message);
      }

      if (!userId) {
        results.push({ email: u.email, status: "error", error: createErr?.message });
        continue;
      }

      // Ensure profile
      await supabase.from("profiles").upsert(
        { user_id: userId, full_name: u.full_name },
        { onConflict: "user_id" }
      );

      // Remove default 'client' role if not the desired role, then add desired role
      await supabase.from("user_roles").delete().eq("user_id", userId);
      await supabase.from("user_roles").insert({ user_id: userId, role: u.role });

      // If barber — ensure barber row
      if (u.role === "barber") {
        const { data: existingBarber } = await supabase.from("barbers").select("id").eq("user_id", userId).maybeSingle();
        if (!existingBarber) {
          await supabase.from("barbers").insert({
            user_id: userId,
            full_name: u.full_name,
            specialty: "Klassik soch olish, soqol",
            bio: "Tajribali sartarosh",
            rating: 4.9,
          });
        }
      }

      results.push({ email: u.email, status: "ok", user_id: userId });
    } catch (e: any) {
      results.push({ email: u.email, status: "error", error: e.message });
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
