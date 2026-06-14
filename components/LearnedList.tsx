"use client";

import type { LearnedRecord } from "@/lib/types";

export default function LearnedList({
  items,
  onOpen,
}: {
  items: LearnedRecord[];
  onOpen: (record: LearnedRecord) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section className="learned" aria-label="Öğrendiklerin">
      <div className="learned-head">
        <h3>Öğrendiklerin</h3>
        <span className="learned-count">{items.length}</span>
      </div>

      <div className="learned-grid">
        {items.map((r) => (
          <button
            key={r.concept.toLowerCase()}
            type="button"
            className="learned-item"
            onClick={() => onOpen(r)}
            title={`${r.concept} — önbellekten aç (yeni istek yok)`}
          >
            <span className="learned-top">
              <span className="learned-name">{r.concept}</span>
              <span className="learned-level">{r.level}</span>
            </span>
            {r.tanim && <span className="learned-snippet">{r.tanim}</span>}
          </button>
        ))}
      </div>

      <p className="learned-hint">
        Bir karta tıkla; açıklama yeni bir API çağrısı yapmadan önbellekten açılır.
      </p>
    </section>
  );
}
