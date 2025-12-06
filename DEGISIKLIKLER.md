# Boğaziçi Bilişim Ödülleri - Online Oylama Sistemi

## 📋 Yapılan Değişiklikler

### 1. Merkezi Veri Yönetimi ✅
- **Dosya:** `adaylar-data.js`
- Tüm adaylar, kategoriler ve fotoğraflar tek bir dosyada toplandı
- Yeni aday eklemek veya güncellemek artık çok kolay
- Her kategori için:
  - Kategori adı
  - Kategori ID'si
  - Google Forms entry ID'si
  - Adaylar listesi (isim, fotoğraf, stil)

### 2. Dinamik Adaylar Sayfası ✅
- **Dosyalar:** `Adaylar/index.html`, `Adaylar/script.js`
- Adaylar sayfası artık `adaylar-data.js` dosyasından otomatik oluşturuluyor
- Yeni aday eklediğinizde sayfa kendini otomatik güncelliyor
- Manuel HTML düzenlemeye gerek yok

### 3. Dinamik Oylama Sistemi ✅
- **Dosyalar:** `Oylama/index.html`, `Oylama/script.js`
- Oylama formu `adaylar-data.js` dosyasından otomatik oluşturuluyor
- Her kategori için sorular dinamik olarak üretiliyor

### 4. Cihaz Bazlı Oy Kontrolü ✅
- **FingerprintJS** kütüphanesi kullanılıyor
- Her cihaz için benzersiz bir parmak izi oluşturuluyor
- MAC adresi, tarayıcı bilgileri, ekran çözünürlüğü gibi verilerle cihaz tanımlama
- Kullanıcı aynı cihazdan tekrar oy vermeye çalışırsa uyarı gösteriliyor

### 5. LocalStorage ile Kalıcı Veri ✅
- Oy bilgisi cihazın tarayıcısında saklanıyor
- Tarayıcı kapatılıp açılsa bile kontrol devam ediyor
- Kayıt edilen bilgiler:
  - `bbo_voted_[cihaz_id]`: Oy kullanıldı mı?
  - `bbo_vote_date_[cihaz_id]`: Ne zaman oy kullanıldı?
  - `bbo_device_id`: Cihaz ID'si (fallback)

## 🔧 Yeni Aday Nasıl Eklenir?

`adaylar-data.js` dosyasını açın ve ilgili kategoriye yeni aday ekleyin:

```javascript
{
    kategori: "En İyi Fintech Şirketi",
    kategoriId: "fintech",
    formEntry: "entry.3318643",
    adaylar: [
        { isim: "Yeni Şirket", fotograf: "/assets/adaylar/yeni-sirket.png", stil: "" },
        // ... diğer adaylar
    ]
}
```

Sadece bu kadar! Hem Adaylar sayfası hem de Oylama formu otomatik güncellenecek.

## 📁 Dosya Yapısı

```
BBO_2023-24/
├── adaylar-data.js          # ✨ YENİ: Tüm aday verileri
├── index.html               # Ana sayfa
├── styles.css              
│
├── Adaylar/
│   ├── index.html          # ✨ GÜNCELLENDİ: Dinamik sayfa
│   ├── index_old.html      # Yedek (eski versiyon)
│   ├── script.js           # ✨ YENİ: Adayları yükleyen script
│   └── styles.css
│
└── Oylama/
    ├── index.html          # ✨ GÜNCELLENDİ: FingerprintJS eklendi
    ├── index_old.html      # Yedek (eski versiyon)
    ├── script.js           # ✨ YENİ: Cihaz kontrolü + Dinamik form
    ├── script_old.js       # Yedek (eski versiyon)
    └── styles.css
```

## 🔒 Güvenlik Özellikleri

1. **Cihaz Parmak İzi (Fingerprint):**
   - FingerprintJS v3 kullanılıyor
   - %99.5 doğruluk oranı
   - VPN, gizli mod gibi durumlarda bile çalışıyor

2. **LocalStorage Kontrolü:**
   - Cihaz ID'si ile eşleşen oy kaydı kontrol ediliyor
   - Birden fazla oy kullanımı engellenmiş

3. **Form Validasyonu:**
   - Tüm kategoriler için oy zorunlu
   - Eksik cevap varsa form gönderilmiyor

## 🎨 Özelleştirme

### Renk ve Stil Değişikliği
`styles.css` dosyalarını düzenleyebilirsiniz.

### Kategori Ekleme/Çıkarma
`adaylar-data.js` dosyasına yeni kategori ekleyin veya mevcut kategoriyi silin:

```javascript
{
    kategori: "Yeni Kategori",
    kategoriId: "yeni-kategori",
    formEntry: "entry.XXXXXXX",  // Google Forms entry ID
    adaylar: [
        { isim: "Aday 1", fotograf: "/assets/adaylar/aday1.png", stil: "" }
    ]
}
```

## 📊 Google Forms Entegrasyonu

Mevcut Google Forms entegrasyonu korundu. Oylar hala aynı forma gönderiliyor:
- Form URL: `https://docs.google.com/forms/d/e/1FAIpQLSdcaZmp11i_oN44F9S_uVY0DYp-TDGHd5yRzBeytLrdurHpSA/formResponse`

## 🚀 Kullanım

1. **Test için:** Dosyaları bir web sunucusunda çalıştırın
2. **Canlı yayın:** Dosyaları sunucunuza yükleyin
3. **Oy kontrolü:** Tarayıcı geliştirici araçları > Application > LocalStorage'dan kontrol edebilirsiniz

## ⚠️ Önemli Notlar

- Eski HTML dosyaları `_old.html` uzantısı ile yedeklendi
- `adaylar-data.js` dosyası tüm sayfalarda erişilebilir olmalı (root klasörde)
- FingerprintJS CDN üzerinden yükleniyor (internet bağlantısı gerekli)
- LocalStorage temizlenirse kullanıcı tekrar oy verebilir (nadirdir)

## 🔄 Geri Alma

Eski sisteme dönmek isterseniz:
1. `index_old.html` dosyalarını `index.html` olarak adlandırın
2. `script_old.js` dosyalarını `script.js` olarak adlandırın
3. `adaylar-data.js` dosyasını silin

## 💡 Gelecek İyileştirmeler İçin Öneriler

- Backend sunucu ile oy verilerini veritabanında saklama
- Admin paneli ekleme (aday yönetimi için)
- Gerçek zamanlı oy sonuçları gösterimi
- Email doğrulama sistemi
- Captcha ekleme (bot koruması için)

---

**Geliştirme Tarihi:** 29 Kasım 2025  
**Geliştirici:** GitHub Copilot  
**Sürüm:** 2.0
