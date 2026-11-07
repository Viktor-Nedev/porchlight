/* =====================================================================
   Porchlight — story site interactions
   GSAP + ScrollTrigger + SplitText, Lenis smooth scroll, canvas scenes
   ===================================================================== */
(function () {
  const q = (s, c = document) => c.querySelector(s);
  const qa = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const DATA = window.PORCHLIGHT || {};

  gsap.registerPlugin(ScrollTrigger, SplitText);
  window.Scene && window.Scene.build();

  /* ------------------------------------------------ content from data.js */
  (function fillContent() {
    const s = DATA.research && DATA.research.survey;
    if (s && typeof s.respondents === "number") {
      const box = q("#ourResearch");
      box.hidden = false;
      q(".h3", box).textContent = `What we heard on campus · n = ${s.respondents}`;
      q("#ourStats").innerHTML = (s.stats || [])
        .map((st) => `<div class="stat"><b data-count-from="0" data-count-to="${st.value}" data-suffix="${st.suffix || ""}">${st.value}${st.suffix || ""}</b><span>${st.label}</span></div>`)
        .join("");
      q("#ourQuotes").innerHTML = (s.quotes || [])
        .map((qq) => `<blockquote class="quote">“${qq.text}”<cite>— ${qq.who}</cite></blockquote>`)
        .join("");
    }
    const team = DATA.team && DATA.team.members;
    if (team && team.length) q("#teamLine").textContent = "Made by " + team.join(", ");
    const cs = qa(".end-ctas .btn-ghost")[0];
    if (cs && DATA.links && DATA.links.caseStudy) cs.href = DATA.links.caseStudy;
  })();

  /* ------------------------------------------------ smooth scroll */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  qa('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id === "#top" ? 0 : q(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else if (target === 0) window.scrollTo(0, 0);
      else target.scrollIntoView();
    })
  );

  /* ------------------------------------------------ preloader: pull the chain */
  const pre = q("#preloader");
  const chain = q("#plChain");
  let isOn = false;

  function heroIntro() {
    if (reduce) return;
    const tl = gsap.timeline();
    tl.from(".title .ch", { yPercent: 115, rotate: 8, opacity: 0, stagger: 0.045, duration: 1.2, ease: "expo.out" })
      .from(".i-dot", { scale: 0, duration: 0.6, ease: "back.out(3)" }, 0.55)
      .from(".eyebrow", { y: 16, opacity: 0, duration: 0.8, ease: "expo.out" }, 0.2)
      .from([".hero-tag", ".hero-sub"], { y: 22, opacity: 0, stagger: 0.12, duration: 1, ease: "expo.out" }, 0.6)
      .from(".layer", { yPercent: 6, stagger: 0.06, duration: 1.6, ease: "expo.out" }, 0)
      .from([".scroll-cue", ".hero-clock", ".nav"], { opacity: 0, duration: 0.8 }, 1);
  }

  function turnOn() {
    if (isOn) return;
    isOn = true;
    pre.classList.add("is-on");
    const big = (Math.hypot(innerWidth, innerHeight) * 2.4) / 40;
    const done = () => {
      pre.remove();
      document.body.classList.remove("is-loading");
      lenis && lenis.start();
      ScrollTrigger.refresh();
    };
    if (reduce) { done(); return; }
    gsap.timeline({ onComplete: done })
      .to(chain, { y: 46, duration: 0.14, ease: "power2.in" })
      .to(chain, { y: 0, duration: 0.7, ease: "elastic.out(1, .35)" })
      .to(".pl-flood", { scale: big, duration: 1.15, ease: "expo.in" }, 0.12)
      .to(".pl-hint", { opacity: 0, duration: 0.3 }, 0.1)
      .add(heroIntro, 0.95)
      .to(pre, { opacity: 0, duration: 0.7, ease: "power2.out" }, 1.05);
  }

  (function chainDrag() {
    let startY = 0, dy = 0, dragging = false;
    chain.addEventListener("pointerdown", (e) => { dragging = true; startY = e.clientY; dy = 0; chain.setPointerCapture(e.pointerId); });
    chain.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dy = Math.max(0, Math.min(90, e.clientY - startY));
      gsap.set(chain, { y: dy });
      if (dy > 70) { dragging = false; turnOn(); }
    });
    chain.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      if (dy > 34 || dy < 4) turnOn();
      else gsap.to(chain, { y: 0, duration: 0.6, ease: "elastic.out(1, .4)" });
    });
    pre.addEventListener("click", (e) => { if (!chain.contains(e.target)) turnOn(); });
    window.addEventListener("keydown", function onKey(e) {
      if (isOn) return window.removeEventListener("keydown", onKey);
      if (e.key === "Tab") return;
      turnOn();
    });
    // Deep links skip the ceremony
    if (location.hash && q(location.hash)) turnOn();
  })();

  /* ------------------------------------------------ cursor + magnetic */
  if (finePointer && !reduce) {
    const cur = q(".cursor");
    const dotX = gsap.quickTo(".cursor-dot", "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(".cursor-dot", "y", { duration: 0.12, ease: "power3" });
    const gX = gsap.quickTo(".cursor-glow", "x", { duration: 0.7, ease: "power3" });
    const gY = gsap.quickTo(".cursor-glow", "y", { duration: 0.7, ease: "power3" });
    window.addEventListener("pointermove", (e) => { dotX(e.clientX); dotY(e.clientY); gX(e.clientX); gY(e.clientY); });
    document.addEventListener("pointerover", (e) => {
      cur.classList.toggle("is-hover", !!e.target.closest("a, button, [data-magnetic], iframe"));
    });
    qa("[data-magnetic]").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, .4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, .4)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  } else {
    q(".cursor").remove();
  }

  /* ------------------------------------------------ nav + fuse */
  const nav = q(".nav");
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate(self) {
      nav.classList.toggle("is-scrolled", self.scroll() > 40);
      gsap.set(".fuse-fill", { scaleX: self.progress });
      gsap.set(".fuse-spark", { x: self.progress * innerWidth - 4 });
    },
  });

  /* ------------------------------------------------ sky colour per section */
  const SKY = { hero: "#3a2c6b", dusk: "#2a2150", blue: "#1b1838", night: "#15122e", deep: "#0d0b1f" };
  qa("[data-sky]").forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: "top 60%", end: "bottom 60%",
      onToggle: (self) => { if (self.isActive) document.body.style.backgroundColor = SKY[sec.dataset.sky]; },
    });
  });
  ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom 60%", onEnterBack: () => (document.body.style.backgroundColor = SKY.hero) });

  /* ------------------------------------------------ 1. hero: dusk → night */
  const NIGHT = {
    "--sky-top": "#07061a", "--sky-mid": "#191541", "--sky-bot": "#3b2c6e",
    "--c-cloud": "#221d48", "--c-cloud-hi": "#3f3778",
    "--c-rock": "#2b2454", "--c-rock-shade": "#19143a", "--c-snowcap": "#8d86bd",
    "--c-hill-1": "#221c46", "--c-hill-2": "#19153a",
    "--c-city": "#100d24", "--c-win-off": "#1d1940",
    "--c-ground": "#625d93", "--c-ground-hi": "#a9a3d6", "--c-tree": "#090716", "--c-skin": "#b88f8a",
    "--lamp": 1, "--night": 1,
  };
  const wins = qa(".win").sort((a, b) => a.dataset.t - b.dataset.t);
  let lit = 0;
  function updateWindows(p) {
    const target = Math.round(wins.length * Math.min(1, Math.max(0, (p - 0.08) * 1.5)) * 0.85);
    while (lit < target) wins[lit++].classList.add("lit");
    while (lit > target) wins[--lit].classList.remove("lit");
  }
  const clock = q("#heroClock");
  function updateClock(p) {
    const mins = 16 * 60 + 10 + Math.round(p * 150);
    const h = Math.floor(mins / 60) - 12, m = String(mins % 60).padStart(2, "0");
    clock.textContent = `${h}:${m}`;
  }

  if (!reduce) {
    const sticky = q(".hero-sticky");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 0.8,
        onUpdate: (self) => { updateWindows(self.progress); updateClock(self.progress); },
      },
    });
    tl.to(sticky, { ...NIGHT, duration: 0.85 }, 0)
      .to(".hero-sun", { yPercent: 170, opacity: 0, duration: 0.6 }, 0)
      .to(".hero-stars", { opacity: 1, duration: 0.45 }, 0.35)
      .to(".scroll-cue", { opacity: 0, duration: 0.08 }, 0)
      .to(".hero-copy", { yPercent: -35, opacity: 0, duration: 0.3 }, 0.12)
      .to(".bench-a", { x: 64, duration: 0.25, ease: "power1.inOut" }, 0.55)
      .to(".bench-b", { x: -64, duration: 0.25, ease: "power1.inOut" }, 0.55)
      .to(".hero-fade", { opacity: 1, duration: 0.2 }, 0.8);
    qa(".layer").forEach((l) => {
      const d = parseFloat(l.dataset.depth);
      tl.to(l, { y: () => -innerHeight * 0.14 * d, duration: 1 }, 0);
    });
    tl.to(".hero-clock", { color: "#d8d0ea", duration: 0.3 }, 0.3);

    if (finePointer) {
      const movers = qa(".layer").map((l) => ({ d: parseFloat(l.dataset.depth), x: gsap.quickTo(l, "x", { duration: 1.2, ease: "power3" }) }));
      q(".hero").addEventListener("pointermove", (e) => {
        const nx = e.clientX / innerWidth - 0.5;
        movers.forEach((m) => m.x(-nx * 60 * m.d));
      });
    }
  } else {
    updateWindows(0.6);
  }

  /* ------------------------------------------------ snow */
  (function snow() {
    const c = q("#snow"), ctx = c.getContext("2d");
    let w, h, flakes = [], running = false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    function resize() {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      flakes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 2.2, vy: 0.3 + Math.random() * 0.9, ph: Math.random() * 6.28 }));
    }
    function frame(t) {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,.85)";
      for (const f of flakes) {
        f.y += f.vy; f.x += Math.sin(t / 1400 + f.ph) * 0.35;
        if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
        ctx.globalAlpha = 0.35 + f.r / 4;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize(); window.addEventListener("resize", resize);
    if (reduce) return;
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(frame); }).observe(c);
  })();

  /* ------------------------------------------------ split headings */
  function splitReveal() {
    if (reduce) return;
    qa(".split").forEach((el) => {
      SplitText.create(el, {
        type: "lines,words", mask: "lines", autoSplit: true, linesClass: "line-mask-inner",
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 115, rotate: 3, opacity: 0, stagger: 0.035, duration: 1.1, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        },
      });
    });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(splitReveal);

  /* ------------------------------------------------ 2. the moment */
  if (!reduce) {
    gsap.set(".bubble", { opacity: 0, scale: 0.3, transformOrigin: "50% 100%" });
    const lines = qa(".moment-lines li");
    const mt = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".moment", start: "top top", end: "bottom bottom", scrub: 0.6 } });
    mt.from(".table-scene", { yPercent: 10, opacity: 0, scale: 0.94, duration: 0.1 }, 0);
    lines.forEach((li, i) => {
      const t = 0.06 + i * 0.2;
      mt.fromTo(li, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, t);
      if (i < lines.length - 1) mt.to(li, { opacity: 0, y: -30, duration: 0.05 }, t + 0.15);
    });
    mt.to(".bubble", { opacity: 1, scale: 1, stagger: 0.05, duration: 0.06, ease: "back.out(2.2)" }, 0.5)
      .to(".phone-glow", { opacity: 0.25, duration: 0.2 }, 0.6)
      .to(".student", { y: (i) => (i % 2 ? -4 : 4), duration: 0.2 }, 0.62)
      .to({}, { duration: 0.12 }, 0.88);
  }

  /* ------------------------------------------------ 3. boards: scramble + count */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*+-/";
  function scramble(el) {
    const final = el.textContent;
    let f = 0;
    (function tick() {
      el.textContent = final.split("").map((ch, i) => (ch === " " || f > i * 1.1 + 10 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (f++ < final.length * 1.1 + 12) requestAnimationFrame(tick);
      else el.textContent = final;
    })();
  }
  function countUp(el) {
    const to = +el.dataset.countTo, suffix = el.dataset.suffix || "", o = { v: +el.dataset.countFrom || 0 };
    gsap.to(o, { v: to, duration: 1.6, ease: "expo.out", onUpdate: () => (el.textContent = Math.round(o.v) + suffix) });
  }
  if (!reduce) {
    qa("[data-board]").forEach((b, i) => {
      gsap.from(b, { y: 70, opacity: 0, rotateX: -12, duration: 1.1, ease: "expo.out", delay: (i % 3) * 0.08, scrollTrigger: { trigger: b, start: "top 88%", once: true } });
      ScrollTrigger.create({ trigger: b, start: "top 80%", once: true, onEnter: () => { qa("[data-scramble]", b).forEach(scramble); qa("[data-count-to]", b).forEach(countUp); } });
    });
    ScrollTrigger.create({ trigger: "#ourResearch", start: "top 80%", once: true, onEnter: () => qa("#ourResearch [data-count-to]").forEach(countUp) });
  }

  /* ------------------------------------------------ 4. idea: the light comes on */
  if (!reduce) {
    gsap.timeline({ scrollTrigger: { trigger: ".idea", start: "top 75%", end: "center center", scrub: 0.8 } })
      .to(".idea-glow", { scale: 1, ease: "power2.out" })
      .from(".idea-lamp", { y: -160, opacity: 0, ease: "power2.out" }, 0);
    gsap.from(".idea .lede", { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".idea .lede", start: "top 90%", once: true } });
  }

  /* ------------------------------------------------ 5. how: steps drive the prototype */
  const frame = q("#howFrame");
  let frameReady = false, pending = null;
  frame.addEventListener("load", () => { frameReady = true; if (pending) send(pending); });
  function send(screen) {
    pending = screen;
    if (frameReady && frame.contentWindow) frame.contentWindow.postMessage({ type: "porchlight:goto", screen }, "*");
  }
  const steps = qa(".how-step");
  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      steps.forEach((st) => {
        ScrollTrigger.create({
          trigger: st, start: "top 55%", end: "bottom 55%",
          onToggle: (self) => {
            st.classList.toggle("is-active", self.isActive);
            if (self.isActive) send(st.dataset.screen);
          },
        });
      });
      gsap.from("#howPhone", { y: 80, rotate: -4, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".how", start: "top 75%", once: true } });
    },
  });

  /* ------------------------------------------------ 6. lantern cards tilt */
  if (finePointer && !reduce) {
    qa("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.transform = `rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateZ(0)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  }
  if (!reduce) {
    gsap.from(".lantern-card", { y: 90, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".lanterns", start: "top 82%", once: true } });
    gsap.from(".safe-grid li", { y: 40, opacity: 0, stagger: 0.07, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".safe-grid", start: "top 85%", once: true } });
  }

  /* ------------------------------------------------ 7. night sky constellation */
  (function sky() {
    const sec = q("#sky"), c = q("#skyCanvas"), ctx = c.getContext("2d"), counter = q("#skyCount");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w, h, stars = [], links = [], running = false, mouse = { x: -999, y: -999 }, count = 0;
    function resize() {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 7000);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.5 + Math.random() * 1.8, tw: Math.random() * 6.28, vx: (Math.random() - 0.5) * 0.05, vy: (Math.random() - 0.5) * 0.05 }));
      links = [];
      // seed a constellation so the section never looks empty
      for (let i = 0; i < 7; i++) addLinkNear(w * (0.55 + Math.random() * 0.4), h * (0.15 + Math.random() * 0.7), true);
    }
    function nearest(x, y, skip) {
      let best = null, bd = Infinity;
      for (const s of stars) { if (s === skip) continue; const d = (s.x - x) ** 2 + (s.y - y) ** 2; if (d < bd) { bd = d; best = s; } }
      return best;
    }
    function addLinkNear(x, y, silent) {
      const a = nearest(x, y), b = nearest(a.x + (Math.random() - 0.5) * 140, a.y + (Math.random() - 0.5) * 140, a);
      if (!a || !b) return;
      a.big = b.big = true;
      links.push({ a, b, t: 0 });
      if (!silent) { count++; counter.textContent = count; }
    }
    function frame(t) {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      // cursor web
      for (const s of stars) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0; if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
        const d = Math.hypot(s.x - mouse.x, s.y - mouse.y);
        if (d < 170) {
          ctx.strokeStyle = `rgba(255,210,122,${(1 - d / 170) * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      // kept links
      for (const l of links) {
        l.t = Math.min(1, l.t + 0.02);
        const x = l.a.x + (l.b.x - l.a.x) * l.t, y = l.a.y + (l.b.y - l.a.y) * l.t;
        ctx.strokeStyle = "rgba(255,196,92,.8)"; ctx.lineWidth = 1.4;
        ctx.shadowColor = "rgba(255,159,46,.9)"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.shadowBlur = 0;
      }
      for (const s of stars) {
        const a = 0.45 + Math.sin(t / 900 + s.tw) * 0.35;
        ctx.fillStyle = s.big ? `rgba(255,226,160,${0.7 + a * 0.3})` : `rgba(235,232,255,${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.big ? s.r + 1.3 : s.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize(); window.addEventListener("resize", resize);
    sec.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    sec.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
    sec.addEventListener("click", (e) => { const r = c.getBoundingClientRect(); addLinkNear(e.clientX - r.left, e.clientY - r.top); });
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(frame); }).observe(c);
    if (!reduce) {
      ScrollTrigger.create({ trigger: sec, start: "top 60%", end: "bottom top", onUpdate: (self) => {
        // auto-draw a few lines while scrolling through, so phones (no hover) get the effect too
        if (Math.random() < 0.035) addLinkNear(Math.random() * w, Math.random() * h);
      } });
    }
  })();

  /* ------------------------------------------------ 9. roadmap: ride the line */
  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      if (reduce) return;
      const track = q("#lineTrack");
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".roadmap-pin", start: "top top", end: () => "+=" + (dist() + innerHeight * 0.6), pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(track, { x: () => -dist(), duration: 1 }, 0)
        .to(".line-rail-fill", { scaleX: 1, duration: 1 }, 0)
        .to(".train", { x: () => q(".line-rail").offsetWidth - 120, duration: 1 }, 0);
      qa(".station").forEach((st, i, all) => {
        tl.from(st, { opacity: 0.25, y: 30, duration: 0.12 }, (i / all.length) * 0.85);
      });
    },
    "(max-width: 900px)": function () {
      if (reduce) return;
      gsap.to(".line-rail-fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".stations", start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.set(".line-rail-fill", { scaleX: 1, scaleY: 0 });
    },
  });

  /* ------------------------------------------------ 10. lanterns rising */
  (function lanterns() {
    const sec = q("#end"), c = q("#lanternCanvas"), ctx = c.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w, h, list = [], running = false, last = 0;
    function resize() { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function spawn(x, y) {
      const s = 0.6 + Math.random() * 0.9;
      list.push({ x: x ?? Math.random() * w, y: y ?? h + 40, s, vy: 0.35 + s * 0.45, ph: Math.random() * 6.28, life: 0 });
      if (list.length > 48) list.shift();
    }
    function drawLantern(L, t) {
      const x = L.x + Math.sin(t / 1300 + L.ph) * 14 * L.s, y = L.y, s = L.s;
      const flick = 0.85 + Math.sin(t / 120 + L.ph * 3) * 0.08;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 60 * s);
      g.addColorStop(0, `rgba(255,196,92,${0.45 * flick})`); g.addColorStop(1, "rgba(255,159,46,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 60 * s, 0, 6.283); ctx.fill();
      const bw = 18 * s, bh = 26 * s;
      const body = ctx.createLinearGradient(x, y - bh / 2, x, y + bh / 2);
      body.addColorStop(0, "#ffd99a"); body.addColorStop(1, "#ff8a3d");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.moveTo(x - bw * 0.42, y - bh / 2); ctx.lineTo(x + bw * 0.42, y - bh / 2);
      ctx.quadraticCurveTo(x + bw * 0.62, y, x + bw * 0.5, y + bh / 2);
      ctx.lineTo(x - bw * 0.5, y + bh / 2);
      ctx.quadraticCurveTo(x - bw * 0.62, y, x - bw * 0.42, y - bh / 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,248,220,${0.9 * flick})`;
      ctx.beginPath(); ctx.ellipse(x, y + bh * 0.32, bw * 0.18, bh * 0.1, 0, 0, 6.283); ctx.fill();
    }
    function frame(t) {
      if (!running) return;
      if (t - last > 900) { spawn(); last = t; }
      ctx.clearRect(0, 0, w, h);
      for (const L of list) { L.y -= L.vy; drawLantern(L, t); }
      list = list.filter((L) => L.y > -80);
      requestAnimationFrame(frame);
    }
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 14; i++) spawn(Math.random() * w, Math.random() * h);
    sec.addEventListener("click", (e) => { if (e.target.closest("a")) return; const r = c.getBoundingClientRect(); for (let i = 0; i < 3; i++) spawn(e.clientX - r.left + (Math.random() - 0.5) * 40, e.clientY - r.top); });
    if (reduce) { list.forEach((L) => drawLantern(L, 0)); return; }
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(frame); }).observe(c);
  })();

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
