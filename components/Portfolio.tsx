"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, Menu, X } from "lucide-react";

const projects = [
  { year: "2024", title: "MOOD", type: "Education Platform", text: "Mathematics Operation Online Development: web belajar operasi bilangan untuk siswa SD dengan materi interaktif, latihan soal, dan fitur latihan berbantuan AI bertema ramah lingkungan.", tags: ["Next.js", "TypeScript", "Tailwind", "AI"], number: "01", image: "/projects/mood.png", link: "https://mini-project-alterra-msib-7.vercel.app" },
  { year: "2025", title: "Straweyi Hub", type: "Booking Platform", text: "Platform workshop kerajinan tangan (crochet, knitting, amigurumi, macramé): lihat jadwal, harga, lokasi, dan sisa kursi, lalu booking dalam semenit tanpa akun, dengan tampilan kartu dan kalender.", tags: ["React", "TypeScript", "Vite"], number: "02", image: "/projects/workshophub.png", link: "https://workshophub-seven.vercel.app" },
  { year: "2025", title: "SH Support", type: "Company Website", text: "Website HS Support Group untuk jasa cuci dan pasang AC, home cleaning, teknisi rumah tangga, serta tennis coaching, lengkap dengan harga transparan, testimoni, FAQ, dan pemesanan via WhatsApp.", tags: ["Next.js", "TypeScript", "SEO"], number: "03", image: "/projects/hsservice.png", link: "https://hsservicegroup.vercel.app" }
];

function GridBackground() {
  return <div className="grid-bg" aria-hidden="true"><div className="grid-crosses">{Array.from({ length: 42 }).map((_, i) => <span key={i}>+</span>)}</div></div>;
}

