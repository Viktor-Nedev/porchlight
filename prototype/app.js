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
  const avatar = (p, size = 44) => `<span class="av" style="--c:${p.color};--s:${size}px">${p.name[0]}</span>`;
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

  /* ------------------------------------------------ campus map (SVG) */
  function mapSVG(opts = {}) {
    const lights = LIGHTS.filter((l) => S.filter === "all" || l.vibe === S.filter);
    const b = (x, y, w, h, label, r = 10) => `
      <g class="bld"><rect x="${x + 4}" y="${y + 6}" width="${w}" height="${h}" rx="${r}" class="bld-shadow"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>
      <rect class="bld-roof" x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${Math.min(10, h / 4)}" rx="4"/>
      ${Array.from({ length: Math.floor((w - 12) / 12) }, (_, i) => `<rect class="bwin" x="${x + 8 + i * 12}" y="${y + h - 16}" width="6" height="6" rx="1" style="animation-delay:${(i * 0.7) % 3}s"/>`).join("")}
      <text x="${x + w / 2}" y="${y + h + 13}" class="bld-label">${label}</text></g>`;
    const tree = (x, y) => `<g class="tree"><path d="M${x},${y - 14} l7,12 h-14z"/><path d="M${x},${y - 8} l9,13 h-18z"/><path d="M${x - 5},${y - 9} q5,-2 10,0" class="tree-snow"/></g>`;
    const trees = [[24, 60], [40, 74], [330, 60], [340, 210], [20, 230], [200, 400], [214, 412], [330, 510], [150, 520], [30, 420]].map(([x, y]) => tree(x, y)).join("");
    const pinIcon = (k) => `<g class="pin-ic" transform="translate(-9,-9) scale(.75)">${P[k]}</g>`;
    const pins = lights.map((l) => {
      const s = SPOTS[l.spot];
      const sel = opts.selected === l.id ? " is-sel" : "";
      return `<g class="pin${sel}" data-action="open" data-id="${l.id}" transform="translate(${s.x},${s.y})" tabindex="0" role="button" aria-label="${l.name}, ${VIBES[l.vibe].long} at ${spotLabel(l.spot)}">
        <circle class="pin-glow" r="34"/><circle class="pin-ring" r="16"/>
        <circle class="pin-dot" r="15" style="fill:${l.color}"/>
        ${pinIcon(l.vibe)}
      </g>`;
    }).join("");
    const you = SPOTS.machall;
    return `<svg class="map" viewBox="0 0 360 540" preserveAspectRatio="xMidYMid slice" aria-label="Illustrated campus map at night">
      <defs>
        <radialGradient id="pg"><stop offset="0" stop-color="#ffc35c" stop-opacity=".55"/><stop offset="1" stop-color="#ffc35c" stop-opacity="0"/></radialGradient>
        <pattern id="snowdots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".7" fill="#3a3478"/><circle cx="10" cy="11" r=".5" fill="#3a3478"/></pattern>
      </defs>
      <rect width="360" height="540" class="map-ground"/>
      <rect width="360" height="540" fill="url(#snowdots)"/>
      <path class="map-snow" d="M0,0 h360 v40 C260,60 120,30 0,50Z"/>
      <path class="path-edge" d="M176,236 L84,128 M176,236 L282,120 M176,236 L74,352 M176,236 L276,318 L286,430 M74,352 L92,470 M176,236 L176,540"/>
      <path class="path" d="M176,236 L84,128 M176,236 L282,120 M176,236 L74,352 M176,236 L276,318 L286,430 M74,352 L92,470 M176,236 L176,540"/>
      <path class="rail" d="M-10,500 L370,440"/>
      <path class="rail-ties" d="M-10,500 L370,440"/>
      ${b(46, 92, 76, 58, "TFDL")}${b(240, 92, 86, 44, "ICT")}${b(130, 204, 92, 50, "MACHALL", 14)}
      ${b(30, 320, 88, 48, "KINESIOLOGY")}${b(232, 290, 90, 42, "SCIENCE TH.")}${b(244, 402, 84, 46, "ENGINEERING")}
      <rect x="54" y="478" width="80" height="12" rx="4" class="platform"/><text x="94" y="505" class="bld-label">UNIVERSITY STN</text>
      ${trees}
      <g class="you" transform="translate(${you.x - 34},${you.y + 34})"><circle r="14" class="you-pulse"/><circle r="6" class="you-dot"/></g>
      ${pins}
    </svg>`;
  }

  /* ------------------------------------------------ screens */
  const SCREENS = {
    welcome: { tab: false, label: "Welcome", render: () => `
      <section class="scr scr-welcome">
        <div class="wl-sky"><span class="wl-moon"></span><span class="wl-stars"></span></div>
        <div class="wl-wick"><span class="wl-glow"></span><img src="${IMG}mascot-wick.webp" alt="Wick, the Porchlight lantern, waving hello" width="501" height="768" /></div>
        <h1 class="wl-title">porchl<span>ı</span>ght</h1>
        <p class="wl-tag">Leave a light on.</p>
        <p class="wl-copy">See who on campus is open to company right now, and let people know when you are too.</p>
        <button class="btn-primary" data-action="go" data-to="map">Continue with your campus email</button>
        <p class="wl-fine">${icon("shield", "xs")} Students &amp; staff only · first name only · lights fade on their own</p>
      </section>` },

    map: { tab: "map", label: "Lights map", render: () => {
      const lights = LIGHTS.filter((l) => S.filter === "all" || l.vibe === S.filter);
      return `
      <section class="scr scr-map">
        <header class="map-head">
          <div><p class="hi">Good evening, Alex</p><h2><b>${lights.length}</b> light${lights.length === 1 ? "" : "s"} on near you</h2></div>
          <button class="icon-btn" data-action="toast" data-msg="Block, report and “I have to run” are always one tap away." aria-label="Safety">${icon("shield")}</button>
        </header>
        <div class="chips" role="tablist" aria-label="Filter by vibe">
          ${["all", "food", "study", "coffee", "company", "walk"].map((f) => `<button class="chip${S.filter === f ? " on" : ""}" data-action="filter" data-f="${f}" aria-label="${f === "all" ? "All" : VIBES[f].t}">${f === "all" ? "All" : icon(f)}</button>`).join("")}
        </div>
        <div class="map-wrap">${mapSVG()}</div>
        <div class="cards" aria-label="Lights near you">
          ${lights.length ? lights.map((l) => `
            <button class="lcard" data-action="open" data-id="${l.id}">
              ${avatar(l, 38)}
              <span class="lc-main"><b>${l.name} ${icon(l.vibe, "inline")}</b><span>${l.note}</span><small>${SPOTS[l.spot].name} · ${l.walk} min walk · ${l.left} min left</small></span>
            </button>`).join("") : `<p class="empty">No lights like that right now. Why not light your own?</p>`}
        </div>
      </section>`; } },

    detail: { tab: false, label: "A light", render: () => { const h = S.host; return `
      <section class="scr scr-detail">
        <div class="map-wrap dim">${mapSVG({ selected: h.id })}</div>
        <div class="sheet">
          <span class="grab"></span>
          <div class="dt-head">${avatar(h, 56)}<div><h2>${h.name}</h2><p>${h.prog}</p></div><span class="dt-vibe" style="--c:${h.color}">${icon(h.vibe)}<small>${VIBES[h.vibe].t}</small></span></div>
          <p class="dt-note">“${h.note}”</p>
          <div class="dt-ask"><span>Ask me about</span><b>${h.ask}</b></div>
          <ul class="dt-meta">
            <li>${icon("pin")}${spotLabel(h.spot)} · ${h.walk} min walk</li>
            <li>${icon("timer")}${h.left} min left</li>
            <li>${icon("seat")}${h.seats} seat${h.seats > 1 ? "s" : ""} free</li>
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
        <header class="ow-head">${avatar(h, 40)}<div><b>${h.name} knows you’re coming</b><small>${spotLabel(h.spot)}</small></div></header>
        <div class="route">
          <svg viewBox="0 0 300 120" aria-hidden="true"><path class="route-bg" d="M20,96 C80,96 90,30 150,40 C210,50 220,20 280,24"/><path class="route-path" d="M20,96 C80,96 90,30 150,40 C210,50 220,20 280,24"/><circle class="route-you" cx="20" cy="96" r="7"/><circle class="route-host-glow" cx="280" cy="24" r="18"/><circle class="route-host" cx="280" cy="24" r="9" style="fill:${h.color}"/></svg>
          <p class="eta"><b>${h.walk} min</b> · ${h.walk * 80} m · indoors via the +15 walkway</p>
        </div>
        <button class="spark" data-action="flip" aria-label="Reveal your shared Spark">
          <span class="spark-inner">
            <span class="spark-face spark-front">${icon("spark", "lg")}<b>Your shared Spark</b><small>tap to reveal</small></span>
            <span class="spark-face spark-back"><small>You both got</small><b id="sparkText">${SPARKS[S.spark]}</b></span>
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
        return { ...e, x: 160 + Math.cos(a) * rr, y: 130 + Math.sin(a) * rr * 0.8 };
      });
      const avg = gapAvg();
      return `
      <section class="scr scr-sky">
        <header class="sky-head"><p class="eyebrow">Fall semester</p><h2>Your night sky</h2></header>
        <svg class="sky-svg" viewBox="0 0 320 260" aria-label="Constellation of people you’ve kindled with">
          ${Array.from({ length: 40 }, (_, i) => `<circle class="bgstar" cx="${(i * 73) % 320}" cy="${(i * 41) % 260}" r="${(i % 3) * 0.4 + 0.5}" style="animation-delay:${(i % 7) * 0.4}s"/>`).join("")}
          ${stars.map((s) => `<line class="sky-line${s.new ? " is-new" : ""}" x1="160" y1="130" x2="${s.x}" y2="${s.y}"/>`).join("")}
          ${stars.map((s, i) => i ? `<line class="sky-line faint" x1="${stars[i - 1].x}" y1="${stars[i - 1].y}" x2="${s.x}" y2="${s.y}"/>` : "").join("")}
          <circle class="sky-me" cx="160" cy="130" r="9"/><text class="sky-name me" x="160" y="152">you</text>
          ${stars.map((s) => `<g class="sky-star${s.new ? " is-new" : ""}"><circle cx="${s.x}" cy="${s.y}" r="${4 + s.r}"/><text class="sky-name" x="${s.x}" y="${s.y + 18 + s.r}">${s.name}</text></g>`).join("")}
        </svg>
        <div class="kpis">
          <div><b>${n}</b><small>kindles</small></div>
          <div><b>${Object.keys(warm).length}</b><small>warm spots</small></div>
          <div><b>${avg >= 0 ? "+" : ""}${avg.toFixed(1)}</b><small>avg liking gap</small></div>
        </div>
        <div class="panel">
          <h3>Forecast vs. reality</h3>
          <ul class="dumbbells">
            ${S.embers.slice(-5).map((e) => `<li><span>${e.name}</span><span class="db"><i class="db-line" style="left:${(e.g - 1) * 25}%;width:${(e.r - e.g) * 25}%"></i><i class="db-g" style="left:${(e.g - 1) * 25}%"></i><i class="db-r" style="left:${(e.r - 1) * 25}%"></i></span></li>`).join("")}
          </ul>
          <p class="legend"><i class="db-g"></i> your guess <i class="db-r"></i> how it went</p>
        </div>
        <div class="panel">
          <h3>Warm spots</h3>
          <div class="warm">${Object.entries(warm).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="warm-chip" style="--w:${v}">${SPOTS[k].name} <b>×${v}</b></span>`).join("")}</div>
        </div>
      </section>`; } },

    "light-where": { tab: false, label: "Light: where", render: () => `
      <section class="scr scr-flow">
        <header class="flow-head"><button class="back" data-action="go" data-to="map" aria-label="Back">${icon("back")}</button><span class="steps"><i class="on"></i><i></i><i></i></span></header>
        <h2 class="big">Where are you?</h2>
        <p class="sub">Lights snap to public spots only. Never your exact location.</p>
        <ul class="radio-list" role="radiogroup">
          ${Object.entries(SPOTS).map(([k, s]) => `<li><button class="radio${S.my.spot === k ? " on" : ""}" role="radio" aria-checked="${S.my.spot === k}" data-action="spot" data-k="${k}"><b>${s.name}</b><small>${s.sub}${k === "machall" ? " · <em>you’re here</em>" : ""}</small></button></li>`).join("")}
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
      gsap.from($(".wl-wick img", el), { y: 60, opacity: 0, duration: 1.2, ease: "expo.out" });
      gsap.from($(".wl-glow", el), { scale: 0, opacity: 0, duration: 1.6, delay: 0.4, ease: "expo.out" });
      gsap.to($(".wl-wick img", el), { rotate: 2, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 100%" });
      gsap.from($$(".wl-title, .wl-tag, .wl-copy, .btn-primary, .wl-fine", el), { y: 20, opacity: 0, stagger: 0.08, delay: 0.35, duration: 0.8, ease: "expo.out" });
    },
    map(el) {
      if (reduce) return;
      gsap.from($$(".pin", el), { scale: 0, transformOrigin: "50% 50%", stagger: 0.07, duration: 0.6, ease: "back.out(2.5)", delay: 0.15 });
      gsap.from($$(".lcard", el), { x: 40, opacity: 0, stagger: 0.06, duration: 0.6, ease: "expo.out", delay: 0.2 });
    },
    detail(el) { if (!reduce) gsap.from($(".sheet", el), { yPercent: 100, duration: 0.6, ease: "expo.out" }); },
    forecast(el) { if (!reduce) gsap.from($$(".face", el), { y: 18, opacity: 0, stagger: 0.05, duration: 0.6, ease: "back.out(2)" }); },
    onway(el) {
      if (reduce) return;
      const p = $(".route-path", el), len = p.getTotalLength();
      gsap.fromTo(p, { strokeDashoffset: len, strokeDasharray: `${len} ${len}` }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" });
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
