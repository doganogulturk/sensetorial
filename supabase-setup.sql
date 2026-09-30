-- Supabase Database Setup Script
-- Bu scripti Supabase Dashboard > SQL Editor'de çalıştırın

-- 1. Categories tablosu oluştur
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Articles tablosu oluştur
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  sira INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index'ler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_sira ON articles(sira);

-- 4. Kategorileri ekle
INSERT INTO categories (name) VALUES
  ('Fonksiyonlar'),
  ('Konular'),
  ('Nasıl Yapılır'),
  ('Görseller')
ON CONFLICT (name) DO NOTHING;

-- 5. Örnek makaleler ekle (isteğe bağlı - kendi PDF URL'lerinizi ekleyin)
-- Aşağıdaki örnekleri kendi PDF URL'lerinizle değiştirin

-- Örnek kullanım:
-- INSERT INTO articles (title, pdf_url, category_id, sira)
-- VALUES (
--   'Örnek Makale Başlığı',
--   'https://your-pdf-url.com/file.pdf',
--   (SELECT id FROM categories WHERE name = 'Fonksiyonlar'),
--   1
-- );

-- Row Level Security (RLS) ayarları
-- Herkes okuyabilir; yazma yetkileri migration dosyasında yöneticilerle sınırlandırılır
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Herkes kategorileri okuyabilir
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Herkes makaleleri okuyabilir
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

-- Yazma yetkileri, görüntülenme sayacı ve yönetici tablosu:
-- supabase/migrations/20260930000000_views_and_admin_rls.sql dosyasını da çalıştırın.
