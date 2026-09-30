-- Mevcut veritabanı için güncelleme.
-- Supabase Dashboard > SQL Editor'de bir kez çalıştırın. Tekrar çalıştırmak güvenlidir.

-- 1. Görüntülenme sayacı ------------------------------------------------------
UPDATE articles SET views = 0 WHERE views IS NULL;
ALTER TABLE articles ALTER COLUMN views SET NOT NULL;

-- Ziyaretçiler tabloya doğrudan yazamaz; yalnızca bu fonksiyonla sayacı 1 artırabilir.
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE articles SET views = views + 1 WHERE id = article_id;
$$;

REVOKE ALL ON FUNCTION public.increment_article_views(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_article_views(uuid) TO anon, authenticated;

-- 2. Yazma yetkisini yöneticilerle sınırla ------------------------------------
-- Önceden giriş yapmış HER kullanıcı makale ekleyip silebiliyordu. Supabase'de kayıt
-- (sign-up) açıksa bu, herkesin içeriği değiştirebilmesi anlamına geliyordu.
-- Not: Supabase Dashboard (Table Editor) service role ile çalışır ve RLS'ten etkilenmez.

CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Politika yok: admins tablosunu yalnızca Dashboard/service role okuyup yazabilir.
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert articles" ON articles;
DROP POLICY IF EXISTS "Admins can update articles" ON articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON articles;

CREATE POLICY "Admins can insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert articles" ON articles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update articles" ON articles FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete articles" ON articles FOR DELETE TO authenticated USING (public.is_admin());

-- Kendinizi yönetici yapmak için (kullanıcı id'si: Authentication > Users):
-- INSERT INTO public.admins (user_id) VALUES ('<kullanici-uuid>');
