"use client";

import { useEffect, useState } from "react";
import LevelSelector from "@/components/LevelSelector";
import ExplanationCard from "@/components/ExplanationCard";
import LearnedList from "@/components/LearnedList";
import Quiz from "@/components/Quiz";
import type {
  Explanation,
  LearnedRecord,
  Level,
  QuizQuestion,
} from "@/lib/types";

type View = "home" | "explain" | "quiz";
type ExplainMode = "explain" | "simpler" | "example";

const LOADING_MESSAGES = {
  simpler: "Daha sade bir anlatım hazırlanıyor...",
  example: "Yeni bir örnek oluşturuluyor...",
  explain: "Açıklama hazırlanıyor...",
} as const;

// v2: artık sadece kavram adlarını değil, her kavramın TAM açıklamasını saklıyoruz.
const STORAGE_KEY = "tea_learned_v2";

function conceptKey(name: string) {
  return name.trim().toLowerCase();
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [concept, setConcept] = useState("");
  const [level, setLevel] = useState<Level>("Başlangıç");

  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");

  const [learned, setLearned] = useState<LearnedRecord[]>([]);

  // Öğrenilen kavramları (tam açıklamalarıyla) yerel depodan yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Yalnızca geçerli kayıtları al (eski/bozuk veriyi ele)
        setLearned(
          parsed.filter(
            (r): r is LearnedRecord =>
              r && typeof r.concept === "string" && typeof r.tanim === "string"
          )
        );
      }
    } catch {
      /* yok say */
    }
  }, []);

  // Bir kavramın tam açıklamasını önbelleğe yaz (varsa güncelle, en başa al)
  function saveLearned(exp: Explanation) {
    setLearned((prev) => {
      const key = conceptKey(exp.concept);
      const without = prev.filter((r) => conceptKey(r.concept) !== key);
      const next = [{ ...exp }, ...without];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* yok say */
      }
      return next;
    });
  }

  async function explain(topic: string, mode: ExplainMode = "explain") {
    const q = topic.trim();
    if (!q) return;
    setError("");
    setLoading(true);
    setLoadingMsg(LOADING_MESSAGES[mode]);
    if (mode === "explain") setView("explain");

    // example modunda: o ana kadar gösterilen tüm örnekleri gönder ki yeni örnek farklı olsun
    const previousExamples =
      mode === "example" && explanation
        ? [explanation.ornek, ...(explanation.extraExamples ?? [])].filter(
            Boolean
          )
        : [];

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: q, level, mode, previousExamples }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Açıklama alınamadı.");

      let nextExp: Explanation;
      if (mode === "example" && explanation) {
        // Mevcut içeriği koru; sadece yeni örneği en alta ekle (Örnek 2, 3...)
        const newExample = (data?.ornek ?? "").toString().trim();
        if (!newExample) throw new Error("Yeni örnek üretilemedi, tekrar deneyin.");
        nextExp = {
          ...explanation,
          extraExamples: [...(explanation.extraExamples ?? []), newExample],
        };
      } else {
        // explain / simpler: açıklamayı (sıfırdan) ayarla
        nextExp = { ...(data as Explanation), extraExamples: [] };
      }

      setExplanation(nextExp);
      setConcept(q);
      saveLearned(nextExp);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu.");
      if (mode === "explain") setView("home");
    } finally {
      setLoading(false);
    }
  }

  // Listeden tıklanan kavramı ÖNBELLEKTEN aç — yeni API çağrısı yapılmaz
  function openCached(record: LearnedRecord) {
    setError("");
    setConcept(record.concept);
    setLevel(record.level);
    setExplanation({ ...record, extraExamples: record.extraExamples ?? [] });
    setQuestions([]);
    setView("explain");
  }

  async function startQuiz() {
    if (!explanation) return;
    setError("");
    setLoading(true);
    setLoadingMsg("Quiz soruları üretiliyor...");
    setView("quiz");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: explanation.concept, level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Quiz oluşturulamadı.");
      const qs: QuizQuestion[] = Array.isArray(data.sorular) ? data.sorular : [];
      if (qs.length === 0) throw new Error("Soru üretilemedi, tekrar deneyin.");
      setQuestions(qs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu.");
      setView("explain");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setView("home");
    setExplanation(null);
    setQuestions([]);
    setError("");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand" onClick={reset}>
          <div className="brand-mark">&lt;/&gt;</div>
          <div className="brand-name">
            Tech<span>Explain</span> AI
          </div>
        </div>
        <div className="progress-badge" title="Bu tarayıcıda öğrendiğin kavram sayısı">
          Öğrenilen: <b>{learned.length}</b>
        </div>
      </header>

      {view === "home" && (
        <section className="hero fade-in">
          <div className="eyebrow">// karmaşadan netliğe</div>
          <h1>
            IT kavramlarını <span className="hl">seviyene göre</span> sade
            Türkçe öğren.
          </h1>
          <p className="lead">
            Önce seviyeni seç, sonra kavramı yaz; gerçek hayattan bir benzetme,
            somut bir örnek ve kısa bir quiz ile dakikalar içinde anla.
          </p>

          <div className="card ask-card">
            {/* Adım 1 — Seviye */}
            <div className="step">
              <span className="step-num">1</span>
              <label className="field-label" id="level-label">
                Seviyeni seç
              </label>
            </div>
            <LevelSelector value={level} onChange={setLevel} />

            {/* Adım 2 — Kavram */}
            <div className="step step-mt">
              <span className="step-num">2</span>
              <label className="field-label" htmlFor="concept">
                Kavramı yaz
              </label>
            </div>
            <input
              id="concept"
              className="concept-input"
              placeholder="Ör: API nedir, garbage collection, TCP/IP..."
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && explain(concept)}
            />

            <button
              className="btn btn-primary btn-block"
              onClick={() => explain(concept)}
              disabled={!concept.trim() || loading}
            >
              Açıkla
            </button>

            {error && (
              <div className="error-box">
                {error}
                {error.includes("OPENAI_API_KEY") && (
                  <>
                    {" "}
                    <code>.env.local</code> dosyani kontrol et.
                  </>
                )}
              </div>
            )}
          </div>

          <LearnedList items={learned} onOpen={openCached} />
        </section>
      )}

      {view === "explain" && (
        <section>
          <button className="back-link" onClick={reset}>
            &larr; Yeni kavram
          </button>
          <div className="result-head">
            <h2>{concept}</h2>
            <span className="level-tag">{level}</span>
          </div>

          {/* Tam ekran spinner yalnızca ilk açıklama beklenirken (içerik yokken) */}
          {loading && !explanation && (
            <div className="card loading">
              <div className="spinner" />
              {loadingMsg}
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          {/* Açıklama varsa kart her zaman görünür; "başka örnek" eklenirken
              sayfa yenilenmez, kart yerinde kalır, butonlar pasifleşir. */}
          {explanation && (
            <ExplanationCard
              data={explanation}
              busy={loading}
              pendingMessage={loading ? loadingMsg : undefined}
              onSimpler={() => explain(concept, "simpler")}
              onExample={() => explain(concept, "example")}
              onQuiz={startQuiz}
            />
          )}
        </section>
      )}

      {view === "quiz" && (
        <section>
          <button className="back-link" onClick={() => setView("explain")}>
            &larr; Açıklamaya dön
          </button>
          <div className="result-head">
            <h2>Quiz: {concept}</h2>
            <span className="level-tag">{level}</span>
          </div>

          {loading && (
            <div className="card loading">
              <div className="spinner" />
              {loadingMsg}
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          {!loading && questions.length > 0 && (
            <Quiz
              questions={questions}
              onDone={() => explanation && saveLearned(explanation)}
              onRestart={reset}
            />
          )}
        </section>
      )}

      <footer className="footer">
        OpenAI API ile güçlendirilmiştir &middot; <code>Tech Explain AI</code>
      </footer>
    </div>
  );
}
