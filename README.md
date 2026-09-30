# Sensetorial

Qlik Sense eğitim dokümanlarının (PDF) kategorilere ayrılarak yayınlandığı site.
Next.js (App Router) + Supabase + Tailwind CSS.

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev                  # http://localhost:3000
```

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje adresi |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) anahtarı |
| `NEXT_PUBLIC_SITE_URL` | Sitenin yayındaki adresi; `sitemap.xml` için gerekli |

## Veritabanı

1. Yeni kurulumda `supabase-setup.sql` dosyasını Supabase SQL Editor'de çalıştırın.
2. Ardından `supabase/migrations/` altındaki dosyaları sırayla çalıştırın
   (mevcut veritabanında yalnızca bunlar yeterlidir). Bu migration:
   - görüntülenme sayacı için `increment_article_views` fonksiyonunu ekler,
   - ekleme/güncelleme/silme yetkisini `admins` tablosundaki kullanıcılarla sınırlar.

Makaleleri Supabase Dashboard (Table Editor) üzerinden eklemeye devam edebilirsiniz;
Dashboard bu kısıtlamalardan etkilenmez. `sira` alanı ana sayfadaki "Önerilen sıra" ve
makale sayfasındaki önceki/sonraki gezinme sırasını belirler.

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
  lib/
    categories.ts             Kategori renk/ikon/açıklamaları (tek kaynak)
    supabase.ts               Veri erişim fonksiyonları
    search.ts                 Türkçe karakter duyarsız arama
supabase/migrations/          Veritabanı güncellemeleri
```

Yeni bir kategori eklerseniz renk ve ikonunu `src/lib/categories.ts` içine ekleyin;
eklemezseniz gri varsayılan stil kullanılır.
