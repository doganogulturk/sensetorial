-- Sensetorial'ın tabloları, fonksiyonları ve PDF kovası. Veritabanı DoganOgulturk Supabase projesinde,
-- başka uygulamalarla paylaşılıyor; bu yüzden her şey kendi şemasında (do_sensetorial) duruyor.
-- İstemci bu şemaya bağlanır; şemanın Dashboard'da Project Settings → Data API → Exposed schemas
-- listesinde olması gerekir, yoksa her istek PGRST106 Invalid schema verir.
--
-- Supabase, public'te kurulan her nesneye anon ve authenticated için otomatik yetki verir; bu şemada öyle bir
-- varsayılan yoktur. Tarayıcının erişebildiği her şey aşağıda açıkça izin verilerek açılır.
--
-- Yapı, eski Sensetorial projesindeki public şemasının birebir karşılığı (Ekim 2026'da taşındı; eski
-- supabase-setup.sql ve supabase/migrations/ bu dosyada birleşti). Tek fark kimlik varsayılanı:
-- uuid_generate_v4() (uuid-ossp eklentisi) yerine yerleşik gen_random_uuid().
--
-- Dosya idempotent: boş bir veritabanında sıfırdan kurar, kurulu olanda tekrar çalıştırılabilir.
create schema if not exists do_sensetorial;
grant usage on schema do_sensetorial to anon, authenticated, service_role;

-- ── Tablolar ────────────────────────────────────────────────────────────────────────────────

create table if not exists do_sensetorial.categories (
  id          uuid not null default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz default timezone('utc'::text, now()),
  constraint categories_pkey primary key (id),
  constraint categories_name_key unique (name)
);

create table if not exists do_sensetorial.articles (
  id           uuid not null default gen_random_uuid(),
  title        text not null,
  pdf_url      text not null,
  created_at   timestamptz default timezone('utc'::text, now()),
  views        integer not null default 0,
  category_id  uuid,
  sira         integer,
  constraint articles_pkey primary key (id),
  constraint fk_category foreign key (category_id) references do_sensetorial.categories (id)
);

