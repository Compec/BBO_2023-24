// ══════════════════════════════════════════════════════════
// COMPEC BİLİŞİM ÖDÜLLERİ — SİTE AYARLARI
// ══════════════════════════════════════════════════════════
// Sitenin tamamı bu dosyadaki değerleri kullanır.
// Tarih, bilet linki, oylama durumu gibi şeyleri değiştirmek için
// yalnızca bu dosyayı düzenlemen yeterli — HTML'e dokunmana gerek yok.
// ══════════════════════════════════════════════════════════

const SITE_CONFIG = {
    // ── Etkinlik ────────────────────────────────────────────
    etkinlikAdi: 'COMPEC Bilişim Ödülleri',
    yil: 2026,

    // Ödül töreninin tarihi ve saati.
    // Oylama bittikten sonra anasayfadaki sayaç bu tarihe geri sayar.
    // Saat şimdilik tahmini — kesinleşince buradan değiştir.
    etkinlikTarihi: '2026-12-06T20:00:00',

    // Bilet satış linki. Boş bırakılırsa "Bilet Al!" butonları gizlenir.
    biletUrl: '',

    // Instagram hesabı
    instagramUrl: 'https://www.instagram.com/bogazicibilisimodulleri/',

    // ── Oylama ──────────────────────────────────────────────
    // Oylamanın açılacağı ve kapanacağı an (tarayıcının yerel saati).
    // Oylama sayfası bu aralığın dışında otomatik olarak kapalı görünür.
    oylamaBaslangic: '2026-11-24T00:00:00',
    oylamaBitis:     '2026-12-03T23:59:59',

    // Acil durum anahtarı: true yapılırsa tarihten bağımsız olarak oylama kapanır.
    oylamaKapaliMi: false,

    // ── Oylama altyapısı (Supabase) ─────────────────────────
    // Supabase projesi kurulduktan sonra bu iki değeri doldur.
    // URL   : Supabase Dashboard → Project Settings → API → Project URL
    // Anahtar: aynı sayfadaki "publishable" (anon) anahtar — gizli değildir,
    //          tarayıcıda görünmesi normaldir. Service role anahtarını ASLA buraya yazma.
    supabaseUrl: 'https://xjcccywqupnuhsrxuvdj.supabase.co',
    supabaseAnonKey: 'sb_publishable_7rSpwratYKANPllJmuoc6w_HNFrOglq',

    // Edge Function adları
    oylamaFonksiyonu: 'oy-ver',      // oyları gönderir
    jetonFonksiyonu:  'oy-baslat',   // tek kullanımlık oy jetonu verir

    // Cloudflare Turnstile site anahtarı (bot koruması).
    // Boş bırakılırsa Turnstile devre dışı kalır, oylama yine çalışır.
    turnstileSiteKey: ''
};

// Etkinlik tarihini "6 Aralık 2026" biçiminde döndürür.
SITE_CONFIG.etkinlikTarihiMetni = function () {
    return new Date(this.etkinlikTarihi).toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

// Oylamanın şu anda açık olup olmadığını döndürür.
SITE_CONFIG.oylamaAcikMi = function () {
    if (this.oylamaKapaliMi) return false;
    const simdi = Date.now();
    return simdi >= new Date(this.oylamaBaslangic).getTime() &&
           simdi <= new Date(this.oylamaBitis).getTime();
};

if (typeof module !== 'undefined' && module.exports) { module.exports = SITE_CONFIG; }
