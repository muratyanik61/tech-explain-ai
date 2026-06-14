import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { buildExplainPrompt, type Level, type ExplainMode } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const concept: string = (body?.concept ?? "").toString().trim();
    const level: Level = body?.level ?? "Başlangıç";
    const mode: ExplainMode = body?.mode ?? "explain";
    const previousExamples: string[] = Array.isArray(body?.previousExamples)
      ? body.previousExamples
          .map((x: unknown) => String(x).trim())
          .filter(Boolean)
      : [];

    if (!concept) {
      return NextResponse.json(
        { error: "Lütfen bir kavram girin." },
        { status: 400 }
      );
    }

    const { system, user } = buildExplainPrompt(
      concept,
      level,
      mode,
      previousExamples
    );
    const data = await chatJSON(system, user);

    return NextResponse.json({
      concept,
      level,
      tanim: data.tanim ?? "",
      benzetme: data.benzetme ?? "",
      ornek: data.ornek ?? "",
      nedenOnemli: data.nedenOnemli ?? "",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
