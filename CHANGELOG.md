# Piccola Vita — Site Değişiklik Günlüğü

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
