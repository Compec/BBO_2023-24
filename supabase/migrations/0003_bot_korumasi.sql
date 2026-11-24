-- ══════════════════════════════════════════════════════════
-- BOT KORUMASI: TEK KULLANIMLIK OY JETONU + YETKİ SIKILAŞTIRMA
-- ══════════════════════════════════════════════════════════
-- Oy göndermeden önce "oy-baslat" uç noktasından bir jeton alınır.
-- Jeton; aynı IP'ye bağlıdır, tek kullanımlıktır ve oy gönderilirken
-- en az 20 saniye "beklemiş" olmalıdır. Böylece tek bir HTTP isteğiyle
-- toplu oy basmak mümkün değildir.
-- ══════════════════════════════════════════════════════════

create table if not exists public.oy_jetonlari (
    jeton      text primary key,
    ip_hash    text not null,
    olusturma  timestamptz not null default now(),
    kullanildi timestamptz
);

create index if not exists oy_jetonlari_ip_idx on public.oy_jetonlari (ip_hash, olusturma desc);
create index if not exists oy_jetonlari_temizlik_idx on public.oy_jetonlari (olusturma);

alter table public.oy_jetonlari enable row level security;
-- politika yok: anon erişemez, service_role baypas eder

insert into public.ayarlar (anahtar, deger) values
    ('jeton_min_saniye',   '20'::jsonb),   -- formun en az bu kadar sürede doldurulması beklenir
    ('jeton_max_dakika',   '180'::jsonb),  -- jetonun geçerlilik süresi
    ('jeton_ip_limit',     '150'::jsonb),  -- saatte bir IP'ye verilecek azami jeton
    ('jeton_ip_limit_dk',  '60'::jsonb)
on conflict (anahtar) do nothing;

-- IP limiti bilerek yüksek: kampüs WiFi / mobil operatör NAT'ı yüzlerce kişiyi
-- tek IP'nin arkasına koyar. Asıl mükerrer oy engeli cihaz tekliğidir.
update public.ayarlar set deger = '30'::jsonb where anahtar = 'ip_limit';

