"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

export default function Quiz({
  questions,
  onDone,
  onRestart,
}: {
  questions: QuizQuestion[];
  onDone: (score: number, total: number) => void;
  onRestart: () => void;
}) {
  // Her soru için seçilen seçeneğin indeksi (null = cevaplanmadı)
  const [answers, setAnswers] = useState<(number | null)[]>(
    questions.map(() => null)
  );
  const [finished, setFinished] = useState(false);

  function pick(qIndex: number, optIndex: number) {
    if (answers[qIndex] !== null) return; // tekrar cevaplama yok
    const next = [...answers];
    next[qIndex] = optIndex;
    setAnswers(next);
  }

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.reduce<number>(
    (acc, a, i) => acc + (a === questions[i].dogruIndex ? 1 : 0),
    0
  );

  function finish() {
    setFinished(true);
    onDone(score, questions.length);
  }

  if (finished) {
    return (
      <div className="fade-in">
        <div className="card score-card">
          <div className="score-num">
            {score}/{questions.length}
          </div>
          <div className="score-sub">
            {score === questions.length
              ? "Mükemmel! Bu kavrama hâkimsin."
              : score === 0
              ? "Sorun değil — açıklamalara tekrar göz at, pekişecek."
              : "İyi gidiyorsun, gelişime açık birkaç nokta var."}
          </div>
        </div>
        <button className="btn btn-primary btn-block" onClick={onRestart}>
          Yeni bir kavram öğren
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {questions.map((q, qi) => {
        const chosen = answers[qi];
        const answered = chosen !== null;
        return (
          <div className="card quiz-q" key={qi}>
            <div className="q-num">Soru {qi + 1}</div>
            <div className="q-text">{q.soru}</div>
            <div className="options">
              {q.secenekler.map((opt, oi) => {
                let cls = "option";
                if (answered) {
                  if (oi === q.dogruIndex) cls += " correct";
                  else if (oi === chosen) cls += " wrong";
                }
                return (
                  <button
                    key={oi}
                    className={cls}
                    disabled={answered}
                    onClick={() => pick(qi, oi)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="answer-note">
                <b>
                  {chosen === q.dogruIndex
                    ? "Doğru. "
                    : "Doğru cevap işaretli. "}
                </b>
                {q.aciklama}
              </div>
            )}
          </div>
        );
      })}

      <button
        className="btn btn-primary btn-block"
        onClick={finish}
        disabled={!allAnswered}
      >
        {allAnswered ? "Sonucu gör" : "Tüm soruları cevapla"}
      </button>
    </div>
  );
}
