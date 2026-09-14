// Cloudflare Worker for piccolavita.com — serves the static site (this repo root as the asset
// directory) and reimplements the two former Netlify Functions plus the netlify.toml redirect
// rules, so the frontend HTML needs zero changes (same /.netlify/functions/* paths kept).

const ASP_REDIRECTS = {
  "/arte_tiny_house.asp": "/10metre-arte-galeri.html",
  "/studio_tiny_house.asp": "/studio-galeri.html",
  "/cesme.asp": "/comfort-galeri.html",
  "/tiny_house_modelleri.asp": "/tum-modeller.html",
  "/centro_tiny_house.asp": "/tum-modeller.html",
  "/piccolavita.asp": "/",
  "/belgeler.asp": "/",
  "/lavoro_tiny_office.asp": "/lavoro-galeri.html",
  "/akyaka.asp": "/akyaka-galeri.html",
  "/bayilik.asp": "/",
  "/acipayam.asp": "/acipayam-galeri.html",
  "/cameli.asp": "/cameli-galeri.html",
  "/cesme_zeytinler.asp": "/cesme2-galeri.html",
  "/didim.asp": "/luna-galeri.html",
  "/dim.asp": "/dim-galeri.html",
  "/urla.asp": "/urla-galeri.html",
  "/luna_tiny_house.asp": "/luna-galeri.html",
  "/comfort_tiny_house.asp": "/10metre-comfort-galeri.html",
  "/studio_tiny_ofis.asp": "/studio-galeri.html",
  "/blog_araziye_tiny_house_koymak_yasalmi.asp": "/tiny-house-yasal-mi.html",
  "/tiny_house_nedir.asp": "/tiny-house-nedir.html",
  "/blog/": "/blog.html",
  "/biten.asp": "/",
  "/bize-ulasin.asp": "/",
  "/iletisim.asp": "/",
  "/gizlilik.asp": "/",
  "/ik.asp": "/",
  "/index.asp": "/",
  "/sss.asp": "/",
  "/aura_tiny_house.asp": "/tum-modeller.html",
  "/castello_tiny_house.asp": "/tum-modeller.html",
  "/dimora_tiny_house.asp": "/tum-modeller.html",
  "/florin_tiny_house.asp": "/tum-modeller.html",
  "/foresta_tiny_house.asp": "/tum-modeller.html",
  "/freya_tiny_house.asp": "/tum-modeller.html",
  "/moderno_tiny_house.asp": "/tum-modeller.html",
  "/natura_tiny_house.asp": "/tum-modeller.html",
  "/nerina_tiny_house.asp": "/tum-modeller.html",
  "/nova_tiny_house.asp": "/tum-modeller.html",
  "/opera_tiny_house.asp": "/tum-modeller.html",
  "/silva_tiny_house.asp": "/tum-modeller.html",
  "/vacanza_tiny_house.asp": "/tum-modeller.html",
  "/vento_tiny_house.asp": "/tum-modeller.html",
  "/verde_tiny_house.asp": "/tum-modeller.html",
  "/vista_tiny_house.asp": "/tum-modeller.html",
  "/vita_tiny_house.asp": "/tum-modeller.html",
  "/hotel_tiny_house.asp": "/tum-modeller.html",
  "/plain_tiny_house.asp": "/tum-modeller.html",
  "/ozel_tasarim_tiny_house.asp": "/tum-modeller.html",
  "/kisiye_ozel.asp": "/tum-modeller.html",
  "/standart.asp": "/tum-modeller.html",
  "/elora_tiny_ofis.asp": "/#projeler",
  "/oliva_tiny_ofis.asp": "/#projeler",
  "/solena_tiny_ofis.asp": "/#projeler",
  "/terra_tiny_ofis.asp": "/#projeler",
  "/vera_tiny_ofis.asp": "/#projeler",
  "/vivano_tiny_ofis.asp": "/#projeler",
  "/ofis_tiny_house.asp": "/#projeler",
};

// Catalog PDFs are too large for Cloudflare Workers static assets (53MB/69MB, over the 25MB
// per-file limit) and R2 isn't enabled on this account yet, so these two paths are proxied
// straight through to the (still-live) Netlify deployment instead of being bundled as assets.
const PROXIED_DOCS = new Set([
  "/assets/docs/piccolavita-katalog-2026-eylul.pdf",
  "/assets/docs/piccolavita-ornek-projeler-katalogu.pdf",
]);
const DOCS_ORIGIN = "https://piccolavita.netlify.app";

