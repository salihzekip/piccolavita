const RESEND_API = 'https://api.resend.com/emails';
const FROM = 'Piccola Vita <bildirim@piccolavita.com>';
const TEAM_EMAIL = 'salihzekipehlivan@gmail.com';

const CATALOGS = {
  katalog: {
    notifySubject: '🔔 Katalog İndirildi — Bu kişiyi arayın veya mail atın',
    fileUrl: 'https://piccolavita.com/assets/docs/piccolavita-katalog-2026-eylul.pdf',
    fileName: 'Piccola Vita Kataloğu',
    customerSubject: 'Piccola Vita Kataloğunuz Hazır',
  },
  'ornek-projeler': {
    notifySubject: '🔔 Örnek Projeler Kataloğu İndirildi — Bu kişiyi arayın veya mail atın',
    fileUrl: 'https://piccolavita.com/assets/docs/piccolavita-ornek-projeler-katalogu.pdf',
    fileName: 'Piccola Vita Örnek Projeler Kataloğu',
    customerSubject: 'Örnek Projeler Kataloğunuz Hazır',
  },
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY missing');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'missing_api_key' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_json' }) };
  }

  const name = String(payload.name || '').trim().slice(0, 200);
  const phone = String(payload.phone || '').trim().slice(0, 50);
  const email = String(payload.email || '').trim().slice(0, 200);
  const formType = CATALOGS[payload.formType] ? payload.formType : 'katalog';
  const isEn = payload.lang === 'en';

  if (!name || !phone || !email) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing_fields' }) };
  }

  const cat = CATALOGS[formType];

  const sendEmail = (body) => fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
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
        subject: isEn ? (cat.customerSubjectEn || cat.customerSubject) : cat.customerSubject,
        html: isEn
          ? `<p>Hi ${escapeHtml(name)},</p>`
            + `<p>You can use the link below to download the ${escapeHtml(cat.fileName)} (PDF, in Turkish):</p>`
            + `<p><a href="${cat.fileUrl}">Download ${escapeHtml(cat.fileName)}</a></p>`
            + `<p>For questions, reach us on WhatsApp: `
            + `<a href="https://wa.me/905324521522">+90 532 452 15 22</a></p>`
          : `<p>Merhaba ${escapeHtml(name)},</p>`
          + `<p>${escapeHtml(cat.fileName)} indirmek için aşağıdaki bağlantıyı kullanabilirsiniz:</p>`
          + `<p><a href="${cat.fileUrl}">${escapeHtml(cat.fileName)} - İndir</a></p>`
          + `<p>Sorularınız için WhatsApp'tan bize ulaşabilirsiniz: `
          + `<a href="https://wa.me/905324521522">0532 452 15 22</a></p>`,
      }),
    ]);

    if (!teamRes.ok) {
      console.error('Resend team email failed', teamRes.status, await teamRes.text().catch(() => ''));
    }
    if (!customerRes.ok) {
      console.error('Resend customer email failed', customerRes.status, await customerRes.text().catch(() => ''));
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: teamRes.ok, customerOk: customerRes.ok }) };
  } catch (err) {
    console.error('send-catalog function error', err);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'exception' }) };
  }
};
