import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import { school, nav, schools, programmes, skills, steps, gallery, slides, features, stats } from "./data";
import { Stairs } from "./Stage3D";

const Brand = () => <span className="name">Su<span className="x">x</span>ess</span>;
const tel = (p: string) => `tel:${p.replace(/-/g, "")}`;

const paths: Record<string, string> = {
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M17 11a2.5 2.5 0 100-5 M17 14c2.5 0 4 2 4 5",
  home: "M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6",
  award: "M12 14a5 5 0 100-10 5 5 0 000 10z M8.5 13.5L7 21l5-3 5 3-1.5-7.5",
  coin: "M12 21a9 9 0 100-18 9 9 0 000 18z M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5 M12 6v2 M12 16v2",
};
const Icon = ({ n }: { n: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[n] || paths.shield} /></svg>
);

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    const esc = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("keydown", esc); };
  }, []);
  return (
    <header className={scrolled || open ? "header solid" : "header"}>
      <div className="wrap header-in">
        <a href="#top" className="brand" aria-label={`${school.name}, home`}>
          <img src="/mark.png" alt="" width="44" height="44" />
          <span className="brand-name"><Brand /> Schools</span>
        </a>
        <nav id="nav" className={open ? "nav open" : "nav"} aria-label="Main">
          {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="nav-cta" href="#admissions" onClick={() => setOpen(false)}>Enquire now</a>
        </nav>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          <span className="sr">{open ? "Close menu" : "Open menu"}</span>
          <span className={open ? "bars on" : "bars"} aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </header>
  );
}

