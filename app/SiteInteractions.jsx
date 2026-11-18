'use client';

import { useEffect } from 'react';

export default function SiteInteractions() {
  useEffect(() => {
    if (window.__oggelInit) return;
    window.__oggelInit = true;

    document.querySelectorAll('.case-img').forEach((img) => {
      const drop = () => img.remove();
      if (img.complete && img.naturalWidth === 0) drop();
      else img.addEventListener('error', drop);
    });
    
    /* ====== Vanilla interactions ====== */
    (function(){
      /* ---------- i18n ---------- */
      const LANG_KEY = 'oggel.lang';
      const detect = (navigator.language || '').toLowerCase().startsWith('nl') ? 'nl' : 'en';
      let LANG = 'en';
      const __orig = new WeakMap();
      const __origPh = new WeakMap();
    
      function applyLang(lang){
        LANG = lang;
        document.documentElement.lang = lang;
        try { localStorage.setItem(LANG_KEY, lang); } catch(_) {}
        document.querySelectorAll('[data-nl]').forEach(el => {
          if (!__orig.has(el)) __orig.set(el, el.innerHTML);
          el.innerHTML = lang === 'nl' ? el.dataset.nl : __orig.get(el);
        });
        document.querySelectorAll('[data-nl-placeholder]').forEach(el => {
          if (!__origPh.has(el)) __origPh.set(el, el.placeholder || '');
          el.placeholder = lang === 'nl' ? el.dataset.nlPlaceholder : __origPh.get(el);
        });
        document.querySelectorAll('#lang-toggle .lang-btn').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
        // notify rest of the app (form errors etc.)
        window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
      }
      // expose
      window.__getLang = () => LANG;
      window.__setLang = applyLang;
    
      // wire nav toggle
      document.querySelectorAll('#lang-toggle .lang-btn').forEach(b => {
        b.addEventListener('click', () => applyLang(b.dataset.lang));
      });
    
      // initial paint
      applyLang(LANG);
    
      /* Saturation twin of the nav: strips hue from the difference blend so it reads pure black/white */
      function cloneNav(){
        document.querySelector('.nav-sat')?.remove();
        const nav=document.querySelector('.nav'); if(!nav) return;
        const c=nav.cloneNode(true);
        c.classList.add('nav-sat'); c.setAttribute('aria-hidden','true');
        c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
        c.querySelectorAll('[data-nl],[data-reveal]').forEach(e=>{e.removeAttribute('data-nl');});
        c.querySelectorAll('a,button').forEach(e=>e.setAttribute('tabindex','-1'));
        nav.after(c);
      }
      cloneNav();
      window.addEventListener('langchange', cloneNav);
    
      /* Center the bottom-right hero blob on the Start a project button */
      function centerBlobOnCta(){
        const blob=document.querySelector('.hero .b-4'), cta=document.querySelector('.hero .hero-cta'), hero=document.querySelector('.hero');
        if(!blob||!cta||!hero) return;
        const hr=hero.getBoundingClientRect(), cr=cta.getBoundingClientRect();
        const cx=cr.left+cr.width/2-hr.left, cy=cr.top+cr.height/2-hr.top;
        blob.style.right='auto'; blob.style.bottom='auto';
        blob.style.left=(cx-blob.offsetWidth/2)+'px';
        /* Keep the blob (and its blur) clear of the accent "solutions" word */
        let top=cy-blob.offsetHeight/2;
        const am=document.querySelector('.hero h1 .am');
        if(am){
          const blur=parseFloat(getComputedStyle(blob).filter.replace(/[^0-9.]/g,''))||0;
          const minTop=am.getBoundingClientRect().bottom-hr.top+blur*0.9;
          if(top<minTop) top=minTop;
        }
        blob.style.top=top+'px';
      }
      /* Phone & tablet: one half circle from the top that stops above the accent "solutions" word */
      function topBlobAboveAccent(){
        const blob=document.querySelector('.hero .b-1'), am=document.querySelector('.hero h1 .am'), hero=document.querySelector('.hero');
        if(!blob||!am||!hero) return;
        if(!window.matchMedia('(max-width:1024px)').matches){ blob.style.top=''; blob.style.height=''; return; }
        const blur=parseFloat(getComputedStyle(blob).filter.replace(/[^0-9.]/g,''))||0;
        const h1=am.closest('h1'), shift=h1?new DOMMatrix(getComputedStyle(h1).transform).m42:0; /* ignore the reveal slide-in */
        const amTop=am.getBoundingClientRect().top-shift-hero.getBoundingClientRect().top;
        blob.style.top=(-blur*2)+'px';
        blob.style.height=Math.max(0, amTop - blur*0.6)+'px'; /* glow fully fades out above "solutions" */
      }
      centerBlobOnCta();
      topBlobAboveAccent();
      window.addEventListener('resize', topBlobAboveAccent);
      window.addEventListener('load', topBlobAboveAccent);
      document.fonts && document.fonts.ready.then(topBlobAboveAccent);
      { const h=document.querySelector('.hero h1'); h && h.addEventListener('transitionend', topBlobAboveAccent); }
      window.addEventListener('resize', centerBlobOnCta);
      window.addEventListener('load', centerBlobOnCta);
      document.fonts && document.fonts.ready.then(centerBlobOnCta);
      cta_ro: { const ctaEl=document.querySelector('.hero .hero-cta'); if(ctaEl && window.ResizeObserver){ new ResizeObserver(centerBlobOnCta).observe(document.querySelector('.hero')); } }
    
      /* ---------- Cursor ---------- */
      const dot = document.getElementById('cursor-dot');
      const ring = document.getElementById('cursor-ring');
      let dx = window.innerWidth/2, dy = window.innerHeight/2;
      let rx = dx, ry = dy;
      let tx = dx, ty = dy;
      window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
      function tick(){
        dx += (tx-dx)*0.55; dy += (ty-dy)*0.55;            // dot is snappy
        rx += (tx-rx)*0.18; ry += (ty-ry)*0.18;            // ring trails
        dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
      }
      tick();
      document.addEventListener('mouseover', e => {
        const link = !!e.target.closest('[data-hover], a, button, .svc, .case');
        const text = !!e.target.closest('input, textarea, select');
        dot.classList.toggle('is-link', link);
        dot.classList.toggle('is-text', text);
        ring.classList.toggle('is-link', link);
        ring.classList.toggle('is-text', text);
      });
      document.addEventListener('mousedown', () => ring.classList.add('is-down'));
      document.addEventListener('mouseup', () => ring.classList.remove('is-down'));
    
      /* ---------- Reveal on scroll ---------- */
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
      }, {rootMargin:'0px 0px -10% 0px', threshold:0.05});
      document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    
      /* ---------- Smooth-anchor scroll ---------- */
      document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click', (e)=>{
          const id = a.getAttribute('href');
          if (id.length>1){
            const el = document.querySelector(id);
            if (el){ e.preventDefault(); window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 30, behavior:'smooth'}); }
          }
        });
      });
    
      /* ---------- Filter ---------- */
      const filter = document.getElementById('filter');
      if (filter){
        filter.addEventListener('click', e=>{
          const b = e.target.closest('button'); if(!b) return;
          filter.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
          b.classList.add('on');
          const f = b.dataset.f;
          document.querySelectorAll('#grid-work .case').forEach(c=>{
            const tags = (c.dataset.tags||'').split(',');
            const show = f==='all' || tags.includes(f);
            c.style.opacity = show?1:0.15;
            c.style.pointerEvents = show?'':'none';
            c.style.transform = show?'':'scale(.98)';
            c.style.transition = 'opacity .4s, transform .4s';
          });
        });
      }
    
      /* ---------- Form ---------- */
      /* Handled by ContactForm.jsx (React + Resend server action). */
    
      /* ---------- Clock ---------- */
      function fmt(){
        const d = new Date();
        const opts = {hour:'2-digit', minute:'2-digit', timeZone:'Europe/Amsterdam', hour12:false};
        const clock = document.getElementById('clock');
        if (clock) clock.textContent = d.toLocaleTimeString('en-NL', opts) + ' CET · AMS';
      }
      fmt(); setInterval(fmt, 30000);
    
      /* ---------- Nav inversion over dark sections ---------- */
      const darkSections = [document.querySelector('#process .process')].filter(Boolean);
      function checkDark(){
        const probeY = 30; // y-position of nav center
        const onDark = darkSections.some(el => {
          const r = el.getBoundingClientRect();
          return r.top <= probeY && r.bottom >= probeY;
        });
        document.body.classList.toggle('nav-on-dark', onDark);
      }
      checkDark();
      window.addEventListener('scroll', checkDark, {passive:true});
      window.addEventListener('resize', checkDark);
    })();
    
  }, []);

  return null;
}