-- Yazma yetkisi olan kullanıcılar. Siteden giriş yapılamıyor; içerik Supabase panelinden yönetiliyor
-- (panel RLS'e takılmaz). Tabloya hiçbir politika yok: yalnızca is_admin() okuyor.
create table if not exists do_sensetorial.admins (
  user_id     uuid not null,
  created_at  timestamptz default now(),
  constraint admins_pkey primary key (user_id),
  constraint admins_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

alter table do_sensetorial.categories enable row level security;
alter table do_sensetorial.articles enable row level security;
alter table do_sensetorial.admins enable row level security;

-- ── Fonksiyonlar ────────────────────────────────────────────────────────────────────────────
-- Gövdeler eski projedekilerin aynısı; yalnızca tablo adları şemayla yazıldı ve search_path boşaltıldı
-- (eskiden 'public'ti, burada o şemada aranacak bir şey yok). Politikalardan önce durmalılar.

-- Oturumdaki kullanıcı admins'te mi. security definer: admins'i okuyabilsin diye (tabloda politika yok).
create or replace function do_sensetorial.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from do_sensetorial.admins where user_id = auth.uid());
$$;

-- Görüntülenme sayacı: makale sayfası her açılışta çağırıyor (src/lib/supabase.ts → incrementArticleViews).
-- security definer: ziyaretçinin tabloya yazma yetkisi yok, yalnızca bu fonksiyonla sayacı 1 artırabiliyor.
create or replace function do_sensetorial.increment_article_views(article_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update do_sensetorial.articles set views = views + 1 where id = article_id;
$$;

-- Eski projedeki hâliyle bozuk: parametrenin adı id ama gövde article_id kullanıyor, çağrılınca hata veriyor.
-- Site çağırmıyor; aynısı korunsun diye taşındı. Sayaç gerekirse increment_article_views kullanılmalı.
create or replace function do_sensetorial.increment_views(id uuid)
returns void
language plpgsql
as $$
begin
  update do_sensetorial.articles
  set views = coalesce(views, 0) + 1
  where id = article_id;
end;
$$;

-- ── Politikalar ─────────────────────────────────────────────────────────────────────────────

drop policy if exists "Enable read access for all users on articles" on do_sensetorial.articles;
create policy "Enable read access for all users on articles" on do_sensetorial.articles
  for select to public using (true);

drop policy if exists "Admins can insert articles" on do_sensetorial.articles;
create policy "Admins can insert articles" on do_sensetorial.articles
  for insert to authenticated with check (do_sensetorial.is_admin());

drop policy if exists "Admins can update articles" on do_sensetorial.articles;
create policy "Admins can update articles" on do_sensetorial.articles
  for update to authenticated using (do_sensetorial.is_admin());

drop policy if exists "Admins can delete articles" on do_sensetorial.articles;
create policy "Admins can delete articles" on do_sensetorial.articles
  for delete to authenticated using (do_sensetorial.is_admin());

drop policy if exists "Enable read access for all users on categories" on do_sensetorial.categories;
create policy "Enable read access for all users on categories" on do_sensetorial.categories
  for select to public using (true);

drop policy if exists "Admins can insert categories" on do_sensetorial.categories;
create policy "Admins can insert categories" on do_sensetorial.categories
  for insert to authenticated with check (do_sensetorial.is_admin());

drop policy if exists "Admins can update categories" on do_sensetorial.categories;
create policy "Admins can update categories" on do_sensetorial.categories
  for update to authenticated using (do_sensetorial.is_admin());

drop policy if exists "Admins can delete categories" on do_sensetorial.categories;
create policy "Admins can delete categories" on do_sensetorial.categories
  for delete to authenticated using (do_sensetorial.is_admin());

-- ── Yetkiler ────────────────────────────────────────────────────────────────────────────────
-- Eski projede public'in varsayılan yetkileri geçerliydi; buradakiler aynı sonucu veriyor: herkes okuyabilir,
-- giriş yapmış kullanıcı yazmayı deneyebilir ama yalnızca yöneticiyse politikadan geçer. admins'e tarayıcıdan
-- erişim yok (eskiden yetki vardı ama politika olmadığı için yine hiçbir satır görünmüyordu).
revoke all on do_sensetorial.categories, do_sensetorial.articles, do_sensetorial.admins from anon, authenticated;
grant select on do_sensetorial.categories, do_sensetorial.articles to anon, authenticated;
grant insert, update, delete on do_sensetorial.categories, do_sensetorial.articles to authenticated;

-- Fonksiyonlar eskiden olduğu gibi herkese açık; sayaç yalnızca anon ve authenticated'a.
revoke all on function do_sensetorial.increment_article_views(uuid) from public;
grant execute on function do_sensetorial.is_admin() to anon, authenticated;
grant execute on function do_sensetorial.increment_article_views(uuid) to anon, authenticated;
grant execute on function do_sensetorial.increment_views(uuid) to anon, authenticated;

-- ── PDF kovası ──────────────────────────────────────────────────────────────────────────────
-- Herkese açık: PDF'ler /storage/v1/object/public/sensetorial-pdfs/... adresinden politikaya bakılmadan
-- sunuluyor; makale sayfası articles.pdf_url'deki bu adresi iframe'de açıyor. Kova politikası yok, dosyalar
-- panelden yükleniyor. Ad, aynı projedeki diğer uygulamaların kovalarıyla karışmasın diye ön ekli.
insert into storage.buckets (id, name, public)
values ('sensetorial-pdfs', 'sensetorial-pdfs', true)
on conflict (id) do update set public = true;

-- ── Sunucu tarafı ───────────────────────────────────────────────────────────────────────────
-- service_role RLS'ye takılmaz ama tablo yetkisine yine de ihtiyaç duyar (taşıma betiği bununla yazar).
grant all on all tables in schema do_sensetorial to service_role;
grant all on all sequences in schema do_sensetorial to service_role;
grant execute on all functions in schema do_sensetorial to service_role;

notify pgrst, 'reload schema';
