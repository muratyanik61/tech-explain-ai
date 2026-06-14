"use client";

import type { Level } from "@/lib/types";

const LEVELS: Level[] = ["Başlangıç", "Orta", "İleri"];

export default function LevelSelector({
  value,
  onChange,
}: {
  value: Level;
  onChange: (l: Level) => void;
}) {
  return (
    <div className="level-row">
      <div className="segmented" role="group" aria-label="Seviye seçimi">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            className={value === lvl ? "active" : ""}
            aria-pressed={value === lvl}
            onClick={() => onChange(lvl)}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}
