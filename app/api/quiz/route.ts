import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { buildQuizPrompt, type Level } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const concept: string = (body?.concept ?? "").toString().trim();
    const level: Level = body?.level ?? "Başlangıç";

    if (!concept) {
      return NextResponse.json(
        { error: "Lütfen bir kavram girin." },
        { status: 400 }
      );
    }

    const { system, user } = buildQuizPrompt(concept, level);
    const data = await chatJSON(system, user);

    const sorular = Array.isArray(data?.sorular) ? data.sorular : [];
    return NextResponse.json({ concept, level, sorular });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
