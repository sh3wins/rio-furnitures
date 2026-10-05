/* RIO — product page
   In order: the picture, the name, what it is, colours, how many, add to project. */
(function () {
  const F = RIO.FINISHES, ARR = RIO.ARR;
  const asked = RIO.product(RIO.qs("id")) || RIO.PRODUCTS[0];
  // A frame variant (hidden product) opens on its main product with that frame chosen
  const p = asked.hidden ? (RIO.PRODUCTS.find((x) => x.variants && Object.values(x.variants).includes(asked.id)) || asked) : asked;
  let frame = asked.frame || p.frame;
  document.title = RIO.shortName(p) + " — RIO Furnitures";

  // Extra photo views, if the product has them: photos: { front, back, side, detail, material }
  const PH = Object.assign({}, p.photos || {});
  if (PH.rear && !PH.back) PH.back = PH.rear;
  const PHOTO_VIEWS = [["front", "Front"], ["back", "Back"], ["side", "Side"], ["detail", "Detail"], ["material", "Material"]].filter(([k]) => PH[k]);
  const VIEWS = PHOTO_VIEWS.length ? PHOTO_VIEWS.concat(p.image ? [["object", "Photo"]] : []) : [];
  const canTurn = !!(PH.front && PH.back);
  let fin = p.finishes[0], view = PH.front ? "front" : "object";

  const cat = RIO.category(p.cats[0]);
  document.getElementById("crumbs").innerHTML =
    `<a href="furniture.html">Furniture</a><span>/</span><a href="furniture.html?cat=${cat.id}">${cat.name}</a><span>/</span><span class="ink">${RIO.shortName(p)}</span>`;

  const FRAME_HEX = { black: "#1b1a19", white: "#e9e8e4", grey: "#85878a" };
  const swatch = (attr, id, name, hex, on) =>
    `<button type="button" class="fin ${on ? "on" : ""}" ${attr}="${id}" aria-label="${name}" aria-pressed="${on}"><span class="c" data-f="${id}" style="background-color:${hex}"></span><span class="meta">${name}</span></button>`;
  const fact = (label, value) => value ? `<div><dt>${label}</dt><dd>${value}</dd></div>` : "";
  const facts = fact("Dimensions", p.dims) + fact("Materials", p.materials) + fact("Lead time", p.lead) +
    fact("Price", p.price ? "From KES " + p.price.toLocaleString() + " per piece" : "Quoted on your quantities") +
    fact("Made for", p.spaces.map((s) => `<a class="link" href="spaces.html?space=${s}">${RIO.space(s).plural}</a>`).join(" &nbsp; "));

  document.getElementById("prod").innerHTML = `
    <div class="p-stage-wrap">
      <div class="p-stage ${p.image || PHOTO_VIEWS.length ? "is-photo" : "is-drawing"}" id="stage" ${VIEWS.length > 1 ? 'tabindex="0" aria-label="Product views. Use the arrow keys or swipe to change view."' : ""}></div>
      ${VIEWS.length > 1 ? `<div class="views" role="tablist" aria-label="Views">${VIEWS.map(([k, n]) => `<button type="button" role="tab" data-v="${k}" class="${k === view ? "on" : ""}" aria-selected="${k === view}">${n}</button>`).join("")}</div>` : ""}
    </div>

    <div class="p-info">
      <span class="meta">${p.type || ""}</span>
      <h1 class="h-l">${RIO.shortName(p)}</h1>
      <p class="lead">${p.desc}</p>

      <div class="p-block">
        <span class="label">${p.finishLabel ? p.finishLabel + " colour" : "Colour"}: <b id="fin-name">${F[fin].name}</b></span>
        <div class="finishes" id="fins">${p.finishes.map((f) => swatch("data-fin", f, F[f].name, F[f].hex, f === fin)).join("")}</div>
      </div>

      ${p.variants ? `<div class="p-block">
        <span class="label">Frame: <b id="frame-name">${RIO.FRAMES[frame]}</b></span>
        <div class="finishes" id="frames">${Object.keys(p.variants).map((f) => swatch("data-frame", f, RIO.FRAMES[f], FRAME_HEX[f], f === frame)).join("")}</div>
      </div>` : ""}
      ${p.layers ? `<p class="meta mt-s">Colour preview. Final finishes may vary slightly.</p>` : ""}

      <div class="p-block" id="builder"></div>

      <dl class="facts p-block">${facts}</dl>

      <div class="p-custom">
        <span class="muted">Need a different size, colour or detail?</span>
        <a class="link" href="start.html?mode=custom">Ask for a custom piece ${ARR}</a>
      </div>
    </div>`;

  const stage = document.getElementById("stage");
  function paint() {
    if (view === "object" && p.layers) {
      // real photo with see-through colour layers on top (seat and frame)
      const L = p.layers, lyr = (g, v) => Object.keys(L[g]).map((k) => `<img class="lyr ${k === v ? "on" : ""}" data-g="${g}" data-v="${k}" src="${L[g][k]}" alt="">`).join("");
      stage.innerHTML = `<img src="${p.image}" alt="${RIO.esc(RIO.shortName(p))}">${lyr("seat", fin)}${lyr("frame", frame)}`;
    } else if (view === "object" && p.image) {
      stage.innerHTML = `<img src="${p.image}" alt="${RIO.esc(RIO.shortName(p))}">`;
    } else if (view === "object") {
      stage.innerHTML = RIO.visual(p, fin) + `<span class="meta cap">Drawing, shown in ${F[fin].name.toLowerCase()}</span>`;
    } else {
      const turn = canTurn && (view === "front" || view === "back")
        ? `<button type="button" class="turn-btn" id="turn">${view === "front" ? "See the back" : "See the front"}</button>` : "";
      stage.innerHTML = `<img src="${PH[view]}" alt="${RIO.esc(RIO.shortName(p))}, ${view} view">${turn}`;
      const t = document.getElementById("turn");
      if (t) t.onclick = () => setView(view === "front" ? "back" : "front");
    }
  }
  function setView(v) {
    view = v;
    document.querySelectorAll(".views button").forEach((x) => { const on = x.dataset.v === v; x.classList.toggle("on", on); x.setAttribute("aria-selected", on); });
    paint();
  }
  if (VIEWS.length > 1) {
    const step = (d) => { const i = VIEWS.findIndex(([k]) => k === view); setView(VIEWS[(i + d + VIEWS.length) % VIEWS.length][0]); };
    document.querySelector(".views").addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) setView(b.dataset.v); });
    // swipe on phones, arrow keys on computers
    let x0 = null;
    stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1); x0 = null; });
    stage.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
  }

  const showLayer = (g, v) => stage.querySelectorAll(`.lyr[data-g="${g}"]`).forEach((l) => l.classList.toggle("on", l.dataset.v === v));
  const mark = (box, attr, value) => box.querySelectorAll(".fin").forEach((b) => { const on = b.dataset[attr] === value; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });

  function setFin(f) {
    if (f === fin) return; fin = f;
    document.getElementById("fin-name").textContent = F[f].name;
    mark(document.getElementById("fins"), "fin", f);
    if (p.layers) showLayer("seat", f); else if (view === "object" && !p.image) paint();
  }
  document.getElementById("fins").addEventListener("click", (e) => { const b = e.target.closest("[data-fin]"); if (b) setFin(b.dataset.fin); });

  // The order goes in under the chosen frame, so the project remembers it
  const orderProduct = () => (p.variants ? RIO.product(p.variants[frame]) : p);
  const builder = () => RIO.builder(document.getElementById("builder"), orderProduct(), { onFinish: setFin });
  builder();
  const framesEl = document.getElementById("frames");
  if (framesEl) framesEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-frame]"); if (!b || b.dataset.frame === frame) return;
    frame = b.dataset.frame;
    mark(framesEl, "frame", frame);
    document.getElementById("frame-name").textContent = RIO.FRAMES[frame];
    showLayer("frame", frame);
    builder();
  });
  paint();

  const rel = RIO.PRODUCTS.filter((x) => !x.hidden && x.id !== p.id && x.spaces.some((s) => p.spaces.includes(s))).slice(0, 4);
  document.getElementById("related").innerHTML = rel.map((x) => RIO.piece(x)).join("");
  RIO.observeReveal();
})();
