-- ══════════════════════════════════════════════════════════
-- COMPEC BİLİŞİM ÖDÜLLERİ — OYLAMA ŞEMASI
-- ══════════════════════════════════════════════════════════
-- Tasarım notu:
--  * Tarayıcıdan hiçbir tabloya doğrudan yazılmaz. Bütün yazma işlemleri
--    "oy-ver" Edge Function'ı üzerinden, service_role anahtarıyla yapılır.
--  * Anon (publishable) anahtarla yalnızca kategoriler ve adaylar okunabilir.
--  * Sonuçlar oylama sürerken herkese açık DEĞİLDİR; "sonuclar" Edge
--    Function'ı admin anahtarı ister.
-- ══════════════════════════════════════════════════════════

-- ── Kategoriler ─────────────────────────────────────────────
create table if not exists public.kategoriler (
    id    smallint generated always as identity primary key,
    slug  text not null unique,
    ad    text not null,
    sira  smallint not null default 0
);

-- ── Adaylar ─────────────────────────────────────────────────
create table if not exists public.adaylar (
    id          integer generated always as identity primary key,
    kategori_id smallint not null references public.kategoriler(id) on delete cascade,
    slug        text not null,
    ad          text not null,
    gorsel      text,
    sira        smallint not null default 0,
    unique (kategori_id, slug)
);

create index if not exists adaylar_kategori_idx on public.adaylar (kategori_id, sira);

-- ── Oy pusulaları (bir kullanıcının tek seferde verdiği oyların tamamı) ──
create table if not exists public.oy_pusulalari (
    id          uuid primary key default gen_random_uuid(),
    cihaz_id    text not null,
    ip_hash     text not null,
    user_agent  text,
    ekran       text,
    olusturma   timestamptz not null default now()
);

-- Bir cihaz yalnızca bir kez oy kullanabilir.
create unique index if not exists oy_pusulalari_cihaz_uniq on public.oy_pusulalari (cihaz_id);
-- IP başına hız sınırı sorguları için.
create index if not exists oy_pusulalari_ip_idx on public.oy_pusulalari (ip_hash, olusturma desc);

-- ── Tek tek oylar ───────────────────────────────────────────
create table if not exists public.oylar (
    pusula_id   uuid not null references public.oy_pusulalari(id) on delete cascade,
    kategori_id smallint not null references public.kategoriler(id) on delete cascade,
    aday_id     integer not null references public.adaylar(id) on delete cascade,
    primary key (pusula_id, kategori_id)
);

create index if not exists oylar_aday_idx on public.oylar (aday_id);

-- ── Ayarlar (oylama açık mı, IP limiti kaç) ─────────────────
create table if not exists public.ayarlar (
    anahtar text primary key,
    deger   jsonb not null
);

insert into public.ayarlar (anahtar, deger) values
    ('oylama_acik',      'true'::jsonb),
    ('ip_limit',         '5'::jsonb),
    ('ip_limit_saat',    '24'::jsonb)
on conflict (anahtar) do nothing;

-- ══════════════════════════════════════════════════════════
-- RLS
-- ══════════════════════════════════════════════════════════
alter table public.kategoriler   enable row level security;
alter table public.adaylar       enable row level security;
alter table public.oy_pusulalari enable row level security;
alter table public.oylar         enable row level security;
alter table public.ayarlar       enable row level security;

-- Kategoriler ve adaylar herkese açık okunur (site bunları gösteriyor zaten).
drop policy if exists kategoriler_okuma on public.kategoriler;
create policy kategoriler_okuma on public.kategoriler
    for select to anon, authenticated using (true);

drop policy if exists adaylar_okuma on public.adaylar;
create policy adaylar_okuma on public.adaylar
    for select to anon, authenticated using (true);

-- oy_pusulalari, oylar ve ayarlar için hiçbir politika tanımlanmadı:
-- RLS açık + politika yok = anon/authenticated hiçbir şey yapamaz.
-- service_role RLS'i baypas ettiği için Edge Function çalışmaya devam eder.

