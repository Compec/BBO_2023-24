// ══════════════════════════════════════════════════════════
// COMPEC BİLİŞİM ÖDÜLLERİ — OYLAMA İSTEMCİSİ
// ══════════════════════════════════════════════════════════
// Oylar doğrudan veritabanına değil, Supabase üzerindeki "oy-ver"
// Edge Function'ına gönderilir. Mükerrer oy, IP limiti ve aday
// doğrulaması sunucu tarafında yapılır — tarayıcıdaki kontroller
// yalnızca kullanıcı deneyimi içindir.
// ══════════════════════════════════════════════════════════

(function () {
    'use strict';

    const OY_KULLANILDI_ANAHTARI = 'compec_oy_kullanildi_2026';
    const CIHAZ_ANAHTARI = 'compec_cihaz_id';

    const toplamAdim = ADAYLAR_DATA.length;
    let adim = 1;
    let cihazId = null;
    let turnstileToken = null;
    let gonderiliyor = false;
    let oyJetonu = null;

    // ── Yardımcılar ──────────────────────────────────────────

    function el(id) { return document.getElementById(id); }

    function ekranGoster(hangi) {
        el('bilgiEkrani').style.display = hangi === 'bilgi' ? '' : 'none';
        el('oylamaEkrani').style.display = hangi === 'oylama' ? '' : 'none';
        if (hangi === 'bilgi') el('bilgiEkrani').classList.add('active');
        if (hangi === 'oylama') el('oylamaEkrani').classList.add('active');
    }

    function bilgiGoster(baslik, metin, butonlar) {
        el('bilgiBaslik').textContent = baslik;
        el('bilgiMetin').innerHTML = metin;
        const kutu = el('bilgiButonlari');
        kutu.innerHTML = '';
        (butonlar || []).forEach(function (b) {
            const a = document.createElement('a');
            a.className = 'btn';
            a.textContent = b.metin;
            a.href = b.url;
            if (b.yeniSekme) a.target = '_blank';
            a.style.margin = '0 8px';
            kutu.appendChild(a);
        });
        ekranGoster('bilgi');
    }

    function biletButonu() {
        return SITE_CONFIG.biletUrl
            ? [{ metin: '🎟️ Bilet Al!', url: SITE_CONFIG.biletUrl, yeniSekme: true }]
            : [{ metin: '← Anasayfaya dön', url: '../index.html' }];
    }

    // ── Oy jetonu ────────────────────────────────────────────
    // Sayfa açılır açılmaz sunucudan tek kullanımlık bir jeton alınır.
    // Jeton IP'ye bağlıdır ve oy gönderilirken en az 20 saniye beklemiş
    // olmalıdır; bu sayede tek istekle toplu oy basılamaz.

    function fonksiyonUrl(ad) {
        return SITE_CONFIG.supabaseUrl.replace(/\/+$/, '') + '/functions/v1/' + ad;
    }

    async function jetonAl() {
        try {
            const cevap = await fetch(fonksiyonUrl(SITE_CONFIG.jetonFonksiyonu || 'oy-baslat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SITE_CONFIG.supabaseAnonKey,
                    'Authorization': 'Bearer ' + SITE_CONFIG.supabaseAnonKey
                },
                body: '{}'
            });
            const sonuc = await cevap.json();
            if (sonuc.ok && sonuc.jeton) {
                oyJetonu = sonuc.jeton;
                return true;
            }
            console.warn('Jeton alınamadı:', sonuc.hata);
            return false;
        } catch (e) {
            console.warn('Jeton isteği başarısız:', e);
            return false;
        }
    }

    // ── Cihaz kimliği ────────────────────────────────────────

    async function cihazKimligiAl() {
        // Önce kalıcı yerel kimlik — tarayıcı verisi silinmediyse hep aynı kalır.
        let yedek = localStorage.getItem(CIHAZ_ANAHTARI);
        try {
            const fp = await FingerprintJS.load();
            const sonuc = await fp.get();
            if (sonuc && sonuc.visitorId) {
                localStorage.setItem(CIHAZ_ANAHTARI, sonuc.visitorId);
                return sonuc.visitorId;
            }
        } catch (e) {
            console.warn('Parmak izi alınamadı, yerel kimlik kullanılıyor.', e);
        }
        if (!yedek) {
            yedek = 'cihaz_' + Date.now().toString(36) + '_' +
                Math.random().toString(36).slice(2, 12) +
                Math.random().toString(36).slice(2, 12);
            localStorage.setItem(CIHAZ_ANAHTARI, yedek);
        }
        return yedek;
    }

    // ── Soruları oluştur ─────────────────────────────────────

    function sorulariOlustur() {
        const kap = el('sorular');

        ADAYLAR_DATA.forEach(function (kategori, i) {
            const soru = document.createElement('div');
            soru.className = 'question-container';
            soru.id = 'soru' + (i + 1);
            if (i === 0) soru.classList.add('active');

            const baslik = document.createElement('h2');
            baslik.textContent = kategori.kategori;
            soru.appendChild(baslik);

            const liste = document.createElement('div');
            liste.className = 'candidate-list';

            kategori.adaylar.forEach(function (aday, j) {
                const kart = document.createElement('div');
                kart.className = 'candidate';

                const girdiId = 'k' + (i + 1) + 'a' + (j + 1);
                const girdi = document.createElement('input');
                girdi.type = 'radio';
                girdi.id = girdiId;
                girdi.name = kategori.kategoriId;
                girdi.value = adaySlug(aday);

                const etiket = document.createElement('label');
                etiket.htmlFor = girdiId;

                const resim = document.createElement('img');
                resim.src = aday.fotograf;
                resim.alt = aday.isim;
                resim.loading = 'lazy';
                if (aday.stil) resim.style.cssText = aday.stil;

                etiket.appendChild(resim);
                etiket.appendChild(document.createElement('br'));
                etiket.appendChild(document.createTextNode(aday.isim));

                kart.appendChild(girdi);
                kart.appendChild(etiket);
                kart.addEventListener('click', function () {
                    girdi.checked = true;
                    ilerleBtnGuncelle();
                });
                girdi.addEventListener('change', ilerleBtnGuncelle);

                liste.appendChild(kart);
            });

            soru.appendChild(liste);
            kap.appendChild(soru);
        });
    }

    /** Aday görselinin dosya adı, veritabanındaki aday slug'ıdır. */
    function adaySlug(aday) {
        const dosya = aday.fotograf.split('/').pop();
        return dosya.replace(/\.[^.]+$/, '');
    }

    // ── Navigasyon ───────────────────────────────────────────

    function cevaplandiMi(n) {
        const soru = el('soru' + n);
        return !!(soru && soru.querySelector('input[type="radio"]:checked'));
    }

    function ilerleBtnGuncelle() {
        const sonAdim = adim === toplamAdim;
        el('geriButonu').style.display = adim === 1 ? 'none' : 'inline-block';
        el('ileriButonu').style.display = sonAdim ? 'none' : 'inline-block';
        el('gonderButonu').style.display = sonAdim ? 'inline-block' : 'none';
        el('turnstileKutusu').style.display =
            (sonAdim && SITE_CONFIG.turnstileSiteKey) ? 'flex' : 'none';
    }

    function ilerlemeGuncelle() {
        const yuzde = ((adim - 1) / (toplamAdim - 1)) * 100;
        el('progress-bar').style.width = yuzde + '%';
        el('progress-text').textContent = 'Soru ' + adim + ' / ' + toplamAdim;
    }

    function gec(yon) {
        if (yon > 0 && !cevaplandiMi(adim)) {
            uyar('Devam etmek için bu kategoride bir aday seç.');
            return;
        }
        el('soru' + adim).classList.remove('active');
        adim = Math.min(Math.max(adim + yon, 1), toplamAdim);
        el('soru' + adim).classList.add('active');
        ilerlemeGuncelle();
        ilerleBtnGuncelle();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    let uyariZamani = null;
    function uyar(metin) {
        const p = el('progress-text');
        if (uyariZamani) clearTimeout(uyariZamani);
        const eski = p.textContent;
        p.textContent = '⚠️ ' + metin;
        uyariZamani = setTimeout(function () { p.textContent = eski; }, 2500);
    }

    // ── Turnstile ────────────────────────────────────────────

    function turnstileKur() {
        if (!SITE_CONFIG.turnstileSiteKey) return;
        const betik = document.createElement('script');
        betik.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        betik.async = true;
        betik.defer = true;
        betik.onload = function () {
            window.turnstile.render('#turnstileKutusu', {
                sitekey: SITE_CONFIG.turnstileSiteKey,
                theme: 'dark',
                callback: function (token) { turnstileToken = token; },
                'expired-callback': function () { turnstileToken = null; },
                'error-callback': function () { turnstileToken = null; }
            });
        };
        document.head.appendChild(betik);
    }

    // ── Gönderim ─────────────────────────────────────────────

    const HATA_METINLERI = {
        zaten_oy_kullanildi: 'Bu cihazdan daha önce oy kullanılmış. Her cihaz yalnızca bir kez oy verebilir.',
        ip_limiti: 'Bu internet bağlantısından çok sayıda oy geldi. Lütfen daha sonra tekrar dene.',
        oylama_kapali: 'Oylama şu anda kapalı.',
        eksik_kategori: 'Tüm kategorilerde oy kullanman gerekiyor.',
        gecersiz_aday: 'Seçimlerinde bir sorun var. Sayfayı yenileyip tekrar dener misin?',
        bot_dogrulamasi_basarisiz: 'Güvenlik doğrulaması tamamlanamadı. Kutucuğu işaretleyip tekrar dene.',
        sunucu_yapilandirmasi: 'Sunucu ayarlarında bir eksik var. Lütfen bizimle iletişime geç.',
        kayit_hatasi: 'Oylar kaydedilemedi. Lütfen tekrar dene.',
        cok_hizli: 'Biraz yavaş! Birkaç saniye bekleyip tekrar gönder.',
        gecersiz_jeton: 'Oturumun doğrulanamadı. Sayfayı yenileyip tekrar dene.',
        jeton_kullanilmis: 'Bu oturumla zaten oy gönderilmiş. Sayfayı yenile.',
        jeton_suresi_doldu: 'Oturumun zaman aşımına uğradı. Sayfayı yenileyip tekrar dene.',
        jeton_yok: 'Sunucuya bağlanılamadı. Sayfayı yenileyip tekrar dene.'
    };

    /** Jeton sorunlarında bir kez yeni jeton alıp tekrar denenecek hatalar. */
    const JETON_HATALARI = ['gecersiz_jeton', 'jeton_kullanilmis', 'jeton_suresi_doldu'];

    async function gonder(olay) {
        olay.preventDefault();
        if (gonderiliyor) return;

        for (let i = 1; i <= toplamAdim; i++) {
            if (!cevaplandiMi(i)) {
                uyar('Lütfen tüm kategoriler için oy kullan. (Soru ' + i + ' boş)');
                el('soru' + adim).classList.remove('active');
                adim = i;
                el('soru' + adim).classList.add('active');
                ilerlemeGuncelle();
                ilerleBtnGuncelle();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        if (SITE_CONFIG.turnstileSiteKey && !turnstileToken) {
            uyar('Lütfen güvenlik doğrulamasını tamamla.');
            return;
        }

        const buton = el('gonderButonu');
        const eskiMetin = buton.textContent;
        gonderiliyor = true;
        buton.disabled = true;
        buton.textContent = '📤 Gönderiliyor...';

        const oylar = {};
        const form = new FormData(el('oylamaFormu'));
        ADAYLAR_DATA.forEach(function (k) { oylar[k.kategoriId] = form.get(k.kategoriId); });

        async function istekAt() {
            const cevap = await fetch(fonksiyonUrl(SITE_CONFIG.oylamaFonksiyonu), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SITE_CONFIG.supabaseAnonKey,
                    'Authorization': 'Bearer ' + SITE_CONFIG.supabaseAnonKey
                },
                body: JSON.stringify({
                    cihazId: cihazId,
                    oylar: oylar,
                    ekran: window.screen.width + 'x' + window.screen.height,
                    turnstileToken: turnstileToken,
                    jeton: oyJetonu
                })
            });
            return cevap.json().catch(function () { return { ok: false, hata: 'kayit_hatasi' }; });
        }

        try {
            // Jeton henüz alınamadıysa son bir kez dene
            if (!oyJetonu) await jetonAl();
            if (!oyJetonu) {
                uyar(HATA_METINLERI.jeton_yok);
                buton.disabled = false;
                buton.textContent = eskiMetin;
                gonderiliyor = false;
                return;
            }

            let sonuc = await istekAt();

            // Jeton süresi dolduysa / tüketildiyse yeni jeton alıp bir kez daha dene
            if (!sonuc.ok && JETON_HATALARI.indexOf(sonuc.hata) !== -1) {
                oyJetonu = null;
                if (await jetonAl()) {
                    buton.textContent = '🔄 Yeniden deneniyor...';
                    await new Promise(function (r) { setTimeout(r, 21000); });
                    buton.textContent = '📤 Gönderiliyor...';
                    sonuc = await istekAt();
                }
            }

            if (sonuc.ok) {
                localStorage.setItem(OY_KULLANILDI_ANAHTARI, new Date().toISOString());
                if (typeof gtag === 'function') gtag('event', 'oy_verildi');
                tesekkurGoster();
            } else {
                if (sonuc.hata === 'zaten_oy_kullanildi') {
                    localStorage.setItem(OY_KULLANILDI_ANAHTARI, new Date().toISOString());
                    zatenOyGoster();
                    return;
                }
                uyar(HATA_METINLERI[sonuc.hata] || 'Beklenmeyen bir hata oluştu.');
                buton.disabled = false;
                buton.textContent = eskiMetin;
                if (window.turnstile) { window.turnstile.reset(); turnstileToken = null; }
            }
        } catch (hata) {
            console.error('Oy gönderme hatası:', hata);
            uyar('Bağlantı hatası. İnternetini kontrol edip tekrar dene.');
            buton.disabled = false;
            buton.textContent = eskiMetin;
        } finally {
            gonderiliyor = false;
        }
    }

    function tesekkurGoster() {
        el('oylamaFormu').innerHTML =
            '<div class="thank-you-container active">' +
            '<h2>🎉 Teşekkürler!</h2>' +
            '<p>Oyların kaydedildi.</p>' +
            '<p>' + SITE_CONFIG.etkinlikTarihiMetni() + ' tarihindeki ödül törenimizde görüşmek üzere! 🙌</p>' +
            (SITE_CONFIG.biletUrl
                ? '<br><button type="button" onclick="window.open(\'' + SITE_CONFIG.biletUrl + '\',\'_blank\')">🎟️ Bilet Al!</button>'
                : '') +
            '</div>';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function zatenOyGoster() {
        bilgiGoster(
            '✅ Oyun zaten kaydedildi',
            'Bu cihazdan daha önce oy kullanılmış. Her cihaz yalnızca bir kez oy verebilir.',
            biletButonu()
        );
    }

    // ── Başlangıç ────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', async function () {
        // 1) Oylama takvim olarak açık mı?
        if (!SITE_CONFIG.oylamaAcikMi()) {
            const bittiMi = SITE_CONFIG.oylamaKapaliMi ||
                Date.now() > new Date(SITE_CONFIG.oylamaBitis).getTime();
            if (bittiMi) {
                bilgiGoster('🎉 Oylama Sona Erdi!',
                    'COMPEC Bilişim Ödülleri oylaması tamamlanmıştır.<br>' +
                    'Katılımınız için teşekkür ederiz!<br><br>' +
                    '🏆 Ödül töreni: <strong>' + SITE_CONFIG.etkinlikTarihiMetni() + '</strong>',
                    biletButonu());
            } else {
                const baslangic = new Date(SITE_CONFIG.oylamaBaslangic);
                bilgiGoster('⏳ Oylama Henüz Başlamadı',
                    'Oylama ' + baslangic.toLocaleDateString('tr-TR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    }) + ' tarihinde açılacak.<br>Bu arada adaylara göz atabilirsin.',
                    [{ metin: '2026 Adayları', url: '../Adaylar/index.html' }]);
            }
            return;
        }

        // 2) Altyapı ayarlanmış mı?
        if (!SITE_CONFIG.supabaseUrl || !SITE_CONFIG.supabaseAnonKey) {
            bilgiGoster('⚙️ Oylama Hazırlanıyor',
                'Oylama altyapısı henüz yapılandırılmamış. Lütfen kısa süre sonra tekrar dene.',
                [{ metin: '2026 Adayları', url: '../Adaylar/index.html' }]);
            console.error('site-config.js içindeki supabaseUrl / supabaseAnonKey boş.');
            return;
        }

        // 3) Bu tarayıcıdan daha önce oy kullanılmış mı?
        if (localStorage.getItem(OY_KULLANILDI_ANAHTARI)) {
            zatenOyGoster();
            return;
        }

        // 4) Formu kur
        sorulariOlustur();
        ekranGoster('oylama');
        ilerlemeGuncelle();
        ilerleBtnGuncelle();
        turnstileKur();

        el('ileriButonu').addEventListener('click', function () { gec(1); });
        el('geriButonu').addEventListener('click', function () { gec(-1); });
        el('oylamaFormu').addEventListener('submit', gonder);

        // Cihaz kimliği ve oy jetonu arka planda hazırlanır.
        // Jeton şimdi alınır; kullanıcı formu doldururken "olgunlaşır".
        cihazId = await cihazKimligiAl();
        jetonAl();
    });
})();
