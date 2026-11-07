/* ------------------------------------------------------------------
   Porchlight — procedural illustration
   Builds the layered Calgary-at-dusk hero and the cafeteria table scene
   as inline SVG. If a painted layer exists in assets/img (see
   docs/IMAGE_PROMPTS.md) it is shown instead of the vector fallback.
   ------------------------------------------------------------------ */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const W = 1600, H = 900;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Midpoint displacement between key points → jagged ridge
  function ridge(keys, rand, depth, rough) {
    let pts = keys.slice();
    let amp = rough;
    for (let d = 0; d < depth; d++) {
      const next = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
        next.push(pts[i]);
        next.push([(x1 + x2) / 2 + (rand() - 0.5) * amp * 0.4, (y1 + y2) / 2 + (rand() - 0.5) * amp]);
      }
      next.push(pts[pts.length - 1]);
      pts = next;
      amp *= 0.55;
    }
    return pts;
  }
  const P = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");

  function svg(viewBox, inner, cls) {
    return `<svg class="${cls || ""}" viewBox="${viewBox}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg>`;
  }

  /* ---------- Layer 1: chinook arch + clouds ---------- */
  function chinook() {
    const r = rng(7);
    let streaks = "";
    for (let i = 0; i < 9; i++) {
      const y = 70 + i * 26 + r() * 10;
      const dip = 150 - i * 12;
      streaks += `<path d="M-50,${y + dip} Q800,${y - 120 + r() * 30} 1650,${y + dip}" stroke="var(--c-cloud-hi)" stroke-width="${2 + r() * 5}" fill="none" opacity="${0.18 + r() * 0.25}" stroke-linecap="round"/>`;
    }
    let puffs = "";
    for (let i = 0; i < 7; i++) {
      const x = r() * W, y = 330 + r() * 120, w = 120 + r() * 220;
      puffs += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${10 + r() * 14}" fill="var(--c-cloud)" opacity="${0.25 + r() * 0.3}"/>`;
    }
    const deck = `<path d="M0,0 H${W} V330 Q800,40 0,330 Z" fill="var(--c-cloud)"/>
      <path d="M0,330 Q800,40 ${W},330" stroke="var(--c-cloud-hi)" stroke-width="6" fill="none" opacity=".75"/>`;
    return svg(`0 0 ${W} ${H}`, deck + streaks + puffs);
  }

  /* ---------- Layer 2: the Rockies ---------- */
  function rockies() {
    const r = rng(42);
    const keys = [[-20, 560], [110, 450], [230, 500], [360, 380], [470, 470], [600, 400], [720, 490], [860, 350], [990, 460], [1110, 410], [1240, 480], [1380, 370], [1500, 470], [1620, 430]];
    const pts = ridge(keys, r, 5, 70);
    const body = `M-20,1200` + P(pts).replace(/^M/, "L") + `L1620,1200Z`;
    // snow line
    const snowKeys = []; for (let x = -20; x <= 1620; x += 80) snowKeys.push([x, 450 + (r() - 0.5) * 40]);
    const snowPts = ridge(snowKeys, r, 3, 50);
    const snow = `M-20,0 L1620,0 ` + P(snowPts.slice().reverse()).replace(/^M/, "L") + "Z";
    // shadow facets on the right side of each peak
    let facets = "";
    for (let i = 1; i < keys.length - 1; i++) {
      const [px, py] = keys[i];
      if (py < keys[i - 1][1] && py < keys[i + 1][1]) {
        const [vx, vy] = keys[i + 1];
        facets += `<path d="M${px},${py} L${vx},${vy} L${vx + 30},${H} L${px + 40},${H}Z" fill="var(--c-rock-shade)" opacity=".55"/>`;
      }
    }
    return svg(`0 0 ${W} ${H}`, `
      <defs><clipPath id="mtnClip"><path d="${body}"/></clipPath></defs>
      <path d="${body}" fill="var(--c-rock)"/>
      <g clip-path="url(#mtnClip)">${facets}<path d="${snow}" fill="var(--c-snowcap)"/></g>`);
  }

  /* ---------- Layer 3: foothills ---------- */
  function foothills() {
    const a = `M0,1200 L0,640 C200,600 380,660 560,630 C760,595 900,660 1100,640 C1300,620 1450,600 1600,630 L1600,1200Z`;
    const b = `M0,1200 L0,690 C240,660 420,700 640,680 C880,660 1060,710 1300,690 C1440,680 1540,670 1600,680 L1600,1200Z`;
    return svg(`0 0 ${W} ${H}`, `<path d="${a}" fill="var(--c-hill-1)"/><path d="${b}" fill="var(--c-hill-2)"/>`);
  }

  /* ---------- Layer 4: campus + downtown skyline ---------- */
  function city() {
    const r = rng(1988);
    const base = 770;
    let g = "", wins = "";
    const building = (x, w, h, roof) => {
      const y = base - h;
      g += `<rect x="${x}" y="${y}" width="${w}" height="${h + 260}" fill="var(--c-city)"/>`;
      if (roof === "peak") g += `<path d="M${x - 4},${y} L${x + w / 2},${y - 26} L${x + w + 4},${y}Z" fill="var(--c-city)"/>`;
      if (roof === "dome") g += `<path d="M${x},${y} A${w / 2},${w / 3} 0 0 1 ${x + w},${y}Z" fill="var(--c-city)"/>`;
      const cols = Math.max(1, Math.floor((w - 8) / 12)), rows = Math.max(1, Math.floor((h - 14) / 16));
      for (let c = 0; c < cols; c++) for (let rr = 0; rr < rows; rr++) {
        if (r() < 0.38) continue;
        const t = r().toFixed(3);
        wins += `<rect class="win" data-t="${t}" x="${x + 6 + c * 12}" y="${y + 10 + rr * 16}" width="6" height="8" rx="1"/>`;
      }
    };
    // campus (left) — low, wide academic blocks
    let x = -10;
    const campus = [[140, 70, "flat"], [90, 110, "flat"], [60, 60, "peak"], [160, 90, "flat"], [80, 130, "flat"], [120, 75, "dome"]];
    campus.forEach(([w, h, roof]) => { building(x, w, h, roof); x += w + 14 + r() * 20; });
    // downtown (center-right) — towers
    x = 700;
    while (x < 1600) {
      const w = 40 + r() * 60, h = 120 + r() * 240;
      if (x > 940 && x < 1020) { x = 1030; continue; } // gap for the tower
      building(x, w, h, r() < 0.15 ? "peak" : "flat");
      x += w + 6 + r() * 26;
    }
    // Calgary Tower silhouette
    const tower = `
      <path d="M970,${base + 260} L978,500 L990,500 L998,${base + 260}Z" fill="var(--c-city)"/>
      <rect x="958" y="478" width="52" height="24" rx="8" fill="var(--c-city)"/>
      <rect class="tower-ring" x="958" y="486" width="52" height="5" rx="2"/>
      <rect x="982" y="440" width="4" height="40" fill="var(--c-city)"/>
      <circle class="tower-beacon" cx="984" cy="438" r="3"/>`;
    return svg(`0 0 ${W} ${H}`, `<g>${g}${tower}</g><g class="wins">${wins}</g>`);
  }

  /* ---------- Layer 5: snowy foreground, lamp post, bench ---------- */
  function foreground() {
    const r = rng(314);
    const ground = `M0,1200 L0,820 C260,792 560,836 860,816 C1140,798 1380,834 1600,812 L1600,1200Z`;
    const pine = (x, y, h) => {
      const w = h * 0.42;
      let s = "";
      for (let i = 0; i < 4; i++) {
        const ty = y - h + i * (h * 0.2), tw = w * (0.45 + i * 0.2);
        s += `<path d="M${x},${ty} L${x + tw},${ty + h * 0.32} L${x - tw},${ty + h * 0.32}Z" fill="var(--c-tree)"/>`;
        s += `<path d="M${x - tw * 0.6},${ty + h * 0.27} Q${x},${ty + h * 0.22} ${x + tw * 0.6},${ty + h * 0.27}" stroke="var(--c-ground)" stroke-width="3" fill="none" opacity=".8" stroke-linecap="round"/>`;
      }
      return s + `<rect x="${x - 4}" y="${y - 8}" width="8" height="16" fill="var(--c-tree)"/>`;
    };
    let trees = "";
    [[60, 830, 220], [150, 840, 160], [230, 828, 120], [1420, 828, 200], [1510, 836, 250], [1580, 826, 140], [330, 822, 80], [1300, 822, 90]]
      .forEach(([x, y, h]) => (trees += pine(x + (r() - 0.5) * 10, y, h)));
    const lamp = `
      <g class="lamppost">
        <circle class="lamp-glow" cx="900" cy="640" r="190" fill="url(#lampGlow)"/>
        <rect x="896" y="652" width="8" height="172" fill="var(--c-tree)"/>
        <rect x="886" y="818" width="28" height="10" rx="3" fill="var(--c-tree)"/>
        <path d="M884,628 h32 l-4,-14 h-24z" fill="var(--c-tree)"/>
        <rect class="lamp-bulb" x="888" y="628" width="24" height="24" rx="4"/>
        <path d="M884,652 h32 l-3,6 h-26z" fill="var(--c-tree)"/>
      </g>`;
    const person = (x, flip, color) => `
      <g transform="translate(${x},0) scale(${flip ? -1 : 1},1)">
        <circle cx="0" cy="764" r="11" fill="var(--c-skin)"/>
        <path d="M-12,812 Q-14,780 0,776 Q14,780 12,812Z" fill="${color}"/>
        <path d="M-9,770 a10,10 0 0 1 18,0" stroke="var(--c-tree)" stroke-width="4" fill="none"/>
      </g>`;
    const bench = `
      <g class="bench">
        <rect x="600" y="808" width="240" height="8" rx="3" fill="var(--c-tree)"/>
        <rect x="610" y="790" width="220" height="6" rx="3" fill="var(--c-tree)"/>
        <rect x="616" y="814" width="6" height="16" fill="var(--c-tree)"/><rect x="818" y="814" width="6" height="16" fill="var(--c-tree)"/>
        <g class="bench-a">${person(630, false, "var(--c-coat-a)")}</g>
        <g class="bench-b">${person(810, true, "var(--c-coat-b)")}</g>
      </g>`;
    return svg(`0 0 ${W} ${H}`, `
      <defs><radialGradient id="lampGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset=".35" stop-color="#ffb547" stop-opacity=".35"/><stop offset="1" stop-color="#ffb547" stop-opacity="0"/></radialGradient></defs>
      <path d="${ground}" fill="var(--c-ground)"/>
      <path d="M0,836 C300,812 600,850 900,832 C1200,816 1400,846 1600,828" stroke="var(--c-ground-hi)" stroke-width="3" fill="none" opacity=".6"/>
      ${lamp}${bench}${trees}`);
  }

  /* ---------- Cafeteria table (section 01) ---------- */
  function tableScene() {
    const people = document.getElementById("tblPeople");
    const bubbles = document.getElementById("tblBubbles");
    if (!people || !bubbles) return;
    const coats = ["#e8607a", "#4fb3a9", "#f2a65a", "#8b7cff"];
    const hair = ["#2a1b2e", "#5a3a24", "#1b1530", "#7a4a2e"];
    const seats = [190, 480, 770, 1040];
    const thoughts = ["is it weird to say hi?", "wish someone sat here", "they all have friends", "maybe next week…"];
    let p = "", b = "";
    [335, 625, 905].forEach((x) => (p += `<rect x="${x - 50}" y="190" width="100" height="150" rx="16" fill="#33264f" opacity=".85"/>`));
    seats.forEach((x, i) => {
      p += `<g class="student" data-i="${i}">
        <rect x="${x - 54}" y="180" width="108" height="160" rx="18" fill="#33264f"/>
        <path d="M${x - 62},340 Q${x - 66},236 ${x},226 Q${x + 66},236 ${x + 62},340Z" fill="${coats[i]}"/>
        <ellipse cx="${x}" cy="300" rx="70" ry="44" fill="url(#phoneGlow)" class="phone-glow"/>
        <circle cx="${x}" cy="176" r="40" fill="#f0c3a4"/>
        <path d="M${x - 42},170 Q${x - 40},126 ${x},128 Q${x + 42},126 ${x + 42},170 Q${x + 20},150 ${x - 42},170Z" fill="${hair[i]}"/>
        <path d="M${x - 46},172 A46,46 0 0 1 ${x + 46},172" stroke="#1a1530" stroke-width="8" fill="none"/>
        <rect x="${x - 54}" y="160" width="16" height="30" rx="7" fill="#1a1530"/>
        <rect x="${x + 38}" y="160" width="16" height="30" rx="7" fill="#1a1530"/>
        <path d="M${x - 14},186 q5,4 10,0 M${x + 4},186 q5,4 10,0" stroke="#5b3a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <rect x="${x - 14}" y="300" width="28" height="40" rx="5" fill="#9fd3ff" transform="rotate(-8 ${x} 320)"/>
      </g>`;
      const bw = 250, bx = Math.min(1190 - bw, Math.max(10, x - bw / 2)), by = 6 + (i % 2) * 26;
      b += `<g class="bubble" data-i="${i}">
        <rect x="${bx}" y="${by}" width="${bw}" height="62" rx="31" fill="#fff8ec"/>
        <circle cx="${x - 10}" cy="${by + 78}" r="8" fill="#fff8ec"/><circle cx="${x - 2}" cy="${by + 96}" r="5" fill="#fff8ec"/>
        <text x="${bx + bw / 2}" y="${by + 40}" text-anchor="middle" class="bubble-text">${thoughts[i]}</text>
      </g>`;
    });
    people.innerHTML = p;
    bubbles.innerHTML = b;
  }

  function build() {
    const layers = { lyrChinook: chinook, lyrRockies: rockies, lyrFoothills: foothills, lyrCity: city, lyrFore: foreground };
    Object.entries(layers).forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = fn();
      // Optional painted layer: shown only if the file exists
      const src = el.dataset.paint;
      if (src) {
        const img = new Image();
        img.decoding = "async";
        img.alt = "";
        img.className = "paint";
        img.onload = () => { el.prepend(img); el.classList.add("has-paint"); };
        img.src = src;
      }
    });
    tableScene();
  }

  window.Scene = { build };
})();
