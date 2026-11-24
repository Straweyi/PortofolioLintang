"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const projects = [
  { year: "2024", title: "MOOD", type: "Education Platform", text: "Mathematics Operation Online Development: web belajar operasi bilangan untuk siswa SD dengan materi interaktif, latihan soal, dan fitur latihan berbantuan AI bertema ramah lingkungan.", tags: ["Next.js", "TypeScript", "Tailwind", "AI"], number: "01", image: "/projects/mood.png", link: "https://mini-project-alterra-msib-7.vercel.app" },
  { year: "2025", title: "Straweyi Hub", type: "Booking Platform", text: "Platform workshop kerajinan tangan (crochet, knitting, amigurumi, macramé): lihat jadwal, harga, lokasi, dan sisa kursi, lalu booking dalam semenit tanpa akun, dengan tampilan kartu dan kalender.", tags: ["React", "TypeScript", "Vite"], number: "02", image: "/projects/workshophub.png", link: "https://workshophub-seven.vercel.app" },
  { year: "2025", title: "SH Support", type: "Company Website", text: "Website HS Support Group untuk jasa cuci dan pasang AC, home cleaning, teknisi rumah tangga, serta tennis coaching, lengkap dengan harga transparan, testimoni, FAQ, dan pemesanan via WhatsApp.", tags: ["Next.js", "TypeScript", "SEO"], number: "03", image: "/projects/hsservice.png", link: "https://hsservicegroup.vercel.app" }
];
const stack = ["NEXT.JS", "TYPESCRIPT", "REACT", "TAILWIND CSS", "NODE.JS", "MONGODB", "FIGMA", "GIT / GITHUB"];
const EMAIL = "lintangas21@gmail.com";

