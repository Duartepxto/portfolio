"use client";

import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  { num: "01", title: "AI Excel", category: "Web App · IA", year: "2026", client: "Projeto pessoal", role: "Design & Full-stack", services: "Full-stack, IA",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind", "Prisma", "NextAuth", "Gemini"],
    github: "https://github.com/Duartepxto/ai-excel-app", shotOrient: "landscape",
    gallery: [{ src: "/aiexcel-1.jpg", o: "l", label: "Dashboard" }, { src: "/aiexcel-2.jpg", o: "l", label: "Folha de cálculo" }, { src: "/aiexcel-3.jpg", o: "l", label: "Relatório" }, { src: "/aiexcel-4.jpg", o: "l", label: "Assistente IA" }],
    lead: "Plataforma de análise de dados com assistente de IA: faz upload de Excel, conversa com o assistente e obténs dashboards, folhas e relatórios automáticos.",
    desc1: "Construí uma app com três áreas — um dashboard de analytics (KPIs, gráfico de vendas, fontes de tráfego, transações e clientes), um editor de folha de cálculo (fórmulas, formatação, import/export de Excel) e relatórios — tudo orquestrado por um assistente de IA (Google Gemini) que recebe comandos e contexto.",
    desc2: "Stack full-stack: Next.js 16 (App Router) + React 19, autenticação Google via NextAuth, persistência em SQLite com Prisma, e a API do Gemini para a camada inteligente." },
  { num: "02", title: "Fast Lane", category: "Web App · Analytics", year: "2026", client: "Projeto pessoal", role: "Design & Full-stack", services: "Full-stack, Data Viz",
    tech: ["Next.js 16", "C# / .NET 8", "TypeScript", "Leaflet", "Capacitor"],
    github: "https://github.com/Duartepxto/downhill-app", shotOrient: "portrait",
    gallery: [{ src: "/downhill-pc-1.jpg", o: "l", label: "Dashboard · desktop" }, { src: "/downhill-1.jpg", o: "p", label: "Resumo" }, { src: "/downhill-pc-2.jpg", o: "l", label: "Mapa · desktop" }, { src: "/downhill-3.jpg", o: "p", label: "Mapa global" }, { src: "/downhill-2.jpg", o: "p", label: "Pistas" }, { src: "/downhill-pc-3.jpg", o: "l", label: "Pistas · desktop" }, { src: "/downhill-4.jpg", o: "p", label: "Menu" }, { src: "/downhill-5.jpg", o: "p", label: "Runs" }],
    lead: "App de análise de descidas de downhill (MTB): grava as descidas por GPS e analisa tempos, velocidade, airtime e o teu ritmo — com mapa, comparação e records.",
    desc1: "Desenvolvi uma aplicação (web + Android via Capacitor) que grava descidas por GPS e gera analytics: resumo semanal, records pessoais, mapa global com heatmap das linhas, comparação entre runs, gestão de equipamento e perfil. Tem modo claro/escuro e adapta-se de telemóvel a desktop.",
    desc2: "Frontend em Next.js 16 (TypeScript) com mapas Leaflet/heatmap e backend em C# (.NET 8). Foco em desempenho, clareza dos dados e uma interface 'glass' coerente em todas as plataformas." },
  { num: "03", title: "LoveReality", category: "E-commerce · Web Design", year: "2026", client: "LoveReality®", role: "Design & Front-end", services: "Storefront, Motion",
    tech: ["Next.js 14", "Tailwind CSS", "Framer Motion"], shotOrient: "landscape",
    github: "https://github.com/Duartepxto/loja-lovereality",
    gallery: [{ src: "/lovereality-1.jpg", o: "l", label: "Hero" }, { src: "/lovereality-m1.jpg", o: "p", label: "Home · mobile" }, { src: "/lovereality-7.jpg", o: "l", label: "New In" }, { src: "/lovereality-4.jpg", o: "l", label: "Produto" }, { src: "/lovereality-m3.jpg", o: "p", label: "Produto · mobile" }, { src: "/lovereality-6.jpg", o: "l", label: "Mega-menu" }, { src: "/lovereality-5.jpg", o: "l", label: "Carrinho" }, { src: "/lovereality-m4.jpg", o: "p", label: "Menu · mobile" }],
    lead: "Storefront editorial de roupa mediterrânica — um lookbook quente e costeiro, com transições orquestradas.",
    desc1: "Implementei uma loja completa: hero animado, mega-menu, listagem com filtros e ordenação, página de produto, drawer de carrinho com barra de envio grátis e barra de anúncios em marquee.",
    desc2: "Construído com Next.js (App Router), Tailwind e Framer Motion — revelações no scroll, cortina de transição, e um sistema de design afinado em globals.css." },
];

const PF = "'Playfair Display', Georgia, serif";
const HG = "'Hanken Grotesk', sans-serif";