// Paths that keep X-Robots-Tag: noindex (mirrors netlify.toml [[headers]] blocks)
const NOINDEX_PREFIXES = ["/v3/", "/alternatif/"];
const NOINDEX_EXACT = new Set([
  "/piccolavita-combined.html",
  "/katalog-tesekkur.html",
  "/ornek-projeler-tesekkur.html",
  "/YAPILANLAR.md",
  "/CHANGELOG.md",
  "/ALTERNATIF-SITE.md",
  "/MILAS-GALERI-RAPORU.md",
  "/README.md",
]);

function isNoindex(path) {
  if (NOINDEX_EXACT.has(path)) return true;
  return NOINDEX_PREFIXES.some((p) => path.startsWith(p));
}

const SYSTEM_PROMPT = `Sen Picco'sun — Piccola Vita Tiny House'un web sitesindeki AI asistanısın. Denizli'nin en köklü atölyelerinden birinde, 1989'dan bu yana (35+ yıl) tiny house üreten bir aile firmasını temsil ediyorsun.

KİMLİK VE TON
- Sıcak, samimi ama profesyonel bir Türkçe kullan. Kısa ve net cevaplar ver (genelde 2-5 cümle), gereksiz uzatma.
- Kendini "Picco" olarak tanıt, bir insan gibi değil şeffafça bir AI asistan olduğunu belirt (sorulursa).
- Emin olmadığın, aşağıdaki bilgilerde yer almayan bir şey sorulursa UYDURMA — "bu konuda kesin bilgi veremem, ekibimize WhatsApp'tan (0532 452 15 22) ya da 0258 251 00 21'den ulaşabilirsiniz" de.
- Fiyat, ödeme, sözleşme gibi bağlayıcı konularda son sözü her zaman insan ekibe bırak; sen sadece yönlendirici bilgi ver.

FİRMA BİLGİLERİ
- 35+ yıllık üretim deneyimi, Denizli merkezli atölye.
- 150+ tamamlanmış teslimat, Türkiye'nin 81 iline kurulum yapılıyor.
- Sertifikalar: O2 Avrupa tip onayı (2018/858 AB yönetmeliği), ISO 9001, ISO 14001, TSE.
- Evler şasi üzerine, O2 tip onaylı römork statüsünde üretilir — yapı değil araç sınıfındadır, bu yüzden imar ruhsatı GEREKMEZ; çekme belgesiyle kayıt edilir. (Bölgeye göre belediye uygulamaları farklılık gösterebilir, kesinleştirmeden önce ekip bilgilendirir.)
- Kurulum yeri: kendi arazi, kiralık arazi, hobi bahçesi, kamp/karavan alanı — düz zemin ve araç girişine uygun yol yeterli.
- Kışın yaşanabilir: duvar/taban/çatıda tam yalıtım, ısı yalıtımlı çift cam, buhar bariyeri standart. Talebe göre soba/şömine bacası eklenebilir.
- Elektrik/su: şebekeye hazır tesisatla teslim edilir (dış elektrik bağlantısı, temiz su girişi, atık su çıkışı standart). Şebeke olmayan arazilerde güneş paneli, su deposu, foseptik için proje desteği verilir.
- Ödeme planı: %50 sözleşmede, %50 teslimatta. Ara ödeme talep edilmez. Üretim süresince özel bir WhatsApp grubundan süreç şeffaf şekilde takip edilir.
- Teslimat süresi: sözleşme ve mimari çizim onayından sonra ortalama 45-60 gün. İlk 300 km nakliye ücretsiz.
- Garanti: teslimattan itibaren 24 ay kapsamlı garanti (taşıyıcı şasi, su geçirmezlik, elektrik/su tesisatı dahil). Satış sonrası teknik destek ve periyodik bakım var.
- Özelleştirme: 14 modelin tamamı özelleştirilebilir — dış cephe kaplaması, iç malzemeler, mobilya, teknik donanım, oda düzeni. Mimarlar müşteri onayı olmadan üretime başlamaz.

MODEL KATALOĞU (14 model: 10 Premium, 2 Eko [her biri 8m/9m/10m olmak üzere 3 uzunluk seçeneğiyle], 1 Sabit, 1 Ofis)
Premium modeller (büyüklük · başlangıç fiyatı · teslim süresi, hepsi 45-60 gün):
- Milas: 26 m² · 8m · 1.250.000 TL
- Foça (en popüler): 40 m² · 10m · 1.850.000 TL
- Uşak: 30 m² · 9m · 1.450.000 TL
- Nikfer: 40 m² · 10m · 1.750.000 TL
- Tavas: 40 m² · 10m · 1.650.000 TL
- Honaz: 40 m² · 10m · 1.550.000 TL
- İnciraltı: 40 m² · 10m · 1.650.000 TL
- Çeşme (Premium model, Eko Comfort ile karıştırılmasın): 20 m² · 8m · 1.450.000 TL
- Didim: 30 m² · 8m · 1.450.000 TL
- Sinpaş: 30 m² · 9m · 1.450.000 TL
Eko modeller (Comfort ve Arte hattı, her biri 3 uzunlukta):
- 8 Metre Comfort: 20 m² · 1.250.000 TL
- 9 Metre Comfort: 30 m² · 1.450.000 TL
- 10 Metre Comfort: 40 m² · 1.650.000 TL
- 10 Metre Arte: 40 m² · 10m · 1.650.000 TL
Ofis modeli:
- Banaz: 20 m² · 8m · 900.000 TL (ofis ve sabit yaşam alanı çözümü)
Sabit model:
- Sabit (3+1): 90 m² · 11m · 4.500.000 TL (sabit temel, iki katlı geniş yaşam alanı)

Not: Ana sayfa hero'sunda genel "800.000 TL'den başlayan fiyatlarla" ifadesi kullanılıyor; kesin başlangıç fiyatı yukarıdaki tabloya göre modele bağlı değişir (en uygun: Banaz 900.000 TL). Fiyatlar standart donanım içindir, kesin fiyat için ücretsiz teklif önerilir.

İLETİŞİM
- WhatsApp: +90 532 452 15 22 (öncelikli kanal — hızlı ve doğrudan)
- Telefon: 0 (258) 251 00 21
- E-posta: info@piccolavita.com
- Adres: Hacıeyüplü Mah. Merkezefendi / Denizli

DAVRANIŞ KURALLARI
- Ziyaretçi bir model, fiyat veya teslimat hakkında soru sorarsa yukarıdaki verilerle doğrudan cevap ver.
- Ziyaretçi teklif almak, sözleşme yapmak, arazisini değerlendirmek veya kesin/bağlayıcı bilgi istiyorsa nazikçe WhatsApp'a yönlendir (numarayı ver).
- Asla yukarıdaki listede olmayan bir model, fiyat, özellik ya da teslimat tarihi uydurma.
- Rakip firmalar hakkında yorum yapma, sadece Piccola Vita hakkında konuş.
- Türkçe karakterleri doğru kullan (ğ, ş, ö, ç, ü, ı).`;

