// ══════════════════════════════════════════════════════════
// ORTAK MENÜ DAVRANIŞI
// site-config.js içindeki ayarlara göre menüyü günceller.
// Alt klasörlerdeki sayfalar (Adaylar/, Oylama/) bu dosyayı kullanır.
// ══════════════════════════════════════════════════════════
(function () {
    if (typeof SITE_CONFIG === 'undefined') return;

    document.addEventListener('DOMContentLoaded', function () {
        const cfg = SITE_CONFIG;

        // Kayıt linki — tanımlıysa menüde göster
        const navKayit = document.getElementById('nav-kayit');
        if (navKayit && cfg.kayitUrl) {
            navKayit.style.display = '';
            navKayit.querySelector('a').href = cfg.kayitUrl;
        }

        // Instagram
        const ig = document.getElementById('nav-instagram');
        if (ig && cfg.instagramUrl) ig.href = cfg.instagramUrl;

        // Oylama kapalıysa menü öğesini pasifleştir
        const navOylama = document.getElementById('nav-oylama');
        if (navOylama && !cfg.oylamaAcikMi()) {
            const bittiMi = cfg.oylamaKapaliMi ||
                Date.now() > new Date(cfg.oylamaBitis).getTime();
            if (bittiMi) {
                navOylama.style.opacity = '0.5';
                navOylama.style.pointerEvents = 'none';
                navOylama.querySelector('a').textContent = 'Oylama (Bitti)';
            } else {
                navOylama.querySelector('a').textContent = 'Oylama (Yakında)';
            }
        }
    });
})();
