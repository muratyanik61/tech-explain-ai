# Prompt Logbook — Tech Explain AI

Bu dosya, projede kullanılan en önemli promptları ve prompt iyileştirme sürecini belgeler. İki bölümden oluşur: (A) uygulamanın çalışırken kullandığı **ürün promptları**, (B) projeyi Claude Code ile geliştirirken kullanılan **geliştirme promptları**.

---

## A. Ürün Promptları (uygulamanın çekirdeği)

Bu promptların tam ve güncel hali kodda yaşar: [`lib/prompts.ts`](lib/prompts.ts). Aşağıda mantıkları ve iyileştirme süreçleri açıklanmıştır.

### A.1 — Açıklama promptu

**Amaç:** Bir IT kavramını seçilen seviyeye göre yapılandırılmış (JSON) biçimde anlatmak.

**Sistem promptunun özü:**
- Role: "Tech Explain AI adlı bir bilişim eğitmeni."
- Her zaman bir **benzetme** ve somut bir **örnek** kullan; soyut tanımla yetinme.
- Satış dili / abartı / dolgu cümle yok.
- Seçilen seviyenin diline uy (Başlangıç / Orta / İleri için ayrı kurallar).

**İyileştirme süreci:**
| Sürüm | Sorun | Çözüm |
|-------|-------|-------|
| v1 | Düz paragraf dönüyordu, arayüzde düzenli gösterilemiyordu | Çıktı **JSON** formatına (`tanim`, `benzetme`, `ornek`, `nedenOnemli`) zorlandı |
| v2 | "Başlangıç" seviyesinde bile jargon kullanıyordu | Seviye bazlı kurallar eklendi; terim geçince parantezde Türkçe karşılık istendi |
| v3 | Bazen markdown/```json sarmalıyordu, parse hatası veriyordu | `response_format: json_object` + "başka metin ekleme" talimatı |

### A.2 — "Daha basit anlat" / "Başka örnek ver" modları

Aynı açıklama promptu üç modda çalışır:
- `explain`: dengeli ilk anlatım.
- `simpler`: "Önceki açıklama karmaşık geldi, daha kısa ve gündelik dille yeniden anlat." (Başlangıç seviyesinde bu mod arayüzde kapalıdır; zaten en sade hâl anlatılır.)
- `example`: "Tanımı yeniden yazma; sadece YENİ bir örnek üret." Bu modda istemci, o ana kadar gösterilen tüm örnekleri `previousExamples` olarak gönderir; prompt yeni örneğin **bunların hiçbiriyle aynı/benzer olmamasını** ister. Dönen yanıttan yalnızca `ornek` alanı alınır ve açıklamanın en altına "Örnek 2", "Örnek 3" şeklinde **eklenir** (mevcut içerik değişmez).

**İyileştirme notu (`example`):** İlk sürümde "başka örnek ver" tüm açıklamayı yeniden yazıyor ve bazen aynı örneği tekrar üretiyordu. Çözüm: (1) önceki örnekleri prompt'a verip "farklı bir bağlam seç" talimatı eklemek, (2) yalnızca yeni örneği mevcut açıklamaya eklemek.

Bu, kullanıcının tek bir kavramı kendi temposunda netleştirmesini sağlar.

### A.3 — Quiz promptu

**Amaç:** Kavram + seviyeye göre 3 çoktan seçmeli soru üretmek.

**İyileştirme notları:**
- İlk sürüm bazen 2 veya 4 soru üretiyordu → "tam 3 soru" talimatı netleştirildi.
- Ezber soruları geliyordu → "ezber değil **anlama** ölçen sorular" vurgusu eklendi.
- Çeldiriciler bariz yanlıştı → "mantıklı çeldiriciler, sadece bir doğru" kuralı eklendi.
- Çıktı `{ sorular: [{ soru, secenekler[4], dogruIndex, aciklama }] }` JSON yapısına bağlandı.

---

## B. Geliştirme Promptları (Claude Code ile)

Uygulama Claude Code ile geliştirildi. Süreçte kullanılan temsili promptlar:

**Mimari kurulum:**
> "Next.js 14 App Router + TypeScript ile bir proje kur. OpenAI API anahtarı yalnızca sunucu tarafında kalmalı; bunun için bir API route kullan, anahtarı `.env.local`'dan oku ve `.gitignore`'a ekle."

**Tasarım:**
> "Klişe AI tasarımlarından kaçın. 'Karmaşadan netliğe' temasıyla derin indigo + 'aha anı' için amber vurgu kullan. Display fontu Space Grotesk, gövde Inter, kod etiketleri için JetBrains Mono. Benzetme kartını 'aydınlanma' imza ögesi olarak amber vurguyla öne çıkar."

**Bileşen üretimi:**
> "Quiz bileşeni yaz: 3 soruyu göstersin, kullanıcı bir seçeneği işaretleyince doğru/yanlış renklensin ve açıklama görünsün, sonunda puanı göstersin. Tekrar cevaplama engellensin."

**Sağlamlaştırma:**
> "API anahtarı tanımlı değilse uygulama çökmesin; kullanıcıya `.env.local` dosyasını kontrol etmesini söyleyen anlaşılır bir hata göster."

---

## Not
Tüm promptlar geliştirici tarafından yönlendirilmiş ve iyileştirilmiştir. Yapay zekâ destekleyici bir üretim aracı olarak kullanılmıştır.
