/* RIO — product page
   In order: the picture, the name, what it is, colours, how many, add to project. */
RIO.whenReady(function () {
  const F = RIO.FINISHES, ARR = RIO.ARR;
  const p = RIO.product(RIO.qs("id")) || RIO.PRODUCTS[0];
  document.title = RIO.shortName(p) + " | RIO Furnitures, Nairobi, Kenya";

  // Extra photo views, if the product has them: photos: { front, back, side, detail, material }
  const PH = Object.assign({}, p.photos || {});
  if (PH.rear && !PH.back) PH.back = PH.rear;
  let PHOTO_VIEWS = [["front", "Front"], ["back", "Back"], ["side", "Side"], ["detail", "Detail"], ["material", "Material"]].filter(([k]) => PH[k]);
  let VIEWS = PHOTO_VIEWS.length ? PHOTO_VIEWS.concat(p.image ? [["object", "Photo"]] : []) : [];
  // Pieces posted from the admin have a plain set of photos: 1, 2, 3…
  const gallery = p.gallery && p.gallery.length > 1 ? p.gallery : null;
  if (gallery) { gallery.forEach((src, i) => (PH["g" + i] = src)); PHOTO_VIEWS = VIEWS = gallery.map((src, i) => ["g" + i, "Photo " + (i + 1)]); }
  const canTurn = !!(PH.front && PH.back);
  let fin = p.finishes[0], view = gallery ? "g0" : PH.front ? "front" : "object";

  const cat = RIO.category(p.cats[0]);
  document.getElementById("crumbs").innerHTML =
    `<a href="furniture.html">Furniture</a><span>/</span><a href="furniture.html?cat=${cat.id}">${cat.name}</a><span>/</span><span class="ink">${RIO.esc(RIO.shortName(p))}</span>`;

  const fact = (label, value) => value ? `<div><dt>${label}</dt><dd>${value}</dd></div>` : "";
  const facts = fact("Dimensions", p.dims) + fact("Materials", p.materials) + fact("Lead time", p.lead) +
    fact("Price", p.price ? RIO.kes(p.price) + `<span class="meta price-note">Prices change with the market. Your quote confirms the price.</span>` : "") +   // no price set = no price row
    fact("Made for", p.spaces.map((s) => `<a class="link" href="spaces.html?space=${s}">${RIO.space(s).plural}</a>`).join(" &nbsp; "));

  document.getElementById("prod").innerHTML = `
    <div class="p-stage-wrap">
      <div class="p-stage ${p.image || PHOTO_VIEWS.length ? "is-photo" : "is-drawing"}" id="stage" ${VIEWS.length > 1 ? 'tabindex="0" aria-label="Product views. Use the arrow keys or swipe to change view."' : ""}></div>
      ${VIEWS.length > 1 ? `<div class="views" role="tablist" aria-label="Views">${VIEWS.map(([k, n]) => `<button type="button" role="tab" data-v="${k}" class="${k === view ? "on" : ""}" aria-selected="${k === view}">${n}</button>`).join("")}</div>` : ""}
    </div>

    <div class="p-info">
      <span class="meta">${RIO.esc(p.type || "")}</span>
      <h1 class="h-l">${RIO.esc(RIO.shortName(p))}</h1>
      <p class="lead">${RIO.esc(p.desc)}</p>

      <div class="p-block" id="builder"></div>

      <dl class="facts p-block">${facts}</dl>

      <div class="p-custom">
        <span class="muted">Need a different size, colour or detail?</span>
        <a class="link" href="start.html?mode=custom">Ask for a custom piece ${ARR}</a>
      </div>
    </div>`;

  const stage = document.getElementById("stage");
  function paint() {
    if (view === "object" && p.image) {
      stage.innerHTML = `<img src="${p.image}" alt="${RIO.esc(RIO.shortName(p))}">`;
    } else if (view === "object") {
      stage.innerHTML = RIO.visual(p, fin) + `<span class="meta cap">Drawing, shown in ${F[fin].name.toLowerCase()}</span>`;
    } else {
      const turn = canTurn && (view === "front" || view === "back")
        ? `<button type="button" class="turn-btn" id="turn">${view === "front" ? "See the back" : "See the front"}</button>` : "";
      stage.innerHTML = `<img src="${PH[view]}" alt="${RIO.esc(RIO.shortName(p))}${gallery ? "" : ", " + view + " view"}">${turn}`;
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

  // Touching a colour's quantity shows the drawing in that colour
  function setFin(f) {
    if (f === fin) return; fin = f;
    if (view === "object" && !p.image) paint();
  }
  RIO.builder(document.getElementById("builder"), p, { onFinish: setFin });
  paint();

  const rel = RIO.PRODUCTS.filter((x) => !x.hidden && x.id !== p.id && x.spaces.some((s) => p.spaces.includes(s))).slice(0, 4);
  document.getElementById("related").innerHTML = rel.map((x) => RIO.piece(x)).join("");
  RIO.observeReveal();
});
