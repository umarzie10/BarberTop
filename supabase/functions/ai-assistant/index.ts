// Lovable AI Gateway streaming chat for Barber Studio
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_BY_ROLE: Record<string, string> = {
  client:
    "Sen Barber Studio mijozlari uchun yordamchi AI'sisan. Sartaroshlar, xizmatlar, narxlar, navbat olish va soch turmaklari (hairstyle) bo'yicha qisqa, do'stona maslahat ber. Foydalanuvchi tilida (uz/ru/en) javob ber. Markdown ishlat.",
  barber:
    "Sen Barber Studio sartaroshlari uchun professional yordamchisan. Mijozlar bilan muloqot, narx tavsiyasi, vaqtni boshqarish, trend turmaklar bo'yicha qisqa va aniq maslahat ber. Markdown ishlat.",
  admin:
    "Sen Barber Studio adminlari uchun analitik yordamchisan. Statistika, daromad, sartaroshlarni boshqarish, marketing va qarorlar bo'yicha qisqa va aniq tavsiyalar ber. Markdown ishlat.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, role = "client" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = SYSTEM_BY_ROLE[role] || SYSTEM_BY_ROLE.client;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...(messages || [])],
        stream: true,
      }),
    });

    if (upstream.status === 429) {
      return new Response(JSON.stringify({ error: "Juda ko'p so'rov, biroz kuting." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (upstream.status === 402) {
      return new Response(JSON.stringify({ error: "AI kreditlari tugadi. Workspace > Usage." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!upstream.ok) {
      const t = await upstream.text();
      return new Response(JSON.stringify({ error: `AI gateway error: ${t}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
