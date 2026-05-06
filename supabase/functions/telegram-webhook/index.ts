// Telegram bot webhook — handles user linking & inbound messages.
// Token stored in TELEGRAM_BOT_TOKEN secret. Webhook secret derived from token.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-telegram-bot-api-secret-token",
};

const TG_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function deriveSecret(): Promise<string> {
  const data = new TextEncoder().encode(`telegram-webhook:${TG_TOKEN}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function tgSend(chat_id: number, text: string, extra: Record<string, unknown> = {}) {
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML", ...extra }),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const expected = await deriveSecret();
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  if (got !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supa = createClient(SUPABASE_URL, SERVICE_KEY);
  const update = await req.json();
  const message = update.message ?? update.edited_message;
  const chatId = message?.chat?.id;
  const text = (message?.text ?? "").trim();

  if (!chatId) return new Response(JSON.stringify({ ok: true, ignored: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  // /start <token>
  if (text.startsWith("/start")) {
    const token = text.split(" ")[1]?.trim();
    if (token) {
      const { data: profile } = await supa.from("profiles").select("user_id, full_name").eq("telegram_link_token", token).maybeSingle();
      if (profile) {
        await supa.from("profiles").update({ telegram_chat_id: chatId, telegram_link_token: null }).eq("user_id", profile.user_id);
        await tgSend(chatId, `✅ <b>Hisobingiz BarberTop bilan bog'landi!</b>\n\nEndi bronlaringiz haqida shu yerga eslatma keladi.`);
      } else {
        await tgSend(chatId, `❌ Bog'lanish tokeni yaroqsiz yoki muddati o'tgan.\n\nBarberTop sayti → Profil → Telegram bog'lash tugmasini bosing.`);
      }
    } else {
      await tgSend(chatId, `👋 <b>Salom! BarberTop botiga xush kelibsiz.</b>\n\nBronlaringiz haqida eslatma olish uchun:\n1️⃣ <a href="https://barbertop.uz">BarberTop</a> saytiga kiring\n2️⃣ Profil → "Telegramni bog'lash" tugmasini bosing\n3️⃣ Tugmani bosgach bot bilan avtomatik bog'lanasiz`);
    }
  } else if (text === "/help" || text === "/menu") {
    await tgSend(chatId, `📋 <b>Buyruqlar:</b>\n/start — botni qayta ishga tushirish\n/help — yordam\n\nBronlar haqida eslatmalar avtomatik keladi.`);
  } else {
    await tgSend(chatId, `Botning maqsadi — bron eslatmalari yuborish.\n/help yozing.`);
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
