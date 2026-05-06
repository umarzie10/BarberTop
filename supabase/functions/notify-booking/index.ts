// Sends Telegram notifications for booking events. Called from the client
// (or from Postgres triggers in the future) with appointment_id + event type.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.45.4/cors";

const TG_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function tgSend(chat_id: number, text: string) {
  const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML" }),
  });
  return r.ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { appointment_id, event } = await req.json();
    if (!appointment_id || !event) {
      return new Response(JSON.stringify({ error: "appointment_id and event required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supa = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: appt } = await supa.from("appointments")
      .select("*, barbers(full_name, user_id)")
      .eq("id", appointment_id).maybeSingle();
    if (!appt) return new Response(JSON.stringify({ error: "appointment not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const dateStr = `${appt.appointment_date} ${appt.appointment_time?.slice(0, 5)}`;

    let clientText = "", barberText = "";
    if (event === "created") {
      clientText = `🆕 <b>Yangi bron yaratildi</b>\n📅 ${dateStr}\n💈 Sartarosh: ${appt.barbers?.full_name}\n💰 ${Number(appt.total_price || 0).toLocaleString()} so'm\nHolat: <b>kutilmoqda</b>`;
      barberText = `🔔 <b>Yangi bron!</b>\n📅 ${dateStr}\n👤 Mijoz: ${appt.client_name || "—"}\n📞 ${appt.client_phone || "—"}\n💰 ${Number(appt.total_price || 0).toLocaleString()} so'm`;
    } else if (event === "confirmed") {
      clientText = `✅ <b>Broningiz tasdiqlandi!</b>\n📅 ${dateStr}\n💈 ${appt.barbers?.full_name}`;
    } else if (event === "cancelled") {
      clientText = `❌ <b>Bron bekor qilindi</b>\n📅 ${dateStr}`;
      barberText = `❌ Bron bekor qilindi: ${dateStr} (${appt.client_name})`;
    } else if (event === "reminder") {
      clientText = `⏰ <b>Eslatma:</b> 1 soatdan so'ng broningiz!\n📅 ${dateStr}\n💈 ${appt.barbers?.full_name}`;
    } else if (event === "completed") {
      clientText = `✨ Tashrifingiz uchun rahmat! Sharh qoldiring 🌟`;
    }

    const sent: Record<string, boolean> = {};

    if (clientText && appt.client_id) {
      const { data: cp } = await supa.from("profiles").select("telegram_chat_id").eq("user_id", appt.client_id).maybeSingle();
      if (cp?.telegram_chat_id) sent.client = await tgSend(cp.telegram_chat_id, clientText);
    }
    if (barberText && appt.barbers?.user_id) {
      const { data: bp } = await supa.from("profiles").select("telegram_chat_id").eq("user_id", appt.barbers.user_id).maybeSingle();
      if (bp?.telegram_chat_id) sent.barber = await tgSend(bp.telegram_chat_id, barberText);
    }

    return new Response(JSON.stringify({ ok: true, sent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
