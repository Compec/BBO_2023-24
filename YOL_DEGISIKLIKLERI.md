# Dosya Yolu Değişiklikleri

## ✅ Yapılan Değişiklikler

Tüm dosyalardaki **mutlak yollar** (`/assets/`, `/index.html` vb.) **göreli yollara** çevrildi. Bu sayede site artık `file://` protokolü ile doğrudan tarayıcıda açılabilir.

### Değişiklik Detayları

#### 1. Ana Sayfa (`index.html`)
- ✅ `/assets/` → `./assets/`
- ✅ `/index.html` → `./index.html`
- ✅ `/Adaylar/index.html` → `./Adaylar/index.html`
- ✅ `/Oylama/index.html` → `./Oylama/index.html`

#### 2. Adaylar Sayfası (`Adaylar/index.html`)
- ✅ `/assets/` → `../assets/`
- ✅ `/index.html` → `../index.html`
- ✅ `/Adaylar/index.html` → `./index.html` (kendi sayfası)
- ✅ `/Oylama/index.html` → `../Oylama/index.html`
- ✅ `/adaylar-data.js` → `../adaylar-data.js`

#### 3. Oylama Sayfası (`Oylama/index.html`)
- ✅ `/assets/` → `../assets/`
- ✅ `/index.html` → `../index.html`
- ✅ `/Adaylar/index.html` → `../Adaylar/index.html`
- ✅ `/Oylama/index.html` → `./index.html` (kendi sayfası)
- ✅ `/adaylar-data.js` → `../adaylar-data.js`

#### 4. Veri Dosyası (`adaylar-data.js`)
- ✅ `/assets/adaylar/` → `./assets/adaylar/` (95+ fotoğraf yolu)

## 📁 Dosya Yapısı

```
BBO_2023-24/
├── index.html              (Ana sayfa - ./ ile başlar)
├── adaylar-data.js        (Veri dosyası - ./ ile başlar)
├── styles.css
│
├── assets/
│   ├── bbologo.png
│   ├── compeclogo.png
│   ├── instagram.png
│   ├── favicon/
│   └── adaylar/           (95+ aday fotoğrafı)
│
├── Adaylar/
│   ├── index.html         (../ ile üst klasöre erişir)
│   ├── script.js
│   └── styles.css
│
└── Oylama/
    ├── index.html         (../ ile üst klasöre erişir)
    ├── script.js
    └── styles.css
```

## 🎯 Göreli Yol Mantığı

### Ana Klasörden (`index.html`):
- `./assets/` → Aynı klasördeki assets
- `./Adaylar/` → Aynı klasördeki Adaylar klasörü
- `./index.html` → Aynı klasördeki dosya

### Alt Klasörlerden (`Adaylar/` veya `Oylama/`):
- `../assets/` → Bir üst klasördeki assets
- `../index.html` → Bir üst klasördeki ana sayfa
- `./index.html` → Kendi klasöründeki dosya

## 🚀 Test Etme

Artık siteyi doğrudan tarayıcıda açabilirsiniz:

1. **Dosya Yöneticisinde:**
   - `index.html` dosyasına çift tıklayın
   - Veya sağ tık → Birlikte Aç → Tarayıcı seçin

2. **URL:**
   ```
   file:///C:/Users/utkud/OneDrive/Masaüstü/siteler/bbö/BBO_2023-24/index.html
   ```

3. **Tüm bağlantılar çalışacak:**
   - ✅ Ana sayfa navigasyonu
   - ✅ Adaylar sayfası
   - ✅ Oylama sayfası
   - ✅ Tüm görseller
   - ✅ Dinamik içerik

## ⚠️ Önemli Notlar

### Çalışacak Özellikler:
- ✅ Tüm sayfalar arası navigasyon
- ✅ Tüm görseller
- ✅ CSS stilleri
- ✅ JavaScript dosyaları
- ✅ Dinamik aday yükleme

### FingerprintJS CDN Hakkında:
- ⚠️ FingerprintJS CDN üzerinden yükleniyor
- ⚠️ `file://` protokolünde CORS hatası alabilirsiniz
- ✅ Web sunucusunda (http:// veya https://) sorunsuz çalışır

### Çözüm:
Test için basit bir web sunucusu kullanın:

#### Python ile:
```bash
cd "C:\Users\utkud\OneDrive\Masaüstü\siteler\bbö\BBO_2023-24"
python -m http.server 8000
```
Sonra tarayıcıda: `http://localhost:8000`

#### VS Code ile:
- "Live Server" eklentisini yükleyin
- `index.html` üzerinde sağ tık → "Open with Live Server"

## 🔄 Sunucuya Yükleme

Sunucuya yüklerken hiçbir değişiklik yapmaya gerek yok! Göreli yollar her ortamda çalışır:

```
www.siteniz.com/
├── index.html          ✅
├── adaylar-data.js     ✅
├── assets/             ✅
├── Adaylar/            ✅
└── Oylama/             ✅
```

## 📊 Değişiklik İstatistikleri

- **Değiştirilen Dosya Sayısı:** 4
- **Güncellenen Yol Sayısı:** 100+
- **Manuel Düzenleme:** 0
- **Otomatik Düzenleme:** Tümü

---

**Güncelleme Tarihi:** 29 Kasım 2025  
**Durum:** ✅ Tamamlandı  
**Sürüm:** 2.1
