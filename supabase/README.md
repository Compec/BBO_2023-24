# Oylama Altyapısı

COMPEC Bilişim Ödülleri oylaması **Supabase** üzerinde çalışır. Kurulumu tamamlanmıştır
ve **oylama açıktır**.

```
Tarayıcı ──POST──▶ "oy-baslat" ──▶ tek kullanımlık jeton (IP'ye bağlı)
   │
   │  (kullanıcı formu doldurur, en az 20 sn)
   ▼
Tarayıcı ──POST──▶ "oy-ver" ──▶ oy_kaydet() ──▶ Postgres
                      │
                      ├── jeton geçerli / kullanılmamış / yeterince beklemiş mi
                      ├── IP'nin tuzlanmış özeti (ham IP saklanmaz)
                      └── service_role ile yazar
```

Eski sistemde tarayıcı doğrudan Firestore'a yazıyordu; mükerrer oy engeli yalnızca
istemci tarafındaydı. Artık bütün kontroller veritabanı içinde, tek bir atomik
işlemde yapılıyor — tarayıcıdan dolanılamıyor.

---

## Kurulu olanlar

| | |
|---|---|
| Proje | `compec-bilisim-odulleri` |
| Ref | `xjcccywqupnuhsrxuvdj` |
| Bölge | Frankfurt (eu-central-1) |
| Plan | Ücretsiz (0 $/ay) |
| Dashboard | https://supabase.com/dashboard/project/xjcccywqupnuhsrxuvdj |

* **Tablolar:** `kategoriler`, `adaylar`, `oy_pusulalari`, `oylar`, `oy_jetonlari`, `ayarlar`
* **Veri:** 15 kategori, 80 aday
* **Fonksiyonlar:** `jeton_uret()`, `oy_kaydet()` — bütün doğrulamalar burada
* **Görünümler:** `sonuclar`, `oylama_ozeti` — anon/authenticated için yetki iptal edildi
* **Edge Functions:** `oy-baslat`, `oy-ver`, `sonuclar` (hepsi `verify_jwt = false`)

---

## 🔒 Sonuçlar kimseye görünmüyor

Sitede hiçbir yerde oy sayısı yok. Teknik olarak da kapalı:

| Yol | Durum |
|---|---|
| `oylar`, `oy_pusulalari`, `oy_jetonlari`, `ayarlar` tabloları | RLS açık, politika yok → anon anahtarla **boş döner** |
| `sonuclar`, `oylama_ozeti` görünümleri | anon/authenticated yetkisi **iptal** → `permission denied` |
| `oy_kaydet`, `jeton_uret` fonksiyonları | anon çağrısı **reddedilir** |
| `sonuclar` Edge Function | **yönetici anahtarı** olmadan 401 |
| Sitedeki sonuç sayfası | **yok** — repoda bulunmuyor, `.gitignore` ile de engelli |

Sonuçları görmek için repo **dışındaki** yerel panel kullanılır:

```
...\siteler\bbö\compec-sonuclar.html
```

Bu dosya GitHub'a gitmez, siteye yüklenmez. Çift tıklayıp aç, yönetici anahtarını gir.

Yönetici anahtarının yalnızca SHA-256 özeti veritabanında tutulur. Değiştirmek için
SQL Editor'de:

```sql
select public.admin_anahtari_belirle('en-az-12-karakterli-yeni-parola');
```

---

## 🤖 Bot koruması

Katmanlar, en dıştan içe:

1. **Tek kullanımlık jeton.** Oylama sayfası açılırken `oy-baslat`'tan jeton alınır.
   Jeton IP'ye bağlıdır, tek kullanımlıktır ve oy gönderilirken **en az 20 saniye**
   beklemiş olmalıdır. Tek bir HTTP isteğiyle oy basmak mümkün değil: her oy için
   ayrı jeton alıp beklemek gerekir.
