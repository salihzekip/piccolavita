# Alternatif Site (React) — Yapılan İşler Raporu

**Canlı adres:** https://salihzekip.github.io/piccolavita/alternatif/
**Kaynak proje:** `piccolavita-site` (React + Vite + TypeScript — ayrı lokal repo)
**Not:** Bu site, ana adresteki statik v3 sitesinin React ile yazılmış alternatifidir.

---
# Piccola Vita — Yapılan İşler Raporu

**Tarih:** 5 Temmuz 2026
**Çalışılan proje:** `piccolavita-site` (React + Vite + TypeScript sitesi)
**Referans:** `piccolavita-gorevler.md` görev listesi + `localhost:8642/v3/` (eski statik site)

---

## 0. Altyapı

- [x] `git init` yapıldı, ilk commit atıldı (`65d7f3d` — 29 dosya)
- [x] Git kimliği repo'ya lokal ayarlandı (Salih Zeki Pehlivan)
- [x] `.claude/settings.local.json` `.gitignore`'a eklendi

## Ön analiz

Görev listesi eski v3 statik sitesi için yazılmıştı. localhost:8642/v3/ kontrol
edildiğinde içerik maddelerinin çoğunun (galeri, fiyat tablosu, 8 soruluk SSS,
form backend'i, Ken Burns) **v3'te zaten yapılmış** olduğu görüldü — ancak React
sitesinde hiçbiri yoktu. Bu yüzden v3'teki hazır gerçek içerik React sitesine
taşındı; iki sitede de olmayan maddeler (harita embed, outline footer, grain,
tilt) sıfırdan eklendi.

---

## BÖLÜM 1 — İçerik maddeleri

### ✅ 1. Projeler Galerisi — YENİ (`src/components/Projects.tsx`)
- "500+ Teslimat, 500+ Mutlu Hikaye" başlıklı koyu zeminli bölüm
- 6 gerçek teslimat fotoğrafı (piccolavita.com'dan: Luna/Muğla, Arte/Sapanca, Centro/Urla, Comfort/Kaş, Florin/Abant, Plain/Çeşme)
- Her fotoğrafta model adı + konum/yıl etiketi
- Tıklayınca lightbox: ileri/geri okları, Escape/ok tuşu desteği, animasyonlu geçiş

### ✅ 2. Müşteri Yorumları — YENİDEN YAZILDI (`References.tsx`)
- Statik grid → **otomatik dönen slider** (6 sn, hover'da durur, ok + nokta kontrolleri)
- v3'teki 4 gerçek yorum taşındı (Ayşe & Mehmet K./Luna, Serkan D./Arte, Elif T./Centro, Murat & Zeynep A./Comfort)
- Her yorumda: isim, konum, **model adı**, yıldız puanı (4 ve 5 yıldız karışık — gerçekçi)
- **Google Yorumları dış linki** eklendi (gerçek Maps işletme sayfası)

### ✅ 3. SSS — GENİŞLETİLDİ (`Contact.tsx`)
- 5 soru → **8 soru** (v3'teki gerçek cevaplarla değiştirildi)
- Eklenen sorular: "Nereye kurabilirim?", "Kışın yaşanabilir mi?", "Garanti kapsamı nedir?", "Modelimi özelleştirebilir miyim?"
- Cevaplar artık gerçek bilgiler içeriyor (O2 tip onayı, %50+%50 ödeme, 45–60 gün teslimat, 24 ay garanti)

### ✅ 4. İletişim Formu — TAMAMLANDI (`Contact.tsx`)
- **E-posta alanı** eklendi (zorunlu)
- Model dropdown'ı gerçek modellerle güncellendi (Arte, Luna, Centro, Comfort, Florin, Plain + "Kararsızım")
- Form artık **gerçekten gönderiyor**: `formsubmit.co/ajax/info@piccolavita.com` (v3 ile aynı backend)
- Hata durumu için WhatsApp'a yönlendiren mesaj eklendi
- KVKK notu eklendi ("Bilgileriniz yalnızca size dönüş yapmak için kullanılır")
- WhatsApp butonu korundu ✓

### ✅ 5. Fiyat Karşılaştırma — YENİ (`src/components/Pricing.tsx`)
- v3'teki gerçek fiyat tablosu taşındı: 6 model × (büyüklük, başlangıç fiyatı, teslim süresi)
- Luna'da "En Popüler" rozeti
- Her satırda modele özel mesajlı WhatsApp "Teklif Al" butonu
- Mobilde tablo kart görünümüne dönüşüyor (data-label tekniği)
- Dipnot: %50+%50 ödeme, ilk 300 km ücretsiz nakliye

### ✅ 6. Konum Haritası — YENİ (`src/components/MapSection.tsx`)
- Footer üstüne Google Maps embed'i (PiccolaVita Tiny House pin'i görünüyor, 4.9★)
- Üstünde adres bandı + "Yol Tarifi Al" butonu
- **Not:** Bu madde v3'te de yoktu — iki sitede de ilk kez yapıldı

---

## BÖLÜM 2 — Tasarım maddeleri

### ✅ b) Hero — Ken Burns + grain
- Tek seferlik zoom yerine **32 sn'lik döngülü Ken Burns** animasyonu (v3'ten taşındı)
- `prefers-reduced-motion` desteği
- SVG feTurbulence ile **grain/noise dokusu** overlay'i
- Hero görseli Unsplash yerine gerçek Luna fotoğrafı

### ✅ c) İmza etkileşim — TAMAM
- Model kartlarına hover'da **hafif tilt** (-0.6° dönme + yukarı kayma) eklendi (zoom zaten vardı)
- **Kelime kelime başlık fade-up** eklendi (`AnimatedTitle.tsx`, motion whileInView + kelime başına 0.07 sn gecikme) — tüm bölüm başlıklarında aktif

### ✅ f) Boşluk disiplini — TAMAM
- Bölüm arası dikey boşluk `clamp(96px, 11vw, 160px)`'e yükseltildi (maks. 160px hedefi)
- **Asimetrik 12 kolon grid** eklendi (≥1025px): "Neden" bölümü görsel 1–5 / içerik 7–13,
  İletişim bölümü SSS 1–7 / form 8–13; Süreç başlığı 2. kolondan başlıyor

### ✅ g) Mikro detaylar — TAMAM
- Footer'a dev **outline "PICCOLAVITA"** yazısı eklendi
- Footer'daki son emoji kalıntısı (✦) kaldırıldı → görev (a) %100 tamam
- **Lenis smooth scroll** eklendi (`anchors: true`, reduced-motion'da devre dışı)
- **Özel imleç** eklendi (`Cursor.tsx`): model kartlarında altın "İncele" rozeti,
  spring takipli; yalnızca fare olan cihazlarda

### ✅ d) Renk paleti — TAMAM
- `--white` saf beyazdan **kırık beyaza (#FCFAF6)** çevrildi — sitede artık saf beyaz zemin yok
  (koyu ton zaten #1A1814'tü, saf siyah hiç kullanılmıyordu)

### ✅ e) Tipografi — TAMAM
- Serif font **Cormorant Garamond → Fraunces** (Google Fonts, değişken font, optik boyut ekseni)
- Bölüm başlıkları **4–8rem clamp()** aralığına çıkarıldı (`clamp(4rem, 8vw, 8rem)`)
- Dar kolon başlıkları için `--col` varyantı; ≤560px ekranda taşma önleyici kırılım

### ✅ h) Fotoğraf tutarlılığı
- Tüm Unsplash placeholder'ları gerçek Piccola Vita fotoğraflarıyla değiştirildi
  (hero, 5 model kartı, 6 proje fotoğrafı — hepsi aynı render/çekim dilinde)
- "Neden" bölümündeki gözden kaçan kırık Unsplash görseli de `luna2.jpg` ile değiştirildi

---

## Bonus: Gerçek veri düzeltmeleri

Sitedeki uydurma bilgiler v3'teki gerçek verilerle değiştirildi:

| Eski (uydurma) | Yeni (gerçek) |
|---|---|
| Est. 1998 / 25+ yıl | **Est. 1989 / 35 yıl** |
| 5 yıl garanti | **24 ay garanti** |
| 8–10 hafta teslimat | **45–60 gün** |
| 12 ilden sipariş | **81 ile teslimat** |
| Foresta, Moderno (olmayan modeller) | **Comfort, Luna, Arte, Centro, Plain** (gerçek m² değerleriyle) |
| WhatsApp: 0258 251 00 21 (sabit hat) | **0532 452 15 22** (tüm wa.me linkleri) |
| — | Footer'a ISO 9001 · ISO 14001 · TSE · O2 rozetleri, 0532 hattı, e-posta |

Navbar'a "Fiyatlar" ve "Projeler" linkleri eklendi.

---

## Doğrulama

- `npm run build` (tsc + vite) ✅ hatasız
- `npm run lint` ✅ hatasız
- `localhost:4173` (vite preview) üzerinde tarayıcıyla gezildi: hero Ken Burns,
  fiyat tablosu, galeri + lightbox, yorum slider'ı, 8'li SSS, e-postalı form,
  harita pin'i ve outline footer görsel olarak doğrulandı ✅

## Kalan işler (görev listesinden)

Görev listesindeki tüm maddeler tamamlandı. Dışarıya bağımlı iki iş bekliyor:

1. **b) devamı** — hero'ya drone video (müşteriden video gelince)
2. formsubmit.co'nun info@piccolavita.com için aktive edildiğinin teyidi (ilk gönderimde aktivasyon maili ister)

---

# PWA Dönüşümü (6 Temmuz 2026)

Alternatif site telefona kurulabilir bir uygulamaya (PWA) dönüştürüldü — ayrıntılar
`piccolavita-site/YAPILANLAR.md` dosyasında. Özet: vite-plugin-pwa + manifest +
PV monogramlı uygulama ikonları + Workbox çevrimdışı önbelleği (site dosyaları,
piccolavita.com fotoğrafları, Google Fonts). localhost'ta service worker doğrulandı.
Yeni build `alternatif/` klasörüne kopyalandı; canlıya çıkması için commit + push gerekiyor.

**Telefona kurulum (yayına alındıktan sonra):** siteyi telefonda aç →
Android/Chrome: "Yükle" · iPhone/Safari: Paylaş → "Ana Ekrana Ekle".
