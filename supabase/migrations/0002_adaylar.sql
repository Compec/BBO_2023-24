-- ══════════════════════════════════════════════════════════
-- COMPEC BİLİŞİM ÖDÜLLERİ 2026 — KATEGORİ VE ADAY VERİSİ
-- Bu dosya adaylar-data.js dosyasından üretilmiştir.
-- Yeniden çalıştırılabilir: var olan kayıtları günceller.
-- ══════════════════════════════════════════════════════════

insert into public.kategoriler (slug, ad, sira) values
    ('marka', 'Sosyal Medyayı En İyi Kullanan Marka', 0),
    ('e-ticaret', 'En İyi E-Ticaret Uygulaması', 1),
    ('dijital-medya', 'En İyi Dijital Medya ve Menajerlik', 2),
    ('mobil-bankacilik', 'En İyi Mobil Bankacılık Uygulaması', 3),
    ('mobil-oyun', 'En İyi Mobil Oyun', 4),
    ('yilin-oyunu', 'Yılın En İyi Oyunu', 5),
    ('oyun-icerik', 'En İyi Oyun İçerik Üreticisi', 6),
    ('podcast', 'En İyi Podcast Serisi', 7),
    ('youtube', 'En İyi YouTube İçerik Üreticisi', 8),
    ('sosyal-medya', 'En İyi Sosyal Medya İçerik Üreticisi', 9),
    ('talk-show', 'En İyi Dijital Talk Show', 10),
    ('yapay-zeka', 'En İyi Yapay Zeka Girişimi', 11),
    ('online-yayinci', 'En İyi Online Yayıncı', 12),
    ('teknoloji', 'En İyi Teknoloji İçerik Üreticisi', 13),
    ('siber-guvenlik', 'En İyi Siber Güvenlik Şirketi', 14)
on conflict (slug) do update set ad = excluded.ad, sira = excluded.sira;

