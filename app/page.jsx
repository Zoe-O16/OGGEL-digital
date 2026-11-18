import SiteInteractions from './SiteInteractions';
import ContactForm from './ContactForm';

export default function Page() {
  return (
    <>
      <div className="grain"></div>
      <div className="cursor-ring" id="cursor-ring"></div>
      <div className="cursor-dot" id="cursor-dot"></div>
      
      <nav className="nav" data-screen-label="nav">
        <a href="#top" className="brand">
          <span className="dot"></span>
          <span className="b-name" style={{ letterSpacing: "0.04em" }}>OGGEL digital</span><span className="b-suf" style={{ opacity: ".55", fontWeight: "400", marginLeft: "2px" }}>
      </span>
        </a>
        <div className="center">
          <div className="links">
            <a href="#work" data-hover>Work</a>
            <a href="#contact" data-hover>Contact</a>
          </div>
        </div>
      </nav>
      
      <section className="hero section" id="top" data-screen-label="01 Hero" style={{ maxWidth: "none", paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}>
      
        
        <div className="blob b-1" aria-hidden="true"></div>
        <div className="blob b-4" aria-hidden="true"></div>
      
        <div className="hero-inner" style={{ position: "relative", zIndex: "2" }}>
          <div className="eyebrow" data-reveal>Independent web design studio · Amsterdam ↔ Remote</div>
          <h1 data-reveal data-delay="1">
            <span>Thoughtful</span><br />
            <span>digital</span> <span className="am">solutions</span>
          </h1>
          <div className="meta">
            <p className="lede" data-reveal data-delay="2">OGGEL digital is a one-person web design and digital solutions studio based in Amsterdam, focusing on products for makers, founders and small teams.</p>
            <a href="#contact" className="send-btn hero-cta" data-hover data-reveal data-delay="3"><span>Start a project</span><svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
          </div>
        </div>
      </section>
      
      <section className="section work" id="work" data-screen-label="03 Work">
        <div className="head">
          <div>
            <h2 data-reveal data-delay="1">Projects</h2>
          </div>
        </div>
      
        <div className="grid-work" id="grid-work" data-layout="big-right">
          <a className="case c-big" data-hover data-reveal>
            <img className="case-img" src="/images/thesis.jpg" alt="Thesis" loading="lazy" />
            <div className="corner">01</div>
            <div className="label"><span className="t">Thesis</span></div>
            <div className="reveal"><span className="t">View project</span><svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></div>
          </a>
          <a className="case c-sm" data-hover data-reveal>
            <img className="case-img" src="/images/housing.jpg" alt="Housing website" loading="lazy" />
            <div className="corner">02</div>
            <div className="label"><span className="t">Housing website</span></div>
            <div className="reveal"><span className="t">View project</span><svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></div>
          </a>
          <a className="case c-sm" data-hover data-reveal>
            <img className="case-img" src="/images/lily.jpg" alt="Lily’s website" loading="lazy" />
            <div className="corner">03</div>
            <div className="label"><span className="t">Lily&rsquo;s website</span></div>
            <div className="reveal"><span className="t">View project</span><svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></div>
          </a>
        </div>
      </section>
      
      <section className="cta-section" id="contact" data-screen-label="06 Contact">
        <div className="b-cta" aria-hidden="true"></div>
        <div className="inner">
          <h2 data-reveal data-delay="1"><span>Need something?</span></h2>
          <p data-reveal data-delay="2" style={{ maxWidth: "54ch", margin: "0 auto", fontSize: "18px", lineHeight: "1.5", color: "var(--ink-2)" }}>Share a few details about your project and what you&rsquo;d like to achieve. I&rsquo;ll review your message personally and respond within two working days.</p>
      
          <ContactForm />
        </div>
      </section>
      
      <footer>
        <div className="bot">
          <span>© 2026 OGGEL digital</span>
          <span>KvK 84.XX.XX.XX</span>
          <span><span>Local time</span> · <span id="clock">—</span></span>
        </div>
      </footer>
      <SiteInteractions />
    </>
  );
}
