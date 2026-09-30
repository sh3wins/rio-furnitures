/* RIO — a piece, examined in the showroom */
(function () {
  const F = RIO.FINISHES;
  let p = RIO.product(RIO.qs("id")) || RIO.PRODUCTS[0];
  // frame variants (hidden) open on their main product with that frame chosen
  if (p.hidden) p = RIO.PRODUCTS.find((x) => x.variants && Object.values(x.variants).includes(p.id)) || p;
  let frame = (RIO.product(RIO.qs("id")) || p).frame || p.frame;
  document.title = RIO.shortName(p) + " — RIO Furnitures";
  // Real photos: photos: { front, back, side, detail, material } in data.js ("rear" also works for back)
  const PH = Object.assign({}, p.photos || {});
  if (PH.rear && !PH.back) PH.back = PH.rear;
  const PHOTO_VIEWS = [["front", "Front"], ["back", "Back"], ["side", "Side"], ["detail", "Detail"], ["material", "Material"]].filter(([k]) => PH[k]);
  const canTurn = !!(PH.front && PH.back);
  let fin = p.finishes[0], view = PH.front ? "front" : "object";

  const cat = RIO.category(p.cats[0]);
  document.getElementById("crumbs").innerHTML =
    `<a href="furniture.html">Furniture</a><span>/</span><a href="furniture.html?cat=${cat.id}">${cat.name}</a><span>/</span><span class="ink">${RIO.shortName(p)}</span>`;

  // which room shows this piece?
  const roomId = Object.keys(RIO.ROOMS).find((k) => RIO.ROOMS[k].objects.some((o) => o.pid === p.id)) || p.spaces[0];
  const VIEWS = p.layers ? [["object", "Photo"]] : [...PHOTO_VIEWS, ["object", p.image ? "Photo" : "Drawing"], ["room", "In a room"]];
  const tbc = `<span class="tbc">confirmed with your quote</span>`;

  document.getElementById("prod").innerHTML = `
    <div class="p-stage-wrap">
      <div class="p-stage ${PHOTO_VIEWS.length ? "is-photo" : ""}" id="stage" tabindex="0" aria-label="Product views — use the arrow keys or swipe to change view"></div>
      <div class="views" role="tablist" aria-label="Views">${VIEWS.map(([k, n]) => `<button type="button" role="tab" data-v="${k}" class="${k === view ? "on" : ""}" aria-selected="${k === view}">${n}</button>`).join("")}</div>
    </div>

    <div class="p-info">
      <span class="mono muted">${RIO.code(p)}</span>
      <h1 class="serif s-l">${RIO.shortName(p)}</h1>
      <p class="p-type">${p.type || ""}</p>
      <p class="lead">${p.desc}</p>

      <div class="p-block">
        <span class="mono muted">${p.finishLabel || "Finish"} — <span class="ink" id="fin-name">${F[fin].name}</span></span>
        <div class="finishes" id="fins">${p.finishes.map((f) => `<button type="button" class="fin ${f === fin ? "on" : ""}" data-fin="${f}" aria-label="${F[f].name}" aria-pressed="${f === fin}"><span class="c" data-f="${f}" style="background-color:${F[f].hex}"></span><span class="mono">${F[f].name}</span></button>`).join("")}</div>
      </div>

      ${p.variants ? `<div class="p-block">
        <span class="mono muted">Frame — <span class="ink" id="frame-name">${RIO.FRAMES[frame]}</span></span>
        <div class="finishes" id="frames">${Object.keys(p.variants).map((f) => `<button type="button" class="fin ${f === frame ? "on" : ""}" data-frame="${f}" aria-label="${RIO.FRAMES[f]}" aria-pressed="${f === frame}"><span class="c" style="background-color:${{ black: "#1b1a19", white: "#e9e8e4", grey: "#85878a" }[f]}"></span><span class="mono">${RIO.FRAMES[f]}</span></button>`).join("")}</div>
        <p class="mono muted" style="font-size:10.5px;margin-top:10px">Colour preview · final finishes may vary slightly</p>
      </div>` : ""}

      <dl class="specs-q p-block">
        <div><dt class="mono muted">Dimensions</dt><dd>${p.dims || tbc}</dd></div>
        <div><dt class="mono muted">Materials</dt><dd>${p.materials || tbc}</dd></div>
        <div><dt class="mono muted">Lead time</dt><dd>${p.lead || "Depends on quantity — " + tbc}</dd></div>
        <div><dt class="mono muted">Price</dt><dd>${p.price ? "From KES " + p.price.toLocaleString() + " per unit · larger orders quoted" : "Project quote, based on your quantities"}</dd></div>
        <div><dt class="mono muted">Made for</dt><dd>${p.spaces.map((s) => `<a class="link" style="font-weight:400" href="spaces.html?space=${s}">${RIO.space(s).plural}</a>`).join(", ")}</dd></div>
      </dl>

      <div class="p-block" id="builder"></div>

      <div class="p-custom">
        <span class="small">A different size, colour or detail? <span class="muted">We make to your space.</span></span>
        <a class="link" href="start.html?mode=custom">Custom project <span class="arr">→</span></a>
      </div>
    </div>`;

  const stage = document.getElementById("stage");
  function paint() {
    if (view === "object" && p.layers) {
      const L = p.layers, lyr = (g, v) => Object.keys(L[g]).map((k) => `<img class="lyr ${k === v ? "on" : ""}" data-g="${g}" data-v="${k}" src="${L[g][k]}" alt="">`).join("");
      stage.innerHTML = `<div class="ph has-img layered"><img src="${p.image}" alt="${RIO.esc(p.name)}">${lyr("seat", fin)}${lyr("frame", frame)}</div>`;
    } else if (view === "object" && p.image) {
      stage.innerHTML = `<div class="ph has-img"><img src="${p.image}" alt="${RIO.esc(p.name)}"></div>`;
    } else if (view === "object") {
      stage.innerHTML = RIO.visual(p, fin) + `<span class="mono muted cap">${F[fin].name} · drawing</span>`;
    } else if (view === "room") {
      stage.innerHTML = RIO.room(roomId, { compact: true });
      RIO.bindRooms(stage);
      const pan = stage.querySelector(".room-pan");
      // centre on this piece and point to it
      setTimeout(() => {
        const o = (RIO.ROOMS[roomId] || { objects: [] }).objects.find((x) => x.pid === p.id);
        if (o) pan.scrollLeft = Math.max(0, (o.x / 1600) * pan.scrollWidth - pan.clientWidth / 2);
        RIO.tintRooms(p.id, fin);
        stage.querySelectorAll(`[data-pid="${p.id}"]`).forEach((e) => e.classList.add("lit"));
        stage.querySelector(".room").classList.add("hint");
      }, 50);
    } else {
      const src = PH[view];
      const turn = canTurn && (view === "front" || view === "back")
        ? `<button type="button" class="turn-btn" id="turn">${view === "front" ? "See the back" : "See the front"} <span aria-hidden="true">↻</span></button>` : "";
      stage.innerHTML = `<div class="ph has-img turn-in"><img src="${src}" alt="${RIO.esc(p.name)} — ${view} view"></div>
        <span class="mono cap view-tag">${view}</span>${turn}`;
      const t = document.getElementById("turn");
      if (t) t.onclick = () => setView(view === "front" ? "back" : "front");
    }
  }
  function setView(v) {
    view = v;
    document.querySelectorAll(".views button").forEach((x) => { const on = x.dataset.v === v; x.classList.toggle("on", on); x.setAttribute("aria-selected", on); });
    paint();
  }
  const step = (d) => { const i = VIEWS.findIndex(([k]) => k === view); setView(VIEWS[(i + d + VIEWS.length) % VIEWS.length][0]); };
  document.querySelector(".views").addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]"); if (b) setView(b.dataset.v);
  });
  // swipe on phones, arrow keys on computers (the room view scrolls sideways, so leave it alone there)
  let x0 = null;
  stage.addEventListener("touchstart", (e) => { x0 = view === "room" ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1); x0 = null; });
  stage.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });

  function setFin(f) {
    if (f === fin) return; fin = f;
    document.getElementById("fin-name").textContent = F[f].name;
    document.querySelectorAll("#fins .fin").forEach((b) => { const on = b.dataset.fin === f; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    if (p.layers) showLayer("seat", f);
    else if (view === "object" && !p.image) {
      const svg = stage.querySelector("svg"); svg.style.opacity = 0;
      setTimeout(() => paint(), 200);
    } else if (view === "room") RIO.tintRooms(p.id, f);
  }
  document.getElementById("fins").addEventListener("click", (e) => { const b = e.target.closest("[data-fin]"); if (b) setFin(b.dataset.fin); });
  const showLayer = (g, v) => stage.querySelectorAll(`.lyr[data-g="${g}"]`).forEach((l) => l.classList.toggle("on", l.dataset.v === v));
  const orderProduct = () => (p.variants ? RIO.product(p.variants[frame]) : p);
  RIO.builder(document.getElementById("builder"), orderProduct(), { onFinish: setFin });
  const framesEl = document.getElementById("frames");
  if (framesEl) framesEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-frame]"); if (!b || b.dataset.frame === frame) return;
    frame = b.dataset.frame;
    framesEl.querySelectorAll(".fin").forEach((x) => { const on = x.dataset.frame === frame; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
    document.getElementById("frame-name").textContent = RIO.FRAMES[frame];
    showLayer("frame", frame);
    RIO.builder(document.getElementById("builder"), orderProduct(), { onFinish: setFin, startWith: fin });
  });
  paint();

  const rel = RIO.PRODUCTS.filter((x) => !x.hidden && x.id !== p.id && x.spaces.some((s) => p.spaces.includes(s))).slice(0, 4);
  const relEl = document.getElementById("related");
  relEl.innerHTML = rel.map((x, i) => RIO.piece(x, i)).join("");
  RIO.bindPieces(relEl);
  RIO.observeReveal();
})();
