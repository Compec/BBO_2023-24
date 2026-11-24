// ══════════════════════════════════════════════════════════
// COMPEC BİLİŞİM ÖDÜLLERİ 2026 — ADAYLAR
// Tüm kategoriler ve adaylar bu dosyada tanımlanır.
// Adaylar sayfası ve oylama sayfası bu dosyayı okur.
// ══════════════════════════════════════════════════════════
const ADAYLAR_DATA = [
    {
        kategori: "Sosyal Medyayı En İyi Kullanan Marka",
        kategoriId: "marka",
        adaylar: [
            { isim: "Züber", fotograf: "../assets/aday2026/marka/zuber.jpg", stil: "background-color: #FFF;" },
            { isim: "Duolingo", fotograf: "../assets/aday2026/marka/duolingo.jpg", stil: "background-color: #FFF;" },
            { isim: "Superfresh", fotograf: "../assets/aday2026/marka/superfresh.png", stil: "background-color: #FFF;" },
            { isim: "Indomie", fotograf: "../assets/aday2026/marka/indomie.png", stil: "background-color: #FFF;" },
            { isim: "Flying Tiger Copenhagen", fotograf: "../assets/aday2026/marka/flying-tiger-copenhagen.png", stil: "background-color: #FFF;" }
        ]
    },
    {
        kategori: "En İyi E-Ticaret Uygulaması",
        kategoriId: "e-ticaret",
        adaylar: [
            { isim: "Hepsiburada", fotograf: "../assets/aday2026/e-ticaret/hepsiburada.png", stil: "background-color: #FFF;" },
            { isim: "Sahibinden", fotograf: "../assets/aday2026/e-ticaret/sahibinden.png", stil: "background-color: #FFF;" },
            { isim: "Pazarama", fotograf: "../assets/aday2026/e-ticaret/pazarama.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Dijital Medya ve Menajerlik",
        kategoriId: "dijital-medya",
        adaylar: [
            { isim: "TEM Network", fotograf: "../assets/aday2026/dijital-medya/tem-network.png", stil: "background-color: #000;" },
            { isim: "Viralif", fotograf: "../assets/aday2026/dijital-medya/viralif.png", stil: "background-color: #FFF;" },
            { isim: "Key People and Project", fotograf: "../assets/aday2026/dijital-medya/key-people-and-project.jpg", stil: "" },
            { isim: "Hypers", fotograf: "../assets/aday2026/dijital-medya/hypers.png", stil: "background-color: #FFF;" },
            { isim: "Lychee", fotograf: "../assets/aday2026/dijital-medya/lychee.jpg", stil: "" },
            { isim: "Influera", fotograf: "../assets/aday2026/dijital-medya/influera.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Mobil Bankacılık Uygulaması",
        kategoriId: "mobil-bankacilik",
        adaylar: [
            { isim: "Akbank", fotograf: "../assets/aday2026/mobil-bankacilik/akbank.jpg", stil: "" },
            { isim: "Garanti BBVA", fotograf: "../assets/aday2026/mobil-bankacilik/garanti-bbva.jpg", stil: "" },
            { isim: "Yapı Kredi", fotograf: "../assets/aday2026/mobil-bankacilik/yapi-kredi.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Mobil Oyun",
        kategoriId: "mobil-oyun",
        adaylar: [
            { isim: "Raid Rush", fotograf: "../assets/aday2026/mobil-oyun/raid-rush.png", stil: "" },
            { isim: "TC Simülasyonu", fotograf: "../assets/aday2026/mobil-oyun/tc-simulasyonu.jpg", stil: "" },
            { isim: "Arcane Arena", fotograf: "../assets/aday2026/mobil-oyun/arcane-arena.png", stil: "" }
        ]
    },
    {
        kategori: "Yılın En İyi Oyunu",
        kategoriId: "yilin-oyunu",
        adaylar: [
            { isim: "Celestial Return", fotograf: "../assets/aday2026/yilin-oyunu/celestial-return.jpg", stil: "" },
            { isim: "Harvest King", fotograf: "../assets/aday2026/yilin-oyunu/harvest-king.jpg", stil: "" },
            { isim: "Iron Blight", fotograf: "../assets/aday2026/yilin-oyunu/iron-blight.png", stil: "" },
            { isim: "Lost in Art: A Miniature Realm", fotograf: "../assets/aday2026/yilin-oyunu/lost-in-art-a-miniature-realm.png", stil: "background-color: #000;" },
            { isim: "This is Fine: Maximum Cope", fotograf: "../assets/aday2026/yilin-oyunu/this-is-fine-maximum-cope.jpg", stil: "" },
            { isim: "Bombanana", fotograf: "../assets/aday2026/yilin-oyunu/bombanana.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Oyun İçerik Üreticisi",
        kategoriId: "oyun-icerik",
        adaylar: [
            { isim: "Disket Kutusu", fotograf: "../assets/aday2026/oyun-icerik/disket-kutusu.jpg", stil: "" },
            { isim: "Konsol Oyun", fotograf: "../assets/aday2026/oyun-icerik/konsol-oyun.jpg", stil: "" },
            { isim: "CombatRY", fotograf: "../assets/aday2026/oyun-icerik/combatry.jpg", stil: "" },
            { isim: "Atacan İlkin Tansel", fotograf: "../assets/aday2026/oyun-icerik/atacan-ilkin-tansel.jpg", stil: "" },
            { isim: "Tunca Arslan", fotograf: "../assets/aday2026/oyun-icerik/tunca-arslan.jpg", stil: "" },
            { isim: "Bufuak", fotograf: "../assets/aday2026/oyun-icerik/bufuak.jpg", stil: "" },
            { isim: "Marcus7z", fotograf: "../assets/aday2026/oyun-icerik/marcus7z.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Podcast Serisi",
        kategoriId: "podcast",
        adaylar: [
            { isim: "Haddini Aşan Yaşam Rehberi", fotograf: "../assets/aday2026/podcast/haddini-asan-yasam-rehberi.jpg", stil: "" },
            { isim: "Ortamda Satılacak Bilgi", fotograf: "../assets/aday2026/podcast/ortamda-satilacak-bilgi.jpg", stil: "" },
            { isim: "Sapien Podcast", fotograf: "../assets/aday2026/podcast/sapien-podcast.png", stil: "background-color: #FFF;" },
            { isim: "Kendine İyi Davran", fotograf: "../assets/aday2026/podcast/kendine-iyi-davran.png", stil: "background-color: #FFF;" },
            { isim: "Yemekte Bile Yemek Konuşuruz", fotograf: "../assets/aday2026/podcast/yemekte-bile-yemek-konusuruz.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi YouTube İçerik Üreticisi",
        kategoriId: "youtube",
        adaylar: [
            { isim: "49W", fotograf: "../assets/aday2026/youtube/49w.jpg", stil: "background-color: #FFF;" },
            { isim: "Ben Gitmek İstiyorum", fotograf: "../assets/aday2026/youtube/ben-gitmek-istiyorum.jpg", stil: "" },
            { isim: "Burak Aktürk", fotograf: "../assets/aday2026/youtube/burak-akturk.jpg", stil: "" },
            { isim: "DFT Tarih", fotograf: "../assets/aday2026/youtube/dft-tarih.png", stil: "" },
            { isim: "Atakan ve Cemile", fotograf: "../assets/aday2026/youtube/atakan-ve-cemile.jpg", stil: "" },
            { isim: "Soğuk Savaş", fotograf: "../assets/aday2026/youtube/soguk-savas.png", stil: "background-color: #FFF;" }
        ]
    },
    {
        kategori: "En İyi Sosyal Medya İçerik Üreticisi",
        kategoriId: "sosyal-medya",
        adaylar: [
            { isim: "Havva Hacıfazlıoğlu", fotograf: "../assets/aday2026/sosyal-medya/havva-hacifazlioglu.jpg", stil: "" },
            { isim: "Bilge Özşar", fotograf: "../assets/aday2026/sosyal-medya/bilge-ozsar.jpg", stil: "" },
            { isim: "Umut Metin", fotograf: "../assets/aday2026/sosyal-medya/umut-metin.jpg", stil: "" },
            { isim: "Ata Tekiner", fotograf: "../assets/aday2026/sosyal-medya/ata-tekiner.jpg", stil: "" },
            { isim: "Ece Çetinöz", fotograf: "../assets/aday2026/sosyal-medya/ece-cetinoz.jpg", stil: "" },
            { isim: "İpek Ersan", fotograf: "../assets/aday2026/sosyal-medya/ipek-ersan.jpg", stil: "" },
            { isim: "Sıradan Hareket", fotograf: "../assets/aday2026/sosyal-medya/siradan-hareket.jpg", stil: "" },
            { isim: "Nil'in İzleri", fotograf: "../assets/aday2026/sosyal-medya/nil-in-izleri.jpg", stil: "" },
            { isim: "Yunus Canpolat", fotograf: "../assets/aday2026/sosyal-medya/yunus-canpolat.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Dijital Talk Show",
        kategoriId: "talk-show",
        adaylar: [
            { isim: "Berfu Yenenler ile Talk Show Perileri", fotograf: "../assets/aday2026/talk-show/berfu-yenenler-ile-talk-show-perileri.jpg", stil: "" },
            { isim: "Hayrettin ile Kaos Show", fotograf: "../assets/aday2026/talk-show/hayrettin-ile-kaos-show.jpg", stil: "" },
            { isim: "Melis İşiten ile Zaten Şov", fotograf: "../assets/aday2026/talk-show/melis-isiten-ile-zaten-sov.png", stil: "background-color: #FFF;" },
            { isim: "Tıraş Show", fotograf: "../assets/aday2026/talk-show/tiras-show.jpg", stil: "" },
            { isim: "İbrahim Selim ile Bu Gece", fotograf: "../assets/aday2026/talk-show/ibrahim-selim-ile-bu-gece.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Yapay Zeka Girişimi",
        kategoriId: "yapay-zeka",
        adaylar: [
            { isim: "Vispera", fotograf: "../assets/aday2026/yapay-zeka/vispera.png", stil: "background-color: #FFF;" },
            { isim: "Virasoft", fotograf: "../assets/aday2026/yapay-zeka/virasoft.jpg", stil: "" },
            { isim: "Mindra", fotograf: "../assets/aday2026/yapay-zeka/mindra.jpg", stil: "background-color: #FFF;" },
            { isim: "Madlen", fotograf: "../assets/aday2026/yapay-zeka/madlen.png", stil: "background-color: #FFF;" }
        ]
    },
    {
        kategori: "En İyi Online Yayıncı",
        kategoriId: "online-yayinci",
        adaylar: [
            { isim: "Tssigalko", fotograf: "../assets/aday2026/online-yayinci/tssigalko.jpg", stil: "" },
            { isim: "Kaanflix", fotograf: "../assets/aday2026/online-yayinci/kaanflix.jpg", stil: "" },
            { isim: "Hasan Arda Kaşıkçı", fotograf: "../assets/aday2026/online-yayinci/hasan-arda-kasikci.jpg", stil: "" },
            { isim: "Yağmur Dilaveroğlu (Blush)", fotograf: "../assets/aday2026/online-yayinci/yagmur-dilaveroglu-blush.jpg", stil: "" },
            { isim: "Roseheuss Begüm", fotograf: "../assets/aday2026/online-yayinci/roseheuss-begum.jpg", stil: "" },
            { isim: "Prenses Perver", fotograf: "../assets/aday2026/online-yayinci/prenses-perver.jpg", stil: "" },
            { isim: "Gökhan Öner", fotograf: "../assets/aday2026/online-yayinci/gokhan-oner.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Teknoloji İçerik Üreticisi",
        kategoriId: "teknoloji",
        adaylar: [
            { isim: "Ada Büyük", fotograf: "../assets/aday2026/teknoloji/ada-buyuk.jpg", stil: "" },
            { isim: "Ahmet Emre Sakarya", fotograf: "../assets/aday2026/teknoloji/ahmet-emre-sakarya.jpg", stil: "" },
            { isim: "Selman Bozkır", fotograf: "../assets/aday2026/teknoloji/selman-bozkir.jpg", stil: "" },
            { isim: "Mert Bayantemur", fotograf: "../assets/aday2026/teknoloji/mert-bayantemur.jpg", stil: "" },
            { isim: "Mehmet Üzüm", fotograf: "../assets/aday2026/teknoloji/mehmet-uzum.jpg", stil: "" },
            { isim: "Şahan Öztekin", fotograf: "../assets/aday2026/teknoloji/sahan-oztekin.jpg", stil: "" },
            { isim: "Mendebur Lemur", fotograf: "../assets/aday2026/teknoloji/mendebur-lemur.jpg", stil: "" },
            { isim: "Samet Jankoviç", fotograf: "../assets/aday2026/teknoloji/samet-jankovic.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Siber Güvenlik Şirketi",
        kategoriId: "siber-guvenlik",
        adaylar: [
            { isim: "Picus Security", fotograf: "../assets/aday2026/siber-guvenlik/picus-security.png", stil: "background-color: #FFF;" },
            { isim: "Cyberwise", fotograf: "../assets/aday2026/siber-guvenlik/cyberwise.png", stil: "background-color: #FFF;" },
            { isim: "Kaspersky", fotograf: "../assets/aday2026/siber-guvenlik/kaspersky.jpg", stil: "background-color: #FFF;" }
        ]
    }
];

// Node / test ortamları için
if (typeof module !== 'undefined' && module.exports) { module.exports = ADAYLAR_DATA; }
