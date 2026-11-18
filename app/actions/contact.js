'use server';

import { Resend } from 'resend';

const KINDS = {
  brand: 'Brand & website',
  editorial: 'Editorial site',
  ecom: 'E-commerce',
  product: 'Product / app',
  retainer: 'Studio retainer',
  other: 'Something else'
};

// Vercel caps a request body at 4.5 MB, so attachments stay under 4 MB in total.
const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const ALLOWED_EXT = /\.(pdf|docx?|key|pptx?|png|jpe?g|zip)$/i;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function sendContact(_prevState, formData) {
  // Honeypot: real people never see or fill this field. Pretend it worked so bots move on.
  if (String(formData.get('company_website') || '').trim() !== '') {
    return { status: 'success', name: '' };
  }

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const kindKey = String(formData.get('kind') || 'other');
  const msg = String(formData.get('msg') || '').trim();

  const errors = {};
  if (name.length < 2 || name.length > 120) errors.name = 'name';
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = 'email';
  if (msg.length < 10 || msg.length > 5000) errors.msg = 'msg';

  const files = formData.getAll('files').filter((f) => f && typeof f === 'object' && f.size > 0);
  const totalBytes = files.reduce((n, f) => n + f.size, 0);
  if (files.length > MAX_FILES || totalBytes > MAX_TOTAL_BYTES || files.some((f) => !ALLOWED_EXT.test(f.name))) {
    errors.files = 'files';
  }

  if (Object.keys(errors).length) return { status: 'invalid', errors };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || 'OGGEL digital <onboarding@resend.dev>';
  if (!apiKey || !to) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.');
    return { status: 'error' };
  }

  const kind = KINDS[kindKey] || KINDS.other;
  const attachments = await Promise.all(
    files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()) }))
  );

  const text = `New project brief from oggel.digital\n\nName: ${name}\nEmail: ${email}\nProject type: ${kind}\n\n${msg}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">
      <h2 style="margin:0 0 16px">New project brief</h2>
      <p style="margin:0"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 16px"><strong>Project type:</strong> ${escapeHtml(kind)}</p>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(msg)}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(',').map((s) => s.trim()).filter(Boolean),
      replyTo: email,
      subject: `New brief from ${name} (${kind})`,
      text,
      html,
      attachments: attachments.length ? attachments : undefined
    });
    if (error) {
      console.error('Contact form: Resend error', error);
      return { status: 'error' };
    }
  } catch (err) {
    console.error('Contact form: send failed', err);
    return { status: 'error' };
  }

  return { status: 'success', name: name.split(' ')[0] };
}
