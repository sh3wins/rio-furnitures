/* RIO — homepage: the showroom walk */
(function () {
  const $ = (s) => document.querySelector(s);
  const F = RIO.FINISHES;

  /* ---------- The rooms: hero room + a walk through the rest ---------- */
  const roomBlock = (s, i, hero) => `
    <section class="walk-home ${hero ? "is-hero" : ""}" id="room-${s.id}" aria-label="${RIO.esc(s.plural)}">
      ${hero ? "" : `
      <div class="wrap walk-home-head">
        <div><p class="mono muted">Room ${String(i + 1).padStart(2, "0")}</p><h2 class="serif s-l reveal">${s.plural}</h2></div>
        <p class="lead reveal" data-d="1"><em class="serif-i">${s.tagline}</em></p>
      </div>`}
      ${RIO.room(s.id)}
      <div class="wrap walk-home-foot">
        ${hero ? `<span class="mono muted">Room 01 — ${s.plural} · <em class="serif-i">${s.tagline}</em></span>` : `<span class="mono muted">${s.line}</span>`}
        <span class="row" style="gap:22px">
          <a class="link" href="spaces.html?space=${s.id}">Explore ${s.plural.toLowerCase()} <span class="arr">→</span></a>
          <a class="btn btn-sm" href="start.html?space=${s.id}">Furnish this space</a>
        </span>
      </div>
    </section>`;

  const S = RIO.SPACES;
  $("#hero-room").innerHTML = roomBlock(S[0], 0, true);
  $("#rooms").innerHTML = S.slice(1).map((s, i) => roomBlock(s, i + 1, false)).join("");
  RIO.bindRooms(document);

  // a single, quiet hint on the first room that the furniture is alive
  const hero = document.querySelector("#hero-room .room");
  const hio = new IntersectionObserver((en) => {
    if (!en[0].isIntersecting) return; hio.disconnect();
    setTimeout(() => hero.classList.add("hint"), 2400);
    setTimeout(() => hero.classList.remove("hint"), 5000);
  }, { threshold: 0.4 });
  hio.observe(hero);

  /* ---------- Selected pieces ---------- */
  const PICK = ["chair-04", "stool-02", "bed-01", "desk-03"];
  const pieces = $("#pieces");
  pieces.innerHTML = PICK.map((id, i) => RIO.piece(RIO.product(id), i)).join("");
  RIO.bindPieces(pieces);

  /* ---------- Ordering demo ---------- */
  const DEMO = [["black", 40], ["white", 20], ["orange", 10], ["natural", 5]];
  $("#demo-rows").innerHTML = DEMO.map(([f]) => `<div class="demo-row"><span><span class="sw" data-f="${f}" style="background-color:${F[f].hex}"></span> ${F[f].name}</span><span class="mono ink" data-n>000</span></div>`).join("");
  const dio = new IntersectionObserver((en) => {
    if (!en[0].isIntersecting) return; dio.disconnect();
    const rows = $("#demo-rows").querySelectorAll("[data-n]");
    let run = 0;
    DEMO.forEach(([f, n], i) => setTimeout(() => {
      RIO.animateNumber(rows[i], n, 900, 3);
      rows[i].closest(".demo-row").classList.add("on");
      run += n; RIO.animateNumber($("#demo-n"), run, 900, 3);
      $("#demo-bar").innerHTML = DEMO.slice(0, i + 1).map(([g, m]) => `<span style="width:${(m / 75) * 100}%;background:${F[g].hex}"></span>`).join("");
    }, 500 + i * 650));
  }, { threshold: 0.5 });
  dio.observe($("#demo"));

  /* ---------- Projects ---------- */
  $("#gallery").innerHTML = RIO.PORTFOLIO.slice(0, 3).map((p, i) => {
    const s = RIO.space(p.space), photo = p.photos[0];
    return `
      <a class="g-item g${i}" href="projects.html#p${p.no}">
        <div class="ph img-reveal ${photo ? "has-img" : ""}" data-label="${s.plural} — project photograph">${p.video ? `<video src="${p.video}" poster="${photo}" autoplay muted loop playsinline preload="metadata" aria-label="${RIO.esc(p.headline)}"></video>` : photo ? `<img src="${photo}" alt="${RIO.esc(p.headline || p.title)}" loading="lazy">` : ""}</div>
        <div class="g-cap"><span class="mono muted">Project ${p.no} · ${s.plural}</span><span class="serif s-s">${p.headline ? RIO.esc(p.headline) : `<em>Story coming soon</em>`}</span></div>
      </a>`;
  }).join("");

  /* ---------- Workshop strip ---------- */
  const MAKE = [["Materials", "Chosen for how the space is used."], ["Cutting", "Parts cut for your full quantity."], ["Fabrication", "Frames and components made."], ["Assembly", "Put together by hand."],
    ["Finishing", "The finishes you picked, mixed in one order."], ["Quality control", "Every piece checked."], ["Packaging", "Protected for the trip."], ["Delivery", "To your space, ready to open."]];
  const PHOTO = { Cutting: "images/real/workshop-cutting.jpg", Delivery: "images/real/rope-dining.jpg" };
  const CLIP = { Fabrication: "images/real/clip-welding", Assembly: "images/real/clip-assembly", Finishing: "images/real/clip-grinding" };
  const media = (m) => CLIP[m[0]]
    ? `<video src="${CLIP[m[0]]}.mp4" poster="${CLIP[m[0]]}.jpg" autoplay muted loop playsinline preload="metadata" aria-label="RIO workshop — ${m[0].toLowerCase()}"></video>`
    : PHOTO[m[0]] ? `<img src="${PHOTO[m[0]]}" alt="RIO workshop — ${m[0].toLowerCase()}" loading="lazy">` : "";
  $("#strip").innerHTML = MAKE.map((m, i) => `
    <figure class="step">
      <div class="ph ${media(m) ? "has-img" : ""}" data-label="Photograph — ${m[0].toLowerCase()}">${media(m)}</div>
      <figcaption><span class="mono muted">0${i + 1}</span><span class="title">${m[0]}</span><span class="muted small">${m[1]}</span></figcaption>
    </figure>`).join("");
  const strip = $("#strip"), sec = strip.closest("section");
  const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
  function drift() {
    if (!mq.matches) { strip.style.transform = ""; return; }
    const r = sec.getBoundingClientRect(), vh = window.innerHeight;
    const k = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const max = strip.scrollWidth - strip.parentElement.clientWidth;
    strip.style.transform = `translateX(${-k * Math.max(0, max) * 0.9}px)`;
  }
  window.addEventListener("scroll", () => requestAnimationFrame(drift), { passive: true });
  window.addEventListener("resize", drift); drift();

  RIO.observeReveal();
})();

