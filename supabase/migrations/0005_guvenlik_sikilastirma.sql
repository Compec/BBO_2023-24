-- Güvenlik sıkılaştırma. Tekrar çalıştırılabilir.
--   * oy_kaydet: jeton artık doğrulamalar geçtikten sonra yakılır; IP limiti paralel
--     isteklerde de tutar.
--   * jeton_uret: oylama kapalıyken jeton vermez, süresi dolan jetonları hemen siler,
--     jeton limiti paralel isteklerde de tutar.
--   * admin_deneme_kaydet: "sonuclar" uç noktası için deneme sınırı.

create or replace function public.oylama_acik_mi()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select coalesce((select (deger)::boolean from ayarlar where anahtar = 'oylama_acik'), false)
       and coalesce(now() <= (select (deger #>> '{}')::timestamptz from ayarlar where anahtar = 'oylama_bitis'), true);
$$;

revoke all on function public.oylama_acik_mi() from public, anon, authenticated;

create or replace function public.jeton_uret(p_ip_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    v_limit  int;
    v_dk     int;
    v_max_dk int;
    v_sayi   int;
    v_jeton  text;
begin
    if not oylama_acik_mi() then
        return jsonb_build_object('ok', false, 'hata', 'oylama_kapali');
    end if;

    -- Kilit olmadan paralel istekler aynı sayımı görüp limiti birlikte aşıyordu.
    perform pg_advisory_xact_lock(1, hashtext(p_ip_hash));

    select (deger)::int into v_limit  from ayarlar where anahtar = 'jeton_ip_limit';
    select (deger)::int into v_dk     from ayarlar where anahtar = 'jeton_ip_limit_dk';
    select (deger)::int into v_max_dk from ayarlar where anahtar = 'jeton_max_dakika';
    v_limit  := coalesce(v_limit, 150);
    v_dk     := coalesce(v_dk, 60);
    v_max_dk := coalesce(v_max_dk, 180);

    select count(*) into v_sayi
    from oy_jetonlari
    where ip_hash = p_ip_hash
      and olusturma > now() - (v_dk || ' minutes')::interval;

    if v_sayi >= v_limit then
        return jsonb_build_object('ok', false, 'hata', 'ip_limiti');
    end if;

    -- Süresi dolan jeton zaten kullanılamaz; 2 gün bekletmek tabloyu şişirmeye açık bırakıyordu.
    -- Limit penceresi daha uzunsa sayım bozulmasın diye ikisinin büyüğü kadar saklanır.
    delete from oy_jetonlari
     where olusturma < now() - (greatest(v_max_dk, v_dk) || ' minutes')::interval;

    v_jeton := encode(extensions.gen_random_bytes(24), 'hex');
    insert into oy_jetonlari (jeton, ip_hash) values (v_jeton, p_ip_hash);

    return jsonb_build_object('ok', true, 'jeton', v_jeton);
end;
$$;

revoke all on function public.jeton_uret(text) from public, anon, authenticated;

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
    if not oylama_acik_mi() then
        return jsonb_build_object('ok', false, 'hata', 'oylama_kapali');
    end if;

    select (deger)::int into v_min_sn from ayarlar where anahtar = 'jeton_min_saniye';
    select (deger)::int into v_max_dk from ayarlar where anahtar = 'jeton_max_dakika';
    v_min_sn := coalesce(v_min_sn, 20);
    v_max_dk := coalesce(v_max_dk, 180);

    -- Satır kilidi işlem sonuna kadar tutulur; aynı jetonla gelen ikinci istek bekler
    -- ve kilit açıldığında jetonu kullanılmış görür.
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

    if exists (select 1 from oy_pusulalari where cihaz_id = p_cihaz_id) then
        return jsonb_build_object('ok', false, 'hata', 'zaten_oy_kullanildi');
    end if;

    -- Aynı IP'den paralel pusulalar sırayla sayılır. Kilit olmadan hepsi sayımı
    -- limitin altında görüp yazılıyordu; ip_limit fiilen jeton limitine (150/saat) çıkıyordu.
    perform pg_advisory_xact_lock(2, hashtext(p_ip_hash));

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

    select count(*) into v_kategori_n from kategoriler;
    select count(*) into v_gelen_n from jsonb_object_keys(p_oylar);
    if v_gelen_n <> v_kategori_n then
        return jsonb_build_object('ok', false, 'hata', 'eksik_kategori');
    end if;

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

    -- Jeton yalnızca pusula gerçekten yazılacaksa yakılır. Önceden doğrulamalardan önce
    -- yakılıyordu; reddedilen bir deneme seçmenin jetonunu harcayıp 21 sn bekletiyordu.
    update oy_jetonlari set kullanildi = now() where jeton = v_jeton.jeton;

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

create table if not exists public.admin_denemeleri (
    ip_hash text not null,
    zaman   timestamptz not null default now()
);

create index if not exists admin_denemeleri_ip_idx on public.admin_denemeleri (ip_hash, zaman);

alter table public.admin_denemeleri enable row level security;
revoke all on public.admin_denemeleri from anon, authenticated;

-- Yönetici anahtarı denemesini kaydeder. IP başına 15 dakikada 5 denemeden sonra false döner.
-- Doğru anahtar girilince "sonuclar" fonksiyonu o IP'nin kayıtlarını siler.
create or replace function public.admin_deneme_kaydet(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    -- Aynı IP'den paralel istekler sayımı atlatamasın.
    perform pg_advisory_xact_lock(3, hashtext(p_ip_hash));

    delete from admin_denemeleri where zaman < now() - interval '15 minutes';

    if (select count(*) from admin_denemeleri where ip_hash = p_ip_hash) >= 5 then
        return false;
    end if;

    insert into admin_denemeleri (ip_hash) values (p_ip_hash);
    return true;
end;
$$;

revoke all on function public.admin_deneme_kaydet(text) from public, anon, authenticated;