2. **Jeton üretim limiti.** Aynı IP saatte en fazla **150** jeton alabilir.
3. **Cihaz tekliği.** Aynı cihaz parmak izinden ikinci oy kabul edilmez (veritabanı
   seviyesinde `unique` kısıt — eş zamanlı iki istek bile geçemez). Asıl mükerrer
   oy engeli budur.
4. **IP limiti.** Aynı ağdan 24 saatte en fazla **30** pusula. Bu sayı bilerek
   yüksek: kampüs WiFi'ı ve mobil operatörler yüzlerce kişiyi tek IP'nin arkasına
   koyar, düşük bir limit gerçek seçmenleri engellerdi. Suistimal görürsen
   aşağıdaki sorgularla tespit edip düşürebilirsin.
5. **İçerik doğrulaması.** 15 kategorinin hepsi dolu olmalı ve her aday gerçekten o
   kategoriye ait olmalı; uydurma aday slug'ı reddedilir.
6. **CORS.** `oy-ver` ve `oy-baslat` yalnızca `bogazicibilisimodulleri.com`,
   `www.` sürümü ve localhost origin'lerine yanıt verir.
7. **Turnstile** (isteğe bağlı, şu an kapalı) — aşağıya bak.

Ayarları değiştirmek:

```sql
update public.ayarlar set deger = '30'::jsonb  where anahtar = 'ip_limit';
update public.ayarlar set deger = '24'::jsonb  where anahtar = 'ip_limit_saat';
update public.ayarlar set deger = '20'::jsonb  where anahtar = 'jeton_min_saniye';
update public.ayarlar set deger = '150'::jsonb where anahtar = 'jeton_ip_limit';
```

### Şüpheli hareket var mı? (yerel panelden veya SQL'den)

```sql
-- Aynı ağdan gelen pusulalar
select ip_hash, count(*), min(olusturma), max(olusturma)
from public.oy_pusulalari group by ip_hash having count(*) > 1 order by 2 desc;

-- Dakika dakika oy akışı (ani sıçrama = şüpheli)
select date_trunc('minute', olusturma) dk, count(*)
from public.oy_pusulalari group by 1 order by 1 desc limit 60;

-- Şüpheli bir pusulayı silmek (oyları da gider)
delete from public.oy_pusulalari where id = 'PUSULA_ID';
```

### Turnstile eklemek istersen

1. https://dash.cloudflare.com → Turnstile → yeni site
2. **Site key** → `site-config.js` içindeki `turnstileSiteKey`
3. **Secret key** → Dashboard → Edge Functions → Secrets → `TURNSTILE_SECRET`

İkisi de tanımlanmazsa oylama Turnstile olmadan çalışmaya devam eder.

---

## Oylamayı kapatma

İki anahtar bağımsız çalışır, **bitirirken ikisini birden kapat**.

Sunucu (asıl güvenlik anahtarı):
```sql
update public.ayarlar set deger = 'false'::jsonb where anahtar = 'oylama_acik';
```

Site — `site-config.js`:
```js
oylamaBitis:    '2026-12-20T23:59:59',
oylamaKapaliMi: true    // acil durumda, tarihten bağımsız kapatır
```

---

## Aday listesi değişirse

`adaylar-data.js` ile `supabase/migrations/0002_adaylar.sql` birlikte güncellenmeli —
oylar aday **slug**'ıyla eşleşiyor ve slug, görsel dosyasının adından türüyor.
SQL dosyası tekrar çalıştırılabilir; var olan kayıtları günceller.

## Test oylarını temizleme

```sql
truncate public.oylar, public.oy_pusulalari;
```

---

## Veri ve gizlilik

Saklananlar: cihaz parmak izi, IP'nin tuzlanmış SHA-256 özeti, user-agent, ekran
çözünürlüğü, zaman damgası ve seçimler. **Ham IP adresi hiçbir yerde saklanmaz**;
ad, e-posta, telefon gibi kişisel veri toplanmaz.