function Tag3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const move = (e: MouseEvent) => {
      const r = node.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      node.style.setProperty("--rx", `${-y * 10}deg`);
      node.style.setProperty("--ry", `${x * 15}deg`);
      node.style.setProperty("--mx", `${x * 10}px`);
      node.style.setProperty("--my", `${y * 10}px`);
    };
    const leave = () => {
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
      node.style.setProperty("--mx", "0px");
      node.style.setProperty("--my", "0px");
    };

    node.addEventListener("mousemove", move);
    node.addEventListener("mouseleave", leave);
    return () => {
      node.removeEventListener("mousemove", move);
      node.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div className={`tag-scene ${active ? "is-active" : ""}`} ref={ref} onClick={() => setActive(v => !v)} role="button" tabIndex={0} aria-label="Flip interactive ID card" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActive(v => !v); }}>
      <div className="tag-shadow" />
      <div className="tag-orbit orbit-one" />
      <div className="tag-orbit orbit-two" />

      <div className="tag-card-wrap">
        <div className="tag-card-3d">
          <div className="tag-card tag-front">
            <div className="tag-card-top">JKT, 19082006</div>
            <div className="tag-hole" />
            <div className="tag-invitation">
              <div className="tag-symbol">✦</div>
              <div>Helloo,Welcome To My Portofolio</div>
              <strong>LINTANG ARBI SUTO</strong>
            </div>
          </div>
          <div className="tag-card tag-back">
            <div className="back-code">Lintang Arbi Suto</div>
            <div className="back-rule" />
            <div className="back-role">FULLSTACK<br/>DEVELOPER</div>
            <div className="back-stack">NEXT.JS · REACT · TYPESCRIPT · PHP · LARAVEL</div>
            <div className="back-bottom">LINTANG ARBI SUTO <span>2026</span></div>
          </div>
        </div>
      </div>

      <div className="tag-side-label">FULL STACK PROGRAMMER</div>
      <div className="tag-hint">{active ? "CLICK TO FLIP BACK" : "CLICK TO REVEAL BACK"}</div>
    </div>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  useEffect(() => { const fn = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY }); window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn); }, []);

  return <main>
    <GridBackground />
    <div className="cursor" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }} />

    <header className="nav wrap">
      <a className="brand" href="#top">L/A<span>.</span></a>
      <nav className={menu ? "open" : ""}>
        <a href="#work" onClick={() => setMenu(false)}>WORK</a>
        <a href="#about" onClick={() => setMenu(false)}>ABOUT</a>
        <a href="#stack" onClick={() => setMenu(false)}>STACK</a>
        <a href="#contact" onClick={() => setMenu(false)}>CONTACT</a>
      </nav>
      <button className="menu-btn" onClick={() => setMenu(v => !v)} aria-label="Toggle menu">{menu ? <X size={20}/> : <Menu size={20}/>}</button>
    </header>

    <section id="top" className="hero wrap">
      <div className="hero-copy">
        <p className="eyebrow">JAKARTA / INDONESIA <span>✦</span> AVAILABLE FOR WORK</p>
        <h1>BUILDING DIGITAL<br/><em>EXPERIENCES</em><br/>THAT FEEL ALIVE.</h1>
        <p className="lead">Fullstack developer focused on expressive interfaces, thoughtful motion and products that are as enjoyable to use as they are to look at.</p>
        <a className="button" href="#work">EXPLORE WORK <ArrowDownRight size={17}/></a>
      </div>
      <Tag3D />
      <div className="hero-meta"><span>SCROLL</span><span className="line"/><span>01 — 03</span></div>
    </section>

    <section id="about" className="manifesto wrap section">
      <div className="section-label"><span>01</span><span>ABOUT</span></div>
      <div className="manifesto-grid"><p className="display">I LIKE TO TURN<br/><span>COMPLEX IDEAS</span><br/>INTO SIMPLE<br/><span>INTERACTIONS.</span></p><div className="about-copy"><p>My work sits between design and engineering. I care about visual rhythm, accessibility, performance and the tiny details that make a digital product memorable.</p><p>From dashboards and education products to realtime applications, I build interfaces with React and Next.js and bring them to life with modern web technologies.</p><a className="text-link" href="mailto:hello@example.com">LET&apos;S TALK <ArrowUpRight size={16}/></a></div></div>
    </section>

    <section id="work" className="work wrap section">
      <div className="section-label"><span>02</span><span>SELECTED WORK</span><span>2024 — 2026</span></div>
      <div className="project-list">{projects.map((p) => <article className="project" key={p.number}><div className="project-top"><span>{p.number}</span><span>{p.year}</span></div><div className="project-body"><div><p className="project-type">{p.type}</p><h2>{p.title}</h2><p>{p.text}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div></div><a className="project-art" href={p.link} target="_blank" rel="noreferrer">{p.image ? <img src={p.image} alt={`Preview ${p.title}`} /> : <div className="art-grid"/>}<span>VIEW PROJECT <ArrowUpRight size={18}/></span></a></div></article>)}</div>
    </section>

    <section id="stack" className="stack wrap section">
      <div className="section-label"><span>03</span><span>THE STACK</span></div>
      <div className="stack-grid">{["NEXT.JS", "TYPESCRIPT", "REACT", "TAILWIND CSS", "NODE.JS", "MONGODB", "FIGMA", "GIT / GITHUB"].map((s, i) => <div className="stack-item" key={s}><span>0{i + 1}</span><strong>{s}</strong><ArrowUpRight size={18}/></div>)}</div>
    </section>

    <section id="contact" className="contact wrap section"><div className="section-label"><span>04</span><span>CONTACT</span></div><div className="contact-inner"><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>LET&apos;S MAKE<br/><em>SOMETHING GOOD.</em></h2><a className="contact-mail" href="mailto:hello@example.com">lintangas21@gmail.com <ArrowUpRight size={25}/></a></div></section>

    <footer className="footer wrap"><span>L/A. — FULLSTACK DEVELOPER</span><div><a href="https://github.com" target="_blank">GITHUB</a><a href="https://linkedin.com" target="_blank">LINKEDIN</a><a href="mailto:hello@example.com">EMAIL</a></div><span>© 2026</span></footer>
  </main>;
}
