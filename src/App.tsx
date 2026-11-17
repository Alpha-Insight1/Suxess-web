import { useState, useEffect, FormEvent } from "react";
import { school, nav, schools, programmes, skills, steps, gallery, slides, features, stats } from "./data";

const Brand = () => <span className="name">Su<span className="x">x</span>ess</span>;
const tel = (p: string) => `tel:${p.replace(/-/g, "")}`;

const paths: Record<string, string> = {
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M17 11a2.5 2.5 0 100-5 M17 14c2.5 0 4 2 4 5",
  home: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6",
  award: "M12 14a5 5 0 100-10 5 5 0 000 10z M8.5 13.5L7 21l5-3 5 3-1.5-7.5",
  coin: "M12 21a9 9 0 100-18 9 9 0 000 18z M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5 M12 6v2 M12 16v2",
  book: "M4 5h7v14H4z M13 5h7v14h-7z",
};
const Icon = ({ n }: { n: string }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[n] || paths.book} /></svg>
);

function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap topbar-in">
        <span>{school.phones[0]}</span>
        <span className="hide-sm">{school.email}</span>
        <span className="hide-sm">Magboro, Ogun State</span>
        <a className="open" href="#admissions">Admission open</a>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="wrap header-in">
        <a href="#top" className="brand" aria-label={school.name}>
          <img src="/crest.png" alt="" width="48" height="48" />
          <span className="brand-text">
            <Brand />
            <small>Schools</small>
          </span>
        </a>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
        <nav id="nav" className={open ? "nav open" : "nav"}>
          {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((i + d + slides.length) % slides.length);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), 7000);
    return () => clearTimeout(t);
  }, [i]);
  const s = slides[i];
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <img src={s.img} alt="" key={s.img} />
      </div>
      <div className="wrap hero-in">
        <h1>
          <span>{s.title[0]}</span>
          <span className="accent">{s.title[1]}</span>
        </h1>
        <p className="lead">{s.text}</p>
        <div className="hero-actions">
          <a className="btn btn-gold" href="#admissions">Admission open</a>
          <a className="btn btn-line" href="#schools">Explore our schools</a>
        </div>
        <div className="hero-dots">
          {slides.map((_, n) => (
            <button
              key={n}
              className={n === i ? "on" : ""}
              onClick={() => setI(n)}
              aria-label={`Slide ${n + 1}`}
            />
          ))}
        </div>
      </div>
      <button className="hero-nav prev" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
      <button className="hero-nav next" onClick={() => go(1)} aria-label="Next slide">›</button>
    </section>
  );
}

