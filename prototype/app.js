/* =====================================================================
   Porchlight — interactive prototype
   A tiny state machine: every screen is a render function; actions are
   delegated through data-action attributes. The story site drives this
   page through postMessage({ type: "porchlight:goto", screen }).
   ===================================================================== */
(function () {
  const params = new URLSearchParams(location.search);
  const EMBED = params.has("embed");
  if (EMBED) document.documentElement.classList.add("is-embed");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const IMG = "../assets/img/";

  /* ------------------------------------------------ hand-drawn icon set (24×24, stroke) */
  const P = {
    food: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M6 19.5h12"/><path d="M9 4c-1 1.4 1 2.6 0 4M13 3.5c-1 1.6 1 2.8 0 4.5"/><path d="M15.5 9.5 20 4"/>',
    study: '<path d="M3 6.5c3-1.6 6-1.6 9 0v12c-3-1.6-6-1.6-9 0z"/><path d="M21 6.5c-3-1.6-6-1.6-9 0v12c3-1.6 6-1.6 9 0z"/>',
    coffee: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 3.5c-.8 1.2.8 2 0 3.2M12 3.5c-.8 1.2.8 2 0 3.2"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M11 21l2-6-2.5-2.5L12 8l3 3 3 1"/><path d="M12 8l-3.5 2L7 13.5"/><path d="M13 15l3 6"/>',
    company: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2.8" y="14" width="4.4" height="6.5" rx="2"/><rect x="16.8" y="14" width="4.4" height="6.5" rx="2"/>',
    game: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.1" class="f"/><circle cx="15.5" cy="15.5" r="1.1" class="f"/><circle cx="12" cy="12" r="1.1" class="f"/><circle cx="15.5" cy="8.5" r="1.1" class="f"/><circle cx="8.5" cy="15.5" r="1.1" class="f"/>',
    pin: '<path d="M12 21s-6.5-6.4-6.5-11a6.5 6.5 0 0 1 13 0c0 4.6-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.8 2M9.5 3h5"/>',
    seat: '<path d="M7 4v9h10"/><path d="M7 13v7M17 13v7M7 17h10"/><path d="M5 4h4"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    wave: '<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 10.5V5a1.5 1.5 0 0 1 3 0v6M14 10.5V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5-2.7L3 15.4a1.6 1.6 0 0 1 2.6-1.8L8 16"/><path d="M19.5 3.5c1 .8 1.6 1.9 1.6 3.2"/>',
    run: '<path d="M14 4h5v16h-5"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    shuffle: '<path d="M4 7h3.5c4 0 5 10 9 10H20M4 17h3.5c1.5 0 2.6-1.4 3.4-3M17 4l3 3-3 3M17 14l3 3-3 3M13.2 10c.8-1.6 1.9-3 3.3-3H20"/>',
    heart: '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.6 12 20 12 20z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5"/>',
  };
  const icon = (k, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[k]}</svg>`;

  /* ------------------------------------------------ data */
  const VIBES = {
    food: { t: "Eating", long: "Eating lunch" },
    study: { t: "Studying", long: "Studying" },
    coffee: { t: "Coffee break", long: "Coffee break" },
    walk: { t: "Walking somewhere", long: "Walking somewhere" },
    company: { t: "Just want company", long: "Just want company" },
    game: { t: "Up for a game", long: "Up for a game" },
  };
  const SPOTS = {
    machall: { name: "MacHall", sub: "food court", x: 176, y: 236 },
    tfdl: { name: "TFDL", sub: "2nd floor", x: 84, y: 128 },
    ict: { name: "ICT", sub: "main floor", x: 282, y: 120 },
    kin: { name: "Kinesiology", sub: "lounge", x: 74, y: 352 },
    sci: { name: "Science Theatres", sub: "atrium", x: 276, y: 318 },
    eng: { name: "Engineering", sub: "ENG 224 hallway", x: 286, y: 430 },
    train: { name: "University C-Train", sub: "platform", x: 92, y: 470 },
  };
  const LIGHTS = [
    { id: "maya", name: "Maya", prog: "Nursing · 2nd year", spot: "machall", vibe: "food", note: "Two free seats, come say hi", ask: "my failed sourdough era", left: 18, seats: 2, color: "#e8607a", walk: 2 },
    { id: "dev", name: "Dev", prog: "Software Eng · 3rd year", spot: "tfdl", vibe: "study", note: "Grinding CPSC 331. Study buddies welcome", ask: "the best hidden study spot", left: 42, seats: 3, color: "#8b7cff", walk: 4 },
    { id: "amira", name: "Amira", prog: "Kinesiology · 1st year", spot: "kin", vibe: "company", note: "3-hour lab done. Need human noise", ask: "my marathon training", left: 25, seats: 1, color: "#4fb3a9", walk: 6 },
    { id: "lucas", name: "Lucas", prog: "Geology · 4th year", spot: "train", vibe: "walk", note: "Taking the 4:40 train, walk with me?", ask: "rocks. genuinely, any rock", left: 12, seats: 2, color: "#f2a65a", walk: 5 },
    { id: "sofia", name: "Sofía", prog: "Fine Arts · 2nd year", spot: "sci", vibe: "coffee", note: "Sketching, happy to chat", ask: "what I’m drawing right now", left: 33, seats: 2, color: "#c58bff", walk: 4 },
  ];
  const SPARKS = [
    "What’s the most Calgary thing that happened to you this week?",
    "If credits didn’t matter, which class would you take just for fun?",
    "Best and worst place on campus to nap. Go.",
    "What’s something you’re weirdly good at?",
    "C-Train or driving? Defend your answer.",
    "What did eight-year-old you want to be?",
  ];
  const FACES = [
    { v: 1, t: "Awkward" }, { v: 2, t: "Meh" }, { v: 3, t: "Fine" }, { v: 4, t: "Good" }, { v: 5, t: "Great" },
  ];

  /* A little paper lantern whose glow and expression grow with the score */
  function lanternFace(v, size = 44) {
    const glow = [0.18, 0.32, 0.5, 0.72, 1][v - 1];
    const mouths = {
      1: '<path d="M17 30.5c1.4-1.2 2.6 1.2 4 0s2.6 1.2 4 0 2.6 1.2 4 0" />',
      2: '<path d="M18 30.5h10" />',
      3: '<path d="M18 29.5c2.6 2.2 7.4 2.2 10 0" />',
      4: '<path d="M17.5 28.8c2.8 3.2 8.2 3.2 11 0" />',
      5: '<path d="M17 28h12c-.6 4.4-3 6.4-6 6.4s-5.4-2-6-6.4z" class="fm" />',
    };
    const eyes = v === 5
      ? '<path d="M15.5 23.8c1-1.6 3-1.6 4 0M26.5 23.8c1-1.6 3-1.6 4 0" />'
      : v === 1
        ? '<circle cx="17.6" cy="23.6" r="1.5" class="fe"/><circle cx="28.4" cy="23.6" r="1.5" class="fe"/><path d="M32.5 17.5c-1.2 1.8-1.2 3 0 3.6 1.2-.6 1.2-1.8 0-3.6z" class="sweat"/>'
        : '<circle cx="17.6" cy="23.6" r="1.7" class="fe"/><circle cx="28.4" cy="23.6" r="1.7" class="fe"/>';
    const blush = v >= 4 ? '<ellipse cx="14.6" cy="28" rx="2.2" ry="1.3" class="fb"/><ellipse cx="31.4" cy="28" rx="2.2" ry="1.3" class="fb"/>' : "";
    const id = "lg" + v + Math.random().toString(36).slice(2, 6);
    return `<svg class="lf" viewBox="0 0 46 52" width="${size}" height="${size * 52 / 46}" aria-hidden="true" style="--g:${glow}">
      <defs><radialGradient id="${id}" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#fff6d6" stop-opacity="${0.55 + glow * 0.45}"/><stop offset=".55" stop-color="#ffc35c" stop-opacity="${0.35 + glow * 0.6}"/><stop offset="1" stop-color="#b9875f" stop-opacity="${0.5 + glow * 0.2}"/></radialGradient></defs>
      <circle cx="23" cy="27" r="22" class="lf-halo"/>
      <path d="M17 6.5c0-3 2.7-4.5 6-4.5s6 1.5 6 4.5" class="lf-wire"/>
      <rect x="14.5" y="6.5" width="17" height="4" rx="2" class="lf-cap"/>
      <path d="M23 10.5c-9.5 0-14 6.6-14 15.5s4.5 15.5 14 15.5 14-6.6 14-15.5-4.5-15.5-14-15.5z" fill="url(#${id})" class="lf-body"/>
      <path d="M10.5 20.5c8 2 17 2 25 0M9.5 30c8.5 2 18.5 2 27 0" class="lf-rib"/>
      <rect x="15.5" y="40.5" width="15" height="4" rx="2" class="lf-cap"/>
      <g class="lf-face">${eyes}${mouths[v]}${blush}</g>
    </svg>`;
  }

  const initialState = () => ({
    host: LIGHTS[0],
    filter: "all",
    forecast: null,
    reality: null,
    spark: 0,
    my: { spot: "machall", vibe: "food", note: "", ask: "", mins: 30, seats: 2 },
    embers: [
      { name: "Jordan", spot: "tfdl", g: 2, r: 4 },
      { name: "Priya", spot: "machall", g: 3, r: 4 },
      { name: "Sam", spot: "train", g: 1, r: 3 },
      { name: "Noor", spot: "kin", g: 2, r: 2 },
      { name: "Ethan", spot: "machall", g: 3, r: 5 },
      { name: "Lin", spot: "ict", g: 2, r: 4 },
    ],
  });
  let S = initialState();
  let current = null;
  let navId = 0;
  let toastTimer = null;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  /* ------------------------------------------------ helpers */
  const face = (v) => FACES.find((f) => f.v === v) || FACES[2];
  /* Add an id here once its portrait exists in assets/img/avatars/<id>.webp (see docs/IMAGE_PROMPTS_V2.md) */
  const AVATARS = [];
  const avatar = (p, size = 44, ring = null) => {
    const id = p.id || p.name.toLowerCase();
    const r = ring == null ? "" : `<svg class="av-ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18.5" class="avr-bg"/><circle cx="20" cy="20" r="18.5" class="avr-fg" pathLength="100" style="stroke-dasharray:${Math.round(ring * 100)} 100"/></svg>`;
    return `<span class="av" style="--c:${p.color};--s:${size}px"><span class="av-l">${p.name[0]}</span>${AVATARS.includes(id) ? `<img src="${IMG}avatars/${id}.webp" alt="" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()" />` : ""}${r}</span>`;
  };
  const spotLabel = (id) => `${SPOTS[id].name} · ${SPOTS[id].sub}`;
  const gapAvg = () => { const a = S.embers.map((e) => e.r - e.g); return a.reduce((x, y) => x + y, 0) / a.length; };
  function toast(html, ms = 2800) {
    const t = $("#toast");
    t.innerHTML = html;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }
  const facesRow = (sel, action) => `
    <div class="faces" role="radiogroup">
      ${FACES.map((f) => `<button class="face${sel === f.v ? " on" : ""}" role="radio" aria-checked="${sel === f.v}" aria-label="${f.t}" data-action="${action}" data-v="${f.v}">${lanternFace(f.v)}<small>${f.t}</small></button>`).join("")}
    </div>`;

  /* ------------------------------------------------ campus map (SVG, pseudo-isometric) */
  const BUILDINGS = [
    { x: 46, y: 92, w: 76, h: 46, d: 16, label: "TFDL", tall: 3 },
    { x: 240, y: 92, w: 86, h: 38, d: 14, label: "ICT", tall: 4 },
    { x: 128, y: 204, w: 96, h: 40, d: 12, label: "MACHALL", tall: 2, dome: true },
    { x: 30, y: 320, w: 88, h: 40, d: 12, label: "KINESIOLOGY", tall: 2 },
    { x: 232, y: 290, w: 90, h: 34, d: 12, label: "SCIENCE TH.", tall: 2 },
    { x: 244, y: 402, w: 84, h: 40, d: 14, label: "ENGINEERING", tall: 3 },
  ];
  const PATHS = [[176, 236, 84, 128], [176, 236, 282, 120], [176, 236, 74, 352], [176, 236, 276, 318], [276, 318, 286, 430], [74, 352, 92, 470], [176, 236, 176, 560]];
  function rng(seed) { let a = seed; return () => ((a = (a * 16807) % 2147483647) / 2147483647); }
  function mapSVG(opts = {}) {
    const R = rng(11);
    const lights = opts.only ? LIGHTS.filter((l) => l.id === opts.only) : LIGHTS.filter((l) => S.filter === "all" || l.vibe === S.filter);
    const bld = (b) => {
      const { x, y, w, h, d } = b;
      const top = `M${x},${y} l${d},${-d * 0.7} h${w} l${-d},${d * 0.7} z`;
      const side = `M${x + w},${y} l${d},${-d * 0.7} v${h} l${-d},${d * 0.7} z`;
      const cols = Math.floor((w - 10) / 9), rows = Math.max(1, Math.floor((h - 10) / 9));
      let wins = "";
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const lit = R() < 0.42;
        wins += `<rect x="${x + 6 + c * 9}" y="${y + 6 + r * 9}" width="5" height="5" rx=".8" class="${lit ? "bw-on" : "bw-off"}"${lit ? ` style="animation-delay:${(R() * 4).toFixed(2)}s"` : ""}/>`;
      }
      const dome = b.dome ? `<path d="M${x + w / 2 - 14},${y - 4} a14,10 0 0 1 28,0 z" class="b-dome"/>` : "";
      return `<g class="bld">
        <ellipse cx="${x + w / 2 + 8}" cy="${y + h + 4}" rx="${w / 2 + 14}" ry="7" class="b-shadow"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" class="b-front"/>
        <path d="${side}" class="b-side"/><path d="${top}" class="b-top"/>
        <path d="M${x + 3},${y - 1} l${d - 2},${-d * 0.7 + 1} h${w - 6}" class="b-snow"/>
        ${dome}${wins}
        <g transform="translate(${x + w / 2},${y + h + 15})"><rect x="${-b.label.length * 3 - 7}" y="-7" width="${b.label.length * 6 + 14}" height="13" rx="6.5" class="b-tag"/><text y="3" class="bld-label">${b.label}</text></g>
      </g>`;
    };
    const lamps = PATHS.map(([x1, y1, x2, y2]) => {
      const len = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(len / 38);
      let o = "";
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1), px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
        const nx = -(y2 - y1) / len * 9, ny = (x2 - x1) / len * 9;
        o += `<g class="lamp" transform="translate(${(px + nx).toFixed(1)},${(py + ny).toFixed(1)})"><circle r="9" class="lamp-glow"/><circle r="1.8" class="lamp-dot"/></g>`;
      }
      return o;
    }).join("");
    const tree = (x, y, s = 1) => `<g class="tree" transform="translate(${x},${y}) scale(${s})"><ellipse cx="2" cy="1" rx="7" ry="2.4" class="t-shadow"/><path d="M0,-18 l6,9 h-12z M0,-12 l8,11 h-16z"/><path d="M-4,-11 q4,-2 8,0 M-6,-4 q6,-2.4 12,0" class="tree-snow"/></g>`;
    const trees = [[24, 62], [38, 76], [16, 84], [330, 60], [344, 74], [342, 212], [20, 232], [12, 250], [200, 402], [214, 414], [334, 512], [150, 522], [30, 424], [226, 180], [118, 296], [330, 372], [210, 470]].map(([x, y], i) => tree(x, y, 0.8 + (i % 3) * 0.15)).join("");
    const pin = (l) => {
      const s = SPOTS[l.spot], sel = opts.selected === l.id ? " is-sel" : "";
      return `<g class="pin${sel}" data-action="open" data-id="${l.id}" transform="translate(${s.x},${s.y})" tabindex="0" role="button" aria-label="${l.name}, ${VIBES[l.vibe].long} at ${spotLabel(l.spot)}">
        <circle class="pin-glow" r="30"/><circle class="pin-ring" r="13" style="stroke:${l.color}"/>
        <ellipse cx="0" cy="3" rx="7" ry="2.4" class="pin-shadow"/>
        <g class="pin-body"><path d="M0,0 C-4,-6 -13,-11 -13,-21 a13,13 0 0 1 26,0 C13,-11 4,-6 0,0z" style="fill:${l.color}"/>
        <circle cy="-21" r="9.5" class="pin-face"/><text y="-17.4" class="pin-letter">${l.name[0]}</text>
        <g transform="translate(9,-32)"><circle r="7" class="pin-badge"/><g transform="translate(-5,-5) scale(.42)" class="pin-ic">${P[l.vibe]}</g></g></g>
      </g>`;
    };
    const you = SPOTS.machall, yx = you.x - 30, yy = you.y + 36;
    let route = "";
    if (opts.route) {
      const h = SPOTS[S.host.spot];
      route = `<path class="m-route-bg" d="M${yx},${yy} L176,${yy} L176,236 L${h.x},${h.y}"/><path class="m-route" d="M${yx},${yy} L176,${yy} L176,236 L${h.x},${h.y}"/>`;
    }
    return `<svg class="map" viewBox="${opts.viewBox || "0 0 360 540"}" preserveAspectRatio="xMidYMid slice" aria-label="Illustrated campus map at night">
      <defs>
        <radialGradient id="pg"><stop offset="0" stop-color="#ffc35c" stop-opacity=".55"/><stop offset="1" stop-color="#ffc35c" stop-opacity="0"/></radialGradient>
        <radialGradient id="lg"><stop offset="0" stop-color="#ffd27a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
        <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#26215a"/><stop offset="1" stop-color="#191541"/></linearGradient>
        <linearGradient id="ice" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3b4a8c"/><stop offset=".5" stop-color="#2a3474"/><stop offset="1" stop-color="#3b4a8c"/></linearGradient>
        <pattern id="snowdots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".8" fill="#4a4390"/><circle cx="12" cy="13" r=".6" fill="#3d3780"/><circle cx="15" cy="3" r=".5" fill="#4a4390"/></pattern>
        <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect x="-40" y="-40" width="440" height="640" fill="url(#ground)"/>
      <rect x="-40" y="-40" width="440" height="640" fill="url(#snowdots)"/>
      <g opacity=".5" filter="url(#soft)"><ellipse cx="60" cy="40" rx="80" ry="30" fill="#33307a"/><ellipse cx="300" cy="250" rx="60" ry="40" fill="#2f2b70"/><ellipse cx="120" cy="520" rx="90" ry="34" fill="#302b72"/></g>
      <ellipse cx="318" cy="226" rx="34" ry="18" fill="url(#ice)" class="pond"/><path d="M296,222 q10,-6 22,-2 M310,232 q8,-3 16,0" class="ice-shine"/>
      <g class="paths">${PATHS.map(([a, b, c, d]) => `<path d="M${a},${b} L${c},${d}" class="path-edge"/>`).join("")}${PATHS.map(([a, b, c, d]) => `<path d="M${a},${b} L${c},${d}" class="path"/>`).join("")}${PATHS.map(([a, b, c, d]) => `<path d="M${a},${b} L${c},${d}" class="path-dash"/>`).join("")}</g>
      <g class="rail-g"><path class="rail-bed" d="M-20,504 L380,436"/><path class="rail" d="M-20,500 L380,432"/><path class="rail" d="M-20,507 L380,439"/><path class="rail-ties" d="M-20,503.5 L380,435.5"/>
        <g transform="translate(150,470) rotate(-9.6)"><rect x="-34" y="-7" width="68" height="13" rx="4" class="train-body"/><rect x="-28" y="-4" width="10" height="5" rx="1" class="train-win"/><rect x="-14" y="-4" width="10" height="5" rx="1" class="train-win"/><rect x="0" y="-4" width="10" height="5" rx="1" class="train-win"/><rect x="14" y="-4" width="10" height="5" rx="1" class="train-win"/><circle cx="33" cy="0" r="2" class="train-light"/></g></g>
      <g transform="translate(94,486) rotate(-9.6)"><rect x="-42" y="-6" width="84" height="11" rx="3" class="platform"/></g>
      <text x="62" y="526" class="bld-label station">UNIVERSITY STN</text>
      ${route}
      ${lamps}
      ${BUILDINGS.map(bld).join("")}
      ${trees}
      <g class="you" transform="translate(${yx},${yy})"><path d="M0,0 L-11,-24 A26,26 0 0 1 11,-24 Z" class="you-cone"/><circle r="15" class="you-pulse"/><circle r="6.5" class="you-dot"/></g>
      ${lights.map(pin).join("")}
    </svg>`;
  }
  const mapChrome = (n) => `
    <div class="map-chrome" aria-hidden="true">
      <span class="live"><i></i>LIVE · ${n} on</span>
      <span class="legend"><i></i> Lights fade in 15–90 min</span>
      <span class="zoom"><b>+</b><b>−</b></span>
      <span class="compass">N</span>
    </div>`;

  /* ------------------------------------------------ screens */
  const SCREENS = {
    welcome: { tab: false, label: "Welcome", render: () => `
      <section class="scr scr-welcome">
        <div class="wl-art"><img src="${IMG}campus-night.webp" alt="" width="2048" height="1144" /><span class="wl-fade"></span></div>
        <div class="wl-wick"><span class="wl-glow"></span><img src="${IMG}mascot-wick.webp" alt="Wick, the Porchlight lantern, waving hello" width="501" height="768" /></div>
        <div class="wl-body">
          <span class="wl-pill">${icon("pin", "xs")} University of Calgary</span>
          <h1 class="wl-title">porchl<span>ı</span>ght</h1>
          <p class="wl-tag">Leave a light on.</p>
          <p class="wl-copy">See who on campus is open to company right now, and let people know when you are too.</p>
          <div class="wl-dots" aria-hidden="true"><i class="on"></i><i></i><i></i></div>
          <button class="btn-primary" data-action="go" data-to="map"><span class="btn-mail">@</span> Continue with campus email</button>
          <p class="wl-fine">${icon("shield", "xs")}Students &amp; staff only · first name only · lights fade on their own</p>
        </div>
      </section>` },

    map: { tab: "map", label: "Lights map", render: () => {
      const lights = LIGHTS.filter((l) => S.filter === "all" || l.vibe === S.filter);
      return `
      <section class="scr scr-map">
        <header class="map-head">
          <span class="me-av"><img src="${IMG}wick-3.webp" alt="" /></span>
          <div class="mh-text"><p class="hi">Good evening, Alex</p><h2><b>${lights.length}</b> light${lights.length === 1 ? "" : "s"} on near you</h2></div>
          <span class="weather">${icon("snow", "xs")}−6°</span>
          <button class="icon-btn" data-action="toast" data-msg="Block, report and “I have to run” are always one tap away." aria-label="Safety">${icon("shield")}</button>
        </header>
        <div class="chips" role="tablist" aria-label="Filter by vibe">
          ${["all", "food", "study", "coffee", "company", "walk"].map((f) => `<button class="chip${S.filter === f ? " on" : ""}" data-action="filter" data-f="${f}" aria-label="${f === "all" ? "All" : VIBES[f].t}">${f === "all" ? "All" : icon(f)}${f !== "all" && S.filter === f ? `<span>${VIBES[f].t}</span>` : ""}</button>`).join("")}
        </div>
        <div class="map-wrap">${mapSVG()}${mapChrome(lights.length)}</div>
        <div class="cards-head"><b>Nearby</b><span class="mono">sorted by walk time</span></div>
        <div class="cards" aria-label="Lights near you">
          ${lights.length ? lights.slice().sort((a, b) => a.walk - b.walk).map((l) => `
            <button class="lcard" data-action="open" data-id="${l.id}" style="--c:${l.color}">
              <span class="lc-top">${avatar(l, 40, l.left / 60)}<span class="lc-who"><b>${l.name}</b><small>${l.prog}</small></span><span class="lc-vibe">${icon(l.vibe)}</span></span>
              <span class="lc-note">“${l.note}”</span>
              <span class="lc-meta"><span>${icon("walk", "xs")}${l.walk} min</span><span>${icon("timer", "xs")}${l.left} min left</span><span class="seats">${Array.from({ length: l.seats + 1 }, (_, i) => `<i class="${i === 0 ? "taken" : ""}"></i>`).join("")}</span></span>
            </button>`).join("") : `<p class="empty">No lights like that right now. Why not light your own?</p>`}
        </div>
      </section>`; } },

    detail: { tab: false, label: "A light", render: () => { const h = S.host; const seatsTotal = h.seats + 2; return `
      <section class="scr scr-detail">
        <div class="map-wrap dim">${mapSVG({ selected: h.id })}</div>
        <div class="sheet" style="--c:${h.color}">
          <span class="grab"></span>
          <div class="dt-head">${avatar(h, 58, h.left / 60)}<div><h2>${h.name}</h2><p>${h.prog}</p></div><span class="dt-vibe">${icon(h.vibe)}<small>${VIBES[h.vibe].t}</small></span></div>
          <p class="dt-note">“${h.note}”</p>
          <div class="dt-table">
            <svg viewBox="0 0 160 84" aria-hidden="true">
              <rect x="24" y="30" width="112" height="25" rx="8" class="tb-shadow"/><rect x="20" y="25" width="120" height="30" rx="9" class="tb-top"/><path d="M30 33 h50 M86 33 h40 M34 46 h70 M110 46 h20" class="tb-grain"/>
              ${Array.from({ length: seatsTotal }, (_, i) => { const top = i % 2 === 0, col = Math.floor(i / 2), n = Math.ceil(seatsTotal / 2), x = 22 + (116 / (n + 1)) * (col + 1), y = top ? 12 : 72, taken = i < 2; return taken ? `<circle cx="${x}" cy="${y}" r="9" class="seat-taken" style="fill:${i === 0 ? h.color : "#8f86c4"}"/><text x="${x}" y="${y + 3.4}" class="seat-l">${i === 0 ? h.name[0] : "J"}</text>` : `<circle cx="${x}" cy="${y}" r="9" class="seat-free"/><path d="M${x - 3.5},${y} h7 M${x},${y - 3.5} v7" class="seat-plus"/>`; }).join("")}
              <circle cx="52" cy="40" r="5" class="tb-cup"/><circle cx="52" cy="40" r="2.6" class="tb-coffee"/><rect x="96" y="33" width="20" height="14" rx="2" class="tb-book" transform="rotate(-8 106 40)"/><path d="M106 34 v13" class="tb-spine" transform="rotate(-8 106 40)"/>
            </svg>
            <div><b>${h.seats} seat${h.seats > 1 ? "s" : ""} free</b><small>${h.name} + Jordan are here</small></div>
          </div>
          <div class="dt-ask"><span>Ask me about</span><b>${h.ask}</b></div>
          <ul class="dt-meta">
            <li>${icon("pin")}<span><b>${SPOTS[h.spot].name}</b><small>${SPOTS[h.spot].sub}</small></span></li>
            <li>${icon("walk")}<span><b>${h.walk} min</b><small>walk</small></span></li>
            <li>${icon("timer")}<span><b>${h.left} min</b><small>left</small></span></li>
          </ul>
          <button class="btn-primary" data-action="go" data-to="forecast">I’m coming over</button>
          <button class="btn-text" data-action="go" data-to="map">Not now</button>
        </div>
      </section>`; } },

    forecast: { tab: false, label: "Private guess", render: () => `
      <section class="scr scr-forecast">
        <button class="back" data-action="go" data-to="detail" aria-label="Back">${icon("back")}</button>
        <p class="eyebrow">Before you go</p>
        <h2 class="big">How do you think this will go?</h2>
        <p class="sub">Just a gut feeling. <b>Only you will ever see this.</b> Later we’ll compare it with how it actually went.</p>
        ${facesRow(S.forecast, "forecast")}
        <div class="note-row"><img src="${IMG}wick-2.webp" alt="" width="794" height="757" class="note-wick" /><p class="hand note">Most people guess lower than it turns out. Let’s see.</p></div>
      </section>` },

    onway: { tab: false, label: "On the way + Spark", render: () => { const h = S.host; return `
      <section class="scr scr-onway">
        <header class="ow-head">${avatar(h, 42, h.left / 60)}<div><b>${h.name} knows you’re coming</b><small>${spotLabel(h.spot)}</small></div><span class="ow-live"><i></i>live</span></header>
        <div class="route-map">${mapSVG({ only: h.id, route: true, viewBox: "60 150 250 240" })}
          <div class="eta-chip"><b>${h.walk} min</b><span>${h.walk * 80} m · indoors via the walkway</span></div>
        </div>
        <button class="spark" data-action="flip" aria-label="Reveal your shared Spark">
          <span class="spark-inner">
            <span class="spark-face spark-front"><span class="sp-stamp">${icon("spark", "lg")}</span><b>Your shared Spark</b><small>tap to reveal</small></span>
            <span class="spark-face spark-back"><small>You both got</small><b id="sparkText">${SPARKS[S.spark]}</b><span class="sp-num mono">SPARK ${String(S.spark + 1).padStart(2, "0")} / ${String(SPARKS.length).padStart(2, "0")}</span></span>
          </span>
        </button>
        <button class="btn-text shuffle" data-action="shuffle">${icon("shuffle", "inline")} Another Spark</button>
        <button class="btn-primary" data-action="go" data-to="kindle">I’m here ${icon("wave", "inline")}</button>
        <button class="btn-text" data-action="toast" data-msg="No worries. We told ${h.name} something came up.">${icon("run", "inline")} I have to run</button>
      </section>`; } },

    kindle: { tab: false, label: "Kindle + reality check", render: () => `
      <section class="scr scr-kindle">
        <div class="merge" aria-hidden="true"><img class="m-wick" src="${IMG}wick-4.webp" alt="" width="704" height="760" /><span class="m-burst"></span></div>
        <h2 class="big center">Kindled</h2>
        <p class="sub center">You and ${S.host.name} found each other. Enjoy the chat. We’ll check back when the light fades.</p>
        <div class="later">
          <p class="eyebrow center">Light faded · 18 min later</p>
          <h3 class="center">How did it actually go?</h3>
          ${facesRow(S.reality, "reality")}
        </div>
      </section>` },

    result: { tab: false, label: "Forecast vs reality", render: () => {
      const g = S.forecast ?? 2, r = S.reality ?? 4, d = r - g;
      const msg = d > 0 ? "It went better than you feared. That’s the liking gap, and you just closed it a little." : d === 0 ? "Spot on. You’re learning to trust your own read." : "Not every chat clicks, and that’s okay. You still went first, and that counts.";
      return `
      <section class="scr scr-result">
        <p class="eyebrow center">Forecast vs. reality</p>
        <div class="vs">
          <div class="vs-col"><small>You guessed</small>${lanternFace(g, 64)}<b>${face(g).t}</b></div>
          <div class="vs-arrow"><span class="vs-delta">${d > 0 ? "+" : ""}${d}</span><svg viewBox="0 0 60 20"><path d="M2 10h52m-8-7 8 7-8 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <div class="vs-col"><small>It was</small>${lanternFace(r, 64)}<b>${face(r).t}</b></div>
        </div>
        <p class="sub center">${msg}</p>
        <div class="ember-ask">
          <h3>Keep the ember?</h3>
          <p>If ${S.host.name} keeps it too, you’ll appear in each other’s night sky. If not, nobody is notified.</p>
          <button class="btn-primary" data-action="keep">${icon("heart", "inline")} Keep the ember</button>
          <button class="btn-text" data-action="go" data-to="map">Let it fade</button>
        </div>
      </section>`; } },

    sky: { tab: "sky", label: "Your night sky", render: () => {
      const n = S.embers.length;
      const warm = {};
      S.embers.forEach((e) => (warm[e.spot] = (warm[e.spot] || 0) + 1));
      const stars = S.embers.map((e, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2, rr = 78 + (i % 2) * 34;
        return { ...e, x: 160 + Math.cos(a) * rr, y: 124 + Math.sin(a) * rr * 0.78 };
      });
      const avg = gapAvg();
      const maxW = Math.max(...Object.values(warm));
      return `
      <section class="scr scr-sky">
        <header class="sky-head"><div><p class="eyebrow">Fall semester · week 9</p><h2>Your night sky</h2></div><span class="streak">${icon("spark", "xs")}3-week streak</span></header>
        <div class="sky-card">
          <img class="sky-mtn" src="${IMG}layer-2-rockies.webp" alt="" />
          <svg class="sky-svg" viewBox="0 0 320 250" aria-label="Constellation of people you’ve kindled with">
            ${Array.from({ length: 46 }, (_, i) => `<circle class="bgstar" cx="${(i * 73) % 320}" cy="${(i * 41) % 200}" r="${(i % 3) * 0.4 + 0.5}" style="animation-delay:${(i % 7) * 0.4}s"/>`).join("")}
            ${stars.map((s) => `<line class="sky-line${s.new ? " is-new" : ""}" x1="160" y1="124" x2="${s.x}" y2="${s.y}"/>`).join("")}
            ${stars.map((s, i) => i ? `<line class="sky-line faint" x1="${stars[i - 1].x}" y1="${stars[i - 1].y}" x2="${s.x}" y2="${s.y}"/>` : "").join("")}
            <circle class="sky-me-glow" cx="160" cy="124" r="20"/><circle class="sky-me" cx="160" cy="124" r="9"/><text class="sky-name me" x="160" y="146">you</text>
            ${stars.map((s) => `<g class="sky-star${s.new ? " is-new" : ""}"><circle cx="${s.x}" cy="${s.y}" r="${4 + s.r}"/><text class="sky-name" x="${s.x}" y="${s.y + 18 + s.r}">${s.name}</text></g>`).join("")}
          </svg>
        </div>
        <div class="kpis">
          <div><b>${n}</b><small>kindles</small><i class="spark-line">${[2, 3, 2, 4, 3, 5, n].map((v, i, a) => `<span style="height:${v * 12}%"></span>`).join("")}</i></div>
          <div><b>${Object.keys(warm).length}</b><small>warm spots</small></div>
          <div class="kpi-hot"><b>${avg >= 0 ? "+" : ""}${avg.toFixed(1)}</b><small>avg liking gap</small></div>
        </div>
        <div class="panel">
          <h3>Forecast vs. reality <span class="mono">last 5</span></h3>
          <ul class="dumbbells">
            ${S.embers.slice(-5).map((e) => `<li><span>${e.name}</span><span class="db"><i class="db-line" style="left:${(e.g - 1) * 25}%;width:${(e.r - e.g) * 25}%"></i><i class="db-g" style="left:${(e.g - 1) * 25}%"></i><i class="db-r" style="left:${(e.r - 1) * 25}%"></i></span></li>`).join("")}
          </ul>
          <p class="legend"><i class="db-g"></i> your guess <i class="db-r"></i> how it went</p>
        </div>
        <div class="panel">
          <h3>Warm spots <span class="mono">this term</span></h3>
          <ul class="warm-bars">${Object.entries(warm).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<li><span>${SPOTS[k].name}</span><i style="--w:${(v / maxW) * 100}%"></i><b>${v}</b></li>`).join("")}</ul>
        </div>
      </section>`; } },

    "light-where": { tab: false, label: "Light: where", render: () => `
      <section class="scr scr-flow">
        <header class="flow-head"><button class="back" data-action="go" data-to="map" aria-label="Back">${icon("back")}</button><span class="steps"><i class="on"></i><i></i><i></i></span><span class="mono step-of">1 of 3</span></header>
        <h2 class="big">Where are you?</h2>
        <p class="sub">Lights snap to public spots only. Never your exact location.</p>
        <ul class="spot-list" role="radiogroup">
          ${Object.entries(SPOTS).map(([k, s]) => { const here = LIGHTS.filter((l) => l.spot === k).length; const busy = { machall: 4, tfdl: 3, ict: 2, kin: 2, sci: 3, eng: 1, train: 2 }[k]; return `<li><button class="spot${S.my.spot === k ? " on" : ""}" role="radio" aria-checked="${S.my.spot === k}" data-action="spot" data-k="${k}">
            <span class="spot-ic">${icon(k === "train" ? "walk" : k === "machall" ? "food" : k === "tfdl" ? "study" : "pin")}</span>
            <span class="spot-txt"><b>${s.name}</b><small>${s.sub}${k === "machall" ? " · <em>you’re here</em>" : ""}</small></span>
            <span class="spot-meta"><span class="busy" title="How busy">${[1, 2, 3, 4].map((i) => `<i class="${i <= busy ? "on" : ""}"></i>`).join("")}</span><small>${here ? `${here} light${here > 1 ? "s" : ""} on` : "quiet"}</small></span>
          </button></li>`; }).join("")}
        </ul>
        <button class="btn-primary sticky" data-action="go" data-to="light-what">Next</button>
      </section>` },

    "light-what": { tab: false, label: "Light: vibe", render: () => `
      <section class="scr scr-flow">
        <header class="flow-head"><button class="back" data-action="go" data-to="light-where" aria-label="Back">${icon("back")}</button><span class="steps"><i class="on"></i><i class="on"></i><i></i></span></header>
        <h2 class="big">What’s the vibe?</h2>
        <div class="vibes">
          ${Object.entries(VIBES).map(([k, v]) => `<button class="vibe${S.my.vibe === k ? " on" : ""}" data-action="vibe" data-e="${k}">${icon(k)}${v.t}</button>`).join("")}
        </div>
        <label class="field"><span>Add a line <small id="noteCount">${S.my.note.length}/60</small></span>
          <input id="noteInput" maxlength="60" placeholder="Two free seats, come say hi" value="${S.my.note}" /></label>
        <label class="field"><span>Ask me about…</span>
          <input id="askInput" maxlength="40" placeholder="my plant collection" value="${S.my.ask}" /></label>
        <button class="btn-primary sticky" data-action="go" data-to="light-time">Next</button>
      </section>` },

    "light-time": { tab: false, label: "Light: time", render: () => { const v = VIBES[S.my.vibe]; return `
      <section class="scr scr-flow">
        <header class="flow-head"><button class="back" data-action="go" data-to="light-what" aria-label="Back">${icon("back")}</button><span class="steps"><i class="on"></i><i class="on"></i><i class="on"></i></span></header>
        <h2 class="big">For how long?</h2>
        <div class="seg" role="radiogroup">
          ${[15, 30, 45, 60, 90].map((m) => `<button class="${S.my.mins === m ? "on" : ""}" data-action="mins" data-m="${m}">${m}<small>min</small></button>`).join("")}
        </div>
        <div class="stepper"><span>${icon("seat", "inline")} Free seats</span><div><button data-action="seats" data-d="-1" aria-label="Fewer seats">−</button><b>${S.my.seats}</b><button data-action="seats" data-d="1" aria-label="More seats">+</button></div></div>
        <p class="eyebrow">How others will see you</p>
        <div class="lcard preview">${avatar({ name: "Alex", color: "#ffb547" }, 38)}<span class="lc-main"><b>Alex ${icon(S.my.vibe, "inline")}</b><span>${S.my.note || v.long}</span><small>${SPOTS[S.my.spot].name} · ${S.my.mins} min · ${S.my.seats} seat${S.my.seats > 1 ? "s" : ""}</small></span></div>
        <button class="btn-primary btn-lamp sticky" data-action="go" data-to="lit">Turn on my light</button>
      </section>`; } },

    lit: { tab: false, label: "Your light is on", render: () => `
      <section class="scr scr-lit">
        <div class="lit-lamp"><span class="lit-glow"></span>
          <svg class="ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" class="ring-bg"/><circle cx="100" cy="100" r="92" class="ring-fg" id="ringFg"/></svg>
          <img class="lit-wick" src="${IMG}wick-3.webp" alt="" width="501" height="760" />
        </div>
        <h2 class="big center">Your light is on</h2>
        <p class="sub center"><b id="litTimer">${S.my.mins}:00</b> left at ${spotLabel(S.my.spot)}</p>
        <p class="center seen" id="litSeen">Visible to students nearby…</p>
        <div class="incoming" id="incoming" hidden>
          ${avatar(LIGHTS[1], 40)}<div><b>Dev is coming over</b><small>2 min away · you both got a Spark</small></div>
        </div>
        <button class="btn-ghost" data-action="go" data-to="map">Turn off my light</button>
      </section>` },
  };

  /* ------------------------------------------------ after-render hooks */
  const AFTER = {
    welcome(el) {
      if (reduce) return;
      gsap.from($(".wl-art img", el), { scale: 1.12, duration: 2.4, ease: "expo.out" });
      gsap.from($(".wl-wick img", el), { y: 60, opacity: 0, duration: 1.2, ease: "expo.out" });
      gsap.from($(".wl-glow", el), { scale: 0, opacity: 0, duration: 1.6, delay: 0.4, ease: "expo.out" });
      gsap.to($(".wl-wick img", el), { rotate: 2, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 100%" });
      gsap.from($$(".wl-pill, .wl-title, .wl-tag, .wl-copy, .wl-dots, .btn-primary, .wl-fine", el), { y: 20, opacity: 0, stagger: 0.08, delay: 0.35, duration: 0.8, ease: "expo.out", clearProps: "transform" });
    },
    map(el) {
      if (reduce) return;
      gsap.from($$(".pin", el), { scale: 0, transformOrigin: "50% 50%", stagger: 0.07, duration: 0.6, ease: "back.out(2.5)", delay: 0.15 });
      gsap.from($$(".lcard", el), { x: 40, opacity: 0, stagger: 0.06, duration: 0.6, ease: "expo.out", delay: 0.2 });
      gsap.from($$(".map-chrome > *", el), { opacity: 0, y: -6, stagger: 0.05, duration: 0.5, delay: 0.3 });
    },
    detail(el) { if (!reduce) gsap.from($(".sheet", el), { yPercent: 100, duration: 0.6, ease: "expo.out" }); },
    forecast(el) { if (!reduce) gsap.from($$(".face", el), { y: 18, opacity: 0, stagger: 0.05, duration: 0.6, ease: "back.out(2)" }); },
    onway(el) {
      if (reduce) return;
      const p = $(".m-route", el), len = p.getTotalLength();
      gsap.fromTo(p, { strokeDashoffset: len, strokeDasharray: `${len} ${len}` }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", onComplete: () => { p.style.strokeDasharray = "4 7"; p.classList.add("flow"); } });
      gsap.from($(".spark", el), { rotateX: -60, y: 30, opacity: 0, duration: 0.9, delay: 0.3, ease: "expo.out" });
    },
    kindle(el) {
      if (reduce) return;
      const tl = gsap.timeline();
      tl.from($(".m-wick", el), { scale: 0.4, y: 40, opacity: 0, duration: 1, ease: "back.out(1.8)" })
        .fromTo($(".m-burst", el), { scale: 0, opacity: 1 }, { scale: 3, opacity: 0, duration: 1, ease: "expo.out" }, 0.5)
        .from($$(".big, .sub", el), { y: 16, opacity: 0, stagger: 0.1, duration: 0.6 }, 0.7)
        .from($(".later", el), { y: 30, opacity: 0, duration: 0.8, ease: "expo.out" }, 1.3);
      embers(el, 0.6);
    },
    result(el) {
      if (reduce) return;
      gsap.from($$(".vs-col", el), { y: 30, opacity: 0, stagger: 0.25, duration: 0.7, ease: "back.out(2)" });
      gsap.from($(".vs-delta", el), { scale: 0, duration: 0.7, delay: 0.5, ease: "back.out(3)" });
    },
    sky(el) {
      if (reduce) return;
      gsap.from($$(".sky-line", el), { attr: { x2: 160, y2: 130 }, duration: 1.1, stagger: 0.07, ease: "expo.out" });
      gsap.from($$(".sky-star", el), { opacity: 0, scale: 0, transformOrigin: "50% 50%", stagger: 0.07, duration: 0.6, ease: "back.out(2)" });
      gsap.from($$(".kpis > div, .panel", el), { y: 20, opacity: 0, stagger: 0.07, duration: 0.7, delay: 0.3, ease: "expo.out" });
      $$(".db-line", el).forEach((d) => gsap.from(d, { width: 0, duration: 1, delay: 0.6, ease: "expo.out" }));
    },
    "light-what"(el) {
      const ni = $("#noteInput", el), ai = $("#askInput", el), nc = $("#noteCount", el);
      ni.addEventListener("input", () => { S.my.note = ni.value; nc.textContent = `${ni.value.length}/60`; });
      ai.addEventListener("input", () => (S.my.ask = ai.value));
    },
    lit(el) {
      const fg = $("#ringFg", el), total = 2 * Math.PI * 92;
      fg.style.strokeDasharray = total;
      if (!reduce) {
        gsap.from($(".lit-glow", el), { scale: 0, opacity: 0, duration: 1.4, ease: "expo.out" });
        gsap.from($(".lit-wick", el), { scale: 0.7, y: 20, duration: 1, ease: "elastic.out(1, .5)" });
        gsap.fromTo(fg, { strokeDashoffset: total }, { strokeDashoffset: total * 0.04, duration: 1.4, ease: "expo.out" });
      } else fg.style.strokeDashoffset = total * 0.04;
      let secs = S.my.mins * 60;
      const tick = () => { secs--; const t = $("#litTimer"); if (!t) return; t.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`; later(tick, 1000); };
      later(tick, 1000);
      later(() => { const s = $("#litSeen"); if (s) s.textContent = "3 students nearby can see your light"; }, 1600);
      later(() => {
        const inc = $("#incoming"); if (!inc) return;
        inc.hidden = false;
        if (!reduce) gsap.from(inc, { y: 40, opacity: 0, duration: 0.7, ease: "back.out(2)" });
      }, 3600);
    },
  };

  function embers(el, delay = 0) {
    const box = $(".merge", el);
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("i");
      s.className = "ember";
      box.appendChild(s);
      gsap.fromTo(s, { x: 0, y: 0, opacity: 1, scale: 1 }, { x: (Math.random() - 0.5) * 220, y: -40 - Math.random() * 160, opacity: 0, scale: 0.3, duration: 1.4 + Math.random(), delay: delay + Math.random() * 0.2, ease: "power2.out" });
    }
  }

  /* ------------------------------------------------ router */
  function go(name, { instant = false } = {}) {
    if (!SCREENS[name]) return;
    const id = ++navId;
    clearTimers();
    const box = $("#screens");
    const def = SCREENS[name];
    const html = def.render();
    const swap = () => {
      if (id !== navId) return;
      box.innerHTML = html;
      box.scrollTop = 0;
      const el = box.firstElementChild;
      current = name;
      $("#app").dataset.screen = name;
      $("#tabbar").classList.toggle("is-hidden", !def.tab);
      $$("#tabbar .tab[data-to]").forEach((t) => t.classList.toggle("on", t.dataset.to === def.tab));
      $$("#jump button").forEach((b) => b.classList.toggle("on", b.dataset.to === name));
      if (!instant && !reduce) gsap.from(el, { opacity: 0, y: 18, duration: 0.45, ease: "expo.out" });
      AFTER[name] && AFTER[name](el);
    };
    if (instant || reduce || !box.firstElementChild) swap();
    else gsap.to(box.firstElementChild, { opacity: 0, y: -10, duration: 0.18, ease: "power2.in", onComplete: swap });
  }

  /* ------------------------------------------------ actions */
  const ACTIONS = {
    go: (d) => go(d.to),
    tab: (d) => go(d.to),
    restart: () => { S = initialState(); go("welcome"); },
    "light-start": () => go("light-where"),
    open: (d) => { S.host = LIGHTS.find((l) => l.id === d.id) || LIGHTS[0]; S.forecast = null; S.reality = null; go("detail"); },
    filter: (d) => { S.filter = d.f; go("map", { instant: true }); },
    forecast: (d) => { S.forecast = +d.v; $$(".face").forEach((f) => f.classList.toggle("on", +f.dataset.v === S.forecast)); later(() => go("onway"), 420); },
    reality: (d) => { S.reality = +d.v; $$(".face").forEach((f) => f.classList.toggle("on", +f.dataset.v === S.reality)); later(() => go("result"), 420); },
    flip: () => $(".spark").classList.toggle("flipped"),
    shuffle: () => {
      S.spark = (S.spark + 1) % SPARKS.length;
      const sp = $(".spark"), t = $("#sparkText");
      t.textContent = SPARKS[S.spark];
      if (!sp.classList.contains("flipped")) sp.classList.add("flipped");
      else if (!reduce) gsap.fromTo(t, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
    },
    keep: () => {
      const h = S.host;
      if (!S.embers.some((e) => e.name === h.name)) S.embers.push({ name: h.name, spot: h.spot, g: S.forecast ?? 2, r: S.reality ?? 4, new: true });
      go("sky");
      later(() => toast(`${avatar(h, 26)} <span><b>${h.name}</b> kept the ember too</span>${icon("spark", "inline amber")}`), 900);
    },
    spot: (d) => { S.my.spot = d.k; $$(".radio").forEach((r) => { const on = r.dataset.k === d.k; r.classList.toggle("on", on); r.setAttribute("aria-checked", on); }); },
    vibe: (d) => { S.my.vibe = d.e; $$(".vibe").forEach((v) => v.classList.toggle("on", v.dataset.e === d.e)); },
    mins: (d) => { S.my.mins = +d.m; go("light-time", { instant: true }); },
    seats: (d) => { S.my.seats = Math.max(1, Math.min(6, S.my.seats + +d.d)); go("light-time", { instant: true }); },
    toast: (d) => toast(`${icon("shield", "inline amber")}<span>${d.msg}</span>`),
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const fn = ACTIONS[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el.dataset); }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("g[data-action]")) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
  });

  /* ------------------------------------------------ jump list (desktop stage) */
  $("#jump").innerHTML = ["welcome", "map", "detail", "forecast", "onway", "kindle", "result", "sky", "light-where", "light-what", "light-time", "lit"]
    .map((k, i) => `<li><button data-action="go" data-to="${k}"><span>${String(i + 1).padStart(2, "0")}</span>${SCREENS[k].label}</button></li>`).join("");

  /* ------------------------------------------------ driven by the story site */
  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || d.type !== "porchlight:goto" || !SCREENS[d.screen] || d.screen === current) return;
    if (d.screen === "light-what" && !S.my.note) S.my.note = "Two free seats, come say hi";
    if (d.screen === "result") { S.forecast = S.forecast ?? 2; S.reality = S.reality ?? 4; }
    go(d.screen);
  });

  go(params.get("screen") && SCREENS[params.get("screen")] ? params.get("screen") : EMBED ? "map" : "welcome", { instant: true });
})();
