# Sensetorial

Qlik Sense eğitim dokümanlarının (PDF) kategorilere ayrılarak yayınlandığı site.
Next.js (App Router) + Supabase + Tailwind CSS 4.

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev                  # http://localhost:3000
```

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje adresi (DoganOgulturk) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (herkese açık) anahtarı |
| `NEXT_PUBLIC_SITE_URL` | Sitenin yayındaki adresi; `sitemap.xml` için gerekli |

## Veritabanı

Veritabanı Supabase'deki DoganOgulturk projesinde, başka uygulamalarla paylaşılıyor; Sensetorial'ın her şeyi
kendi şemasında: `do_sensetorial` (`categories`, `articles`, `admins`, sayaç ve yönetici fonksiyonları) ve PDF'ler
herkese açık `sensetorial-pdfs` kovasında. Tanımın tamamı `supabase/schema.sql`'de; SQL Editor'de çalıştırılır,
tekrar çalıştırmak güvenlidir. Şemanın Project Settings → Data API → **Exposed schemas** listesinde olması
gerekir, yoksa her istek `PGRST106 Invalid schema` verir.

- Ziyaretçiler tabloları yalnızca okur; görüntülenme sayacını `increment_article_views` ile artırır.
- Ekleme/güncelleme/silme yalnızca `admins` tablosundaki kullanıcılara açık.

Ekim 2026'ya kadar veritabanı ayrı bir Sensetorial Supabase projesinin `public` şemasındaydı; oradan aynı
kimliklerle taşındı.

Makaleleri Supabase Dashboard (Table Editor) üzerinden ekleyin: PDF'i `sensetorial-pdfs` kovasına yükleyip
adresini `articles.pdf_url`'e yazın. Dashboard bu kısıtlamalardan etkilenmez. `sira` alanı ana sayfadaki "Önerilen sıra" ve
makale sayfasındaki önceki/sonraki gezinme sırasını belirler.

## Görüntülenme sayıları

Her doküman açılışında `articles.views` sütunu artar (aynı oturumda bir kez). Sayılar şimdilik
ekranda gösterilmiyor; Supabase Table Editor'den bakabilirsiniz. Göstermek için
`src/lib/site.ts` içindeki `features.showViewCounts` değerini `true` yapın: kartlardaki sayılar,
"En çok okunanlar" paneli ve "En çok okunan" sıralaması geri gelir.

## PDF dosyaları

Dokümanlar PDF.js ile görüntülenir. Bunun için PDF'lerin bulunduğu sunucunun CORS izni
vermesi gerekir (Supabase Storage bunu varsayılan olarak yapar). İzin yoksa site otomatik
olarak tarayıcının kendi PDF görüntüleyicisine geri döner.

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi (tip kontrolü dahil) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript kontrolü |

## Yapı

```
src/
  app/
    page.tsx                  Ana sayfa (sunucuda render, 5 dk önbellek)
    article/[id]/page.tsx     Makale sayfası + SEO metadata
    sitemap.ts, robots.ts
  components/
    home/ArticleBrowser.tsx   Arama, kategori filtresi, sıralama (URL ile senkron)
    SearchDialog.tsx          ⌘K ile açılan genel arama
  app/article/[id]/components/
    PdfReader.tsx             PDF.js görüntüleyici (iframe'e geri dönüşlü)
  lib/
    categories.ts             Kategori renk/ikon/açıklamaları (tek kaynak)
    history.ts                "Kaldığınız yerden devam" için okuma geçmişi (tarayıcıda)
    supabase.ts               Veri erişim fonksiyonları
    search.ts                 Türkçe karakter duyarsız arama
supabase/schema.sql           Veritabanı tanımı
```

Yeni bir kategori eklerseniz renk ve ikonunu `src/lib/categories.ts` içine ekleyin;
eklemezseniz gri varsayılan stil kullanılır.
