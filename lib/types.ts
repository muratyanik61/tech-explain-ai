import type { Level } from "@/lib/prompts";

export type { Level };

export interface Explanation {
  concept: string;
  level: Level;
  tanim: string;
  benzetme: string;
  ornek: string;
  nedenOnemli: string;
  /** "Başka örnek ver" ile sonradan eklenen ek örnekler (Örnek 2, Örnek 3...). */
  extraExamples?: string[];
}

/**
 * localStorage'da saklanan öğrenilen kavram kaydı.
 * Kavramın TAM açıklama verisini tutar; böylece listeden tekrar açıldığında
 * yeni bir API çağrısı yapmadan önbellekten gösterilebilir.
 */
export type LearnedRecord = Explanation;

export interface QuizQuestion {
  soru: string;
  secenekler: string[];
  dogruIndex: number;
  aciklama: string;
}
