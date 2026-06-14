# Tech Explain AI

> IT ve bilgisayar bilimi kavramlarını **seviyene göre**, **sade Türkçe** ve **gerçek hayattan benzetmelerle** anlatan; öğrendiğini **mini quiz** ile pekiştiren yapay zekâ destekli öğrenme uygulaması.

![durum](https://img.shields.io/badge/durum-çalışır-2ea44f) ![stack](https://img.shields.io/badge/Next.js-14-black) ![ai](https://img.shields.io/badge/OpenAI-API-412991)

---

## 1. Proje Özeti

**Problem.** Kaliteli IT öğrenme kaynaklarının büyük kısmı İngilizce ve yoğun jargonla yazılmıştır. Başlangıç seviyesindeki bir öğrenci "API", "DNS" veya "recursion" gibi bir kavramı aradığında, seviyesinin çok üzerinde, dağınık ve teknik bir bilgi yığınıyla karşılaşır. Bu da öğrenmeyi yavaşlatır ve motivasyonu düşürür.

**Çözüm.** Tech Explain AI, kullanıcının yazdığı herhangi bir IT kavramını seçtiği seviyeye (Başlangıç / Orta / İleri) göre Türkçe açıklar. Kullanıcı **önce seviyesini seçer (adım 1), sonra kavramı yazar (adım 2)**. Her açıklama bir **tanım**, gerçek hayattan bir **benzetme**, somut bir **örnek** ve "**neden önemli?**" bölümünden oluşur. Kullanıcı "daha basit anlat" ile anlatımı sadeleştirebilir (en alt seviye olan Başlangıç'ta bu buton kapalıdır, çünkü zaten en sade hâli anlatılır); "başka örnek ver" dediğinde ise mevcut açıklama korunur ve **sayfanın altına "Örnek 2", "Örnek 3" şeklinde yeni örnekler eklenir** — her yeni örnek öncekilerden farklı üretilir. Açılan her kavram **tam açıklamasıyla tarayıcıda önbelleğe alınır**; ana sayfadaki "Öğrendiklerin" listesinden tek tıkla, **yeni bir API çağrısı yapılmadan** yeniden açılabilir. Son olarak 3 soruluk bir **quiz** ile öğrenilen pekiştirilir.

**Hedef kullanıcı kitlesi.** Meslek yüksekokulu ve üniversite öğrencileri, yazılıma yeni başlayanlar, kariyer değiştirenler ve bootcamp öğrencileri.

**Değer önerisi.** Sözlük/Wikipedia'dan farkı: (1) anlatım **seviyeye uyarlanır**, (2) her kavram **akılda kalıcı bir benzetmeye** bağlanır, (3) okumak yetmez — **aktif hatırlama (quiz)** ile bilgi pekişir.

---

## 2. Kullanılan AI Araçları

Projede yapay zekânın **nerede** kullanıldığı aşağıda açıkça belirtilmiştir:

| Aşama | Araç | Kullanım amacı |
|-------|------|----------------|
| **Uygulama çekirdeği** | OpenAI API (`gpt-4o-mini`) | Kavram açıklaması ve quiz sorularının çalışma anında üretilmesi |
| **Geliştirme** | Claude Code | Proje iskeleti, React bileşenleri, API route'ları ve stillerin yazılması |
| **Konsept / metin** | LLM | Problem tanımı, kullanıcı akışı ve ürün konseptinin netleştirilmesi |

> Yapay zekâ, **destekleyici üretim aracı** olarak kullanılmıştır. Promptlar ve tasarım kararları geliştirici tarafından yönlendirilmiş; üretilen kodun ne işe yaradığı [`lib/prompts.ts`](lib/prompts.ts) ve bu dokümanda açıklanmıştır.

---

## 3. Prompt Kütüphanesi

Uygulamanın tüm AI davranışı tek bir dosyada toplanmıştır: [`lib/prompts.ts`](lib/prompts.ts). Süreçte kullanılan en başarılı promptlar ve geliştirme promptları [`PROMPTS.md`](PROMPTS.md) (Prompt Logbook) dosyasında belgelenmiştir.

**Örnek — açıklama promptu (özet):** Model bir "bilişim eğitmeni" rolüne sokulur; her zaman bir benzetme ve somut örnek vermesi, satış dili kullanmaması ve seçilen seviyenin diline uyması istenir. Çıktı, arayüzde tutarlı render edilebilmesi için **JSON** formatında (`tanim`, `benzetme`, `ornek`, `nedenOnemli`) döndürülür.

**Örnek — quiz promptu (özet):** Verilen kavram ve seviye için ezber değil **anlama** ölçen 3 çoktan seçmeli soru; tek doğru cevap, mantıklı çeldiriciler ve her sorunun açıklaması, yine JSON olarak istenir.

Promptların tam metni ve seviye bazlı kuralları için bkz. [`lib/prompts.ts`](lib/prompts.ts).

---

## 4. Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18.17+ (LTS önerilir)
- Bir OpenAI API anahtarı — https://platform.openai.com/api-keys

### Adımlar

```bash
# 1) Bağımlılıkları kur
npm install

# 2) Ortam dosyasını oluştur ve anahtarını gir
cp .env.example .env.local
# .env.local içine OPENAI_API_KEY=sk-... değerini yaz

# 3) Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda **http://localhost:3000** adresini aç.

### Üretim derlemesi (opsiyonel)
```bash
npm run build
npm run start
```

> **Önemli:** API anahtarın `.env.local` dosyasında saklanır ve bu dosya `.gitignore` ile **GitHub'a yüklenmez**. Anahtar yalnızca sunucu tarafında okunur, tarayıcıya asla gönderilmez.

---

## 5. Gelecek Vizyonu

- **Öğrenme yolları:** "Web Geliştirme Temelleri", "Ağ Teknolojileri" gibi sıralı kavram setleri ve ilerleme takibi.
- **Aralıklı tekrar (spaced repetition):** Zayıf kalınan kavramları doğru zamanda tekrar önererek kalıcı öğrenme.
- **Sesli anlatım:** Açıklamaların metinden sese dönüştürülüp dinlenebilmesi.
- **Kişiselleştirme:** Kullanıcının quiz performansına göre seviyenin otomatik ayarlanması.
- **Kullanıcı hesapları:** İlerlemenin cihazlar arası senkronizasyonu (şu an öğrenilen kavramlar tam açıklamalarıyla `localStorage`'da yerel olarak tutuluyor).
- **Ölçeklenebilirlik:** Açılan kavramlar zaten istemci tarafında önbelleğe alınıp tekrar açılışta API çağrısı yapılmıyor; bir sonraki adım sunucu tarafında paylaşımlı önbellek ile maliyeti daha da düşürmek.

---

## Proje Yapısı

```
tech-explain-ai/
├── app/
│   ├── api/
│   │   ├── explain/route.ts   # Açıklama üreten API uç noktası
│   │   └── quiz/route.ts      # Quiz üreten API uç noktası
│   ├── globals.css            # Tasarım sistemi (renk, tipografi, bileşen stilleri)
│   ├── layout.tsx             # Kök layout + fontlar
│   └── page.tsx               # Ana akış (giriş → açıklama → quiz)
├── components/
│   ├── LevelSelector.tsx      # Seviye seçici (adım 1)
│   ├── ExplanationCard.tsx    # Açıklama kartı (eklenen örnekleri de render eder)
│   ├── LearnedList.tsx        # "Öğrendiklerin" — önbellekteki kavram listesi
│   └── Quiz.tsx               # Quiz ve puanlama
├── lib/
│   ├── openai.ts              # OpenAI istemcisi (anahtar sunucuda kalır)
│   ├── prompts.ts             # PROMPT KÜTÜPHANESİ
│   └── types.ts               # Ortak tipler
├── .env.example               # Ortam değişkeni şablonu
├── .gitignore                 # .env.local burada — anahtar korunur
└── README.md
```

## Teknoloji Yığını
Next.js 14 (App Router), React 18, TypeScript, OpenAI Node SDK. Stiller bağımlılık eklemeden saf CSS ve CSS değişkenleriyle yazılmıştır.

## Akademik Etik
- Tüm promptlar belgelenmiştir (`lib/prompts.ts`, `PROMPTS.md`).
- API anahtarları `.env.local` + `.gitignore` ile korunur, depoya yüklenmez.
- Yapay zekâ destekleyici araç olarak kullanılmış; kodun yapısı, tasarım kararları ve mimari geliştirici tarafından yönlendirilmiştir.
