# Piccola Vita — Yapılanlar Raporu

**Tarih:** 08.07.2026
**Canlı adres:** https://piccolavita.netlify.app · https://salihzekip.github.io/piccolavita/
**GitHub:** https://github.com/salihzekip/piccolavita
**Kapsam:** `CHANGELOG.md` (v3.1.0, 05.07.2026) sonrası yapılan, henüz dokümante edilmemiş işler.

---

## 1. Modeller Navigasyonu ve Bölümü — 3 Kategoriye Göre Yeniden Yapılandırıldı
*(commit `88d9085`)*

- **Navbar → "Modeller" dropdown**: tıklanınca açılan menüde üç kategori:
  - **Premium Modeller**: Uşak, Foça, Bodrum, Milas, Nikfer, Tavas, Honaz, İnciraltı
  - **Baz Modeller**: 8m, 9m, 10m
  - **Ofis** ve **Sabit Tiny**
  - Premium ve Baz başlıklarının üzerine gelince flyout alt menü açılıyor
  - Mobilde aynı yapı `<details>` akordiyonlarıyla uygulandı
- **Ana sayfa "Modellerimiz" bölümü**: mevcut 6 kart premium isimleriyle yeniden adlandırıldı (görsel/ölçüler korundu), yeni bir **"Ofis Model"** kartı eklendi, Baz Modeller için 8/9/10 metre linkleri eklendi
- Ticker, başlık ve CTA metinlerindeki **"28 Model"** ifadesi **"8 Premium, 3 Baz, Sabit ve Ofis Modeli"** şeklinde güncellendi
- Değişiklik hem kök `index.html` hem `v3/index.html` dosyalarına uygulandı

## 2. Hero Görseli — Gerçek Müşteri Fotoğrafı + Işık/Kontrast Ayarları
*(commit'ler `a95e7e2`, `7ffe1c8`, `1b86e99`, `759775c`)*

- Hero bölümüne gerçek bir müşteri teslimat fotoğrafı eklendi, overlay parlatıldı
- Ardından üç ayrı ince ayar geçişi yapıldı: önce kontrast/parlaklık artırıldı, sonra kontrast düşürülüp aydınlık artırıldı, son olarak görsel daha da yumuşatılarak aydınlık ve dengeli bir görünüme sabitlendi

## 3. React Alternatif Site Yayına Alındı
*(commit `15241f6`)*

- `piccolavita-site` (React + Vite + TypeScript) projesinin build çıktısı `/alternatif/` klasörü altına eklendi
- Asset yolları alt klasörde çalışacak şekilde `--base=./` ile derlendi
- Canlı adres: https://salihzekip.github.io/piccolavita/alternatif/
- Detaylı rapor: `ALTERNATIF-SITE.md`

## 4. Dağıtım
- Bu oturumda: `git push origin main` ile GitHub'a gönderildi, `netlify deploy --prod` ile **piccolavita** Netlify projesine (site: piccolavita.netlify.app) yayınlandı

---

## Açık Maddeler
- **png1.jpg** (Desktop → `piccolavitazekisite/` klasörüne yüklenen görsel) henüz siteye entegre edilmedi — hangi bölüme/modele ekleneceği netleşince eklenecek
- `CHANGELOG.md`'deki "Yapılmayanlar" listesi (renk paleti, tipografi, fotoğraf tutarlılığı) hâlâ geçerli
