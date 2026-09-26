/* =========================================================
   RIO — Showroom rooms
   Each room is a calm architectural elevation built from the
   same furniture drawings used on the product pages.
   Furniture in a room is interactive: hover → orange marker,
   click → the piece opens in the focus panel.

   REAL PHOTOS LATER: set `photo` on a space in data.js
   (e.g. photo: "images/spaces/restaurant.jpg") and give each
   object `px`/`py` marker positions in % over the photo.
   ========================================================= */
(function () {
  const W = 1600, H = 900, FLOOR = 640;
  let uid = 0;

  /* ---------- small architectural helpers ---------- */
  const H_ = {
    window(x, y, w, h, cols) {
      cols = cols || 3;
      let m = "";
      for (let i = 1; i < cols; i++) m += `<line x1="${x + (w / cols) * i}" y1="${y}" x2="${x + (w / cols) * i}" y2="${y + h}" stroke="#bdb6a9" stroke-width="3"/>`;
      return `
        <rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" fill="#d9d3c8"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sky)"/>
        ${m}<line x1="${x}" y1="${y + h * 0.62}" x2="${x + w}" y2="${y + h * 0.62}" stroke="#bdb6a9" stroke-width="3"/>
        <rect x="${x - 16}" y="${y + h + 8}" width="${w + 32}" height="8" fill="#cfc8bb"/>`;
    },
    archWindow(x, y, w, h) {
      const r = w / 2;
      return `
        <path d="M${x - 10} ${y + h + 10} V${y + r} A${r + 10} ${r + 10} 0 0 1 ${x + w + 10} ${y + r} V${y + h + 10} Z" fill="#d9d3c8"/>
        <path d="M${x} ${y + h} V${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} Z" fill="url(#sky)"/>
        <line x1="${x + r}" y1="${y}" x2="${x + r}" y2="${y + h}" stroke="#bdb6a9" stroke-width="3"/>
        <line x1="${x}" y1="${y + h * 0.55}" x2="${x + w}" y2="${y + h * 0.55}" stroke="#bdb6a9" stroke-width="3"/>`;
    },
    light(x1, x2, spread) {
      // soft daylight spilling onto the floor
      return `<polygon points="${x1},${FLOOR} ${x2},${FLOOR} ${x2 + spread},${H} ${x1 + spread * 0.4},${H}" fill="#fffdf6" opacity=".22"/>`;
    },
    pendant(x, len, w) {
      w = w || 70;
      return `
        <line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="#2a2926" stroke-width="1.5"/>
        <circle cx="${x}" cy="${len + 34}" r="${w * 1.6}" fill="url(#glow)"/>
        <path d="M${x - w / 2} ${len + 30} Q${x - w / 2} ${len} ${x} ${len} Q${x + w / 2} ${len} ${x + w / 2} ${len + 30} Z" fill="#1d1c1a"/>
        <line x1="${x - w / 2}" y1="${len + 30}" x2="${x + w / 2}" y2="${len + 30}" stroke="#ff5a1f" stroke-width="2"/>`;
    },
    linear(x, w, y) {
      return `<line x1="${x + 20}" y1="0" x2="${x + 20}" y2="${y}" stroke="#2a2926" stroke-width="1.2"/>
        <line x1="${x + w - 20}" y1="0" x2="${x + w - 20}" y2="${y}" stroke="#2a2926" stroke-width="1.2"/>
        <ellipse cx="${x + w / 2}" cy="${y + 40}" rx="${w * 0.7}" ry="120" fill="url(#glow)"/>
        <rect x="${x}" y="${y}" width="${w}" height="10" fill="#1d1c1a"/>`;
    },
    plant(x, foot, s) {
      s = s || 1;
      const leaf = (dx, dy, rx, ry, r, c) => `<ellipse cx="${x + dx * s}" cy="${foot - dy * s}" rx="${rx * s}" ry="${ry * s}" transform="rotate(${r} ${x + dx * s} ${foot - dy * s})" fill="${c}"/>`;
      return `
        ${leaf(-26, 150, 18, 52, -28, "#5e6b55")}${leaf(24, 160, 18, 56, 24, "#6d7a61")}${leaf(0, 185, 16, 60, 4, "#57644f")}
        ${leaf(-40, 110, 14, 40, -52, "#6d7a61")}${leaf(38, 112, 14, 40, 50, "#5e6b55")}
        <path d="M${x - 34 * s} ${foot - 86 * s} L${x + 34 * s} ${foot - 86 * s} L${x + 26 * s} ${foot} L${x - 26 * s} ${foot} Z" fill="#e8e2d6" stroke="#2a2926" stroke-width="1.5"/>`;
    },
    art(x, y, w, h, fill) {
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4f1ea" stroke="#2a2926" stroke-width="1.5"/>
        <rect x="${x + w * 0.12}" y="${y + h * 0.12}" width="${w * 0.76}" height="${h * 0.76}" fill="${fill || "#d8cfc0"}"/>`;
    },
    rug(x, w, y, h, fill) { return `<rect x="${x}" y="${y}" width="${w}" height="${h || 26}" fill="${fill || "#d8cdb9"}" opacity=".85"/>`; },
    bottles(x, y, n) {
      let b = `<rect x="${x}" y="${y + 70}" width="${n * 34 + 20}" height="6" fill="#2a2926"/><rect x="${x}" y="${y + 150}" width="${n * 34 + 20}" height="6" fill="#2a2926"/>`;
      for (let i = 0; i < n; i++) {
        const h = 36 + ((i * 17) % 22), c = ["#3b3a36", "#8a7a5c", "#ff5a1f", "#5e6b55"][i % 4];
        b += `<rect x="${x + 14 + i * 34}" y="${y + 70 - h}" width="14" height="${h}" rx="3" fill="${c}"/>`;
        if (i % 2) b += `<rect x="${x + 14 + i * 34}" y="${y + 150 - 30}" width="20" height="30" fill="#e8e2d6" stroke="#2a2926" stroke-width="1"/>`;
      }
      return b;
    },
    board(x, y, w, h) {
      return `<rect x="${x - 12}" y="${y - 12}" width="${w + 24}" height="${h + 24}" fill="#b9ab91"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2f3833"/>
        <path d="M${x + 60} ${y + 70} q60 -30 120 0 t120 0" stroke="#e9e6dc" stroke-width="2" fill="none" opacity=".5"/>
        <line x1="${x + 60}" y1="${y + 130}" x2="${x + 360}" y2="${y + 130}" stroke="#e9e6dc" stroke-width="2" opacity=".35"/>
        <line x1="${x + 60}" y1="${y + 165}" x2="${x + 260}" y2="${y + 165}" stroke="#e9e6dc" stroke-width="2" opacity=".35"/>
        <rect x="${x}" y="${y + h}" width="${w}" height="8" fill="#b9ab91"/>`;
    },
    clock(x, y) {
      return `<circle cx="${x}" cy="${y}" r="34" fill="#f4f1ea" stroke="#2a2926" stroke-width="2"/>
        <line x1="${x}" y1="${y}" x2="${x}" y2="${y - 22}" stroke="#2a2926" stroke-width="2"/><line x1="${x}" y1="${y}" x2="${x + 16}" y2="${y + 6}" stroke="#ff5a1f" stroke-width="2"/>`;
    },
    monitor(x, top) {
      return `<rect x="${x - 50}" y="${top - 70}" width="100" height="62" fill="#1d1c1a"/><line x1="${x}" y1="${top - 8}" x2="${x}" y2="${top}" stroke="#1d1c1a" stroke-width="4"/>`;
    },
    lamp(x, top) {
      return `<line x1="${x}" y1="${top}" x2="${x}" y2="${top - 60}" stroke="#2a2926" stroke-width="2"/>
        <circle cx="${x}" cy="${top - 70}" r="70" fill="url(#glow)"/>
        <path d="M${x - 26} ${top - 60} L${x - 16} ${top - 96} L${x + 16} ${top - 96} L${x + 26} ${top - 60} Z" fill="#efe7d6" stroke="#2a2926" stroke-width="1.5"/>`;
    },
    platform(x, w, h) { return `<rect x="${x}" y="${FLOOR + 40 - h}" width="${w}" height="${h}" fill="#b8a98f"/><line x1="${x}" y1="${FLOOR + 40 - h}" x2="${x + w}" y2="${FLOOR + 40 - h}" stroke="#2a2926" stroke-width="1.5"/>`; },
    tv(x, y) { return `<rect x="${x - 110}" y="${y}" width="220" height="124" fill="#1d1c1a"/>`; },
    mirror(x, y, r) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="#e3ddd1" stroke="#2a2926" stroke-width="1.5"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.25}" fill="#fff" opacity=".4"/>`; },
    neon(x, y, t) { return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="96" fill="#ff7a45" opacity=".95">${t}</text><ellipse cx="${x}" cy="${y - 30}" rx="170" ry="80" fill="#ff5a1f" opacity=".08"/>`; },
    hedge(y) {
      let b = `<rect x="0" y="${y}" width="1600" height="${FLOOR - y}" fill="#6f7c62"/>`;
      for (let i = 0; i <= 1600; i += 70) b += `<circle cx="${i}" cy="${y + 6}" r="44" fill="${i % 140 ? "#6f7c62" : "#65725a"}"/>`;
      return b + `<rect x="0" y="${FLOOR - 70}" width="1600" height="70" fill="#5f6b54" opacity=".5"/>`;
    },
    pergola() { let b = `<rect x="0" y="40" width="1600" height="14" fill="#8a7358"/>`; for (let i = 60; i < 1600; i += 150) b += `<rect x="${i}" y="20" width="12" height="54" fill="#7a6449"/>`; return b; },
    umbrella(x, top, foot) {
      return `<line x1="${x}" y1="${top}" x2="${x}" y2="${foot}" stroke="#2a2926" stroke-width="4"/>
        <path d="M${x - 230} ${top + 70} Q${x} ${top - 40} ${x + 230} ${top + 70} Z" fill="#efe6d4" stroke="#2a2926" stroke-width="1.5"/>
        <path d="M${x - 230} ${top + 70} L${x + 230} ${top + 70}" stroke="#ff5a1f" stroke-width="4"/>`;
    },
    sign(x, y) { return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="64" fill="#2a2926" letter-spacing="4">studio</text><circle cx="${x + 104}" cy="${y - 6}" r="6" fill="#ff5a1f"/>`; }
  };

  /* ---------- the rooms ----------
     objects: pid (product), x (centre), foot (floor y), s (scale), flip, f (finish)
  */
  const ROOMS = {
    restaurant: {
      wall: ["#ece6db", "#e3dccf"], floor: ["#cdbfa9", "#b9a88e"], boards: true,
      back: () => H_.window(90, 130, 330, 400, 3) + H_.light(90, 420, 200) + H_.bottles(1250, 150, 8) + H_.art(520, 190, 150, 190, "#c9b89c") + H_.pendant(560, 170) + H_.pendant(1000, 170),
      objects: [
        { pid: "counter-01", x: 1390, foot: 670, s: 3.1, f: "walnut" },
        { pid: "stool-02", x: 1300, foot: 760, s: 2.3, f: "black" },
        { pid: "stool-02", x: 1470, foot: 760, s: 2.3, f: "black" },
        { pid: "chair-04", x: 405, foot: 780, s: 2.15, f: "orange" },
        { pid: "table-08", x: 560, foot: 780, s: 2.45, f: "natural" },
        { pid: "chair-04", x: 715, foot: 780, s: 2.15, f: "black", flip: true },
        { pid: "chair-04", x: 845, foot: 780, s: 2.15, f: "black" },
        { pid: "table-08", x: 1000, foot: 780, s: 2.45, f: "natural" },
        { pid: "chair-04", x: 1155, foot: 780, s: 2.15, f: "white", flip: true }
      ],
      front: () => H_.plant(70, 860, 1.25)
    },
    bar: {
      wall: ["#35302a", "#2a2621"], floor: ["#6e5c48", "#58493a"], boards: true,
      back: () => H_.neon(800, 190, "bar") + H_.bottles(560, 250, 14) + H_.pendant(480, 150, 60) + H_.pendant(1120, 150, 60),
      objects: [
        { pid: "booth-01", x: 200, foot: 760, s: 2.35, f: "orange" },
        { pid: "counter-01", x: 690, foot: 690, s: 3.0, f: "walnut" },
        { pid: "counter-01", x: 1000, foot: 690, s: 3.0, f: "walnut" },
        { pid: "stool-02", x: 600, foot: 790, s: 2.25, f: "black" },
        { pid: "stool-02", x: 770, foot: 790, s: 2.25, f: "orange" },
        { pid: "stool-02", x: 940, foot: 790, s: 2.25, f: "black" },
        { pid: "stool-02", x: 1110, foot: 790, s: 2.25, f: "black" },
        { pid: "table-08", x: 1390, foot: 770, s: 2.1, f: "black" }
      ],
      front: () => H_.plant(1540, 860, 1.1)
    },
    office: {
      wall: ["#e8e6e1", "#dedbd4"], floor: ["#c4bcae", "#aea596"], boards: false,
      back: () => H_.window(620, 100, 520, 320, 4) + H_.light(620, 1140, 120) + H_.linear(330, 380, 150) + H_.linear(820, 380, 150) + H_.clock(1480, 190),
      objects: [
        { pid: "shelf-02", x: 1300, foot: 680, s: 3.0, f: "black" },
        { pid: "cabinet-04", x: 1490, foot: 680, s: 1.95, f: "white" },
        { pid: "desk-03", x: 440, foot: 780, s: 2.6, f: "white" },
        { pid: "task-chair-05", x: 640, foot: 800, s: 1.95, f: "black" },
        { pid: "desk-03", x: 900, foot: 780, s: 2.6, f: "natural" },
        { pid: "task-chair-05", x: 1100, foot: 800, s: 1.95, f: "orange" }
      ],
      extra: (o) => (o.pid === "desk-03" ? H_.monitor(o.x - 30, o.foot - (104 - 40) * o.s) : ""),
      front: () => H_.plant(90, 860, 1.2)
    },
    school: {
      wall: ["#e8e5da", "#dfdbcd"], floor: ["#c9bea8", "#b5a88f"], boards: true,
      back: () => H_.board(420, 120, 640, 280) + H_.clock(1240, 170) + H_.window(1330, 130, 200, 330, 2),
      objects: [
        { pid: "shelf-02", x: 190, foot: 680, s: 2.7, f: "natural" },
        { pid: "desk-03", x: 1260, foot: 690, s: 2.3, f: "natural" },
        { pid: "student-chair-01", x: 330, foot: 800, s: 1.85, f: "orange" },
        { pid: "student-desk-01", x: 470, foot: 800, s: 2.05, f: "natural" },
        { pid: "student-chair-01", x: 690, foot: 800, s: 1.85, f: "grey" },
        { pid: "student-desk-01", x: 830, foot: 800, s: 2.05, f: "natural" },
        { pid: "student-chair-01", x: 1050, foot: 800, s: 1.85, f: "orange" },
        { pid: "student-desk-01", x: 1190, foot: 800, s: 2.05, f: "natural" }
      ]
    },
    church: {
      wall: ["#eeeae1", "#e4dfd3"], floor: ["#c6b89f", "#b09f83"], boards: true,
      back: () => H_.archWindow(150, 110, 200, 400) + H_.archWindow(1250, 110, 200, 400) + H_.light(150, 350, 160) + H_.light(1250, 1450, -160) +
        `<line x1="800" y1="150" x2="800" y2="330" stroke="#2a2926" stroke-width="6"/><line x1="745" y1="205" x2="855" y2="205" stroke="#2a2926" stroke-width="6"/>` + H_.platform(560, 480, 40),
      objects: [
        { pid: "pulpit-01", x: 800, foot: 640, s: 2.7, f: "walnut" },
        { pid: "pew-03", x: 420, foot: 800, s: 3.1, f: "natural" },
        { pid: "pew-03", x: 1180, foot: 800, s: 3.1, f: "natural" }
      ]
    },
    outdoor: {
      wall: ["#eef0ea", "#e4e8de"], floor: ["#b99d7c", "#a0856a"], boards: true,
      back: () => H_.hedge(380) + H_.pergola() + H_.umbrella(1160, 300, 700),
      objects: [
        { pid: "bench-01", x: 780, foot: 690, s: 2.4, f: "walnut" },
        { pid: "lounger-01", x: 250, foot: 800, s: 2.6, f: "white" },
        { pid: "lounger-01", x: 560, foot: 810, s: 2.6, f: "natural" },
        { pid: "chair-04", x: 1010, foot: 790, s: 2.1, f: "black" },
        { pid: "table-08", x: 1160, foot: 790, s: 2.3, f: "natural" },
        { pid: "chair-04", x: 1310, foot: 790, s: 2.1, f: "orange", flip: true }
      ],
      front: () => H_.plant(1520, 860, 1.2)
    },
    other: {
      wall: ["#ebe8e2", "#e1ddd5"], floor: ["#cec5b6", "#b9ae9c"], boards: false,
      back: () => H_.mirror(800, 250, 110) + H_.sign(800, 440) + H_.art(1130, 180, 140, 190, "#e1c9b1") + H_.linear(620, 360, 90),
      objects: [
        { pid: "shelf-02", x: 170, foot: 680, s: 3.0, f: "natural" },
        { pid: "shelf-02", x: 390, foot: 680, s: 3.0, f: "natural" },
        { pid: "reception-01", x: 800, foot: 760, s: 3.2, f: "white" },
        { pid: "bench-01", x: 1250, foot: 800, s: 2.5, f: "walnut" }
      ],
      front: () => H_.plant(1500, 860, 1.25)
    }
  };

  function place(o) {
    const p = RIO.product(o.pid);
    const s = o.s;
    const tx = o.flip ? o.x + 60 * s : o.x - 60 * s;
    const ty = o.foot - 104 * s;
    const hex = (RIO.FINISHES[o.f] || RIO.FINISHES[p.finishes[0]]).hex;
    return { p, s, tx, ty, hex };
  }

  function floorboards(id) {
    let l = "";
    [18, 44, 80, 126, 184, 252].forEach((d) => { l += `<line x1="0" y1="${FLOOR + d}" x2="${W}" y2="${FLOOR + d}" stroke="#8f7f66" stroke-width="1" opacity=".18"/>`; });
    return l;
  }

  /* Render a room. Returns HTML string. */
  RIO.room = function (spaceId, opts) {
    opts = opts || {};
    const R = ROOMS[spaceId] || ROOMS.other;
    const sp = RIO.space(spaceId);
    const id = "rm" + ++uid;
    let objs = "", shadows = "", markers = "";

    R.objects.forEach((o, i) => {
      const { p, s, tx, ty, hex } = place(o);
      const w = 104 * s * 0.5;
      shadows += `<ellipse cx="${o.x}" cy="${o.foot + 2}" rx="${w}" ry="${6 + s * 2}" fill="#3a3024" opacity=".12"/>`;
      const extra = R.extra ? R.extra(o) : "";
      objs += `
        <g class="obj" data-pid="${p.id}" data-i="${i}" style="--i:${i}">
          <g transform="translate(${tx} ${ty}) scale(${o.flip ? -s : s} ${s})">${RIO.icon(p.icon, hex, { raw: true })}</g>
          ${extra}
        </g>`;
      const top = o.foot - (104 - (RIO.ICON_TOP[p.icon] || 20)) * s - 30;
      // only one marker per product per room
      if (!markers.includes(`data-pid="${p.id}"`)) {
        markers += `
          <button class="marker" data-pid="${p.id}" data-i="${i}" style="left:${(o.x / W) * 100}%;top:${(top / H) * 100}%;--i:${i}" aria-label="${RIO.esc(p.name)} — open">
            <span class="dot"></span><span class="tip"><span class="mono">${RIO.code(p)}</span></span>
          </button>`;
      }
    });

    const photo = sp && sp.photo;
    const art = photo
      ? `<img class="room-photo" src="${photo}" alt="${RIO.esc(sp.name)} furnished by RIO">`
      : `<svg class="room-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${RIO.esc(sp ? sp.name : "")} room illustration with RIO furniture">
          <defs>
            <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${R.wall[0]}"/><stop offset="1" stop-color="${R.wall[1]}"/></linearGradient>
            <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${R.floor[0]}"/><stop offset="1" stop-color="${R.floor[1]}"/></linearGradient>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f3ea"/><stop offset=".7" stop-color="#efe6d4"/><stop offset="1" stop-color="#e8dcc5"/></linearGradient>
            <radialGradient id="glow"><stop offset="0" stop-color="#fff6e0" stop-opacity=".75"/><stop offset="1" stop-color="#fff6e0" stop-opacity="0"/></radialGradient>
          </defs>
          <rect width="${W}" height="${FLOOR}" fill="url(#${id}w)"/>
          <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="url(#${id}f)"/>
          ${R.boards ? floorboards() : ""}
          <rect y="${FLOOR - 14}" width="${W}" height="14" fill="#f3efe7"/><line x1="0" y1="${FLOOR}" x2="${W}" y2="${FLOOR}" stroke="#2a2926" stroke-width="1" opacity=".35"/>
          <g class="room-back">${R.back()}</g>
          <g class="room-shadows">${shadows}</g>
          <g class="room-objs">${objs}</g>
          ${R.front ? `<g class="room-front">${R.front()}</g>` : ""}
        </svg>`;

    return `
      <div class="room ${opts.compact ? "compact" : ""}" data-room="${spaceId}">
        <div class="room-pan">
          <div class="room-canvas">
            ${art}
            <div class="markers">${markers}</div>
          </div>
        </div>
      </div>`;
  };

  /* Wire up interactions for all rooms inside root */
  RIO.bindRooms = function (root) {
    (root || document).querySelectorAll(".room:not([data-bound])").forEach((room) => {
      room.dataset.bound = "1";
      const lit = (pid, on) => room.querySelectorAll(`.obj[data-pid="${pid}"], .marker[data-pid="${pid}"]`).forEach((e) => e.classList.toggle("lit", on));
      room.addEventListener("mouseover", (e) => {
        const t = e.target.closest(".obj, .marker"); if (t) lit(t.dataset.pid, true);
      });
      room.addEventListener("mouseout", (e) => {
        const t = e.target.closest(".obj, .marker"); if (t) lit(t.dataset.pid, false);
      });
      room.addEventListener("focusin", (e) => { const t = e.target.closest(".marker"); if (t) lit(t.dataset.pid, true); });
      room.addEventListener("focusout", (e) => { const t = e.target.closest(".marker"); if (t) lit(t.dataset.pid, false); });
      room.addEventListener("click", (e) => {
        const t = e.target.closest(".obj, .marker"); if (!t) return;
        RIO.openFocus(t.dataset.pid, { room: room.dataset.room });
      });
      // centre the pan on small screens
      const pan = room.querySelector(".room-pan");
      requestAnimationFrame(() => { if (pan.scrollWidth > pan.clientWidth) pan.scrollLeft = (pan.scrollWidth - pan.clientWidth) / 2; });
      // gentle entrance when the room comes into view
      if (room.closest("[data-manual]")) return; // a parent controls when it shows
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { room.classList.add("shown"); io.disconnect(); } }, { threshold: 0.25 });
        io.observe(room);
      } else room.classList.add("shown");
    });
  };

  /* Recolour a product inside visible rooms (used while choosing finishes) */
  RIO.tintRooms = function (pid, finishId) {
    document.querySelectorAll(`.room .obj[data-pid="${pid}"]`).forEach((g) => {
      const inner = g.querySelector("g");
      if (!inner.dataset.orig) inner.dataset.orig = inner.innerHTML;
      const p = RIO.product(pid);
      inner.innerHTML = finishId ? RIO.icon(p.icon, RIO.FINISHES[finishId].hex, { raw: true }) : inner.dataset.orig;
    });
  };

  RIO.ROOMS = ROOMS;
})();
