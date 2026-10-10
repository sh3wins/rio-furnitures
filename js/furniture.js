/* RIO — Furniture: browse by type, filter by space */
RIO.whenReady(function () {
  let cat = RIO.qs("cat") || "all";
  let space = RIO.qs("space") || "all";
  const catEl = document.getElementById("f-cat"), spEl = document.getElementById("f-space"), list = document.getElementById("f-list");
  // Only the kinds of furniture that have something to show
  const CATS = RIO.CATEGORIES.filter((c) => RIO.PRODUCTS.some((p) => !p.hidden && p.cats.includes(c.id)));
  if (!CATS.find((c) => c.id === cat)) cat = "all";
  if (!RIO.space(space)) space = "all";

  spEl.innerHTML = `<option value="all">Any space</option>` + RIO.SPACES.map((s) => `<option value="${s.id}" ${space === s.id ? "selected" : ""}>${s.plural}</option>`).join("");
  const visible = () => RIO.PRODUCTS.filter((p) => !p.hidden && (space === "all" || p.spaces.includes(space)));
  function nav() {
    const all = visible();
    catEl.innerHTML = [["all", "All furniture", all.length]].concat(CATS.map((c) => [c.id, c.name, all.filter((p) => p.cats.includes(c.id)).length]))
      .map(([id, n, k]) => `<button type="button" class="${cat === id ? "on" : ""}" data-cat="${id}" aria-pressed="${cat === id}">${n} <span class="k">${k}</span></button>`).join("");
  }
  const custom = `
    <div class="f-custom">
      <div><h2 class="h-m">Can't find what you need?</h2><p class="mt-s">Send a sketch, a photo or measurements and we'll make it.</p></div>
      <a class="btn" href="start.html?mode=custom">Start a custom project</a>
    </div>`;
  function render() {
    const match = (p) => space === "all" || p.spaces.includes(space);
    const groups = (cat === "all" ? CATS : CATS.filter((c) => c.id === cat))
      .map((c) => ({ c, items: RIO.PRODUCTS.filter((p) => !p.hidden && p.cats.includes(c.id) && match(p)) }));
    // In "All", each product appears once, under its first category
    const seen = new Set();
    if (cat === "all") groups.forEach((g) => { g.items = g.items.filter((p) => !seen.has(p.id) && seen.add(p.id)); });
    const shown = groups.filter((g) => g.items.length);
    // "All furniture" is one plain list; a chosen type gets its own heading
    const count = (n) => `${n} ${n === 1 ? "piece" : "pieces"}`;
    const where = space === "all" ? "" : " for " + RIO.space(space).plural.toLowerCase();
    const one = cat === "all" && shown.length ? [{ c: { name: "All furniture" + where }, items: shown.reduce((a, g) => a.concat(g.items), []) }] : shown;
    list.innerHTML = (one.map((g) => `
      <section class="f-group">
        <h2 class="h-m f-group-head">${g.c.name}${cat === "all" ? "" : where} <span class="k">${count(g.items.length)}</span></h2>
        <div class="cards">${g.items.map((p) => RIO.piece(p)).join("")}</div>
      </section>`).join("") || `<section class="f-group"><p class="lead">Nothing listed for that space yet.</p></section>`) +
      `<p class="shot-note">Photographed as made, in our Nairobi workshop and at customers' spaces. Prices are quoted on your quantities.</p>` + custom;
    RIO.observeReveal(list);
    const q = new URLSearchParams();
    if (cat !== "all") q.set("cat", cat); if (space !== "all") q.set("space", space);
    history.replaceState(null, "", "furniture.html" + (q.toString() ? "?" + q : ""));
  }
  catEl.addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { cat = b.dataset.cat; nav(); render(); } });
  spEl.addEventListener("change", () => { space = spEl.value; nav(); render(); });
  nav(); render();
});