function Split({ text }: { text: string }) {
  return <>{text.split("").map((c, i) => <span className="ch" key={i}><span className="ch-i">{c === " " ? "\u00A0" : c}</span></span>)}</>;
}

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // loader counter
  useEffect(() => {
    const o = { v: 0 };
    const tw = gsap.to(o, { v: 100, duration: 1.8, ease: "power2.inOut", onUpdate: () => setCount(Math.round(o.v)), onComplete: () => setLoaded(true) });
    return () => { tw.kill(); };
  }, []);

  // smooth scroll + cursor
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.085 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const pos = { x: -100, y: -100 }, rp = { x: -100, y: -100 };
    const mv = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY; };
    window.addEventListener("mousemove", mv);
    const loop = () => {
      rp.x += (pos.x - rp.x) * 0.15; rp.y += (pos.y - rp.y) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rp.x}px,${rp.y}px,0)`;
    };
    gsap.ticker.add(loop);
    const over = (e: MouseEvent) => {
      const hot = (e.target as HTMLElement).closest("a,button,.project");
      ring.current?.classList.toggle("hot", !!hot);
    };
    window.addEventListener("mouseover", over);

    return () => {
      gsap.ticker.remove(tick); gsap.ticker.remove(loop);
      lenis.destroy();
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  // entrance + scroll animations after loader
  useEffect(() => {
    if (!loaded || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".nav", { y: -40, opacity: 0, duration: 1 })
        .from(".hero .eyebrow", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero .ch-i", { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.018 }, "-=0.6")
        .from(".hero .lead, .hero .button", { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.7")
        .from(".hero-meta", { opacity: 0, duration: 1 }, "-=0.6");

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, { y: 70, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.utils.toArray<HTMLElement>(".display").forEach((el) => {
        gsap.from(el.querySelectorAll(".ch-i"), { yPercent: 110, duration: 1, stagger: 0.02, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });
      gsap.utils.toArray<HTMLElement>(".project").forEach((el) => {
        const img = el.querySelector("img");
        if (img) gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, { yPercent: 8, scale: 1.18, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
        gsap.from(el.querySelector(".project-art"), { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 75%" } });
        gsap.from(el.querySelectorAll(".project-body > div:first-child > *"), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 75%" } });
      });
      gsap.from(".stack-item", { y: 40, opacity: 0, stagger: 0.07, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".stack-grid", start: "top 85%" } });
      gsap.to(".marquee-track", { xPercent: -50, ease: "none", repeat: -1, duration: 28 });
      gsap.to(".marquee-track", { skewX: -6, scrollTrigger: { trigger: ".marquee", scrub: 0.6, start: "top bottom", end: "bottom top" } });
      gsap.from(".contact h2 .ch-i", { yPercent: 110, stagger: 0.03, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: ".contact", start: "top 65%" } });
    }, root);
    return () => ctx.revert();
  }, [loaded]);

  // tilt on project cards
  const tilt = (e: React.MouseEvent<HTMLElement>) => {
    const art = e.currentTarget.querySelector<HTMLElement>(".project-art");
    if (!art) return;
    const r = art.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(art, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
  };
  const untilt = (e: React.MouseEvent<HTMLElement>) => {
    const art = e.currentTarget.querySelector(".project-art");
    if (art) gsap.to(art, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
  };

  return (
    <main ref={root}>
      <div className={`loader ${loaded ? "done" : ""}`}><span>{count}</span><em>LOADING EXPERIENCE</em></div>
      <HeroScene />
      <div className="vignette" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />

      <header className="nav wrap">
        <a className="brand" href="#top">L/A<span>.</span></a>
        <nav className={menu ? "open" : ""}>
          {["work", "about", "stack", "contact"].map((s) => <a key={s} href={`#${s}`} onClick={() => setMenu(false)}>{s.toUpperCase()}</a>)}
        </nav>
        <button className="menu-btn" onClick={() => setMenu((v) => !v)} aria-label="Toggle menu">{menu ? <X size={20} /> : <Menu size={20} />}</button>
      </header>

      <section id="top" className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">JAKARTA / INDONESIA <span>✦</span> AVAILABLE FOR WORK</p>
          <h1>
            <span className="line-mask"><Split text="BUILDING DIGITAL" /></span>
            <span className="line-mask"><em><Split text="EXPERIENCES" /></em></span>
            <span className="line-mask"><Split text="THAT FEEL ALIVE." /></span>
          </h1>
          <p className="lead">Fullstack developer focused on expressive interfaces, thoughtful motion and products that are as enjoyable to use as they are to look at.</p>
          <a className="button" href="#work">EXPLORE WORK <ArrowDownRight size={17} /></a>
        </div>
        <div className="hero-meta"><span>SCROLL</span><span className="line" /><span>LINTANG ARBI SUTO — 2026</span></div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => <div key={k}>{["FULLSTACK DEVELOPER", "NEXT.JS", "REACT", "TYPESCRIPT", "LARAVEL", "CREATIVE CODING"].map((t) => <span key={t}>{t} <b>✦</b></span>)}</div>)}
        </div>
      </div>

      <section id="about" className="wrap section">
        <div className="section-label reveal"><span>01</span><span>ABOUT</span></div>
        <div className="manifesto-grid">
          <p className="display"><span className="line-mask"><Split text="I LIKE TO TURN" /></span><span className="line-mask it"><Split text="COMPLEX IDEAS" /></span><span className="line-mask"><Split text="INTO SIMPLE" /></span><span className="line-mask it"><Split text="INTERACTIONS." /></span></p>
          <div className="about-copy reveal">
            <p>My work sits between design and engineering. I care about visual rhythm, accessibility, performance and the tiny details that make a digital product memorable.</p>
            <p>From dashboards and education products to realtime applications, I build interfaces with React and Next.js and bring them to life with modern web technologies.</p>
            <a className="text-link" href={`mailto:${EMAIL}`}>LET&apos;S TALK <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>

      <section id="work" className="wrap section">
        <div className="section-label reveal"><span>02</span><span>SELECTED WORK</span><span>2024 — 2026</span></div>
        <div className="project-list">
          {projects.map((p) => (
            <article className="project" key={p.number} onMouseMove={tilt} onMouseLeave={untilt}>
              <div className="project-top"><span>{p.number}</span><span>{p.year}</span></div>
              <div className="project-body">
                <div>
                  <p className="project-type">{p.type}</p>
                  <h2>{p.title}</h2>
                  <p>{p.text}</p>
                  <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                </div>
                <a className="project-art" href={p.link} target="_blank" rel="noreferrer">
                  <img src={p.image} alt={`Preview ${p.title}`} />
                  <span>VIEW PROJECT <ArrowUpRight size={18} /></span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="stack" className="wrap section">
        <div className="section-label reveal"><span>03</span><span>THE STACK</span></div>
        <div className="stack-grid">{stack.map((s, i) => <div className="stack-item" key={s}><span>0{i + 1}</span><strong>{s}</strong><ArrowUpRight size={18} /></div>)}</div>
      </section>

      <section id="contact" className="contact wrap section">
        <div className="section-label reveal"><span>04</span><span>CONTACT</span></div>
        <div className="contact-inner">
          <p className="eyebrow reveal">HAVE A PROJECT IN MIND?</p>
          <h2><span className="line-mask"><Split text="LET'S MAKE" /></span><span className="line-mask"><em><Split text="SOMETHING GOOD." /></em></span></h2>
          <a className="contact-mail reveal" href={`mailto:${EMAIL}`}>{EMAIL} <ArrowUpRight size={25} /></a>
        </div>
      </section>

      <footer className="footer wrap">
        <span>L/A. — FULLSTACK DEVELOPER</span>
        <div><a href="https://github.com" target="_blank" rel="noreferrer">GITHUB</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LINKEDIN</a><a href={`mailto:${EMAIL}`}>EMAIL</a></div>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
