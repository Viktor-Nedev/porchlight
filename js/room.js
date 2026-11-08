/* ---------------------------------------------------------------------
   Porchlight — the food-court backdrop behind “The moment”.
   An illustrated interior drawn as one SVG: tall windows onto the snowy
   campus at night, pendant lamps, a wall clock at 4:10, a menu board,
   a pinboard, and other students sitting alone, each lit by a phone.
   --------------------------------------------------------------------- */
(function () {
  const host = document.getElementById("momentRoom");
  if (!host) return;

  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /* windows onto the campus */
  const WIN = [820, 1000, 1180];
  const winShape = (x) => `M${x},430 V130 a75,75 0 0 1 150,0 V430 Z`;
  let stars = "", flakes = "", lights = "";
  for (let i = 0; i < 46; i++) stars += `<circle cx="${800 + rnd() * 560}" cy="${60 + rnd() * 200}" r="${0.6 + rnd() * 1.2}" class="r-star" style="animation-delay:${(rnd() * 4).toFixed(2)}s"/>`;
  for (let i = 0; i < 70; i++) flakes += `<circle cx="${800 + rnd() * 560}" cy="${40 + rnd() * 400}" r="${0.8 + rnd() * 1.6}" class="r-flake" style="animation-duration:${(5 + rnd() * 6).toFixed(1)}s;animation-delay:-${(rnd() * 8).toFixed(1)}s"/>`;
  for (let i = 0; i < 26; i++) lights += `<rect x="${800 + rnd() * 560}" y="${345 + rnd() * 40}" width="3" height="3" class="r-citylight" style="animation-delay:${(rnd() * 5).toFixed(2)}s"/>`;
  const outside = `
    <clipPath id="rWinClip">${WIN.map((x) => `<path d="${winShape(x)}"/>`).join("")}</clipPath>
    <g clip-path="url(#rWinClip)">
      <rect x="780" y="40" width="620" height="400" fill="url(#rSky)"/>
      ${stars}
      <path d="M780,330 L860,250 L905,300 L980,215 L1050,290 L1120,232 L1190,300 L1260,240 L1330,305 L1400,270 V440 H780 Z" fill="#2c2766"/>
      <path d="M940,236 L980,215 L1010,240 Z M1100,248 L1120,232 L1142,250 Z M1240,256 L1260,240 L1282,258 Z" fill="#9a93cf" opacity=".75"/>
      <path d="M780,360 C900,340 1040,372 1180,352 C1280,340 1340,356 1400,350 V440 H780 Z" fill="#1d1946"/>
      <g fill="#120f30"><rect x="840" y="330" width="40" height="40"/><rect x="890" y="312" width="22" height="58"/><rect x="1010" y="322" width="54" height="48"/><rect x="1200" y="318" width="30" height="52"/><rect x="1236" y="336" width="60" height="34"/></g>
      ${lights}
      <path d="M780,400 C920,388 1080,410 1230,398 C1320,392 1370,398 1400,396 V440 H780 Z" fill="#cfc8ee" opacity=".8"/>
      ${flakes}
    </g>`;
  const frames = WIN.map((x) => `
    <path d="${winShape(x)}" class="r-frame"/>
    <path d="M${x + 75},55 V430 M${x},270 H${x + 150}" class="r-mullion"/>
    <rect x="${x - 10}" y="428" width="170" height="12" rx="3" class="r-sill"/>
    <path d="M${x - 6},428 q20,-8 40,-2 q30,-6 55,-1 q35,-7 66,1" class="r-sillsnow"/>
    <path d="M${x + 10},${300} l40,-140" class="r-glare"/>`).join("");

  /* floor patches of window light */
  const patches = WIN.map((x) => `<path d="M${x - 10},640 L${x + 160},640 L${x + 250},900 L${x - 40},900 Z" class="r-patch"/>`).join("");

  /* pendant lamps */
  const lamps = [300, 800, 1300].map((x, i) => `
    <g class="r-lamp" style="animation-delay:${i * 0.6}s">
      <path d="M${x},0 V${120 + i * 10}" class="r-cord"/>
      <path d="M${x},${148 + i * 10} L${x - 250},900 L${x + 250},900 Z" fill="url(#rCone)" class="r-cone"/>
      <path d="M${x},${148 + i * 10} L${x - 120},900 L${x + 120},900 Z" fill="url(#rConeCore)" class="r-cone"/>
      <ellipse cx="${x}" cy="${640 + i * 4}" rx="190" ry="26" fill="url(#rPool)" class="r-pool"/>
      <path d="M${x - 34},${150 + i * 10} Q${x},${96 + i * 10} ${x + 34},${150 + i * 10} Z" class="r-shade"/>
      <ellipse cx="${x}" cy="${151 + i * 10}" rx="16" ry="5" class="r-bulb"/>
    </g>`).join("");

  /* wall clock (4:10) */
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<line x1="${1420 + Math.sin(a) * 40}" y1="${150 - Math.cos(a) * 40}" x2="${1420 + Math.sin(a) * (i % 3 ? 44 : 47)}" y2="${150 - Math.cos(a) * (i % 3 ? 44 : 47)}" class="r-tick"/>`;
  }).join("");
  const clock = `
    <g class="r-clock">
      <circle cx="1420" cy="150" r="54" class="r-clock-rim"/>
      <circle cx="1420" cy="150" r="49" class="r-clock-face"/>
      ${ticks}
      <line x1="1420" y1="150" x2="1420" y2="122" class="r-hour" id="rHour" transform="rotate(125 1420 150)"/>
      <line x1="1420" y1="150" x2="1420" y2="112" class="r-min" id="rMin" transform="rotate(60 1420 150)"/>
      <circle cx="1420" cy="150" r="3.5" class="r-pin"/>
    </g>`;

  /* menu board */
  const menu = `
    <g class="r-menu">
      <rect x="1350" y="250" width="170" height="150" rx="8" class="r-menu-bg"/>
      <rect x="1358" y="258" width="154" height="134" rx="5" class="r-menu-in"/>
      <text x="1435" y="285" class="r-menu-title">MACHALL</text>
      <path d="M1370,296 H1500" class="r-menu-rule"/>
      <text x="1370" y="318" class="r-menu-line">SOUP OF THE DAY</text><text x="1500" y="318" class="r-menu-price">5.50</text>
      <text x="1370" y="340" class="r-menu-line">CHILI BOWL</text><text x="1500" y="340" class="r-menu-price">7.25</text>
      <text x="1370" y="362" class="r-menu-line">HOT CHOCOLATE</text><text x="1500" y="362" class="r-menu-price">3.00</text>
      <text x="1370" y="384" class="r-menu-line">OPEN TIL 9PM</text>
    </g>`;

  /* pinboard of notes */
  const notes = [
    [130, 330, -4, "#fff3c9", "study group?"], [210, 318, 3, "#f8c9d3", "lost: blue toque"],
    [152, 400, 2, "#cfe9e5", "anyone free tue 2-4?"], [242, 392, -3, "#fff3c9", "chess club"],
  ];
  const board = `
    <g class="r-board">
      <rect x="100" y="300" width="250" height="180" rx="6" class="r-board-frame"/>
      <rect x="110" y="310" width="230" height="160" rx="3" class="r-cork"/>
      ${notes.map(([x, y, r, c, t]) => `<g transform="rotate(${r} ${x + 40} ${y + 30})"><rect x="${x}" y="${y}" width="84" height="60" fill="${c}" class="r-note"/><text x="${x + 42}" y="${y + 34}" class="r-note-t">${t}</text><circle cx="${x + 42}" cy="${y + 7}" r="3.5" class="r-tack"/></g>`).join("")}
    </g>`;

  /* other students, each alone with a phone */
  const people = [];
  const tables = [[200, 0.9], [470, 0.75], [1130, 0.75], [1400, 0.9]];
  tables.forEach(([x, s]) => {
    const y = 600;
    let g = `<g transform="translate(${x},${y}) scale(${s})">
      <rect x="-60" y="-4" width="120" height="7" rx="3" class="r-table"/>
      <rect x="-50" y="3" width="5" height="40" class="r-table"/><rect x="45" y="3" width="5" height="40" class="r-table"/>`;
    [-34, 34].forEach((dx, k) => {
      if (k === 1 && rnd() < 0.5) return; // keep seats empty sometimes
      g += `<g transform="translate(${dx},0)">
        <rect x="-15" y="-40" width="30" height="38" rx="12" class="r-person"/>
        <circle cx="0" cy="-52" r="11" class="r-person"/>
        <path d="M-12,-56 a12,12 0 0 1 24,0" class="r-phones"/>
        <circle cx="${dx < 0 ? 8 : -8}" cy="-18" r="10" class="r-glow" style="animation-delay:${(rnd() * 3).toFixed(2)}s"/>
        <rect x="${dx < 0 ? 4 : -12}" y="-24" width="8" height="12" rx="1.5" class="r-phone"/>
      </g>`;
    });
    people.push(g + "</g>");
  });

  /* floor perspective */
  let floor = "";
  for (let i = -10; i <= 26; i++) floor += `<path d="M800,560 L${800 + i * 140},900" class="r-floorline"/>`;
  [665, 715, 780, 860].forEach((y) => (floor += `<path d="M0,${y} H1600" class="r-floorline"/>`));

  /* plants */
  const plant = (x, s) => `<g transform="translate(${x},640) scale(${s})" class="r-plant">
    <path d="M-22,0 h44 l-6,40 h-32 z" class="r-pot"/>
    <path d="M0,0 C-30,-30 -40,-70 -20,-110 M0,0 C10,-40 30,-70 50,-90 M0,0 C-6,-50 2,-80 10,-130 M0,0 C-40,-10 -60,-40 -70,-60" class="r-stem"/>
    <ellipse cx="-20" cy="-110" rx="16" ry="7" transform="rotate(-50 -20 -110)" class="r-leaf"/><ellipse cx="50" cy="-90" rx="16" ry="7" transform="rotate(-20 50 -90)" class="r-leaf"/>
    <ellipse cx="10" cy="-130" rx="16" ry="7" transform="rotate(-80 10 -130)" class="r-leaf"/><ellipse cx="-70" cy="-60" rx="16" ry="7" transform="rotate(20 -70 -60)" class="r-leaf"/>
    <ellipse cx="-34" cy="-50" rx="14" ry="6" transform="rotate(-30 -34 -50)" class="r-leaf"/><ellipse cx="28" cy="-56" rx="14" ry="6" transform="rotate(-10 28 -56)" class="r-leaf"/>
  </g>`;

  host.innerHTML = `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="rWall" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2b2256"/><stop offset=".62" stop-color="#2f2560"/><stop offset="1" stop-color="#261e50"/></linearGradient>
      <linearGradient id="rSky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0d0b2a"/><stop offset=".55" stop-color="#2a2366"/><stop offset="1" stop-color="#5b4a8f"/></linearGradient>
      <linearGradient id="rFloor" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#211a48"/><stop offset="1" stop-color="#140f30"/></linearGradient>
      <linearGradient id="rCone" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd27a" stop-opacity=".22"/><stop offset=".45" stop-color="#ffd27a" stop-opacity=".07"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></linearGradient>
      <linearGradient id="rConeCore" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff0c4" stop-opacity=".2"/><stop offset=".35" stop-color="#ffd27a" stop-opacity=".05"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></linearGradient>
      <radialGradient id="rPool"><stop offset="0" stop-color="#ffd27a" stop-opacity=".16"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <radialGradient id="rVignette" cx=".5" cy=".55" r=".75"><stop offset=".55" stop-color="#120f2c" stop-opacity="0"/><stop offset="1" stop-color="#0d0b21" stop-opacity=".75"/></radialGradient>
      <pattern id="rTile" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="none"/><path d="M0,0 H40 M0,0 V40" stroke="#3a3070" stroke-width="1" opacity=".35"/></pattern>
    </defs>
    <rect width="1600" height="900" fill="url(#rWall)"/>
    <rect width="1600" height="560" fill="url(#rTile)" opacity=".5"/>
    ${outside}${frames}
    ${board}${clock}${menu}
    <rect x="0" y="560" width="1600" height="80" class="r-wainscot"/>
    <path d="M0,560 H1600" class="r-rail"/>
    ${Array.from({ length: 41 }, (_, i) => `<path d="M${i * 40},566 V636" class="r-slat"/>`).join("")}
    <rect x="0" y="640" width="1600" height="260" fill="url(#rFloor)"/>
    ${floor}${patches}
    <g class="r-people">${people.join("")}</g>
    ${plant(70, 1.1)}${plant(1540, 0.95)}
    ${lamps}
    <rect width="1600" height="900" fill="url(#rVignette)"/>
  </svg>`;

  /* the clock runs with the scroll: 4:10 → 4:40 */
  if (window.gsap && window.ScrollTrigger && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const st = { t: 0 };
    gsap.to(st, {
      t: 1, ease: "none",
      scrollTrigger: { trigger: ".moment", start: "top top", end: "bottom bottom", scrub: 0.6 },
      onUpdate: () => {
        const min = 10 + st.t * 30;
        document.getElementById("rMin").setAttribute("transform", `rotate(${min * 6} 1420 150)`);
        document.getElementById("rHour").setAttribute("transform", `rotate(${120 + min * 0.5} 1420 150)`);
      },
    });
  }
})();
