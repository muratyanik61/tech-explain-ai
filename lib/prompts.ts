/**
 * PROMPT KÜTÜPHANESİ
 * ------------------
 * Tech Explain AI'nin tüm yapay zekâ davranışı bu dosyadaki promptlarla yönetilir.
 * Promptlar tek bir yerde toplandı ki:
 *   1. Bakımı ve iyileştirmesi kolay olsun,
 *   2. README ve Prompt Logbook'ta birebir belgelenebilsin,
 *   3. Farklı seviyelere (Başlangıç/Orta/İleri) göre dinamik üretilebilsin.
 */

export type Level = "Başlangıç" | "Orta" | "İleri";
export type ExplainMode = "explain" | "simpler" | "example";

/** Her seviyenin dil tonunu ve derinliğini tanımlayan kurallar. */
const LEVEL_RULES: Record<Level, string> = {
  Başlangıç:
    "Hedef kitle: konuyu hiç bilmeyen biri. Hiçbir ön bilgi varsayma. Teknik terim kullanman gerekirse hemen parantez içinde sade Türkçe karşılığını ver. Cümleler kısa olsun.",
  Orta:
    "Hedef kitle: temel programlama/IT bilgisi olan bir öğrenci. Yaygın terimleri açıklamadan kullanabilirsin ama nadir terimleri kısaca açıkla. Biraz daha teknik detaya inebilirsin.",
  İleri:
    "Hedef kitle: konuya aşina, derinleşmek isteyen biri. Teknik dili rahat kullan, performans/ödünleşim (trade-off), uç durumlar ve gerçek dünya kullanım senaryolarına değinebilirsin.",
};

/**
 * AÇIKLAMA PROMPTU
 * Bir IT kavramını, seçilen seviyeye göre yapılandırılmış JSON olarak üretir.
 * Çıktı alanları: tanim, benzetme, ornek, nedenOnemli
 */
export function buildExplainPrompt(
  concept: string,
  level: Level,
  mode: ExplainMode,
  previousExamples: string[] = []
) {
  const modeRules: Record<ExplainMode, string> = {
    explain: "Kavramı ilk kez, dengeli bir derinlikte açıkla.",
    simpler:
      "Önceki açıklama çok karmaşık geldi. Aynı kavramı DAHA DA basit, daha kısa cümlelerle, daha günlük bir dille yeniden anlat.",
    example:
      "SADECE yeni ve özgün bir ÖRNEK üret. Tanımı yeniden yazma; 'ornek' alanına, kavramı farklı bir bağlamdan anlatan TAMAMEN YENİ bir örnek koy.",
  };

  const system = [
    "Sen 'Tech Explain AI' adlı bir bilişim eğitmenisin.",
    "Görevin: IT/bilgisayar bilimi kavramlarını Türkçe, sade ve akılda kalıcı biçimde anlatmak.",
    "Her zaman gerçek hayattan bir BENZETME ve somut bir ÖRNEK kullan; soyut tanımla yetinme.",
    "Asla satış dili kullanma, abartma, gereksiz dolgu cümle kurma. Net ve doğrudan ol.",
    "Yanlış bilgi verme; emin olmadığın bir şey varsa kavramın genel kabul gören tanımına sadık kal.",
    LEVEL_RULES[level],
  ].join(" ");

  const lines = [
    `Kavram: "${concept}"`,
    `Seviye: ${level}`,
    `Mod: ${modeRules[mode]}`,
  ];

  // example modunda, daha önce gösterilen örnekleri ver ve onlardan farklı olmasını iste.
  if (mode === "example" && previousExamples.length > 0) {
    lines.push(
      "",
      "Kullanıcıya DAHA ÖNCE şu örnekler gösterildi; ürettiğin yeni örnek bunların",
      "HİÇBİRİYLE aynı veya çok benzer OLMAMALI (farklı bir alan/bağlam/benzetme seç):",
      ...previousExamples.map((ex, i) => `${i + 1}. ${ex}`)
    );
  }

  lines.push(
    "",
    "Yanıtını SADECE aşağıdaki alanlara sahip geçerli bir JSON nesnesi olarak ver (başka metin, markdown veya ``` ekleme):",
    "{",
    '  "tanim": "1-2 cümlelik net tanım",',
    '  "benzetme": "gerçek hayattan, akılda kalıcı bir benzetme",',
    '  "ornek": "somut, mümkünse günlük hayattan veya basit kod/teknoloji örneği",',
    '  "nedenOnemli": "bu kavramı bilmek neden işe yarar, 1-2 cümle"',
    "}"
  );

  return { system, user: lines.join("\n") };
}

/**
 * QUIZ PROMPTU
 * Kavram + seviyeye göre 3 çoktan seçmeli soru üretir.
 * Çıktı: { sorular: [{ soru, secenekler[4], dogruIndex, aciklama }] }
 */
export function buildQuizPrompt(concept: string, level: Level) {
  const system = [
    "Sen 'Tech Explain AI' adlı bilişim eğitmeninin sınav modülüsün.",
    "Görevin: verilen IT kavramı için öğrenmeyi pekiştiren, Türkçe çoktan seçmeli sorular üretmek.",
    "Sorular kavrama gerçekten hâkim olunup olunmadığını ölçmeli; ezber değil anlama odaklı olmalı.",
    "Seçenekler net olmalı, sadece bir tanesi doğru olmalı, çeldiriciler mantıklı olmalı.",
    LEVEL_RULES[level],
  ].join(" ");

  const user = [
    `Kavram: "${concept}"`,
    `Seviye: ${level}`,
    "",
    "Tam 3 soru üret. Yanıtını SADECE aşağıdaki yapıda geçerli bir JSON olarak ver (başka metin ekleme):",
    "{",
    '  "sorular": [',
    "    {",
    '      "soru": "soru metni",',
    '      "secenekler": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],',
    '      "dogruIndex": 0,',
    '      "aciklama": "doğru cevabın neden doğru olduğunu açıkla"',
    "    }",
    "  ]",
    "}",
  ].join("\n");

  return { system, user };
}