const rgba = (hex, a) => {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(f, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

// total width of the horizontal track, in vw (sum of all panel widths) — the wavy
// lines are drawn across this whole span so neighbouring panels line up at the seams
const TOTAL_VW = 514;
function makeWave(y, amp, wl, shift) {
  let d = `M ${(-wl + shift).toFixed(1)} ${y}`;
  let up = true;
  for (let x = -wl + shift; x <= TOTAL_VW + wl; x += wl) {
    const nx = x + wl, cx = x + wl / 2, cy = y + (up ? -amp : amp);
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${nx.toFixed(1)} ${y}`;
    up = !up;
  }
  return d;
}
const WAVES = {
  g1: [makeWave(14, 5, 66, 0), makeWave(48, 5.5, 80, 30), makeWave(86, 5, 72, 12)],
  g2: [makeWave(24, 6, 60, 18), makeWave(62, 5, 74, 0), makeWave(95, 4.5, 68, 25)],
  g3: [makeWave(34, 5, 84, 8), makeWave(74, 6, 64, 20)],
};

// wavy lines that span the whole track; `offset` (in vw) shifts the same pattern so
// each panel shows its own slice and the lines stay continuous across panel borders.
// Sits BEHIND the panel content (z-index:-1) so photos and text are always on top.
function WaveLines({ color, opacity = 0.4, offset = 0 }) {
  return (
    <svg className="waves" viewBox={`0 0 ${TOTAL_VW} 100`} preserveAspectRatio="none" aria-hidden="true" style={{ opacity, left: `${-offset}vw`, width: `${TOTAL_VW}vw` }}>
      <g className="wave wave1" stroke={color}>{WAVES.g1.map((d, i) => <path key={i} d={d} />)}</g>
      <g className="wave wave2" stroke={color}>{WAVES.g2.map((d, i) => <path key={i} d={d} />)}</g>
      <g className="wave wave3" stroke={color}>{WAVES.g3.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

// editorial collage layout (Norris-style): varied heights + vertical stagger, in vh
const GLAYOUT = [
  { h: 44, y: -9 },
  { h: 60, y: 8 },
  { h: 40, y: -3 },
  { h: 54, y: 12 },
  { h: 48, y: -7 },
  { h: 64, y: 4 },
];

// project gallery panels (DOM order matters: data-panel attribute drives nav)
const PANELS = [
  { open: 0, dataPanel: 2, bg: "#f3efe6", color: "#1c1a16", num: "01", numColor: "rgba(28,26,22,.06)", numPos: { left: "3vw", top: "6vh" }, reverse: false, line: "#b15a36", wopac: 0.3, coverImg: "/cover-aiexcel.png", coverPos: "center",
    cover: "repeating-linear-gradient(45deg,#b15a36,#b15a36 16px,#a44f2e 16px,#a44f2e 32px)", catColor: "#b15a36", cat: "Web App · IA · 2026", title: "AI Excel", arrowBorder: "rgba(28,26,22,.35)", border: true },
  { open: 1, dataPanel: 3, bg: "#1c1a16", color: "#f3efe6", num: "02", numColor: "rgba(243,239,230,.08)", numPos: { right: "3vw", bottom: "4vh" }, reverse: true, line: "#d98a64", wopac: 0.55, coverImg: "/cover-fastlane.png", coverPos: "center",
    cover: "repeating-linear-gradient(-45deg,#b15a36,#b15a36 16px,#a44f2e 16px,#a44f2e 32px)", catColor: "#d98a64", cat: "Web App · Analytics · 2026", title: "Fast Lane", arrowBorder: "rgba(243,239,230,.4)", border: false },
  { open: 2, dataPanel: 4, bg: "#b15a36", color: "#f3efe6", num: "03", numColor: "rgba(243,239,230,.12)", numPos: { left: "3vw", top: "6vh" }, reverse: false, line: "#f3efe6", wopac: 0.5, coverImg: "/cover-lovereality.png", coverPos: "center",
    cover: "repeating-linear-gradient(45deg,#1c1a16,#1c1a16 16px,#26241f 16px,#26241f 32px)", catColor: "#f7e7dd", cat: "E-commerce · 2026", title: "LoveReality", arrowBorder: "rgba(243,239,230,.5)", border: false },
];

export default function Home() {
  const [open, setOpen] = useState(-1);
  const openRef = useRef(-1);
  const engineRef = useRef({ maxScroll: 1, maxTX: 0 });

  // ---------- HORIZONTAL ENGINE + UI ----------
  useEffect(() => {
    let scrollX = 0, targetX = 0;
    let raf = 0, craf = 0, clk = 0, unlock = 0;
    const t0 = performance.now();
    let introDone = false;

    const track = document.getElementById("track");
    const wrap = document.getElementById("wrap");
    const container = track ? track.parentElement : null;
    const progline = document.getElementById("progline");
    const seclabel = document.getElementById("seclabel");
    const bgInner = document.getElementById("bgwordinner");
    const cur = document.getElementById("cursor");
    const clock = document.getElementById("clock");

    const panels = Array.from(document.querySelectorAll("[data-panel]"));
    const pxEls = Array.from(document.querySelectorAll("[data-px]"));

    // transform-independent geometry, recomputed only on layout/resize (no per-frame reflow)
    let panelGeo = [];
    let pxGeo = [];
    const leftInTrack = (el) => {
      let l = el.offsetLeft, node = el.offsetParent;
      while (node && node !== container && node !== document.body) { l += node.offsetLeft; node = node.offsetParent; }
      return l;
    };

    const layout = () => {
      if (!track || !wrap) return;
      if (window.innerWidth <= 768) {
        // mobile: vertical stack, no horizontal engine
        wrap.style.height = "auto";
        track.style.transform = "";
        engineRef.current.maxScroll = 0;
        engineRef.current.maxTX = 0;
        return;
      }
      const tw = track.scrollWidth;
      wrap.style.height = tw + "px";
      engineRef.current.maxScroll = tw - window.innerHeight;
      engineRef.current.maxTX = tw - window.innerWidth;
      panelGeo = panels.map((p) => ({
        left: p.offsetLeft, width: p.offsetWidth,
        sec: p.getAttribute("data-sec"),
        col: rgba(p.getAttribute("data-line") || "#b15a36", parseFloat(p.getAttribute("data-wopac") || "0.4")),
      }));
      pxGeo = pxEls.map((el) => ({ el, center: leftInTrack(el) + el.offsetWidth / 2, amt: parseFloat(el.getAttribute("data-px")) }));
    };

    document.body.style.overflow = "hidden";
    unlock = setTimeout(() => { if (openRef.current < 0) document.body.style.overflow = ""; }, 2900);

    layout();
    const onResize = () => layout();
    const onScroll = () => { targetX = window.scrollY; };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    // project hover bindings
    const hoverPanels = panels.filter((p) => p.getAttribute("data-cursor") === "open");
    const hoverState = new Map();
    const enterFns = new Map();
    const leaveFns = new Map();
    hoverPanels.forEach((p) => {
      hoverState.set(p, { hov: 0, amt: 0 });
      const wrapEl = p.querySelector(".cover-wrap");
      const title = p.querySelector(".proj-title");
      const arrow = p.querySelector(".proj-arrow");
      const enter = () => {
        hoverState.get(p).hov = 1;
        if (title) { title.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)"; title.style.transform = "translateX(12px)"; }
        if (arrow) { arrow.style.transition = "background .4s ease,color .4s ease,transform .5s cubic-bezier(.16,1,.3,1)"; arrow.style.background = "#b15a36"; arrow.style.color = "#f3efe6"; arrow.style.borderColor = "#b15a36"; arrow.style.transform = "translate(4px,-4px)"; }
      };
      const leave = () => {
        hoverState.get(p).hov = 0;
        if (title) title.style.transform = "translateX(0)";
        if (arrow) { arrow.style.background = "transparent"; arrow.style.color = ""; arrow.style.borderColor = ""; arrow.style.transform = "translate(0,0)"; }
      };
      enterFns.set(p, enter); leaveFns.set(p, leave);
      p.addEventListener("mouseenter", enter);
      p.addEventListener("mouseleave", leave);
      p._wrapEl = wrapEl;
    });

    let curSec = "";
    let lastTx = NaN;
    const easeOut = (x) => 1 - Math.pow(1 - x, 3);
    const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (openRef.current >= 0) return; // paused while a project overlay is open
      if (window.innerWidth <= 768) return; // mobile: no horizontal engine / parallax

      if (!introDone) {
        const el = performance.now() - t0;
        const intros = document.querySelectorAll("[data-intro]");
        let allDone = true;
        intros.forEach((node) => {
          const order = parseInt(node.getAttribute("data-intro"), 10);
          const delay = 250 + order * 110, dur = 850;
          const k = Math.max(0, Math.min(1, (el - delay) / dur));
          const e = easeOut(k);
          node.style.opacity = e;
          node.style.transform = `translateY(${(1 - e) * 34}px)`;
          if (k < 1) allDone = false;
        });
        if (allDone) { introDone = true; intros.forEach((node) => { node.style.opacity = ""; node.style.transform = ""; }); }
      }

      scrollX += (targetX - scrollX) * 0.09;
      const ms = engineRef.current.maxScroll;
      const ratio = ms > 0 ? scrollX / ms : 0;
      const tx = -ratio * engineRef.current.maxTX;
      const vw = window.innerWidth;

      // hover zoom must keep easing even when idle (cheap: a few panels)
      hoverPanels.forEach((p) => {
        const s = hoverState.get(p);
        s.amt += (s.hov - s.amt) * 0.12;
        if (p._wrapEl) p._wrapEl.style.transform = `scale(${1 + 0.05 * s.amt})`;
      });

      // everything below only changes while actually moving — skip when idle
      if (Math.abs(tx - lastTx) < 0.08) return;
      lastTx = tx;

      if (track) track.style.transform = `translate3d(${tx}px,0,0)`;
      if (progline) progline.style.width = clamp01(ratio) * 100 + "%";

      if (bgInner) {
        const full = engineRef.current.maxTX > 0 ? Math.min(1, Math.abs(tx) / engineRef.current.maxTX) : 0;
        bgInner.style.transform = `translate3d(${tx * 0.4}px,0,0)`;
        bgInner.style.opacity = String(Math.max(0, 1 - full * 1.15));
        bgInner.style.filter = `blur(${full * 22}px)`;
      }

      // parallax (pure math from cached geometry, no reflow)
      for (const g of pxGeo) {
        const rel = (tx + g.center - vw / 2) / vw;
        g.el.style.transform = `translate3d(${rel * g.amt}px,0,0)`;
      }

      // section label
      let activeSec = panelGeo.length ? panelGeo[0].sec : "";
      for (const g of panelGeo) {
        const left = tx + g.left;
        if (left < vw * 0.55 && left + g.width > vw * 0.45) activeSec = g.sec;
      }
      if (activeSec !== curSec) { curSec = activeSec; if (seclabel) seclabel.textContent = curSec; }
    };
    loop();

    const onKey = (e) => {
      if (openRef.current >= 0) return;
      if (e.key === "ArrowRight") window.scrollTo({ top: window.scrollY + window.innerHeight * 0.8, behavior: "smooth" });
      if (e.key === "ArrowLeft") window.scrollTo({ top: window.scrollY - window.innerHeight * 0.8, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);

    // cursor
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, sShow = 1, sT = 1;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);
    const cloop = () => {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; sShow += (sT - sShow) * 0.2;
      if (cur) cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%) scale(${sShow})`;
      craf = requestAnimationFrame(cloop);
    };
    cloop();
    const onOver = (e) => { if (e.target.closest && e.target.closest("[data-cursor]")) sT = 1.7; };
    const onOut = (e) => { const to = e.relatedTarget; if (e.target.closest && e.target.closest("[data-cursor]") && !(to && to.closest && to.closest("[data-cursor]"))) sT = 1; };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    // clock (Braga / Lisbon)
    const upd = () => { if (clock) clock.textContent = new Date().toLocaleTimeString("pt-PT", { timeZone: "Europe/Lisbon", hour: "2-digit", minute: "2-digit", second: "2-digit" }); };
    upd(); clk = setInterval(upd, 1000);

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(craf);
      clearTimeout(unlock); clearInterval(clk);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      hoverPanels.forEach((p) => { p.removeEventListener("mouseenter", enterFns.get(p)); p.removeEventListener("mouseleave", leaveFns.get(p)); });
      document.body.style.overflow = "";
    };
  }, []);

  // keep openRef synced + body lock + relayout on close
  useEffect(() => {
    openRef.current = open;
    document.body.style.overflow = open >= 0 ? "hidden" : "";
    if (open < 0) {
      const track = document.getElementById("track");
      const wrap = document.getElementById("wrap");
      if (track && wrap) {
        const tw = track.scrollWidth;
        wrap.style.height = tw + "px";
        engineRef.current.maxScroll = tw - window.innerHeight;
        engineRef.current.maxTX = tw - window.innerWidth;
      }
    }
  }, [open]);

  // reveal gallery shots as they scroll into view (Norris-style wipe + zoom).
  // a scroll listener is used instead of IntersectionObserver because the latter
  // does not fire reliably for this horizontally-scrolled fixed container.
  useEffect(() => {
    if (open < 0) return;
    const root = document.getElementById("projpanel");
    if (!root) return;
    let shots = [];
    const reveal = () => {
      const vw = window.innerWidth;
      shots.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.left < vw * 0.92 && r.right > vw * 0.05) s.classList.add("in");
      });
    };
    const t = setTimeout(() => {
      shots = Array.from(root.querySelectorAll(".gshot"));
      if (window.innerWidth <= 768) { shots.forEach((s) => s.classList.add("in")); return; }
      reveal();
      root.addEventListener("scroll", reveal, { passive: true });
    }, 80);
    return () => { clearTimeout(t); root.removeEventListener("scroll", reveal); };
  }, [open]);

  const goPanel = (idx) => {
    if (openRef.current >= 0) { document.body.style.overflow = ""; setOpen(-1); }
    requestAnimationFrame(() => {
      const p = document.querySelector(`[data-panel="${idx}"]`);
      const track = document.getElementById("track");
      if (!p || !track) return;
      const trackLeft = track.getBoundingClientRect().left;
      const panelLeftInTrack = p.getBoundingClientRect().left - trackLeft;
      const { maxTX, maxScroll } = engineRef.current;
      const ratio = maxTX > 0 ? panelLeftInTrack / maxTX : 0;
      window.scrollTo({ top: ratio * maxScroll, behavior: "smooth" });
    });
  };

  const cur = open >= 0 ? PROJECTS[open] : null;
  const pan = cur ? PANELS[open] : null;
  const nextTitle = cur ? PROJECTS[(open + 1) % PROJECTS.length].title : "";

  return (
    <div style={{ background: "#f3efe6", color: "#1c1a16", position: "relative", width: "100%" }}>
      <div id="cursor" style={{ position: "fixed", top: 0, left: 0, width: 26, height: 26, borderRadius: "50%", background: "transparent", border: "1.5px solid #b15a36", pointerEvents: "none", zIndex: 330, transform: "translate(-50%,-50%) scale(1)", willChange: "transform" }} />

      {/* FILM GRAIN — always active texture over the panels */}
      <div id="grain" aria-hidden="true" />

      {/* LOADER — sliced curtain reveal */}
      <div id="loader" aria-hidden="true">
        <div className="loader-cols">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="loader-col" style={{ animationDelay: `${1.75 + i * 0.06}s` }} />
          ))}
        </div>
        <div className="loader-content">
          <div className="loader-over"><span>Portfólio — 2026</span></div>
          <h2 className="loader-name" style={{ fontFamily: PF }}>
            <span className="lmask"><span className="lline">Duarte</span></span>
            <span className="lmask"><span className="lline lline-it">Peixoto</span></span>
          </h2>
          <div className="loader-bar"><i /></div>
          <div className="loader-sub"><span>Designer · Developer · Braga</span></div>
        </div>
      </div>

      {/* FIXED NAV */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 110, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 5vw", mixBlendMode: "difference", color: "#fff" }}>
        <a onClick={() => goPanel(0)} data-cursor="link" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
          <span style={{ fontFamily: PF, fontWeight: 500, fontSize: 21, letterSpacing: ".01em" }}>Duarte Peixoto</span>
        </a>
        <div style={{ display: "flex", gap: 26, alignItems: "center", fontFamily: HG, fontSize: 13, letterSpacing: ".02em" }}>
          <a onClick={() => goPanel(2)} data-cursor="link" style={{ cursor: "pointer" }}>Trabalhos</a>
          <a onClick={() => goPanel(7)} data-cursor="link" style={{ cursor: "pointer" }}>Sobre</a>
          <a onClick={() => goPanel(8)} data-cursor="link" style={{ cursor: "pointer" }}>Contato</a>
        </div>
      </div>

      {/* BOTTOM PROGRESS */}
      <div className="hbar" style={{ position: "fixed", left: 0, bottom: 0, width: "100%", zIndex: 110, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 5vw", mixBlendMode: "difference", color: "#fff", pointerEvents: "none" }}>
        <span id="seclabel" style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>01 — Introdução</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.3)", margin: "0 24px", position: "relative", maxWidth: "50vw" }}>
          <div id="progline" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: 0, background: "#fff" }} />
        </div>
        <span style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".08em" }}>↓ = →</span>
      </div>

      {/* ADAPTIVE BACKGROUND WORD */}
      <div id="bgword" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 105, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", mixBlendMode: "difference", overflow: "hidden" }}>
        <span id="bgwordinner" style={{ fontFamily: "'Pinyon Script', cursive", fontWeight: 400, fontSize: "min(44vh,40vw)", lineHeight: ".8", color: "rgba(255,255,255,.07)", whiteSpace: "nowrap", letterSpacing: 0 }}>Portfólio</span>
      </div>

      {/* HORIZONTAL SCROLLER */}
      <div id="wrap" style={{ position: "relative" }}>
        <div className="viewport" style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
          <div id="track" style={{ display: "flex", height: "100%", willChange: "transform" }}>

            {/* INTRO */}
            <section data-panel="0" data-sec="01 — Introdução" data-line="#b15a36" data-wopac="0.3" style={{ position: "relative", flex: "0 0 100vw", height: "100%", background: "#f3efe6", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", overflow: "hidden" }}>
              <WaveLines color="#b15a36" opacity={0.3} offset={0} />
              <div data-px="-30" className="deco" style={{ position: "absolute", right: "-2vw", top: "50%", transform: "translateY(-50%)", width: "38vh", height: "38vh", borderRadius: "50%", border: "1px solid rgba(177,90,54,.35)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: "62%", height: "62%", borderRadius: "50%", border: "1px solid rgba(177,90,54,.5)", animation: "spin 18s linear infinite", position: "relative" }}>
                  <span style={{ position: "absolute", top: -5, left: "50%", width: 9, height: 9, borderRadius: "50%", background: "#b15a36" }} />
                </div>
              </div>
              <div style={{ position: "relative", zIndex: 2, maxWidth: 1100 }}>
                <div style={{ marginBottom: 18 }}><div data-intro="0" style={{ fontFamily: HG, fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: "#8a8377", fontWeight: 500 }}>Designer · Developer · Braga</div></div>
                <h1 style={{ fontFamily: PF, fontWeight: 500, lineHeight: ".9", letterSpacing: "-.01em", fontSize: "clamp(60px,11vw,200px)" }}>
                  <span style={{ display: "block" }}><span data-intro="1" style={{ display: "block" }}>Duarte</span></span>
                  <span style={{ display: "block" }}><span data-intro="2" style={{ display: "block", fontStyle: "italic", fontWeight: 400, color: "#b15a36", fontSize: "clamp(82px,15.5vw,300px)", lineHeight: ".82", marginTop: "-.02em" }}>Peixoto.</span></span>
                </h1>
                <div style={{ marginTop: 30, maxWidth: 520 }}><p data-intro="3" style={{ fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.55, color: "#56514a" }}>Uma galeria horizontal de projetos. Role para caminhar pela coleção — cada peça é uma sala.</p></div>
              </div>
              <div data-intro="4" className="hero-foot" style={{ position: "absolute", left: "5vw", bottom: "11vh", display: "flex", alignItems: "center", gap: 14, fontFamily: HG, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8377" }}>
                <span style={{ display: "inline-block", width: 46, height: 1, background: "#b15a36" }} />Comece a percorrer
              </div>
              <div data-intro="5" className="hero-foot hero-foot--right" style={{ position: "absolute", right: "5vw", bottom: "11vh", display: "flex", gap: 40, fontFamily: HG, fontSize: 13, textTransform: "uppercase", letterSpacing: ".05em", color: "#8a8377", textAlign: "right" }}>
                <span><span style={{ display: "block", color: "#1c1a16", fontWeight: 600, marginBottom: 3 }}>Disponível</span>Projetos · 2026</span>
                <span><span style={{ display: "block", color: "#1c1a16", fontWeight: 600, marginBottom: 3 }}>Hora local</span><span id="clock">--:--:--</span></span>
              </div>
            </section>

            {/* SOBRE */}
            <section data-panel="7" data-sec="02 — Sobre" data-line="#b15a36" data-wopac="0.3" style={{ position: "relative", flex: "0 0 80vw", height: "100%", background: "#f3efe6", color: "#1c1a16", display: "flex", alignItems: "center", padding: "0 5vw", overflow: "hidden", borderLeft: "1px solid rgba(28,26,22,.1)" }}>
              <WaveLines color="#b15a36" opacity={0.3} offset={100} />
              <div className="sobre-row" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "6%", width: "100%" }}>
                <div className="sobre-photo" style={{ flex: "0 0 30%", aspectRatio: "3/4", borderRadius: 4, overflow: "hidden", position: "relative", border: "1px solid rgba(28,26,22,.1)" }}>
                  <img data-px="-20" src="/portrait.jpg" alt="Duarte Peixoto" style={{ position: "absolute", inset: "-6%", width: "112%", height: "112%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, maxWidth: 680 }}>
                  <div style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#b15a36", marginBottom: 26, fontWeight: 500 }}>(02) — Sobre mim</div>
                  <p style={{ fontFamily: PF, fontWeight: 400, fontSize: "clamp(28px,3.4vw,56px)", lineHeight: 1.1, letterSpacing: "-.005em" }}>Crio onde forma, movimento e <span style={{ fontStyle: "italic", color: "#b15a36" }}>detalhe</span> se encontram.</p>
                  <p style={{ marginTop: 30, maxWidth: 500, fontSize: 16, lineHeight: 1.65, color: "#56514a" }}>Developer e designer autodidata de Braga. Crio experiências digitais com personalidade — do conceito ao código, onde tipografia, movimento e interação trabalham juntos. Fora do código, exploro edição de foto e vídeo e modelação 3D a nível pessoal.</p>
                  <div style={{ marginTop: 34, display: "flex", flexWrap: "wrap", gap: 9, fontFamily: HG, fontSize: 12 }}>
                    {["Web / React", "UI / UX", "Motion", "Edição foto · vídeo", "Modelação 3D"].map((t) => (
                      <span key={t} style={{ border: "1px solid rgba(28,26,22,.22)", borderRadius: 40, padding: "8px 16px", textTransform: "uppercase" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* WORK INTRO */}
            <section data-panel="1" data-sec="03 — Trabalhos" data-line="#b15a36" data-wopac="0.32" style={{ position: "relative", flex: "0 0 46vw", height: "100%", background: "#efe9dd", color: "#1c1a16", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4vw", overflow: "hidden", borderLeft: "1px solid rgba(28,26,22,.1)" }}>
              <WaveLines color="#b15a36" opacity={0.32} offset={180} />
              <div data-px="40" className="deco" style={{ position: "absolute", top: "8vh", right: "3vw", fontFamily: PF, fontWeight: 500, fontSize: "18vw", lineHeight: 1, color: "rgba(28,26,22,.05)", pointerEvents: "none" }}>03</div>
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#b15a36", marginBottom: 22, fontWeight: 500 }}>Coleção 2026</div>
                <h2 style={{ fontFamily: PF, fontWeight: 500, fontSize: "clamp(48px,6vw,108px)", lineHeight: ".94" }}>Projetos<br /><span style={{ fontStyle: "italic" }}>selec.</span></h2>
                <p style={{ marginTop: 28, maxWidth: 340, fontSize: 15, lineHeight: 1.6, color: "#56514a" }}>Três projetos reais em IA, analytics e e-commerce. Clique numa peça para a ver de perto.</p>
              </div>
            </section>

            {/* PROJECT PANELS */}
            {PANELS.map((p) => (
              <section key={p.title} data-panel={p.dataPanel} data-sec={`03 — ${p.title}`} data-line={p.line} data-wopac={p.wopac} onClick={() => setOpen(p.open)} data-cursor="open"
                style={{ position: "relative", flex: "0 0 64vw", height: "100%", background: p.bg, color: p.color, display: "flex", alignItems: "center", cursor: "pointer", overflow: "hidden", ...(p.border ? { borderLeft: "1px solid rgba(28,26,22,.1)" } : {}) }}>
                <WaveLines color={p.line} opacity={p.wopac} offset={226 + p.open * 64} />
                <div data-px="60" className="deco" style={{ position: "absolute", ...p.numPos, fontFamily: PF, fontWeight: 500, fontSize: "clamp(80px,13vw,220px)", lineHeight: ".8", color: p.numColor, pointerEvents: "none" }}>{p.num}</div>
                <div className="proj-row" style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", flexDirection: p.reverse ? "row-reverse" : "row", gap: "5%", width: "100%", padding: "0 4vw" }}>
                  <div className="cover-wrap" style={{ flex: "0 0 46%", aspectRatio: "4/5", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <div data-px="-24" style={{ position: "absolute", inset: "-8%", backgroundImage: p.coverImg ? `url(${p.coverImg})` : p.cover, backgroundSize: p.coverImg ? "cover" : undefined, backgroundPosition: p.coverImg ? (p.coverPos || "center") : undefined, backgroundRepeat: "no-repeat" }} />
                    {!p.coverImg && <div style={{ position: "absolute", left: 16, bottom: 14, fontFamily: HG, fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "#f3efe6" }}>// capa</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: p.catColor, marginBottom: 16, fontWeight: 500 }}>{p.cat}</div>
                    <h3 className="proj-title" style={{ fontFamily: PF, fontWeight: 500, fontSize: "clamp(44px,5.5vw,104px)", lineHeight: ".95" }}>{p.title}</h3>
                    <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 12, fontFamily: HG, fontSize: 13, letterSpacing: ".04em" }}>Ver peça <span className="proj-arrow" style={{ display: "inline-flex", width: 34, height: 34, borderRadius: "50%", border: `1px solid ${p.arrowBorder}`, alignItems: "center", justifyContent: "center" }}>↗</span></div>
                  </div>
                </div>
              </section>
            ))}

            {/* CONTATO */}
            <section data-panel="8" data-sec="04 — Contato" data-line="#d98a64" data-wopac="0.55" style={{ position: "relative", flex: "0 0 96vw", height: "100%", background: "#1c1a16", color: "#f3efe6", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", overflow: "hidden" }}>
              <WaveLines color="#d98a64" opacity={0.5} offset={418} />
              <div data-px="40" className="deco" style={{ position: "absolute", right: "4vw", top: "50%", transform: "translateY(-50%)", width: "30vh", height: "30vh", borderRadius: "50%", background: "#b15a36", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#d98a64", marginBottom: 28, fontWeight: 500 }}>(04) — Vamos trabalhar</div>
                <h2 style={{ fontFamily: PF, fontWeight: 500, fontSize: "clamp(56px,10vw,200px)", lineHeight: ".9", letterSpacing: "-.01em" }}>Vamos criar<span style={{ fontStyle: "italic", color: "#b15a36" }}>.</span></h2>
                <div style={{ marginTop: 46, display: "flex", alignItems: "center", gap: 34, flexWrap: "wrap" }}>
                  <a href="mailto:duartepxto@gmail.com" data-cursor="link" style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#f3efe6", color: "#1c1a16", fontFamily: HG, fontWeight: 500, fontSize: "clamp(15px,1.5vw,19px)", padding: "18px 30px", borderRadius: 50 }}>duartepxto@gmail.com <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: "50%", background: "#b15a36", color: "#f3efe6", alignItems: "center", justifyContent: "center" }}>↗</span></a>
                  <div style={{ display: "flex", gap: 22, fontFamily: HG, fontSize: 14 }}>
                    <a href="https://github.com/Duartepxto" target="_blank" rel="noopener noreferrer" data-cursor="link" className="social-link">GitHub ↗</a>
                    <a href="https://www.linkedin.com/in/duarte-peixoto-b96189397" target="_blank" rel="noopener noreferrer" data-cursor="link" className="social-link">LinkedIn ↗</a>
                  </div>
                </div>
                <div style={{ marginTop: "9vh", fontFamily: HG, fontSize: 12, color: "#8a8377", letterSpacing: ".05em" }}>© 2026 Duarte Peixoto — Feito com cuidado em Braga</div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* PROJECT DETAIL OVERLAY — horizontal scroller */}
      {cur && (
        <div id="projpanel" onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }}
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "#f3efe6", color: "#1c1a16", display: "flex", overflowX: "auto", overflowY: "hidden" }}>

          {/* fixed top bar */}
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 6, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 5vw", background: "linear-gradient(rgba(243,239,230,.92),rgba(243,239,230,0))", pointerEvents: "none" }}>
            <a onClick={() => setOpen(-1)} data-cursor="link" style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: HG, fontSize: 14, letterSpacing: ".02em" }}>
              <span style={{ display: "inline-flex", width: 36, height: 36, border: "1px solid rgba(28,26,22,.3)", borderRadius: "50%", alignItems: "center", justifyContent: "center" }}>←</span>Voltar à galeria
            </a>
            <span style={{ fontFamily: HG, fontSize: 13, color: "#8a8377" }}>{cur.num} / 03</span>
          </div>

          {/* PANEL 1 — title, lead, tech pills, meta */}
          <section className="dpanel" style={{ flex: "0 0 88vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", position: "relative" }}>
            <WaveLines color="#b15a36" opacity={0.22} offset={0} />
            <div style={{ fontFamily: HG, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", color: "#b15a36", marginBottom: 20, fontWeight: 500, animation: "detailUp .7s cubic-bezier(.16,1,.3,1) .05s both" }}>{cur.category} · {cur.year}</div>
            <h1 style={{ fontFamily: PF, fontWeight: 500, fontSize: "clamp(58px,10vw,180px)", lineHeight: ".92", letterSpacing: "-.01em", animation: "detailUp .9s cubic-bezier(.16,1,.3,1) .12s both" }}>{cur.title}<span style={{ fontStyle: "italic", color: "#b15a36" }}>.</span></h1>
            <p style={{ marginTop: 26, maxWidth: 560, fontFamily: PF, fontWeight: 400, fontSize: "clamp(20px,2.2vw,32px)", lineHeight: 1.3 }}>{cur.lead}</p>

            <div style={{ marginTop: 30 }}>
              <div style={{ fontFamily: HG, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#8a8377", marginBottom: 14 }}>Ferramentas & linguagens</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 580 }}>
                {cur.tech.map((t) => (
                  <span key={t} style={{ fontFamily: HG, fontSize: 13, border: "1px solid rgba(177,90,54,.45)", color: "#b15a36", borderRadius: 40, padding: "9px 18px", background: "rgba(177,90,54,.07)" }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[["Cliente", cur.client], ["Função", cur.role], ["Serviços", cur.services]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: HG, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8377", marginBottom: 6 }}>{k}</div>
                  <div style={{ fontFamily: PF, fontSize: 20 }}>{v}</div>
                </div>
              ))}
            </div>

            {cur.github && (
              <a href={cur.github} target="_blank" rel="noopener noreferrer" data-cursor="link" style={{ marginTop: 36, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 11, background: "#1c1a16", color: "#f3efe6", fontFamily: HG, fontSize: 14, fontWeight: 500, padding: "13px 22px", borderRadius: 50 }}>
                <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
                Ver no GitHub
              </a>
            )}

            <div className="deslize-hint" style={{ position: "absolute", right: "5vw", bottom: "8vh", display: "flex", alignItems: "center", gap: 12, fontFamily: HG, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8377" }}>Deslize <span style={{ display: "inline-block", width: 46, height: 1, background: "#b15a36" }} /> →</div>
          </section>

          {/* GALLERY — editorial collage (varied sizes, captions, lines behind) */}
          {cur.gallery && cur.gallery.length > 0 && (
            <section className="dpanel gallery" style={{ display: "flex", alignItems: "center", gap: "3.4vw", padding: "0 9vw", height: "100vh", position: "relative" }}>
              <WaveLines color="#b15a36" opacity={0.18} offset={120} />
              {cur.gallery.map((g, i) => {
                const L = GLAYOUT[i % GLAYOUT.length];
                const portrait = (g.o || "l") === "p";
                return (
                  <div key={i} className="gitem" style={{ flex: "0 0 auto", transform: `translateY(${L.y}vh)`, display: "flex", flexDirection: "column", gap: 14 }}>
                    <span className="gcap" style={{ fontFamily: HG, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#8a8377", fontWeight: 500 }}>{g.label || `${cur.title} · ${g.code}`}</span>
                    <figure className="gshot" style={{ margin: 0, height: `${L.h}vh`, aspectRatio: portrait ? "9 / 19.5" : "16 / 10", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(28,26,22,.1)", background: "#e7e0d2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {g.src ? (
                        <img className="gshot-img" src={g.src} alt={`${cur.title} — ${g.label || i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div className="gshot-img" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, backgroundImage: "repeating-linear-gradient(45deg,#ece5d6,#ece5d6 16px,#e3dac8 16px,#e3dac8 32px)" }}>
                          <span style={{ fontFamily: PF, fontWeight: 500, fontSize: "clamp(34px,4vw,64px)", color: "#1c1a16", lineHeight: 1 }}>{g.code}</span>
                          <span style={{ fontFamily: HG, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#9b9485" }}>{g.code.toLowerCase()}.jpg</span>
                        </div>
                      )}
                    </figure>
                  </div>
                );
              })}
            </section>
          )}

          {/* PANEL 3 — narrative */}
          <section className="dpanel" style={{ flex: "0 0 64vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", borderLeft: "1px solid rgba(28,26,22,.08)" }}>
            <WaveLines color="#b15a36" opacity={0.22} offset={200} />
            <div style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#b15a36", marginBottom: 24, fontWeight: 500 }}>O processo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, color: "#56514a", fontSize: "clamp(16px,1.4vw,19px)", lineHeight: 1.65, maxWidth: 680 }}>
              <p style={{ fontFamily: PF, color: "#1c1a16", fontSize: "clamp(22px,2.2vw,32px)", lineHeight: 1.3 }}>{cur.desc1}</p>
              <p>{cur.desc2}</p>
            </div>
          </section>

          {/* PANEL 5 — next project */}
          <section className="dpanel nextproj" data-cursor="open" onClick={() => { setOpen((o) => (o + 1) % PROJECTS.length); requestAnimationFrame(() => { const el = document.getElementById("projpanel"); if (el) el.scrollLeft = 0; }); }}
            style={{ flex: "0 0 60vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", cursor: "pointer", borderLeft: "1px solid rgba(28,26,22,.08)" }}>
            <WaveLines color="#b15a36" opacity={0.2} offset={360} />
            <div style={{ fontFamily: HG, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8377", marginBottom: 18 }}>Próxima peça</div>
            <div style={{ fontFamily: PF, fontWeight: 500, fontSize: "clamp(48px,8vw,140px)", lineHeight: ".95" }}>{nextTitle}</div>
            <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 14, fontFamily: HG, fontSize: 14 }}>Ver peça <span style={{ display: "inline-flex", width: 40, height: 40, borderRadius: "50%", background: "#1c1a16", color: "#f3efe6", alignItems: "center", justifyContent: "center" }}>→</span></div>
          </section>
        </div>
      )}
    </div>
  );
}