const Chevron = ({ left = false }: { left?: boolean }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={left ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

/** Full-width photo slider: one big headline, one line of copy and two buttons per slide. */
function Hero() {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipe = useRef<number | null>(null);
  const go = (k: number) => setI((k + n) % n);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), 7000);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  return (
    <section
      className="hero"
      id="top"
      aria-roledescription="carousel"
      aria-label="Suxess Schools highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}
      onPointerDown={(e) => { if (e.pointerType === "touch") swipe.current = e.clientX; }}
      onPointerUp={(e) => {
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1);
      }}
    >
      {slides.map((s, k) => (
        <div
          key={s.img}
          className={`hslide${k === i ? " on" : ""}${s.portrait ? " portrait" : ""}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${k + 1} of ${n}`}
          aria-hidden={k !== i}
        >
          <div className="hbg"><img className="hbg-img" src={s.img} alt="" style={{ objectPosition: s.pos }} /></div>
          {s.portrait && <img className="hfg" src={s.img} alt="" />}
          <div className="wrap hcopy">
            <div className="hcopy-in">
              {k === 0
                ? <h1 className="htitle">{s.title}</h1>
                : <p className="htitle" role="heading" aria-level={2}>{s.title}</p>}
              <p className="hlead">{s.text}</p>
              <div className="hactions">
                <a className="btn btn-gold" href="#admissions">Apply now</a>
                <a className="btn btn-ghost-light" href={s.cta[1]}>{s.cta[0]}</a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="hero-ui">
        <div className="wrap hero-ui-in">
          <div className="segs" role="group" aria-label="Choose slide">
            {slides.map((s, k) => (
              <button key={s.img} className={k === i ? "seg on" : "seg"} data-paused={paused} onClick={() => go(k)} aria-label={`Show slide ${k + 1}`} aria-current={k === i}>
                {k === i && <i key={`${i}-${paused}`} />}
                <span><b>0{k + 1}</b></span>
              </button>
            ))}
          </div>
          <div className="arrows">
            <button className="arrow" onClick={() => go(i - 1)} aria-label="Previous slide"><Chevron left /></button>
            <button className="arrow" onClick={() => go(i + 1)} aria-label="Next slide"><Chevron /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="values" aria-label="Why families choose Suxess">
      <ul className="wrap values-in">
        {features.map(([t, d, ic]) => (
          <li key={t}>
            <span className="ico"><Icon n={ic} /></span>
            <span><strong>{t}</strong>{d}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  return (
    <section className="sec" id="about">
      <div className="wrap two">
        <img className="photo" data-tilt src="/about-students.jpg" alt="Three Suxess High School students in green jackets reading together from their textbooks" loading="lazy" width="1200" height="900" style={{ objectPosition: "50% 35%" }} />
        <div>
          <h2>Results follow habits.</h2>
          <p className="body">Children who arrive prepared, work carefully and treat others with respect go further — in class and in life. {school.tagline}</p>
          <p className="body">Suxess Starlets covers nursery and primary, Suxess High School covers secondary, and our Tuition Centre supports exam candidates and adult learners at three convenient locations.</p>
          <dl className="stats">{stats.map(([a, b]) => <div key={b}><dt>{b}</dt><dd>{a}</dd></div>)}</dl>
          <a className="btn btn-dark" href="#admissions">Book a school visit</a>
        </div>
      </div>
    </section>
  );
}

function Schools() {
  return (
    <section className="sec tint" id="schools">
      <div className="wrap">
        <div className="sec-head with-3d">
          <div>
            <h2>From first steps to graduation.</h2>
            <p className="lede">One continuous journey under the same high standards — nursery, primary and secondary, side by side.</p>
          </div>
          <Stairs />
        </div>
        <div className="levels">
          {schools.map((l) => (
            <article key={l.name} className="level">
              <p className="brandline">{l.brand}</p>
              <h3>{l.name}</h3>
              <p className="range">{l.range}</p>
              <p className="line">{l.line}</p>
              <ul className="ticks">{l.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Programmes() {
  const [i, setI] = useState(0);
  const p = programmes[i];
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + programmes.length) % programmes.length;
    setI(n);
    (document.getElementById(`tab-${n}`) as HTMLElement | null)?.focus();
  };
  return (
    <section className="sec" id="programmes">
      <div className="wrap">
        <div className="sec-head">
          <h2>Programmes that open doors</h2>
          <p className="lede">Exam coaching, IELTS, scholarship guidance and digital skills for students and adult learners.</p>
        </div>
        <div className="prog">
          <div className="tabs" role="tablist" aria-label="Programmes" aria-orientation="vertical" onKeyDown={onKey}>
            {programmes.map((x, n) => (
              <button key={x.name} id={`tab-${n}`} role="tab" aria-selected={n === i} aria-controls="prog-panel" tabIndex={n === i ? 0 : -1} className={n === i ? "tab on" : "tab"} onClick={() => setI(n)}>{x.name}</button>
            ))}
          </div>
          <div className="panel" id="prog-panel" role="tabpanel" aria-labelledby={`tab-${i}`}>
            <h3>{p.name}</h3>
            <p className="range">{p.tag}</p>
            <ul className="ticks cols">{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <a className="btn btn-dark" href="#admissions">Enquire about this</a>
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
        <div className="sec-head">
          <h2>Learning beyond the classroom</h2>
          <p className="lede">Cooking, chess, physical exercise and practical skills — experiences that build confident, capable young people.</p>
        </div>
        <div className="mosaic">
          <figure className="m-a" data-tilt><img src={gallery[0].src} alt={gallery[0].alt} loading="lazy" style={{ objectPosition: gallery[0].pos }} /><figcaption>{gallery[0].caption}</figcaption></figure>
          <figure className="m-b" data-tilt><img src={gallery[2].src} alt={gallery[2].alt} loading="lazy" style={{ objectPosition: gallery[2].pos }} /><figcaption>{gallery[2].caption}</figcaption></figure>
          <figure className="m-c" data-tilt><img src={gallery[1].src} alt={gallery[1].alt} loading="lazy" style={{ objectPosition: gallery[1].pos }} /><figcaption>{gallery[1].caption}</figcaption></figure>
          <figure className="m-d" data-tilt>
            <video src="/life-activity.mp4" poster="/life-activity-poster.jpg" controls muted playsInline preload="metadata" aria-label="Students taking part in Thursday morning physical exercise" />
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
    <section className="cta">
      <div className="wrap cta-in">
        <div>
          <h2>Admissions are open</h2>
          <p>Give your child the best start for a bright tomorrow.</p>
        </div>
        <div className="cta-actions">
          <a className="btn btn-gold" href="#admissions">Enquire now</a>
          <a className="btn btn-ghost-light" href={tel(school.phones[0])}>Call {school.phones[0]}</a>
        </div>
      </div>
    </section>
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
      <div className="wrap two top">
        <div>
          <h2>Four simple steps</h2>
          <p className="body">Places are offered throughout the year, subject to space in each class.</p>
          <ol className="steps">
            {steps.map(([t, d]) => (
              <li key={t}><strong>{t}</strong><span>{d}</span></li>
            ))}
          </ol>
        </div>
        <form className="form" onSubmit={submit}>
          <h3>Send an enquiry</h3>
          <label>Your name<input name="name" required autoComplete="name" /></label>
          <label>Phone number<input name="phone" type="tel" required autoComplete="tel" /></label>
          <label>Interested in<select name="level">{options.map((o) => <option key={o}>{o}</option>)}</select></label>
          <label>Message<textarea name="msg" rows={4} /></label>
          <button className="btn btn-dark" type="submit">Send enquiry</button>
          <p className="alt">Prefer to chat? <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noreferrer">Message us on WhatsApp</a>.</p>
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
          <span className="tile"><img src="/mark.png" alt="" width="40" height="40" /></span>
          <p className="foot-name"><Brand /> Schools</p>
          <p className="foot-tag">{school.tagline}</p>
        </div>
        <div>
          <h3>Explore</h3>
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
      <div className="wrap copy"><span>© {new Date().getFullYear()} {school.name}</span><span>Suxess is success.</span></div>
    </footer>
  );
}

function useTilt() {
  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      };
      const leave = () => { el.style.transform = ""; };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); });
    });
    return () => cleanups.forEach((c) => c());
  }, []);
}

export default function App() {
  useTilt();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Values />
        <About />
        <Schools />
        <Programmes />
        <Life />
        <Cta />
        <Admissions />
      </main>
      <Footer />
    </>
  );
}