-- ══════════════════════════════════════════════════════════
-- OY KAYDETME
-- Doğrulamaların tamamı burada, tek bir işlemde (atomik) yapılır.
-- ══════════════════════════════════════════════════════════
create or replace function public.oy_kaydet(
    p_cihaz_id   text,
    p_ip_hash    text,
    p_user_agent text,
    p_ekran      text,
    p_oylar      jsonb      -- {"kategori-slug": "aday-slug", ...}
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_acik        boolean;
    v_ip_limit    int;
    v_ip_saat     int;
    v_ip_sayisi   int;
    v_kategori_n  int;
    v_gelen_n     int;
    v_pusula_id   uuid;
    v_eksik       text;
begin
    -- 1) Oylama açık mı?
    select (deger)::boolean into v_acik from ayarlar where anahtar = 'oylama_acik';
    if coalesce(v_acik, false) is not true then
        return jsonb_build_object('ok', false, 'hata', 'oylama_kapali');
    end if;

    -- 2) Bu cihaz daha önce oy kullandı mı?
    if exists (select 1 from oy_pusulalari where cihaz_id = p_cihaz_id) then
        return jsonb_build_object('ok', false, 'hata', 'zaten_oy_kullanildi');
    end if;

    -- 3) IP başına hız sınırı
    select (deger)::int into v_ip_limit from ayarlar where anahtar = 'ip_limit';
    select (deger)::int into v_ip_saat  from ayarlar where anahtar = 'ip_limit_saat';
    v_ip_limit := coalesce(v_ip_limit, 5);
    v_ip_saat  := coalesce(v_ip_saat, 24);

    select count(*) into v_ip_sayisi
    from oy_pusulalari
    where ip_hash = p_ip_hash
      and olusturma > now() - (v_ip_saat || ' hours')::interval;

    if v_ip_sayisi >= v_ip_limit then
        return jsonb_build_object('ok', false, 'hata', 'ip_limiti');
    end if;

    -- 4) Bütün kategorilere oy verilmiş mi?
    select count(*) into v_kategori_n from kategoriler;
    select count(*) into v_gelen_n from jsonb_object_keys(p_oylar);
    if v_gelen_n <> v_kategori_n then
        return jsonb_build_object('ok', false, 'hata', 'eksik_kategori');
    end if;

    -- 5) Gönderilen her aday, iddia edilen kategoriye ait mi?
    select k.slug into v_eksik
    from kategoriler k
    where not exists (
        select 1 from adaylar a
        where a.kategori_id = k.id
          and a.slug = (p_oylar ->> k.slug)
    )
    limit 1;

    if v_eksik is not null then
        return jsonb_build_object('ok', false, 'hata', 'gecersiz_aday', 'kategori', v_eksik);
    end if;

    -- 6) Pusulayı ve oyları yaz
    insert into oy_pusulalari (cihaz_id, ip_hash, user_agent, ekran)
    values (p_cihaz_id, p_ip_hash, left(coalesce(p_user_agent, ''), 400), left(coalesce(p_ekran, ''), 40))
    returning id into v_pusula_id;

    insert into oylar (pusula_id, kategori_id, aday_id)
    select v_pusula_id, k.id, a.id
    from kategoriler k
    join adaylar a on a.kategori_id = k.id and a.slug = (p_oylar ->> k.slug);

    return jsonb_build_object('ok', true, 'pusula_id', v_pusula_id);

exception
    when unique_violation then
        -- Aynı cihazdan eş zamanlı iki istek geldiyse
        return jsonb_build_object('ok', false, 'hata', 'zaten_oy_kullanildi');
end;
$$;

revoke all on function public.oy_kaydet(text, text, text, text, jsonb) from public, anon, authenticated;

-- ══════════════════════════════════════════════════════════
-- SONUÇLAR (yalnızca service_role okur — "sonuclar" Edge Function'ı üzerinden)
-- ══════════════════════════════════════════════════════════
create or replace view public.sonuclar
with (security_invoker = true) as
select
    k.sira                              as kategori_sira,
    k.slug                              as kategori_slug,
    k.ad                                as kategori,
    a.slug                              as aday_slug,
    a.ad                                as aday,
    count(o.pusula_id)                  as oy,
    round(100.0 * count(o.pusula_id) /
          nullif(sum(count(o.pusula_id)) over (partition by k.id), 0), 2) as yuzde
from public.kategoriler k
join public.adaylar a on a.kategori_id = k.id
left join public.oylar o on o.aday_id = a.id
group by k.id, k.sira, k.slug, k.ad, a.id, a.slug, a.ad
order by k.sira, oy desc;

revoke all on public.sonuclar from anon, authenticated;

create or replace view public.oylama_ozeti
with (security_invoker = true) as
select
    (select count(*) from public.oy_pusulalari)                  as toplam_pusula,
    (select count(*) from public.oylar)                          as toplam_oy,
    (select count(distinct ip_hash) from public.oy_pusulalari)   as farkli_ip,
    (select max(olusturma) from public.oy_pusulalari)            as son_oy;

revoke all on public.oylama_ozeti from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon;

-- ══════════════════════════════════════════════════════════
-- GİZLİ DEĞERLER
-- IP tuzu veritabanında üretilir ve orada kalır; elle secret tanımlamaya
-- gerek yoktur. Yönetici anahtarının yalnızca SHA-256 özeti saklanır.
-- ══════════════════════════════════════════════════════════
create extension if not exists pgcrypto with schema extensions;

insert into public.ayarlar (anahtar, deger)
values ('ip_tuzu', to_jsonb(encode(extensions.gen_random_bytes(32), 'hex')))
on conflict (anahtar) do nothing;

insert into public.ayarlar (anahtar, deger)
values ('admin_anahtar_hash', '""'::jsonb)
on conflict (anahtar) do nothing;

-- Yönetici anahtarını belirlemek/değiştirmek için:
--     select public.admin_anahtari_belirle('yeni-parola');
create or replace function public.admin_anahtari_belirle(p_anahtar text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
    if length(p_anahtar) < 12 then
        return 'anahtar en az 12 karakter olmali';
    end if;
    update ayarlar
       set deger = to_jsonb(encode(extensions.digest(p_anahtar, 'sha256'), 'hex'))
     where anahtar = 'admin_anahtar_hash';
    return 'tamam';
end;
$$;

revoke all on function public.admin_anahtari_belirle(text) from public, anon, authenticated;