const MODEL = "claude-haiku-4-5-20251001";
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1000;
const LANG_NAMES = { en: "English", de: "German", fr: "French", bg: "Bulgarian", da: "Danish" };

async function handlePiccoChat(request, env) {
  const headers = { "Content-Type": "application/json" };

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({
      reply: "Şu an bağlantı kuramıyorum. Hemen bilgi almak için WhatsApp'tan yazabilirsiniz: 0532 452 15 22",
      error: "missing_api_key",
    }), { status: 200, headers });
  }

  let payload;
  try {
    payload = JSON.parse((await request.text()) || "{}");
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers });
  }

  const langName = LANG_NAMES[payload.lang];
  const systemPrompt = langName
    ? `${SYSTEM_PROMPT}\n\nLANGUAGE OVERRIDE\n- Reply ONLY in ${langName}, regardless of the language the visitor writes in — this is the ${langName} version of the site.\n- Keep proper nouns as-is (Picco, Piccola Vita, Pico 001 etc., Denizli), and keep prices in TL and measurements in the units given above.`
    : SYSTEM_PROMPT;

  const incomingMessages = Array.isArray(payload.messages) ? payload.messages : [];
  const trimmedHistory = incomingMessages
    .slice(-MAX_HISTORY_MESSAGES)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

  if (trimmedHistory.length === 0 || trimmedHistory[trimmedHistory.length - 1].role !== "user") {
    return new Response(JSON.stringify({ error: "no_user_message" }), { status: 400, headers });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: systemPrompt,
        messages: trimmedHistory,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Anthropic API error", res.status, errText);
      return new Response(JSON.stringify({
        reply: "Şu an cevap veremiyorum, birazdan tekrar deneyin ya da WhatsApp'tan yazın: 0532 452 15 22",
        error: "upstream_error",
      }), { status: 200, headers });
    }

    const data = await res.json();
    const reply = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim() || "Üzgünüm, bir cevap üretemedim. WhatsApp'tan yazabilirsiniz: 0532 452 15 22";

    return new Response(JSON.stringify({ reply }), { status: 200, headers });
  } catch (err) {
    console.error("Picco chat function error", err);
    return new Response(JSON.stringify({
      reply: "Bir bağlantı sorunu oluştu. WhatsApp'tan yazabilirsiniz: 0532 452 15 22",
      error: "exception",
    }), { status: 200, headers });
  }
}

