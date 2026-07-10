# Milas Galerisi — Yapılanlar Raporu

**Tarih:** 10.07.2026
**Canlı adres:** https://piccolavita.netlify.app
**GitHub:** https://github.com/salihzekip/piccolavita

---

## 1. Başlangıç Durumu

Yerel projede (`piccolavita/`) Milas galerisi hazırlanmıştı (50 foto + 22 video) ama:
- Hiç commit/push edilmemişti
- **Netlify projesi hiçbir GitHub reposuna bağlı değildi** ("Not linked") — deploy'lar git push ile değil, `netlify deploy` CLI komutuyla manuel yapılıyor
- Canlı sitede Milas kartı hâlâ eski haliyle görünüyordu: yanlış konum ("Kaş/Antalya, 2024"), tek fotoğraf, eski fiyat (800.000 TL)

## 2. Galerinin Yayına Alınması
*(commit `f3b2d43`)*

- `index.html`, `milas-galeri.html`, `assets/images/milas/` (50 foto), `assets/videos/milas/` (22 video) commit'lendi
- Konum düzeltildi: **Kaş/Antalya, 2024 → Milas/Muğla, 2026**
- Fiyat/ölçü güncellendi: **800.000 TL → 1.250.000 TL**, **20.4 m² → 26 m²**
- GitHub'a push edildi, klasör `netlify link` ile piccolavita projesine bağlandı, `netlify deploy --prod` ile canlıya alındı

## 3. Belirtilen 37 Medyanın Silinmesi
*(commit `2b8955e`)*

Kullanıcının verdiği galeri sıra numaralarına göre (1-50 fotoğraf, 51-72 video) silindi:

- **27 fotoğraf silindi:** 04, 07, 09, 12, 15, 17, 19, 24, 25, 26, 30, 31, 32, 34, 35, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50
- **10 video silindi:** 01, 02, 03, 06, 07, 10, 13, 14, 17, 19
- Kalan: 23 foto + 12 video = 35 medya
- `index.html` (modeller kartı + teslim edilen projeler kartı) ve `milas-galeri.html`'deki referanslar güncellendi, sayaçlar 1/72 → 1/35 yapıldı
- Dosyalar diskten de silindi

## 4. Kalan Medyanın Yeniden Numaralandırılması

Silme sonrası oluşan boşluklu sıra (01,02,03,05,06,08...) baştan sıralı hale getirildi:

- **Fotoğraflar:** eski 01,02,03,05,06,08,10,11,13,14,16,18,20,21,22,23,27,28,29,33,36,37,39 → yeni **01-23**
- **Videolar:** eski 04,05,08,09,11,12,15,16,18,20,21,22 → yeni **01-12**
- Dosyalar iki aşamalı (temp isim üzerinden) yeniden adlandırıldı, çakışma olmadı
- `index.html` (iki blok) ve `milas-galeri.html`'deki tüm `src` referansları yeni numaralara güncellendi
- Kırık link kontrolü yapıldı, hepsi doğrulandı

## 5. Sonuç

- **Milas galerisi:** 23 foto + 12 video = 35 medya, sıralı ve boşluksuz
- Canlı sitede doğrulandı: `milas-galeri.html` "1 / 35" gösteriyor, ana sayfadaki iki kart da "1/35" sayacıyla doğru çalışıyor
- Fiyat: 1.250.000 TL · Alan: 26 m² · Konum: Milas / Muğla, 2026

## Dağıtım Notu

Bu proje **git-tabanlı otomatik deploy kullanmıyor**. Değişiklik yapıldıktan sonra canlıya almak için:
```
git add <dosyalar> && git commit -m "..." && git push origin main
netlify deploy --prod --dir=.
```
Sadece `git push` yapmak Netlify'da hiçbir şeyi tetiklemez.