-- Sosyal Medyayı En İyi Kullanan Marka
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('zuber', 'Züber', 'assets/aday2026/marka/zuber.jpg', 0),
    ('duolingo', 'Duolingo', 'assets/aday2026/marka/duolingo.jpg', 1),
    ('superfresh', 'Superfresh', 'assets/aday2026/marka/superfresh.png', 2),
    ('indomie', 'Indomie', 'assets/aday2026/marka/indomie.png', 3),
    ('flying-tiger-copenhagen', 'Flying Tiger Copenhagen', 'assets/aday2026/marka/flying-tiger-copenhagen.png', 4)
) as v(slug, ad, gorsel, sira)
where k.slug = 'marka'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi E-Ticaret Uygulaması
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('hepsiburada', 'Hepsiburada', 'assets/aday2026/e-ticaret/hepsiburada.png', 0),
    ('sahibinden', 'Sahibinden', 'assets/aday2026/e-ticaret/sahibinden.png', 1),
    ('pazarama', 'Pazarama', 'assets/aday2026/e-ticaret/pazarama.jpg', 2)
) as v(slug, ad, gorsel, sira)
where k.slug = 'e-ticaret'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Dijital Medya ve Menajerlik
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('tem-network', 'TEM Network', 'assets/aday2026/dijital-medya/tem-network.png', 0),
    ('viralif', 'Viralif', 'assets/aday2026/dijital-medya/viralif.png', 1),
    ('key-people-and-project', 'Key People and Project', 'assets/aday2026/dijital-medya/key-people-and-project.jpg', 2),
    ('hypers', 'Hypers', 'assets/aday2026/dijital-medya/hypers.png', 3),
    ('lychee', 'Lychee', 'assets/aday2026/dijital-medya/lychee.jpg', 4),
    ('influera', 'Influera', 'assets/aday2026/dijital-medya/influera.jpg', 5)
) as v(slug, ad, gorsel, sira)
where k.slug = 'dijital-medya'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Mobil Bankacılık Uygulaması
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('akbank', 'Akbank', 'assets/aday2026/mobil-bankacilik/akbank.jpg', 0),
    ('garanti-bbva', 'Garanti BBVA', 'assets/aday2026/mobil-bankacilik/garanti-bbva.jpg', 1),
    ('yapi-kredi', 'Yapı Kredi', 'assets/aday2026/mobil-bankacilik/yapi-kredi.jpg', 2)
) as v(slug, ad, gorsel, sira)
where k.slug = 'mobil-bankacilik'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Mobil Oyun
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('raid-rush', 'Raid Rush', 'assets/aday2026/mobil-oyun/raid-rush.png', 0),
    ('tc-simulasyonu', 'TC Simülasyonu', 'assets/aday2026/mobil-oyun/tc-simulasyonu.jpg', 1),
    ('arcane-arena', 'Arcane Arena', 'assets/aday2026/mobil-oyun/arcane-arena.png', 2)
) as v(slug, ad, gorsel, sira)
where k.slug = 'mobil-oyun'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- Yılın En İyi Oyunu
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('celestial-return', 'Celestial Return', 'assets/aday2026/yilin-oyunu/celestial-return.jpg', 0),
    ('harvest-king', 'Harvest King', 'assets/aday2026/yilin-oyunu/harvest-king.jpg', 1),
    ('iron-blight', 'Iron Blight', 'assets/aday2026/yilin-oyunu/iron-blight.png', 2),
    ('lost-in-art-a-miniature-realm', 'Lost in Art: A Miniature Realm', 'assets/aday2026/yilin-oyunu/lost-in-art-a-miniature-realm.png', 3),
    ('this-is-fine-maximum-cope', 'This is Fine: Maximum Cope', 'assets/aday2026/yilin-oyunu/this-is-fine-maximum-cope.jpg', 4),
    ('bombanana', 'Bombanana', 'assets/aday2026/yilin-oyunu/bombanana.jpg', 5)
) as v(slug, ad, gorsel, sira)
where k.slug = 'yilin-oyunu'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Oyun İçerik Üreticisi
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('disket-kutusu', 'Disket Kutusu', 'assets/aday2026/oyun-icerik/disket-kutusu.jpg', 0),
    ('konsol-oyun', 'Konsol Oyun', 'assets/aday2026/oyun-icerik/konsol-oyun.jpg', 1),
    ('combatry', 'CombatRY', 'assets/aday2026/oyun-icerik/combatry.jpg', 2),
    ('atacan-ilkin-tansel', 'Atacan İlkin Tansel', 'assets/aday2026/oyun-icerik/atacan-ilkin-tansel.jpg', 3),
    ('tunca-arslan', 'Tunca Arslan', 'assets/aday2026/oyun-icerik/tunca-arslan.jpg', 4),
    ('bufuak', 'Bufuak', 'assets/aday2026/oyun-icerik/bufuak.jpg', 5),
    ('marcus7z', 'Marcus7z', 'assets/aday2026/oyun-icerik/marcus7z.jpg', 6)
) as v(slug, ad, gorsel, sira)
where k.slug = 'oyun-icerik'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Podcast Serisi
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('haddini-asan-yasam-rehberi', 'Haddini Aşan Yaşam Rehberi', 'assets/aday2026/podcast/haddini-asan-yasam-rehberi.jpg', 0),
    ('ortamda-satilacak-bilgi', 'Ortamda Satılacak Bilgi', 'assets/aday2026/podcast/ortamda-satilacak-bilgi.jpg', 1),
    ('sapien-podcast', 'Sapien Podcast', 'assets/aday2026/podcast/sapien-podcast.png', 2),
    ('kendine-iyi-davran', 'Kendine İyi Davran', 'assets/aday2026/podcast/kendine-iyi-davran.png', 3),
    ('yemekte-bile-yemek-konusuruz', 'Yemekte Bile Yemek Konuşuruz', 'assets/aday2026/podcast/yemekte-bile-yemek-konusuruz.jpg', 4)
) as v(slug, ad, gorsel, sira)
where k.slug = 'podcast'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi YouTube İçerik Üreticisi
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('49w', '49W', 'assets/aday2026/youtube/49w.jpg', 0),
    ('ben-gitmek-istiyorum', 'Ben Gitmek İstiyorum', 'assets/aday2026/youtube/ben-gitmek-istiyorum.jpg', 1),
    ('burak-akturk', 'Burak Aktürk', 'assets/aday2026/youtube/burak-akturk.jpg', 2),
    ('dft-tarih', 'DFT Tarih', 'assets/aday2026/youtube/dft-tarih.png', 3),
    ('atakan-ve-cemile', 'Atakan ve Cemile', 'assets/aday2026/youtube/atakan-ve-cemile.jpg', 4),
    ('soguk-savas', 'Soğuk Savaş', 'assets/aday2026/youtube/soguk-savas.png', 5)
) as v(slug, ad, gorsel, sira)
where k.slug = 'youtube'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Sosyal Medya İçerik Üreticisi
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('havva-hacifazlioglu', 'Havva Hacıfazlıoğlu', 'assets/aday2026/sosyal-medya/havva-hacifazlioglu.jpg', 0),
    ('bilge-ozsar', 'Bilge Özşar', 'assets/aday2026/sosyal-medya/bilge-ozsar.jpg', 1),
    ('umut-metin', 'Umut Metin', 'assets/aday2026/sosyal-medya/umut-metin.jpg', 2),
    ('ata-tekiner', 'Ata Tekiner', 'assets/aday2026/sosyal-medya/ata-tekiner.jpg', 3),
    ('ece-cetinoz', 'Ece Çetinöz', 'assets/aday2026/sosyal-medya/ece-cetinoz.jpg', 4),
    ('ipek-ersan', 'İpek Ersan', 'assets/aday2026/sosyal-medya/ipek-ersan.jpg', 5),
    ('siradan-hareket', 'Sıradan Hareket', 'assets/aday2026/sosyal-medya/siradan-hareket.jpg', 6),
    ('nil-in-izleri', 'Nil''in İzleri', 'assets/aday2026/sosyal-medya/nil-in-izleri.jpg', 7),
    ('yunus-canpolat', 'Yunus Canpolat', 'assets/aday2026/sosyal-medya/yunus-canpolat.jpg', 8)
) as v(slug, ad, gorsel, sira)
where k.slug = 'sosyal-medya'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Dijital Talk Show
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('berfu-yenenler-ile-talk-show-perileri', 'Berfu Yenenler ile Talk Show Perileri', 'assets/aday2026/talk-show/berfu-yenenler-ile-talk-show-perileri.jpg', 0),
    ('hayrettin-ile-kaos-show', 'Hayrettin ile Kaos Show', 'assets/aday2026/talk-show/hayrettin-ile-kaos-show.jpg', 1),
    ('melis-isiten-ile-zaten-sov', 'Melis İşiten ile Zaten Şov', 'assets/aday2026/talk-show/melis-isiten-ile-zaten-sov.png', 2),
    ('tiras-show', 'Tıraş Show', 'assets/aday2026/talk-show/tiras-show.jpg', 3),
    ('ibrahim-selim-ile-bu-gece', 'İbrahim Selim ile Bu Gece', 'assets/aday2026/talk-show/ibrahim-selim-ile-bu-gece.jpg', 4)
) as v(slug, ad, gorsel, sira)
where k.slug = 'talk-show'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Yapay Zeka Girişimi
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('vispera', 'Vispera', 'assets/aday2026/yapay-zeka/vispera.png', 0),
    ('virasoft', 'Virasoft', 'assets/aday2026/yapay-zeka/virasoft.jpg', 1),
    ('mindra', 'Mindra', 'assets/aday2026/yapay-zeka/mindra.jpg', 2),
    ('madlen', 'Madlen', 'assets/aday2026/yapay-zeka/madlen.png', 3)
) as v(slug, ad, gorsel, sira)
where k.slug = 'yapay-zeka'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Online Yayıncı
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('tssigalko', 'Tssigalko', 'assets/aday2026/online-yayinci/tssigalko.jpg', 0),
    ('kaanflix', 'Kaanflix', 'assets/aday2026/online-yayinci/kaanflix.jpg', 1),
    ('hasan-arda-kasikci', 'Hasan Arda Kaşıkçı', 'assets/aday2026/online-yayinci/hasan-arda-kasikci.jpg', 2),
    ('yagmur-dilaveroglu-blush', 'Yağmur Dilaveroğlu (Blush)', 'assets/aday2026/online-yayinci/yagmur-dilaveroglu-blush.jpg', 3),
    ('roseheuss-begum', 'Roseheuss Begüm', 'assets/aday2026/online-yayinci/roseheuss-begum.jpg', 4),
    ('prenses-perver', 'Prenses Perver', 'assets/aday2026/online-yayinci/prenses-perver.jpg', 5),
    ('gokhan-oner', 'Gökhan Öner', 'assets/aday2026/online-yayinci/gokhan-oner.jpg', 6)
) as v(slug, ad, gorsel, sira)
where k.slug = 'online-yayinci'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Teknoloji İçerik Üreticisi
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('ada-buyuk', 'Ada Büyük', 'assets/aday2026/teknoloji/ada-buyuk.jpg', 0),
    ('ahmet-emre-sakarya', 'Ahmet Emre Sakarya', 'assets/aday2026/teknoloji/ahmet-emre-sakarya.jpg', 1),
    ('selman-bozkir', 'Selman Bozkır', 'assets/aday2026/teknoloji/selman-bozkir.jpg', 2),
    ('mert-bayantemur', 'Mert Bayantemur', 'assets/aday2026/teknoloji/mert-bayantemur.jpg', 3),
    ('mehmet-uzum', 'Mehmet Üzüm', 'assets/aday2026/teknoloji/mehmet-uzum.jpg', 4),
    ('sahan-oztekin', 'Şahan Öztekin', 'assets/aday2026/teknoloji/sahan-oztekin.jpg', 5),
    ('mendebur-lemur', 'Mendebur Lemur', 'assets/aday2026/teknoloji/mendebur-lemur.jpg', 6),
    ('samet-jankovic', 'Samet Jankoviç', 'assets/aday2026/teknoloji/samet-jankovic.jpg', 7)
) as v(slug, ad, gorsel, sira)
where k.slug = 'teknoloji'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;

-- En İyi Siber Güvenlik Şirketi
insert into public.adaylar (kategori_id, slug, ad, gorsel, sira)
select k.id, v.slug, v.ad, v.gorsel, v.sira
from public.kategoriler k, (values
    ('picus-security', 'Picus Security', 'assets/aday2026/siber-guvenlik/picus-security.png', 0),
    ('cyberwise', 'Cyberwise', 'assets/aday2026/siber-guvenlik/cyberwise.png', 1),
    ('kaspersky', 'Kaspersky', 'assets/aday2026/siber-guvenlik/kaspersky.jpg', 2)
) as v(slug, ad, gorsel, sira)
where k.slug = 'siber-guvenlik'
on conflict (kategori_id, slug) do update
    set ad = excluded.ad, gorsel = excluded.gorsel, sira = excluded.sira;