const RESEND_API = "https://api.resend.com/emails";
const FROM = "Piccola Vita <bildirim@piccolavita.com>";
const TEAM_EMAIL = "salihzekipehlivan@gmail.com";

const CATALOGS = {
  katalog: {
    notifySubject: "🔔 Katalog İndirildi — Bu kişiyi arayın veya mail atın",
    fileUrl: "https://piccolavita.com/assets/docs/piccolavita-katalog-2026-eylul.pdf",
    fileName: "Piccola Vita Kataloğu",
    customerSubject: "Piccola Vita Kataloğunuz Hazır",
  },
  "ornek-projeler": {
    notifySubject: "🔔 Örnek Projeler Kataloğu İndirildi — Bu kişiyi arayın veya mail atın",
    fileUrl: "https://piccolavita.com/assets/docs/piccolavita-ornek-projeler-katalogu.pdf",
    fileName: "Piccola Vita Örnek Projeler Kataloğu",
    customerSubject: "Örnek Projeler Kataloğunuz Hazır",
  },
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function handleSendCatalog(request, env) {
  const headers = { "Content-Type": "application/json" };

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing");
    return new Response(JSON.stringify({ ok: false, error: "missing_api_key" }), { status: 200, headers });
  }

  let payload;
  try {
    payload = JSON.parse((await request.text()) || "{}");
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers });
  }

  const name = String(payload.name || "").trim().slice(0, 200);
  const phone = String(payload.phone || "").trim().slice(0, 50);
  const email = String(payload.email || "").trim().slice(0, 200);
  const formType = CATALOGS[payload.formType] ? payload.formType : "katalog";
  const lang = ["en", "de", "fr", "bg", "da"].includes(payload.lang) ? payload.lang : "tr";

  if (!name || !phone || !email) {
    return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400, headers });
  }

  const cat = CATALOGS[formType];

  const sendEmail = (body) => fetch(RESEND_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });

  try {
    const [teamRes, customerRes] = await Promise.all([
      sendEmail({
        from: FROM,
        to: [TEAM_EMAIL],
        subject: cat.notifySubject,
        html: `<p><b>Ad Soyad:</b> ${escapeHtml(name)}</p>`
          + `<p><b>Telefon:</b> ${escapeHtml(phone)}</p>`
          + `<p><b>E-posta:</b> ${escapeHtml(email)}</p>`,
      }),
      sendEmail({
        from: FROM,
        to: [email],
        subject: cat.customerSubject,
        html: lang === "en"
          ? `<p>Hi ${escapeHtml(name)},</p>`
            + `<p>You can use the link below to download the ${escapeHtml(cat.fileName)} (PDF, in Turkish):</p>`
            + `<p><a href="${cat.fileUrl}">Download ${escapeHtml(cat.fileName)}</a></p>`
            + `<p>For questions, reach us on WhatsApp: `
            + `<a href="https://wa.me/905324521522">+90 532 452 15 22</a></p>`
          : lang === "de"
          ? `<p>Hallo ${escapeHtml(name)},</p>`
            + `<p>Über den folgenden Link können Sie ${escapeHtml(cat.fileName)} (PDF, auf Türkisch) herunterladen:</p>`
            + `<p><a href="${cat.fileUrl}">${escapeHtml(cat.fileName)} herunterladen</a></p>`
            + `<p>Bei Fragen erreichen Sie uns auf WhatsApp: `
            + `<a href="https://wa.me/905324521522">+90 532 452 15 22</a></p>`
          : lang === "fr"
          ? `<p>Bonjour ${escapeHtml(name)},</p>`
            + `<p>Vous pouvez utiliser le lien ci-dessous pour télécharger ${escapeHtml(cat.fileName)} (PDF, en turc) :</p>`
            + `<p><a href="${cat.fileUrl}">Télécharger ${escapeHtml(cat.fileName)}</a></p>`
            + `<p>Pour toute question, contactez-nous sur WhatsApp : `
            + `<a href="https://wa.me/905324521522">+90 532 452 15 22</a></p>`
          : lang === "bg"
          ? `<p>Здравейте, ${escapeHtml(name)},</p>`
            + `<p>По-долу можете да използвате връзката, за да изтеглите ${escapeHtml(cat.fileName)} (PDF, на турски език):</p>`
            + `<p><a href="${cat.fileUrl}">Изтеглете ${escapeHtml(cat.fileName)}</a></p>`
            + `<p>При въпроси можете да се свържете с нас в WhatsApp: `
            + `<a href="https://wa.me/905324521522">+90 532 452 15 22</a></p>`
          : lang === "da"
          ? `<p>Hej ${escapeHtml(name)},</p>`
            + `<p>Du kan bruge linket nedenfor til at downloade ${escapeHtml(cat.fileName)} (PDF, på tyrkisk):</p>`
            + `<p><a href="${cat.fileUrl}">Download ${escapeHtml(cat.fileName)}</a></p>`
            + `<p>Har du spørgsmål, er du velkommen til at kontakte os på WhatsApp: `
            + `<a href="https://wa.me/905324521522">+90 532 452 15 22</a></p>`
          : `<p>Merhaba ${escapeHtml(name)},</p>`
          + `<p>${escapeHtml(cat.fileName)} indirmek için aşağıdaki bağlantıyı kullanabilirsiniz:</p>`
          + `<p><a href="${cat.fileUrl}">${escapeHtml(cat.fileName)} - İndir</a></p>`
          + `<p>Sorularınız için WhatsApp'tan bize ulaşabilirsiniz: `
          + `<a href="https://wa.me/905324521522">0532 452 15 22</a></p>`,
      }),
    ]);

    if (!teamRes.ok) {
      console.error("Resend team email failed", teamRes.status, await teamRes.text().catch(() => ""));
    }
    if (!customerRes.ok) {
      console.error("Resend customer email failed", customerRes.status, await customerRes.text().catch(() => ""));
    }

    return new Response(JSON.stringify({ ok: teamRes.ok, customerOk: customerRes.ok }), { status: 200, headers });
  } catch (err) {
    console.error("send-catalog function error", err);
    return new Response(JSON.stringify({ ok: false, error: "exception" }), { status: 200, headers });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "POST" && path === "/.netlify/functions/picco-chat") {
      return handlePiccoChat(request, env);
    }
    if (request.method === "POST" && path === "/.netlify/functions/send-catalog") {
      return handleSendCatalog(request, env);
    }

    const redirectTo = ASP_REDIRECTS[path];
    if (redirectTo) {
      return Response.redirect(new URL(redirectTo, url.origin).toString(), 301);
    }

    if (PROXIED_DOCS.has(path)) {
      // netlify.app itself 301s to piccolavita.com (see the site's own netlify.toml redirect),
      // so this must explicitly follow rather than inherit the incoming request's redirect mode.
      return fetch(new URL(path, DOCS_ORIGIN).toString(), {
        method: request.method,
        headers: request.headers,
        redirect: "follow",
      });
    }

    // html_handling="none" (set to stop Cloudflare's default .html-stripping redirects, which
    // would fight the site's own canonical/hreflang/sitemap that all use explicit .html paths)
    // also disables its directory->index.html resolution, so do that part ourselves.
    const assetRequest = path.endsWith("/")
      ? new Request(new URL(path + "index.html" + url.search, url.origin), request)
      : request;

    const assetResponse = await env.ASSETS.fetch(assetRequest);
    if (assetResponse.status !== 404) {
      if (isNoindex(path)) {
        const resp = new Response(assetResponse.body, {
          status: assetResponse.status,
          statusText: assetResponse.statusText,
          headers: assetResponse.headers,
        });
        resp.headers.set("X-Robots-Tag", "noindex");
        return resp;
      }
      return assetResponse;
    }

    // Catch-all: unknown path -> homepage content, but keep a real 404 status
    // (mirrors the Netlify custom-404 rule so unmatched/garbage URLs don't get indexed as 200s).
    const indexResp = await env.ASSETS.fetch(new URL("/index.html", url.origin));
    return new Response(indexResp.body, { status: 404, headers: indexResp.headers });
  },
};
