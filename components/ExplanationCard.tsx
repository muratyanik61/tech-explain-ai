"use client";

import type { Explanation } from "@/lib/types";

export default function ExplanationCard({
  data,
  busy,
  pendingMessage,
  onSimpler,
  onExample,
  onQuiz,
}: {
  data: Explanation;
  busy: boolean;
  pendingMessage?: string;
  onSimpler: () => void;
  onExample: () => void;
  onQuiz: () => void;
}) {
  const extras = data.extraExamples ?? [];
  const hasExtras = extras.length > 0;
  // Başlangıç seviyesinde zaten en sade hali anlatılıyor; daha basitleştirilemez.
  const isBeginner = data.level === "Başlangıç";
  const simplerTip = isBeginner
    ? "Bundan daha sade anlatırsam çizgi filme döner 🙂"
    : undefined;

  return (
    <div className="fade-in">
      <div className="section card">
        <div className="s-label">Tanım</div>
        <p>{data.tanim}</p>
      </div>

      <div className="section card analogy">
        <span className="bulb" aria-hidden="true">
          &#128161;
        </span>
        <div className="s-label">Benzetme</div>
        <p>{data.benzetme}</p>
      </div>

      <div className="section card">
        <div className="s-label">{hasExtras ? "Örnek 1" : "Örnek"}</div>
        <p>{data.ornek}</p>
      </div>

      {extras.map((ex, i) => (
        <div className="section card" key={i}>
          <div className="s-label">Örnek {i + 2}</div>
          <p>{ex}</p>
        </div>
      ))}

      <div className="section card">
        <div className="s-label">Neden önemli?</div>
        <p>{data.nedenOnemli}</p>
      </div>

      {busy && pendingMessage && (
        <div className="card loading inline-pending">
          <div className="spinner" />
          {pendingMessage}
        </div>
      )}

      <div className="followups">
        <span className="tooltip-wrap" data-tip={simplerTip}>
          <button
            className="btn btn-ghost"
            onClick={onSimpler}
            disabled={busy || isBeginner}
          >
            Daha basit anlat
          </button>
        </span>
        <button className="btn btn-ghost" onClick={onExample} disabled={busy}>
          Başka örnek ver
        </button>
        <button className="btn btn-accent" onClick={onQuiz} disabled={busy}>
          Quiz çöz &rarr;
        </button>
      </div>
    </div>
  );
}
