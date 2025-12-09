// Tüm adaylar ve kategoriler bu dosyada tanımlanır
const ADAYLAR_DATA = [
    {
        kategori: "En İyi Fintech Şirketi",
        kategoriId: "fintech",
        formEntry: "entry.3318643",
        adaylar: [
            { isim: "Moka United", fotograf: "../assets/yeniaday/EN İYİ FINTECH ŞİRKETİ/mokaunited_logo-1.png", stil: "background-color: #FFF;" },
            { isim: "Param", fotograf: "../assets/yeniaday/EN İYİ FINTECH ŞİRKETİ/param.png", stil: "background-color: #FFF;" },
            { isim: "Midas", fotograf: "../assets/yeniaday/EN İYİ FINTECH ŞİRKETİ/midas.jpeg", stil: "" },
            { isim: "BtcTurk", fotograf: "../assets/yeniaday/EN İYİ FINTECH ŞİRKETİ/BtcTurk_logo-2_page-0001.jpg", stil: "background-color: #FFF;" }
        ]
    },
    {
        kategori: "En İyi Yapay Zeka Girişimi",
        kategoriId: "yapay-zeka",
        formEntry: "entry.945115466",
        adaylar: [
            { isim: "Weacces", fotograf: "../assets/yeniaday/EN İYİ YAPAY ZEKA GİRİŞİMİ/Logo Weacces - Black - Vertc.png", stil: "background-color: #FFF;" },
            { isim: "Madlen", fotograf: "../assets/yeniaday/EN İYİ YAPAY ZEKA GİRİŞİMİ/madlen.png", stil: "background-color: #FFF;" },
            { isim: "Move ON", fotograf: "../assets/yeniaday/EN İYİ YAPAY ZEKA GİRİŞİMİ/moveon_logo_b_with_r.png", stil: "background-color: #FFF;" },
            { isim: "Novus", fotograf: "../assets/yeniaday/EN İYİ YAPAY ZEKA GİRİŞİMİ/novus.png", stil: "background-color: #FFF;" },
            { isim: "Virasoft", fotograf: "../assets/yeniaday/EN İYİ YAPAY ZEKA GİRİŞİMİ/virasoft.jpg", stil: "" },
            { isim: "Voiser", fotograf: "../assets/yeniaday/EN İYİ YAPAY ZEKA GİRİŞİMİ/Voiser.png", stil: "background-color: #FFF;" },
            { isim: "Mindra", fotograf: "../assets/yeniaday/EN İYİ YAPAY ZEKA GİRİŞİMİ/mindra.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Podcast",
        kategoriId: "podcast",
        formEntry: "entry.1293755096",
        adaylar: [
            { isim: "BMY", fotograf: "../assets/yeniaday/EN İYİ PODCAST/BMY Logo.jpeg", stil: "" },
            { isim: "Hitmakers", fotograf: "../assets/yeniaday/EN İYİ PODCAST/Hitmakers Logo.png", stil: "background-color: #FFF;" },
            { isim: "Kafamdakiler", fotograf: "../assets/yeniaday/EN İYİ PODCAST/Kafamdakiler.png", stil: "background-color: #FFF;" },
            { isim: "Nasıl Olunur", fotograf: "../assets/yeniaday/EN İYİ PODCAST/nasılolunur.jpeg", stil: "" },
            { isim: "Ortamlarda Satılacak Bilgiler", fotograf: "../assets/yeniaday/EN İYİ PODCAST/ortamlarda satılacak bilgiler.png", stil: "" },
            { isim: "Sadece Film İzlemiyorum", fotograf: "../assets/yeniaday/EN İYİ PODCAST/Sadece film izlemiyorum.jpg", stil: "" },
            { isim: "Sapien", fotograf: "../assets/yeniaday/EN İYİ PODCAST/Sapien_Logo_Horizontal.png", stil: "background-color: #FFF;" }
        ]
    },
    {
        kategori: "En İyi YouTube İçerik Üreticisi",
        kategoriId: "youtube",
        formEntry: "entry.1578581061",
        adaylar: [
            { isim: "Atik Ailesi", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/AtikAilesi.PNG", stil: "" },
            { isim: "Çakal Lezzetler", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/CakalLezzetler.jpg", stil: "" },
            { isim: "Drama Pasta", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/drama pasta ikon.png", stil: "background-color: #FFF;" },
            { isim: "Evrim Ağacı", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/Evrim Ağacı Logo.png", stil: "background-color: #FFF;" },
            { isim: "Omnibus", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/OmnibusLogo.jpg", stil: "" },
            { isim: "Sinemori", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/Sinemori_Logo_Istisnai_Kullanım.png", stil: "background-color: #000;" },
            { isim: "Sözel Tim", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/Sözel Tim Görsel.jpeg", stil: "" },
            { isim: "Cansu Canan Özgen", fotograf: "../assets/yeniaday/EN İYİ YOUTUBE İÇERİK ÜRETİCİSİ/cansu canan özgan.jpeg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Sosyal Medya İçerik Üreticisi",
        kategoriId: "sosyal-medya",
        formEntry: "entry.83290777",
        adaylar: [
            { isim: "26 Piksel", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/26piksel/26Piksel - Logo Kırmızı.png", stil: "background-color: #FFF;" },
            { isim: "Barış Ali (latenighter)", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Barış Ali (latenighter).jpeg", stil: "" },
            { isim: "Bengü Tiryaki", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Bengü Tiryaki.jpg", stil: "" },
            { isim: "Beyza Şen", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Beyza şen.JPG", stil: "" },
            { isim: "Bilge Özşar", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Bilge Özşar1.jpeg", stil: "" },
            { isim: "Deniz Altun", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Deniz Altun.PNG", stil: "" },
            { isim: "Fulden Akyan", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Fulden Akyan.jpeg", stil: "" },
            { isim: "Gamze Şakar", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Gamze şakar.JPG", stil: "" },
            { isim: "Gizem Nur Büyükkara", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Gizem Nur Büyükkara Gözü.jpg", stil: "" },
            { isim: "IVGEN", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/IVGEN .JPG", stil: "" },
            { isim: "Kendimi Boyuyorum", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Kendimi Boyuyorum (Ayşenur).jpeg", stil: "" },
            { isim: "Normaldiil", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Normaldiil.jpeg", stil: "" },
            { isim: "Sabit Doğan", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/sabit doğan/121257-043.JPG", stil: "" },
            { isim: "Serra Kardeş", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Serra Kardeş.jpeg", stil: "" },
            { isim: "Tam Kararında", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/Tam Kararında (Kaan Yarman).jpeg", stil: "" },
            { isim: "Ömer Talha Çubuk", fotograf: "../assets/yeniaday/EN İYİ SOSYAL MEDYA İÇERİK ÜRETİCİSİ/ömer talha çubuk.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Dijital Medya",
        kategoriId: "dijital-medya",
        formEntry: "entry.1963658691",
        adaylar: [
            { isim: "Key People", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL MEDYA/keypeople_page-0001.jpg", stil: "background-color: #000;" },
            { isim: "Lychee", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL MEDYA/Lychee.png", stil: "background-color: #FFF;" },
            { isim: "TEM Medya", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL MEDYA/TEM-Yeni_Logo_Beyaz.png", stil: "background-color: #000;" },
            { isim: "Viralif", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL MEDYA/viralif.png", stil: "background-color: #FFF;" },
            { isim: "Yours", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL MEDYA/YOURS BEYAZ.png", stil: "background-color: #000;" }
        ]
    },
    {
        kategori: "En İyi Mobil Oyun",
        kategoriId: "mobil-oyun",
        formEntry: "entry.933126229",
        adaylar: [
            { isim: "Aylık Distopya", fotograf: "../assets/yeniaday/EN İYİ MOBİL OYUN/aylik distopya.png", stil: "background-color: #FFF;" },
            { isim: "ColorBlockJam", fotograf: "../assets/yeniaday/EN İYİ MOBİL OYUN/colorblockjam.jpeg", stil: "" },
            { isim: "Oddmar", fotograf: "../assets/yeniaday/EN İYİ MOBİL OYUN/Oddmar Key Art.png", stil: "" },
            { isim: "Rollic", fotograf: "../assets/yeniaday/EN İYİ MOBİL OYUN/rollic.png", stil: "background-color: #FFF;" }
        ]
    },
    {
        kategori: "Sosyal Medyayı En Etkin Kullanan Ünlü",
        kategoriId: "unlu",
        formEntry: "entry.847974182",
        adaylar: [
            { isim: "Ayşe Eser", fotograf: "../assets/yeniaday/SOSYAL MEDYAYI EN ETKİN KULLANAN ÜNLÜ/Ayse Eser (itsayseser).jpeg", stil: "" },
            { isim: "Bengi Apak", fotograf: "../assets/yeniaday/SOSYAL MEDYAYI EN ETKİN KULLANAN ÜNLÜ/bengi apak.png", stil: "" },
            { isim: "İlkin Aydın", fotograf: "../assets/yeniaday/SOSYAL MEDYAYI EN ETKİN KULLANAN ÜNLÜ/İlkin Aydın.JPG", stil: "" },
            { isim: "Melis Olcay", fotograf: "../assets/yeniaday/SOSYAL MEDYAYI EN ETKİN KULLANAN ÜNLÜ/Melis Olcay/WhatsApp Image 2025-11-24 at 12.52.29.jpeg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Dijital Talk Show",
        kategoriId: "talk-show",
        formEntry: "entry.398401933",
        adaylar: [
            { isim: "Berfu Yenenler ile Talk Show Perileri", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL TALK SHOW/berfu yenenler ile talk show perileri.jpg", stil: "" },
            { isim: "Crossover Talks", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL TALK SHOW/Crossover Talks logo insta profil resmi.png", stil: "" },
            { isim: "Hikayeden Adamlar", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL TALK SHOW/hikayeden adamlar.PNG", stil: "" },
            { isim: "Linç@", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL TALK SHOW/linç@ arka plan.jpg", stil: "" },
            { isim: "Pembe Yalanlar", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL TALK SHOW/pembe yalanlar.png", stil: "" },
            { isim: "Hayrettin Kaos Show", fotograf: "../assets/yeniaday/EN İYİ DİJİTAL TALK SHOW/hayrettinkaos.jpeg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Online Yayıncı",
        kategoriId: "online-yayinci",
        formEntry: "entry.195216280",
        adaylar: [
            { isim: "Eldorina", fotograf: "../assets/yeniaday/EN İYİ ONLINE YAYINCI/eldorina.jpg", stil: "" },
            { isim: "Eray", fotograf: "../assets/yeniaday/EN İYİ ONLINE YAYINCI/eray.jpg", stil: "" },
            { isim: "Hype", fotograf: "../assets/yeniaday/EN İYİ ONLINE YAYINCI/hype.jpeg", stil: "" },
            { isim: "Kaanflix", fotograf: "../assets/yeniaday/EN İYİ ONLINE YAYINCI/Kaanflix_1.png", stil: "background-color: #FFF;" },
            { isim: "Limonify", fotograf: "../assets/yeniaday/EN İYİ ONLINE YAYINCI/limonify.JPG", stil: "" },
            { isim: "PintiPanda", fotograf: "../assets/yeniaday/EN İYİ ONLINE YAYINCI/panda logo.png", stil: "background-color: #FFF;" },
            { isim: "Yağmur Blash", fotograf: "../assets/yeniaday/EN İYİ ONLINE YAYINCI/Yağmur Blash Dilaveroğlu.jpg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Oyun Geliştirme Şirketi",
        kategoriId: "oyun-gelistirme",
        formEntry: "entry.251135276",
        adaylar: [
            { isim: "Nokta Games", fotograf: "../assets/yeniaday/EN İYİ OYUN GELİŞTİRME ŞİRKETİ/Nokta-games-logo-1.png", stil: "background-color: #FFF;" },
            { isim: "Rogue Duck", fotograf: "../assets/yeniaday/EN İYİ OYUN GELİŞTİRME ŞİRKETİ/rogue dock.png", stil: "background-color: #FFF;" },
            { isim: "Rollic", fotograf: "../assets/yeniaday/EN İYİ OYUN GELİŞTİRME ŞİRKETİ/rollic.png", stil: "background-color: #FFF;" },
            { isim: "Spyke Games", fotograf: "../assets/yeniaday/EN İYİ OYUN GELİŞTİRME ŞİRKETİ/Spyke mor logo.png", stil: "background-color: #FFF;" },
            { isim: "TaleWorlds", fotograf: "../assets/yeniaday/EN İYİ OYUN GELİŞTİRME ŞİRKETİ/TW_initials_white.png", stil: "background-color: #000;" },
            { isim: "Ubik Studios", fotograf: "../assets/yeniaday/EN İYİ OYUN GELİŞTİRME ŞİRKETİ/ubik studios.svg", stil: "background-color: #FFF;" }
        ]
    },
    {
        kategori: "En İyi Oyun İçerik Üreticisi",
        kategoriId: "oyun-icerik",
        formEntry: "entry.579430180",
        adaylar: [
            { isim: "Bufuak", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/bufuak.png", stil: "" },
            { isim: "Burak Oyunda", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/buraksahin364.png", stil: "" },
            { isim: "Emin Çıtak", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/Emin Çıtak.jpg", stil: "" },
            { isim: "Marcus7z", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/marcus7z.png", stil: "" },
            { isim: "Tunca Arslan", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/tunca arslan.jpg", stil: "" },
            { isim: "zSuat", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/zSuat 3.png", stil: "" },
            { isim: "Tosbaa", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/tosbaa.png", stil: "" },
            { isim: "Disket Kutusu", fotograf: "../assets/yeniaday/EN İYİ OYUN İÇERİK ÜRETİCİSİ/disketkutusu.jpeg", stil: "" }
        ]
    },
    {
        kategori: "En İyi Teknoloji İçerik Üreticisi",
        kategoriId: "teknoloji",
        formEntry: "entry.586415959",
        adaylar: [
            { isim: "Ahmet Emre", fotograf: "../assets/yeniaday/EN İYİ TEKNOLOJİ İÇERİK ÜRETİCİSİ/Ahmet-Emre.jpg", stil: "" },
            { isim: "Ayhan Tarakçı", fotograf: "../assets/yeniaday/EN İYİ TEKNOLOJİ İÇERİK ÜRETİCİSİ/ayhan tarakcı.JPG", stil: "" },
            { isim: "Mehmet Üzüm", fotograf: "../assets/yeniaday/EN İYİ TEKNOLOJİ İÇERİK ÜRETİCİSİ/profil-fotoğraf-mehmet-üzüm.png", stil: "" },
            { isim: "Osman Furkan Şahin", fotograf: "../assets/yeniaday/EN İYİ TEKNOLOJİ İÇERİK ÜRETİCİSİ/osman furkan şahin.png", stil: "" },
            { isim: "Tolga Özuygur", fotograf: "../assets/yeniaday/EN İYİ TEKNOLOJİ İÇERİK ÜRETİCİSİ/tolga özuygur.jpg", stil: "" }
        ]
    },
    {
        kategori: "Yılın En İyi Oyunu",
        kategoriId: "yilin-oyunu",
        formEntry: "entry.352552845",
        adaylar: [
            { isim: "Feather Party", fotograf: "../assets/yeniaday/YILIN EN İYİ OYUNU/featherparty.png", stil: "" },
            { isim: "Holy Shoot", fotograf: "../assets/yeniaday/YILIN EN İYİ OYUNU/Holy Shoot - Tale Era Interactive/HolyShoot_Logo.png", stil: "background-color: #FFF;" },
            { isim: "Leila", fotograf: "../assets/yeniaday/YILIN EN İYİ OYUNU/Leila-Logo.png", stil: "background-color: #000;" },
            { isim: "Lost Lullabies", fotograf: "../assets/yeniaday/YILIN EN İYİ OYUNU/lost lullabies.png", stil: "" },
            { isim: "Supermarket Simulator", fotograf: "../assets/yeniaday/YILIN EN İYİ OYUNU/supermarket simulator.png", stil: "" },
            { isim: "To Pixelia", fotograf: "../assets/yeniaday/YILIN EN İYİ OYUNU/pixelia.png", stil: "" },
            { isim: "Zort", fotograf: "../assets/yeniaday/YILIN EN İYİ OYUNU/zort.jpeg", stil: "" }
        ]
    },
];