function Features() {
  return (
    <div className="wrap feat-strip">
      <div className="feat-grid">
        {features.map(([t, d, ic]) => (
          <div key={t} className="feat-item">
            <span className="ico"><Icon n={ic} /></span>
            <strong>{t}</strong>
            <span>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <section className="sec" id="about">
      <div className="wrap two">
        <img className="photo lift" src="/life-cooking-class.jpg" alt="Students in green uniforms in a practical cooking class" loading="lazy" />
        <div>
          <p className="kicker">Welcome to</p>
          <h2><Brand /> Schools</h2>
          <p className="body">Results follow habits. Our children learn to arrive prepared, work with care and treat others well, and the academic gains follow. {school.tagline}</p>
          <p className="body">Three arms under one roof: <Brand /> Starlets for nursery and primary, <Brand /> High School for secondary, and the <Brand /> Tuition Centre for exam preparation and adult learners.</p>
          <div className="stats">{stats.map(([a, b]) => <div key={b}><strong>{a}</strong><span>{b}</span></div>)}</div>
          <a className="btn btn-green" href="#admissions">Book a school visit</a>
        </div>
      </div>
    </section>
  );
}

function Explore() {
  return (
    <section className="sec tint" id="schools">
      <div className="wrap">
        <p className="kicker">Our schools</p>
        <h2>Small steps, big dreams.</h2>
        <div className="explore">
          <div className="levels">
            {schools.map((l) => (
              <article key={l.name} className="level">
                <span className="ico"><Icon n="book" /></span>
                <p className="brandline">{l.brand}</p>
                <h3>{l.name}</h3>
                <p className="range">{l.range}</p>
                <p className="line">{l.line}</p>
                <ul>{l.items.slice(0, 4).map((x) => <li key={x}>{x}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="bubble">
            <img src="/life-chess.jpg" alt="Students playing chess outdoors" loading="lazy" />
            <div className="bubble-tag">Holistic growth<small>Mind · Character · Skills</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Programmes() {
  const [i, setI] = useState(0);
  const p = programmes[i];
  return (
    <section className="sec" id="programmes">
      <div className="wrap">
        <p className="kicker">Programmes</p>
        <h2>Beyond the classroom</h2>
        <div className="prog">
          <div className="tabs" role="tablist" aria-label="Programmes">
            {programmes.map((x, n) => <button key={x.name} role="tab" aria-selected={n === i} className={n === i ? "tab on" : "tab"} onClick={() => setI(n)}>{x.name}</button>)}
          </div>
          <div className="panel" role="tabpanel">
            <h3>{p.name}</h3>
            <p className="range">{p.tag}</p>
            <ul className="chips">{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <a className="btn btn-green" href="#admissions">Enquire about this</a>
          </div>
        </div>
        <div className="adult">
          <div>
            <h3>Is the university still your dream?</h3>
            <p>We help learners aged 30 to 60 reach university, from exam preparation to admission.</p>
          </div>
          <a className="btn btn-gold" href={tel(school.phones[0])}>Call {school.phones[0]}</a>
        </div>
        <div className="skillbar"><strong>Skills development</strong><ul>{skills.map((s) => <li key={s}>{s}</li>)}</ul></div>
      </div>
    </section>
  );
}

function Life() {
  return (
    <section className="sec tint" id="life">
      <div className="wrap">
        <p className="kicker">Student life</p>
        <h2>Learning beyond the classroom</h2>
        <div className="strip">
          {gallery.map((g) => (
            <figure key={g.src}><img src={g.src} alt={g.alt} loading="lazy" /><figcaption>{g.caption}</figcaption></figure>
          ))}
          <figure>
            <video
              src="/life-activity.mp4"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Students taking part in Thursday morning physical exercise"
            />
            <figcaption>Thursday morning physical exercise</figcaption>
          </figure>
        </div>
        <p className="more">
          Follow us on{" "}
          <a href={school.social.TikTok} target="_blank" rel="noreferrer">TikTok</a>,{" "}
          <a href={school.social.Instagram} target="_blank" rel="noreferrer">Instagram</a>{" "}
          and{" "}
          <a href={school.social.Facebook} target="_blank" rel="noreferrer">Facebook</a>.
        </p>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <div className="wrap">
      <div className="cta">
        <img src="/crest.png" alt="" width="64" height="64" />
        <div><h2>Admissions are open</h2><p>Give your child the best start for a bright tomorrow.</p></div>
        <a className="btn btn-gold" href="#admissions">Enquire now</a>
      </div>
    </div>
  );
}

function Admissions() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Name: ${f.get("name")}\nPhone: ${f.get("phone")}\nInterested in: ${f.get("level")}\n\n${f.get("msg")}`;
    window.location.href = `mailto:${school.email}?subject=${encodeURIComponent("Admission enquiry")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const options = [...schools.map((s) => s.name), ...programmes.map((p) => p.name)];
  return (
    <section className="sec" id="admissions">
      <div className="wrap two">
        <div>
          <p className="kicker">Admissions</p>
          <h2>Four simple steps</h2>
          <p className="body">Places are offered throughout the year, subject to space in each class.</p>
          <ol className="steps">{steps.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}</ol>
        </div>
        <form className="form" onSubmit={submit}>
          <h3>Send an enquiry</h3>
          <label>Your name<input name="name" required autoComplete="name" /></label>
          <label>Phone number<input name="phone" type="tel" required autoComplete="tel" /></label>
          <label>Interested in<select name="level">{options.map((o) => <option key={o}>{o}</option>)}</select></label>
          <label>Message<textarea name="msg" rows={4} /></label>
          <button className="btn btn-green" type="submit">Send enquiry</button>
          {sent && <p className="note" role="status">Your email app should open now. If not, write to {school.email} or WhatsApp us.</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap foot-in">
        <div>
          <img src="/crest.png" alt="" width="56" height="56" />
          <p className="foot-name"><Brand /> Schools</p>
          <p>{school.tagline}</p>
        </div>
        <div>
          <h3>Quick links</h3>
          {nav.map(([l, h]) => <p key={h}><a href={h}>{l}</a></p>)}
        </div>
        <div>
          <h3>Visit us</h3>
          {school.branches.map((b) => (
            <div key={b.label} className="branch"><strong>{b.label}</strong>{b.lines.map((x) => <p key={x}>{x}</p>)}</div>
          ))}
        </div>
        <div>
          <h3>Contact</h3>
          {school.phones.map((ph) => <p key={ph}><a href={tel(ph)}>{ph}</a></p>)}
          <p><a href={`https://wa.me/${school.whatsapp}`}>WhatsApp us</a></p>
          <p><a href={`mailto:${school.email}`}>{school.email}</a></p>
          <p className="social">{Object.entries(school.social).map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer">{n}</a>)}</p>
        </div>
      </div>
      <p className="wrap copy">© {new Date().getFullYear()} {school.name}. Suxess is success.</p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Features />
        <Welcome />
        <Explore />
        <Programmes />
        <Life />
        <Cta />
        <Admissions />
      </main>
      <Footer />
    </>
  );
}