-- ── Jeton üretimi ───────────────────────────────────────────
create or replace function public.jeton_uret(p_ip_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    v_limit int;
    v_dk    int;
    v_sayi  int;
    v_jeton text;
begin
    select (deger)::int into v_limit from ayarlar where anahtar = 'jeton_ip_limit';
    select (deger)::int into v_dk    from ayarlar where anahtar = 'jeton_ip_limit_dk';
    v_limit := coalesce(v_limit, 150);
    v_dk    := coalesce(v_dk, 60);

    select count(*) into v_sayi
    from oy_jetonlari
    where ip_hash = p_ip_hash
      and olusturma > now() - (v_dk || ' minutes')::interval;

    if v_sayi >= v_limit then
        return jsonb_build_object('ok', false, 'hata', 'ip_limiti');
    end if;

    delete from oy_jetonlari where olusturma < now() - interval '2 days';

    v_jeton := encode(extensions.gen_random_bytes(24), 'hex');
    insert into oy_jetonlari (jeton, ip_hash) values (v_jeton, p_ip_hash);

    return jsonb_build_object('ok', true, 'jeton', v_jeton);
end;
$$;

revoke all on function public.jeton_uret(text) from public, anon, authenticated;

-- ── Oy kaydetme (jeton doğrulamalı) ─────────────────────────
drop function if exists public.oy_kaydet(text, text, text, text, jsonb);

create or replace function public.oy_kaydet(
    p_cihaz_id   text,
    p_ip_hash    text,
    p_user_agent text,
    p_ekran      text,
    p_oylar      jsonb,
    p_jeton      text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_acik       boolean;
    v_ip_limit   int;
    v_ip_saat    int;
    v_ip_sayisi  int;
    v_kategori_n int;
    v_gelen_n    int;
    v_pusula_id  uuid;
    v_eksik      text;
    v_min_sn     int;
    v_max_dk     int;
    v_jeton      record;
begin
    -- 1) Oylama açık mı?
    select (deger)::boolean into v_acik from ayarlar where anahtar = 'oylama_acik';
    if coalesce(v_acik, false) is not true then
        return jsonb_build_object('ok', false, 'hata', 'oylama_kapali');
    end if;

    -- 2) Jeton geçerli mi? (satırı kilitleyerek tek kullanımı garanti et)
    select (deger)::int into v_min_sn from ayarlar where anahtar = 'jeton_min_saniye';
    select (deger)::int into v_max_dk from ayarlar where anahtar = 'jeton_max_dakika';
    v_min_sn := coalesce(v_min_sn, 20);
    v_max_dk := coalesce(v_max_dk, 180);

    select * into v_jeton from oy_jetonlari
     where jeton = coalesce(p_jeton, '')
     for update;

    if v_jeton is null then
        return jsonb_build_object('ok', false, 'hata', 'gecersiz_jeton');
    end if;
    if v_jeton.kullanildi is not null then
        return jsonb_build_object('ok', false, 'hata', 'jeton_kullanilmis');
    end if;
    if v_jeton.ip_hash <> p_ip_hash then
        return jsonb_build_object('ok', false, 'hata', 'gecersiz_jeton');
    end if;
    if v_jeton.olusturma > now() - (v_min_sn || ' seconds')::interval then
        return jsonb_build_object('ok', false, 'hata', 'cok_hizli');
    end if;
    if v_jeton.olusturma < now() - (v_max_dk || ' minutes')::interval then
        return jsonb_build_object('ok', false, 'hata', 'jeton_suresi_doldu');
    end if;

    update oy_jetonlari set kullanildi = now() where jeton = v_jeton.jeton;

    -- 3) Bu cihaz daha önce oy kullandı mı?
    if exists (select 1 from oy_pusulalari where cihaz_id = p_cihaz_id) then
        return jsonb_build_object('ok', false, 'hata', 'zaten_oy_kullanildi');
    end if;

    -- 4) IP başına hız sınırı
    select (deger)::int into v_ip_limit from ayarlar where anahtar = 'ip_limit';
    select (deger)::int into v_ip_saat  from ayarlar where anahtar = 'ip_limit_saat';
    v_ip_limit := coalesce(v_ip_limit, 30);
    v_ip_saat  := coalesce(v_ip_saat, 24);

    select count(*) into v_ip_sayisi
    from oy_pusulalari
    where ip_hash = p_ip_hash
      and olusturma > now() - (v_ip_saat || ' hours')::interval;

    if v_ip_sayisi >= v_ip_limit then
        return jsonb_build_object('ok', false, 'hata', 'ip_limiti');
    end if;

    -- 5) Bütün kategorilere oy verilmiş mi?
    select count(*) into v_kategori_n from kategoriler;
    select count(*) into v_gelen_n from jsonb_object_keys(p_oylar);
    if v_gelen_n <> v_kategori_n then
        return jsonb_build_object('ok', false, 'hata', 'eksik_kategori');
    end if;

    -- 6) Her aday iddia edilen kategoriye ait mi?
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

    -- 7) Yaz
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
        return jsonb_build_object('ok', false, 'hata', 'zaten_oy_kullanildi');
end;
$$;

revoke all on function public.oy_kaydet(text, text, text, text, jsonb, text) from public, anon, authenticated;

-- ══════════════════════════════════════════════════════════
-- YETKİ SIKILAŞTIRMA (derinlemesine savunma)
-- RLS'e ek olarak tablo yetkilerini de kaldır; ileride yanlışlıkla bir
-- RLS politikası eklense bile oy verisi sızmaz.
-- ══════════════════════════════════════════════════════════
revoke all on public.oylar         from anon, authenticated;
revoke all on public.oy_pusulalari from anon, authenticated;
revoke all on public.oy_jetonlari  from anon, authenticated;
revoke all on public.ayarlar       from anon, authenticated;
revoke all on public.sonuclar      from anon, authenticated;
revoke all on public.oylama_ozeti  from anon, authenticated;

-- Site yalnızca bu ikisini okur:
grant select on public.kategoriler to anon, authenticated;
grant select on public.adaylar     to anon, authenticated;

-- Oylamayı aç
update public.ayarlar set deger = 'true'::jsonb where anahtar = 'oylama_acik';