/* ---------- Featured sofa: colour preview (seat sets the backdrop too) ---------- */
(function () {
  const hero = document.querySelector(".feature-hero"), pick = document.getElementById("sofa-pick");
  if (!hero || !pick) return;
  const THEME = {
    beige: { bg: "#aa7045", ink: "#1b1410", on: "#f6f4ef", name: "Beige" },
    white: { bg: "#d6d0c6", ink: "#1b1410", on: "#f6f4ef", name: "White" },
    black: { bg: "#625e5a", ink: "#f6f4ef", on: "#1b1410", name: "Black" },
    red:   { bg: "#ab584d", ink: "#f6f4ef", on: "#1b1410", name: "Red" }
  };
  const FRAME = { black: "Black coated", white: "White coated", grey: "Grey coated" };
  const show = (g, v) => hero.querySelectorAll(`.lyr[data-g="${g}"]`).forEach((l) => l.classList.toggle("on", l.dataset.v === v));
  pick.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-v]"); if (!b) return;
    const g = b.parentElement.dataset.g, v = b.dataset.v;
    b.parentElement.querySelectorAll("button").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); });
    if (g === "seat") {
      const t = THEME[v];
      show("seat", v); show("bg", v);
      hero.style.setProperty("--fh-bg", t.bg); hero.style.setProperty("--fh-ink", t.ink); hero.style.setProperty("--fh-on", t.on);
      pick.querySelector('[data-name="seat"]').textContent = t.name;
    } else if (g === "rope") {
      show("rope", v);
      pick.querySelector('[data-name="rope"]').textContent = THEME[v].name;
    } else {
      show("frame", v);
      pick.querySelector('[data-name="frame"]').textContent = FRAME[v];
    }
  });
})();
