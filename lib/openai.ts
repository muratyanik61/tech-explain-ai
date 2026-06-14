import OpenAI from "openai";

/**
 * OpenAI istemcisi.
 * Anahtar SADECE sunucu tarafında (.env.local -> process.env) okunur,
 * tarayıcıya hiçbir zaman gönderilmez.
 */
export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-buraya")) {
    throw new Error(
      "OPENAI_API_KEY tanımlı değil. .env.local dosyasına geçerli bir anahtar ekleyin."
    );
  }
  return new OpenAI({ apiKey });
}

export const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Modeli JSON modunda çalıştırıp sonucu parse eden yardımcı.
 * Tutarlı, parse edilebilir çıktı için response_format json_object kullanır.
 */
export async function chatJSON(system: string, user: string) {
  const client = getOpenAI();
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw);
}
