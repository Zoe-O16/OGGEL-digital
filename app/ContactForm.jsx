'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { sendContact } from './actions/contact';

const COPY = {
  en: {
    name: 'Please add your name.',
    email: 'Looks like that email’s off.',
    msg: 'Tell me a little more.',
    files: 'Up to 5 files, 4 MB in total (pdf, doc, key, ppt, png, jpg, zip).',
    error: 'Something went wrong sending your message. Please try again in a moment.',
    sending: 'Sending…',
    send: 'Send brief',
    thanks: (n) => (n ? `Thanks, ${n}, got it.` : 'Thanks, got it.'),
    body: 'I’ll review your message personally.'
  },
  nl: {
    name: 'Vul je naam in.',
    email: 'Dat e‑mailadres lijkt niet te kloppen.',
    msg: 'Vertel iets meer.',
    files: 'Maximaal 5 bestanden, samen 4 MB (pdf, doc, key, ppt, png, jpg, zip).',
    error: 'Er ging iets mis bij het versturen. Probeer het zo nog eens.',
    sending: 'Versturen…',
    send: 'Verstuur brief',
    thanks: (n) => (n ? `Bedankt, ${n}, ik heb ’m.` : 'Bedankt, ik heb ’m.'),
    body: 'Ik lees je bericht persoonlijk.'
  }
};

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

// Visually hidden but still in the DOM, so bots fill it in and people never see it.
// Messages in ink, not the accent: the accent disappears on the lime glow behind the form.
const msgStyle = { color: 'var(--ink)' };
const alertStyle = { gridColumn: '1 / -1', color: 'var(--ink)', fontSize: 13, textTransform: 'none', letterSpacing: 0, fontFamily: 'inherit' };

const honeypotStyle = { position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' };

function validate(fd) {
  const errors = {};
  const name = String(fd.get('name') || '').trim();
  const email = String(fd.get('email') || '').trim();
  const msg = String(fd.get('msg') || '').trim();
  if (name.length < 2) errors.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = true;
  if (msg.length < 10) errors.msg = true;
  const files = fd.getAll('files').filter((f) => f && f.size > 0);
  if (files.length > MAX_FILES || files.reduce((n, f) => n + f.size, 0) > MAX_TOTAL_BYTES) errors.files = true;
  return errors;
}

export default function ContactForm() {
  const [lang, setLang] = useState('en');
  const [clientErrors, setClientErrors] = useState({});
  const [fileLabel, setFileLabel] = useState('');
  const [state, formAction, pending] = useActionState(sendContact, { status: 'idle' });

  useEffect(() => {
    if (typeof window.__getLang === 'function') setLang(window.__getLang());
    const onLang = (e) => setLang(e.detail);
    window.addEventListener('langchange', onLang);
    return () => window.removeEventListener('langchange', onLang);
  }, []);

  const t = COPY[lang] || COPY.en;
  const serverErrors = state.status === 'invalid' ? state.errors : {};
  const errors = Object.keys(clientErrors).length ? clientErrors : serverErrors;

  // Submitting by hand (instead of <form action>) keeps what people typed if sending fails.
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setClientErrors(errs);
    if (Object.keys(errs).length || pending) return;
    startTransition(() => formAction(fd));
  };

  const onFiles = (e) => {
    const fs = [...e.target.files];
    setFileLabel(fs.length > 1 ? `${fs.length} files` : fs[0]?.name || '');
  };

  if (state.status === 'success') {
    return (
      <div className="form" id="form" role="status" aria-live="polite">
        <div className="ok">
          <div className="dot"></div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{t.thanks(state.name)}</div>
            <div style={{ opacity: 0.6, fontSize: 14 }}>{t.body}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="form" id="form" data-reveal data-delay="3" noValidate onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" maxLength={120} aria-invalid={!!errors.name} />
        <div className="err" data-err="name" style={msgStyle}>{errors.name ? t.name : ''}</div>
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="jane@studio.com" maxLength={200} aria-invalid={!!errors.email} />
        <div className="err" data-err="email" style={msgStyle}>{errors.email ? t.email : ''}</div>
      </div>
      <div className="field full">
        <label htmlFor="kind">Project type</label>
        <select id="kind" name="kind" defaultValue="brand">
          <option value="brand">Brand &amp; website</option>
          <option value="editorial">Editorial site</option>
          <option value="ecom">E-commerce</option>
          <option value="product">Product / app</option>
          <option value="retainer">Studio retainer</option>
          <option value="other">Something else</option>
        </select>
        <div className="err" data-err="kind" style={msgStyle}></div>
      </div>
      <div className="field full">
        <label htmlFor="msg">Tell me about it</label>
        <textarea id="msg" name="msg" maxLength={5000} placeholder="A paragraph is plenty. Links, decks, and napkins also welcome." aria-invalid={!!errors.msg}></textarea>
        <div className="err" data-err="msg" style={msgStyle}>{errors.msg ? t.msg : ''}</div>
      </div>
      <div style={honeypotStyle} aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="submit">
        <label className={`attach${fileLabel ? ' has' : ''}`} data-hover>
          <input type="file" id="files" name="files" multiple accept=".pdf,.doc,.docx,.key,.ppt,.pptx,.png,.jpg,.jpeg,.zip" onChange={onFiles} />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3l7.5-7.5"/></svg>
          <span>Attach files</span>
          <span className="files" id="file-names">{fileLabel}</span>
        </label>
        <button type="submit" className="send-btn" data-hover disabled={pending} aria-busy={pending} style={pending ? { opacity: 0.6, cursor: 'wait' } : undefined}>
          <span>{pending ? t.sending : t.send}</span>
          <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
        </button>
      </div>
      {errors.files ? <div className="err" role="alert" style={alertStyle}>{t.files}</div> : null}
      {state.status === 'error' && !pending ? (
        <div className="err" role="alert" style={alertStyle}>{t.error}</div>
      ) : null}
    </form>
  );
}
