-- ══════════════════════════════════════════════════════════
-- OYLAMA BİTİŞ TARİHİ — SUNUCU TARAFI
-- ══════════════════════════════════════════════════════════
-- Site, oylamayı site-config.js'teki tarihe göre gizler; ancak API açık
-- kaldığı sürece uç noktaya doğrudan istek atılabilir. Bu ayar sayesinde
-- oylama, kimse elle bir şey yapmasa bile tam zamanında sunucu tarafında
-- da kapanır.
--
-- Değer Türkiye saati (UTC+3) olarak yazılır.
-- site-config.js içindeki oylamaBitis ile aynı tutulmalıdır.
-- ══════════════════════════════════════════════════════════

insert into public.ayarlar (anahtar, deger)
values ('oylama_bitis', '"2026-12-03T23:59:59+03:00"'::jsonb)
on conflict (anahtar) do update set deger = excluded.deger;

-- oy_kaydet: 1. adıma bitiş tarihi kontrolü eklendi.
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
    v_bitis      timestamptz;
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
    -- 1) Oylama açık mı? (elle anahtar + bitiş tarihi)
    select (deger)::boolean into v_acik from ayarlar where anahtar = 'oylama_acik';
    if coalesce(v_acik, false) is not true then
        return jsonb_build_object('ok', false, 'hata', 'oylama_kapali');
    end if;

    select (deger #>> '{}')::timestamptz into v_bitis from ayarlar where anahtar = 'oylama_bitis';
    if v_bitis is not null and now() > v_bitis then
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
