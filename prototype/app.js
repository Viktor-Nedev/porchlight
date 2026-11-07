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

  /* ------------------------------------------------ data */
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
    { id: "maya", name: "Maya", prog: "Nursing · 2nd year", spot: "machall", vibe: "🍜", vibeText: "Eating lunch", note: "Two free seats, come say hi", ask: "my failed sourdough era", left: 18, seats: 2, color: "#e8607a", walk: 2 },
    { id: "dev", name: "Dev", prog: "Software Eng · 3rd year", spot: "tfdl", vibe: "📚", vibeText: "Studying", note: "Grinding CPSC 331. Study buddies welcome", ask: "the best hidden study spot", left: 42, seats: 3, color: "#8b7cff", walk: 4 },
    { id: "amira", name: "Amira", prog: "Kinesiology · 1st year", spot: "kin", vibe: "🎧", vibeText: "Just want company", note: "3-hour lab done. Need human noise", ask: "my marathon training", left: 25, seats: 1, color: "#4fb3a9", walk: 6 },
    { id: "lucas", name: "Lucas", prog: "Geology · 4th year", spot: "train", vibe: "🚶", vibeText: "Walking somewhere", note: "Taking the 4:40 train, walk with me?", ask: "rocks. genuinely, any rock", left: 12, seats: 2, color: "#f2a65a", walk: 5 },
    { id: "sofia", name: "Sofía", prog: "Fine Arts · 2nd year", spot: "sci", vibe: "☕", vibeText: "Coffee break", note: "Sketching, happy to chat", ask: "what I’m drawing right now", left: 33, seats: 2, color: "#c58bff", walk: 4 },
  ];
  const VIBES = [
    { e: "🍜", t: "Eating" }, { e: "📚", t: "Studying" }, { e: "☕", t: "Coffee break" },
    { e: "🚶", t: "Walking somewhere" }, { e: "🎧", t: "Just want company" }, { e: "🎲", t: "Up for a game" },
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
    { v: 1, e: "😬", t: "Awkward" }, { v: 2, e: "😐", t: "Meh" }, { v: 3, e: "🙂", t: "Fine" },
    { v: 4, e: "😊", t: "Good" }, { v: 5, e: "🤩", t: "Great" },
  ];

  const initialState = () => ({
    host: LIGHTS[0],
    filter: "all",
    forecast: null,
    reality: null,
    spark: 0,
    my: { spot: "machall", vibe: "🍜", note: "", ask: "", mins: 30, seats: 2 },
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
  function toast(html, ms = 2600) {
    const t = $("#toast");
    t.innerHTML = html;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  /* ------------------------------------------------ campus map (SVG) */
  function mapSVG(opts = {}) {
    const lights = LIGHTS.filter((l) => S.filter === "all" || l.vibe === S.filter);
    const b = (x, y, w, h, label, r = 10) => `
      <g class="bld"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>
      <rect class="bld-roof" x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${Math.min(10, h / 4)}" rx="4"/>
      ${Array.from({ length: Math.floor((w - 12) / 12) }, (_, i) => `<rect class="bwin" x="${x + 8 + i * 12}" y="${y + h - 16}" width="6" height="6" rx="1" style="animation-delay:${(i * 0.7) % 3}s"/>`).join("")}
      <text x="${x + w / 2}" y="${y + h + 13}" class="bld-label">${label}</text></g>`;
    const tree = (x, y) => `<g class="tree"><path d="M${x},${y - 14} l7,12 h-14z"/><path d="M${x},${y - 8} l9,13 h-18z"/></g>`;
    const trees = [[24, 60], [40, 74], [330, 60], [340, 210], [20, 230], [200, 400], [214, 412], [330, 510], [150, 520], [30, 420]].map(([x, y]) => tree(x, y)).join("");
    const pins = lights.map((l) => {
      const s = SPOTS[l.spot];
      const sel = opts.selected === l.id ? " is-sel" : "";
      return `<g class="pin${sel}" data-action="open" data-id="${l.id}" transform="translate(${s.x},${s.y})" tabindex="0" role="button" aria-label="${l.name}, ${l.vibeText} at ${spotLabel(l.spot)}">
        <circle class="pin-glow" r="34"/><circle class="pin-ring" r="16"/>
        <circle class="pin-dot" r="15" style="fill:${l.color}"/>
        <text class="pin-emoji" y="5">${l.vibe}</text>
      </g>`;
    }).join("");
    const mine = opts.myLight ? (() => { const s = SPOTS[S.my.spot]; return `<g class="pin pin-mine" transform="translate(${s.x},${s.y})"><circle class="pin-glow" r="44"/><circle class="pin-ring" r="20"/><circle class="pin-dot" r="17" style="fill:#ffb547"/><text class="pin-emoji" y="5">${S.my.vibe}</text></g>`; })() : "";
    const you = SPOTS.machall;
    return `<svg class="map" viewBox="0 0 360 540" preserveAspectRatio="xMidYMid slice" aria-label="Illustrated campus map at night">
      <defs><radialGradient id="pg"><stop offset="0" stop-color="#ffc35c" stop-opacity=".55"/><stop offset="1" stop-color="#ffc35c" stop-opacity="0"/></radialGradient></defs>
      <rect width="360" height="540" class="map-ground"/>
      <path class="map-snow" d="M0,0 h360 v40 C260,60 120,30 0,50Z"/>
      <path class="path" d="M176,236 L84,128 M176,236 L282,120 M176,236 L74,352 M176,236 L276,318 L286,430 M74,352 L92,470 M176,236 L176,540"/>
      <path class="rail" d="M-10,500 L370,440"/>
      <path class="rail-ties" d="M-10,500 L370,440"/>
      ${b(46, 92, 76, 58, "TFDL")}${b(240, 92, 86, 44, "ICT")}${b(130, 204, 92, 50, "MACHALL", 14)}
      ${b(30, 320, 88, 48, "KINESIOLOGY")}${b(232, 290, 90, 42, "SCIENCE TH.")}${b(244, 402, 84, 46, "ENGINEERING")}
      <rect x="54" y="478" width="80" height="12" rx="4" class="platform"/><text x="94" y="505" class="bld-label">UNIVERSITY STN</text>
      ${trees}
      <g class="you" transform="translate(${you.x - 34},${you.y + 34})"><circle r="14" class="you-pulse"/><circle r="6" class="you-dot"/></g>
      ${pins}${mine}
    </svg>`;
  }

  /* ------------------------------------------------ screens */
  const SCREENS = {
    welcome: { tab: false, label: "Welcome", render: () => `
      <section class="scr scr-welcome">
        <div class="wl-sky"><span class="wl-moon"></span></div>
        <div class="wl-lamp"><svg viewBox="0 0 32 32"><use href="#i-lamp"/></svg><img class="wl-mascot" src="../assets/img/mascot-wick.webp" alt="" onerror="this.remove()" onload="this.parentNode.classList.add('has-art')" /><span class="wl-glow"></span></div>
        <h1 class="wl-title">porchl<span>ı</span>ght</h1>
        <p class="wl-tag">Leave a light on.</p>
        <p class="wl-copy">See who on campus is open to company right now, and let people know when you are too.</p>
        <button class="btn-primary" data-action="go" data-to="map">Continue with your campus email</button>
        <p class="wl-fine">Students and staff only · first name only · lights fade on their own</p>
      </section>` },

    map: { tab: "map", label: "Lights map", render: () => {
      const lights = LIGHTS.filter((l) => S.filter === "all" || l.vibe === S.filter);
      return `
      <section class="scr scr-map">
        <header class="map-head">
          <div><p class="hi">Good evening, Alex</p><h2><b>${lights.length}</b> lights on near you</h2></div>
          <button class="icon-btn" data-action="toast" data-msg="Safety: block, report & ‘I have to run’ are always one tap away." aria-label="Safety">🛡️</button>
        </header>
        <div class="chips" role="tablist" aria-label="Filter by vibe">
          ${["all", "🍜", "📚", "☕", "🎧", "🚶"].map((f) => `<button class="chip${S.filter === f ? " on" : ""}" data-action="filter" data-f="${f}">${f === "all" ? "All" : f}</button>`).join("")}
        </div>
        <div class="map-wrap">${mapSVG()}</div>
        <div class="cards" aria-label="Lights near you">
          ${lights.map((l) => `
            <button class="lcard" data-action="open" data-id="${l.id}">
              ${avatar(l, 38)}
              <span class="lc-main"><b>${l.name} <i>${l.vibe}</i></b><span>${l.note}</span><small>${SPOTS[l.spot].name} · ${l.walk} min walk · ${l.left} min left</small></span>
            </button>`).join("")}
        </div>
      </section>`; } },

    detail: { tab: false, label: "A light", render: () => { const h = S.host; return `
      <section class="scr scr-detail">
        <div class="map-wrap dim">${mapSVG({ selected: h.id })}</div>
        <div class="sheet">
          <span class="grab"></span>
          <div class="dt-head">${avatar(h, 56)}<div><h2>${h.name}</h2><p>${h.prog}</p></div><span class="dt-vibe">${h.vibe}</span></div>
          <p class="dt-note">“${h.note}”</p>
          <div class="dt-ask"><span>Ask me about</span><b>${h.ask}</b></div>
          <ul class="dt-meta">
            <li><i>📍</i>${spotLabel(h.spot)} · ${h.walk} min walk</li>
            <li><i>⏳</i>${h.left} min left · ${h.seats} seat${h.seats > 1 ? "s" : ""} free</li>
          </ul>
          <button class="btn-primary" data-action="go" data-to="forecast">I’m coming over</button>
          <button class="btn-text" data-action="go" data-to="map">Not now</button>
        </div>
      </section>`; } },

    forecast: { tab: false, label: "Private guess", render: () => `
      <section class="scr scr-forecast">
        <button class="back" data-action="go" data-to="detail" aria-label="Back">←</button>
        <p class="eyebrow">Before you go</p>
        <h2 class="big">How do you think this will go?</h2>
        <p class="sub">Just a gut feeling. <b>Only you will ever see this.</b> Later we’ll compare it with how it actually went.</p>
        <div class="faces" role="radiogroup" aria-label="Your forecast">
          ${FACES.map((f) => `<button class="face${S.forecast === f.v ? " on" : ""}" role="radio" aria-checked="${S.forecast === f.v}" data-action="forecast" data-v="${f.v}"><span>${f.e}</span><small>${f.t}</small></button>`).join("")}
        </div>
        <p class="hand note">Most people guess lower than it turns out. Let’s see.</p>
      </section>` },

    onway: { tab: false, label: "On the way + Spark", render: () => { const h = S.host; return `
      <section class="scr scr-onway">
        <header class="ow-head">${avatar(h, 40)}<div><b>${h.name} knows you’re coming</b><small>${spotLabel(h.spot)}</small></div></header>
        <div class="route">
          <svg viewBox="0 0 300 120" aria-hidden="true"><path class="route-path" d="M20,96 C80,96 90,30 150,40 C210,50 220,20 280,24"/><circle class="route-you" cx="20" cy="96" r="7"/><circle class="route-host" cx="280" cy="24" r="9" style="fill:${h.color}"/></svg>
          <p class="eta"><b>${h.walk} min</b> · ${h.walk * 80} m</p>
        </div>
        <button class="spark" data-action="flip" aria-label="Reveal your shared Spark">
          <span class="spark-inner">
            <span class="spark-face spark-front"><i>✨</i><b>Your shared Spark</b><small>tap to reveal</small></span>
            <span class="spark-face spark-back"><small>You both got</small><b id="sparkText">${SPARKS[S.spark]}</b></span>
          </span>
        </button>
        <button class="btn-text shuffle" data-action="shuffle">↻ Another Spark</button>
        <button class="btn-primary" data-action="go" data-to="kindle">I’m here 👋</button>
        <button class="btn-text" data-action="toast" data-msg="No worries. We told ${h.name} something came up. 💛">I have to run</button>
      </section>`; } },

    kindle: { tab: false, label: "Kindle + reality check", render: () => `
      <section class="scr scr-kindle">
        <div class="merge" aria-hidden="true"><span class="m-a"></span><span class="m-b"></span><span class="m-burst"></span></div>
        <h2 class="big center">Kindled ✨</h2>
        <p class="sub center">You and ${S.host.name} found each other. Enjoy the chat. We’ll check back when the light fades.</p>
        <div class="later">
          <p class="eyebrow center">Light faded · 18 min later</p>
          <h3 class="center">How did it actually go?</h3>
          <div class="faces" role="radiogroup" aria-label="How it went">
            ${FACES.map((f) => `<button class="face${S.reality === f.v ? " on" : ""}" role="radio" aria-checked="${S.reality === f.v}" data-action="reality" data-v="${f.v}"><span>${f.e}</span><small>${f.t}</small></button>`).join("")}
          </div>
        </div>
      </section>` },

    result: { tab: false, label: "Forecast vs reality", render: () => {
      const g = S.forecast ?? 2, r = S.reality ?? 4, d = r - g;
      const msg = d > 0 ? "It went better than you feared. That’s the liking gap, and you just closed it a little." : d === 0 ? "Spot on. You’re learning to trust your own read." : "Not every chat clicks, and that’s okay. You still went first, and that counts.";
      return `
      <section class="scr scr-result">
        <p class="eyebrow center">Forecast vs. reality</p>
        <div class="vs">
          <div class="vs-col"><small>You guessed</small><span class="vs-face">${face(g).e}</span><b>${face(g).t}</b></div>
          <div class="vs-arrow"><span class="vs-delta">${d > 0 ? "+" : ""}${d}</span><svg viewBox="0 0 60 20"><path d="M2 10h52m-8-7 8 7-8 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <div class="vs-col"><small>It was</small><span class="vs-face">${face(r).e}</span><b>${face(r).t}</b></div>
        </div>
        <p class="sub center">${msg}</p>
        <div class="ember-ask">
          <h3>Keep the ember?</h3>
          <p>If ${S.host.name} keeps it too, you’ll appear in each other’s night sky. If not, nobody is notified.</p>
          <button class="btn-primary" data-action="keep">Keep the ember</button>
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
        <header class="flow-head"><button class="back" data-action="go" data-to="map" aria-label="Back">←</button><span class="steps"><i class="on"></i><i></i><i></i></span></header>
        <h2 class="big">Where are you?</h2>
        <p class="sub">Lights snap to public spots only. Never your exact location.</p>
        <ul class="radio-list" role="radiogroup">
          ${Object.entries(SPOTS).map(([k, s]) => `<li><button class="radio${S.my.spot === k ? " on" : ""}" role="radio" aria-checked="${S.my.spot === k}" data-action="spot" data-k="${k}"><b>${s.name}</b><small>${s.sub}${k === "machall" ? " · <em>you’re here</em>" : ""}</small></button></li>`).join("")}
        </ul>
        <button class="btn-primary sticky" data-action="go" data-to="light-what">Next</button>
      </section>` },

    "light-what": { tab: false, label: "Light: vibe", render: () => `
      <section class="scr scr-flow">
        <header class="flow-head"><button class="back" data-action="go" data-to="light-where" aria-label="Back">←</button><span class="steps"><i class="on"></i><i class="on"></i><i></i></span></header>
        <h2 class="big">What’s the vibe?</h2>
        <div class="vibes">
          ${VIBES.map((v) => `<button class="vibe${S.my.vibe === v.e ? " on" : ""}" data-action="vibe" data-e="${v.e}"><span>${v.e}</span>${v.t}</button>`).join("")}
        </div>
        <label class="field"><span>Add a line <small id="noteCount">${S.my.note.length}/60</small></span>
          <input id="noteInput" maxlength="60" placeholder="Two free seats, come say hi" value="${S.my.note}" /></label>
        <label class="field"><span>Ask me about…</span>
          <input id="askInput" maxlength="40" placeholder="my plant collection" value="${S.my.ask}" /></label>
        <button class="btn-primary sticky" data-action="go" data-to="light-time">Next</button>
      </section>` },

    "light-time": { tab: false, label: "Light: time", render: () => { const v = VIBES.find((x) => x.e === S.my.vibe) || VIBES[0]; return `
      <section class="scr scr-flow">
        <header class="flow-head"><button class="back" data-action="go" data-to="light-what" aria-label="Back">←</button><span class="steps"><i class="on"></i><i class="on"></i><i class="on"></i></span></header>
        <h2 class="big">For how long?</h2>
        <div class="seg" role="radiogroup">
          ${[15, 30, 45, 60, 90].map((m) => `<button class="${S.my.mins === m ? "on" : ""}" data-action="mins" data-m="${m}">${m}<small>min</small></button>`).join("")}
        </div>
        <div class="stepper"><span>Free seats</span><div><button data-action="seats" data-d="-1" aria-label="Fewer seats">−</button><b>${S.my.seats}</b><button data-action="seats" data-d="1" aria-label="More seats">+</button></div></div>
        <p class="eyebrow">How others will see you</p>
        <div class="lcard preview">${avatar({ name: "Alex", color: "#ffb547" }, 38)}<span class="lc-main"><b>Alex <i>${v.e}</i></b><span>${S.my.note || v.t}</span><small>${SPOTS[S.my.spot].name} · ${S.my.mins} min · ${S.my.seats} seat${S.my.seats > 1 ? "s" : ""}</small></span></div>
        <button class="btn-primary btn-lamp sticky" data-action="go" data-to="lit">Turn on my light</button>
      </section>`; } },

    lit: { tab: false, label: "Your light is on", render: () => `
      <section class="scr scr-lit">
        <div class="lit-lamp"><span class="lit-glow"></span>
          <svg class="ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" class="ring-bg"/><circle cx="100" cy="100" r="92" class="ring-fg" id="ringFg"/></svg>
          <svg class="lit-icon" viewBox="0 0 32 32"><use href="#i-lamp"/></svg>
        </div>
        <h2 class="big center">Your light is on</h2>
        <p class="sub center"><b id="litTimer">${S.my.mins}:00</b> left at ${spotLabel(S.my.spot)}</p>
        <p class="center seen" id="litSeen">Visible to students nearby…</p>
        <div class="incoming" id="incoming" hidden>
          ${avatar(LIGHTS[1], 40)}<div><b>Dev is coming over</b><small>2 min away · you both got a Spark ✨</small></div>
        </div>
        <button class="btn-ghost" data-action="go" data-to="map">Turn off my light</button>
      </section>` },
  };

  /* ------------------------------------------------ after-render hooks */
  const AFTER = {
    welcome(el) {
      if (reduce) return;
      gsap.from($(".wl-lamp", el), { y: -120, duration: 1.2, ease: "bounce.out" });
      gsap.from($(".wl-glow", el), { scale: 0, opacity: 0, duration: 1.4, delay: 0.6, ease: "expo.out" });
      gsap.from($$(".wl-title, .wl-tag, .wl-copy, .btn-primary, .wl-fine", el), { y: 20, opacity: 0, stagger: 0.08, delay: 0.4, duration: 0.8, ease: "expo.out" });
    },
    map(el) {
      if (reduce) return;
      gsap.from($$(".pin", el), { scale: 0, transformOrigin: "50% 50%", stagger: 0.07, duration: 0.6, ease: "back.out(2.5)", delay: 0.15 });
      gsap.from($$(".lcard", el), { x: 40, opacity: 0, stagger: 0.06, duration: 0.6, ease: "expo.out", delay: 0.2 });
    },
    detail(el) { if (!reduce) gsap.from($(".sheet", el), { yPercent: 100, duration: 0.6, ease: "expo.out" }); },
    onway(el) {
      if (reduce) return;
      const p = $(".route-path", el), len = p.getTotalLength();
      gsap.fromTo(p, { strokeDashoffset: len, strokeDasharray: `${len} ${len}` }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" });
      gsap.from($(".spark", el), { rotateX: -60, y: 30, opacity: 0, duration: 0.9, delay: 0.3, ease: "expo.out" });
    },
    kindle(el) {
      if (reduce) return;
      const tl = gsap.timeline();
      tl.from($(".m-a", el), { x: -110, duration: 0.9, ease: "power3.out" })
        .from($(".m-b", el), { x: 110, duration: 0.9, ease: "power3.out" }, 0)
        .fromTo($(".m-burst", el), { scale: 0, opacity: 1 }, { scale: 3, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.75)
        .from($$(".big, .sub", el), { y: 16, opacity: 0, stagger: 0.1, duration: 0.6 }, 0.8)
        .from($(".later", el), { y: 30, opacity: 0, duration: 0.8, ease: "expo.out" }, 1.4);
      embers(el, 0.8);
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
        gsap.from($(".lit-icon", el), { scale: 0.6, rotate: -20, duration: 1, ease: "elastic.out(1, .4)" });
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
    forecast: (d) => { S.forecast = +d.v; $$(".face").forEach((f) => f.classList.toggle("on", +f.dataset.v === S.forecast)); later(() => go("onway"), 380); },
    reality: (d) => { S.reality = +d.v; $$(".face").forEach((f) => f.classList.toggle("on", +f.dataset.v === S.reality)); later(() => go("result"), 380); },
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
      later(() => toast(`${avatar(h, 26)} <span><b>${h.name}</b> kept the ember too ✨</span>`), 900);
    },
    spot: (d) => { S.my.spot = d.k; $$(".radio").forEach((r) => { const on = r.dataset.k === d.k; r.classList.toggle("on", on); r.setAttribute("aria-checked", on); }); },
    vibe: (d) => { S.my.vibe = d.e; $$(".vibe").forEach((v) => v.classList.toggle("on", v.dataset.e === d.e)); },
    mins: (d) => { S.my.mins = +d.m; go("light-time", { instant: true }); },
    seats: (d) => { S.my.seats = Math.max(1, Math.min(6, S.my.seats + +d.d)); go("light-time", { instant: true }); },
    toast: (d) => toast(d.msg),
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
