# Piccola Vita — Site Değişiklik Günlüğü

## v3.1.0 — Eksik İçerikler + Tasarım Yükseltmesi (05.07.2026)

Canlı adres: **https://salihzekip.github.io/piccolavita/** (v3 kök adrese taşındı; eski `/v3/` linki de çalışmaya devam eder)

### Yeni bölümler (görev listesi Bölüm 1)
- **Tamamlanan Projeler** — 6 fotoğraflık grid galeri, konum + model etiketi, tıklayınca lightbox (ok tuşları ve ESC destekli)
- **Müşteri Yorumları** — 4 yorumluk otomatik slider (isim, konum, model, yıldız), gerçek Google Yorumları profiline dış link
- **SSS** — 8 soruluk akordiyon (ruhsat, kurulum yeri, kış yaşamı, elektrik/su, ödeme planı, teslimat süresi…)
- **İletişim Formu** — Ad, telefon, e-posta, model dropdown'u, mesaj; FormSubmit ile info@piccolavita.com'a iletiliyor; WhatsApp butonu korundu
- **Fiyat Karşılaştırma** — 6 modellik tablo: m², fiyat aralığı, teslim süresi, satır başına Teklif Al linki; mobilde kart görünümüne dönüşür
- **Konum Haritası** — Footer üstünde tam genişlik Google Maps embed'i (PiccolaVita Tiny House işletme kartı, Hacıeyüplü / Merkezefendi pin'i)

### Tasarım yükseltmesi (görev listesi Bölüm 2)
- **a) İkonlar** — Tüm emoji ikonlar 1.5px stroke minimal SVG ikon setiyle değiştirildi
- **b) Hero** — Ken Burns efektli fotoğraf + grain dokusu
- **c) İmza etkileşim** — Model kartlarında hover'da yavaş zoom (1sn) + hafif tilt; tüm bölüm başlıklarında kelime kelime fade-up animasyonu (bağımlılıksız, IntersectionObserver ile)
- **f) Boşluk disiplini** — Masaüstünde (≥1100px) ana bölümler arası 160px dikey boşluk
- **g) Mikro detaylar** — Lenis smooth scroll (reduced-motion desteği, modal açıkken durur); model kartlarında altın "İNCELE" özel imleci (yalnızca masaüstü); footer'da büyük outline PICCOLAVITA yazısı

### Yapılmayanlar ve nedenleri
- **d) Renk paleti** — Mevcut palet zaten hedefe uygun (krem #F8F5F0 zemin, orman yeşili #2F4A3D, toprak #8A5A3B); "renkleri koru" kuralı gereği dokunulmadı
- **e) Tipografi değişimi** — "Fontları koru" kuralıyla çeliştiği için Playfair Display + Montserrat korundu
- **h) Fotoğraf tutarlılığı** — Kod işi değil; profesyonel çekim/render seti gerektirir (açık madde)

### Diğer
- v3 site kök `index.html` olarak yayınlandı; form dönüş adresi kök URL'ye güncellendi
- İlgili commit'ler: `fc04b8b` (özellikler), `d799550` (kök taşıma)

---

## v3.0.0 — Kombine Site (Haziran 2026)

### Yeni: `piccolavita-combined.html`

Mevcut tüm HTML prototiplerindeki en iyi bölümler tek bir sayfada birleştirildi.

**Bölüm kaynakları:**
- **Nav + Hero** → `index (1).html` tasarım sistemi (Playfair Display + Montserrat, yeşil/kahverengi palet)
  - Slogan: "Özgürlüğünüzü Tasarlayın"
  - Fiyat etiketi: "800.000 TL'den başlayan fiyatlarla"
  - Yeni hero görseli gelecek (şu an: `luna1.jpg` placeholder)
- **CTA Çubuğu** → `piccolavita-complete.html` button stili
  - "Modelleri İncele" + "Ücretsiz Teklif Al" — sayfanın en üstünde (sticky)
- **Kayan Bant (Ticker)** → `piccolavita_website.html`
  - 28 Farklı Model · 24 Ay Garanti · Türkiye Çapında Kurulum · O2 Tip Onayı · ISO 9001 · TSE
- **İstatistik Çubuğu** → `piccolavita_website.html`
  - 28 model · 35+ yıl · 24 ay garanti · O2 tip onayı · ISO 9001 / TSE
- **Hikayemiz** → `piccolavita_website.html`
  - Karanlık orman teması (#111c11), koyu zemin üzerine altın başlık
  - Stats: 35+ yıl, 28 model, 500+ proje, 24 ay garanti

### Tasarım sistemi

| Token | Değer |
|---|---|
| `--primary` | `#2F4A3D` (koyu yeşil) |
| `--secondary` | `#8A5A3B` (kahverengi) |
| `--accent` | `#C8A36A` (altın) |
| `--forest` | `#111c11` (hikaye bg) |
| `--bg` | `#F8F5F0` (krem) |
| Font (başlık) | Playfair Display |
| Font (gövde) | Montserrat |

### İletişim bilgileri
- Tel 1: 0 (258) 251 00 21
- Tel 2: 0 (532) 452 15 22 (GSM / WhatsApp)
- Adres: Hacıeyüplü Mah. 3166/2 Sok. No:2, Merkezefendi / DENİZLİ
- WhatsApp: https://wa.me/905324521522

---

## v2.x — Önceki Prototipler

| Dosya | Notlar |
|---|---|
| `index (1).html` | Ana tasarım sistemi, hero layout |
| `index (2).html` | Daha ince tipografi versiyonu |
| `piccolavita_website.html` | Sinematik karanlık tema, ticker, hikaye |
| `piccolavita-complete.html` | Tam SPA — 28 model verisi, routing, galeri |
| `piccolayeniste/piccolavita_site_prototype.html` | Çok sayfalı prototip (encoding sorunu var) |
